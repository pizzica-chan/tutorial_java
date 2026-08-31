import { ProjectExplorer } from "../components/ProjectExplorer";
import { RequestFlow } from "../components/RequestFlow";
import { StackLab } from "../components/StackLab";
import { HttpInspector } from "../components/HttpInspector";
import { QuizBlock } from "../components/QuizBlock";
import { TermHighlightScope, TextWithTerms } from "../components/TextWithTerms";

export function LabPage() {
  return (
    <TermHighlightScope>
      <div className="content lab-page">
      <p className="kicker">LAB</p>
      <h1 className="serif page-title">ラボ</h1>
      <p className="lede">
        <TextWithTerms text="ラボはいつでも利用できます。通読後の復習にも使えます。HTTP、ソース、リクエストの区間、スタックトレースを、本文に近い順で確認できます。" />
      </p>

      <h2 className="serif">1. HTTP</h2>
      <p>
        <TextWithTerms text="申請一覧を開いたときのリクエストとレスポンスです。HTTP メソッド、Cookie、`Content-Type`、本文。" />
      </p>
      <HttpInspector />

      <h2 className="serif">2. ソースツリー</h2>
      <p>主要ファイルの役割です。</p>
      <ProjectExplorer />

      <h2 className="serif">3. リクエスト追跡</h2>
      <p>
        <TextWithTerms text="一覧表示が、ブラウザから DB を往復して HTML になるまで。" />
      </p>
      <RequestFlow />

      <h2 className="serif">4. スタックトレース</h2>
      <p>
        <TextWithTerms text="at 行の右端が、ソースの位置です。`RequestService.java:48` なら、そのファイルの 48 行目を見ましょう。この教材の申請くんのスタック例は、実ファイルの行番号と一致しています。" />
      </p>
      <p>
        <TextWithTerms text="`org.springframework` や `java.` で始まる行は、自分たちが書いたコードではありません。申請くんなら、パッケージ名 `jp.co.example.shinsei` で始まる行を、上から最初に見つけたところから調べましょう。" />
      </p>
      <StackLab />

      <h2 className="serif">5. 総合確認</h2>
      <p>入口の次に追うもの、スタックトレース、ログ、Java アプリの層をまとめて確認します。</p>
      <QuizBlock id="trace-start" />
      <QuizBlock id="ts-npe" />
      <QuizBlock id="ts-own-class" />
      <QuizBlock id="ts-log" />
      <QuizBlock id="java-layer" />
      </div>
    </TermHighlightScope>
  );
}
