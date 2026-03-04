export default function Stars({ value = 0, count = 0 }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const full = Math.floor(v);
  const half = v - full >= 0.5;

  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "★";
    if (i === full && half) return "⯪"; // meia (simples)
    return "☆";
  }).join("");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 14 }}>{stars}</span>
      <span style={{ fontSize: 12, color: "#666" }}>
        {v.toFixed(1)} {count ? `(${count})` : ""}
      </span>
    </div>
  );
}