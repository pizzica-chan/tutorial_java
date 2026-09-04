import { Fragment } from "react";
import { cheatSheet, cheatSheetAnchors, type CheatRow } from "../data/cheatsheet";
import { TextWithTerms, TermHighlightScope } from "../components/TextWithTerms";
import { ArticleToc } from "../components/ArticleToc";
import { useHashTarget } from "../hooks/useHashTarget";
import type { HeadingEntry } from "../lib/headings";

function cheatSheetHeadings(anchors: ReturnType<typeof cheatSheetAnchors>): HeadingEntry[] {
  const result: HeadingEntry[] = [];
  cheatSheet.forEach((section, sectionIndex) => {
    result.push({ id: anchors[sectionIndex].sectionId, text: section.title, level: 2 });
    section.groups.forEach((group, groupIndex) => {
      result.push({ id: anchors[sectionIndex].groupIds[groupIndex], text: group.title, level: 3 });
    });
  });
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
  useHashTarget();
  const anchors = cheatSheetAnchors();
  const headings = cheatSheetHeadings(anchors);

  return (
    <div className="lesson-layout">
      <div className="content">
        <TermHighlightScope>
          <p className="kicker">CHEAT SHEET</p>
          <h1 className="serif page-title">チートシート</h1>
          <p className="lede">
            <TextWithTerms text="実務でよく組み合わせる、応用的なコマンドの早見表です。コマンド自体の説明はここではしません。" />
          </p>

          {cheatSheet.map((section, sectionIndex) => (
            <Fragment key={section.id}>
              <h2 className="serif" id={anchors[sectionIndex].sectionId}>
                {section.title}
              </h2>
              {section.groups.map((group, groupIndex) => (
                <Fragment key={groupIndex}>
                  <h3 id={anchors[sectionIndex].groupIds[groupIndex]}>{group.title}</h3>
                  {group.note ? (
                    <p className="cheat-note">
                      <TextWithTerms text={group.note} />
                    </p>
                  ) : null}
                  <CheatTable rows={group.rows} />
                </Fragment>
              ))}
            </Fragment>
          ))}
        </TermHighlightScope>
      </div>
      <ArticleToc headings={headings} />
    </div>
  );
}
