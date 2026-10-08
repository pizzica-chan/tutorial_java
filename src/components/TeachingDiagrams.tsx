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

export function PageAssets() {
  return <div className="teaching-diagram">
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
      <small>{asset.role}</small>
    </Card>)}</div>
    <p className="td-footnote">申請一覧の例。キャッシュなどにより、毎回すべてを取得するとは限りません。</p>
  </div>;
}

export function Layers() {
  const layers: { icon: IconName; name: string; role: string }[] = [
    { icon: "inbox", name: "Controller", role: "受け口" },
    { icon: "cog", name: "Service", role: "ビジネスロジック" },
    { icon: "file", name: "Repository / Mapper", role: "永続化" },
    { icon: "database", name: "DB", role: "SQL" },
  ];
  return <div className="teaching-diagram">
    <ol className="td-timeline">
      <li>
        <span className="td-number td-origin-marker" aria-hidden="true" />
        <Card icon="browser" title="画面 / URL" />
      </li>
      {layers.map((layer, index) => <li key={layer.name}>
      <span className="td-number">{index + 1}</span>
      <Card icon={layer.icon} title={layer.name} tone={index === 3 ? "green" : "blue"}>
        <span>{layer.role}</span>
      </Card>
    </li>)}</ol>
  </div>;
}

export function ProcessThreads() {
  return <div className="teaching-diagram">
    <div className="td-boundary">
      <span className="td-boundary-label"><Icon name="server" size={18} />1 つの Java プロセス（例）</span>
      <div className="td-branch-grid td-two">
        <Card icon="route" title="スレッド A">
          <span>山田の一覧表示</span>
          <span>Controller → Service → Mapper</span>
        </Card>
        <Card icon="route" title="スレッド B" tone="green">
          <span>佐藤の申請登録</span>
          <span>Controller → Service → Mapper</span>
        </Card>
      </div>
      <p className="td-heading">同じ Controller や Service のインスタンスを使うことがある</p>
    </div>
  </div>;
}

export function ThreadPool() {
  const threads = [
    { name: "nio-8080-exec-1", work: "山田の一覧表示" },
    { name: "nio-8080-exec-2", work: "佐藤の申請登録" },
    { name: "nio-8080-exec-3", work: "鈴木の詳細表示" },
  ];
  return <div className="teaching-diagram">
    <p className="td-heading">リクエストを処理するスレッドが、すべて使用中の例</p>
    <div className="td-boundary">
      <span className="td-boundary-label"><Icon name="server" size={18} />Tomcat のリクエスト処理スレッド（3 つに減らした例）</span>
      <ul className="td-thread-list">{threads.map((thread) => <li key={thread.name}>
        <code>{thread.name}</code>
        <span>{thread.work}</span>
        <small>処理中</small>
      </li>)}</ul>
    </div>
    <Connector>どれかのスレッドが空くまで</Connector>
    <div className="td-wait"><Icon name="clock" size={20} /><span>新しく届いたリクエストは待たされる</span></div>
  </div>;
}

export function SharedField() {
  const steps: { thread: string; text: ReactNode; bad?: boolean }[] = [
    { thread: "exec-1（山田）", text: <>フィールド <code>currentKeyword</code> に「出張」を入れる</>, bad: true },
    { thread: "exec-2（佐藤）", text: <>同じ <code>currentKeyword</code> を「備品」で上書きする</> },
    { thread: "exec-1（山田）", text: <><code>currentKeyword</code> を読んで SQL に渡す → 条件は「備品」</> },
  ];
  return <div className="teaching-diagram">
    <p className="td-heading"><span className="td-bad-label">悪い例</span>リクエストごとの値をフィールドに保存すると、別のスレッドに上書きされる</p>
    <div className="td-branch-grid td-two">
      <Card icon="route" title="スレッド exec-1（山田）">
        <span>引数 <code>keyword</code> = 出張</span>
      </Card>
      <Card icon="route" title="スレッド exec-2（佐藤）">
        <span>引数 <code>keyword</code> = 備品</span>
      </Card>
    </div>
    <Connector>どちらも同じインスタンスを使う</Connector>
    <Card icon="cog" title="SearchService（インスタンスは 1 つ）" tone="green">
      <div className="td-bad-point">
        <span className="td-bad-label">悪い点</span>
        <span>リクエストごとの値（検索条件）を、フィールド <code>currentKeyword</code> に保存している</span>
      </div>
      <small>引数 <code>keyword</code> をそのまま Mapper へ渡せば、ほかのスレッドに上書きされない</small>
    </Card>
    <ol className="td-timeline td-shared-steps">{steps.map((step, index) => <li key={index}>
      <span className={step.bad ? "td-number td-number-bad" : "td-number"}>{index + 1}</span>
      <div><small>{step.thread}</small><span>{step.text}</span></div>
    </li>)}</ol>
  </div>;
}

