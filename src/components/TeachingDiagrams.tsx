import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

function Card({ icon, title, children, tone = "blue" }: {
  icon: IconName; title: string; children?: ReactNode; tone?: "blue" | "green";
}) {
  return <div className={`td-card td-${tone}`}>
    <strong className="td-title"><Icon name={icon} size={20} />{title}</strong>
    {children}
  </div>;
}

function Connector({ children }: { children: ReactNode }) {
  return <div className="td-connector"><span aria-hidden="true">↓</span>{children}</div>;
}

export function Mapping() {
  const parts = [
    { label: "コンテキストパス", value: "/shinsei", source: "server.servlet.context-path=/shinsei", note: "アプリの設定", icon: "server" as const },
    { label: "クラスのパス", value: "/requests", source: '@RequestMapping("/requests")', note: "RequestController", icon: "file" as const },
    { label: "Java メソッドのパス", value: "/12", source: '@GetMapping("/{id:[0-9]+}")', note: "detail：数字の部分を id で受け取る", icon: "code" as const },
  ];
  return <div className="teaching-diagram">
    <p className="td-heading">URL のどの部分を、どこで決めるか</p>
    <div className="td-url"><span className="td-method">GET</span>{parts.map((part, index) =>
      <code key={part.value} className={`td-part td-part-${index}`}>{part.value}<small>{index + 1}</small></code>
    )}</div>
    <div className="td-mapping-grid">{parts.map((part, index) =>
      <div className={`td-mapping-part td-part-${index}`} key={part.value}>
        <span className="td-mapping-link" aria-hidden="true">↑</span>
        <Card icon={part.icon} title={`${index + 1}　${part.label}`}>
          <code>{part.source}</code><small>{part.note}</small>
        </Card>
      </div>
    )}</div>
    <div className="td-result"><Icon name="inbox" size={20} /><span>このリクエストの処理の入口：<code>RequestController.detail</code></span></div>
  </div>;
}

export function PageAssets() {
  return <div className="teaching-diagram">
    <p className="td-heading">1 つの画面でも、ファイルごとに HTTP の往復がある</p>
    <Card icon="browser" title="1　最初に HTML を取得する">
      <code>GET /shinsei/requests</code>
      <span className="td-inline-result"><Icon name="file" size={18} />レスポンス：HTML</span>
    </Card>
    <Connector>2　ブラウザが HTML 内の参照を読む</Connector>
    <div className="td-branch-grid">{[
      { file: "app.css", role: "色・レイアウト", icon: "file" as const },
      { file: "app.js", role: "共通の JavaScript", icon: "braces" as const },
      { file: "list.js", role: "一覧の JavaScript", icon: "braces" as const },
    ].map((asset) => <Card key={asset.file} icon={asset.icon} title={asset.file} tone="green">
      <span>追加のリクエスト → ファイルを受信</span><small>{asset.role}</small>
    </Card>)}</div>
    <p className="td-footnote">申請一覧の例。キャッシュなどにより、毎回すべてを取得するとは限りません。</p>
  </div>;
}

export function Layers() {
  const layers: { icon: IconName; name: string; role: string; example: string }[] = [
    { icon: "inbox", name: "Controller", role: "リクエストを受ける", example: "URL に対応する Java メソッド" },
    { icon: "cog", name: "Service", role: "業務の処理を行う", example: "呼ばれた Java メソッドの中身" },
    { icon: "file", name: "Repository / Mapper", role: "DB とやり取りする", example: "SQL と、渡している値" },
    { icon: "database", name: "DB", role: "データを取得・更新する", example: "対象のテーブルとレコード" },
  ];
  return <div className="teaching-diagram">
    <p className="td-heading">画面の URL から、呼び出し先を順に辿る例</p>
    <div className="td-start"><Icon name="browser" size={20} />画面の URL・HTTP メソッド</div>
    <Connector>対応する処理を探す</Connector>
    <ol className="td-timeline">{layers.map((layer, index) => <li key={layer.name}>
      <span className="td-number">{index + 1}</span>
      <Card icon={layer.icon} title={layer.name} tone={index === 3 ? "green" : "blue"}>
        <span>{layer.role}</span>
      </Card>
      <div className="td-check"><span>確認するもの</span><strong>{layer.example}</strong></div>
    </li>)}</ol>
    <p className="td-footnote">層の分け方はアプリによって違います。実際の呼び出し先を辿りましょう。</p>
  </div>;
}

