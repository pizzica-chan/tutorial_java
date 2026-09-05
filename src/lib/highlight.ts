import hljs from "highlight.js/lib/core";
import java from "highlight.js/lib/languages/java";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import http from "highlight.js/lib/languages/http";
import sql from "highlight.js/lib/languages/sql";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import nginx from "highlight.js/lib/languages/nginx";
import gradle from "highlight.js/lib/languages/gradle";
import { lookupTerm, type TermDef } from "../data/terms";

hljs.registerLanguage("java", java);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("http", http);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);
hljs.registerLanguage("nginx", nginx);
hljs.registerLanguage("gradle", gradle);

const aliases: Record<string, string> = {
  java: "java",
  yaml: "yaml",
  yml: "yaml",
  xml: "xml",
  html: "html",
  markup: "html",
  http: "http",
  sql: "sql",
  javascript: "javascript",
  js: "javascript",
  json: "json",
  css: "css",
  nginx: "nginx",
  gradle: "gradle",
};

const JAVA_KEYWORDS = new Set([
  "abstract",
  "assert",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extends",
  "final",
  "finally",
  "float",
  "for",
  "goto",
  "if",
  "implements",
  "import",
  "instanceof",
  "int",
  "interface",
  "long",
  "native",
  "new",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "strictfp",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "try",
  "void",
  "volatile",
  "while",
  "record",
  "var",
  "yield",
]);

const JAVA_LITERALS = new Set(["true", "false", "null"]);

export type JavaTokenKind =
  | "plain"
  | "comment"
  | "guide"
  | "string"
  | "annotation"
  | "number"
  | "keyword"
  | "literal"
  | "type"
  | "method"
  | "variable"
  | "punctuation";

export type JavaToken = {
  kind: JavaTokenKind;
  text: string;
  term?: TermDef;
};

export function javaTokenClass(kind: JavaTokenKind): string | undefined {
  switch (kind) {
    case "comment":
      return "hljs-comment";
    case "guide":
      return "tok-guide";
    case "string":
      return "hljs-string";
    case "annotation":
      return "hljs-meta";
    case "number":
      return "hljs-number";
    case "keyword":
      return "hljs-keyword";
    case "literal":
      return "hljs-literal";
    case "type":
      return "hljs-type";
    case "method":
      return "tok-method";
    case "variable":
      return "tok-variable";
    case "punctuation":
      return "hljs-punctuation";
    default:
      return undefined;
  }
}

