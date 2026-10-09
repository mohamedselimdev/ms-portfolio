// Usage: npm run set-admin-password
// Asks for the admin password (hidden), hashes it with PBKDF2 and uploads the hash as the
// ADMIN_PASSWORD_HASH secret of the `portfolio` Cloudflare Worker. The password never touches disk.
import { webcrypto as crypto } from "node:crypto";
import { spawn } from "node:child_process";
import readline from "node:readline";

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : "*");
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const password = await askHidden("New admin password (min 10 chars): ");
if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}
const again = await askHidden("Repeat password: ");
if (again !== password) {
  console.error("Passwords do not match.");
  process.exit(1);
}

const iterations = 100000;
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
const hex = (b) => Buffer.from(b).toString("hex");
const hash = `pbkdf2:${iterations}:${hex(salt)}:${hex(bits)}`;

const child = spawn("npx", ["wrangler", "secret", "put", "ADMIN_PASSWORD_HASH", "--name", "portfolio"], {
  stdio: ["pipe", "inherit", "inherit"],
  shell: process.platform === "win32",
});
child.stdin.end(hash);
child.on("exit", (code) => process.exit(code ?? 1));
