/** Renders `*text*` segments with the brand highlight, e.g. "Selected *Projects*". */
export function Highlight({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? (
          <span key={i} className="text-highlight">
            {p.slice(1, -1)}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
