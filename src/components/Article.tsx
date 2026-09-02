import { Fragment, type ComponentType } from "react";
import { Link } from "react-router-dom";
import type { Block, CalloutKind, WidgetName } from "../types";
import { QuizBlock } from "./QuizBlock";
import { ProjectExplorer } from "./ProjectExplorer";
import { RequestFlow } from "./RequestFlow";
import { StackLab } from "./StackLab";
import { HttpInspector } from "./HttpInspector";
import { TroubleshootMap } from "./TroubleshootMap";
import { TermHighlightScope, TextWithTerms } from "./TextWithTerms";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./Diagram";
import { InvestigationFlow } from "./InvestigationFlow";
import { Icon, calloutIcon } from "./Icon";
import { ImageFigure } from "./ImageFigure";

const widgets: Record<WidgetName, ComponentType> = {
  explorer: ProjectExplorer,
  flow: RequestFlow,
  stack: StackLab,
  http: HttpInspector,
  "troubleshoot-map": TroubleshootMap,
};

export function Article({ blocks }: { blocks: Block[] }) {
  const occurrences = new Map<string, number>();
  let headingIndex = 0;
  const keyedBlocks = blocks.map((block) => {
    const content = JSON.stringify(block);
    const occurrence = occurrences.get(content) ?? 0;
    occurrences.set(content, occurrence + 1);
    let headingId: string | undefined;
    if (block.type === "h2" || block.type === "h3") {
      headingId = `h-${headingIndex}`;
      headingIndex += 1;
    }
    return { block, key: `${content}:${occurrence}`, headingId };
  });

  return (
    <TermHighlightScope>
      <div className="article">
        {keyedBlocks.map(({ block, key, headingId }) => (
          <BlockView key={key} block={block} headingId={headingId} />
        ))}
      </div>
    </TermHighlightScope>
  );
}

function BlockView({ block, headingId }: { block: Block; headingId?: string }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          {block.link ? <LinkedText text={block.text} link={block.link} /> : <TextWithTerms text={block.text} />}
        </p>
      );
    case "h2":
      return (
        <h2 id={headingId}>
          <TextWithTerms text={block.text} linkChapters={false} />
        </h2>
      );
    case "h3":
      return (
        <h3 id={headingId}>
          <TextWithTerms text={block.text} linkChapters={false} />
        </h3>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`}>
              <TextWithTerms text={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`}>
              <TextWithTerms text={item} />
            </li>
          ))}
        </ol>
      );
    case "code":
      return (
        <CodeBlock
          code={block.code}
          lang={block.lang}
          title={block.title}
          codeScope={block.codeScope}
          highlightLines={block.highlightLines}
          highlightKind={block.highlightKind}
        />
      );
    case "callout":
      return (
        <div className={`callout ${block.kind}`}>
          <b className="callout-kind">
            <Icon name={calloutIcon(block.kind)} size={18} />
            {label(block.kind)}
          </b>
          <div>
            {block.title ? (
              <strong>
                <TextWithTerms text={block.title} />
              </strong>
            ) : null}
            <p style={{ margin: block.title ? "6px 0 0" : 0 }}>
              {block.text.split("\n").map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {lineIndex > 0 ? <br /> : null}
                  <TextWithTerms text={line} />
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      );
    case "quiz":
      return <QuizBlock id={block.id} />;
    case "widget": {
      const Widget = widgets[block.name];
      return <Widget />;
    }
    case "diagram":
      return <Diagram name={block.name} caption={block.caption} />;
    case "figure":
      return <ImageFigure src={block.src} alt={block.alt} caption={block.caption} kind={block.kind} size={block.size} />;
    case "table":
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header}>
                    <TextWithTerms text={header} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.length > 0 ? (
                block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                        {cell.split("\n").map((line, lineIndex) => (
                          <Fragment key={lineIndex}>
                            {lineIndex > 0 ? <br /> : null}
                            <TextWithTerms text={line} />
                          </Fragment>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={block.headers.length} className="table-empty">
                    <TextWithTerms text={block.empty ?? "0 行"} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    case "steps":
      return (
        <div className="step-list">
          {block.items.map((item, index) => (
            <div className="step-row" key={item.title}>
              <span className="tag">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>
                  <TextWithTerms text={item.title} />
                </strong>
                <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>
                  <TextWithTerms text={item.text} />
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    case "investigation-flow":
      return <InvestigationFlow items={block.items} />;
    case "download":
      return (
        <p className="download-block">
          <a className="btn btn-primary" href={block.href} download>
            <Icon name="package" size={16} />
            {block.label}
          </a>
          {block.note ? (
            <span className="download-note">
              <TextWithTerms text={block.note} />
            </span>
          ) : null}
        </p>
      );
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

function LinkedText({ text, link }: { text: string; link: { label: string; to: string } }) {
  const index = text.indexOf(link.label);
  if (index < 0) return <TextWithTerms text={text} />;

  const before = text.slice(0, index);
  const after = text.slice(index + link.label.length);
  return (
    <>
      <TextWithTerms text={before} />
      <Link className="chapter-ref" to={link.to}>
        {link.label}
      </Link>
      <TextWithTerms text={after} />
    </>
  );
}

function label(kind: CalloutKind) {
  if (kind === "warn") return "注意";
  if (kind === "trap") return "落とし穴";
  if (kind === "note") return "補足";
  if (kind === "scenario") return "シナリオ";
  return "ヒント";
}
