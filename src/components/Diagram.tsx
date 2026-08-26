import type { ReactElement, ReactNode } from "react";
import type { DiagramName } from "../types";
import { TextWithTerms } from "./TextWithTerms";
import { Icon, type IconName } from "./Icon";

export function Diagram({ name, caption }: { name: DiagramName; caption?: string }) {
  return (
    <figure className="diagram">
      <figcaption className="kicker">FIGURE</figcaption>
      {diagrams[name]()}
      {caption ? (
        <p className="diagram-cap">
          <TextWithTerms text={caption} />
        </p>
      ) : null}
    </figure>
  );
}

const diagrams: Record<DiagramName, () => ReactElement> = {
  "http-roundtrip": HttpRoundtrip,
  "url-parts": UrlParts,
  "request-params": RequestParams,
  "get-post": GetPost,
  "status-codes": StatusCodes,
  "page-assets": PageAssets,
  "html-json": HtmlJson,
  session: SessionCookie,
  layers: Layers,
  filters: Filters,
  mapping: Mapping,
  "read-entry": ReadEntry,
  "call-chain": CallChain,
  "value-origin": ValueOrigin,
  "service-fork": ServiceFork,
  "stack-own": StackOwn,
  "stack-line": StackLine,
  "not-found": NotFound,
  "env-diff": EnvDiff,
  "cause-sides": CauseSides,
  divide: Divide,
  "n-plus-one": NPlusOne,
  "view-file": ViewFile,
  "log-where": LogWhere,
  "log-line": LogLine,
  "arch-roles": ArchRoles,
  "arch-patterns": ArchPatterns,
  "front-back": FrontBack,
  "cross-cut": CrossCut,
  "debug-two": DebugTwo,
  "protocol-stack": ProtocolStack,
  "template-rendered": TemplateRendered,
  "sql-to-source": SqlToSource,
};

function IconNode({
  icon,
  kicker,
  title,
  sub,
  size = 20,
}: {
  icon: IconName;
  kicker: string;
  title: string;
  sub?: string;
  size?: number;
}) {
  return (
    <div className="d-node has-icon">
      <Icon name={icon} size={size} className="d-node-icon" />
      <span>{kicker}</span>
      <strong>{title}</strong>
      {sub ? <small>{sub}</small> : null}
    </div>
  );
}

function ColCard({ icon, title, children }: { icon: IconName; title: string; children: string }) {
  return (
    <div className="d-col">
      <h4>
        <Icon name={icon} size={16} />
        {title}
      </h4>
      <p>{children}</p>
    </div>
  );
}

function Chip({ icon, children }: { icon: IconName; children: string }) {
  return (
    <span className="d-chip">
      <Icon name={icon} size={14} />
      {children}
    </span>
  );
}

function Arrow({ label, down, reverse }: { label: string; down?: boolean; reverse?: boolean }) {
  return (
    <div className={`d-arrow ${down ? "down" : ""} ${reverse ? "reverse" : ""}`} aria-hidden="true">
      <span>{label}</span>
      <i />
    </div>
  );
}

function FrontBack() {
  return (
    <div className="d-row wrap">
      <IconNode icon="browser" kicker="FRONT" title="フロントエンド" sub="ブラウザ・画面" />
      <Arrow label="HTTP" />
      <IconNode icon="code" kicker="BACK" title="バックエンド" sub="Java・SQL を投げる" />
      <Arrow label="SQL" />
      <IconNode icon="database" kicker="DATA" title="DB" sub="データを保存する" />
    </div>
  );
}

function DebugTwo() {
  return (
    <div className="d-cols">
      <ColCard icon="browser" title="フロントエンド">
        ブラウザの開発者ツール。JS のブレークポイント、Console、いまの HTML
      </ColCard>
      <ColCard icon="code" title="バックエンド">
        IDE のデバッガ。Java のブレークポイントと変数
      </ColCard>
    </div>
  );
}

