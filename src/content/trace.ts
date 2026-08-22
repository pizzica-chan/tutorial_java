import type { Track } from "../types";
import { requestListEntryPointSnippet } from "../data/entryPoint";

export const traceTrack: Track = {
  id: "trace",
  no: "05",
  title: "リクエストの追跡",
  kicker: "TRACE",
  description: "画面や Web API から Controller、Service、SQL、応答まで一本で追う。",
  accent: "#e8a54b",
  lessons: [
    {
      id: "from-screen",
      title: "画面から処理の入口を特定する",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "処理の入口の探し方は「ソースの読み方」と同じです。この章では、特定した処理の入口から SQL と応答まで、一本の線の区間を追います。画面遷移しない操作は、アドレスバーではなく Network タブの XHR / fetch を見ましょう。",
        },
        { type: "diagram", name: "read-entry", caption: "画面の URL から、サーバ側の処理の入口へ。" },
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
          type: "code",
          title: "RequestController.java（抜粋）",
          lang: "java",
          code: requestListEntryPointSnippet,
        },
        {
          type: "callout",
          kind: "tip",
          title: "コンテキストパス",
          text: "画面は /shinsei/requests でも、Controller は Spring の @RequestMapping(\"/requests\") だけのことがあります。検索語は requests や approve のように特徴的な部分にしましょう。",
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
          text: "Java のメソッド名が list でも、今見ている画面とは限りません。HTTP メソッド（GET など）とパスの両方を確認しましょう。",
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
          text: "Controller の次に、ビジネスロジックのメソッドを見ましょう。次の印を追いましょう。",
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
requestMapper.update(request);
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
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "スロークエリや Mapper の DEBUG など、実行された SQL が先に手元にあることがあります。件数を DB と突き合わせる前に、その SQL を誰が発行したかをソースで探しましょう。",
        },
        {
          type: "h2",
          text: "手元の SQL（申請くん）",
        },
        {
          type: "p",
          text: "申請くんなら、MyBatis の DEBUG に次のように出ます。",
        },
        {
          type: "code",
          title: "ログに出た SQL（MyBatis の DEBUG）",
          code: `==>  Preparing: SELECT id, title, status, applicant_id, approver_id, created_at
FROM t_request WHERE applicant_id = ? OR approver_id = ? ORDER BY created_at DESC
==> Parameters: 7(Long), 7(Long)
<==      Total: 3`,
        },
        {
          type: "p",
          text: "この文をそのまま検索しても、見つからないことが多いです。空白や改行が違ううえ、ログの ?（プレースホルダ）はソースでは #{userId} になっています。テーブル名や特徴のある文の一部から検索しましょう。",
        },
        {
          type: "h2",
          text: "MyBatis: 実行された SQL に近い文がファイルにある",
        },
        {
          type: "p",
          text: "申請くんでは、t_request や applicant_id で検索すると、Mapper の XML に当たります。id=\"findMine\" が、Java のメソッド名です。",
        },
        {
          type: "code",
          title: "RequestMapper.xml（抜粋）",
          lang: "xml",
          code: `<select id="findMine" resultType="RequestEntity">
  SELECT id, title, status, applicant_id, approver_id, created_at
  FROM t_request
  WHERE applicant_id = #{userId}
     OR approver_id = #{userId}
  ORDER BY created_at DESC
</select>`,
        },
        {
          type: "code",
          title: "RequestMapper.java（抜粋）",
          lang: "java",
          code: `public interface RequestMapper {
  List<RequestEntity> findMine(@Param("userId") Long userId);
}`,
        },
        {
          type: "p",
          text: "Logger に XML の id や Java のメソッド名が出ることがあります。出ていたら、それを先に検索しましょう。XML に条件分岐があると、ログに出た SQL は XML の一部だけ、ということもあります。",
        },
        {
          type: "h2",
          text: "JPA: 実行された SQL がソースに無いことが多い",
        },
        {
          type: "p",
          text: "申請くんは MyBatis です。ここからは、同じ t_request を JPA で読む場合の例です。",
        },
        {
          type: "code",
          title: "ログに出た SQL の例（Hibernate）",
          code: `Hibernate:
    select r1_0.id, r1_0.title, r1_0.status, r1_0.applicant_id
    from t_request r1_0
    where r1_0.applicant_id=?`,
        },
        {
          type: "p",
          text: "この SELECT で全文検索しても、プロジェクト内にはありません。r1_0 は Hibernate が付けた別名です。テーブル名 t_request で検索すると、Entity の @Table に当たります。",
        },
        {
          type: "code",
          title: "Request.java（JPA の例）",
          lang: "java",
          code: `@Entity
@Table(name = "t_request")
public class Request {
  @Id
  private Long id;
  private String title;
  private String status;

  @Column(name = "applicant_id")
  private Long applicantId;
}`,
        },
        {
          type: "p",
          text: "発行しているのは Repository です。書き方で、ソースに SQL があるかが変わります。",
        },
        {
          type: "code",
          title: "RequestRepository.java（JPA の例）",
          lang: "java",
          code: `public interface RequestRepository extends JpaRepository<Request, Long> {
  List<Request> findByApplicantId(Long applicantId);
  // メソッド名から組み立てる。SQL の文字列は無い

  @Query("SELECT r FROM Request r WHERE r.applicantId = :userId")
  List<Request> findMine(@Param("userId") Long userId);
  // JPQL。FROM は Request で、実行された SQL の t_request とは一致しない

  @Query(
      value = "SELECT * FROM t_request WHERE applicant_id = :userId",
      nativeQuery = true)
  List<Request> findMineNative(@Param("userId") Long userId);
  // nativeQuery。実行された SQL に近い文がソースにある
}`,
        },
        {
          type: "p",
          text: "メソッド名だけ、または JPQL なら、実行された SQL では見つかりません。t_request で Entity を見つけ、参照検索で呼び出し元を辿りましょう。nativeQuery なら、実行された SQL に近い文で XML と同じように検索できます。",
        },
        {
          type: "callout",
          kind: "note",
          title: "SQL の置き場所はライブラリ次第",
          text: "JdbcTemplate のように、Java の文字列に SQL を書く書き方もあります。ログの文言は設定次第です。",
        },
        {
          type: "p",
          text: "Mapper や Repository が見つかったら、参照検索で誰が呼んでいるかを見ましょう。画面からの下りと同じ線です。",
        },
        {
          type: "h2",
          text: "件数・列・条件",
        },
        {
          type: "p",
          text: "ソースが分かったら、件数・列・条件を突き合わせましょう。MyBatis でも JPA でも、見る観点は同じです。SQL の条件が期待どおりでも、DB に入っている行が無かったり、値そのものがおかしかったりすることがあります。",
        },
        {
          type: "table",
          headers: ["症状", "疑うこと"],
          rows: [
            ["件数が少ない", "WHERE が厳しい、論理削除フラグ。その条件の行が無い"],
            ["他人のデータが見える", "WHERE のログインユーザ条件漏れ"],
            ["遅い", "全件スキャン、N+1、ソート、件数"],
            ["更新されない", "WHERE id の誤り、別テーブル"],
            ["起動後に突然落ちる", "存在しない列、環境で DDL 未適用"],
            ["SQL の結果は画面と同じなのに、期待と違う", "行の値がおかしい、マスタのずれ、別の DB を見ている"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "検証用 DB で SQL を流すとき",
          text: "同じ SQL を検証用環境の DB で実行できるなら、コードを読むより早いことがあります。SELECT はそのまま試せます。UPDATE や DELETE を実行すると、共有している検証用環境のデータが本当に書き換わります。その環境を更新してよいか確認しましょう。試すならトランザクションを始めて結果を見て ROLLBACK しましょう。COMMIT はしません。",
        },
        { type: "quiz", id: "trace-sql-source" },
      ],
    },
    {
      id: "full-flow",
      title: "申請一覧を開く処理を追う",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "申請一覧を開く処理を、区間ごとに追いましょう。障害調査は、この線のどこで期待と違うかを特定する作業です。JSON を返す API なら、テンプレートの区間は無く、Content-Type が application/json で終わります。Service より手前の探し方は同じです。",
        },
        { type: "widget", name: "flow" },
      ],
    },
  ],
};
