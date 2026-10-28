import { Fragment } from "react";
import { eclipseSections } from "../data/eclipse";
import { ArticleToc } from "../components/ArticleToc";
import { TextWithTerms, TermHighlightScope } from "../components/TextWithTerms";
import { useHashTarget } from "../hooks/useHashTarget";
import type { HeadingEntry } from "../lib/headings";

const headings: HeadingEntry[] = [
  ...eclipseSections.flatMap((section) => [
    { id: section.id, text: section.title, level: 2 as const },
    ...section.tips.map((tip) => ({ id: tip.id, text: tip.name, level: 4 as const })),
  ]),
  { id: "official-guides", text: "公式の操作ガイド", level: 2 },
];

export function EclipsePage() {
  useHashTarget();

  return (
    <div className="lesson-layout">
      <div className="content">
        <TermHighlightScope>
          <p className="kicker">ECLIPSE</p>
          <h1 className="serif page-title">Eclipse 便利機能集</h1>
          <p className="lede">
            <TextWithTerms text="既存の Java Web アプリを読むときや、調査・修正するときに使う Eclipse の機能をまとめました。やりたいことから、操作と使いどころを引けます。" />
          </p>
          <p className="cheat-note">
            Windows の標準キー設定と、Java 開発機能（JDT）が入った Eclipse を前提にしています。
            日本語の機能名に英語名を添えていますが、日本語化やバージョンによって表示は変わります。
            キーの割り当てが違うときは、Ctrl+Shift+L または設定の「一般 → キー」で確認しましょう。
          </p>

          {eclipseSections.map((section) => (
            <Fragment key={section.id}>
              <h2 className="serif" id={section.id}>{section.title}</h2>
              <p><TextWithTerms text={section.intro} /></p>
              <div className="table-wrap">
                <table className="devtools-table">
                  <thead>
                    <tr>
                      <th scope="col">やりたいこと</th>
                      <th scope="col">操作</th>
                      <th scope="col">使いどころ・確認すること</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.tips.map((tip) => (
                      <tr key={tip.id} id={tip.id}>
                        <td data-label="やりたいこと"><TextWithTerms text={tip.name} /></td>
                        <td data-label="操作"><TextWithTerms text={tip.how} /></td>
                        <td data-label="使いどころ・確認すること">
                          <ul className="devtools-check">
                            {tip.detail.map((text) => (
                              <li key={text}><TextWithTerms text={text} /></li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Fragment>
          ))}

          <h2 className="serif" id="official-guides">公式の操作ガイド</h2>
          <p>操作やキーの割り当ては、Eclipse の公式ヘルプでも確認できます。</p>
          <ul>
            {eclipseSections.map((section) => (
              <li key={section.id}><a href={section.source.href}>{section.source.title}</a></li>
            ))}
            <li><a href="https://help.eclipse.org/latest/topic/org.eclipse.jdt.doc.user/reference/ref-keybindings.htm">Eclipse Help：List of JDT Key Bindings</a></li>
            <li><a href="https://help.eclipse.org/latest/topic/org.eclipse.jdt.doc.user/reference/ref-menu-refactor.htm">Eclipse Help：Refactor Actions</a></li>
          </ul>
        </TermHighlightScope>
      </div>
      <ArticleToc headings={headings} />
    </div>
  );
}
