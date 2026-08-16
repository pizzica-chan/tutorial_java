import type { Track } from "../types";

export const webTrack: Track = {
  id: "web",
  no: "01",
  title: "Webの基礎",
  kicker: "HTTP",
  description: "リクエスト、レスポンス、フロントとバック、ステータス、Cookie。",
  accent: "#6ec8c0",
  lessons: [
    {
      id: "letter",
      title: "リクエストとレスポンス",
      minutes: 8,
      summary: "ブラウザがリクエストを送り、サーバがレスポンスを返す。画面はその返事を表示したものです。",
      blocks: [
        {
          type: "p",
          text: "次のような操作のとき、ブラウザはサーバへリクエスト（要求）を送ります。サーバはレスポンス（応答）を返します。このやり取りの約束が HTTP です。",
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
          type: "p",
          text: "画面に見えるのは、返ってきた HTML をブラウザが表示したものです。不具合のときは、画面そのものより先に、このリクエストとレスポンスを見ます。",
        },
        { type: "diagram", name: "http-roundtrip", caption: "ブラウザが送り、サーバが返す。画面は、返ってきた HTML を表示したものです。" },
        {
          type: "ul",
          items: [
            "宛先は URL、操作の種類はメソッド（GET / POST など）",
            "付加情報はヘッダ（Cookie、Content-Type など）",
            "成否の概略はステータスコード（200、404、500 など）",
            "本文は HTML、JSON、ファイルなど",
          ],
        },
        { type: "diagram", name: "html-json", caption: "同じ HTTP の往復。違うのは本文の形です。" },
        {
          type: "p",
          text: "HTML はブラウザが画面にする応答です。JSON はデータで、画面の JS や他システムが読みます。Web API と呼ばれます。",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Network タブ",
          text: "不具合のときは、該当リクエストのステータスと応答本文を先に確認します。Java のコードを見るのはそのあとです。",
        },
        {
          type: "p",
          text: "1画面でも HTML 以外に CSS、JS、画像のリクエストが飛びます。HTML の 500 と、CSS の 404 では見る場所が違います。",
        },
        { type: "diagram", name: "page-assets", caption: "画面1つでも、Network には複数行が出ます。" },
        {
          type: "callout",
          kind: "note",
          title: "コード例：申請くん",
          text: "この教材の例は、架空の社内申請アプリ「申請くん」です。社員が申請を出し、承認者が承認する、という想定です。実在しません。下の HTTP は、その承認ボタンを押した瞬間です。",
        },
        { type: "widget", name: "http" },
      ],
    },
    {
      id: "front-back",
      title: "フロントエンドとバックエンド",
      minutes: 9,
      summary: "画面側とサーバ側。データは DB に保存されている。",
      blocks: [
        {
          type: "p",
          text: "Web アプリは、動く場所で二つに分けて見ます。フロントエンドはブラウザ側、バックエンドはサーバ側です。境目は HTTP の往復です。一覧に何件あるか、申請の中身は何かは、その奥の DB に保存されています。",
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
          text: "申請くんのようにサーバで HTML を組み立てる場合、テンプレートはバックエンドにあります。ブラウザが描画するので、画面に出た結果だけ見るとフロントの問題に見えます。ボタンが出ない、は th:if や権限のことが多いです。",
        },
        {
          type: "callout",
          kind: "note",
          title: "担当と、動く場所",
          text: "フロントエンド担当者とバックエンド担当者に分かれていることもあります。分かれていても、画面に出る HTML をサーバ側で書いている、ということはあります。",
        },
        {
          type: "h2",
          text: "DB を先に疑うとき",
        },
        {
          type: "p",
          text: "フロントは返ってきた結果を出します。バックエンドは SQL で DB を読み書きします。コードが正しくても、検証 DB に行が無い、マスタが違う、別の DB を見ているといった場合は、画面が空や古い値になります。",
        },
        {
          type: "ul",
          items: [
            "見た目だけおかしい（色、位置、CSS の 404）→ フロント側を先に見る",
            "件数や中身がおかしい → まず DB の行を見る。そのあと SQL とバックエンド",
            "500 が出る → バックエンドのログとスタックトレース",
            "ボタンを押しても画面が変わらない → Network で、リクエストが飛んだか、応答は HTML か JSON かを見る",
          ],
        },
        { type: "quiz", id: "web-front-back" },
      ],
    },
    {
      id: "url-method",
      title: "URL・メソッド・ステータス",
      minutes: 10,
      summary: "切り分けはパスとステータス番号から始めます。",
      blocks: [
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
          text: "GET と POST",
        },
        {
          type: "p",
          text: "GET は取得が基本で、再読込してもデータを変えにくい（副作用が小さい）ことが期待されます。POST は登録・更新・削除など、状態を変える操作に使います。画面のフォームでも、JSON を返す Web API でも、この意味は同じです。API では PUT / PATCH / DELETE もよく使います。",
        },
        { type: "diagram", name: "get-post" },
        {
          type: "h2",
          text: "ステータス",
        },
        { type: "diagram", name: "status-codes" },
        {
          type: "table",
          headers: ["番号", "読み方"],
          rows: [
            ["200", "サーバは応答を返せた。業務的に正しいかは別"],
            ["302/303", "別URLへ誘導。ログインへ飛ばされた、POST 後のリダイレクトなど"],
            ["400", "送り方が不正。パラメータ不足、バリデーション"],
            ["401/403", "番号の読み方は未ログイン / 権限不足。画面や実際の番号はアプリによる"],
            ["404", "URLに対応する処理が無い、または資源が無い"],
            ["500", "サーバ例外。スタックトレースを見る"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "番号の読み方と、アプリの応答",
          text: "403 は「権限が無い」と読む番号です。権限不足が必ず 403 になるわけではありません。未ログインも 401 とは限らず、ログイン画面へ飛ばす実装が多いです。切り分けでは Network の番号と本文を見ます。",
        },
        { type: "quiz", id: "web-status" },
      ],
    },
    {
      id: "headers",
      title: "ヘッダ",
      minutes: 8,
      summary: "Content-Type、Cookie、Location、Referer。",
      blocks: [
        {
          type: "p",
          text: "本文より先に、ヘッダで状況が分かることがあります。HTML か JSON かは Content-Type を見ます。",
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
            "Content-Type … HTML か JSON か。API なのに HTML のログイン画面なら、認証リダイレクトの可能性が高い",
            "Location … リダイレクト先。意図しない /login ならセッションか権限",
            "Set-Cookie / Cookie … ログイン状態の識別子",
            "Referer … どの画面から POST されたか",
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "Ajax と 302",
          text: "JSON を期待しているのに 302 で HTML が返ると、フロントはパースエラーとだけ出ることがあります。Network でステータスと Content-Type を見ます。",
        },
        { type: "quiz", id: "web-api" },
      ],
    },
    {
      id: "session",
      title: "Cookie とセッション",
      minutes: 9,
      summary: "HTTP は状態を持たない。サーバが ID で対応づける。",
      blocks: [
        {
          type: "p",
          text: "HTTP の1回のやり取りには、ログイン済みかどうかの記憶がありません。サーバはセッションを作り、その ID を Cookie としてブラウザに渡します。",
        },
        { type: "diagram", name: "session", caption: "ブラウザが持つのは鍵だけ。中身はサーバ側です。" },
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
      id: "front-roles",
      title: "HTML / CSS / JS",
      minutes: 8,
      summary: "送信先、hidden、表示条件を読む。",
      blocks: [
        {
          type: "p",
          text: "サーバ側の処理だけ見ても足りないことがあります。フォームの送信先や表示条件はテンプレート側にあります。",
        },
        {
          type: "table",
          headers: ["見るもの", "確認すること"],
          rows: [
            ["form の action / method", "どの Controller に飛ぶか"],
            ["hidden 項目", "ID や CSRF トークンの有無"],
            ["th:if / c:if", "ボタンが出ないのは表示条件かもしれない"],
            ["name 属性", "サーバの Spring の @RequestParam と一致しているか"],
            ["fetch / XMLHttpRequest", "画面遷移しない更新。JSON の Web API が多い。ステータスと Content-Type を Network で見る"],
          ],
        },
        {
          type: "p",
          text: "画面遷移しない操作は、JS が別 URL（/api/requests など）へ JSON を取りに行きます。アドレスバーは変わらないので、Network の XHR / fetch を見ます。",
        },
        {
          type: "p",
          text: "CSS は見た目です。「ボタンが見えない」ことと「処理が無い」ことは別です。",
        },
      ],
    },
  ],
};
