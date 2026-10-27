import type { ReactNode } from "react";
import { Icon } from "./Icon";

function FormField({ source, target }: { source: ReactNode; target: ReactNode }) {
  return <div className="form-submit-row">
    <div className="form-submit-source">{source}</div>
    <span className="form-submit-arrow" aria-hidden="true">→</span>
    <div className="form-submit-target">{target}</div>
  </div>;
}

export function FormSubmission() {
  return <div className="teaching-diagram form-submit">
    <p className="td-heading">申請くん：HTML と送信内容の対応</p>
    <div className="form-submit-head" aria-hidden="true">
      <span><Icon name="code" size={18} />HTML・入力した値</span>
      <span><Icon name="send" size={18} />送信するリクエスト</span>
    </div>
    <FormField
      source={<><small>送信先</small><code>{'th:action="@{/requests}"'}</code></>}
      target={<><small>URL（コンテキストパスを含む）</small><code>/shinsei/requests</code></>}
    />
    <FormField
      source={<><small>HTTP メソッドの指定</small><code>{'method="post"'}</code></>}
      target={<><small>HTTP メソッド</small><strong>POST</strong></>}
    />
    <div className="form-submit-body">
      <p className="form-submit-body-label">ここから下は本文に載る値（デコードした表示）</p>
      <FormField
        source={<><small>件名</small><code>{'name="title"'}</code><span>入力：交通費申請</span></>}
        target={<><small><code>name</code> がキー、入力した内容が値</small><code>title=交通費申請</code></>}
      />
      <FormField
        source={<><small>承認者</small><code>{'name="approverId"'}</code><span>表示：佐藤花子</span><small>選んだ <code>option</code> の値</small><code>{'value="3"'}</code></>}
        target={<><small>選んだ <code>option</code> の <code>value</code> を送る</small><code>approverId=3</code><span>送るのは名前ではなく ID</span></>}
      />
      <FormField
        source={<><small>hidden（画面には出ない）</small><code>{'type="hidden" name="_csrf"'}</code></>}
        target={<><small>hidden の値も本文に載る</small><code>_csrf=8f3a…</code></>}
      />
    </div>
    <p className="td-footnote">hidden はブラウザへ届いた HTML の例です。トークンの値は省略し、<code>_csrf</code> は 1 つだけ示しています。</p>
  </div>;
}

export function FormRedirect() {
  const steps = [
    { method: "POST", detail: "/shinsei/requests", browser: "提出", server: "申請を登録", response: false },
    { method: "302", detail: "Location: /shinsei/requests", browser: "一覧の URL を受け取る", server: "", response: true },
    { method: "GET", detail: "/shinsei/requests", browser: "一覧を要求", server: "一覧を取得", response: false },
    { method: "200", detail: "一覧の HTML", browser: "一覧を表示", server: "", response: true },
  ];
  return <div className="teaching-diagram form-redirect">
    <p className="td-heading">申請くん：提出してから一覧が表示されるまで</p>
    <div className="form-redirect-head">
      <span><Icon name="browser" size={22} />ブラウザ</span>
      <span><Icon name="server" size={22} />サーバ</span>
    </div>
    <ol className="form-redirect-steps">{steps.map((step, index) => <li key={index} className={step.response ? "is-response" : undefined}>
      <span className="form-redirect-end">{step.browser}</span>
      <div className="form-redirect-transfer">
        <span className="form-redirect-label"><b>{index + 1}</b><strong>{step.method}</strong><small>{step.response ? "サーバ → ブラウザ" : "ブラウザ → サーバ"}</small></span>
        {index === 3 ? <span>{step.detail}</span> : <code>{step.detail}</code>}
        <i className="form-redirect-wire" aria-hidden="true" />
      </div>
      <span className="form-redirect-end">{step.server}</span>
    </li>)}</ol>
    <p className="td-footnote">1 と 3 は別のリクエストです。一覧の表示後に再読み込みすると、3 の GET がもう一度送られます。</p>
  </div>;
}
