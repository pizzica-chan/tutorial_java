import { highlightCode, inferLang } from "../lib/highlight";

type Props = {
  code: string;
  lang?: string;
  title?: string;
  path?: string;
};

export function CodeBlock({ code, lang, title, path }: Props) {
  const resolved = inferLang(code, lang, path);
  const html = highlightCode(code, resolved);

  return (
    <div className="codeblock">
      <header>
        <span>{title ?? path ?? "code"}</span>
        <span>{resolved ?? ""}</span>
      </header>
      <pre>
        <code className={resolved ? `language-${resolved}` : undefined} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
