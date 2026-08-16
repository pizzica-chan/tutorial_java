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
  divide: Divide,
  "n-plus-one": NPlusOne,
  "view-file": ViewFile,
  "log-where": LogWhere,
  "log-line": LogLine,
  "arch-roles": ArchRoles,
  "arch-patterns": ArchPatterns,
  "front-back": FrontBack,
  "scenario-layers": ScenarioLayers,
  "cross-cut": CrossCut,
  "debug-two": DebugTwo,
  "protocol-stack": ProtocolStack,
};

function Node({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="d-node">
      <span>{kicker}</span>
      <strong>{title}</strong>
      {sub ? <small>{sub}</small> : null}
    </div>
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

function PhotoNode({
  src,
  alt,
  kicker,
  title,
  sub,
}: {
  src: string;
  alt: string;
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="d-photo-node">
      <img src={src} alt={alt} />
      <Node kicker={kicker} title={title} sub={sub} />
    </div>
  );
}

function PhotoCard({ src, alt, title, children }: { src: string; alt: string; title: string; children: string }) {
  return (
    <div className="d-col d-photo-card">
      <img src={src} alt={alt} />
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}

function ScenarioLayers() {
  return (
    <div className="d-stack">
      <Layer icon="browser">フロントエンド（ブラウザ・JS）</Layer>
      <Arrow down label="届く道（ネットワーク）" />
      <Layer icon="server" accent>
        HTTPサーバ（任意）Apache / nginx
      </Layer>
      <Arrow down label="中継" />
      <Layer icon="inbox" accent>
        バックエンド（Java）
      </Layer>
      <Arrow down label="SQL" />
      <Layer icon="database">DB（データを保存）</Layer>
    </div>
  );
}

function FrontBack() {
  return (
    <div className="d-row wrap">
      <Node kicker="FRONT" title="フロントエンド" sub="ブラウザ・画面" />
      <Arrow label="HTTP" />
      <Node kicker="BACK" title="バックエンド" sub="Java・SQL を投げる" />
      <Arrow label="SQL" />
      <Node kicker="DATA" title="DB" sub="データを保存する" />
    </div>
  );
}

function DebugTwo() {
  return (
    <div className="d-cols">
      <PhotoCard src="/images/client-laptop.jpg" alt="ノートPC" title="フロントエンド">
        ブラウザの開発者ツール。JS のブレークポイント、Console、いまの HTML
      </PhotoCard>
      <PhotoCard src="/images/code-screen.jpg" alt="ソースを開いたエディタ" title="バックエンド">
        IDE のデバッガ。Java のブレークポイントと変数
      </PhotoCard>
    </div>
  );
}

function HttpRoundtrip() {
  return (
    <div className="d-split">
      <PhotoNode src="/images/client-laptop.jpg" alt="ノートPCで作業している机" kicker="CLIENT" title="ブラウザ" sub="画面・Network タブ" />
      <div className="d-arrows">
        <Arrow label="リクエスト" />
        <Arrow reverse label="レスポンス" />
      </div>
      <PhotoNode src="/images/server-racks.jpg" alt="サーバ室のラック" kicker="SERVER" title="サーバ" sub="リクエストを受け、応答を返す" />
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
          <RequestParamUrl>POST /shinsei/requests/12/approve</RequestParamUrl>
          <RequestParamPayload>
            {'{"status":"'}<mark className="url-hit">APPROVED</mark>{'","comment":"'}<mark className="url-hit">了解しました</mark>{'"}'}
          </RequestParamPayload>
        </div>
      </div>
    </div>
  );
}

function SessionCookie() {
  return (
    <div className="d-split">
      <PhotoNode src="/images/keys.jpg" alt="鍵のかかった南京錠" kicker="BROWSER" title="Cookie" sub="鍵だけ持つ" />
      <div className="d-arrows">
        <Arrow label="ID だけ往復する" />
      </div>
      <PhotoNode src="/images/server-racks.jpg" alt="サーバ室のラック" kicker="SERVER" title="セッション" sub="中身はこちら" />
    </div>
  );
}

function Layers() {
  return (
    <div className="d-stack">
      <div className="d-layer">画面 / URL</div>
      <Arrow down label="受け口" />
      <div className="d-layer accent">Controller</div>
      <Arrow down label="業務判断" />
      <div className="d-layer accent">Service</div>
      <Arrow down label="永続化" />
      <div className="d-layer accent">Repository / Mapper</div>
      <Arrow down label="SQL" />
      <div className="d-layer">DB</div>
    </div>
  );
}

function Filters() {
  return (
    <div className="d-stack">
      <div className="d-layer">リクエスト</div>
      <Arrow down label="Security の Filter Chain" />
      <div className="d-layer accent">CSRF</div>
      <Arrow down label="例: トークン不正ならここで止まる" />
      <div className="d-layer accent">ログイン / 権限</div>
      <Arrow down label="例: 未ログインならここで止まる" />
      <div className="d-layer">Controller</div>
    </div>
  );
}

function ProtocolStack() {
  return (
    <div className="d-stack d-protocol-stack">
      <Node
        kicker="LAYER7 アプリケーション層"
        title="HTTP"
        sub="Network タブ・curl … URL・ステータス・Content-Type"
      />
      <Arrow down label="TCP で載せる" />
      <Node
        kicker="LAYER4 トランスポート層"
        title="TCP"
        sub="Test-NetConnection・nc・telnet … ポート 8080 まで"
      />
      <Arrow down label="IP で届ける" />
      <Node
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
      <div className="d-layer">リクエスト</div>
      <Arrow down label="サーブレットの仕組み" />
      <div className="d-layer accent">Filter</div>
      <Arrow down label="Spring MVC" />
      <div className="d-layer accent">Interceptor</div>
      <Arrow down label="Java メソッド本体" />
      <div className="d-layer">Controller</div>
      <Arrow down label="見た目は service.approve()" />
      <div className="d-layer accent">AOP / プロキシ</div>
      <Arrow down label="実体" />
      <div className="d-layer">Service</div>
    </div>
  );
}

function Mapping() {
  return (
    <div className="d-formula">
      <div className="d-layer">@RequestMapping("/requests")</div>
      <span className="d-plus">+</span>
      <div className="d-layer">{'@GetMapping("/{id}")'}</div>
      <span className="d-plus">=</span>
      <div className="d-layer accent">GET /requests/12</div>
    </div>
  );
}

function ReadEntry() {
  return (
    <div className="d-row wrap">
      <Node kicker="1" title="画面の URL" />
      <Arrow label="検索" />
      <Node kicker="2" title="Controller" />
      <Arrow label="降りる" />
      <Node kicker="3" title="Service / SQL" />
      <Arrow label="突き合わせ" />
      <Node kicker="4" title="テンプレート" />
    </div>
  );
}

function ValueOrigin() {
  return (
    <div className="d-origin">
      <div className="d-origin-src">
        <Node kicker="FORM" title="画面入力" sub="name=approverId" />
        <Node kicker="DB" title="テーブル" sub="approver_id" />
        <Node kicker="SESSION" title="ログイン情報" />
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
          (RequestService.java:41)
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
    text: "    at jp.co.example.shinsei.service.RequestService.approve(RequestService.java:41)",
    note: "このファイルの 41 行目を最初に調べる",
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
    kind: "dim",
    text: "    at jdk.proxy2.$Proxy128.approve(Unknown Source)",
  },
  {
    kind: "own",
    text: "    at jp.co.example.shinsei.controller.RequestController.approve(RequestController.java:58)",
    note: "呼び出し元。このファイルの 58 行目",
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

function Divide() {
  return (
    <div className="d-cols">
      <PhotoCard src="/images/client-laptop.jpg" alt="ノートPC" title="ブラウザ">
        Network タブにリクエストが無いか
      </PhotoCard>
      <PhotoCard src="/images/server-racks.jpg" alt="アプリが動くサーバ" title="アプリ">
        ログに到達しているか。例外は自作クラスか
      </PhotoCard>
      <PhotoCard src="/images/storage-racks.jpg" alt="データを置くディスク" title="DB / 外部">
        SQL、接続、ロック、権限
      </PhotoCard>
    </div>
  );
}

function GetPost() {
  return (
    <div className="d-cols">
      <div className="d-col">
        <h4>GET</h4>
        <p>見る。再読込しても副作用が小さいことが期待される</p>
      </div>
      <div className="d-col">
        <h4>POST</h4>
        <p>変える。登録・更新・削除・承認</p>
      </div>
    </div>
  );
}

function StatusCodes() {
  return (
    <div className="d-cols">
      <div className="d-col">
        <h4>2xx</h4>
        <p>応答を返せた。業務として正しいかは別</p>
      </div>
      <div className="d-col">
        <h4>3xx</h4>
        <p>別 URL へ誘導。ログイン画面や POST 後のリダイレクト</p>
      </div>
      <div className="d-col">
        <h4>4xx</h4>
        <p>送り方・権限・行き先。クライアント側を疑う</p>
      </div>
      <div className="d-col">
        <h4>5xx</h4>
        <p>サーバ例外。スタックトレースを見る</p>
      </div>
    </div>
  );
}

function HtmlJson() {
  return (
    <div className="d-cols">
      <div className="d-col">
        <h4>HTML（画面）</h4>
        <p>ブラウザが描画する。Controller がテンプレート名を返す</p>
      </div>
      <div className="d-col">
        <h4>JSON（Web API）</h4>
        <p>JS や他システムが読むデータ。RestController がオブジェクトを返す</p>
      </div>
    </div>
  );
}

function PageAssets() {
  return (
    <div className="d-n1">
      <div className="d-layer accent">GET /requests → HTML</div>
      <Arrow down label="ブラウザが追加で取る" />
      <div className="d-n1-rows">
        <span>CSS</span>
        <span>JS</span>
        <span>画像</span>
      </div>
    </div>
  );
}

function CallChain() {
  return (
    <div className="d-row wrap">
      <Node kicker="CALLER" title="呼び出し元" sub="Controller / バッチ" />
      <Arrow label="引数を渡す" />
      <Node kicker="HERE" title="今のメソッド" />
      <Arrow label="呼ぶ" />
      <Node kicker="CALLEE" title="呼び出し先" sub="Mapper / メール" />
    </div>
  );
}

function ServiceFork() {
  return (
    <div className="d-n1">
      <div className="d-layer accent">RequestService.approve</div>
      <Arrow down label="成功したあと枝が分かれる" />
      <div className="d-cols">
        <div className="d-col">
          <h4>DB 更新</h4>
          <p>status = APPROVED</p>
        </div>
        <div className="d-col">
          <h4>メール</h4>
          <p>ここだけ失敗すると「承認できたが通知が無い」</p>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="d-cols">
      <div className="d-col">
        <h4>404</h4>
        <p>行き先が無い。マッピング、パス、静的ファイル</p>
      </div>
      <div className="d-col">
        <h4>500</h4>
        <p>行き先はある。処理の途中で例外</p>
      </div>
    </div>
  );
}

function EnvDiff() {
  return (
    <div className="d-n1">
      <div className="d-layer">同じコード</div>
      <Arrow down label="環境が違う" />
      <div className="d-cols">
        <PhotoCard src="/images/home-desk.jpg" alt="入力している机" title="ローカル環境">
          dev プロファイル、ローカル環境の DB
        </PhotoCard>
        <PhotoCard src="/images/server-racks.jpg" alt="検証や本番のサーバ" title="検証 / 本番">
          設定、データ、権限、プロキシ
        </PhotoCard>
      </div>
    </div>
  );
}

function ViewFile() {
  return (
    <div className="d-formula">
      <div className="d-layer">return "request/list"</div>
      <span className="d-plus">→</span>
      <div className="d-layer accent">templates/request/list.html</div>
    </div>
  );
}

function LogWhere() {
  return (
    <div className="d-cols">
      <div className="d-col">
        <h4>ローカル環境</h4>
        <p>起動したコンソール。ローカル開発で多い</p>
      </div>
      <div className="d-col">
        <h4>ファイル</h4>
        <p>logs/ や日付付きの .log。設定にパスが書いてある</p>
      </div>
      <div className="d-col">
        <h4>標準出力</h4>
        <p>コンテナや AP サーバが集める先。中身は同じログ</p>
      </div>
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
          RequestService
          <em>どのクラスか</em>
        </span>
        <span className="url-part query">
          approve failed requestId=12
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
        HTTPサーバ（任意）Apache / nginx
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
        <h4>パターン3: 手前に HTTPサーバ</h4>
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
  );
}

function NPlusOne() {
  return (
    <div className="d-n1">
      <div className="d-layer">一覧 1 回 SELECT（10 件）</div>
      <Arrow down label="各行で追加" />
      <div className="d-n1-rows">
        <span>SELECT #1</span>
        <span>SELECT #2</span>
        <span>…</span>
        <span>SELECT #10</span>
      </div>
      <p className="diagram-note">件数だけ SQL が増えるのが N+1。</p>
    </div>
  );
}
