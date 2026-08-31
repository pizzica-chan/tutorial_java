export type FlowStep = {
  id: string;
  layer: string;
  title: string;
  detail: string;
  code?: string;
};

export const requestFlow: FlowStep[] = [
  {
    id: "browser",
    layer: "Browser",
    title: "一覧を開く",
    detail: "利用者が `/shinsei/requests` にアクセスします。ブラウザは Cookie に入っているセッション ID も一緒に送ります。この ID は次のフィルタで、サーバ側のセッションを引くキーになります。",
    code: `GET /shinsei/requests HTTP/1.1
Host: intranet.example.co.jp
Cookie: JSESSIONID=AB12CD34
Accept: text/html`,
  },
  {
    id: "filter",
    layer: "Filter",
    title: "セキュリティフィルタ",
    detail: "Spring Security が、Cookie のセッション ID でサーバ側のセッションを引きます。そこにログインユーザがいれば「ログイン済み」です。この URL へのアクセスが許可されているかも、ここで判定します。弾かれると Controller まで届きません。ステータスコードや遷移先は実装次第です。",
    code: `Cookie: JSESSIONID=AB12CD34
  -> セッションを引く
  -> ログインユーザあり?  このURLはアクセス許可?
no  -> 例: 302 /login（401 や HTML のことも）
yes -> ログインユーザを次へ渡す`,
  },
  {
    id: "controller",
    layer: "Controller",
    title: "RequestController#list",
    detail: "引数の LoginUser は、フィルタがセッションから復元したログインユーザです。その ID を Service に渡し、未承認の申請を取ります。画面用のデータを Model に載せ、テンプレート名を返します。",
    code: `@GetMapping
public String list(Model model, @AuthenticationPrincipal LoginUser user) {
  model.addAttribute("applications", requestService.findMine(user.getId()));
  return "request/list";
}`,
  },
  {
    id: "service",
    layer: "Service",
    title: "RequestService#findMine",
    detail: "渡された userId は、Cookie から辿ったログインユーザの ID です。自分に関係する申請だけ返す、といった判定は Service に置かれることが多いです。Controller に寄っている構成もあります。",
    code: `public List<RequestEntity> findMine(Long userId) {
  return requestMapper.findMine(userId);
}`,
  },
  {
    id: "mapper",
    layer: "MyBatis",
    title: "RequestMapper#findMine",
    detail: "SQL の ? に、その userId が入ります。申請者または承認者である、未承認のレコードだけが対象です。件数がおかしい、遅い、エラーになるといった症状は、この SQL の実体を見ます。",
    code: `SELECT ... FROM t_request r
  JOIN t_user a ON a.id = r.applicant_id
  LEFT JOIN t_user v ON v.id = r.approver_id
 WHERE (r.applicant_id = ?
    OR r.approver_id = ?)
   AND r.status = 'PENDING'
 ORDER BY r.created_at DESC`,
  },
  {
    id: "db",
    layer: "MySQL",
    title: "テーブル t_request",
    detail: "実データは DB にあります。検証用環境に該当データが無い、権限用のマスタが違うといったことは、コードではなくデータの問題です。",
  },
  {
    id: "view",
    layer: "Thymeleaf",
    title: "request/list.html",
    detail: "Model の中身を HTML に流し込みます。ボタンの表示条件や `th:action` は、サーバのマッピングと対で確認します。",
  },
  {
    id: "response",
    layer: "HTTP",
    title: "200 OK と HTML",
    detail: "完成した HTML がブラウザに戻り、画面が描画されます。CSS/JS は別リクエストです。画面が崩れていてもサーバの 500 とは限りません。",
    code: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8`,
  },
];

export type StackLineKind = "exception" | "app" | "framework" | "jdk" | "hint";

export type StackCase = {
  id: string;
  title: string;
  symptom: string;
  lines: { text: string; note: string; kind: StackLineKind }[];
};

export const stackKindLabel: Record<StackLineKind, string> = {
  exception: "例外",
  app: "自作",
  framework: "FW",
  jdk: "JDK",
  hint: "補足",
};

export function firstAppLine(item: StackCase): number {
  const index = item.lines.findIndex((line) => line.kind === "app");
  return index >= 0 ? index : 0;
}

export const stackCases: StackCase[] = [
  {
    id: "npe",
    title: "承認ボタンでステータスコード 500",
    symptom: "山田で申請 ID 16「研修参加」の詳細を開き、「承認」を押すと画面がエラーになる。",
    lines: [
      {
        kind: "exception",
        text: 'java.lang.NullPointerException: Cannot invoke "Long.equals(Object)" because the return value of "RequestEntity.getApproverId()" is null',
        note: "例外の型とメッセージが本体です。`getApproverId()` の戻り値が null で、その null に `equals` を呼んだと読めます。",
      },
      {
        kind: "app",
        text: "    at `jp.co.example.shinsei.service.RequestService.approve(RequestService.java:48)`",
        note: "自分たちが書いたコードのパッケージ名で始まり、.java がある、上から最初の行。実ファイルの 48 行目を最初に調べます。",
      },
      {
        kind: "framework",
        text: "    at jp.co.example.shinsei.service.RequestService$$EnhancerBySpringCGLIB$$8a1b2c.approve(<generated>)",
        note: "パッケージ名は自作コードと同じでも、$$Enhancer は Spring が作った生成コードです。隣の .java 行に戻ります。",
      },
      {
        kind: "framework",
        text: "    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:792)",
        note: "フレームワーク内部。原因箇所ではありません。",
      },
      {
        kind: "app",
        text: "    at jp.co.example.shinsei.controller.RequestController.approve(RequestController.java:70)",
        note: "その下の自作クラスは呼び出し元。画面のどの操作から来たか（POST /requests/{id}/approve）を特定できます。",
      },
      {
        kind: "jdk",
        text: "    at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)",
        note: "JDK の反射呼び出しです。飛ばします。",
      },
      {
        kind: "framework",
        text: "    at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117)",
        note: "org.springframework はフレームワークです。長いクラス名で止まらないでください。",
      },
      {
        kind: "framework",
        text: "    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1072)",
        note: "リクエストを振り分ける枠組みです。直すファイルではありません。",
      },
      {
        kind: "framework",
        text: "    ... 42 more",
        note: "Java は長いスタックの末尾を省略します。見る場所は、省略より上の自作行です。",
      },
    ],
  },
  {
    id: "sql",
    title: "一覧でステータスコード 500",
    symptom: "申請一覧に行くとステータスコード 500（サーバエラー）になる。昨日まで動いていた。DB にカラムを足した、という話がある。",
    lines: [
      {
        kind: "exception",
        text: "org.springframework.jdbc.BadSqlGrammarException: Error querying database. Cause: java.sql.SQLSyntaxErrorException: Unknown column 'priority' in 'field list'",
        note: "例外の型は Spring でも、中身は SQL のカラム名エラーです。フレームワーク名に引っ張られず、メッセージを先に読みます。",
      },
      {
        kind: "framework",
        text: "    at org.springframework.jdbc.support.SQLErrorCodeSQLExceptionTranslator.doTranslate(SQLErrorCodeSQLExceptionTranslator.java:172)",
        note: "Spring が SQLException を包んでいる途中です。ここで止まっても直すファイルではありません。",
      },
      {
        kind: "framework",
        text: "    at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:154)",
        note: "MyBatis 内部です。自作の Mapper を探します。",
      },
      {
        kind: "jdk",
        text: "    at jdk.proxy2.$Proxy84.findMine(Unknown Source)",
        note: "MyBatis の Mapper はインタフェースなので、実行時はプロキシです。Unknown Source なら飛ばして、隣の自作クラスへ戻ります。",
      },
      {
        kind: "app",
        text: "    at `jp.co.example.shinsei.service.RequestService.findMine(RequestService.java:20)`",
        note: "呼び出し元の Service。SQL の中身は Mapper の XML（`findMine`）にあります。",
      },
      {
        kind: "app",
        text: "    at jp.co.example.shinsei.controller.RequestController.list(RequestController.java:27)",
        note: "画面の処理の入口。一覧を開いた操作から来ている、と確認できます。",
      },
      {
        kind: "framework",
        text: "    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1072)",
        note: "フレームワーク内部。飛ばします。",
      },
      {
        kind: "exception",
        text: "Caused by: java.sql.SQLSyntaxErrorException: Unknown column 'priority' in 'field list'",
        note: "Caused by が根因です。Mapper に priority を足したのに、検証用環境の DB で ALTER が未実施なのが典型です。",
      },
    ],
  },
  {
    id: "csrf",
    title: "承認するとログイン画面に戻る",
    symptom: "ボタンを押すと一覧ではなくログインへ。ログに例外は少ない。Network タブのステータスコードも確認しましょう。",
    lines: [
      {
        kind: "framework",
        text: "o.s.security.web.csrf.CsrfFilter: Invalid CSRF token found for http://.../shinsei/requests/12/approve",
        note: "Spring Security のログです。スタックが少なくても、クラス名 `CsrfFilter` から「自作の Service ではなくフィルタ手前」と分かります。",
      },
      {
        kind: "hint",
        text: "フォームに CSRF 用 hidden が無い / Ajax でヘッダを付け忘れ（Thymeleaf なら `th:action` で自動挿入されることが多い）",
        note: "トークン不正の典型は 403 です。設定によっては 302 やログイン画面の HTML になることもあります。500 ではないので「エラーになっていない」と誤解しがちです。",
      },
    ],
  },
];

export const httpSample = {
  request: `GET /shinsei/requests HTTP/1.1
Host: intranet.example.co.jp
Cookie: JSESSIONID=AB12CD34
Accept: text/html`,
  response: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html>
<html>
  <body>
    <h1>申請一覧</h1>
    <table>
      <tr><td>研修参加</td><td>PENDING</td></tr>
      <tr><td>休暇申請</td><td>PENDING</td></tr>
    </table>
  </body>
</html>`,
  notes: [
    {
      label: "GET",
      text: "GET は、サーバからデータを取る操作です。申請一覧を開くときも GET です。",
    },
    {
      label: "Cookie",
      text: "リクエストに Cookie を載せることで、サーバは `JSESSIONID` をもとに、どのセッションのログイン情報を取り出せばよいか判断できます。",
    },
    {
      label: "200",
      text: "サーバは応答を返せた、という意味です。本文に HTML が載っていれば、ブラウザはそれを画面にします。",
    },
    {
      label: "Content-Type",
      text: "`Content-Type` は、レスポンス本文の種類を表すヘッダです。`text/html` なら画面用の HTML です。`application/json` ならデータで、Web API の応答に多いです。",
    },
  ],
};