function HttpRoundtrip() {
  return (
    <div className="d-split">
      <IconNode icon="browser" kicker="CLIENT" title="ブラウザ" sub="画面・Network タブ" size={28} />
      <div className="d-arrows">
        <Arrow label="リクエスト" />
        <Arrow reverse label="レスポンス" />
      </div>
      <IconNode icon="server" kicker="SERVER" title="サーバ" sub="リクエストを受け、応答を返す" size={28} />
    </div>
  );
}

function UrlParts() {
  return (
    <div className="url-anatomy">
      <div className="url-bar">
        <span className="url-part host">
          https://intranet.example.co.jp
          <em>ホスト</em>
        </span>
        <span className="url-part ctx">
          /shinsei
          <em>コンテキストパス</em>
        </span>
        <span className="url-part res">
          /requests/12
          <em>アプリ内のパス</em>
        </span>
        <span className="url-part query">
          ?tab=history
          <em>クエリ</em>
        </span>
      </div>
    </div>
  );
}

function RequestParamUrl({ children }: { children: ReactNode }) {
  return (
    <div className="request-param-zone request-param-zone-url">
      <span className="request-param-zone-label">URL</span>
      <code className="request-param-line">{children}</code>
    </div>
  );
}

function RequestParamPayload({ children }: { children: ReactNode }) {
  return (
    <div className="request-param-zone request-param-zone-payload">
      <div className="request-param-zone-head">
        <span className="request-param-zone-label">本文</span>
        <span className="request-param-zone-note">URL に含まれない</span>
      </div>
      <code className="request-param-line">{children}</code>
    </div>
  );
}

function RequestParams() {
  return (
    <div className="request-params">
      <div className="request-param-row">
        <span className="request-param-label">パス</span>
        <div className="request-param-body">
          <RequestParamUrl>
            GET /shinsei/requests/<mark className="url-hit">12</mark>
          </RequestParamUrl>
        </div>
      </div>
      <div className="request-param-row">
        <span className="request-param-label">クエリ</span>
        <div className="request-param-body">
          <RequestParamUrl>
            GET /shinsei/requests<mark className="url-hit">?departmentId=5</mark>
          </RequestParamUrl>
        </div>
      </div>
      <div className="request-param-row">
        <span className="request-param-label">フォーム</span>
        <div className="request-param-body">
          <RequestParamUrl>POST /shinsei/requests</RequestParamUrl>
          <RequestParamPayload>
            {"title="}<mark className="url-hit">休暇申請</mark>{"&approverId="}<mark className="url-hit">3</mark>{"&applicantId="}<mark className="url-hit">7</mark>{"&_csrf=8f3a2b1c"}
          </RequestParamPayload>
        </div>
      </div>
      <div className="request-param-row">
        <span className="request-param-label">JSON</span>
        <div className="request-param-body">
          <RequestParamUrl>POST /shinsei/api/requests</RequestParamUrl>
          <RequestParamPayload>
            {'{"title":"'}<mark className="url-hit">休暇申請</mark>{'","approverId":'}<mark className="url-hit">3</mark>{'}'}
          </RequestParamPayload>
        </div>
      </div>
    </div>
  );
}

function SessionCookie() {
  return (
    <div className="d-split">
      <IconNode icon="key" kicker="BROWSER" title="Cookie" sub="キーだけ持つ" size={28} />
      <div className="d-arrows">
        <Arrow label="ID だけ往復する" />
      </div>
      <IconNode icon="box" kicker="SERVER" title="セッション" sub="中身はこちら" size={28} />
    </div>
  );
}

function Layers() {
  return (
    <div className="d-stack">
      <Layer icon="browser">画面 / URL</Layer>
      <Arrow down label="受け口" />
      <Layer icon="inbox" accent>
        Controller
      </Layer>
      <Arrow down label="ビジネスロジック" />
      <Layer icon="cog" accent>
        Service
      </Layer>
      <Arrow down label="永続化" />
      <Layer icon="file" accent>
        Repository / Mapper
      </Layer>
      <Arrow down label="SQL" />
      <Layer icon="database">DB</Layer>
    </div>
  );
}