export function inferLang(code: string, hint?: string, path?: string): string | undefined {
  // 明示された lang は、認識できる別名が無くてもそのまま使う（中身の推測で上書きしない）
  if (hint) return aliases[hint.toLowerCase()] ?? hint.toLowerCase();

  const file = (path ?? "").toLowerCase();
  if (file.endsWith(".java")) return "java";
  if (file.endsWith(".yml") || file.endsWith(".yaml")) return "yaml";
  if (file.endsWith(".xml")) return "xml";
  if (file.endsWith(".html")) return "html";
  if (file.endsWith(".js")) return "javascript";
  if (file.endsWith(".css")) return "css";

  const trimmed = code.trim();
  if (/^(GET|POST|PUT|DELETE|PATCH|HEAD|HTTP\/)\b/i.test(trimmed)) return "http";
  if (/^(SELECT|UPDATE|INSERT|DELETE)\b/i.test(trimmed)) return "sql";
  if (trimmed.startsWith("<")) return "xml";
  if (
    trimmed.startsWith("@") ||
    /\b(public|private|protected|class|return|void)\b/.test(trimmed)
  ) {
    return "java";
  }
  return undefined;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function span(cls: string, value: string): string {
  return `<span class="${cls}">${escapeHtml(value)}</span>`;
}

function nextNonSpace(code: string, index: number): string | undefined {
  let i = index;
  while (i < code.length && (code[i] === " " || code[i] === "\t")) i += 1;
  return code[i];
}

export function tokenizeJava(code: string): JavaToken[] {
  const tokens: JavaToken[] = [];
  let i = 0;
  const n = code.length;

  while (i < n) {
    const ch = code[i];

    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      tokens.push({ kind: "plain", text: ch });
      i += 1;
      continue;
    }

    if (ch === "/" && code[i + 1] === "/") {
      const start = i;
      i += 2;
      while (i < n && code[i] !== "\n") i += 1;
      const text = code.slice(start, i);
      tokens.push({
        kind: text.startsWith("// →") ? "guide" : "comment",
        text,
      });
      continue;
    }

    if (ch === "/" && code[i + 1] === "*") {
      const start = i;
      i += 2;
      while (i < n && !(code[i] === "*" && code[i + 1] === "/")) i += 1;
      i = Math.min(n, i + 2);
      tokens.push({ kind: "comment", text: code.slice(start, i) });
      continue;
    }

    if (ch === '"') {
      const start = i;
      i += 1;
      while (i < n && code[i] !== '"') {
        if (code[i] === "\\") i += 1;
        i += 1;
      }
      if (i < n) i += 1;
      tokens.push({ kind: "string", text: code.slice(start, i) });
      continue;
    }

    if (ch === "'") {
      const start = i;
      i += 1;
      while (i < n && code[i] !== "'") {
        if (code[i] === "\\") i += 1;
        i += 1;
      }
      if (i < n) i += 1;
      tokens.push({ kind: "string", text: code.slice(start, i) });
      continue;
    }

    if (ch === "@" && /[A-Za-z_]/.test(code[i + 1] ?? "")) {
      const start = i;
      i += 1;
      while (i < n && /[A-Za-z0-9_]/.test(code[i])) i += 1;
      const text = code.slice(start, i);
      tokens.push({ kind: "annotation", text, term: lookupTerm(text) });
      continue;
    }

    if (/[0-9]/.test(ch)) {
      const start = i;
      while (i < n && /[0-9a-fA-FxXlL._]/.test(code[i])) i += 1;
      tokens.push({ kind: "number", text: code.slice(start, i) });
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      const start = i;
      i += 1;
      while (i < n && /[A-Za-z0-9_$]/.test(code[i])) i += 1;
      const ident = code.slice(start, i);
      const call = nextNonSpace(code, i) === "(";

      if (JAVA_LITERALS.has(ident)) {
        tokens.push({ kind: "literal", text: ident });
      } else if (JAVA_KEYWORDS.has(ident)) {
        tokens.push({ kind: "keyword", text: ident });
      } else if (/^[A-Z]/.test(ident)) {
        tokens.push({ kind: "type", text: ident });
      } else if (call) {
        tokens.push({ kind: "method", text: ident });
      } else {
        tokens.push({ kind: "variable", text: ident });
      }
      continue;
    }

    tokens.push({ kind: "punctuation", text: ch });
    i += 1;
  }

  return tokens;
}

export function highlightJava(code: string): string {
  return tokenizeJava(code)
    .map((token) => {
      const cls = javaTokenClass(token.kind);
      return cls ? span(cls, token.text) : escapeHtml(token.text);
    })
    .join("");
}

export function highlightCode(code: string, lang?: string): string {
  if (lang === "java") return highlightJava(code);
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
  }
  return escapeHtml(code);
}

/**
 * ハイライト済み HTML を行ごとに割ります。hljs の言語（http など）は前後の行を見て
 * 判定するため、1行ずつ highlightCode を呼ぶと本文（HTML/JSON の中身）の色分けが消えます。
 * 全体を1回でハイライトしてから割り、行をまたいだ <span> は閉じて次行で開き直します。
 */
function splitHighlightedIntoLines(html: string): string[] {
  const lines: string[] = [];
  const openTags: string[] = [];
  let current = "";
  let i = 0;
  while (i < html.length) {
    if (html[i] === "\n") {
      lines.push(current + "</span>".repeat(openTags.length));
      current = openTags.join("");
      i += 1;
      continue;
    }
    if (html.startsWith("</span>", i)) {
      openTags.pop();
      current += "</span>";
      i += 7;
      continue;
    }
    const tagMatch = /^<span[^>]*>/.exec(html.slice(i));
    if (tagMatch) {
      openTags.push(tagMatch[0]);
      current += tagMatch[0];
      i += tagMatch[0].length;
      continue;
    }
    current += html[i];
    i += 1;
  }
  lines.push(current);
  return lines;
}

export function highlightCodeLines(code: string, lang: string | undefined, highlightLines: number[]): string {
  if (lang === "java") {
    return code
      .split("\n")
      .map((line, index) => {
        const lineNo = index + 1;
        const highlighted = line ? highlightJava(line) : "&nbsp;";
        const mark = highlightLines.includes(lineNo);
        return `<span class="code-line${mark ? " code-line-mark" : ""}">${highlighted}</span>`;
      })
      .join("");
  }

  const full =
    lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value : escapeHtml(code);
  return splitHighlightedIntoLines(full)
    .map((lineHtml, index) => {
      const lineNo = index + 1;
      const mark = highlightLines.includes(lineNo);
      return `<span class="code-line${mark ? " code-line-mark" : ""}">${lineHtml || "&nbsp;"}</span>`;
    })
    .join("");
}
