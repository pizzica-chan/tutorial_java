import { Fragment, type ComponentType } from "react";
import type { Block, CalloutKind, WidgetName } from "../types";
import { QuizBlock } from "./QuizBlock";
import { ProjectExplorer } from "./ProjectExplorer";
import { RequestFlow } from "./RequestFlow";
import { StackLab } from "./StackLab";
import { HttpInspector } from "./HttpInspector";
import { TermHighlightScope, TextWithTerms } from "./TextWithTerms";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./Diagram";
import { Icon, calloutIcon } from "./Icon";

const widgets: Record<WidgetName, ComponentType> = {
  explorer: ProjectExplorer,
  flow: RequestFlow,
  stack: StackLab,
  http: HttpInspector,
};

export function Article({ blocks }: { blocks: Block[] }) {
  const occurrences = new Map<string, number>();
  const keyedBlocks = blocks.map((block) => {
    const content = JSON.stringify(block);
    const occurrence = occurrences.get(content) ?? 0;
    occurrences.set(content, occurrence + 1);
    return { block, key: `${content}:${occurrence}` };
  });

  return (
    <TermHighlightScope>
      <div className="article">
        {keyedBlocks.map(({ block, key }) => (
          <BlockView key={key} block={block} />
        ))}
      </div>
    </TermHighlightScope>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <TextWithTerms text={block.text} />
        </p>
      );
    case "h2":
      return (
        <h2>
          <TextWithTerms text={block.text} />
        </h2>
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
      return <CodeBlock code={block.code} lang={block.lang} title={block.title} />;
    case "callout":
      return (
        <div className={`callout ${block.kind}`}>
          <b className="callout-kind">
            <Icon name={calloutIcon(block.kind)} size={18} />
            {label(block.kind)}
          </b>
          <div>
            <strong>
              <TextWithTerms text={block.title} />
            </strong>
            <p style={{ margin: "6px 0 0" }}>
              <TextWithTerms text={block.text} />
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
      return (
        <figure className={block.kind === "screen" ? "photo-figure screen-figure" : "photo-figure"}>
          <img src={block.src} alt={block.alt} loading="lazy" />
          {block.caption ? (
            <figcaption>
              <TextWithTerms text={block.caption} />
            </figcaption>
          ) : null}
        </figure>
      );
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
              {block.rows.map((row, rowIndex) => (
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
              ))}
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
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

function label(kind: CalloutKind) {
  if (kind === "warn") return "注意";
  if (kind === "trap") return "落とし穴";
  if (kind === "note") return "補足";
  return "ヒント";
}