function Filters() {
  return (
    <div className="d-stack">
      <Layer icon="globe">リクエスト</Layer>
      <Arrow down label="Security の Filter Chain" />
      <Layer icon="shield" accent>
        CSRF
      </Layer>
      <Arrow down label="例: トークン不正ならここで止まる" />
      <Layer icon="lock" accent>
        ログイン / 権限
      </Layer>
      <Arrow down label="例: 未ログインならここで止まる" />
      <Layer icon="inbox">Controller</Layer>
    </div>
  );
}

function ProtocolStack() {
  return (
    <div className="d-stack d-protocol-stack">
      <IconNode
        icon="globe"
        kicker="LAYER7 アプリケーション層"
        title="HTTP"
        sub="Network タブ・curl … URL・ステータスコード・Content-Type"
      />
      <Arrow down label="TCP で載せる" />
      <IconNode
        icon="route"
        kicker="LAYER4 トランスポート層"
        title="TCP"
        sub="Test-NetConnection・nc・telnet … ポート 8080 まで"
      />
      <Arrow down label="IP で届ける" />
      <IconNode
        icon="server"
        kicker="LAYER3 ネットワーク層"
        title="IP"
        sub="ping・traceroute … ホスト intranet.example.co.jp まで"
      />
      <div className="d-layer warn">ping は ICMP。HTTP とは別の話で、通否も連動しません</div>
    </div>
  );
}

function CrossCut() {
  return (
    <div className="d-stack">
      <Layer icon="globe">リクエスト</Layer>
      <Arrow down label="サーブレットの仕組み" />
      <Layer icon="shield" accent>
        Filter
      </Layer>
      <Arrow down label="Spring MVC" />
      <Layer icon="route" accent>
        Interceptor
      </Layer>
      <Arrow down label="Java メソッド本体" />
      <Layer icon="inbox">Controller</Layer>
      <Arrow down label="見た目は service.approve()" />
      <Layer icon="wrench" accent>
        AOP / プロキシ
      </Layer>
      <Arrow down label="実体" />
      <Layer icon="cog">Service</Layer>
    </div>
  );
}

function Mapping() {
  return (
    <div className="d-formula">
      <Layer icon="file">@RequestMapping("/requests")</Layer>
      <span className="d-plus">+</span>
      <Layer icon="link">{'@GetMapping("/{id}")'}</Layer>
      <span className="d-plus">=</span>
      <Layer icon="route" accent>
        GET /requests/12
      </Layer>
    </div>
  );
}

function ReadEntry() {
  return (
    <div className="d-row d-flow-4">
      <IconNode icon="link" kicker="1" title="画面の URL" />
      <Arrow label="検索" />
      <IconNode icon="inbox" kicker="2" title="Controller" />
      <Arrow label="降りる" />
      <IconNode icon="cog" kicker="3" title="Service / SQL" />
      <Arrow label="突き合わせ" />
      <IconNode icon="file" kicker="4" title="テンプレート" />
    </div>
  );
}

function ValueOrigin() {
  return (
    <div className="d-origin">
      <div className="d-origin-src">
        <IconNode icon="browser" kicker="FORM" title="画面入力" sub="name=approverId" />
        <IconNode icon="database" kicker="DB" title="テーブル" sub="approver_id" />
        <IconNode icon="user" kicker="SESSION" title="ログイン情報" />
      </div>
      <Arrow down label="セットされる場所を辿る" />
      <div className="d-layer warn">request.getApproverId() が null → NPE</div>
    </div>
  );
}

function StackLine() {
  return (
    <div className="url-anatomy">
      <div className="url-bar stack-bar">
        <span className="url-part host">
          at
          <em>履歴の1行</em>
        </span>
        <span className="url-part ctx">
          jp.co.example.shinsei.service.RequestService
          <em>パッケージとクラス</em>
        </span>
        <span className="url-part res">
          .approve
          <em>メソッド</em>
        </span>
        <span className="url-part query">
          (RequestService.java:47)
          <em>ソースのファイルと行</em>
        </span>
      </div>
    </div>
  );
}

function StackOwn() {
  return (
    <div className="d-stack-log">
      {stackDump.map((line) => (
        <div key={line.text} className={`d-stack-log-line ${line.kind}`}>
          <code>{line.text}</code>
          {line.note ? <b>{line.note}</b> : null}
        </div>
      ))}
    </div>
  );
}

