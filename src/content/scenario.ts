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
          text: "上の `list.js` を、承認ボタンを押したときの流れに沿って読み、エラーの原因を追います。",
        },
        {
          type: "ul",
          items: [
            "`event.preventDefault();` のあと、`const tokenEl = document.getElementById(\"csrfToken\");` で要素を取り、tokenEl に入れる",
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
        { type: "diagram", name: "stack-own" },
        {
          type: "h2",
          text: "原因の追跡",
        },
        {
          type: "p",
          text: "操作時刻のサーバログには、先のとおり `NullPointerException` がありました。",
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
          text: "こうした不整合な行の作成を防ぐには、DB の `approver_id` に NOT NULL を付けるのが有効です。申請くんの列定義は NULL 可のままなので、値が空の行があると、今回のように 500 になります。",
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
          text: "「この申請は承認できません」で検索すると、Controller の分岐に当たりました。",
        },
        {
          type: "code",
          title: "検索で当たった箇所（申請くん）",
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
            "画面の文言でソースを検索し、Controller の分岐に当たる",
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
          text: "申請一覧画面が、検証用環境だけ 0 件になる。ローカル環境の起動では、同じログインユーザで 4 件出る。",
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
          text: "操作時刻のログで `findMine` を見ると、Parameters は 7, 7 でした。Total は 0 です。",
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
          text: "検証用環境の DB で同じ条件を実行すると、行は 0 件でした。",
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
          empty: "0 行",
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
            "GET が 200 で件数が違うなら、コード通読より先に、実行された SQL とその条件の行を見る",
            "同じ SQL を、アプリが接続している DB で実行し、画面と同じ 0 件なら、コードよりその DB の行を疑う",
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
            "同じ条件で DB を検索し、行が 0 件であることを確認",
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
          text: "申請履歴画面で、件名を「申請」、ステータスを「承認済み」にして検索すると、未承認の行が出る。エラーメッセージは出ない。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-history-search.jpg",
          alt: "件名は申請、ステータスは承認済みなのに、PENDING の行が出ている申請履歴",
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
          text: "画面に表示している検索結果は、テンプレートが `${results}` から出しています。Controller で `results` に載せている値を開きましょう。",
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
            "DNS の向き先、ポート、HTTPS の終端、プロキシの有無を表にする",
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
          text: "ファイルはあります。Java まで届いていれば 200 になるはずです。手前の nginx を見ます。",
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
      title: "[影響調査] 申請ステータスに CANCELLED を足したい",
      minutes: 9,
      blocks: [
        {
          type: "callout",
          kind: "scenario",
          text: "取り下げ機能の見積もりのため、申請ステータスに `CANCELLED` を追加したときの影響範囲を調べてほしい、と依頼された。不具合報告ではない。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "現状の値は `PENDING` / `APPROVED` などがある（詳細は未確認）",
            "DB には `t_request` があり、`status` カラムがあると聞いている",
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
            "`status`、`PENDING`、`APPROVED`、`t_request` で全文検索する",
            "enum や定数クラスがあれば、そこが値の定義元",
            "Mapper XML の `WHERE status = …` と、Service の if 分岐をメモする",
            "テンプレートの `th:if` や、一覧・詳細の表示文言を見る",
            "同じ `status` を JSON で返す API や、夜間バッチが無いかも同じ語で検索する",
          ],
        },
        { type: "diagram", name: "call-chain", caption: "例: 承認は Controller → Service → Mapper。status を触る箇所は、この鎖の複数点に散らばる。" },
        {
          type: "code",
          title: "検索で見つかった分岐の例（申請くん）",
          lang: "java",
          code: `var request = requestService.findById(id, user.getId());
if (!"PENDING".equals(request.getStatus())) {
  redirectAttributes.addFlashAttribute(
      "errorMessage", "この申請は承認できません");
  return "redirect:/requests/" + id;
}
requestService.approve(id, user.getId());
// 一覧 Mapper: AND r.status = 'PENDING'`,
        },
        {
          type: "p",
          text: "`CANCELLED` を足すと、次を直す必要がある、と一覧にできます。全部を読み切らなくても、ヒットファイルと「分岐 / 表示 / SQL」の分類で見積もりに回せます。",
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
          type: "h2",
          text: "このシナリオの要点",
        },
        {
          type: "ul",
          items: [
            "既存の値名（PENDING）から逆引きすると漏れが減る",
            "画面だけ見ても、Service やバッチの分岐は見落とす",
            "DB の CHECK 制約や、他システム連携のコード値も確認対象",
          ],
        },
        {
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "status や PENDING など既存の識別子で全文検索する",
            "ヒットを分岐・表示・SQL に分類する",
            "CANCELLED を足すと直す必要がある箇所を一覧にする",
          ],
        },
        { type: "quiz", id: "sc-impact-status" },
      ],
    },
    {
      id: "impact-search",
      title: "[影響調査] 一覧に部署で絞り込みを足したい",
      minutes: 8,
      blocks: [
        {
          type: "callout",
          kind: "scenario",
          text: "申請一覧に「部署で絞り込み」を追加したい。既存の一覧処理への影響を教えてほしい、と依頼された。",
        },
        {
          type: "h2",
          text: "いま分かっていること",
        },
        {
          type: "ul",
          items: [
            "対象画面は申請一覧。URL は `/shinsei/requests`",
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
          text: "処理の入口は一覧の URL です。`/shinsei/requests` で検索し、Controller の Java メソッドから Service、Mapper へ降りましょう。同じ一覧を別経路から出していないかも確認しましょう。",
        },
        { type: "diagram", name: "read-entry", caption: "URL → Controller → Service → SQL。影響調査も処理の入口は同じです。" },
        {
          type: "table",
          headers: ["確認すること", "理由"],
          rows: [
            ["Controller の引数（クエリパラメータ）", "部署 ID をどこで受け取るか"],
            ["Service の一覧メソッド", "条件を足す本体"],
            ["Mapper の SELECT と WHERE", "SQL とインデックスの影響"],
            ["テンプレートの form と `th:href`", "画面とパラメータ名の対応"],
            ["export / download の URL", "一覧と同じ条件を使っているか"],
          ],
        },
        {
          type: "p",
          text: "検索で `RequestController.list` と `RequestMapper.findMine` だけでなく、CSV 用の export メソッドも同じ Mapper を呼んでいる、と分かれば、一覧とエクスポートの両方を直す必要がある、と書けます。",
        },
        {
          type: "h2",
          text: "このシナリオの要点",
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
          type: "h2",
          text: "調査の流れの振り返り",
        },
        {
          type: "investigation-flow",
          items: [
            "一覧の URL から Controller を特定する",
            "Controller → Service → Mapper を辿る",
            "export など別経路も同じ Mapper を使っていないか確認する",
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
