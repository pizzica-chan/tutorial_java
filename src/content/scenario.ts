import type { Track } from "../types";

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
      minutes: 9,
      blocks: [
        {
          type: "callout",
          kind: "scenario",
          text: "申請一覧画面で、承認ボタンを押しても何も起きない。画面は切り替わらず、エラーメッセージも出ない。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-list.jpg",
          alt: "承認ボタンが見える申請一覧",
          caption: "ボタンは画面上に見えます。押した瞬間にリクエストが飛んだかは、Network タブで確認しましょう。",
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
          text: "押した瞬間の Network タブを見ましょう。新しいリクエストが無ければ、バックエンドにも DB にも届いていません。",
        },
        {
          type: "callout",
          kind: "note",
          title: "別ウィンドウのリクエスト",
          text: "Network タブに出るのは、開発者ツールを開いているウィンドウの通信だけです。別ウィンドウを開いて送ったリクエストは、元のウィンドウの Network タブには出ません。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-no-post.jpg",
          alt: "承認を押したあとも新しいリクエストが無く Console に TypeError が出ている Network タブ",
          caption: "承認を押したあとも新しいリクエストは増えていません。Console に TypeError のメッセージが出ています。",
        },
        {
          type: "table",
          headers: ["Networkタブ / コンソール", "分かること", "次に確認すること"],
          rows: [
            ["新しいリクエストが無い", "サーバはまだ関係ない。フォームか JS", "コンソール、フォーム、一覧の JS"],
            ["コンソールに JS エラー", "リクエスト送信の手前で止まっている", "エラーのファイルと行"],
            ["リクエストがあり 200 / 302 / 500", "リクエスト送信は終わっている。サーバの応答とログを見る", "レスポンス、操作時刻のサーバ側のエラーログ"],
          ],
        },
        {
          type: "h2",
          text: "原因の追跡",
        },
        {
          type: "p",
          text: "このシナリオでは新しいリクエストが無く、コンソールに Uncaught TypeError: Cannot read properties of null (reading 'value') がありました。コンソールのエラーをクリックして、エラーが発生したファイルを開きましょう。",
        },
        {
          type: "code",
          title: "list.js（申請くん・一覧）",
          lang: "javascript",
          highlightLines: [4],
          highlightKind: "error",
          code: `form.addEventListener("submit", (event) => {
  event.preventDefault();
  const tokenEl = document.getElementById("csrfToken");
  const token = tokenEl.value;
  const csrfInput = form.querySelector("input[name='_csrf']");
  csrfInput.value = token;
  form.submit();
});`,
        },
        {
          type: "p",
          text: "開いた `list.js` を、承認ボタンを押したときの流れに沿って読むと次のとおりです。",
        },
        {
          type: "ul",
          items: [
            "`event.preventDefault();` のあと、`const tokenEl = document.getElementById(\"csrfToken\");` で id が `csrfToken` の要素を探し、結果を tokenEl に入れる",
            "その次の行 `const token = tokenEl.value;` で `tokenEl.value` を読もうとしてエラーになる",
            "エラー内容は「null の value を読んだ」となっているので、読もうとした tokenEl が null だとわかる",
            "tokenEl は 1 行上の `document.getElementById(\"csrfToken\")` の戻り値なので、HTML に `id=\"csrfToken\"` の要素が無かった、と考えられる",
          ],
        },
        {
          type: "p",
          text: "次は、一覧の HTML に `id=\"csrfToken\"` があるかを見ます。",
        },
        {
          type: "code",
          title: "一覧の承認フォーム（ブラウザに出ている HTML）",
          lang: "html",
          code: `<form action="/shinsei/requests/12/approve" method="post">
  <input type="hidden" name="_csrf" value="8f3a2b1c-4e5f-6789-abcd-ef0123456789" />
  <button type="submit" class="btn-approve">承認</button>
</form>`,
        },
        {
          type: "p",
          text: "`id=\"csrfToken\"` はありません。そのため `document.getElementById(\"csrfToken\")` は null を返し、`tokenEl.value` でエラーになります。その下の `form.submit();` まで進まないので、承認のリクエストは飛びません。",
        },
        {
          type: "p",
          text: "原因は、一覧用の JS が HTML に無い `id` を読んでいることです。フロント側の不具合です。",
        },
        {
          type: "h2",
          text: "このシナリオの要点",
        },
        {
          type: "ul",
          items: [
            "ボタンを押しても反応が無いときは、まず Network タブで新しいリクエストが出たかを見る",
            "リクエストが無くコンソールに JS エラーがあるなら、サーバより先にフロントを疑う",
            "コンソールのエラーメッセージと、指しているファイル・行を見て、何を読もうとして失敗したかをたどる",
          ],
        },
        {
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "Network タブで、リクエストが飛んでいないことを確認",
            "コンソールで、JS の null 参照エラーを確認",
            "HTML と JS で識別子が異なり、値が取れず null になっていることを確認",
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
          kind: "scenario",
          text: "申請詳細画面で承認ボタンを押すと、「エラーが発生しました」と出る。一覧には戻らない。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-500.jpg",
          alt: "承認 POST が 500 の Network タブ",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "山田（yamada）でログイン。申請詳細で ID 16「研修参加」の承認ボタンを押した。検証用環境",
            "Network タブで `POST /shinsei/requests/16/approve` が 500",
            "`Content-Type` は `text/html`",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "p",
          text: "リクエストはサーバに届いています。操作時刻のサーバ側のエラーログを確認しましょう。",
        },
        {
          type: "diagram",
          name: "stack-own",
          caption: "操作時刻のサーバログに出ていたスタックトレースです。",
        },
        {
          type: "h2",
          text: "原因の追跡",
        },
        {
          type: "p",
          text: "上のログには `NullPointerException` がありました。",
        },
        {
          type: "p",
          text: "例外メッセージの次にある最初の自作 at 行は `RequestService.java:47` です。実ファイルの同じ行を開くと、`request.getApproverId().equals(approverId)` があります。",
        },
        {
          type: "code",
          title: "RequestService.java:47（申請くん）",
          lang: "java",
          code: `if (!request.getApproverId().equals(approverId)) {
  throw new ForbiddenException("承認権限がありません");
}`,
        },
        {
          type: "p",
          text: "`getApproverId()` の戻り値が null です。その null に対して `equals` を呼んだため、`NullPointerException` になっています。",
        },
        {
          type: "p",
          text: "request は approve の冒頭で DB から取っています。`approver_id` が null なら、`getApproverId()` も null になります。",
        },
        {
          type: "code",
          title: "RequestService.approve（抜粋）",
          lang: "java",
          code: `RequestEntity request = requestMapper.findById(requestId, approverId);
if (request == null) {
  throw new NotFoundException("指定した申請は無い、または見る権限がありません。");
}
if (!request.getApproverId().equals(approverId)) {
  throw new ForbiddenException("承認権限がありません");
}`,
        },
        {
          type: "p",
          text: "ID 16 を DB で見ると、`approver_id` が NULL でした。詳細画面の承認者「未設定」と一致します。",
        },
        {
          type: "code",
          title: "t_request（申請くん）",
          lang: "sql",
          code: `SELECT id, title, approver_id, status
FROM t_request
WHERE id = 16;`,
        },
        {
          type: "table",
          headers: ["id", "title", "`approver_id`", "status"],
          rows: [["16", "研修参加", "NULL", "PENDING"]],
        },
        {
          type: "p",
          text: "申請を登録するときは承認者が必須です。承認ボタンが押された際の処理の仕様も、承認者 ID が入っている前提となっており、未設定のときの考慮はありません。つまり ID 16 は、何らかの理由で作られた、仕様と食い違うレコードです。",
        },
        {
          type: "callout",
          kind: "note",
          title: "テーブル定義で不正データを防ぐ",
          text: "こうした不整合なレコードの作成を防ぐには、DB の `approver_id` に NOT NULL を付けるのが有効です。申請くんのカラム定義は NULL 可のままなので、値が空のレコードがあると、今回のように 500 になります。",
        },
        {
          type: "h2",
          text: "このシナリオの要点",
        },
        {
          type: "ul",
          items: [
            "POST が 500 なら、操作時刻のサーバログを先に見る。「エラーが発生しました」だけでは原因は分からない",
            "スタックトレースでは、org.springframework や java. の行は飛ばし、自分たちが書いたコードの最初の at 行からソースを開く",
            "変数の値が原因なら、その値がセットされている箇所を追う",
          ],
        },
        {
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "Network タブで、POST が 500 であることを確認",
            "操作時刻のサーバログで `NullPointerException` を確認",
            "スタックから `RequestService.java:47` を開き、`getApproverId()` が null と分かる",
            "DB で `approver_id` が NULL であることを確認",
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
          kind: "scenario",
          text: "申請詳細で承認ボタンを押すと、「この申請は承認できません」と出る。一覧には戻らない。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-cannot-approve.jpg",
          alt: "POST /shinsei/requests/11/approve が 500 ではない Network タブ",
          caption: "例：`POST /shinsei/requests/11/approve` は飛んでいます。500 ではありません。画面に「この申請は承認できません」が出ています。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "山田（yamada）でログイン。申請履歴から ID 11「備品購入」の詳細を開き、承認ボタンを押した。検証用環境。ステータスは APPROVED",
            "Network タブで `POST /shinsei/requests/11/approve` は飛んでいる。500 ではない",
            "操作時刻のログに ERROR もスタックトレースも無い",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "callout",
          kind: "note",
          title: "前のシナリオとの違い",
          text: "前のシナリオでは POST が 500 で、ログにスタックがありました。今回は 500 ではなく、ログにも ERROR がありません。画面に出ている「この申請は承認できません」でソースを検索しましょう。",
        },
        {
          type: "p",
          text: "例外やエラーのログが無いので、画面の文言でソース全体を検索しましょう。",
        },
        {
          type: "ol",
          items: [
            "「この申請は承認できません」でソース全体を全文検索する",
            "ヒットがプロパティファイルなら、そのキー（error.cannotApprove など）で参照を辿る",
            "ヒットが Java やテンプレートなら、その if 分岐の条件と、参照元を辿る",
            "ソースに無ければ、文言の一部でも再検索する。それでも無ければ DB、外部 API、jar の自作ライブラリを疑う",
            "申請 ID 11 のステータスなど、分岐の条件になるデータを DB で確認する",
          ],
        },
        {
          type: "h2",
          text: "原因の追跡",
        },
        {
          type: "p",
          text: "「この申請は承認できません」で検索すると、Controller の分岐がヒットしました。",
        },
        {
          type: "code",
          title: "検索でヒットした箇所（申請くん）",
          lang: "java",
          code: `var request = requestService.findById(id, user.getId());
if (!"PENDING".equals(request.getStatus())) {
  redirectAttributes.addFlashAttribute(
      "errorMessage", "この申請は承認できません");
  return "redirect:/requests/" + id;
}
requestService.approve(id, user.getId());`,
        },
        {
          type: "p",
          text: "ID 11 は既に APPROVED です。PENDING ではないため Controller の分岐に入り、flash メッセージを設定して詳細へ戻ります。throw しておらず、承認処理の本体にも入らないため、例外ログは出ません。",
        },
        {
          type: "callout",
          kind: "note",
          title: "理想的な設計",
          text: "承認できない場合は承認ボタンを押せないようにするのが理想的な設計です。申請くんの詳細は、このシナリオを追えるように、ステータスに関係なくボタンを押せるようにしています。",
        },
        {
          type: "h2",
          text: "このシナリオの要点",
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
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "Network タブで、POST は飛んでいるが 500 ではないことを確認",
            "操作時刻のログに ERROR もスタックも無いことを確認",
            "画面の文言でソースを検索し、Controller の分岐がヒットする",
            "DB で申請 ID 11 の status が APPROVED であることを確認",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ソースに無い文言",
          text: "画面の文が、コードにもプロパティファイルにも無いときは、Java が直書きしていません。メッセージ用のテーブル、ワークフローや認証サーバの応答 JSON を、Network タブと DB で見ましょう。応答の message をそのまま出していることがあります。",
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
          kind: "scenario",
          text: "申請一覧画面が、検証用環境だけ 0 件になる。ローカル環境では、同じログインユーザで 4 件出る。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-list-empty.jpg",
          alt: "申請一覧が 0 件のとき、GET /shinsei/requests が 200 の Network タブ",
          caption: "例：`GET /shinsei/requests` は 200、`text/html` です。画面は 0 件ですが、応答自体は成功しています。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "Network タブは `GET /shinsei/requests` が 200、`text/html`",
            "画面にエラーは出ていない",
            "デプロイされているコードは、ローカルと同じ commit / タグだ",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "p",
          text: "応答は成功しています。フロントや CSS の問題でも、500 でもありません。実行された SQL を見て、同じ SQL を、アプリが接続している DB で実行しましょう。",
        },
        { type: "diagram", name: "front-back", caption: "データは DB にある。実行された SQL の条件で、アプリが接続している DB を見る。" },
        {
          type: "h2",
          text: "原因の追跡",
        },
        {
          type: "p",
          text: "操作時刻のログで `findMine` を見ましょう。",
        },
        {
          type: "code",
          title: "操作時刻のサーバログ（申請くん）",
          lang: "text",
          code: `==>  Preparing: SELECT r.id, r.title, r.status, r.applicant_id, r.approver_id, r.applicant_email, r.created_at,
       a.display_name AS applicant_name, v.display_name AS approver_name
FROM t_request r
JOIN t_user a ON a.id = r.applicant_id
LEFT JOIN t_user v ON v.id = r.approver_id
WHERE (r.applicant_id = ? OR r.approver_id = ?)
AND r.status = 'PENDING'
ORDER BY r.created_at DESC
==> Parameters: 7(Long), 7(Long)
<==      Total: 0`,
        },
        {
          type: "p",
          text: "`Parameters` は 7, 7、`Total` は 0 です。検証用環境の DB で同じ条件を実行すると、レコードは 0 件でした。",
        },
        {
          type: "code",
          title: "t_request（申請くん・検証用環境）",
          lang: "sql",
          code: `SELECT id, title, status, applicant_id, approver_id
FROM t_request
WHERE (applicant_id = 7 OR approver_id = 7)
  AND status = 'PENDING';`,
        },
        {
          type: "table",
          headers: ["id", "title", "status", "`applicant_id`", "`approver_id`"],
          rows: [],
          empty: "0 レコード",
        },
        {
          type: "p",
          text: "ローカル環境で同じ SQL を実行すると、4 件ありました。",
        },
        {
          type: "code",
          title: "t_request（申請くん・ローカル環境）",
          lang: "sql",
          code: `SELECT id, title, status, applicant_id, approver_id
FROM t_request
WHERE (applicant_id = 7 OR approver_id = 7)
  AND status = 'PENDING';`,
        },
        {
          type: "table",
          headers: ["id", "title", "status", "`applicant_id`", "`approver_id`"],
          rows: [
            ["16", "研修参加", "PENDING", "7", "NULL"],
            ["13", "休暇申請", "PENDING", "7", "3"],
            ["15", "出張旅費", "PENDING", "3", "7"],
            ["12", "交通費申請", "PENDING", "7", "3"],
          ],
        },
        {
          type: "p",
          text: "WHERE は検証用環境と同じです。件数が違うのは、各環境のアプリが接続している DB が違うからです。",
        },
        {
          type: "h2",
          text: "このシナリオの要点",
        },
        {
          type: "ul",
          items: [
            "GET が 200 で件数が違うなら、コード通読より先に、実行された SQL とその条件のレコードを見る",
            "同じ SQL を、アプリが接続している DB で実行し、画面と同じ 0 件なら、コードよりその DB のレコードを疑う",
            "検証用環境とローカルで件数が違うときは、接続先の DB が同じかを確認する",
          ],
        },
        {
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "Network タブで、GET が 200 であることを確認",
            "実行された SQL とその条件を確認",
            "同じ条件で DB を検索し、レコードが 0 件であることを確認",
          ],
        },
        { type: "quiz", id: "sc-db" },
      ],
    },
    {
      id: "history",
      title: "[障害調査] 申請履歴検索の結果が不正",
      minutes: 12,
      blocks: [
        {
          type: "callout",
          kind: "scenario",
          text: "申請履歴画面で、件名を「申請」、ステータスを「承認済み」にして検索すると、未承認のレコードが出る。エラーメッセージは出ない。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-history-search.jpg",
          alt: "件名は申請、ステータスは承認済みなのに、PENDING のレコードが出ている申請履歴",
          caption: "件名は「申請」、ステータスは「承認済み」です。表は休暇申請と交通費申請の 2 件で、どちらも PENDING です。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "山田（yamada）でログイン。検証用環境。申請履歴で件名「申請」、ステータス「承認済み」を選んで検索した",
            "申請日は空",
            "画面にエラーは出ていない",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "p",
          text: "Network タブを見ると、`GET /shinsei/requests/history` は 200 です。クエリに `title=申請` と `status=APPROVED` があるので、画面で指定した検索条件はリクエストに含まれてサーバに届いています。なので、次はサーバ側の処理を追います。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-history-search.jpg",
          alt: "申請履歴の検索 GET が 200 で、クエリに title=申請 と status=APPROVED がある Network タブ",
        },
        {
          type: "h2",
          text: "原因の追跡",
        },
        {
          type: "p",
          text: "画面に表示している検索結果は、テンプレートが `${results}` から出しています。Controller で `results` に何を載せているかを見ましょう。",
        },
        {
          type: "code",
          title: "RequestController.history（申請くん）",
          lang: "java",
          highlightLines: [13, 14, 15, 16],
          code: `@GetMapping("/history")
public String history(
    @RequestParam(value = "title", required = false) String title,
    @RequestParam(value = "requestStatus", required = false) String requestStatus,
    @RequestParam(value = "createdFrom", required = false) String createdFrom,
    @RequestParam(value = "createdTo", required = false) String createdTo,
    Model model,
    @AuthenticationPrincipal LoginUser user
) {
  model.addAttribute("searchTitle", title);
  model.addAttribute("createdFrom", createdFrom);
  model.addAttribute("createdTo", createdTo);
  model.addAttribute(
      "results",
      requestService.searchHistory(user.getId(), title, requestStatus, createdFrom, createdTo)
  );
  return "request/history";
}`,
        },
        {
          type: "p",
          text: "results の中身は `searchHistory` の戻り値です。Service は引数を Mapper に渡しているだけです。",
        },
        {
          type: "code",
          title: "RequestService.searchHistory（申請くん）",
          lang: "java",
          code: `public List<RequestEntity> searchHistory(
    Long userId,
    String title,
    String requestStatus,
    String createdFrom,
    String createdTo
) {
  return requestMapper.searchHistory(userId, title, requestStatus, createdFrom, createdTo);
}`,
        },
        {
          type: "p",
          text: "操作時刻の MyBatis ログが、実際に走った SQL です。",
        },
        {
          type: "code",
          title: "操作時刻のサーバログ（申請くん）",
          lang: "text",
          code: `==>  Preparing: SELECT r.id, r.title, r.status, r.applicant_id, r.approver_id, r.applicant_email, r.created_at,
       a.display_name AS applicant_name, v.display_name AS approver_name
FROM t_request r
JOIN t_user a ON a.id = r.applicant_id
LEFT JOIN t_user v ON v.id = r.approver_id
WHERE (r.applicant_id = ? OR r.approver_id = ?)
AND r.title LIKE CONCAT('%', ?, '%')
ORDER BY r.created_at DESC
==> Parameters: 7(Long), 7(Long), 申請(String)
<==      Total: 2`,
        },
        {
          type: "p",
          text: "WHERE に `title` の条件はあり、`status` がありません。この SQL を DB で実行すると、画面と同じ 2 件です。",
        },
        {
          type: "code",
          title: "t_request（申請くん・検証用環境）",
          lang: "sql",
          code: `SELECT id, title, status, applicant_id, approver_id
FROM t_request
WHERE (applicant_id = 7 OR approver_id = 7)
  AND title LIKE '%申請%'
ORDER BY created_at DESC;`,
        },
        {
          type: "table",
          headers: ["id", "title", "status", "`applicant_id`", "`approver_id`"],
          rows: [
            ["13", "休暇申請", "PENDING", "7", "3"],
            ["12", "交通費申請", "PENDING", "7", "3"],
          ],
        },
        {
          type: "p",
          text: "Mapper の XML を開き、SQL に `status` の絞り込み条件を足している箇所を見ます。",
        },
        {
          type: "code",
          title: "RequestMapper.xml の searchHistory（申請くん）",
          lang: "xml",
          highlightLines: [5, 6],
          code: `WHERE (r.applicant_id = #{userId} OR r.approver_id = #{userId})
<if test="title != null and title != ''">
  AND r.title LIKE CONCAT('%', #{title}, '%')
</if>
<if test="requestStatus != null and requestStatus != ''">
  AND r.status = #{requestStatus}
</if>
<if test="createdFrom != null and createdFrom != ''">
  AND r.created_at >= #{createdFrom}
</if>`,
        },
        {
          type: "p",
          text: "`requestStatus` が空でなければ、SQL に `AND r.status = #{requestStatus}` が足されます。",
        },
        {
          type: "p",
          text: "この `requestStatus` をセットしている元は、Controller の引数です。",
        },
        {
          type: "code",
          title: "RequestController.history（申請くん）",
          lang: "java",
          highlightLines: [4, 15],
          code: `@GetMapping("/history")
public String history(
    @RequestParam(value = "title", required = false) String title,
    @RequestParam(value = "requestStatus", required = false) String requestStatus,
    @RequestParam(value = "createdFrom", required = false) String createdFrom,
    @RequestParam(value = "createdTo", required = false) String createdTo,
    Model model,
    @AuthenticationPrincipal LoginUser user
) {
  model.addAttribute("searchTitle", title);
  model.addAttribute("createdFrom", createdFrom);
  model.addAttribute("createdTo", createdTo);
  model.addAttribute(
      "results",
      requestService.searchHistory(user.getId(), title, requestStatus, createdFrom, createdTo)
  );
  return "request/history";
}`,
        },
        {
          type: "p",
          text: "`@RequestParam` の value が `requestStatus` なので、Spring は HTTP リクエストから `requestStatus` を探します。しかし、Network タブを見るとクエリパラメータ名は `status` でした。HTTP リクエストに載っている名前は、この `status` です。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-history-search-request.jpg",
          alt: "申請履歴の検索 GET の Payload。Query String Parameters に title と status がある",
          caption: "Payload の Query String Parameters。ステータス側の名前は `status` です。サーバが探す `requestStatus` とは違います。",
          size: "small",
        },
        {
          type: "code",
          title: "申請履歴の検索フォーム（申請くん）",
          lang: "html",
          highlightLines: [3, 7],
          code: `<label>
  件名
  <input type="text" name="title" />
</label>
<label>
  ステータス
  <select name="status">
    <option value="">すべて</option>
    <option value="PENDING">未承認</option>
    <option value="APPROVED">承認済み</option>
  </select>
</label>`,
        },
        {
          type: "p",
          text: "フォームの `name` は `status`、サーバ側の識別子は `requestStatus` です。名前が違うので値は渡らず、DB 検索の条件に `status` が乗りません。件名の `name` は `title` で、`@RequestParam` の `title` と一致しているので、件名の「申請」は効いています。",
        },
        {
          type: "h2",
          text: "このシナリオの要点",
        },
        {
          type: "ul",
          items: [
            "件数がおかしくても 200 なら、検索結果の元になっている変数から追う",
            "MyBatis の SQL を DB で実行し、画面と同じなら、その SQL の条件を疑う",
            "WHERE に使っている変数を、Mapper → Service → Controller → フォームの `name` まで辿る",
          ],
        },
        {
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "Network タブで、クエリに `title=申請` と `status=APPROVED` があることを確認",
            "検索結果が `${results}` であること、`searchHistory` の戻り値であることを確認",
            "MyBatis の SQL を DB で実行し、画面と同じ 2 件であることを確認",
            "Mapper の XML で、`status` 条件の変数が `requestStatus` だと分かる",
            "`requestStatus` を Controller まで辿り、`@RequestParam` の value だと分かる",
            "フォームの `name` が `status` で、サーバ側の `requestStatus` と不一致だと分かる",
          ],
        },
        { type: "quiz", id: "sc-history" },
      ],
    },
    {
      id: "history-slow",
      title: "[障害調査] 申請履歴の検索が遅い",
      minutes: 13,
      blocks: [
        {
          type: "callout",
          kind: "scenario",
          text: "検証用環境で、申請履歴が多いユーザが申請履歴を検索すると、応答が遅い。エラーメッセージは出ない。ローカルでは同じ操作でもすぐ終わる。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "検証用環境。山田（yamada）で申請履歴を検索した。件名・ステータス・申請日は空",
            "画面にエラーは出ていない",
            "ローカルでは遅くない",
          ],
        },
        {
          type: "h2",
          text: "先に見ること",
        },
        {
          type: "p",
          text: "Network タブを見ましょう。`GET /shinsei/requests/history` は 200 です。待ち時間が数秒あります。失敗ではないので、次はサーバのログの時刻差です。",
        },
        {
          type: "h2",
          text: "原因の追跡",
        },
        {
          type: "h3",
          text: "ログの時刻差",
        },
        {
          type: "p",
          text: "操作時刻のログで、`searchHistory` の Mapper を見ます。`Preparing` から `Total` まで約 6 秒空いています。SQL の実行が遅いです。",
        },
        {
          type: "code",
          title: "操作時刻のサーバログ（申請くん・検証用環境）",
          lang: "text",
          highlightLines: [2, 4],
          code: `04:12:03.105 DEBUG [nio-8080-exec-3] ...ServiceLoggingAspect : start RequestService.searchHistory(..)
04:12:03.110 DEBUG [nio-8080-exec-3] ...RequestMapper.searchHistory : ==>  Preparing: SELECT ... FROM t_request r ... WHERE (r.applicant_id = ? OR r.approver_id = ?) ORDER BY r.created_at DESC
04:12:03.112 DEBUG [nio-8080-exec-3] ...RequestMapper.searchHistory : ==> Parameters: 7(Long), 7(Long)
04:12:08.890 DEBUG [nio-8080-exec-3] ...RequestMapper.searchHistory : <==      Total: 1204
04:12:08.895 DEBUG [nio-8080-exec-3] ...ServiceLoggingAspect : end RequestService.searchHistory(..)`,
        },
        {
          type: "h3",
          text: "`EXPLAIN`",
        },
        {
          type: "p",
          text: "実行された SQL を、アプリが接続している検証用 DB で `EXPLAIN` します。",
        },
        {
          type: "code",
          title: "EXPLAIN（検証用環境の MySQL）",
          lang: "sql",
          code: `EXPLAIN SELECT r.id, r.title, r.status, r.applicant_id, r.approver_id
FROM t_request r
JOIN t_user a ON a.id = r.applicant_id
LEFT JOIN t_user v ON v.id = r.approver_id
WHERE (r.applicant_id = 7 OR r.approver_id = 7)
ORDER BY r.created_at DESC;`,
        },
        {
          type: "p",
          text: "`EXPLAIN` の結果のうち、先頭の `r` は `t_request` です。",
        },
        {
          type: "code",
          title: "EXPLAIN の結果（検証用環境）",
          lang: "text",
          highlightLines: [2],
          code: `table  type  possible_keys  key   rows    Extra
r      ALL   NULL           NULL  850234  Using where; Using filesort
a      eq_ref PRIMARY       PRIMARY  1    Using where
v      eq_ref PRIMARY       PRIMARY  1    Using where`,
        },
        {
          type: "p",
          text: "次の表は、`r` の行を列ごとに示したものです。",
        },
        {
          type: "table",
          headers: ["列", "今回の例", "意味"],
          rows: [
            ["`type`", "`ALL`", "そのテーブルを先頭から全部読む。フルスキャン"],
            ["`possible_keys`", "`NULL`", "この SQL で使えるインデックスの候補。`NULL` は候補が無い"],
            ["`key`", "`NULL`", "使うと決めたインデックス。`NULL` なので使わない"],
            ["`rows`", "`850234`", "このテーブルを何件読むかの見積もり"],
            ["`Extra`", "`Using where; Using filesort`", "`Using filesort` は、`ORDER BY r.created_at DESC` の並べ替えをインデックスでは行えず、追加のソートが必要"],
          ],
        },
        {
          type: "p",
          text: "`possible_keys` が `NULL` は、インデックスが一つも無いという意味ではありません。この検索は `applicant_id` と `approver_id` で探すため、`PRIMARY KEY` の `id` は候補になりません。",
        },
        {
          type: "p",
          text: "ログの `Total: 1204` は SQL が返した件数です。`type` が `ALL` なので、`rows` の約 85 万件に近い件数を実際に読んでから、1204 件に絞っています。",
        },
        {
          type: "p",
          text: "インデックスが使えないと、条件に合わないレコードも読む必要があります。返す件数より多く読むのは、そのためです。約 85 万件読んでいるので、フルスキャンに時間がかかっています。",
        },
        {
          type: "p",
          text: "直すときは、絞り込みと並べ替えの両方を見ます。この SQL では、絞り込みが `applicant_id` と `approver_id` の `OR` で、並べ替えは `created_at` です。`INDEX` を 1 本足すだけでは両方を満たせないことが多いです。",
        },
        {
          type: "h3",
          text: "DB の定義",
        },
        {
          type: "p",
          text: "`schema.sql` の `t_request` を見ます。`PRIMARY KEY` の `id` はあります。`INDEX` の定義はありません。",
        },
        {
          type: "code",
          title: "schema.sql の t_request（申請くん）",
          lang: "sql",
          code: `CREATE TABLE IF NOT EXISTS t_request (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL,
  applicant_id BIGINT NOT NULL,
  approver_id BIGINT,
  applicant_email VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME,
  CONSTRAINT fk_request_applicant FOREIGN KEY (applicant_id) REFERENCES t_user (id),
  CONSTRAINT fk_request_approver FOREIGN KEY (approver_id) REFERENCES t_user (id)
);`,
        },
        {
          type: "callout",
          kind: "note",
          title: "外部キーとインデックス",
          text: "MySQL では、外部キー制約があると参照側のカラムに自動でインデックスが付くことがあります。この教材の `EXPLAIN` は、説明のために `possible_keys` を `NULL` にした簡略な例です。実際の環境では、外部キーの自動インデックスが `possible_keys` の候補に挙がることもあります。それでも `OR` と `ORDER BY` が重なると、`type` が `ALL` のままフルスキャンになることがあります。",
        },
        {
          type: "h2",
          text: "このシナリオの原因",
        },
        {
          type: "p",
          text: "検証用 DB では、`t_request` がフルスキャンです。約 85 万件読んで、返しているのは 1204 件でした。履歴が多いユーザで、応答が遅くなっていました。",
        },
        {
          type: "p",
          text: "絞り込みが `applicant_id` と `approver_id` の `OR` で、並べ替えは `created_at` です。`INDEX` を 1 本足すだけでは足りないことが多いです。",
        },
        {
          type: "callout",
          kind: "note",
          title: "直す対象",
          text: "今回はインデックス設計を見直すケースですが、SQL の作りが悪いだけのケースもあります。その場合は、アプリに実装されている SQL を直すのが正しいチューニングです。",
        },
        {
          type: "h2",
          text: "このシナリオの要点",
        },
        {
          type: "ul",
          items: [
            "遅さはエラーログに出ないことが多い。Network の待ち時間と、ログの時刻差を見る",
            "`Preparing` と `Total` のあいだが空いていれば、遅いのはその SQL",
            "`EXPLAIN` の `type` が `ALL` なら、フルスキャンであることが多い",
            "`rows` は読む件数の見積もり、`Total` は返した件数。`ALL` なら見積もりに近い件数を実際に読む",
            "`possible_keys` が `NULL` は、この検証用の簡略な例での結果。インデックスが一つも無い、という意味ではない",
            "`OR` の左右が別カラムで `ORDER BY` があると、`INDEX` を 1 本足すだけでは足りないことが多い",
            "今回はインデックス設計を見直す。SQL の作りが悪いだけのときは、アプリの SQL を直す",
          ],
        },
        {
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "Network で `GET /shinsei/requests/history` が 200、待ち時間が数秒と分かる",
            "ログで `searchHistory` の SQL 実行が約 6 秒と分かる",
            "`EXPLAIN` で `t_request` の `type` が `ALL`、`possible_keys` が `NULL` と分かる",
            "`OR` と `ORDER BY` が重なっていること、`schema.sql` に履歴検索向けの `INDEX` が無いと分かる",
          ],
        },
        { type: "quiz", id: "sc-history-slow" },
      ],
    },
    {
      id: "net",
      title: "[障害調査] 検証用環境だけ、読み込みが終わらない",
      minutes: 8,
      blocks: [
        {
          type: "callout",
          kind: "scenario",
          text: "検証用環境の URL を開いても読み込みが終わらない。ログイン画面も申請一覧も同じ。HTML が返らないので画面は白いまま、タブが読み込み中になることが多い。ローカルでは同じ URL で 200。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-login-fail.jpg",
          alt: "ログイン URL の document が失敗した Network タブ",
          caption: "例：ログイン URL を開いたとき、Network タブの document（HTML）が終わらない、または失敗しています。申請一覧も同様です。アプリのログにアクセスが無ければ、まだサーバに届いていません。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "Network タブで、画面を開いたときの最初のリクエスト（HTML）が終わらない、または失敗する",
            "画面は白いまま、タブが読み込み中になる（ログイン画面はまだ出ない）",
            "アプリのログに、操作時刻のアクセスが無い",
            "デプロイされているコードは、ローカルと同じ commit / タグだ",
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
          type: "h2",
          text: "原因の追跡",
        },
        {
          type: "p",
          text: "社内ネットワークから、検証用環境のサーバの 8080 へ届かない経路になっていました。ブラウザはサーバまで届かず、アプリは何も記録しません。",
        },
        {
          type: "p",
          text: "社内の端末から打った結果です。ping では応答がありますが、ポート 8080 の TCP は開いていません。",
        },
        {
          type: "code",
          title: "例（社内端末から）",
          lang: "text",
          code: `PS> ping intranet.example.co.jp

Pinging intranet.example.co.jp [10.20.30.40] with 32 bytes of data:
Reply from 10.20.30.40: bytes=32 time=2ms TTL=58
Reply from 10.20.30.40: bytes=32 time=1ms TTL=58

PS> Test-NetConnection -ComputerName intranet.example.co.jp -Port 8080

ComputerName     : intranet.example.co.jp
RemoteAddress    : 10.20.30.40
RemotePort       : 8080
PingSucceeded    : True
TcpTestSucceeded : False`,
        },
        {
          type: "p",
          text: "ping は ICMP、HTTP は TCP なので別です。ping が通っても 8080 に届かなければ、アプリには届きません。",
        },
        {
          type: "p",
          text: "検証用環境のサーバ上でも、待ち受けと応答を確認します。",
        },
        {
          type: "ul",
          items: [
            "`ss -tlnp | grep 8080` … 8080 ポートで待ち受けしているプロセスがあるかを出す",
            "`curl -I http://localhost:8080/shinsei/login` … サーバ自身（localhost）からログイン URL へ HTTP を送る。`-I` は本文を捨て、ステータスコードとヘッダだけを表示する",
          ],
        },
        {
          type: "code",
          title: "例（検証用環境のサーバ上）",
          lang: "text",
          code: `$ ss -tlnp | grep 8080
LISTEN 0      100               *:8080            *:*    users:(("java",pid=2841,fd=46))

$ curl -I http://localhost:8080/shinsei/login
HTTP/1.1 200
Content-Type: text/html;charset=UTF-8`,
        },
        {
          type: "ul",
          items: [
            "`LISTEN` と `*:8080` … 8080 で待ち受けしている（java は申請くんのプロセス）",
            "`HTTP/1.1 200` … サーバ自身からはログイン URL に応答できている",
          ],
        },
        {
          type: "p",
          text: "社内端末からは 8080 に届かない一方、サーバ上では待ち受けと応答が確認できました。アプリ停止ではなく、社内ネットワークからサーバの 8080 への経路が閉じられています。",
        },
        {
          type: "h2",
          text: "このシナリオの要点",
        },
        {
          type: "ul",
          items: [
            "ログが無いときは、アプリ未到達か、見ているログが違うことが多いです",
            "ローカル環境で動くことと、検証用環境のホストへ届くことは別",
            "ポートの疎通とプロキシ・ファイアウォールの有無は、クライアント側とサーバ側の両方で確認する",
          ],
        },
        {
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "Network タブで、HTML のリクエストが終わらない、または失敗していることを確認",
            "操作時刻のアプリログにアクセスが無いことを確認",
            "社内端末から ping と Test-NetConnection で、ping では応答があるがポート 8080 の TCP は開いていないことを確認",
            "検証用サーバ上で、8080 の待ち受けとログイン URL への応答を確認",
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
          kind: "scenario",
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
          caption: "HTML は 200、`app.css` だけ 404 の例です。一覧の Java 処理は通っています。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "画面の HTML は 200",
            "`app.css` は 404。Request URL は `/shinsei/css/app.css`",
            "開発者ツールのコンソールに、CSS の 404 のエラーが出ている",
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
          text: "HTML が 200 なら、一覧の Controller は動いています。次は 404 の Request URL と、サーバ上のファイルの有無を見ましょう。",
        },
        { type: "diagram", name: "not-found", caption: "HTML が 200 でも、静的ファイルだけ 404 のことがあります。" },
        {
          type: "h2",
          text: "原因の追跡",
        },
        {
          type: "p",
          text: "Network タブの 404 は `/shinsei/css/app.css` でした。一覧の HTML は Java まで届いています。検証用環境のサーバ上で、WAR を展開した先に `app.css` があるかを見ます。申請くんの Spring Boot WAR では、static は `WEB-INF/classes/static` に入ります。",
        },
        {
          type: "ul",
          items: [
            "`ls -l /opt/tomcat/webapps/shinsei/WEB-INF/classes/static/css/` … 展開先の CSS ディレクトリを一覧する",
          ],
        },
        {
          type: "code",
          title: "例（検証用環境のサーバ上）",
          lang: "text",
          code: `$ ls -l /opt/tomcat/webapps/shinsei/WEB-INF/classes/static/css/
-rw-r--r-- 1 tomcat tomcat 4120 Aug 16 04:00 app.css`,
        },
        {
          type: "p",
          text: "ファイルはあります。Java まで届いていれば 200 になるはずなので、Java より手前に何か挟まっていないか疑いましょう。この検証用環境では、手前に nginx が動いています。nginx の設定を見ます。",
        },
        {
          type: "code",
          title: "nginx の設定の例（このシナリオ）",
          lang: "nginx",
          highlightLines: [1],
          code: `location /shinsei/css/ {
    alias /var/www/html/css/;
}

location /shinsei/ {
    proxy_pass http://127.0.0.1:8080;
}`,
        },
        {
          type: "p",
          text: "nginx が見ているディレクトリにも、同じように ls します。",
        },
        {
          type: "code",
          title: "例（nginx が見ている先）",
          lang: "text",
          code: `$ ls -l /var/www/html/css/
ls: cannot access '/var/www/html/css/': No such file or directory`,
        },
        {
          type: "p",
          text: "手前の nginx が `/shinsei/css/` を先に受け、ディスクの別ディレクトリを見ています。そこには `app.css` が無いので 404 となっています。",
        },
        {
          type: "p",
          text: "直し方は複数あります。それぞれ利点と欠点があります。",
        },
        {
          type: "table",
          headers: ["触る場所", "すること", "利点", "欠点"],
          rows: [
            [
              "nginx が見ているディレクトリ",
              "`app.css` を置く",
              "静的ファイルを nginx が返すので速い",
              "アプリの `app.css` とは別に置く。片方だけ直すとずれる",
            ],
            [
              "nginx の設定（alias）",
              "向き先を WAR の展開先にする",
              "コピーを増やさない。静的ファイルを nginx が返すので速い",
              "展開先のパスに縛られる",
            ],
            [
              "nginx の設定（location）",
              "CSS 用の location を外し、proxy_pass だけにする",
              "構成が単純。ファイルは WAR だけ",
              "静的ファイルも Java が処理する",
            ],
          ],
        },
        {
          type: "h2",
          text: "このシナリオの要点",
        },
        {
          type: "ul",
          items: [
            "見た目の崩れは、先に静的ファイルのステータスコードを確認しましょう",
            "HTML 200 と CSS 404 が同時にある。層が違う",
            "手前に Apache / nginx があるなら、静的ファイルのパス設定を疑う",
          ],
        },
        {
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "Network タブで、HTML が 200 であることを確認",
            "CSS の行が 404 であることを確認",
            "WAR を展開した先に `app.css` があることを ls で確認",
            "手前の nginx が CSS の URL を先に受け、別ディレクトリを見ている",
          ],
        },
        { type: "quiz", id: "sc-http" },
      ],
    },
    {
      id: "impact-status",
      title: "[影響調査] 申請ステータスに CANCELLED を追加したい",
      minutes: 11,
      blocks: [
        {
          type: "callout",
          kind: "scenario",
          text: "取り下げ機能の見積もりのため、申請ステータスに `CANCELLED` を追加したときの影響範囲を調べてほしい、と依頼された。不具合報告ではない。",
        },
        {
          type: "p",
          text: "ここからは障害調査ではなく影響調査です。原因を1つ特定して直すのではなく、関係しそうな箇所を洗い出し、それぞれ直す必要があるかを1つずつ判断します。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "対象は申請くん。既存のステータスには `PENDING` と `APPROVED` があると聞いている",
            "DB には `t_request.status` がある",
            "取り下げの画面や API を追加するかは、まだ決まっていない",
          ],
        },
        {
          type: "h2",
          text: "先にやること",
        },
        {
          type: "p",
          text: "ヒットしたソースをひとつひとつ確認し、修正の要否を判断しましょう。依頼内容から修正の要否が断定できない箇所は、依頼者へ確認する必要があるので、情報をまとめておきましょう。",
        },
        {
          type: "ol",
          items: [
            "`status`、`PENDING`、`APPROVED` で全文検索する",
            "ヒットしたソースをひとつひとつ確認し、修正の要否を判断する",
            "依頼内容から断定できない箇所は、依頼者へ確認するため情報をまとめる",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "検索ですべて見つかるとは限らない",
          text: "カラム名や既存のステータスの値で検索しても、影響する箇所をすべて洗い出せるとは限りません。機械的に調べられない部分を洗い出すには、仕様やドメイン知識が要ります。",
        },
        {
          type: "h2",
          text: "影響の追跡",
        },
        {
          type: "h3",
          text: "承認ボタン押下時の分岐",
        },
        {
          type: "p",
          text: "`PENDING` で検索すると、承認の入口の if がヒットします。",
        },
        {
          type: "code",
          title: "RequestController.approve（申請くん）",
          lang: "java",
          highlightLines: [1],
          code: `if (!"PENDING".equals(request.getStatus())) {
  redirectAttributes.addFlashAttribute(
      "errorMessage", "この申請は承認できません");
  return "redirect:/requests/" + id;
}
requestService.approve(id, user.getId());`,
        },
        {
          type: "p",
          text: "PENDING 以外は承認できません。取り下げ済みの申請は承認できないのが正しい仕様です。そのため、`CANCELLED` を追加しても、この分岐の修正は不要です。",
        },
        {
          type: "h3",
          text: "申請一覧の SQL",
        },
        {
          type: "p",
          text: "一覧の SQL は、未承認だけ取る条件です。",
        },
        {
          type: "code",
          title: "RequestMapper.xml の findMine（申請くん）",
          lang: "xml",
          highlightLines: [3],
          code: `WHERE (r.applicant_id = #{userId}
   OR r.approver_id = #{userId})
  AND r.status = 'PENDING'`,
        },
        {
          type: "p",
          text: "申請一覧は未承認の作業画面です。取り下げ済みは、この画面で扱う申請ではないので、一覧に出ないのは妥当です。この SQL の修正は不要です。",
        },
        {
          type: "h3",
          text: "履歴の検索フォーム",
        },
        {
          type: "p",
          text: "申請履歴の検索フォームは、未承認と承認済みです。「すべて」もあります。",
        },
        {
          type: "code",
          title: "history.html のステータス（申請くん）",
          lang: "html",
          code: `<option value="">すべて</option>
<option value="PENDING">未承認</option>
<option value="APPROVED">承認済み</option>`,
        },
        {
          type: "p",
          text: "「すべて」なら、`CANCELLED` のレコードも SQL に載ります。`CANCELLED` だけに絞る選択肢はありません。取り下げ済みを履歴検索画面でどう扱うかは依頼文に無いので、依頼者へ確認します。",
        },
        {
          type: "h3",
          text: "ステータスの見た目",
        },
        {
          type: "p",
          text: "一覧・履歴・詳細の画面では、PENDING かどうかで色を分けています。",
        },
        {
          type: "code",
          title: "list.html のステータス（申請くん）",
          lang: "html",
          highlightLines: [2],
          code: `<span class="status"
      th:classappend="\${item.status == 'PENDING'} ? ' is-pending' : ' is-approved'"
      th:text="\${item.status}">PENDING</span>`,
        },
        {
          type: "p",
          text: "PENDING 以外は `is-approved` なので、`CANCELLED` は画面上、承認済みと同じ見た目になります。取り下げ済みが承認済みに見えるのは妥当ではありません。",
        },
        {
          type: "h3",
          text: "新規申請の `INSERT` と、承認時の `UPDATE`",
        },
        {
          type: "p",
          text: "これは DB へ登録する値の話です。新規申請の `INSERT` では `status` に `PENDING` を入れます。承認の `UPDATE` では `APPROVED` にします。",
        },
        {
          type: "code",
          title: "RequestService.create（申請くん）",
          lang: "java",
          highlightLines: [1],
          code: `request.setStatus("PENDING");
requestMapper.insert(request);`,
        },
        {
          type: "code",
          title: "RequestService.approve（申請くん）",
          lang: "java",
          highlightLines: [1],
          code: `request.setStatus("APPROVED");
requestMapper.update(request);`,
        },
        {
          type: "p",
          text: "`CANCELLED` を追加しても、この2つの処理の修正は不要です。",
        },
        {
          type: "h3",
          text: "`CANCELLED` にする処理",
        },
        {
          type: "p",
          text: "`CANCELLED` にするメソッドは現時点ではありません。「取り下げの画面や API を追加するかは、まだ決まっていない」という前提があるため、`CANCELLED` への更新処理を追加するかは、依頼者へ確認します。",
        },
        {
          type: "h3",
          text: "JSON の応答",
        },
        {
          type: "p",
          text: "JSON の `RequestResponse` は `status` を文字列で返すだけです。新しい値でもそのまま返ります。この DTO の修正は不要です。",
        },
        {
          type: "h3",
          text: "テーブル定義",
        },
        {
          type: "p",
          text: "`schema.sql` の `status` は `VARCHAR(32) NOT NULL` です。`CANCELLED` は収まります。長さの変更は不要です。CHECK は無いので、DB が値を拒むことはありません。制約を追加するかは依頼に無いので、依頼者へ確認します。",
        },
        {
          type: "callout",
          kind: "note",
          title: "テーブル定義の場所",
          text: "申請くんは `schema.sql` で管理していますが、実際の現場では別のファイル名のことがあります。ファイルと稼働している DB がずれていることもあるので、実際に稼働している DB の定義を見るのが最も正確です。",
        },
        {
          type: "h3",
          text: "修正の要否",
        },
        {
          type: "p",
          text: "ここまでの判断は、次です。",
        },
        {
          type: "table",
          headers: ["箇所", "いま", "修正の要否"],
          rows: [
            ["`RequestController.approve`", "PENDING 以外は承認できない", "不要"],
            ["`findMine`", "`status = 'PENDING'`", "不要"],
            ["`history.html` の select", "すべて / PENDING / APPROVED", "依頼者へ確認"],
            ["一覧・履歴・詳細の見た目", "PENDING でなければ `is-approved`", "依頼者へ確認"],
            ["`RequestService` の create / approve", "新規は PENDING、承認は APPROVED", "不要"],
            ["`CANCELLED` にする処理", "メソッドが無い", "依頼者へ確認"],
            ["`schema.sql`", "`VARCHAR(32) NOT NULL`", "長さは不要。制約の追加は依頼者へ確認"],
            ["`RequestResponse`", "status を文字列で返す", "不要"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "申請くんに無いもの",
          text: "enum、DB の CHECK、夜間バッチ、CSV エクスポートは、申請くんにはありません。同じ語で検索してヒットしなければ、見積もりに「無い」と書けます。現場のアプリではヒットすることがあります。",
        },
        {
          type: "h2",
          text: "このシナリオの要点",
        },
        {
          type: "ul",
          items: [
            "既存の値名（`PENDING`）から逆引きすると漏れが減る",
            "検索ですべて見つかるとは限らない。機械的に調べられない部分を洗い出すには、仕様やドメイン知識が要る",
            "ヒットしたソースをひとつひとつ確認し、修正の要否を判断する",
            "依頼内容から断定できない箇所は、依頼者へ確認するため情報をまとめる",
          ],
        },
        {
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "`status` / `PENDING` / `APPROVED` で全文検索する",
            "ヒットしたソースをひとつひとつ確認し、修正の要否を判断する",
            "断定できない箇所は、依頼者へ確認するため情報をまとめる",
          ],
        },
        { type: "quiz", id: "sc-impact-status" },
      ],
    },
    {
      id: "impact-search",
      title: "[影響調査] 一覧と申請履歴に部署で絞り込みを追加したい",
      minutes: 14,
      blocks: [
        {
          type: "callout",
          kind: "scenario",
          text: "申請一覧と申請履歴に「部署で絞り込み」を追加したい。既存の処理への影響を教えてほしい、と依頼された。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "対象画面は申請一覧と申請履歴。URL は `/shinsei/requests` と `/shinsei/requests/history`",
            "フォームに部署のプルダウンを追加する想定",
          ],
        },
        {
          type: "h2",
          text: "先にやること",
        },
        {
          type: "p",
          text: "処理の入口は各画面の URL です。一覧は `/shinsei/requests`、履歴は `/shinsei/requests/history` で検索し、Controller から Service、Mapper へと呼び出しを辿りましょう。同じ処理を別の画面や API からも呼んでいないかも見ます。",
        },
        {
          type: "h2",
          text: "影響の追跡",
        },
        {
          type: "h3",
          text: "一覧の入口",
        },
        {
          type: "p",
          text: "`GET /shinsei/requests` の入口は `RequestController.list` です。クエリの引数はありません。",
        },
        {
          type: "code",
          title: "RequestController.list（申請くん）",
          lang: "java",
          highlightLines: [1, 3],
          code: `@GetMapping
public String list(Model model, @AuthenticationPrincipal LoginUser user) {
  model.addAttribute("applications", requestService.findMine(user.getId()));
  return "request/list";
}`,
        },
        {
          type: "h3",
          text: "一覧の SQL",
        },
        {
          type: "p",
          text: "`findMine` はユーザ ID だけ受け取ります。Mapper は未承認だけ取ります。部署の条件はありません。",
        },
        {
          type: "code",
          title: "RequestService.findMine（申請くん）",
          lang: "java",
          highlightLines: [1],
          code: `public List<RequestEntity> findMine(Long userId) {
  return requestMapper.findMine(userId);
}`,
        },
        {
          type: "code",
          title: "RequestMapper.xml の findMine（申請くん）",
          lang: "xml",
          code: `WHERE (r.applicant_id = #{userId}
   OR r.approver_id = #{userId})
  AND r.status = 'PENDING'`,
        },
        {
          type: "h3",
          text: "一覧の画面",
        },
        {
          type: "p",
          text: "`list.html` に検索フォームはありません。",
        },
        {
          type: "code",
          title: "list.html（申請くん）",
          lang: "html",
          code: `<div class="page-head">
  <h1>申請一覧</h1>
  <a class="btn" th:href="@{/requests/new}">新規申請</a>
</div>
<p class="lead">未承認の申請です。承認と新規申請は、この画面から行います。</p>
<table class="data">`,
        },
        {
          type: "p",
          text: "プルダウンを追加すると、テンプレートと Controller の引数が増えます。フォームの `name` と `@RequestParam` の名前は揃えます。",
        },
        {
          type: "h3",
          text: "申請履歴",
        },
        {
          type: "p",
          text: "申請履歴の入口は `GET /shinsei/requests/history` です。`RequestController.history` が `searchHistory` を呼びます。部署の引数はありません。",
        },
        {
          type: "code",
          title: "RequestController.history（申請くん）",
          lang: "java",
          highlightLines: [1, 12],
          code: `@GetMapping("/history")
public String history(
    @RequestParam(value = "title", required = false) String title,
    @RequestParam(value = "requestStatus", required = false) String requestStatus,
    @RequestParam(value = "createdFrom", required = false) String createdFrom,
    @RequestParam(value = "createdTo", required = false) String createdTo,
    Model model,
    @AuthenticationPrincipal LoginUser user
) {
  model.addAttribute(
      "results",
      requestService.searchHistory(
          user.getId(), title, requestStatus, createdFrom, createdTo)
  );
  return "request/history";
}`,
        },
        {
          type: "p",
          text: "`searchHistory` は、一覧の `findMine` とは別メソッドです。部署の引数はありません。",
        },
        {
          type: "code",
          title: "RequestService.searchHistory（申請くん）",
          lang: "java",
          highlightLines: [1],
          code: `public List<RequestEntity> searchHistory(
    Long userId,
    String title,
    String requestStatus,
    String createdFrom,
    String createdTo
) {
  return requestMapper.searchHistory(
      userId, title, requestStatus, createdFrom, createdTo);
}`,
        },
        {
          type: "p",
          text: "Mapper の条件は、ユーザと、任意の件名・ステータス・申請日です。部署はありません。",
        },
        {
          type: "code",
          title: "RequestMapper.xml の searchHistory（申請くん）",
          lang: "xml",
          code: `WHERE (r.applicant_id = #{userId} OR r.approver_id = #{userId})
<if test="title != null and title != ''">
  AND r.title LIKE CONCAT('%', #{title}, '%')
</if>
<if test="requestStatus != null and requestStatus != ''">
  AND r.status = #{requestStatus}
</if>
<if test="createdFrom != null and createdFrom != ''">
  AND r.created_at &gt;= #{createdFrom}
</if>
<if test="createdTo != null and createdTo != ''">
  AND r.created_at &lt; DATE_ADD(#{createdTo}, INTERVAL 1 DAY)
</if>`,
        },
        {
          type: "p",
          text: "履歴には検索フォームがあります。部署のプルダウンは無いので、追加します。フォームの `name` と `@RequestParam` の名前は揃えます。",
        },
        {
          type: "code",
          title: "history.html の検索フォーム（申請くん）",
          lang: "html",
          code: `<form class="search" th:action="@{/requests/history}" method="get">
  <label>
    件名
    <input type="text" name="title" />
  </label>
  <label>
    ステータス
    <select name="status">
      <option value="">すべて</option>
      <option value="PENDING">未承認</option>
      <option value="APPROVED">承認済み</option>
    </select>
  </label>
  <label>
    申請日（開始）
    <input type="date" name="createdFrom" />
  </label>
  <label>
    申請日（終了）
    <input type="date" name="createdTo" />
  </label>
</form>`,
        },
        {
          type: "callout",
          kind: "note",
          title: "ステータスの name",
          text: "この `status` と Controller の `requestStatus` の食い違いは「申請履歴検索の結果が不正」で扱った別シナリオの不具合です。ここでは部署の追加に集中し、既存のずれには触れません。",
        },
        {
          type: "h3",
          text: "JSON の一覧",
        },
        {
          type: "p",
          text: "同じ `findMine` を、JSON の一覧も呼んでいます。依頼の画面ではありませんが、同じデータを出す経路です。",
        },
        {
          type: "code",
          title: "RequestApiController.list（申請くん）",
          lang: "java",
          highlightLines: [3],
          code: `@GetMapping
public List<RequestResponse> list(@AuthenticationPrincipal LoginUser user) {
  return requestService.findMine(user.getId()).stream()
      .map(RequestResponse::from)
      .toList();
}`,
        },
        {
          type: "p",
          text: "一覧と履歴の SQL だけ部署を追加すると、`GET /shinsei/api/requests` は絞られません。画面と API の両方を直すか、API は現状のままか、見積もりに書きます。",
        },
        {
          type: "h3",
          text: "部署のカラム",
        },
        {
          type: "p",
          text: "`t_user` にも `t_request` にも、部署のカラムはありません。",
        },
        {
          type: "code",
          title: "schema.sql（申請くん）",
          lang: "sql",
          code: `CREATE TABLE IF NOT EXISTS t_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS t_request (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL,
  applicant_id BIGINT NOT NULL,
  approver_id BIGINT,
  applicant_email VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME,
  CONSTRAINT fk_request_applicant FOREIGN KEY (applicant_id) REFERENCES t_user (id),
  CONSTRAINT fk_request_approver FOREIGN KEY (approver_id) REFERENCES t_user (id)
);`,
        },
        {
          type: "p",
          text: "DB の定義の修正が必要です。修正案は複数あり、案によって修正規模が変わります。例えば、部署マスタ（`t_department`）を新設して `t_user.department_id` に外部キーを足す案、`t_user` に部署名だけを持たせる案、集計のため `t_request` にも部署を複製する案などがあります。マスタを増やすほど正規化はできますが、既存データの移行や結合が増えます。",
        },
        {
          type: "callout",
          kind: "note",
          title: "テーブル定義の場所",
          text: "申請くんは `schema.sql` で管理していますが、実際の現場では別のファイル名のことがあります。ファイルと稼働している DB がずれていることもあるので、実際に稼働している DB の定義を見るのが最も正確です。",
        },
        {
          type: "h3",
          text: "直す対象",
        },
        {
          type: "p",
          text: "申請くんで直す対象は、次です。",
        },
        {
          type: "table",
          headers: ["箇所", "いま", "部署で絞ると"],
          rows: [
            ["`RequestController.list`", "クエリ引数が無い", "部署の `@RequestParam` を追加する"],
            ["`RequestService.findMine`", "userId だけ", "部署の引数を追加して Mapper へ渡す"],
            ["`RequestMapper.xml` の findMine", "ユーザと PENDING", "WHERE に部署を追加する"],
            ["`list.html`", "検索フォームが無い", "プルダウンを追加する。`name` を Controller と揃える"],
            ["`RequestController.history`", "件名・ステータス・申請日", "部署の `@RequestParam` を追加する"],
            ["`RequestService.searchHistory`", "userId と件名など", "部署の引数を追加して Mapper へ渡す"],
            ["`RequestMapper.xml` の searchHistory", "ユーザと任意の件名など", "WHERE に部署を追加する"],
            ["`history.html`", "件名・ステータス・申請日", "プルダウンを追加する。`name` を Controller と揃える"],
            ["`RequestApiController.list`", "同じ `findMine`", "画面だけ直すと JSON は絞られない"],
            ["`schema.sql`", "部署のカラムが無い", "DB の定義を直す。修正案は複数あり、案によって修正規模が変わる"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "申請くんに無いもの",
          text: "CSV エクスポートは、申請くんにはありません。同じ一覧を出す別経路としてヒットしたのは、JSON の API です。",
        },
        {
          type: "h2",
          text: "このシナリオの要点",
        },
        {
          type: "ul",
          items: [
            "対象画面が決まっていれば、影響調査も処理の入口は URL",
            "同じメソッドを呼ぶ API が無いかを見る",
            "履歴は `searchHistory` で、一覧とは別の SQL になる",
            "絞る値がスキーマに無ければ、画面より先に DB の定義を直す",
            "修正案は複数あり、案によって修正規模が変わる",
          ],
        },
        {
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            {
              tracks: [
                {
                  label: "一覧",
                  steps: [
                    "URL から `list` を特定する",
                    "`findMine` と Mapper の WHERE を確認する",
                    "同じ `findMine` を使う API がある",
                  ],
                },
                {
                  label: "履歴",
                  steps: ["URL から `history` と `searchHistory` を特定する"],
                },
              ],
            },
            "部署のカラムがスキーマに無い",
          ],
        },
        { type: "quiz", id: "sc-impact-search" },
      ],
    },
  ],
};
