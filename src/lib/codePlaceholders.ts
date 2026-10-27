/**
 * コードスパン（`...`）の中で、実際の値に置き換える語。チートシートを含む全ページで使う。
 * 出てきたら、そのまま太字＋色で目立たせる（記号は足さない）。
 * 英字の語 1 つだけのスパンは、字面どおりの語（`lsof` の出力の列名 `PID` など）と区別できないので強調しない。
 */
export const PLACEHOLDER_WORDS = [
  "PID",
  "TID",
  "URL",
  "ホスト名",
  "ユーザ名",
  "コンテナ名",
  "Pod名",
  "名前空間名",
  "コミットハッシュ",
  "リビジョン番号",
  "ポート番号",
  "行番号",
  "サービス名",
  "サービス名の一部",
  "テーブル名",
  "カラム名",
  "ファイル名",
  "ディレクトリ名",
  "文字列",
  "コマンド",
  "名前",
  "パス",
  "値",
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 長い語を先に試さないと、「サービス名の一部」が「サービス名」だけに、「名前空間名」が「名前」だけにマッチしてしまう
const PLACEHOLDER_PATTERN = new RegExp(
  `((?<![A-Za-z0-9_])(?:${[...PLACEHOLDER_WORDS].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})(?![A-Za-z0-9_]))`,
);

const PLACEHOLDER_LATIN_ALONE = /^[A-Za-z]+$/;
const JAPANESE_CHAR = /[぀-ヿ一-鿿]/;

/**
 * コードスパンの中身を、置き換える語とそれ以外に分ける。
 * 一覧に無い日本語が混ざるスパン（access.log の書式 `IP - - [日時] "メソッド パス バージョン"` など）は、
 * コマンドではなく書式や説明なので、一部の語だけを強調しない。
 */
export function splitByPlaceholders(code: string): Array<{ placeholder: boolean; value: string }> {
  const asIs = [{ placeholder: false, value: code }];
  if (PLACEHOLDER_LATIN_ALONE.test(code)) return asIs;
  const segments = code.split(PLACEHOLDER_PATTERN).filter((segment) => segment !== "");
  if (segments.some((segment) => !PLACEHOLDER_WORDS.includes(segment) && JAPANESE_CHAR.test(segment))) return asIs;
  return segments.map((segment) => ({ placeholder: PLACEHOLDER_WORDS.includes(segment), value: segment }));
}

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
