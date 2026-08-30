import type { Track } from "../types";

export const traceTrack: Track = {
  id: "trace",
  no: "05",
  title: "リクエストの追跡",
  kicker: "TRACE",
  description: "処理の入口から SQL と応答まで、一本の線で追います。",
  accent: "#e8a54b",
  lessons: [
    {
      id: "from-screen",
      title: "入口から先を追う",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "前章「ソースの読み方」の「処理の入口から読む」では、申請一覧の入口を `RequestController.list` と特定しました。この章では、その入口から Service、SQL、応答へ進みます。入口の探し方を見直す場合は、前章のその項目へ戻りましょう。",
        },
        {
          type: "p",
          text: "`list` が呼ぶ Service を開き、Mapper の SQL と、最後に返す HTML までを一本につなぎます。JSON を返す Web API でも、応答まで追う考え方は同じです。",
        },
        {
          type: "callout",
          kind: "tip",
          title: "コンテキストパス",
          text: "前章で見た画面の URL は `/shinsei/requests` です。先頭の `/shinsei` はコンテキストパスなので、Controller は Spring の `@RequestMapping(\"/requests\")` だけのことがあります。入口を見直すときは、`requests` のように特徴的な部分で検索しましょう。",
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
          type: "figure",
          kind: "screen",
          src: "/images/screen-detail.jpg",
          alt: "申請くんの申請詳細画面（交通費申請）",
          caption: "申請詳細。アドレスバーは `/shinsei/requests/12` です。`list` ではなく、パスに ID が付く `detail` です。",
        },
        {
          type: "p",
          text: "Java のメソッド名が `list` でも、今見ている画面とは限りません。HTTP メソッド（GET など）とパスの両方を確認しましょう。",
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
          text: "Controller の次に、ビジネスロジックを扱う Java メソッドを見ましょう。次の箇条書きにある処理を探します。",
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
          highlightLines: [6],
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
      title: "SQL からソースを探す",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "DB 側にスロークエリログが出たときなど、調べたい SQL は分かっているのに、アプリ側のどのソースが発行したか分からないことがあります。この項目では、その探し方を説明します。",
        },
        {
          type: "p",
          text: "探す前に、そのプロジェクトで SQL の実行に使っているライブラリを確認しましょう。`pom.xml` や `build.gradle` の依存を見ると、MyBatis、JPA（Hibernate）、JdbcTemplate などが分かります。依存の見方は、「Maven / Gradle」で説明しています。",
          link: {
            label: "Maven / Gradle",
            to: "/tracks/java-map/build",
          },
        },
        {
          type: "h2",
          text: "全体の流れ",
        },
        {
          type: "diagram",
          name: "sql-to-source",
          caption: "MyBatis と JPA（Hibernate）の例です。JdbcTemplate など別の書き方もあります。",
        },
        {
          type: "h2",
          text: "ログの SQL をそのまま検索しない",
        },
        {
          type: "p",
          text: "申請くんの一覧に相当する SQL が、MySQL のスロークエリログに出たとします。",
        },
        {
          type: "code",
          title: "MySQL のスロークエリログ（例）",
          highlightLines: [5],
          code: `# Time: 2026-04-10T09:15:23.456789Z
# User@Host: app[app] @ localhost []
# Query_time: 2.103421  Lock_time: 0.000120  Rows_sent: 4  Rows_examined: 4
SELECT id, title, status, applicant_id, approver_id, created_at
FROM t_request WHERE (applicant_id = 7 OR approver_id = 7) AND status = 'PENDING' ORDER BY created_at DESC;`,
        },
        {
          type: "p",
          text: "この文をそのまま検索しても、見つからないことが多いです。空白や改行が違うこともあります。",
        },
        {
          type: "p",
          text: "上の例では `applicant_id` = 7 と出ますが、7 の部分はソースでは `#{userId}` と書きます。7 で検索しても XML にはヒットしません。テーブル名やカラム名から探しましょう。",
        },
        {
          type: "h2",
          text: "MyBatis（申請くん）",
        },
        {
          type: "p",
          text: "申請くんは MyBatis です。`t_request` や `applicant_id` で検索すると、Mapper の XML がヒットします。",
        },
        {
          type: "code",
          title: "RequestMapper.xml（抜粋）",
          lang: "xml",
          highlightLines: [1, 4, 5, 6],
          code: `<select id="findMine" resultType="RequestEntity">
  SELECT id, title, status, applicant_id, approver_id, created_at
  FROM t_request
  WHERE (applicant_id = #{userId}
     OR approver_id = #{userId})
    AND status = 'PENDING'
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
          text: "上の例では、XML の select の id が `findMine` で、Java の `findMine` メソッドと対応しています。参照検索で、誰がこのメソッドを呼んでいるかを辿りましょう。",
        },
        {
          type: "h2",
          text: "JPA（Hibernate）の例",
        },
        {
          type: "p",
          text: "JPA（Hibernate）のプロジェクトでは、実行された SQL がソースに無いことが多いです。同じ `t_request` を読む場合の例です。",
        },
        {
          type: "code",
          title: "ログに出た SQL の例（JPA / Hibernate）",
          highlightLines: [3],
          code: `Hibernate:
    select r1_0.id, r1_0.title, r1_0.status, r1_0.applicant_id
    from t_request r1_0
    where r1_0.applicant_id=?`,
        },
        {
          type: "p",
          text: "この SELECT で全文検索しても、プロジェクト内にはありません。r1_0 は Hibernate が付けた別名です。テーブル名 `t_request` で検索すると、Entity の `@Table` がヒットします。",
        },
        {
          type: "code",
          title: "Request.java（JPA の例）",
          lang: "java",
          highlightLines: [2],
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
          highlightLines: [9, 10, 11],
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
          text: "メソッド名だけ、または JPQL なら、実行された SQL では見つかりません。`t_request` で Entity を見つけ、参照検索で呼び出し元を辿りましょう。`nativeQuery` なら、実行された SQL に近い文で MyBatis と同じように検索できます。",
        },
        {
          type: "callout",
          kind: "note",
          title: "SQL の置き場所は、MyBatis か JPA かで違う",
          text: "JdbcTemplate のように、Java の文字列に SQL を書く書き方もあります。ログの文言は設定次第です。",
        },
        {
          type: "h2",
          text: "件数・カラム・条件",
        },
        {
          type: "p",
          text: "ソースが分かったら、件数・カラム・条件を突き合わせましょう。MyBatis でも JPA でも、見る観点は同じです。SQL の条件が期待どおりでも、DB に入っているレコードが無かったり、値そのものがおかしかったりすることがあります。",
        },
        {
          type: "table",
          headers: ["症状", "疑うこと"],
          rows: [
            ["件数が少ない", "WHERE が厳しい、論理削除フラグ。その条件のレコードが無い"],
            ["他人のデータが見える", "WHERE のログインユーザ条件漏れ"],
            ["遅い", "全件スキャン、N+1、ソート、件数"],
            ["更新されない", "WHERE id の誤り、別テーブル"],
            ["起動後に突然落ちる", "存在しないカラム、環境で DDL 未適用"],
            ["SQL の結果は画面と同じなのに、期待と違う", "レコードの値がおかしい、マスタのずれ、別の DB を見ている"],
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
          text: "申請一覧を開く処理を、区間ごとに追いましょう。障害調査は、この線のどこで期待と違うかを特定する作業です。JSON を返す API なら、テンプレートの区間は無く、`Content-Type` が `application/json` で終わります。Service より手前の探し方は同じです。",
        },
        { type: "widget", name: "flow" },
      ],
    },
  ],
};
