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
    <p className="td-heading">申請くん：入力欄と送られる値</p>
    <div className="form-submit-head" aria-hidden="true">
      <span><Icon name="code" size={18} />入力欄</span>
      <span><Icon name="send" size={18} />送られる値</span>
    </div>
    <FormField
      source={<><small>件名</small><code>{'<input name="title">'}</code><span>入力した値：交通費申請</span></>}
      target={<code>title=交通費申請</code>}
    />
    <FormField
      source={<><small>承認者</small><code>{'<select name="approverId">'}</code><span>選んだ項目：佐藤花子（<code>value</code> は 3）</span></>}
      target={<><code>approverId=3</code><small>画面の名前ではなく、<code>value</code> が送られる</small></>}
    />
    <FormField
      source={<><small>CSRF トークン</small><code>{'<input type="hidden" name="_csrf">'}</code><span>値：HTML にはじめから入っている</span></>}
      target={<code>_csrf=8f3a…</code>}
    />
    <p className="td-footnote">HTML は、ブラウザに届いたものを短くして示しています。</p>
  </div>;
}

export function FormRedirect() {
  const steps = [
    { method: "POST", detail: "/shinsei/requests", isCode: true, browser: "提出", server: "申請を登録", response: false },
    { method: "302", detail: "Location: http://localhost:8080/shinsei/requests", isCode: true, browser: "一覧の URL を受け取る", server: "", response: true },
    { method: "GET", detail: "/shinsei/requests", isCode: true, browser: "一覧を要求", server: "一覧を取得", response: false },
    { method: "200", detail: "一覧の HTML", isCode: false, browser: "一覧を表示", server: "", response: true },
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
        {step.isCode ? <code>{step.detail}</code> : <span>{step.detail}</span>}
        <i className="form-redirect-wire" aria-hidden="true" />
      </div>
      <span className="form-redirect-end">{step.server}</span>
    </li>)}</ol>
    <p className="td-footnote">1 と 3 は別のリクエストです。</p>
  </div>;
}
