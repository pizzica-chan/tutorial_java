import type { Track } from "../types";

export const traceTrack: Track = {
  id: "trace",
  no: "04",
  title: "リクエストの追跡",
  kicker: "TRACE",
  description: "画面や Web API から Controller、Service、SQL、応答まで一本で追う。",
  accent: "#e8a54b",
  lessons: [
    {
      id: "from-screen",
      title: "画面から入口を特定する",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "入口の探し方は「ソースの読み方」と同じです。この章では、特定した入口から SQL と応答まで、一本の線の区間を追います。画面遷移しない操作は、アドレスバーではなく Network タブの XHR / fetch を見ます。",
        },
        { type: "diagram", name: "read-entry", caption: "画面の URL から、サーバ側の入口へ。" },
        {
          type: "ol",
          items: [
            "対象画面を開き、アドレスバーの URL を控える",
            "開発者ツールの Network タブで、操作した瞬間のリクエストを特定する（JSON なら XHR / fetch）",
            "HTML またはテンプレートで form / a / fetch の行き先を見る",
            "そのパスで Java を検索する",
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "コンテキストパス",
          text: "画面は /shinsei/requests でも、Controller は Spring の @RequestMapping(\"/requests\") だけのことがあります。検索語は requests や approve のように特徴的な部分にします。",
        },
        { type: "quiz", id: "trace-start" },
      ],
    },
    {
      id: "mapping",
      title: "URL マッピング",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "Spring では、クラスとメソッドのアノテーションを足して URL になります。",
        },
        {
          type: "code",
          title: "合成される URL",
          lang: "java",
          code: `@Controller
@RequestMapping("/requests")
public class RequestController {
  @GetMapping
  public String list(...) { ... }           // GET /requests

  @GetMapping("/{id}")
  public String detail(...) { ... }         // GET /requests/12

  @PostMapping("/{id}/approve")
  public String approve(...) { ... }        // POST /requests/12/approve
}`,
        },
        { type: "diagram", name: "mapping" },
        {
          type: "p",
          text: "Java のメソッド名が list でも、今見ている画面とは限りません。HTTP メソッド（GET など）とパスの両方を確認します。",
        },
        {
          type: "p",
          text: "JSON を返す Web API も、クラスのプレフィックスとメソッドのパスを足す点は同じです。出口がテンプレートではなく JSON なだけです。",
        },
        {
          type: "code",
          title: "RestController",
          lang: "java",
          code: `@RestController
@RequestMapping("/api/requests")
public class RequestApiController {
  @GetMapping
  public List<RequestResponse> list(...) { ... }     // GET /api/requests → JSON の配列

  @GetMapping("/{id}")
  public RequestResponse detail(...) { ... }         // GET /api/requests/12 → JSON 1件

  @PostMapping("/{id}/approve")
  public void approve(...) { ... }                   // POST /api/requests/12/approve
}`,
        },
        {
          type: "ul",
          items: [
            "RestController なら JSON。画面 HTML ではない。templates は見ない",
            "複数の Controller が同じパスを持つと起動時に衝突する",
            "Struts なら設定 XML や action 属性を見る",
          ],
        },
      ],
    },
    {
      id: "down",
      title: "Service から SQL",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "Controller の次に、業務判断があるメソッドを見ます。次の印を追います。",
        },
        {
          type: "ul",
          items: [
            "if / switch … ステータスや権限で早期 return",
            "throw … 業務例外。画面メッセージと対応することが多い",
            "save / update / insert … 永続化",
            "他クラスの呼び出し … メール、ワークフロー、履歴",
          ],
        },
        {
          type: "code",
          title: "承認処理（申請くん）",
          lang: "java",
          code: `if (request == null) throw new NotFoundException(...);
if (!request.getApproverId().equals(approverId))
  throw new ForbiddenException(...);
request.setStatus("APPROVED");
requestRepository.update(request);
mailService.notifyApplicant(request);`,
        },
        {
          type: "p",
          text: "承認はできたがメールが来ないなら、更新は成功して notify だけ失敗している可能性があります。処理は一本ではなく枝分かれします。",
        },
        { type: "diagram", name: "service-fork" },
      ],
    },
    {
      id: "sql",
      title: "SQL の突き合わせ",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "MyBatis なら XML、JPA ならログに出る SQL または @Query。件数・列・条件を突き合わせます。見る観点は同じです。",
        },
        {
          type: "table",
          headers: ["症状", "SQL で疑うこと"],
          rows: [
            ["件数が少ない", "WHERE が厳しい、論理削除フラグ"],
            ["他人のデータが見える", "WHERE のユーザ条件漏れ"],
            ["遅い", "全件スキャン、N+1、ソート、件数"],
            ["更新されない", "WHERE id の誤り、別テーブル"],
            ["起動後に突然落ちる", "存在しない列、環境で DDL 未適用"],
          ],
        },
        {
          type: "p",
          text: "同じ SQL を検証 DB で実行できるなら、コードを読むより早いことがあります。SELECT はそのまま試せます。UPDATE や DELETE を実行すると、共有している検証データが本当に書き換わります。その環境を更新してよいか確認し、試すならトランザクションを始めて結果を見て ROLLBACK します。COMMIT はしません。",
        },
      ],
    },
    {
      id: "full-flow",
      title: "一覧表示の全区間",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "申請一覧を開く処理を、区間ごとに追います。障害調査は、この線のどこで期待と違うかを特定する作業です。JSON を返す API なら、テンプレートの区間は無く、Content-Type が application/json で終わります。Service より手前の探し方は同じです。",
        },
        { type: "widget", name: "flow" },
      ],
    },
  ],
};
