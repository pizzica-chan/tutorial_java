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
    detail:
      "利用者が /shinsei/requests にアクセスします。ブラウザは Cookie に入っているセッションIDも一緒に送ります。",
    code: `GET /shinsei/requests HTTP/1.1
Host: intranet.example.co.jp
Cookie: JSESSIONID=AB12CD34
Accept: text/html`,
  },
  {
    id: "filter",
    layer: "Filter",
    title: "セキュリティフィルタ",
    detail:
      "Spring Security が「ログイン済みか」「このURLを見てよいか」を先に判定します。ここで弾かれると Controller まで届きません。番号や遷移先は実装次第です。",
    code: `authenticated?
  no  -> 例: 302 /login（401 や HTML のことも）
  yes -> 次へ`,
  },
  {
    id: "controller",
    layer: "Controller",
    title: "RequestController#list",
    detail:
      "URL と HTTP メソッドが一致する Java メソッドが呼ばれます。Spring では @GetMapping などで受けます。ここでは画面用のデータを Model に載せ、テンプレート名を返します。",
    code: `@GetMapping
public String list(Model model, LoginUser user) {
  model.addAttribute("requests", requestService.findMine(user.getId()));
  return "request/list";
}`,
  },
  {
    id: "service",
    layer: "Service",
    title: "RequestService#findMine",
    detail:
      "「自分に関係する申請だけ返す」といった業務ルールは Service に置かれることが多いです。Controller に寄っている構成もあります。",
    code: `public List<RequestEntity> findMine(Long userId) {
  return requestRepository.findMine(userId);
}`,
  },
  {
    id: "mapper",
    layer: "MyBatis",
    title: "RequestMapper#findMine",
    detail:
      "メソッド名や XML の id が SQL に接続されます。件数がおかしい、遅い、エラーになるといった症状は、ここで実体を見ます。",
    code: `SELECT ... FROM t_request
 WHERE applicant_id = ?
    OR approver_id = ?
 ORDER BY created_at DESC`,
  },
  {
    id: "db",
    layer: "MySQL",
    title: "テーブル t_request",
    detail:
      "実データは DB にあります。検証環境に該当データが無い、権限用のマスタが違うといったことは、コードではなくデータの問題です。",
  },
  {
    id: "view",
    layer: "Thymeleaf",
    title: "request/list.html",
    detail:
      "Model の中身を HTML に流し込みます。ボタンの表示条件や th:action は、サーバのマッピングと対で確認します。",
  },
  {
    id: "response",
    layer: "HTTP",
    title: "200 OK と HTML",
    detail:
      "完成した HTML がブラウザに戻り、画面が描画されます。CSS/JS は別リクエストです。画面が崩れていてもサーバの 500 とは限りません。",
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
    title: "承認ボタンでレスポンス 500（エラー）",
    symptom: "申請詳細の「承認」を押すと画面がエラーになる。自分の申請では起きず、代理承認で起きる。",
    lines: [
      {
        kind: "exception",
        text: 'java.lang.NullPointerException: Cannot invoke "Long.equals(Object)" because the return value of "RequestEntity.getApproverId()" is null',
        note: "例外の型とメッセージが本体です。approverId が null の申請で equals している、と読めます。",
      },
      {
        kind: "app",
        text: "    at jp.co.example.shinsei.service.RequestService.approve(RequestService.java:41)",
        note: "自分たちが書いたコードのパッケージ名で始まり、.java がある、上から最初の行。このファイルの 41 行目を最初に調べます。",
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
        kind: "jdk",
        text: "    at jdk.proxy2.$Proxy128.approve(Unknown Source)",
        note: "生成されたプロキシです。Unknown Source なので飛ばします。",
      },
      {
        kind: "app",
        text: "    at jp.co.example.shinsei.controller.RequestController.approve(RequestController.java:58)",
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
        note: "org.springframework はライブラリです。長いクラス名で止まらないでください。",
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
    title: "一覧でレスポンス 500（エラー）",
    symptom: "申請一覧に行くとレスポンス 500（サーバエラー）になる。昨日まで動いていた。DBにカラムを足した、という話がある。",
    lines: [
      {
        kind: "exception",
        text: "org.springframework.jdbc.BadSqlGrammarException: Error querying database. Cause: java.sql.SQLSyntaxErrorException: Unknown column 'priority' in 'field list'",
        note: "例外の型は Spring でも、中身は SQL の列名エラーです。フレームワーク名に引っ張られず、メッセージを先に読みます。",
      },
      {
        kind: "framework",
        text: "    at org.springframework.jdbc.support.SQLErrorCodeSQLExceptionTranslator.doTranslate(SQLErrorCodeSQLExceptionTranslator.java:172)",
        note: "Spring が SQLException を包んでいる途中です。ここで止まっても直すファイルではありません。",
      },
      {
        kind: "framework",
        text: "    at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:154)",
        note: "MyBatis 内部です。自作の Repository / Mapper を探します。",
      },
      {
        kind: "jdk",
        text: "    at jdk.proxy2.$Proxy84.findMine(Unknown Source)",
        note: "Mapper のプロキシです。Unknown Source なので飛ばします。",
      },
      {
        kind: "app",
        text: "    at jp.co.example.shinsei.repository.RequestRepository.findMine(RequestRepository.java:18)",
        note: "自作クラス。対応する XML の findMine を開きます。ライブラリの行より、この行が処理の入口です。",
      },
      {
        kind: "app",
        text: "    at jp.co.example.shinsei.service.RequestService.findMine(RequestService.java:22)",
        note: "呼び出し元の Service。SQL の中身は Repository / Mapper 側にあります。",
      },
      {
        kind: "app",
        text: "    at jp.co.example.shinsei.controller.RequestController.list(RequestController.java:31)",
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
        note: "Caused by が根因です。Mapper に priority を足したのに、検証 DB で ALTER が未実施なのが典型です。",
      },
    ],
  },
  {
    id: "csrf",
    title: "承認するとログイン画面に戻る",
    symptom: "ボタンを押すと一覧ではなくログインへ。ログに例外は少ない。Network タブの番号も確認する。",
    lines: [
      {
        kind: "framework",
        text: "o.s.security.web.csrf.CsrfFilter: Invalid CSRF token found for http://.../shinsei/requests/12/approve",
        note: "Spring Security のログです。スタックが少なくても、クラス名 CsrfFilter から「自作の Service ではなくフィルタ手前」と分かります。",
      },
      {
        kind: "hint",
        text: "フォームに CSRF 用 hidden が無い / Ajax でヘッダを付け忘れ（Thymeleaf なら th:action で自動挿入されることが多い）",
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
      <tr><td>交通費申請</td><td>申請中</td></tr>
      <tr><td>備品購入</td><td>承認済み</td></tr>
    </table>
  </body>
</html>`,
  notes: [
    {
      label: "GET",
      text: "一覧を開く取得です。ブラウザのアドレスバーやリンクから飛ぶときも、だいたい GET です。",
    },
    {
      label: "Cookie",
      text: "ログイン状態はサーバのセッションにあり、ブラウザはその鍵（JSESSIONID）を持っています。",
    },
    {
      label: "200",
      text: "サーバは応答を返せた、という意味です。本文に HTML が載っていれば、ブラウザはそれを画面にします。",
    },
    {
      label: "Content-Type",
      text: "text/html なら画面用の HTML です。application/json ならデータで、Web API の応答に多いです。",
    },
  ],
};
