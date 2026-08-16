import hljs from "highlight.js/lib/core";
import java from "highlight.js/lib/languages/java";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import http from "highlight.js/lib/languages/http";
import sql from "highlight.js/lib/languages/sql";

hljs.registerLanguage("java", java);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("http", http);
hljs.registerLanguage("sql", sql);

const aliases: Record<string, string> = {
  java: "java",
  yaml: "yaml",
  yml: "yaml",
  xml: "xml",
  html: "html",
  markup: "html",
  http: "http",
  sql: "sql",
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

export function inferLang(code: string, hint?: string, path?: string): string | undefined {
  const fromHint = hint ? aliases[hint.toLowerCase()] : undefined;
  if (fromHint) return fromHint;

  const file = (path ?? "").toLowerCase();
  if (file.endsWith(".java")) return "java";
  if (file.endsWith(".yml") || file.endsWith(".yaml")) return "yaml";
  if (file.endsWith(".xml")) return "xml";
  if (file.endsWith(".html")) return "html";

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

function highlightJava(code: string): string {
  let i = 0;
  let out = "";
  const n = code.length;

  while (i < n) {
    const ch = code[i];

    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      out += ch;
      i += 1;
      continue;
    }

    if (ch === "/" && code[i + 1] === "/") {
      const start = i;
      i += 2;
      while (i < n && code[i] !== "\n") i += 1;
      out += span("hljs-comment", code.slice(start, i));
      continue;
    }

    if (ch === "/" && code[i + 1] === "*") {
      const start = i;
      i += 2;
      while (i < n && !(code[i] === "*" && code[i + 1] === "/")) i += 1;
      i = Math.min(n, i + 2);
      out += span("hljs-comment", code.slice(start, i));
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
      out += span("hljs-string", code.slice(start, i));
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
      out += span("hljs-string", code.slice(start, i));
      continue;
    }

    if (ch === "@" && /[A-Za-z_]/.test(code[i + 1] ?? "")) {
      const start = i;
      i += 1;
      while (i < n && /[A-Za-z0-9_]/.test(code[i])) i += 1;
      out += span("hljs-meta", code.slice(start, i));
      continue;
    }

    if (/[0-9]/.test(ch)) {
      const start = i;
      while (i < n && /[0-9a-fA-FxXlL._]/.test(code[i])) i += 1;
      out += span("hljs-number", code.slice(start, i));
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      const start = i;
      i += 1;
      while (i < n && /[A-Za-z0-9_$]/.test(code[i])) i += 1;
      const ident = code.slice(start, i);
      const call = nextNonSpace(code, i) === "(";

      if (JAVA_LITERALS.has(ident)) {
        out += span("hljs-literal", ident);
      } else if (JAVA_KEYWORDS.has(ident)) {
        out += span("hljs-keyword", ident);
      } else if (/^[A-Z]/.test(ident)) {
        out += span("hljs-type", ident);
      } else if (call) {
        out += span("tok-method", ident);
      } else {
        out += span("tok-variable", ident);
      }
      continue;
    }

    out += span("hljs-punctuation", ch);
    i += 1;
  }

  return out;
}

export function highlightCode(code: string, lang?: string): string {
  if (lang === "java") return highlightJava(code);
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
  }
  return escapeHtml(code);
}
