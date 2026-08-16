import type { Track } from "../types";
import { requestControllerSample } from "../data/entryPoint";

export const scenarioTrack: Track = {
  id: "scenario",
  no: "07",
  title: "実務のシナリオで追う",
  kicker: "SCENARIO",
  description: "障害対応と改修の影響調査。限られた情報から、次に見る層を決める。",
  accent: "#6ec8c0",
  lessons: [
    {
      id: "how",
      title: "シナリオの使い方",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "この章は、現場でよく渡される2種類の依頼を想定します。障害対応は「〇〇画面で、こういう事象が起きた」だけ渡されたときの追い方です。改修の影響調査は「〇〇を変えたいので、どこを直す必要があるか」を洗い出す依頼です。どちらも最初からソースを通読しません。",
        },
        { type: "diagram", name: "scenario-layers", caption: "障害対応では、原因の層を1つに絞る。" },
        {
          type: "h2",
          text: "障害対応",
        },
        {
          type: "p",
          text: "手間の少ない確認で、フロント、バックエンド、DB、ネットワーク、HTTPサーバのどれかを先に決めましょう。",
        },
        {
          type: "ol",
          items: [
            "操作、期待、実際を一文にする",
            "Network タブで、リクエストが飛んだか、ステータスと Content-Type を見る",
            "アプリのログに、その時刻の行があるかを見る",
            "層が決まってから、その層だけを深く見る",
          ],
        },
        {
          type: "table",
          headers: ["最初の観測", "先に疑う層"],
          rows: [
            ["リクエスト自体が無い", "フロントエンド"],
            ["5xx、スタックがある", "バックエンド"],
            ["画面に業務メッセージ、ERROR もスタックも無い", "文言でソース検索。無ければ DB / 外部 API"],
            ["200 なのに件数や中身が違う", "実行された SQL と、その条件の DB"],
            ["ログにリクエストが無い、タイムアウト", "ネットワーク"],
            ["HTML は 200、CSS/JS だけ 404", "HTTPサーバ（または静的ファイルのパス）"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "仮説は1つ",
          text: "JS と SQL とファイアウォールが同時に怪しいのは、切り分けになっていません。確認コストが低いものから潰しましょう。",
        },
        {
          type: "h2",
          text: "改修の影響調査",
        },
        {
          type: "p",
          text: "壊れている場所を探すのではなく、変更の波及先を一覧にしましょう。見積もりやレビュー用なら、ファイル名と概要で足りることが多く、全部を読み切る必要はありません。",
        },
        {
          type: "ol",
          items: [
            "依頼文を一文にする（何を変えるか、触らない範囲）",
            "既存の識別子で検索する（カラム名、定数名、URL、画面の文言）",
            "ヒットごとに「表示」「分岐」「永続化」に分類する",
            "画面・API・バッチが同じデータを触っていないかを見る",
          ],
        },
        {
          type: "table",
          headers: ["検索の手がかり", "分類の例"],
          rows: [
            ["status / PENDING", "enum、if 分岐、Mapper の WHERE、画面の表示"],
            ["/shinsei/requests", "Controller、テンプレート、JS の fetch 先"],
            ["t_request", "Mapper XML、Entity、マイグレーション"],
            ["承認待ち", "テンプレート、メッセージ定義、一覧の条件"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "検索のやり方",
          text: "文字列検索と、型・メソッドの参照検索は別です。手がかりの選び方は「ソースの読み方」の「どこから読み始めるか」を見ましょう。詳しい手順は「処理の入口から読む」と「キーワードで探す」です。",
        },
        { type: "quiz", id: "sc-how" },
      ],
    },
    {
      id: "front",
      title: "[障害調査] 申請一覧で、承認ボタンを押しても何も起きない",
      minutes: 8,
      blocks: [
        {
          type: "callout",
          kind: "note",
          title: "シナリオ",
          text: "申請一覧画面で、承認ボタンを押しても何も起きない。画面は切り替わらず、エラーメッセージも出ない。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "検証用環境。自分の申請が一覧に出ている",
            "ボタンは画面上に見える",
            "サーバのログは、まだ見ていない",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "p",
          text: "押した瞬間の Network タブを見ましょう。新しい POST が無ければ、バックエンドにも DB にも届いていません。",
        },
        { type: "diagram", name: "page-assets", caption: "画面1つでも、通信は複数行です。ボタン用の行が無いかを見ましょう。" },
        {
          type: "table",
          headers: ["観測", "読む"],
          rows: [
            ["POST が無い", "サーバはまだ関係ない。フォームか JS"],
            ["コンソールに JS エラー", "送信の手前で止まっている"],
            ["POST があり 200 / 302 / 500", "フロントから先へ進む"],
          ],
        },
        {
          type: "p",
          text: "このシナリオでは POST が無く、コンソールに Uncaught TypeError がありました。submit する JS が途中で止まっていました。",
        },
        {
          type: "ul",
          items: [
            "リクエストが無いなら、ログと SQL を先に読まない",
            "ボタンが見えることと、リクエストが飛ぶことは別",
            "画面遷移しない操作は、XHR / fetch の行を見る",
          ],
        },
        { type: "quiz", id: "sc-front" },
      ],
    },
    {
      id: "back",
      title: "[障害調査] 承認すると「エラーが発生しました」",
      minutes: 8,
      blocks: [
        {
          type: "callout",
          kind: "note",
          title: "シナリオ",
          text: "申請詳細画面で承認ボタンを押すと、「エラーが発生しました」と出る。一覧には戻らない。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "申請 ID 12。検証用環境",
            "Network タブで POST /shinsei/requests/12/approve が 500",
            "Content-Type は text/html",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "p",
          text: "リクエストはサーバに届いています。CSS やボタンの JS ではありません。操作時刻の ERROR とスタックトレースを見ましょう。",
        },
        { type: "diagram", name: "stack-own", caption: "ログは長い。そのファイルの行番号を最初に調べましょう。" },
        {
          type: "p",
          text: "RequestService.java:41 で NullPointerException。approverId が null のオブジェクトに equals していました。",
        },
        {
          type: "ul",
          items: [
            "5xx なら、見た目より先にログ",
            "画面の文言は薄い。時刻を合わせて ERROR を探す",
            "org.springframework の行で止まらない。自作クラスを開く",
          ],
        },
        { type: "quiz", id: "sc-back" },
      ],
    },
    {
      id: "message",
      title: "[障害調査] 「この申請は承認できません」と出るが、ログに例外が無い",
      minutes: 8,
      blocks: [
        {
          type: "callout",
          kind: "note",
          title: "シナリオ",
          text: "申請詳細で承認ボタンを押すと、「この申請は承認できません」と出る。一覧には戻らない。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "申請 ID 12。検証用環境。ステータスは承認済みに見える",
            "Network タブで POST /shinsei/requests/12/approve は飛んでいる。500 ではない",
            "操作時刻のログに ERROR もスタックトレースも無い",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "p",
          text: "例外が出ていないので、スタックの at 行は使えません。画面に出ている文言そのものを、ソース全体から検索しましょう。",
        },
        {
          type: "ol",
          items: [
            "「この申請は承認できません」で全文検索する",
            "ヒットがプロパティファイルなら、そのキー（error.cannotApprove など）で参照を辿る",
            "ヒットが Java やテンプレートなら、その if と、誰が呼んでいるかを見る",
            "ソースに無ければ、文言の一部でも再検索する。それでも無ければ DB、外部 API、jar の自作ライブラリを疑う",
            "申請 ID 12 のステータスなど、分岐の条件になるデータを DB で確認する",
          ],
        },
        {
          type: "code",
          title: "検索で当たった箇所（申請くん）",
          lang: "java",
          code: `if (!"PENDING".equals(request.getStatus())) {
  redirectAttributes.addFlashAttribute(
      "errorMessage", "この申請は承認できません");
  return "redirect:/requests/" + id;
}
requestService.approve(id, userId);`,
        },
        {
          type: "p",
          text: "throw していないので、例外ログは出ません。ID 12 は既に APPROVED でした。承認処理の本体には入っていません。",
        },
        {
          type: "ul",
          items: [
            "固有の文言があるときは、それが最短の検索語",
            "「エラーが発生しました」だけだとヒットが多すぎる。前後の文やキー名も試す",
            "ソースにヒットしなければ、DB のメッセージマスタや、外部 API が返した文を疑う",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ソースに無い文言",
          text: "画面の文が、コードにもプロパティファイルにも無いときは、Java が直書きしていません。メッセージ用のテーブル、ワークフローや認証サーバの応答 JSON を、Network タブと DB で見ましょう。応答の message をそのまま出していることがあります。",
        },
        {
          type: "callout",
          kind: "note",
          title: "前のシナリオとの違い",
          text: "「エラーが発生しました」で POST が 500 なら、先にスタックです。画面に業務の一文があり ERROR が無いなら、先にその一文で検索しましょう。",
        },
        { type: "quiz", id: "sc-message" },
      ],
    },
    {
      id: "db",
      title: "[障害調査] 検証用環境だけ、申請一覧が 0 件",
      minutes: 8,
      blocks: [
        {
          type: "callout",
          kind: "note",
          title: "シナリオ",
          text: "申請一覧画面が、検証用環境だけ 0 件になる。ローカル環境の起動では、同じログインユーザで 3 件出る。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "Network タブは GET /shinsei/requests が 200、text/html",
            "画面に例外は出ていない",
            "コードはローカル環境と同じ版（同じ commit / タグ）、と言われている",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "p",
          text: "応答は成功しています。フロントや CSS の問題でも、500 でもありません。実行された SQL を見て、同じ条件で今つないでいる DB の行を数えましょう。",
        },
        { type: "diagram", name: "front-back", caption: "データは DB にある。実行された SQL の条件で、今の DB を見る。" },
        {
          type: "p",
          text: "検証用環境の t_request を、ログインユーザの ID で検索すると 0 件でした。ローカル環境の DB には 3 件あります。SQL の WHERE は同じでも、行が無ければ一覧は空です。",
        },
        {
          type: "ul",
          items: [
            "200 で件数が違うなら、コード通読より先に、実行された SQL とその条件の行",
            "今見ている接続先が、思っている検証用環境の DB かを確認する",
            "論理削除フラグが立っている、別のログインユーザの行しか無い、といった場合も同じ型",
          ],
        },
        { type: "quiz", id: "sc-db" },
      ],
    },
    {
      id: "net",
      title: "[障害調査] 検証用環境だけ、画面がいつまでも読み込み中",
      minutes: 8,
      blocks: [
        {
          type: "callout",
          kind: "note",
          title: "シナリオ",
          text: "検証用環境の申請一覧 URL を開くと、いつまでも読み込み中になる。ローカル環境では同じ URL で 200 になる。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "Network タブで、画面を開いたときの最初のリクエスト（HTML）が終わらない、または失敗する",
            "アプリのログに、操作時刻のアクセスが無い",
            "コードはローカル環境と同じ、と言われている",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "p",
          text: "アプリに届いていなければ、Controller も SQL もまだ関係ありません。宛先、ポート、ファイアウォール、プロキシを見ましょう。ping や curl の打ち方は、トラブルシュートの「ネットワークの疎通確認」です。",
        },
        { type: "diagram", name: "env-diff", caption: "コードが同じでも、届く道が違うことがあります。" },
        {
          type: "p",
          text: "検証用環境のサーバのポート 8080 が、社内ネットワークから閉じられていました。ブラウザはサーバまで届かず、アプリは何も記録しません。",
        },
        {
          type: "ul",
          items: [
            "ログが無い = アプリが動いていないか、リクエストが届いていない",
            "ローカル環境で動くことと、検証用環境のホストへ届くことは別",
            "DNS の向き先、ポート、HTTPS の終端、プロキシの有無を表にする",
          ],
        },
        { type: "quiz", id: "sc-net" },
      ],
    },
    {
      id: "http-server",
      title: "[障害調査] 一覧は出るが、画面だけ崩れている",
      minutes: 8,
      blocks: [
        {
          type: "callout",
          kind: "note",
          title: "シナリオ",
          text: "申請一覧画面は開くが、表の罫線も色も当たっていない。文字だけが並ぶ。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "画面の HTML は 200",
            "Java のログに、一覧の INFO は出ている",
            "見た目がおかしい以外のエラーは画面に無い",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "p",
          text: "HTML が 200 なら、一覧の Controller は動いています。Network タブで CSS / JS の行を見ましょう。",
        },
        { type: "diagram", name: "not-found", caption: "HTML が 200 でも、静的ファイルだけ 404 のことがあります。" },
        {
          type: "p",
          text: "/shinsei/css/app.css が 404 でした。手前の nginx が /css/ を別ディレクトリに振っており、コンテキストパス付きの実体とずれていました。アプリの Java は直す場所ではありません。",
        },
        {
          type: "ul",
          items: [
            "見た目の崩れは、先に静的ファイルのステータスを見る",
            "HTML 200 と CSS 404 が同時にある。層が違う",
            "手前に Apache / nginx があるなら、location や alias を疑う",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "テンプレート側のこともある",
          text: "href が /css/app.css のままで、コンテキストパス /shinsei が付いていない、というずれもあります。それでも先に Network タブの 404 URL を見ましょう。",
        },
        { type: "quiz", id: "sc-http" },
      ],
    },
    {
      id: "impact-status",
      title: "[影響調査] 申請ステータスに CANCELLED を足したい",
      minutes: 9,
      blocks: [
        {
          type: "callout",
          kind: "note",
          title: "シナリオ",
          text: "取り下げ機能の見積もりのため、申請ステータスに CANCELLED を追加したときの影響範囲を調べてほしい、と依頼された。不具合報告ではない。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "現状の値は PENDING / APPROVED などがある（詳細は未確認）",
            "DB には t_request があり、status カラムがあると聞いている",
            "いつリリースするか、画面を変えるかはまだ決まっていない",
          ],
        },
        {
          type: "h2",
          text: "先にやること",
        },
        {
          type: "p",
          text: "Network タブやログは、壊れているかどうかの確認用です。影響調査では、まず既存の識別子でソースを検索し、ヒットを分類しましょう。",
        },
        {
          type: "ol",
          items: [
            "status、PENDING、APPROVED、t_request で全文検索する",
            "enum や定数クラスがあれば、そこが値の定義元",
            "Mapper XML の WHERE status = … と、Service の if 分岐をメモする",
            "テンプレートの th:if や、一覧・詳細の表示文言を見る",
            "同じ status を JSON で返す API や、夜間バッチが無いかも同じ語で検索する",
          ],
        },
        { type: "diagram", name: "call-chain", caption: "例: 承認は Controller → Service → Mapper。status を触る箇所は、この鎖の複数点に散らばる。" },
        {
          type: "code",
          title: "検索で見つかった分岐の例（申請くん）",
          lang: "java",
          code: `if (!"PENDING".equals(request.getStatus())) {
  redirectAttributes.addFlashAttribute(
      "errorMessage", "この申請は承認できません");
  return "redirect:/requests/" + id;
}
// 一覧 Mapper: WHERE status IN ('PENDING', 'APPROVED')`,
        },
        {
          type: "p",
          text: "CANCELLED を足すと、承認可否の if、一覧の抽出条件、画面のラベル、帳票や API の返却値を直す必要がある、と一覧にできます。全部を読み切らなくても、ヒットファイルと「分岐 / 表示 / SQL」の分類で見積もりに回せます。",
        },
        {
          type: "ul",
          items: [
            "既存の値名（PENDING）から逆引きすると漏れが減る",
            "画面だけ見ても、Service やバッチの分岐は見落とす",
            "DB の CHECK 制約や、他システム連携のコード値も確認対象",
          ],
        },
        { type: "quiz", id: "sc-impact-status" },
      ],
    },
    {
      id: "impact-search",
      title: "[影響調査] 一覧の検索条件に部署を足したい",
      minutes: 8,
      blocks: [
        {
          type: "callout",
          kind: "note",
          title: "シナリオ",
          text: "申請一覧に「部署で絞り込み」を追加したい。既存の一覧処理への影響を教えてほしい、と依頼された。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "対象画面は申請一覧。URL は /shinsei/requests",
            "フォームに部署のプルダウンを足す想定",
            "CSV エクスポートがあるかは、依頼文には書いていない",
          ],
        },
        {
          type: "h2",
          text: "先にやること",
        },
        {
          type: "p",
          text: "処理の入口は一覧の URL です。/shinsei/requests で検索し、Controller のメソッドから Service、Mapper へ降りましょう。同じ一覧を別経路から出していないかも見ましょう。",
        },
        { type: "diagram", name: "read-entry", caption: "URL → Controller → Service → SQL。影響調査も処理の入口は同じです。" },
        {
          type: "table",
          headers: ["確認すること", "理由"],
          rows: [
            ["Controller の引数（クエリパラメータ）", "部署 ID をどこで受け取るか"],
            ["Service の一覧メソッド", "条件を足す本体"],
            ["Mapper の SELECT と WHERE", "SQL とインデックスの影響"],
            ["テンプレートの form と th:href", "画面とパラメータ名の対応"],
            ["export / download の URL", "一覧と同じ条件を使っているか"],
          ],
        },
        {
          type: "p",
          text: "検索で RequestController.list と RequestMapper.findMine だけでなく、CSV 用の export メソッドも同じ Mapper を呼んでいる、と分かれば、一覧とエクスポートの両方を直す必要がある、と書けます。",
        },
        {
          type: "ul",
          items: [
            "画面だけ追うと、裏の SQL やエクスポートを見落とす",
            "クエリパラメータ名は、テンプレートと Controller で一致しているか確認する",
            "影響一覧は「ファイル + 何を変えるか」で十分なことが多い",
          ],
        },
        {
          type: "code",
          title: "RequestController.java（一覧の処理の入口）",
          lang: "java",
          code: requestControllerSample,
        },
        { type: "quiz", id: "sc-impact-search" },
      ],
    },
  ],
};