const stackDump: { text: string; kind: "ex" | "hit" | "own" | "dim"; note?: string }[] = [
  {
    kind: "ex",
    text: 'java.lang.NullPointerException: Cannot invoke "Long.equals(Object)" because the return value of "RequestEntity.getApproverId()" is null',
  },
  {
    kind: "hit",
    text: "    at jp.co.example.shinsei.service.RequestService.approve(RequestService.java:47)",
    note: "このファイルの 47 行目を最初に調べる",
  },
  {
    kind: "dim",
    text: "    at jp.co.example.shinsei.service.RequestService$$EnhancerBySpringCGLIB$$8a1b2c.approve(<generated>)",
    note: "生成コード。飛ばす",
  },
  {
    kind: "dim",
    text: "    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:792)",
  },
  {
    kind: "dim",
    text: "    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)",
  },
  {
    kind: "own",
    text: "    at jp.co.example.shinsei.controller.RequestController.approve(RequestController.java:70)",
    note: "呼び出し元。このファイルの 70 行目",
  },
  {
    kind: "dim",
    text: "    at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)",
  },
  {
    kind: "dim",
    text: "    at java.base/java.lang.reflect.Method.invoke(Method.java:568)",
  },
  {
    kind: "dim",
    text: "    at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205)",
  },
  {
    kind: "dim",
    text: "    at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117)",
  },
  {
    kind: "dim",
    text: "    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:895)",
  },
  {
    kind: "dim",
    text: "    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1072)",
  },
  {
    kind: "dim",
    text: "    at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:965)",
  },
  {
    kind: "dim",
    text: "    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:209)",
  },
  {
    kind: "dim",
    text: "    ... 42 more",
  },
];

function CauseSides() {
  return (
    <div className="d-cols">
      <ColCard icon="browser" title="クライアント">
        ブラウザ、画面、その PC
      </ColCard>
      <ColCard icon="globe" title="ネットワーク">
        届くまでの経路
      </ColCard>
      <ColCard icon="server" title="サーバ">
        アプリ、DB、ログ
      </ColCard>
    </div>
  );
}

function Divide() {
  return (
    <div className="d-cols">
      <ColCard icon="browser" title="ブラウザ">
        Network タブにリクエストが無いか
      </ColCard>
      <ColCard icon="server" title="アプリ">
        ログに到達しているか。エラーログを確認する
      </ColCard>
      <ColCard icon="database" title="DB / 外部">
        SQL、接続、ロック、権限
      </ColCard>
    </div>
  );
}

function GetPost() {
  return (
    <div className="d-cols">
      <ColCard icon="eye" title="GET">
        見る。再読込しても副作用が小さいことが期待される
      </ColCard>
      <ColCard icon="send" title="POST">
        変える。登録・更新・削除・承認
      </ColCard>
    </div>
  );
}

function StatusCodes() {
  return (
    <div className="d-cols">
      <ColCard icon="check" title="2xx">
        応答を返せた。業務として正しいかは別
      </ColCard>
      <ColCard icon="route" title="3xx">
        別 URL へ誘導。ログイン画面や POST 後のリダイレクト
      </ColCard>
      <ColCard icon="warn" title="4xx">
        送り方・権限・行き先。クライアント側を疑う
      </ColCard>
      <ColCard icon="server" title="5xx">
        サーバ側の失敗。エラーログを確認する
      </ColCard>
    </div>
  );
}

function HtmlJson() {
  return (
    <div className="d-cols">
      <ColCard icon="browser" title="HTML（画面）">
        ブラウザが描画する。Controller がテンプレート名を返す
      </ColCard>
      <ColCard icon="braces" title="JSON（データ）">
        JS や他システムが読む。Web API ではこの形が多い
      </ColCard>
    </div>
  );
}

