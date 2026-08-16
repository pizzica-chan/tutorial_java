import { ProjectExplorer } from "../components/ProjectExplorer";
import { RequestFlow } from "../components/RequestFlow";
import { StackLab } from "../components/StackLab";
import { HttpInspector } from "../components/HttpInspector";
import { QuizBlock } from "../components/QuizBlock";
import { TermScope, TextWithTerms } from "../components/TextWithTerms";

export function LabPage() {
  return (
    <TermScope>
      <div className="content lab-page">
      <p className="kicker">LAB</p>
      <h1 className="serif" style={{ fontSize: 42 }}>ラボ</h1>
      <p className="lede">
        <TextWithTerms text="申請くんのファイル構成、HTTP、リクエスト区間、スタックトレースを、教材の順と独立して確認できます。" />
      </p>

      <h2 className="serif">1. ソースツリー</h2>
      <p>主要ファイルの役割です。</p>
      <ProjectExplorer />

      <h2 className="serif">2. HTTP</h2>
      <p>
        <TextWithTerms text="承認時のリクエストとレスポンスです。メソッド、Cookie、リダイレクト、CSRF。" />
      </p>
      <HttpInspector />

      <h2 className="serif">3. リクエスト追跡</h2>
      <p>
        <TextWithTerms text="一覧表示が、ブラウザから DB を往復して HTML になるまで。" />
      </p>
      <RequestFlow />

      <h2 className="serif">4. スタックトレース</h2>
      <p>
        <TextWithTerms text="at 行の右端が、ソースの位置です。RequestService.java:41 なら、そのファイルの 41 行目を見ます。" />
      </p>
      <p>
        <TextWithTerms text="org.springframework や java. で始まる行は、自分たちが書いたコードではありません。申請くんなら jp.co.example で始まる行を、上から最初に見つけたところから調べます。" />
      </p>
      <StackLab />

      <h2 className="serif">5. 確認</h2>
      <QuizBlock id="trace-start" />
      <QuizBlock id="ts-npe" />
      <QuizBlock id="ts-own-class" />
      <QuizBlock id="ts-log" />
      <QuizBlock id="java-layer" />
      </div>
    </TermScope>
  );
}
