import { highlightCode, highlightCodeLines, inferLang } from "../lib/highlight";
import { JavaCode } from "./JavaCode";

type Props = {
  code: string;
  lang?: string;
  title?: string;
  path?: string;
  codeScope?: "fragment-common" | "fragment-individual";
  highlightLines?: number[];
};

export function CodeBlock({ code, lang, title, path, codeScope, highlightLines }: Props) {
  const resolved = inferLang(code, lang, path);
  const html =
    resolved === "java"
      ? undefined
      : highlightLines?.length && resolved
        ? highlightCodeLines(code, resolved, highlightLines)
        : highlightCode(code, resolved);

  return (
    <div className={`codeblock${codeScope ? ` codeblock-${codeScope}` : ""}`}>
      <header>
        <span>{title ?? path ?? "code"}</span>
        <span>{resolved ?? ""}</span>
      </header>
      <pre>
        {resolved === "java" ? (
          <code className="language-java">
            <JavaCode code={code} />
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