function PageAssets() {
  return (
    <div className="d-n1">
      <Layer icon="browser" accent>
        GET /shinsei/requests → HTML
      </Layer>
      <Arrow down label="ブラウザが追加で取る" />
      <div className="d-n1-rows">
        <Chip icon="file">CSS</Chip>
        <Chip icon="braces">JS</Chip>
        <Chip icon="image">画像</Chip>
      </div>
    </div>
  );
}

function CallChain() {
  return (
    <div className="d-row wrap">
      <IconNode icon="inbox" kicker="CALLER" title="呼び出し元" sub="Controller / バッチ" />
      <Arrow label="引数を渡す" />
      <IconNode icon="cog" kicker="HERE" title="今のメソッド" />
      <Arrow label="呼ぶ" />
      <IconNode icon="file" kicker="CALLEE" title="呼び出し先" sub="Mapper / メール" />
    </div>
  );
}

function ServiceFork() {
  return (
    <div className="d-n1">
      <Layer icon="cog" accent>
        RequestService.approve
      </Layer>
      <Arrow down label="成功したあと枝が分かれる" />
      <div className="d-cols">
        <ColCard icon="database" title="DB 更新">
          status = APPROVED
        </ColCard>
        <ColCard icon="mail" title="メール">
          ここだけ失敗すると「承認できたが通知が無い」
        </ColCard>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="d-cols">
      <ColCard icon="search" title="404">
        行き先が無い。マッピング、パス、静的ファイル
      </ColCard>
      <ColCard icon="warn" title="500">
        行き先はある。処理の途中で例外
      </ColCard>
    </div>
  );
}

function EnvDiff() {
  return (
    <div className="d-n1">
      <Layer icon="file">同じコード</Layer>
      <Arrow down label="環境が違う" />
      <div className="d-cols">
        <ColCard icon="terminal" title="ローカル環境">
          dev プロファイル、ローカル環境の DB
        </ColCard>
        <ColCard icon="server" title="検証用環境 / 本番">
          設定、データ、権限、プロキシ
        </ColCard>
      </div>
    </div>
  );
}

function ViewFile() {
  return (
    <div className="d-formula">
      <Layer icon="inbox">return "request/list"</Layer>
      <span className="d-plus">→</span>
      <Layer icon="file" accent>
        templates/request/list.html
      </Layer>
    </div>
  );
}