export function Filters() {
  return <div className="teaching-diagram">
    <p className="td-heading">Controller より手前で処理が止まることがある</p>
    <div className="td-start"><Icon name="globe" size={20} />リクエスト</div>
    <Connector>Spring Security のフィルタへ</Connector>
    <div className="td-boundary">
      <span className="td-boundary-label">Filter Chain：確認する順序の例</span>
      <div className="td-filter-row">
        <Card icon="shield" title="CSRF の確認"><span>トークンが必要なリクエストか、値が正しいか</span></Card>
        <div className="td-stop"><span>→ 不正な場合</span><strong>ここで応答して終了</strong></div>
      </div>
      <Connector>処理を続ける場合</Connector>
      <div className="td-filter-row">
        <Card icon="lock" title="ログイン・権限の確認"><span>このリクエストを許可できるか</span></Card>
        <div className="td-stop"><span>→ 許可しない場合</span><strong>ここで応答して終了</strong></div>
      </div>
    </div>
    <Connector>後続のフィルタも通過した場合</Connector>
    <Card icon="inbox" title="Controller" tone="green"><span>対応する Java メソッドを実行する</span></Card>
  </div>;
}

export function ArchRoles() {
  return <div className="teaching-diagram">
    <p className="td-heading">リクエストの経路と、Java アプリが動く場所</p>
    <div className="td-start"><Icon name="browser" size={20} />ブラウザ</div>
    <Connector>HTTP / HTTPS リクエスト</Connector>
    <div className="td-branch-grid td-two td-routes">
      <div className="td-route-option"><span className="td-route-label">HTTP サーバを置く構成</span>
        <Card icon="server" title="Apache / nginx"><span>リクエストを受けて中継する</span></Card>
      </div>
      <div className="td-route-option td-direct"><span className="td-route-label">HTTP サーバを置かない構成</span>
        <Icon name="route" size={28} /><span>サーブレットコンテナへ直接送る</span>
      </div>
    </div>
    <Connector>どちらかの経路で、サーブレットコンテナへ</Connector>
    <div className="td-boundary td-container">
      <strong className="td-title"><Icon name="box" size={22} />サーブレットコンテナ：Tomcat / Jetty</strong>
      <span>この中で Java アプリが動く</span>
      <Card icon="inbox" title="アプリ" tone="green"><span>Controller 以降の処理</span></Card>
    </div>
  </div>;
}

export function NPlusOne() {
  return <div className="teaching-diagram">
    <p className="td-heading">1 回の一覧取得から、1,000 回の追加 SQL が発生する例</p>
    <Card icon="database" title="一覧を取得する SELECT：1 回"><span>1,000 件の申請レコードを取得</span></Card>
    <Connector>各申請の承認者を、1 件ずつ追加で取得</Connector>
    <div className="td-repeat">{["1 件目", "2 件目", "…", "1,000 件目"].map((label) =>
      label === "…" ? <span className="td-ellipsis" key={label} aria-label="途中を省略">…</span> :
      <div className="td-repeat-item" key={label}><span>{label}の申請</span><span aria-hidden="true">↓</span><code>SELECT</code><small>承認者を取得</small></div>
    )}</div>
    <div className="td-equation"><span><b>1</b>一覧取得</span><i>＋</i><span><b>1,000</b>追加取得（N 回）</span><i>＝</i><span className="td-total"><b>1,001 回</b>SQL の実行</span></div>
    <p className="td-footnote">SQL ログでは、同じ形の SELECT がパラメータを変えて繰り返されます。</p>
  </div>;
}
