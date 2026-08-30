import { highlightCode, highlightCodeLines, inferLang } from "../lib/highlight";
import { JavaCode } from "./JavaCode";

type Props = {
  code: string;
  lang?: string;
  title?: string;
  path?: string;
  codeScope?: "fragment-common" | "fragment-individual";
  highlightLines?: number[];
  highlightKind?: "error";
};

export function CodeBlock({ code, lang, title, path, codeScope, highlightLines, highlightKind }: Props) {
  const resolved = inferLang(code, lang, path);
  const html =
    resolved === "java"
      ? undefined
      : highlightLines?.length
        ? highlightCodeLines(code, resolved, highlightLines)
        : highlightCode(code, resolved);

  const markClass = highlightKind === "error" ? " codeblock-mark-error" : "";

  return (
    <div className={`codeblock${codeScope ? ` codeblock-${codeScope}` : ""}${markClass}`}>
      <header>
        <span>{title ?? path ?? "code"}</span>
        <span>{resolved ?? ""}</span>
      </header>
      <pre>
        {resolved === "java" ? (
          <code className="language-java">
            <JavaCode code={code} highlightLines={highlightLines} />
          </code>
        ) : (
          <code
            className={resolved ? `language-${resolved}` : undefined}
            dangerouslySetInnerHTML={{ __html: html ?? "" }}
          />
        )}
      </pre>
    </div>
  );
}
