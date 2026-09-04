import { Fragment } from "react";
import { cheatSheet, type CheatRow } from "../data/cheatsheet";
import { TextWithTerms, TermHighlightScope } from "../components/TextWithTerms";
import { ArticleToc } from "../components/ArticleToc";
import type { HeadingEntry } from "../lib/headings";

function extractCheatHeadings(): HeadingEntry[] {
  const result: HeadingEntry[] = [];
  let index = 0;
  for (const section of cheatSheet) {
    result.push({ id: `h-${index}`, text: section.title, level: 2 });
    index += 1;
    for (const group of section.groups) {
      if (group.title) {
        result.push({ id: `h-${index}`, text: group.title, level: 3 });
        index += 1;
      }
    }
  }
  return result;
}

function CheatTable({ rows }: { rows: CheatRow[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>コマンド</th>
            <th>環境</th>
            <th>すること</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                {row.cmd.split("\n").map((line, lineIndex) => (
                  <Fragment key={lineIndex}>
                    {lineIndex > 0 ? <br /> : null}
                    <TextWithTerms text={line} />
                  </Fragment>
                ))}
              </td>
              <td>{row.env}</td>
              <td>
                <TextWithTerms text={row.desc} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CheatSheetPage() {
  const headings = extractCheatHeadings();
  let headingIndex = 0;

  return (
    <div className="lesson-layout">
      <div className="content">
        <TermHighlightScope>
          <p className="kicker">CHEAT SHEET</p>
          <h1 className="serif page-title">チートシート</h1>
          <p className="lede">
            <TextWithTerms text="実務でよく組み合わせる、応用的なコマンドの早見表です。コマンド自体の説明はここではしません。" />
          </p>

          {cheatSheet.map((section) => {
            const sectionId = `h-${headingIndex}`;
            headingIndex += 1;
            return (
              <Fragment key={section.id}>
                <h2 className="serif" id={sectionId}>
                  {section.title}
                </h2>
                {section.groups.map((group, index) => {
                  const groupId = group.title ? `h-${headingIndex}` : undefined;
                  if (group.title) headingIndex += 1;
                  return (
                    <Fragment key={index}>
                      {group.title ? <h3 id={groupId}>{group.title}</h3> : null}
                      {group.note ? (
                        <p className="cheat-note">
                          <TextWithTerms text={group.note} />
                        </p>
                      ) : null}
                      <CheatTable rows={group.rows} />
                    </Fragment>
                  );
                })}
              </Fragment>
            );
          })}
        </TermHighlightScope>
      </div>
      <ArticleToc headings={headings} />
    </div>
  );
}
