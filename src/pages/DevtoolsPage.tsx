import { Fragment } from "react";
import { Link } from "react-router-dom";
import { devtools, devtoolsAnchors, type DevtoolsLookupRow, type DevtoolsTipRow } from "../data/devtools";
import { TextWithTerms, TermHighlightScope } from "../components/TextWithTerms";
import { ArticleToc } from "../components/ArticleToc";
import { useHashTarget } from "../hooks/useHashTarget";
import type { HeadingEntry } from "../lib/headings";

function devtoolsHeadings(anchors: ReturnType<typeof devtoolsAnchors>): HeadingEntry[] {
  const result: HeadingEntry[] = [];
  devtools.forEach((section, sectionIndex) => {
    result.push({ id: anchors[sectionIndex].sectionId, text: section.title, level: 2 });
    section.groups.forEach((group, groupIndex) => {
      result.push({ id: anchors[sectionIndex].groupIds[groupIndex], text: group.title, level: 3 });
    });
  });
  return result;
}

function LookupTable({ rows }: { rows: DevtoolsLookupRow[] }) {
  return (
    <div className="table-wrap">
      <table className="devtools-table">
        <thead>
          <tr>
            <th>症状</th>
            <th className="devtools-tool">使う機能</th>
            <th>確認すること</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td data-label="症状">
                <TextWithTerms text={row.symptom} />
              </td>
              <td className="devtools-tool" data-label="使う機能">
                <TextWithTerms text={row.tool} />
              </td>
              <td data-label="確認すること">
                <ul className="devtools-check">
                  {row.check.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <TextWithTerms text={item} />
                    </li>
                  ))}
                </ul>
                {row.links?.length ? (
                  <span className="devtools-links">
                    {row.links.map((link) => (
                      <Link key={link.to} to={link.to}>
                        {link.label}
                      </Link>
                    ))}
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TipTable({ rows }: { rows: DevtoolsTipRow[] }) {
  return (
    <div className="table-wrap">
      <table className="devtools-table">
        <thead>
          <tr>
            <th>機能</th>
            <th>場所・操作</th>
            <th>できること</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td data-label="機能">
                <TextWithTerms text={row.name} />
              </td>
              <td data-label="場所・操作">
                <TextWithTerms text={row.how} />
              </td>
              <td data-label="できること">
                <TextWithTerms text={row.desc} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DevtoolsPage() {
  useHashTarget();
  const anchors = devtoolsAnchors();
  const headings = devtoolsHeadings(anchors);

  return (
    <div className="lesson-layout">
      <div className="content">
        <TermHighlightScope>
          <p className="kicker">DEVTOOLS</p>
          <h1 className="serif page-title">開発者ツールの Tips</h1>
          <p className="lede">
            <TextWithTerms text="ブラウザの開発者ツールで、調査に使える機能をまとめました。前半は症状から引く表、後半はタブごとの一覧です。" />
          </p>
          <p className="cheat-note">
            <TextWithTerms text="Chrome の英語表示の名前で書いています。Edge もほぼ同じです。日本語表示では、Preserve log が「ログを保持」のように名前が変わります。ショートカットは Windows のものです。Mac では Ctrl を Cmd に読み替えてください。そのまま読み替えられないものは、表に書いています。" />
          </p>

          {devtools.map((section, sectionIndex) => (
            <Fragment key={section.id}>
              <h2 className="serif" id={anchors[sectionIndex].sectionId}>
                {section.title}
              </h2>
              {section.kind === "lookup" ? (
                <p>
                  <TextWithTerms text="原因がクライアント・ネットワーク・サーバのどれに近いかの当たりをつけたいときは、先に「症状から探す」を使いましょう。ここでは、症状を確かめるために、開発者ツールのどの機能を使うかを引きます。" />
                </p>
              ) : null}
              {section.kind === "lookup"
                ? section.groups.map((group, groupIndex) => (
                    <Fragment key={groupIndex}>
                      <h3 id={anchors[sectionIndex].groupIds[groupIndex]}>{group.title}</h3>
                      {group.note ? (
                        <p className="cheat-note">
                          <TextWithTerms text={group.note} />
                        </p>
                      ) : null}
                      <LookupTable rows={group.rows} />
                    </Fragment>
                  ))
                : section.groups.map((group, groupIndex) => (
                    <Fragment key={groupIndex}>
                      <h3 id={anchors[sectionIndex].groupIds[groupIndex]}>{group.title}</h3>
                      {group.note ? (
                        <p className="cheat-note">
                          <TextWithTerms text={group.note} />
                        </p>
                      ) : null}
                      <TipTable rows={group.rows} />
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