export function ThreadReuse() {
  return <div className="teaching-diagram">
    <p className="td-heading">同じスレッドが、続けて別のリクエストを処理する例</p>
    <div className="td-boundary td-lane">
      <span className="td-lane-name"><Icon name="route" size={18} />スレッド <code>nio-8080-exec-3</code></span>
      <div className="td-lane-track">
        <div className="td-lane-task"><small>04:12:03</small><strong>山田の検索</strong><code>user=7</code></div>
        <span className="td-lane-gap">終わったら次へ</span>
        <div className="td-lane-task"><small>04:12:05</small><strong>佐藤の検索</strong><code>user=3</code></div>
      </div>
    </div>
  </div>;
}

export function DbTransaction() {
  return <div className="teaching-diagram">
    <Card icon="database" title="処理前の DB">
      <span>申請の状態：承認待ち</span>
      <span>承認履歴：無い</span>
    </Card>
    <Connector>同じ状態から、2 つの場合を比べる</Connector>
    <div className="td-branch-grid td-two">
      <div className="td-tx-case">
        <p className="td-case-label">SQL がすべて成功した場合</p>
        <div className="td-boundary">
          <span className="td-boundary-label">1 つのトランザクション</span>
          <Card icon="database" title="① 申請の状態を更新する">
            <span>承認待ち → 承認済み</span>
            <small>この時点では、まだ確定していない</small>
          </Card>
          <Connector>次の SQL も成功</Connector>
          <Card icon="file" title="② 承認履歴を追加する">
            <span>履歴のレコードを 1 件追加</span>
          </Card>
          <Connector>コミット：両方の変更を確定</Connector>
        </div>
        <Connector>DB に残る結果</Connector>
        <Card icon="check" title="両方の変更が残る" tone="green">
          <span>申請の状態：承認済み</span>
          <span>承認履歴：1 件ある</span>
        </Card>
      </div>
      <div className="td-tx-case">
        <p className="td-case-label">途中の SQL が失敗した場合</p>
        <div className="td-boundary">
          <span className="td-boundary-label">1 つのトランザクション</span>
          <Card icon="database" title="① 申請の状態を更新する">
            <span>承認待ち → 承認済み</span>
            <small>この時点では、まだ確定していない</small>
          </Card>
          <Connector>次の SQL が失敗</Connector>
          <Card icon="warn" title="② 承認履歴を追加できない">
            <span>例外が起きて、処理を中止</span>
          </Card>
          <Connector>ロールバック：① の変更も取り消す</Connector>
        </div>
        <Connector>DB に残る結果</Connector>
        <Card icon="database" title="処理前の状態に戻る">
          <span>申請の状態：承認待ち</span>
          <span>承認履歴：無い</span>
        </Card>
      </div>
    </div>
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
    <Connector>関連する利用者の情報を、1 件ずつ追加で取得</Connector>
    <div className="td-repeat">{["1 件目", "2 件目", "…", "1,000 件目"].map((label) =>
      label === "…" ? <span className="td-ellipsis" key={label} aria-label="途中を省略">…</span> :
      <div className="td-repeat-item" key={label}><span>{label}の申請</span><span aria-hidden="true">↓</span><code>SELECT</code><small>利用者情報を取得</small></div>
    )}</div>
    <div className="td-equation"><span><b>1</b>一覧取得</span><i>＋</i><span><b>1,000</b>追加取得（N 回）</span><i>＝</i><span className="td-total"><b>1,001 回</b>SQL の実行</span></div>
    <p className="td-footnote">SQL ログでは、同じ形の SELECT がパラメータを変えて繰り返されます。</p>
  </div>;
}
