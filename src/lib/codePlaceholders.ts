/** ハイライト済み HTML の文字部分だけを処理し、置き換える語を強調する。 */
export function markCodePlaceholders(html: string, words: string[]): string {
  if (words.length === 0) return html;
  const escapeHtml = (value: string) => value
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const aliases = [...words].sort((a, b) => b.length - a.length)
    .filter(Boolean)
    .map((word) => escapeHtml(word).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (aliases.length === 0) return html;
  const pattern = new RegExp(`(?<![A-Za-z0-9_])(?:${aliases.join("|")})(?![A-Za-z0-9_])`, "g");
  return html.split(/(<[^>]*>)/g).map((part) => part.startsWith("<") ? part :
    part.replace(pattern, '<span class="cheat-placeholder">$&</span>')).join("");
}
