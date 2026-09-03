import type { Track } from "../types";
import { shinseiLayoutStaticSnippet } from "../data/project";

export const webTrack: Track = {
  id: "web",
  no: "02",
  title: "Webの基礎",
  kicker: "HTTP",
  description: "URL、ステータスコード、Cookie など、HTTP の読み方を身につけます。",
  accent: "#4fb0a5",
  lessons: [
    {
      id: "letter",
      title: "HTTP のリクエストとレスポンス",
      minutes: 11,
      blocks: [
        {
          type: "p",
          text: "URL を入力して Enter を押す、リンクをクリックする。ふだん何気なくしているその操作のたびに、裏側では次のようなやり取りが起きています。ブラウザは、インターネットの先にあるサーバというコンピュータに何かを頼みます。サーバはそれに応え、結果を返します。ブラウザは、返ってきた中身をもとに画面を組み立てて表示します。",
        },
        {
          type: "p",
          text: "この「頼む」をリクエスト（要求）、「返す」をレスポンス（応答）と呼びます。この一往復のやり取りの約束事が HTTP です。",
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
            "更新、戻る、進むのボタンを押したとき",
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
        { type: "diagram", name: "http-roundtrip", caption: "ブラウザが送り、サーバが返す。" },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "申請くんは、この教材で使う架空の社内申請アプリです。以降の URL やソースの例には、申請くんのものが出てきます。",
        },
        {
          type: "p",
          text: "次は、申請一覧を開いた瞬間の画面です。ブラウザは `/shinsei/requests` へ GET リクエストを送ります。サーバから返ってきた HTML が、そのまま画面になります。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-list.jpg",
          alt: "申請くんの申請一覧画面",
          caption: "申請一覧。ブラウザは `/shinsei/requests` へ GET リクエストを送り、レスポンスとしてこの HTML を受け取ります。",
        },
        {
          type: "p",
          text: "実際のリクエストとレスポンスは、次のようなテキストです。",
        },
        { type: "widget", name: "http" },
        {
          type: "h2",
          text: "1画面で複数のリクエスト",
        },
        {
          type: "p",
          text: "ブラウザは、まず画面の HTML を取ります。HTML の中には、CSS や JS、画像などの URL が書いてあります。ブラウザはそれを見て、それぞれ別のリクエストを送ります。",
        },
        {
          type: "p",
          text: "開発者ツール（Chrome や Edge では F12、または右クリック→「検証」）を開き、Network タブを見ると、HTML のあとにそれらの行が並びます。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-rows.jpg",
          alt: "申請一覧を開いた Network。HTML、CSS、JS が別の行",
          caption: "申請一覧を開いた Network タブ。HTML（requests）のあとに、CSS と JS が別の行として並びます。",
        },
        { type: "diagram", name: "page-assets" },
        {
          type: "h2",
          text: "HTML と JSON",
        },
        { type: "diagram", name: "html-json", caption: "同じ HTTP の往復です。違うのは本文の形です。" },
        {
          type: "p",
          text: "HTML は、ブラウザが画面として表示するためのデータ形式です。JSON は、画面の JavaScript や他のシステムが読み取るためのデータ形式です。JSON を返す URL は、Web API と呼ばれることが多いです。",
        },
        {
          type: "p",
          text: "申請一覧を HTML で返すと、次のようになります。",
        },
        {
          type: "code",
          lang: "http",
          title: "HTML のレスポンス（例）",
          highlightLines: [2],
          code: `HTTP/1.1 200 OK
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
        },
        {
          type: "p",
          text: "同じ申請データを JSON で返すと、次のようになります。見出しや表は無く、名前と値が並びます。",
        },
        {
          type: "code",
          lang: "http",
          title: "JSON のレスポンス（例）",
          highlightLines: [2],
          code: `HTTP/1.1 200 OK
Content-Type: application/json

[
  {"id": 16, "title": "研修参加", "status": "PENDING"},
  {"id": 13, "title": "休暇申請", "status": "PENDING"}
]`,
        },
        {
          type: "p",
          text: "どちらも HTTP のレスポンスです。違うのは `Content-Type` と本文の形です。",
        },
      ],
    },
    {
      id: "url-method",
      title: "URL・HTTP メソッド・ステータスコード",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "ここから、リクエストとレスポンスを具体的に読む方法を見ていきます。まずは URL、HTTP メソッド、ステータスコードの3つです。",
        },
        {
          type: "h2",
          text: "URL の分解",
        },
        {
          type: "p",
          text: "`https://intranet.example.co.jp/shinsei/requests/history?status=PENDING` は次のように読めます。",
        },
        { type: "diagram", name: "url-parts" },
        {
          type: "table",
          headers: ["部分", "意味"],
          rows: [
            ["ホスト", "どのサーバか"],
            ["`/shinsei`", "コンテキストパス。アプリの根っこ"],
            ["`/requests/history`", "アプリ内のパス。申請履歴の検索画面"],
            ["`?status=PENDING`", "クエリ。絞り込みなどの条件"],
          ],
        },
        {
          type: "h2",
          text: "HTTP メソッド",
        },
        {
          type: "p",
          text: "HTTP メソッドは、操作の意味を表す約束事です。",
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
          text: "ただし、更新を POST だけで送る、削除を GET で呼ぶといった、約束事と違う実装も現場では多いです。同じ URL でも HTTP メソッドが違えば、別の処理が呼ばれることがあります。実務では、教科書どおりの意味より、実際に送っている HTTP メソッドと URL を見ましょう。",
        },
        { type: "diagram", name: "get-post" },
        {
          type: "h2",
          text: "HTTPステータスコード",
        },
        {
          type: "p",
          text: "ステータスコードは、応答の結果を表す3桁の数字です。",
        },
        { type: "diagram", name: "status-codes" },
        {
          type: "table",
          headers: ["ステータスコード", "読み方"],
          rows: [
            ["200", "サーバは応答を返せた。業務的に正しいかは別"],
            ["302/303", "別 URL へ誘導。ログインへ飛ばされた、POST 後のリダイレクトなど"],
            ["400", "送り方が不正。パラメータ不足、バリデーション"],
            ["401/403", "読み方は未ログイン / 権限不足。画面や実際のステータスコードはアプリによる"],
            ["404", "URL に対応する処理が無い、または資源が無い"],
            ["500", "サーバ側の失敗。エラーログを確認する"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ステータスコードの読み方と、アプリの応答",
          text: "403 は「権限が無い」と読むステータスコードです。権限不足が必ず 403 になるわけではありません。未ログインも 401 とは限らず、ログイン画面へ飛ばす実装が多いです。実務では Network タブのステータスコードと本文を見ましょう。",
        },
        { type: "quiz", id: "web-status" },
      ],
    },
    {
      id: "params",
      title: "リクエストのパラメータ",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "リクエストには、操作の対象や条件を伝える値が付きます。これをパラメータと呼びます。載る場所は、パス・クエリ・本文（フォームや JSON）のいずれかです。",
        },
        {
          type: "p",
          text: "値が届かない、想定と違うときは、Network タブで「どこに何が載っているか」を先に確認しましょう。",
        },
        {
          type: "diagram",
          name: "request-params",
          caption: "載せ方はいくつかあります。JSON の行は、申請を新しく登録するときの例です。GET と POST でよく使う場所が違います。",
        },
        {
          type: "table",
          headers: ["種類", "載る場所", "例"],
          rows: [
            ["パス", "URL の /12 の部分", "`/shinsei/requests/12`"],
            ["クエリ", "URL の ? 以降", "`?status=PENDING`"],
            ["フォーム", "POST の本文（form）", "`title=休暇申請&approverId=3`"],
            ["JSON", "POST / PUT の本文", '`{"title":"休暇申請","approverId":3}`'],
          ],
        },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "h3",
          text: "パス",
        },
        {
          type: "p",
          text: "申請くんの申請詳細画面では、URL のパスの `/12` で、表示する申請を指定しています。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-detail-path.jpg",
          alt: "申請詳細のアドレスバーが /shinsei/requests/12。画面の申請IDも 12",
          caption: "申請詳細。アドレスバーの `/12` が申請IDです。",
        },
        {
          type: "h3",
          text: "クエリ",
        },
        {
          type: "p",
          text: "申請履歴の検索では、検索条件が URL のクエリに載ります。アドレスバーの `?` 以降と、フォームの入力が対応しています。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-history-search-query.jpg",
          alt: "申請履歴の検索。アドレスバーに title=申請 と status=APPROVED。フォームの件名とステータスがそれに対応",
          caption: "申請履歴の検索。アドレスバーの `?` 以降が、フォームの件名・ステータスと対応しています。",
        },
        {
          type: "p",
          text: "Network タブでは次の欄に出ます。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-history-search-request.jpg",
          alt: "Network の Payload。Query String Parameters に title と status がある",
          caption: "Payload の Query String Parameters。GET の `?` 以降のキーと値です。",
          size: "small",
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
          type: "h3",
          text: "承認",
        },
        {
          type: "p",
          text: "ここでは、山田が承認できる別の申請（ID 15）を例にします。承認は `POST /shinsei/requests/15/approve` です。15 はパスに入っているので、フォーム本文には載りません。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-approve-payload.jpg",
          alt: "承認 POST の Payload。Form Data に _csrf だけがある",
          caption: "承認 POST の Payload。Form Data には CSRF トークンだけが載り、申請 ID はここには出てきません。",
          size: "small",
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
            "現場では、更新を GET のクエリで送る実装もあります。約束事より、実際に送っている内容を見ましょう",
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "名前の不一致",
          text: "フォームの `name` と、サーバ側で受け取る名前（Spring なら `@RequestParam`）が違うと、値が null のまま届くことがあります。400 やバリデーションエラーになることもあります。画面、Network タブ、Java の引数を並べて見ましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "本文の読み方はフレームワーク次第",
          text: "`@RequestBody` や `@RequestParam` など、引数への取り出し方は Spring の書き方です。JSON かフォームかで使う印が変わります。実務では、まず Network タブでキーと値を確認しましょう。",
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
          text: "ヘッダはリクエスト側とレスポンス側の両方にあります。Network タブでは、行を選んで Headers 欄の Response Headers と Request Headers を見ましょう。実務では、まず返ってきたレスポンスのヘッダを見ることが多いです。",
        },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "申請一覧を開いたときの、実際の Headers です。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-headers-detail.jpg",
          alt: "Network タブの Headers。Response headers に Content-Type、Request Headers に Cookie が見える",
          caption: "上が Response headers、下が Request Headers。`Content-Type` はレスポンス側、`Cookie` はリクエスト側にあります。",
        },
        {
          type: "p",
          text: "HTML か JSON かは、レスポンスの `Content-Type` を見ましょう。",
        },
        {
          type: "table",
          headers: ["`Content-Type`", "中身"],
          rows: [
            ["`text/html`", "画面。ブラウザが描画する"],
            ["`application/json`", "データ。Web API の応答"],
          ],
        },
        {
          type: "ul",
          items: [
            "`Content-Type`（レスポンス）… HTML か JSON か",
            "`Location`（レスポンス）… リダイレクト先",
            "`Set-Cookie`（レスポンス）… サーバがブラウザへ渡す Cookie",
            "`Cookie`（リクエスト）… ブラウザが送る Cookie。ログイン状態の識別子",
            "`Referer`（リクエスト）… どの画面から POST されたか",
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
          text: "HTTP は、前のリクエストを覚えていません。たとえば、ログイン済みかどうかも次のリクエストには引き継がれません。そこでサーバはセッションを作り、ログイン情報はサーバ側に置いたまま、そのセッションを指す ID だけを Cookie としてブラウザに渡します。",
        },
        { type: "diagram", name: "session", caption: "ブラウザが持つのはキーだけです。中身はサーバ側にあります。" },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "以下は、山田太郎でログインしたあとの例です。Cookie は ID だけで、表示名や権限はサーバ側のセッションにあります。",
        },
        {
          type: "code",
          lang: "http",
          title: "ログイン成功の応答（例）",
          highlightLines: [3],
          code: `HTTP/1.1 302 Found
Location: /shinsei/requests
Set-Cookie: JSESSIONID=AB12CD34; Path=/shinsei; HttpOnly`,
        },
        {
          type: "code",
          lang: "http",
          title: "続く一覧のリクエスト（例）",
          highlightLines: [3],
          code: `GET /shinsei/requests HTTP/1.1
Host: intranet.example.co.jp
Cookie: JSESSIONID=AB12CD34`,
        },
        {
          type: "p",
          text: "サーバは、この `JSESSIONID` をキーにセッションを取り出します。",
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
          text: "中身の持ち方は、アプリとフレームワーク次第です。パスワードは Cookie には出ません。",
        },
        {
          type: "code",
          title: "セッションから取り出す（申請くん・Controller）",
          lang: "java",
          highlightLines: [1],
          code: `public String list(Model model, @AuthenticationPrincipal LoginUser user) {
  model.addAttribute("applications", requestService.findMine(user.getId()));
  return "request/list";
}`,
        },
        {
          type: "p",
          text: "`@AuthenticationPrincipal` が、セッションに結び付いたログインユーザを渡します。`user.getId()` が、上のセッションの `id: 7` にあたります。Cookie の値そのものを読み取っているわけではありません。ここで確認できるのは、同じ ID でログインユーザを取り出せていることです。",
        },
        {
          type: "h2",
          text: "ログインユーザ以外の情報を扱う",
        },
        {
          type: "p",
          text: "セッションに乗せられるのは、ログインユーザだけではありません。任意の情報を `HttpSession` に直接読み書きできます。次は申請くんではない、一般的な例です。",
        },
        {
          type: "code",
          title: "セッションへの読み書き（例。申請くんではありません）",
          lang: "java",
          highlightLines: [8, 14],
          code: `@PostMapping("/cart/add")
public String addToCart(@RequestParam String itemId, HttpSession session) {
  List<String> cart = (List<String>) session.getAttribute("cart");
  if (cart == null) {
    cart = new ArrayList<>();
  }
  cart.add(itemId);
  session.setAttribute("cart", cart);
  return "redirect:/cart";
}

@GetMapping("/cart")
public String showCart(HttpSession session, Model model) {
  List<String> cart = (List<String>) session.getAttribute("cart");
  model.addAttribute("items", cart != null ? cart : List.of());
  return "cart";
}`,
        },
        {
          type: "p",
          text: "`addToCart` で `session.setAttribute` した値を、別のリクエストで動く `showCart` が `session.getAttribute` で読み出しています。キーの名前（ここでは `cart`）を揃えれば、同じセッションの中で値を受け渡せます。",
        },
        {
          type: "p",
          text: "このキーの文字列がずれると、値は静かに取り出せなくなります。実際にこれが起きた例は、「実務のシナリオ」の「申請履歴から詳細を開いて戻ると、検索条件が消える」で扱います。",
          link: {
            label: "申請履歴から詳細を開いて戻ると、検索条件が消える",
            to: "/tracks/scenario/history-back",
          },
        },
        {
          type: "p",
          text: "ここまでの流れは、セッション作成 → Cookie 付与 → ID からの復元、です。タイムアウト、Cookie 削除、ドメイン / Path / Secure の不一致があると、セッションが切れて値が消えます。ログイン情報なら未ログイン扱いになります。",
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
          text: "フロントエンドはブラウザで画面を出し、バックエンドはサーバでリクエストを処理します。あいだのやり取りが HTTP です。",
        },
        { type: "diagram", name: "front-back", caption: "フロントとバックの境目は HTTP。データは DB にあります。" },
        {
          type: "table",
          headers: ["観点", "フロントエンド", "バックエンド", "DB"],
          rows: [
            ["動く場所", "ブラウザ", "サーバ（Java など）", "別プロセスの MySQL など"],
            ["すること", "画面を出す、リクエストを送る", "リクエストを受け、SQL を投げる、応答を返す", "データを保存し、SQL の結果を返す"],
            ["主な材料", "HTML、CSS、JavaScript", "Controller、Service、設定", "テーブル、レコード、マスタ"],
            ["見るもの", "画面、開発者ツール", "ソース、ログ、IDE のデバッガ", "件数、中身、承認者などの実データ"],
          ],
        },
        {
          type: "p",
          text: "申請くんのようにサーバ側で画面用 HTML を返すアプリでは、バックエンドがテンプレートをもとに HTML を動的に組み立てます。ブラウザは、返ってきた HTML を画面として表示します。",
        },
        {
          type: "p",
          text: "JSON を受け取ってブラウザが画面を組む形もあります。申請くんの画面はこの形ではありません。短い例は、この章の「Ajax」から順に説明します。",
          link: {
            label: "Ajax",
            to: "/tracks/web/ajax",
          },
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
          text: "画面がおかしく見えても、原因はフロントとは限りません。先に確認する場所を、症状で決めましょう。",
        },
        {
          type: "ul",
          items: [
            "見た目だけおかしい（色、位置、CSS の 404）→ フロント側を先に見る",
            "件数や中身がおかしい → 実行された SQL を見て、同じ条件で DB のレコードを数える",
            "500 が出る → サーバ側のエラーログ",
            "ボタンを押しても画面が変わらない → Network タブで、リクエストが飛んだか、応答は HTML か JSON かを確認",
          ],
        },
        {
          type: "p",
          text: "件数や中身は DB にあります。どのレコードが対象かは、実行された SQL の WHERE で決まります。コードが正しくても、その条件のレコードが無い、マスタが違う、別の DB を見ていると、画面には何も出ない、または古い値が残ります。",
        },
        { type: "quiz", id: "web-front-back" },
      ],
    },
    {
      id: "front-roles",
      title: "HTML / CSS / JavaScript の役割",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "ブラウザに表示される画面には、HTML、CSS、JavaScript が関わります。まず、それぞれが何を担当するかを分けて見ましょう。",
        },
        {
          type: "table",
          headers: ["技術", "主な役割", "申請くんで見る例"],
          rows: [
            ["HTML", "見出し、入力欄、ボタンなど、画面の要素を表す", "form、input、button"],
            ["CSS", "色、位置、余白、表示・非表示など、見え方を指定する", "ボタンの色、表の幅、レイアウト"],
            ["JavaScript", "ページを開いたときや操作したときに、画面を変えたり HTTP 通信を始めたりする", "確認ダイアログ"],
          ],
        },
        {
          type: "h2",
          text: "HTML テンプレート：送る内容と表示条件",
        },
        {
          type: "p",
          text: "申請くんでは、サーバが Thymeleaf テンプレートから HTML を組み立てます。フォームの送信先や、ボタンを表示する条件を追うときは、Java のコードとテンプレートの両方を確認します。Thymeleaf の基本は、「テンプレートの読み方」で説明しています。",
          link: {
            label: "テンプレートの読み方",
            to: "/tracks/java-map/template-read",
          },
        },
        {
          type: "table",
          headers: ["テンプレートで見るもの", "確認すること"],
          rows: [
            ["form の action / method", "送信先の URL と HTTP メソッド"],
            ["input の name / hidden", "サーバへ送る項目、ID、CSRF トークン"],
            ["`th:if`", "サーバがその要素を HTML に出す条件"],
          ],
        },
        {
          type: "h2",
          text: "ページを開いたときの順番",
        },
        {
          type: "p",
          text: "ブラウザは、返ってきた HTML を上から順に読んで、画面を組み立てます。",
        },
        {
          type: "p",
          text: "途中で `<link>` や `<script>` に当たると、その CSS や JavaScript を別のリクエストで取りに行きます。",
        },
        {
          type: "p",
          text: "`defer` のような指定が付いていなければ、読み込んだ JavaScript は、その `<script>` の位置で実行されます。",
        },
        {
          type: "p",
          text: "その時点では、`<script>` より下に書かれた要素はまだ読み込まれていません。JavaScript から探しても見つかりません。",
        },
        {
          type: "p",
          text: "画面の要素を探す JavaScript は、要素が読み込まれたあとに動く必要があります。申請くんには、そのための書き方が2つ出てきます。",
        },
        {
          type: "h3",
          text: "defer を付ける",
        },
        {
          type: "code",
          title: "fragments/layout.html（抜粋）",
          lang: "html",
          highlightLines: [3],
          code: shinseiLayoutStaticSnippet,
        },
        {
          type: "p",
          text: "`app.js` は `<head>` から読み込みますが、`<script>` に `defer` が付いています。`defer` が付いた JavaScript は、HTML を最後まで読み終えてから実行されます。",
        },
        {
          type: "p",
          text: "もし `defer` が無ければ、`app.js` は `<head>` の位置で実行されます。その時点では申請詳細画面の承認フォームがまだ読み込まれていないので、`document.querySelectorAll(\"form.js-approve-confirm\")` は1件も見つけられません。",
        },
        {
          type: "h3",
          text: "要素より下に置く",
        },
        {
          type: "p",
          text: "申請一覧の画面は、`list.js` を表よりあとで読み込みます。",
        },
        {
          type: "code",
          title: "request/list.html（末尾）",
          lang: "html",
          highlightLines: [3],
          code: `    </tbody>
  </table>
  <script th:src="@{/js/list.js}"></script>
</main>`,
        },
        {
          type: "p",
          text: "この `<script>` に `defer` はありません。ブラウザがこの行を読む時点では、上の表と承認フォームがすでに読み込まれています。`list.js` は、その要素を探せます。",
        },
        {
          type: "table",
          headers: ["書き方", "申請くんの例", "JavaScript が動くとき"],
          rows: [
            ["`<script>` に `defer` を付ける", "`fragments/layout.html` の `app.js`", "HTML を最後まで読み終えたあと"],
            ["`<script>` を要素より下に置く", "`request/list.html` の `list.js`", "その `<script>` の行を読んだとき"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ほかのアプリで見る書き方",
          text: "申請くんには出てきませんが、`DOMContentLoaded` を待ってから処理を始める書き方もよくあります。HTML を最後まで読み終えたときに動くので、`defer` と同じように、要素がそろってから実行できます。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "エラーが出ないこともある",
          text: "要素が見つからないとき、`document.querySelectorAll` は0件を返すだけです。例外にならないので、コンソールにも何も出ません。イベントの処理が登録されず、ボタンを押しても何も起きない、という見え方になります。",
        },
        {
          type: "p",
          text: "JavaScript が画面の要素を見つけられないときは、`<script>` の位置と `defer` の有無を確認しましょう。要素が HTML にそもそも無いのか、実行の時点でまだ読み込まれていないのかで、直す場所が変わります。",
        },
        {
          type: "h2",
          text: "JavaScript：画面の更新と HTTP 通信",
        },
        {
          type: "p",
          text: "ボタンを押してもページが切り替わらないときは、JavaScript が画面だけを更新している場合と、HTTP 通信を始めている場合があります。まず Network タブで新しい通信があるかを確認しましょう。ページを開いたまま通信する方法は、次の「Ajax」で説明します。",
          link: {
            label: "Ajax",
            to: "/tracks/web/ajax",
          },
        },
        {
          type: "p",
          text: "新しい通信が無いときは、Console に JavaScript の例外が出ていないかを確認しましょう。通信せずに画面内の表示だけを変える処理なら、処理の前後で HTML の要素がどう変わったかを Elements タブで見ましょう。",
        },
        {
          type: "h2",
          text: "CSS：要素の見え方",
        },
        {
          type: "p",
          text: "ボタンが見えないときは、開発者ツールの Elements タブでボタンの要素があるかを確認しましょう。要素が無ければ、HTML テンプレートの表示条件や JavaScript を調べましょう。要素があれば、CSS で隠れていないか、画面の外に出ていないか、ほかの要素に覆われていないかを確認しましょう。",
        },
        {
          type: "p",
          text: "HTML は要素と送る内容、JavaScript は画面の更新と通信、CSS は見え方を担当します。症状に関係する役割から確認すると、画面側のすべてを一度に読む必要はありません。",
        },
        { type: "quiz", id: "web-front-roles" },
      ],
    },
    {
      id: "ajax",
      title: "Ajax",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "ページ全体を読み直さず、JavaScript から HTTP 通信する方法を Ajax と呼びます。通信のあと、JavaScript が必要な部分だけ画面を更新できます。",
        },
        {
          type: "h2",
          text: "ページ遷移との違い",
        },
        {
          type: "table",
          headers: ["方法", "よくある見え方", "通信を始めるもの"],
          rows: [
            ["リンクやフォーム送信", "別のページへ移る、またはページ全体を読み直す", "ブラウザ"],
            ["Ajax", "今のページを残し、必要な部分を更新する", "JavaScript"],
          ],
        },
        {
          type: "p",
          text: "アドレスバーが変わらなくても、HTTP 通信が無いとは限りません。画面内の検索、候補表示、一覧を追加で読み込む動きなどで Ajax が使われることがあります。",
        },
        {
          type: "h2",
          text: "XMLHttpRequest と fetch",
        },
        {
          type: "p",
          text: "既存のコードでは XMLHttpRequest や jQuery の $.ajax、比較的新しいコードでは fetch を使う例があります。どれも、JavaScript から HTTP 通信を始めるために使えます。",
        },
        {
          type: "p",
          text: "XMLHttpRequest や Ajax には XML という名前が入っていますが、応答は XML に限りません。現在は JSON を受け取る通信も多くあります。",
        },
        {
          type: "p",
          text: "Ajax で表だけを更新するアプリでは、サーバが HTML の一部分だけを返すことがあります。申請くんはページ全体を返すので、この動きはありません。",
        },
        {
          type: "h2",
          text: "通信があるか、Network タブで見る",
        },
        {
          type: "p",
          text: "Ajax かどうかは、画面やアドレスバーだけでは分かりにくいことがあります。開発者ツールの Network タブを開き、Fetch/XHR を選びましょう。ここに並ぶのは、JavaScript から始めた通信です。検索や、一覧を追加で読み込む動きなどを試したあと、行が増えていれば Ajax で通信しています。",
        },
        {
          type: "p",
          text: "行を開くと、送信先、ステータスコード、応答の本文を確認できます。本文は JSON のことも、HTML の一部分のこともあります。行自体が無ければ、ブラウザの Console に JavaScript の例外が出ていないかを確認しましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "Ajax、Web API、JSON の違い",
          text: "Ajax は通信の方法です。Web API はデータを提供する HTTP の窓口、JSON は送受信するデータ形式です。Ajax の通信先が Web API で、その応答が JSON、という組み合わせがあります。",
        },
        {
          type: "p",
          text: "次は、実際に Web API から JSON を受け取る例を見ます。",
          link: {
            label: "Web API から JSON を受け取る",
            to: "/tracks/web/api-json",
          },
        },
        { type: "quiz", id: "web-ajax" },
      ],
    },
    {
      id: "api-json",
      title: "Web API から JSON を受け取る",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "申請くんの一覧画面は、サーバが作った HTML を表示します。同じ申請データを、画面ではなく JSON で受け取る URL もあります。",
        },
        {
          type: "p",
          text: "`GET /shinsei/api/requests` は、申請一覧のデータを返します。このように、データを HTTP で提供する窓口を Web API と呼びます。",
        },
        {
          type: "h2",
          text: "JSON の応答",
        },
        {
          type: "p",
          text: "前に見た HTML の応答には、申請データに加えて、見出し、表、ボタンなど、画面を組み立てる要素が含まれていました。一方、次の JSON の応答には申請データだけが入っています。JSON の場合に画面をどう組み立てるかは、次の「JSON から画面を作る」で確認します。",
          link: {
            label: "JSON から画面を作る",
            to: "/tracks/web/json-ui",
          },
        },
        {
          type: "p",
          text: "山田でログインして一覧 API を呼んだときの応答から、1 件だけ抜粋します。HTML の画面ではなく、名前と値が並ぶデータです。",
        },
        {
          type: "code",
          title: "GET /shinsei/api/requests の応答から 1 件を抜粋",
          lang: "json",
          code: `{
  "id": 16,
  "title": "研修参加",
  "status": "PENDING",
  "applicantId": 7,
  "approverId": null,
  "applicantEmail": "yamada@example.co.jp",
  "createdAt": "2026-04-13T10:00:00"
}`,
        },
        {
          type: "h2",
          text: "ブラウザから取得する",
        },
        {
          type: "p",
          text: "JavaScript では fetch を使って Web API を呼べます。この例では画面と API が同じオリジン（URL のスキーム・ホスト・ポートが同じ）にあるため、ログイン済みならセッション Cookie も送られます。",
        },
        {
          type: "p",
          text: "JavaScript の文法を細かく追う必要はありません。流れだけ見ましょう。",
        },
        {
          type: "code",
          title: "一覧 API を呼ぶ",
          lang: "javascript",
          highlightLines: [3, 4, 7],
          code: `fetch("/shinsei/api/requests")
  .then((res) => {
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    if (!res.headers.get("content-type")?.includes("application/json")) {
      throw new Error("JSON ではありません");
    }
    return res.json();
  })
  .then((data) => console.log(data))
  .catch((error) => console.error(error));`,
        },
        {
          type: "steps",
          items: [
            { title: "Web API へ GET", text: "ブラウザが `/shinsei/api/requests` を送ります。" },
            { title: "応答の種類を確認", text: "ステータスコードが成功で、`Content-Type` が `application/json` かを確認します。" },
            { title: "JSON を読む", text: "成功した応答の本文を `res.json()` で読み取ります。" },
          ],
        },
        {
          type: "p",
          text: "Web API は画面専用ではありません。同じデータを、ブラウザの画面、モバイルアプリ、ほかのサーバなどから利用できます。",
        },
        { type: "quiz", id: "web-api-json" },
      ],
    },
    {
      id: "json-ui",
      title: "JSON から画面を作る",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "前の項目では、Web API から申請一覧の JSON を受け取りました。次は、その JSON をブラウザの一覧として表示します。",
        },
        {
          type: "p",
          text: "下の例では React を使います。React の文法を覚えるのではなく、JSON が画面になるまでの流れを見ましょう。React の `fetch` が受け取るのは、次のような JSON の配列です。前の項目で見た 1 件の抜粋が、複数並んだものと考えましょう。",
        },
        {
          type: "code",
          title: "GET /shinsei/api/requests の応答（React が受け取る JSON）",
          lang: "json",
          code: `[
  {
    "id": 16,
    "title": "研修参加",
    "status": "PENDING",
    "applicantId": 7,
    "approverId": null,
    "applicantEmail": "yamada@example.co.jp",
    "createdAt": "2026-04-13T10:00:00"
  },
  {
    "id": 13,
    "title": "休暇申請",
    "status": "PENDING",
    "applicantId": 7,
    "approverId": 3,
    "applicantEmail": "yamada@example.co.jp",
    "createdAt": "2026-04-10T09:15:00"
  }
]`,
        },
        {
          type: "code",
          title: "React で一覧を組む例",
          lang: "javascript",
          highlightLines: [15, 21, 23],
          code: `import { useEffect, useState } from "react";

function RequestList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/shinsei/api/requests")
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        if (!res.headers.get("content-type")?.includes("application/json")) {
          throw new Error("JSON ではありません");
        }
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.title}（{item.status}）
        </li>
      ))}
    </ul>
  );
}`,
        },
        {
          type: "steps",
          items: [
            { title: "JSON を受け取る", text: "fetch が一覧 API の応答を読みます。" },
            { title: "React の state に入れる", text: "`setItems` で、React が管理する値を更新します。" },
            { title: "一覧を作る", text: "`items.map` が JSON の各要素を一覧の行にします。" },
          ],
        },
        {
          type: "p",
          text: "先ほどの JSON（2件）を `items.map` に渡すと、ブラウザには次の HTML が組み立てられます。`key` は React が内部で使う目印なので、実際の HTML には出ません。",
        },
        {
          type: "code",
          title: "組み立てられたあとの HTML",
          lang: "html",
          code: `<ul>
  <li>研修参加（PENDING）</li>
  <li>休暇申請（PENDING）</li>
</ul>`,
        },
        {
          type: "p",
          text: "item.title と item.status は、前の項目で見た JSON の title と status です。プロパティ名が違うと、画面には出ません。",
        },
        {
          type: "h2",
          text: "HTML に一覧がある場合との違い",
        },
        {
          type: "table",
          headers: ["観点", "申請くんの一覧画面", "上の React の例"],
          rows: [
            ["一覧データの主な取得元", "最初に返る HTML", "Web API の JSON"],
            ["画面の組み立て", "サーバのテンプレート", "ブラウザの JavaScript"],
            ["件数の根拠として見る行", "一覧 HTML の応答", "Fetch/XHR に表示される一覧 API の応答"],
          ],
        },
        {
          type: "h2",
          text: "SPA という構成",
        },
        {
          type: "p",
          text: "ページ全体の読み直しを減らし、JavaScript で画面を切り替えるアプリを、シングルページアプリケーション（SPA）と呼びます。SPA では、Web API の JSON から画面を作る構成が多くあります。",
        },
        {
          type: "p",
          text: "上の例のように、React は JSON から画面を作るために使えます。ただし、React を使うだけで SPA になるわけではありません。Web API も SPA 専用ではありません。名前だけで決めず、Network タブで実際の応答を確認しましょう。",
        },
        {
          type: "h2",
          text: "表示がおかしいとき",
        },
        {
          type: "p",
          text: "JSON の件数もおかしいなら、API の SQL と DB を確認しましょう。JSON は正しいのに画面だけ違うなら、プロパティ名、filter や並べ替え、React の state、JavaScript の例外を確認しましょう。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "API が 200 でも画面は空になる",
          text: "一覧 API が 200 でも、JSON のプロパティ名が違うときや JavaScript が例外になったときは、一覧が出ません。Network タブの Fetch/XHR と、ブラウザのコンソールを確認しましょう。",
        },
        { type: "quiz", id: "web-json-ui" },
      ],
    },
  ],
};

