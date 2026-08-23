import type { Track } from "../types";

export const webTrack: Track = {
  id: "web",
  no: "02",
  title: "Webの基礎",
  kicker: "HTTP",
  description: "URL、ステータスコード、Cookie など、HTTP の読み方を身につけます。",
  accent: "#6ec8c0",
  lessons: [
    {
      id: "letter",
      title: "HTTP のリクエストとレスポンス",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "ブラウザはサーバへリクエスト（要求）を送り、サーバはレスポンス（応答）を返します。このやり取りの約束が HTTP です。",
        },
        {
          type: "p",
          text: "次のような操作のとき、この往復が起きます。",
        },
        {
          type: "ul",
          items: [
            "アドレスバーに URL を入力して Enter を押したとき",
            "ページ上のリンク（ハイパーリンク）をクリックしたとき",
            "再読み込みや戻る／進むをしたとき",
            "フォームの送信ボタンを押したとき（ログイン、検索、登録など）",
            "HTML を受け取ったあと、ブラウザが CSS・画像・JS を取りに行くとき",
          ],
        },
        {
          type: "h2",
          text: "往復と画面",
        },
        {
          type: "p",
          text: "画面に出ているのは、返ってきた HTML をブラウザが表示したものです。不具合は画面で気づくことが多いですが、画面だけ見て原因を決めず、リクエストとレスポンスも確認しましょう。",
        },
        { type: "diagram", name: "http-roundtrip", caption: "ブラウザが送り、サーバが返す。画面は、返ってきた HTML を表示したものです。" },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "申請一覧を開いた瞬間です。ブラウザは GET /shinsei/requests を送り、返ってきた HTML が画面になります。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-list.jpg",
          alt: "申請くんの申請一覧画面",
          caption: "申請一覧。ブラウザは GET /shinsei/requests を送り、この HTML が返ります。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-list.jpg",
          alt: "申請一覧を開いたときの Network タブ",
          caption: "同じ操作の Network タブ。HTML（requests）も CSS も JS も 200 です。行は1つではありません。",
        },
        { type: "widget", name: "http" },
        {
          type: "callout",
          kind: "tip",
          title: "Network タブ",
          text: "不具合のときは、該当リクエストのステータスコードと応答本文を先に確認しましょう。Java のコードを見るのはそのあとです。",
        },
        {
          type: "h2",
          text: "画面を開くと、リクエストは複数",
        },
        {
          type: "p",
          text: "画面を開くと、HTML 以外に CSS、JS、画像のリクエストも飛びます。HTML の行が 500 なら、エラー画面や真っ白な画面になります。CSS の行が 404 なら、画面のレイアウトが崩れます。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-rows.jpg",
          alt: "申請一覧を開いた Network。HTML、CSS、JS が別の行",
          caption: "申請一覧を開いた Network。HTML（requests）のあとに CSS と JS が別の行です。どれも 200 です。",
        },
        { type: "diagram", name: "page-assets", caption: "画面を開いたとき、Network タブには複数行が出ます。" },
        {
          type: "h2",
          text: "HTML と JSON",
        },
        { type: "diagram", name: "html-json", caption: "同じ HTTP の往復。違うのは本文の形です。" },
        {
          type: "p",
          text: "HTML はブラウザが画面にする応答です。JSON はデータの形式で、画面の JS や他システムが読みます。JSON を返す HTTP の窓口は Web API と呼ばれることが多いです。",
        },
        {
          type: "h2",
          text: "往復の読み方",
        },
        {
          type: "p",
          text: "Network タブで行を選ぶと、次のものが見えます。意味の分解は、このあとのレッスンで行います。",
        },
        {
          type: "ul",
          items: [
            "宛先は URL、操作の種類は HTTP メソッド（GET / POST など）",
            "付加情報はヘッダ（Cookie、Content-Type など）",
            "成否の概略は HTTPステータスコード（200、404、500 など）",
            "本文は HTML、JSON、ファイルなど",
          ],
        },
        { type: "quiz", id: "web-roundtrip" },
      ],
    },
    {
      id: "url-method",
      title: "URL・HTTP メソッド・ステータスコード",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "リクエストは、URL と HTTP メソッドとステータスコードで読みます。",
        },
        {
          type: "h2",
          text: "URL の分解",
        },
        {
          type: "p",
          text: "https://intranet.example.co.jp/shinsei/requests/12 は次のように読めます。",
        },
        { type: "diagram", name: "url-parts" },
        {
          type: "table",
          headers: ["部分", "意味"],
          rows: [
            ["ホスト", "どのサーバ（またはその手前のLB）か"],
            ["/shinsei", "コンテキストパス。アプリの根っこ"],
            ["/requests/12", "アプリ内の資源。12番の申請"],
            ["?tab=history", "クエリ。同じ資源の見え方を変える"],
          ],
        },
        {
          type: "h2",
          text: "HTTP メソッド",
        },
        {
          type: "p",
          text: "HTTP メソッドは、操作の意味を表す約束です。",
        },
        {
          type: "ul",
          items: [
            "GET … 取得",
            "POST … 登録や送信",
            "PUT / PATCH … 更新",
            "DELETE … 削除",
          ],
        },
        {
          type: "p",
          text: "ただし、更新を POST だけで送る、削除を GET で呼ぶといった、約束と違う実装も現場では多いです。同じ URL でも HTTP メソッドが違えば、別の処理が呼ばれることがあります。切り分けでは、教科書どおりの意味より、実際に送っている HTTP メソッドと URL を見ましょう。",
        },
        { type: "diagram", name: "get-post" },
        {
          type: "h2",
          text: "HTTPステータスコード",
        },
        { type: "diagram", name: "status-codes" },
        {
          type: "table",
          headers: ["ステータスコード", "読み方"],
          rows: [
            ["200", "サーバは応答を返せた。業務的に正しいかは別"],
            ["302/303", "別URLへ誘導。ログインへ飛ばされた、POST 後のリダイレクトなど"],
            ["400", "送り方が不正。パラメータ不足、バリデーション"],
            ["401/403", "読み方は未ログイン / 権限不足。画面や実際のステータスコードはアプリによる"],
            ["404", "URLに対応する処理が無い、または資源が無い"],
            ["500", "サーバ側の失敗。エラーログを確認する"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ステータスコードの読み方と、アプリの応答",
          text: "403 は「権限が無い」と読むステータスコードです。権限不足が必ず 403 になるわけではありません。未ログインも 401 とは限らず、ログイン画面へ飛ばす実装が多いです。切り分けでは Network タブのステータスコードと本文を見ましょう。",
        },
        { type: "quiz", id: "web-status" },
      ],
    },
    {
      id: "params",
      title: "リクエストのパラメータ",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "リクエストには、操作の対象や条件を伝える値が付きます。これをパラメータと呼びます。URL のパスだけでは足りないとき、クエリ・フォーム・本文に載せます。",
        },
        {
          type: "p",
          text: "値が届かない、想定と違うときは、Network タブで「どこに何が載っているか」を先に確認しましょう。",
        },
        {
          type: "diagram",
          name: "request-params",
          caption: "載せ方はいくつかある。JSON の行は申請くんの API 登録です。GET と POST でよく使う場所が違う。",
        },
        {
          type: "table",
          headers: ["種類", "載る場所", "例"],
          rows: [
            ["パス", "URL の /12 の部分", "/shinsei/requests/12"],
            ["クエリ", "URL の ? 以降", "?status=PENDING&page=2"],
            ["フォーム", "POST の本文（form）", "title=休暇申請&approverId=3"],
            ["JSON", "POST / PUT の本文", '{"title":"休暇申請","approverId":3}'],
          ],
        },
        {
          type: "h2",
          text: "Network タブでの見方",
        },
        {
          type: "table",
          headers: ["欄の名前（例）", "中身"],
          rows: [
            ["Query String Parameters", "GET の ? 以降。検索条件やページ番号"],
            ["Form Data", "フォーム送信の name と値"],
            ["Request Payload", "JSON 本文。fetch で送る Web API で多い"],
          ],
        },
        {
          type: "p",
          text: "ブラウザやバージョンで欄の表示名は少し違います。載っているキーと値を見れば十分です。",
        },
        {
          type: "h2",
          text: "GET と POST",
        },
        {
          type: "ul",
          items: [
            "GET は、クエリに載せることが多い。一覧の絞り込みやページ番号など",
            "POST は、フォーム本文か JSON 本文に載せることが多い。登録・承認など",
            "現場では、更新を GET のクエリで送る実装もあります。約束より、実際に送っている内容を見ましょう",
          ],
        },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "申請 ID 12 の承認は POST /shinsei/requests/12/approve です。12 はパスに入っています。一覧に絞り込みを足すなら、GET /shinsei/requests?departmentId=5 のようにクエリに載せることが多いです。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "名前の不一致",
          text: "フォームの name と Controller の @RequestParam の名前が違うと、値が null のまま届くことがあります。400 やバリデーションエラーになることもあります。画面、Network タブ、Java の引数を並べて見ましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "本文の読み方はフレームワーク次第",
          text: "@RequestBody や @RequestParam など、引数への取り出し方は Spring の書き方です。JSON かフォームかで使う印が変わります。切り分けでは、まず Network タブでキーと値を確認しましょう。",
        },
        { type: "quiz", id: "web-params" },
      ],
    },
    {
      id: "headers",
      title: "ヘッダ",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "ヘッダはリクエスト側とレスポンス側の両方にあります。Network タブでは、行を選んで Headers 欄の Request Headers と Response Headers を切り替えて見ましょう。切り分けでは、まず返ってきたレスポンスのヘッダを見ることが多いです。",
        },
        {
          type: "p",
          text: "HTML か JSON かは、レスポンスの Content-Type を見ましょう。",
        },
        {
          type: "table",
          headers: ["Content-Type", "中身"],
          rows: [
            ["text/html", "画面。ブラウザが描画する"],
            ["application/json", "データ。Web API の応答"],
          ],
        },
        {
          type: "ul",
          items: [
            "Content-Type（レスポンス）… HTML か JSON か。API なのに HTML のログイン画面なら、認証リダイレクトの可能性が高い",
            "Location（レスポンス）… リダイレクト先。意図しない /login ならセッションか権限",
            "Set-Cookie（レスポンス）… サーバがブラウザへ渡す Cookie",
            "Cookie（リクエスト）… ブラウザが送る Cookie。ログイン状態の識別子",
            "Referer（リクエスト）… どの画面から POST されたか",
          ],
        },
        { type: "quiz", id: "web-api" },
      ],
    },
    {
      id: "session",
      title: "Cookie とセッション",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "HTTP は、前のリクエストを覚えていません。たとえば、ログイン済みかどうかも次のリクエストには引き継がれません。サーバはセッションを作り、その ID を Cookie としてブラウザに渡します。",
        },
        { type: "diagram", name: "session", caption: "ブラウザが持つのは鍵だけ。中身はサーバ側です。" },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "山田太郎でログインしたあとです。Cookie は ID だけです。表示名も権限も、サーバ側のセッションにあります。",
        },
        {
          type: "code",
          lang: "http",
          title: "ログイン成功の応答（例）",
          code: `HTTP/1.1 302 Found
Location: /shinsei/requests
Set-Cookie: JSESSIONID=AB12CD34; Path=/shinsei; HttpOnly`,
        },
        {
          type: "code",
          lang: "http",
          title: "続く一覧のリクエスト（例）",
          code: `GET /shinsei/requests HTTP/1.1
Host: intranet.example.co.jp
Cookie: JSESSIONID=AB12CD34`,
        },
        {
          type: "code",
          title: "サーバ側のセッション（例）",
          code: `ID: AB12CD34
ログインユーザ:
  id: 7
  username: yamada
  displayName: 山田太郎
  role: USER`,
        },
        {
          type: "p",
          text: "キーの名前やオブジェクトの形は、アプリとフレームワーク次第です。パスワードは Cookie には出ません。確認するのは、同じ ID でログインユーザを引けることです。",
        },
        {
          type: "ol",
          items: [
            "ログイン成功時、サーバがセッションを作り JSESSIONID を Set-Cookie する",
            "以降のリクエストでブラウザが Cookie を付ける",
            "サーバは ID からログインユーザを復元する",
            "タイムアウト、Cookie 削除、ドメイン / Path / Secure の不一致で未ログイン扱いになる",
          ],
        },
        { type: "quiz", id: "web-cookie" },
      ],
    },
    {
      id: "front-back",
      title: "フロントエンドとバックエンド",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "Web アプリは、動く場所で二つに分けて見ましょう。フロントエンドはブラウザ側、バックエンドはサーバ側です。境目は HTTP の往復です。",
        },
        { type: "diagram", name: "front-back", caption: "フロントとバックの境目は HTTP。データは DB にあります。" },
        {
          type: "table",
          headers: ["観点", "フロントエンド", "バックエンド", "DB"],
          rows: [
            ["動く場所", "ブラウザ", "サーバ（Java など）", "別プロセスの MySQL など"],
            ["すること", "画面を出す、リクエストを送る", "リクエストを受け、SQL を投げる、応答を返す", "データを保存し、SQL の結果を返す"],
            ["主な材料", "HTML、CSS、JavaScript", "Controller、Service、設定", "テーブル、行、マスタ"],
            ["見るもの", "画面、開発者ツール", "ソース、ログ、IDE のデバッガ", "件数、中身、承認者などの実データ"],
          ],
        },
        {
          type: "p",
          text: "申請くんのようにサーバで HTML を組み立てる場合、テンプレートはバックエンドにあります。ブラウザが描画するので、画面に出た結果だけだとフロントの問題に見えます。ボタンが出ないのは、th:if や権限のことが多いです。",
        },
        {
          type: "callout",
          kind: "note",
          title: "担当と、動く場所",
          text: "フロントエンド担当者とバックエンド担当者に分かれていることもあります。分かれていても、画面に出る HTML をサーバ側で書いている、ということはあります。",
        },
        {
          type: "h2",
          text: "どこを先に見るか",
        },
        {
          type: "p",
          text: "画面がおかしく見えても、原因はフロントとは限りません。症状で、先に見る場所を決めましょう。",
        },
        {
          type: "ul",
          items: [
            "見た目だけおかしい（色、位置、CSS の 404）→ フロント側を先に見る",
            "件数や中身がおかしい → 実行された SQL を見て、同じ条件で DB の行を数える",
            "500 が出る → サーバ側のエラーログ",
            "ボタンを押しても画面が変わらない → Network タブで、リクエストが飛んだか、応答は HTML か JSON かを確認しましょう",
          ],
        },
        {
          type: "p",
          text: "件数や中身は DB にあります。どの行が対象かは、実行された SQL の WHERE で決まります。コードが正しくても、その条件の行が無い、マスタが違う、別の DB を見ていると、画面は空や古い値になります。",
        },
        { type: "quiz", id: "web-front-back" },
      ],
    },
    {
      id: "front-roles",
      title: "HTML / CSS / JS",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "サーバ側の処理だけ見ても足りないことがあります。フォームの送信先や表示条件はテンプレート側にあります。Thymeleaf の読み方は「Javaアプリの構成」のテンプレートの読み方です。",
        },
        {
          type: "table",
          headers: ["見るもの", "確認すること"],
          rows: [
            ["form の action / method", "どの Controller に飛ぶか"],
            ["hidden 項目", "ID や CSRF トークンの有無"],
            ["th:if / c:if", "ボタンが出ないのは表示条件かもしれない"],
            ["name 属性", "サーバの Spring の @RequestParam と一致しているか（「リクエストのパラメータ」参照）"],
            ["fetch / XMLHttpRequest", "画面遷移しない更新。JSON の Web API が多い。ステータスコードと Content-Type を Network タブで確認しましょう"],
          ],
        },
        {
          type: "p",
          text: "画面遷移しない操作は、JS が別 URL（/api/requests など）へ JSON を取りに行きます。アドレスバーは変わらないので、Network タブの XHR / fetch を見ましょう。",
        },
        {
          type: "p",
          text: "CSS は見た目です。「ボタンが見えない」ことと「処理が無い」ことは別です。",
        },
      ],
    },
  ],
};
