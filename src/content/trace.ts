import type { Track } from "../types";

export const traceTrack: Track = {
  id: "trace",
  no: "05",
  title: "SQL からソースを探す",
  kicker: "SQL",
  description: "実行された SQL から、発行したアプリのソースを見つけ、DB の中身と突き合わせます。",
  accent: "#395ca3",
  lessons: [
    {
      id: "sql",
      title: "SQL を検索する前に",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "DB 側にスロークエリログが出たときなど、調べたい SQL は分かっているのに、アプリ側のどのソースが発行したか分からないことがあります。この章では、その探し方を説明します。",
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
          caption: "MyBatis・JPA（Hibernate）・JdbcTemplate の例です。",
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
SELECT r.id, r.title, r.status, r.applicant_id, r.approver_id, r.applicant_email, r.created_at, a.display_name AS applicant_name, v.display_name AS approver_name
FROM t_request r JOIN t_user a ON a.id = r.applicant_id LEFT JOIN t_user v ON v.id = r.approver_id WHERE (r.applicant_id = 7 OR r.approver_id = 7) AND r.status = 'PENDING' ORDER BY r.created_at DESC;`,
        },
        {
          type: "p",
          text: "この文をそのまま検索しても、見つからないことが多いです。空白や改行が違うこともあります。",
        },
        {
          type: "p",
          text: "上の例では `applicant_id` = 7 と出ますが、7 の部分はソースでは `#{userId}` と書きます。7 で検索しても XML にはヒットしません。テーブル名やカラム名から探しましょう。",
        },
      ],
    },
    {
      id: "mybatis",
      title: "MyBatis で探す",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "申請くんは MyBatis を使っています。`t_request` や `applicant_id` で検索すると、Mapper の XML がヒットします。",
        },
        {
          type: "code",
          title: "RequestMapper.xml（抜粋）",
          lang: "xml",
          highlightLines: [1, 8, 9, 10],
          code: `<select id="findMine" resultType="RequestEntity">
  SELECT r.id, r.title, r.status, r.applicant_id, r.approver_id, r.applicant_email, r.created_at,
         a.display_name AS applicant_name,
         v.display_name AS approver_name
  FROM t_request r
  JOIN t_user a ON a.id = r.applicant_id
  LEFT JOIN t_user v ON v.id = r.approver_id
  WHERE (r.applicant_id = #{userId}
     OR r.approver_id = #{userId})
    AND r.status = 'PENDING'
  ORDER BY r.created_at DESC
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
      ],
    },
    {
      id: "jpa",
      title: "JPA（Hibernate）で探す",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "JPA（Hibernate）のプロジェクトでは、実行された SQL がソースに無いことが多いです。MyBatis の例と同じ `t_request` を、JPA（Hibernate）で読む例です。",
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
        { type: "quiz", id: "trace-sql-source" },
      ],
    },
    {
      id: "jdbc",
      title: "JdbcTemplate で探す",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "MyBatis や JPA のほかに、JdbcTemplate のように SQL を Java の文字列として直接書く書き方もあります。ログの出方も、探し方も、また少し違います。",
        },
        {
          type: "code",
          title: "ログの例（JdbcTemplate の DEBUG）",
          lang: "text",
          highlightLines: [2],
          code: `DEBUG o.s.jdbc.core.JdbcTemplate : Executing prepared SQL query
DEBUG o.s.jdbc.core.JdbcTemplate : Executing prepared SQL statement [SELECT id, title, status, applicant_id FROM t_request WHERE applicant_id = ?]`,
        },
        {
          type: "p",
          text: "MyBatis の `Preparing` / `Parameters` の2行組と違い、JdbcTemplate の SQL ログには、バインドした値そのものは出ません。`?` のままです。テーブル名 `t_request` で検索すると、この SQL を書いた Java クラスに直接ヒットします。",
        },
        {
          type: "code",
          title: "RequestJdbcRepository.java（JdbcTemplate の例）",
          lang: "java",
          highlightLines: [5, 6],
          code: `@Repository
public class RequestJdbcRepository {
  private final JdbcTemplate jdbcTemplate;

  private static final String FIND_MINE_SQL =
      "SELECT id, title, status, applicant_id FROM t_request WHERE applicant_id = ?";

  public List<Map<String, Object>> findMine(Long userId) {
    return jdbcTemplate.queryForList(FIND_MINE_SQL, userId);
  }
}`,
        },
        {
          type: "p",
          text: "MyBatis は別の XML、JPA はメソッド名や JPQL からの推測が必要でしたが、JdbcTemplate は Java のソースに SQL の文字列がそのままあるので、見つけたあとの1手が要りません。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "バインドした値は、別のログに出る",
          text: "SQL 文の `?` に入った実際の値は、`org.springframework.jdbc.core.StatementCreatorUtils` という別のクラスが TRACE レベルで出します（`Setting SQL statement parameter value: ... parameter value [7] ...` のような1行）。DEBUG のままだと値は分からないので、疑わしい値を確認したいときは、このロガーだけ TRACE まで上げましょう。",
        },
        { type: "quiz", id: "trace-jdbc" },
      ],
    },
    {
      id: "not-found",
      title: "見つからない・多すぎるとき",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "ここまでの探し方は、検索すると1件だけヒットする前提でした。実際には、探しても見つからない、逆に何十件もヒットして絞れない、ということがあります。",
        },
        {
          type: "h2",
          text: "ログの SQL が、ソースのどこにも無い",
        },
        {
          type: "p",
          text: "MyBatis の `<if>` や `<where>` タグは、条件によって実際に組み立てられる SQL が変わります。ログに出る SQL は、その瞬間に組み立てられたあとの文なので、XML の中にはその形のまま存在しません。",
        },
        {
          type: "code",
          title: "RequestMapper.xml の searchHistory（申請くん・抜粋）",
          lang: "xml",
          highlightLines: [2, 3, 4, 5, 6, 7],
          code: `WHERE (r.applicant_id = #{userId} OR r.approver_id = #{userId})
<if test="title != null and title != ''">
  AND r.title LIKE CONCAT('%', #{title}, '%')
</if>
<if test="requestStatus != null and requestStatus != ''">
  AND r.status = #{requestStatus}
</if>`,
        },
        {
          type: "p",
          text: "検索条件を title と status の両方で絞ったときのログには、`AND r.title LIKE ... AND r.status = ...` とまとめて出ますが、XML にはこの組み合わせのままの行はありません。ログの SQL を一字一句検索するのではなく、`<if>` に関係なく必ず残る部分（テーブル名や、固定の JOIN 条件）で探しましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "JPA でも同じことが起きる",
          text: "JPA でも、Specification や Criteria API、QueryDSL のように条件を組み立てる書き方では、ログの SQL がソースのどこにも無い形になります。考え方は MyBatis の動的 SQL と同じで、変化しない部分（テーブル名や固定の条件）で探します。",
        },
        {
          type: "h2",
          text: "同じテーブル名で何十件もヒットする",
        },
        {
          type: "p",
          text: "`t_request` のような主要なテーブルは、一覧・詳細・検索・更新など、多くの SQL で使われます。テーブル名だけでは絞れないときは、次のような手がかりを組み合わせましょう。",
        },
        {
          type: "ul",
          items: [
            "SELECT する列の組み合わせ（ログに出た列名をいくつかまとめて検索する）",
            "JOIN しているテーブル名（ログにあれば、その組み合わせで検索する）",
            "WHERE の固定の条件値（`'PENDING'` のような、`<if>` の外にある文字列）",
            "ORDER BY の列名",
          ],
        },
        { type: "quiz", id: "trace-not-found" },
      ],
    },
    {
      id: "verify",
      title: "見つけたあとの確認",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "ソースが分かったら、SQL の件数・カラム・条件が、実際の DB のレコードと合っているかを突き合わせましょう。MyBatis でも JPA でも、見る観点は同じです。SQL の条件が期待どおりでも、DB に入っているレコードが無かったり、値そのものがおかしかったりすることがあります。",
        },
        {
          type: "table",
          headers: ["症状", "疑うこと"],
          rows: [
            ["件数が少ない", "WHERE が厳しい、論理削除フラグ、その条件のレコードが無い"],
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
          text: "同じ SQL を検証用環境の DB で実行できるなら、コードを読むより早いことがあります。\nSELECT はそのまま試せます。\nUPDATE や DELETE は、共有している検証用環境のデータが本当に書き換わります。実行してよいか、先に確認しましょう。\n試すときは、トランザクションを始めて結果を確認し、ROLLBACK しましょう。COMMIT はしません。",
        },
      ],
    },
    {
      id: "full-flow",
      title: "申請一覧を開く処理を追う",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "ここまで「ソースの読み方」と「SQL からソースを探す」で見てきた読み方を、申請一覧を開く1つの操作を通してまとめて確認しましょう。下のタブの区間（Browser → Filter → Controller → Service → MyBatis → MySQL → Thymeleaf → HTTP応答）ごとに追います。障害調査は、この一本の線のどこで期待と違うかを特定する作業です。JSON を返す API なら Thymeleaf の区間が無く、`Content-Type` が `application/json` の応答で終わります。",
        },
        { type: "widget", name: "flow" },
      ],
    },
  ],
};
