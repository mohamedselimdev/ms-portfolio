// Google Search Console ownership file. Served by a route because static .html assets get redirected to extensionless URLs.
export function GET() {
  return new Response("google-site-verification: google65eb8aabf6b97728.html", {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