function TemplateRendered() {
  return (
    <div className="d-browser-mock">
      <div className="d-browser-chrome">
        <span className="d-browser-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="d-browser-url">https://intranet.example.co.jp/shinsei/requests</span>
      </div>
      <div className="d-browser-page">
        <p className="d-browser-title">申請一覧</p>
        <table className="d-browser-table">
          <thead>
            <tr>
              <th>タイトル</th>
              <th>ステータス</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>交通費申請</td>
              <td>PENDING</td>
              <td>
                <button type="button" className="d-browser-btn">
                  承認
                </button>
              </td>
            </tr>
            <tr>
              <td>備品購入</td>
              <td>APPROVED</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LogWhere() {
  return (
    <div className="d-cols">
      <ColCard icon="terminal" title="ローカル環境">
        起動したコンソール。ローカル開発で多い
      </ColCard>
      <ColCard icon="folder" title="ファイル">
        logs/ や日付付きの .log。設定にパスが書いてある
      </ColCard>
      <ColCard icon="server" title="標準出力">
        コンテナや AP サーバが集める先。中身は同じログ
      </ColCard>
    </div>
  );
}

function LogLine() {
  return (
    <div className="url-anatomy">
      <div className="url-bar stack-bar">
        <span className="url-part host">
          04:12:03.512
          <em>時刻</em>
        </span>
        <span className="url-part ctx">
          ERROR
          <em>レベル</em>
        </span>
        <span className="url-part res">
          dispatcherServlet
          <em>ログの名前</em>
        </span>
        <span className="url-part query">
          Servlet.service() threw exception
          <em>メッセージ</em>
        </span>
      </div>
    </div>
  );
}

function Layer({ icon, children, accent }: { icon: IconName; children: string; accent?: boolean }) {
  return (
    <div className={`d-layer has-icon ${accent ? "accent" : ""}`}>
      <Icon name={icon} size={18} />
      <span>{children}</span>
    </div>
  );
}

function ArchRoles() {
  return (
    <div className="d-stack">
      <Layer icon="browser">ブラウザ</Layer>
      <Arrow down label="HTTP/HTTPS リクエスト" />
      <Layer icon="server" accent>
        HTTP サーバ（任意）Apache / nginx
      </Layer>
      <Arrow down label="中継" />
      <Layer icon="box" accent>
        サーブレットコンテナ Tomcat / Jetty
      </Layer>
      <Arrow down label="Java" />
      <Layer icon="inbox">アプリ（Controller 以降）</Layer>
    </div>
  );
}

function ArchPatterns() {
  return (
    <div>
      <div className="d-cols">
        <div className="d-col">
          <h4>パターン1: 内蔵だけ</h4>
          <div className="d-stack">
            <Layer icon="browser">ブラウザ</Layer>
            <Arrow down label="HTTP/HTTPS リクエスト" />
            <Layer icon="box" accent>
              内蔵 Tomcat / Jetty
            </Layer>
            <Arrow down label="同じプロセス" />
            <Layer icon="inbox">アプリ</Layer>
          </div>
        </div>
        <div className="d-col">
          <h4>パターン2: 外部 WAR</h4>
          <div className="d-stack">
            <Layer icon="browser">ブラウザ</Layer>
            <Arrow down label="HTTP/HTTPS リクエスト" />
            <Layer icon="box" accent>
              外部 Tomcat / Jetty
            </Layer>
            <Arrow down label="載せる" />
            <Layer icon="package">WAR</Layer>
          </div>
        </div>
        <div className="d-col">
          <h4>パターン3: 手前に HTTP サーバ</h4>
          <div className="d-stack">
            <Layer icon="browser">ブラウザ</Layer>
            <Arrow down label="HTTP/HTTPS リクエスト" />
            <Layer icon="server" accent>
              Apache / nginx
            </Layer>
            <Arrow down label="中継" />
            <Layer icon="box" accent>
              Tomcat / Jetty
            </Layer>
            <Arrow down label="Java" />
            <Layer icon="inbox">アプリ</Layer>
          </div>
        </div>
      </div>
      <p className="diagram-note">
        <TextWithTerms text="コンテナ（Docker など）で動かしても、重ね方は上の3パターンに収まることが多いです。" />
      </p>
    </div>
  );
}

function NPlusOne() {
  return (
    <div className="d-n1">
      <Layer icon="database">一覧 1 回 SELECT（10 件）</Layer>
      <Arrow down label="各行で追加" />
      <div className="d-n1-rows">
        <Chip icon="terminal">SELECT #1</Chip>
        <Chip icon="terminal">SELECT #2</Chip>
        <Chip icon="terminal">…</Chip>
        <Chip icon="terminal">SELECT #10</Chip>
      </div>
      <p className="diagram-note">件数だけ SQL が増えるのが N+1。</p>
    </div>
  );
}

function SqlToSource() {
  return (
    <div className="d-cols">
      <div className="d-col">
        <h4>
          <Icon name="file" size={16} />
          MyBatis
        </h4>
        <div className="d-stack">
          <Layer icon="terminal">ログの SQL</Layer>
          <Arrow down label="テーブル名や列名で探す" />
          <Layer icon="file" accent>
            Mapper XML
          </Layer>
          <Arrow down label="id がメソッド名" />
          <Layer icon="code" accent>
            Mapper.java
          </Layer>
          <Arrow down label="参照検索" />
          <Layer icon="cog">呼び出し元</Layer>
        </div>
      </div>
      <div className="d-col">
        <h4>
          <Icon name="code" size={16} />
          Hibernate
        </h4>
        <div className="d-stack">
          <Layer icon="terminal">ログの SQL</Layer>
          <Arrow down label="テーブル名で探す" />
          <Layer icon="file" accent>
            Entity の @Table
          </Layer>
          <Arrow down label="参照検索" />
          <Layer icon="code" accent>
            Repository
          </Layer>
          <Arrow down label="参照検索" />
          <Layer icon="cog">呼び出し元</Layer>
        </div>
      </div>
    </div>
  );
}
