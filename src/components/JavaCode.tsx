import { tokenizeJava, javaTokenClass, type JavaToken } from "../lib/highlight";
import { TermMark } from "./TermMark";

function TokenView({ token }: { token: JavaToken }) {
  if (token.kind === "annotation" && token.term) {
    return (
      <TermMark
        def={token.term}
        text={token.text}
        className={`${javaTokenClass(token.kind)} code-term`}
      />
    );
  }

  const cls = javaTokenClass(token.kind);
  if (cls) {
    return <span className={cls}>{token.text}</span>;
  }

  return <span>{token.text}</span>;
}

function splitLines(tokens: JavaToken[]): JavaToken[][] {
  const lines: JavaToken[][] = [[]];
  for (const token of tokens) {
    if (token.text === "\r") continue;
    if (token.text === "\n") {
      lines.push([]);
      continue;
    }
    const parts = token.text.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ ...token, text: part });
    });
  }
  return lines;
}

export function JavaCode({ code, highlightLines }: { code: string; highlightLines?: number[] }) {
  const tokens = tokenizeJava(code);
  if (!highlightLines?.length) {
    return (
      <>
        {tokens.map((token, index) => (
          <TokenView key={index} token={token} />
        ))}
      </>
    );
  }

  const lines = splitLines(tokens);
  const marks = new Set(highlightLines);

  return (
    <>
      {lines.map((lineTokens, index) => {
        const lineNo = index + 1;
        const marked = marks.has(lineNo);
        return (
          <span key={lineNo} className={`code-line${marked ? " code-line-mark" : ""}`}>
            {lineTokens.length
              ? lineTokens.map((token, tokenIndex) => (
                  <TokenView key={tokenIndex} token={token} />
                ))
              : "\u00a0"}
          </span>
        );
      })}
    </>
  );
}
