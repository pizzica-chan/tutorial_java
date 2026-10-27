import type { Track } from "../types";

export const traceTrack: Track = {
  id: "trace",
  no: "06",
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
          text: "SQL を探す前に、`pom.xml` や `build.gradle` に書かれた依存ライブラリを確認し、DB アクセスに MyBatis、JPA（Hibernate）、JdbcTemplate などのどれを使っているかを調べましょう。依存の見方は、「Maven / Gradle」で説明しています。",
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
      minutes: 8,
      tags: ["MyBatis"],
      blocks: [
        {
          type: "p",
          text: "申請くんでは、MyBatis で SQL を実行しています。テーブル名 `t_request` やカラム名 `applicant_id` を手がかりに検索し、SQL が書かれた Mapper の XML を探しましょう。",
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
        {
          type: "h2",
          text: "よく出てくる記法",
        },
        {
          type: "p",
          text: "Mapper の XML には、SQL のほかに MyBatis のタグや記号が混ざります。代表的なものと、ログの SQL から探すときの見方をまとめます。",
        },
        {
          type: "table",
          headers: ["記法", "意味", "探すときの見方"],
          rows: [
            ["`<mapper namespace=\"...\">`", "この XML に対応する Java インタフェースの名前。パッケージ名から書く（例: `jp.co.example.shinsei.mapper.RequestMapper`）", "XML から Java 側を開くときは、この名前で探す"],
            ["`#{userId}`", "値を渡すプレースホルダ。MyBatis は、SQL 文のこの部分を `?` に置き換え、値は SQL 文とは別に DB へ渡す", "MyBatis のログでは、`Preparing` の行に `?`、`Parameters` の行に値が出る。XML には値ではなく `#{userId}` と書かれている。ログに出た値（7 など）ではなく、カラム名で検索する"],
            ["`${sortColumn}`", "値を SQL の文字列にそのまま埋め込む", "ログに `ORDER BY created_at` と出ても、XML では `ORDER BY ${sortColumn}` と書かれている。その部分は検索に使わない"],
            ["`<if test=\"...\">`", "条件が true のときだけ、中の SQL を足す", "XML には、ログと同じ組み合わせの条件は書かれていない。`<if>` の外にある部分で探す"],
            ["`<where>`", "中の `<if>` のどれかが成り立ったときだけ WHERE を付け、先頭の AND を取り除く", "XML では `AND r.title ...` と書いた条件が、ログでは `WHERE r.title ...` と出ることがある"],
            ["`<foreach>`", "リストの要素の数だけ繰り返す。`IN (...)` によく使う", "ログでは `IN (?, ?, ?)` のように、要素の数だけ `?` が並ぶ"],
            ["`<sql id=\"...\">`\n`<include refid=\"...\" />`", "複数の SQL に共通する部分を `<sql>` に書き、`<include>` で差し込む", "カラム名で `<sql>` にヒットしたら、`refid` にその `id` を書いた `<select>` を探す"],
            ["`@Select(\"...\")`", "XML ではなく、Java のアノテーションに SQL を書く", "XML に無ければ、`.java` も検索の対象にする"],
          ],
        },
        {
          type: "p",
          text: "`#{}` と `${}` の違いや、`resultType` とカラムの対応は、「Java アプリの構成」の「mapper.xml の読み方」で説明しています。",
          link: {
            label: "mapper.xml の読み方",
            to: "/tracks/java-map/mapper-xml",
          },
        },
      ],
    },
    {
      id: "jpa",
      title: "JPA（Hibernate）で探す",
      minutes: 9,
      tags: ["JPA"],
      blocks: [
        {
          type: "p",
          text: "JPA（Hibernate）では、エンティティの定義や取得処理をもとに SQL が生成されるため、実行された SQL がそのままソースに書かれているとは限りません。ここでは、MyBatis の例で使った `t_request` から、JPA（Hibernate）でデータを取得する例を見ていきます。",
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
          type: "h2",
          text: "ほかに知っておきたい記法",
        },
        {
          type: "p",
          text: "上の例のほかにも、ログの SQL とソースの対応が分かりにくくなる記法があります。",
        },
        {
          type: "table",
          headers: ["記法", "意味", "探すときの見方"],
          rows: [
            ["`@Table(name = \"t_request\")`", "クラスが対応するテーブル", "`@Table` が無いクラスは、クラス名からテーブル名が決まる（Spring Boot の既定では `RequestItem` → `request_item`）。テーブル名でヒットしなければ、クラス名で探す"],
            ["`@Column(name = \"applicant_id\")`", "フィールドが対応するカラム", "ログのカラム名で探す。`@Column` が無いフィールドは、フィールド名からカラム名が決まる。カラム名でヒットしなければ、`applicantId` のようなフィールド名で探す"],
            ["`@ManyToOne` / `@OneToMany`\n`@JoinColumn`", "Entity が別の Entity を持つ（例: 申請が申請者の `User` を持つ）", "`request.getApplicant()` で申請者の `User` を取り出すだけで、Hibernate が JOIN や追加の SELECT を発行することがある。SQL が書かれていないこの行が、SQL の発行元になっていることがある"],
            ["`@SQLRestriction(\"deleted = false\")`", "Entity に、いつも付ける条件を書く（例: 削除済みのレコードを除く）。Hibernate 6.3 より前は `@Where`", "ログの WHERE にこの条件が自動で付く。Repository を探しても、この条件は見つからない"],
          ],
        },
        {
          type: "p",
          text: "Hibernate が組み立てた SQL をログに出すには、`application.yml` の `logging.level` で、`org.hibernate.SQL` を DEBUG にしましょう。ただし、SQL の値の部分は `?` のままです。値も確認したいときは、値を記録するロガーを TRACE にしましょう。TRACE は、DEBUG よりさらに詳しいログレベルです。ロガーの名前は、Hibernate のバージョンで違います。",
        },
        {
          type: "code",
          title: "application.yml（Spring Boot 3 / Hibernate 6 の例）",
          lang: "yaml",
          code: `logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.orm.jdbc.bind: TRACE  # Spring Boot 2 / Hibernate 5 では org.hibernate.type.descriptor.sql`,
        },
        { type: "quiz", id: "trace-sql-source" },
      ],
    },
    {
      id: "jdbc",
      title: "JdbcTemplate で探す",
      minutes: 9,
      tags: ["Spring"],
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
          text: "MyBatis の `Preparing` / `Parameters` の 2 行組と違い、JdbcTemplate の SQL ログには、バインドした値そのものは出ません。`?` のままです。テーブル名 `t_request` で検索すると、この SQL を書いた Java クラスに直接ヒットします。",
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
          text: "MyBatis は別の XML、JPA はメソッド名や JPQL からの推測が必要でしたが、JdbcTemplate は Java のソースに SQL の文字列がそのままあるので、見つけたあとの 1 手が要りません。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "バインドした値は、別のログに出る",
          text: "SQL 文の `?` に入った実際の値は、`org.springframework.jdbc.core.StatementCreatorUtils` という別のクラスが TRACE レベルで出します（`Setting SQL statement parameter value: ... parameter value [7] ...` のような 1 行）。DEBUG のままだと値は分からないので、疑わしい値を確認したいときは、このロガーだけ TRACE まで上げましょう。",
        },
        {
          type: "h2",
          text: "よく出てくる記法",
        },
        {
          type: "p",
          text: "ただし、SQL の書き方によっては、テーブル名を含む長い文で検索してもヒットしないことがあります。代表的な書き方と、探すときの見方をまとめます。",
        },
        {
          type: "table",
          headers: ["記法", "意味", "探すときの見方"],
          rows: [
            ["`queryForList` / `queryForObject`\n`query` / `update`", "SQL の文字列を渡して実行する。`update` は INSERT・UPDATE・DELETE に使う", "SQL の文字列を見つけたら、それを実行している Java メソッド（上の例の `findMine`）の呼び出し元を、参照検索で辿る"],
            ["`NamedParameterJdbcTemplate`\n`:userId`", "プレースホルダを `?` ではなく名前で書く", "ログでは `applicant_id = ?`、ソースでは `applicant_id = :userId` と違う。`?` を含めて検索しない"],
            ["`\"SELECT ... \" + \"FROM t_request ...\"`\nテキストブロック（`\"\"\"` で囲む）", "長い SQL を、複数の行に分けて書く。テキストブロックは、Java 15 以降で使える複数行の文字列", "途中で改行や `+` が入るので、長い文で検索するとヒットしない。テーブル名やカラム名の 1 語で探す"],
            ["`SimpleJdbcInsert`\n`withTableName(\"t_request\")`", "テーブル名を渡すと、INSERT 文を自動で組み立てる", "ソースに INSERT 文が無い。テーブル名で探すと `withTableName` にヒットする"],
          ],
        },
        { type: "quiz", id: "trace-jdbc" },
      ],
    },
    {
      id: "not-found",
      title: "見つからない・多すぎるとき",
      minutes: 7,
      tags: ["MyBatis", "JPA"],
      blocks: [
        {
          type: "p",
          text: "ここまでの探し方は、検索すると 1 件だけヒットする前提でした。実際には、探しても見つからない、逆に何十件もヒットして絞れないということがあります。",
        },
        {
          type: "h2",
          text: "ログの SQL が、ソースのどこにも無い",
        },
        {
          type: "p",
          text: "MyBatis の `<if>` や `<where>` タグは、条件によって実際に組み立てられる SQL が変わります。ログに出る SQL は、実行時に組み立てられたあとの文なので、XML の中にはその形のまま存在しません。",
        },
        {
          type: "code",
          title: "RequestMapper.xml の searchHistory（申請くん・抜粋）",
          lang: "xml",
          highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10],
          code: `WHERE (r.applicant_id = #{userId} OR r.approver_id = #{userId})
<if test="title != null and title != ''">
  AND r.title LIKE CONCAT('%', #{title}, '%')
</if>
<if test="requestStatus != null and requestStatus != ''">
  AND r.status = #{requestStatus}
</if>
<if test="createdFrom != null and createdFrom != ''">
  AND r.created_at &gt;= #{createdFrom}
</if>`,
        },
        {
          type: "p",
          text: "件名と申請日（開始）で絞ったときのログには、`AND r.title LIKE ... AND r.created_at >= ...` とまとめて出ますが、XML にはこの組み合わせのままの行はありません。ログの SQL を一字一句検索するのではなく、`<if>` に関係なく必ず残る部分（テーブル名や、固定の JOIN 条件）で探しましょう。",
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
            "SELECT するカラムの組み合わせ（ログに出たカラム名をいくつかまとめて検索する）",
            "JOIN しているテーブル名（ログにあれば、その組み合わせで検索する）",
            "WHERE の固定の条件値（`'PENDING'` のような、`<if>` の外にある文字列）",
            "ORDER BY のカラム名",
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
            ["起動はできるが、特定の画面で SQL エラーになる", "存在しないカラム、環境で DDL 未適用"],
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
      tags: ["Spring", "MyBatis", "MySQL", "Thymeleaf"],
      blocks: [
        {
          type: "p",
          text: "ここまで「ソースの読み方」と「SQL からソースを探す」で見てきた読み方を、申請一覧を開く 1 つの操作を通してまとめて確認しましょう。下のタブの区間（Browser → Filter → Controller → Service → MyBatis → MySQL → Thymeleaf → HTTP 応答）ごとに追います。障害調査は、この一本の線のどこで期待と違うかを特定する作業です。JSON を返す API なら Thymeleaf の区間が無く、`Content-Type` が `application/json` の応答で終わります。",
        },
        { type: "widget", name: "flow" },
      ],
    },
  ],
};
