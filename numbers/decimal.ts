export function format(n: number, fixed?: number): string {
  const s = typeof fixed === "number" ? n.toFixed(fixed) : n.toString();
  const parts = s.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
