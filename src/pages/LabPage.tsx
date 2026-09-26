import { ProjectExplorer } from "../components/ProjectExplorer";
import { RequestFlow } from "../components/RequestFlow";
import { StackLab } from "../components/StackLab";
import { HttpInspector } from "../components/HttpInspector";
import { QuizBlock } from "../components/QuizBlock";
import { ArticleToc } from "../components/ArticleToc";
import { TermHighlightScope, TextWithTerms } from "../components/TextWithTerms";
import { useHashTarget } from "../hooks/useHashTarget";
import type { HeadingEntry } from "../lib/headings";

const headings: HeadingEntry[] = [
  { id: "h-0", text: "1. HTTP", level: 2 },
  { id: "h-1", text: "2. ソースツリー", level: 2 },
  { id: "h-2", text: "3. リクエスト追跡", level: 2 },
  { id: "h-3", text: "4. スタックトレース", level: 2 },
  { id: "h-4", text: "5. 総合確認", level: 2 },
];

export function LabPage() {
  useHashTarget();

  return (
    <div className="lesson-layout">
      <TermHighlightScope>
        <div className="content lab-page">
        <p className="kicker">LAB</p>
        <h1 className="serif page-title">ラボ</h1>
        <p className="lede">
          <TextWithTerms text="ラボはいつでも利用できます。通読後の復習にも使えます。HTTP、ソース、リクエストの区間、スタックトレースを、本文に近い順で確認できます。" />
        </p>

        <h2 className="serif" id={headings[0].id}>{headings[0].text}</h2>
        <p>
          <TextWithTerms text="申請一覧を開いたときのリクエストとレスポンスです。HTTP メソッド、Cookie、`Content-Type`、本文。" />
        </p>
        <HttpInspector />

        <h2 className="serif" id={headings[1].id}>{headings[1].text}</h2>
        <p>主要ファイルの役割です。</p>
        <ProjectExplorer />

        <h2 className="serif" id={headings[2].id}>{headings[2].text}</h2>
        <p>
          <TextWithTerms text="一覧表示が、ブラウザから DB を往復して HTML になるまで。" />
        </p>
        <RequestFlow />

        <h2 className="serif" id={headings[3].id}>{headings[3].text}</h2>
        <p>
          <TextWithTerms text="at 行の右端が、ソースの位置です。`RequestService.java:48` なら、そのファイルの 48 行目を見ましょう。この教材の申請くんのスタック例は、実ファイルの行番号と一致しています。" />
        </p>
        <p>
          <TextWithTerms text="`org.springframework` や `java.` で始まる行は、自分たちが書いたコードではありません。申請くんなら、パッケージ名 `jp.co.example.shinsei` で始まる行を、上から最初に見つけたところから調べましょう。" />
        </p>
        <StackLab />

        <h2 className="serif" id={headings[4].id}>{headings[4].text}</h2>
        <p>スタックトレース、ログ、Java アプリの層をまとめて確認します。</p>
        <QuizBlock id="ts-npe" />
        <QuizBlock id="ts-own-class" />
        <QuizBlock id="ts-log" />
        <QuizBlock id="java-layer" />
        </div>
      </TermHighlightScope>
      <ArticleToc headings={headings} />
    </div>
  );
}
