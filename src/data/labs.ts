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
      "Spring Security が「ログイン済みか」「このURLを見てよいか」を先に判定します。ここで弾かれると Controller まで届きません。",
    code: `authenticated?
  no  -> 302 /login
  yes -> 次へ`,
  },
  {
    id: "controller",
    layer: "Controller",
    title: "RequestController#list",
    detail:
      "URL と HTTP メソッドが一致するメソッドが呼ばれます。Spring では @GetMapping などで受けます。ここでは画面用のデータを Model に載せ、テンプレート名を返します。",
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
      "メソッド名や XML の id が SQL に接続されます。件数がおかしい、遅い、エラー、はここで実体を見ます。",
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
      "実データはDBにあります。検証環境に該当データが無い、権限用のマスタが違う、はコードではなくデータの問題です。",
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

export const stackCases: StackCase[] = [
  {
    id: "npe",
    title: "承認ボタンでレスポンス 500（エラー）",
    symptom: "申請詳細の「承認」を押すと画面がエラーになる。自分の申請では起きず、代理承認で起きる。",
    lines: [
      {
        kind: "exception",
        text: "java.lang.NullPointerException: Cannot invoke \"Long.equals(Object)\" because the return value of \"RequestEntity.getApproverId()\" is null",
        note: "例外の型とメッセージが本体です。approverId が null の申請で equals している、と読めます。",
      },
      {
        kind: "app",
        text: "    at jp.co.example.shinsei.service.RequestService.approve(RequestService.java:41)",
        note: "jp.co.example で始まる、上から最初の行。右端の RequestService.java:41 がソースの位置です。その 41 行目を見ます。",
      },
      {
        kind: "app",
        text: "    at jp.co.example.shinsei.controller.RequestController.approve(RequestController.java:58)",
        note: "その下の自作クラスは呼び出し元。画面のどの操作から来たか（POST /requests/{id}/approve）を特定できます。",
      },
      {
        kind: "jdk",
        text: "    at jdk.proxy2.$Proxy128.approve(Unknown Source)",
        note: "Spring が生成したプロキシです。自作クラスではありません。隣の jp.co.example 行に戻ります。",
      },
      {
        kind: "framework",
        text: "    at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invoke(...)",
        note: "フレームワーク内部。原因箇所ではありません。パッケージ名 org.springframework で見分けます。",
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
        text: "    at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:154)",
        note: "MyBatis 内部。ここで止まっても直すファイルではありません。自作の Repository / Mapper を探します。",
      },
      {
        kind: "app",
        text: "    at jp.co.example.shinsei.repository.RequestRepository.findMine(RequestRepository.java:18)",
        note: "自作クラス。対応する XML の findMine を開きます。ライブラリの行より、この行が入口です。",
      },
      {
        kind: "exception",
        text: "Caused by: java.sql.SQLSyntaxErrorException: Unknown column 'priority' in 'field list'",
        note: "Caused by が根因です。Mapper に priority を足したのに、検証DBの ALTER が未実施、が典型です。",
      },
    ],
  },
  {
    id: "csrf",
    title: "承認するとログイン画面に戻る",
    symptom: "ボタンを押すと一覧ではなくログインへ。ログに例外は少ない。",
    lines: [
      {
        kind: "framework",
        text: "o.s.security.web.csrf.CsrfFilter: Invalid CSRF token found for http://.../shinsei/requests/12/approve",
        note: "Spring Security のログです。スタックが少なくても、クラス名 CsrfFilter から「自作の Service ではなくフィルタ手前」と分かります。",
      },
      {
        kind: "hint",
        text: "フォームに th:action は書いたが、sec:csrf 相当の hidden が無い / Ajax で header を付け忘れ",
        note: "POST なのにトークンが無いと、Security がセッションを切ってログインへ戻すことがあります。500 ではないので「落ちてない」と誤解しがちです。",
      },
    ],
  },
];

export const httpSample = {
  request: `POST /shinsei/requests/12/approve HTTP/1.1
Host: intranet.example.co.jp
Cookie: JSESSIONID=AB12CD34
Content-Type: application/x-www-form-urlencoded
Origin: https://intranet.example.co.jp
Referer: https://intranet.example.co.jp/shinsei/requests

_csrf=f8a1...&`,
  response: `HTTP/1.1 302 Found
Location: /shinsei/requests
Set-Cookie: JSESSIONID=AB12CD34; Path=/shinsei; HttpOnly`,
  notes: [
    {
      label: "POST",
      text: "データを変える操作は POST が多いです。GET で承認すると、再読込やクローラで二重承認の危険があります。",
    },
    {
      label: "Cookie",
      text: "ログイン状態はサーバのセッションにあり、ブラウザはその鍵（JSESSIONID）を持っています。",
    },
    {
      label: "302 + Location",
      text: "PRG パターン。POST のあとリダイレクトして、再読込で二重送信しにくくします。",
    },
    {
      label: "_csrf",
      text: "見知らぬサイトからのフォーム送信を防ぐトークンです。これが欠けるとログイン画面に飛ばされがちです。",
    },
  ],
};
