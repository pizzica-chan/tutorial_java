import type { Track } from "../types";
import { requestControllerSample } from "../data/entryPoint";

export const scenarioTrack: Track = {
  id: "scenario",
  no: "07",
  title: "実務のシナリオ",
  kicker: "SCENARIO",
  description: "シナリオを想定し、より実践的な調査の進め方を学びます。",
  accent: "#6ec8c0",
  lessons: [
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
          type: "figure",
          kind: "screen",
          src: "/images/screen-list.jpg",
          alt: "承認ボタンが見える申請一覧",
          caption: "ボタンは画面上に見えます。押した瞬間に POST が飛んだかは、Network タブで確認しましょう。",
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
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-no-post.jpg",
          alt: "承認を押したあとも POST が無い Network タブ",
          caption: "承認を押した直後の例です。POST /approve の行は増えていません。コンソールにエラーの印が出ています。",
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
          type: "figure",
          kind: "screen",
          src: "/images/screen-error-500.jpg",
          alt: "承認後にエラーが発生しましたと出た画面",
          caption: "「エラーが発生しました」だけでは原因は分かりません。Network タブが 500 なら、先にサーバ側のエラーログを確認しましょう。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-500.jpg",
          alt: "承認 POST が 500 の Network タブ",
          caption: "例：POST /shinsei/requests/12/approve が 500。画面の文言より先に、このステータスコードを確認しましょう。",
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
          text: "リクエストはサーバに届いています。CSS やボタンの JS ではありません。操作時刻のサーバ側のエラーログを確認しましょう。",
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
            "「エラーが発生しました」だけでは原因は分からない。時刻を合わせてサーバ側のエラーログを確認する",
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
          type: "figure",
          kind: "screen",
          src: "/images/screen-cannot-approve.jpg",
          alt: "この申請は承認できませんと出た申請詳細",
          caption: "業務の一文が出て、例外ログが無いときの例です。この文言でソースを検索しましょう。",
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
          type: "figure",
          kind: "screen",
          src: "/images/screen-list-empty.jpg",
          alt: "検証用環境で 0 件になった申請一覧",
          caption: "HTML は 200 です。件数の差は、実行された SQL の条件で今の DB を数えると分かります。",
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
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-pending.jpg",
          alt: "HTML のリクエストが pending のままの Network タブ",
          caption: "例：リロード後も一覧 URL のまま、document の行が pending です。直前の一覧は残っています。アプリのログにアクセスが無ければ、まだサーバに届いていません。",
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
          text: "アプリに届いていなければ、Controller も SQL もまだ関係ありません。次を見ましょう。ping や curl の打ち方は、トラブルシューティング手法の「ネットワークの疎通確認」です。",
        },
        {
          type: "ul",
          items: [
            "宛先",
            "ポート",
            "ファイアウォール",
            "プロキシ",
          ],
        },
        { type: "diagram", name: "env-diff", caption: "コードが同じでも、届く道が違うことがあります。" },
        {
          type: "p",
          text: "検証用環境のサーバのポート 8080 が、社内ネットワークから閉じられていました。ブラウザはサーバまで届かず、アプリは何も記録しません。",
        },
        {
          type: "ul",
          items: [
            "ログが無いときは、アプリ未到達か、見ているログが違うことが多いです",
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
          type: "figure",
          kind: "screen",
          src: "/images/screen-list-unstyled.jpg",
          alt: "スタイルが当たっていない申請一覧",
          caption: "文字は出ています。Network タブで CSS の行が 404 になっていないかを見ましょう。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-css-404.jpg",
          alt: "HTML は 200 で CSS が 404 の Network タブ",
          caption: "HTML は 200、app.css だけ 404 の例です。一覧の Java 処理は通っています。",
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
            "見た目の崩れは、先に静的ファイルのステータスコードを確認しましょう",
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
          text: "まず既存の識別子でソースを検索し、ヒットを分類しましょう。",
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
          text: "CANCELLED を足すと、次を直す必要がある、と一覧にできます。全部を読み切らなくても、ヒットファイルと「分岐 / 表示 / SQL」の分類で見積もりに回せます。",
        },
        {
          type: "ul",
          items: [
            "承認可否の if",
            "一覧の抽出条件",
            "画面のラベル",
            "帳票や API の返却値",
          ],
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
          text: "処理の入口は一覧の URL です。/shinsei/requests で検索し、Controller の Java メソッドから Service、Mapper へ降りましょう。同じ一覧を別経路から出していないかも確認しましょう。",
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
