import type { Track } from "../types";
import { requestControllerSample } from "../data/entryPoint";
import {
  shinseiAppCssSnippet,
  shinseiAppJsSnippet,
  shinseiGradleSnippet,
  shinseiLayoutStaticSnippet,
  shinseiListRenderedSnippet,
  shinseiListTemplateSnippet,
  shinseiPomSnippet,
} from "../data/project";

export const javaMapTrack: Track = {
  id: "java-map",
  no: "03",
  title: "Javaアプリの構成",
  kicker: "STRUCTURE",
  description: "リポジトリを開いたとき、ファイルと層の役割が分かるようにします。",
  accent: "#f5cf4d",
  lessons: [
    {
      id: "tree",
      title: "ディレクトリ構成",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "例として、架空の社内申請アプリ「申請くん」を使います。",
        },
        {
          type: "p",
          text: "Maven + Spring Boot では、おおむね次の並びです。左のツリーが申請くんの例です。ファイル名をクリックすると、右に役割と抜粋が出ます。",
        },
        { type: "widget", name: "explorer" },
        {
          type: "p",
          text: "java 配下の jp/co/example/shinsei は、IDE でパッケージを折りたたんだ表示と同じです。実体のフォルダは jp、co、example、shinsei に分かれます。",
        },
        {
          type: "callout",
          kind: "tip",
          title: "pom.xml / build.gradle",
          text: "Web なのか、画面は Thymeleaf なのか JSP なのか、DB は MyBatis なのか JPA なのか。依存を見ると、このあと何を検索すればよいかが決まります。",
        },
      ],
    },
    {
      id: "build",
      title: "Maven / Gradle",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "Java プロジェクトには、依存ライブラリとビルド方法をまとめた設定ファイルがあります。Maven なら `pom.xml`、Gradle なら `build.gradle`（と `settings.gradle`）です。",
        },
        {
          type: "p",
          text: "どちらも、使うフレームワークやライブラリの一覧と、ビルドの仕方を書いたファイルです。プロジェクトによって Maven か Gradle かは決まっています。",
        },
        {
          type: "p",
          text: "どのフレームワークを使っているか、DB アクセスが MyBatis / JPA / JDBC のどれかを先に確認しましょう。分かれば、この先ソースを探すときに、どこを見ればよいかが分かります。",
        },
        {
          type: "h2",
          text: "何を見るか",
        },
        {
          type: "ul",
          items: [
            "Java の version（8 / 11 / 17 で起動方法が違う）",
            "spring-boot-starter-web … Web アプリ",
            "thymeleaf / jsp / freemarker … 画面の種類",
            "mybatis / jpa / jdbc … DB アクセスの種類",
            "spring-security … 認証・認可の有無",
            "社内の自作ライブラリ … jar だけだとソース検索に出ないことがある",
            "war パッケージ … 外部 Tomcat に載せる構成",
          ],
        },
        {
          type: "p",
          text: "Spring Boot 2.7 と 3.x では、Servlet などの import パッケージ名が `javax` か `jakarta` かで変わります。参照するサンプルは、対象プロジェクトの版に合わせましょう。",
        },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "申請くんは Maven です。いま挙げた項目は、`pom.xml` の dependencies では次のとおりです。",
        },
        {
          type: "code",
          title: "pom.xml（抜粋）",
          lang: "xml",
          code: shinseiPomSnippet,
        },
        {
          type: "p",
          text: "Gradle のプロジェクトなら、同じフレームワークやライブラリが `build.gradle` の dependencies に書かれています。書き方は違いますが、見る目的は同じです。",
        },
        {
          type: "code",
          title: "build.gradle（同じ依存の例）",
          lang: "gradle",
          code: shinseiGradleSnippet,
        },
      ],
    },
    {
      id: "yml",
      title: "application.yml / application.properties",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "Spring Boot 用の設定ファイルです。接続先、ポート、プロファイル、コンテキストパスは、Spring Boot ならここに書くことが多いです。",
        },
        {
          type: "p",
          text: "外の Tomcat に載せるときは、ポートやコンテキストパスは Tomcat 側で決まることが多いです。",
        },
        {
          type: "callout",
          kind: "note",
          title: "接続情報をサーブレットコンテナが持つこともある",
          text: "外部の Tomcat に載せる構成では、DB の接続情報が `application.yml` に無く、Tomcat 側の設定（`context.xml` など）にあることがあります。アプリは JNDI（`java:comp/env/jdbc/...`）経由で DataSource を受け取るだけで、接続情報そのものは持ちません。`application.yml` に `spring.datasource` が無いときは、この構成を疑いましょう。",
        },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "code",
          title: "application.yml（抜粋）",
          lang: "yaml",
          highlightLines: [3],
          code: `spring:
  profiles:
    active: dev
  datasource:
    url: jdbc:mysql://localhost:3306/shinsei
server:
  servlet:
    context-path: /shinsei`,
        },
        {
          type: "p",
          text: "`active: dev` があるので、`application-dev.yml` の設定が `application.yml` の設定に重なります。",
        },
        {
          type: "code",
          title: "application-dev.yml（抜粋）",
          lang: "yaml",
          highlightLines: [3],
          code: `spring:
  datasource:
    url: jdbc:mysql://localhost:3306/shinsei_dev?characterEncoding=UTF-8
logging:
  level:
    jp.co.example.shinsei: DEBUG
    org.mybatis: DEBUG
    jp.co.example.shinsei.mapper: DEBUG`,
        },
        {
          type: "p",
          text: "`application-dev.yml` は接続先とログの出力レベルを上書きしています。`application.yml` 側の `shinsei` と `application-dev.yml` 側の `shinsei_dev` を重ねると、後から読み込む方が勝つので、実際に接続する DB 名は `shinsei_dev` です。設定は複数ファイルに分かれることがあるので、1ファイルだけ見て判断しないようにしましょう。",
        },
        {
          type: "p",
          text: "Docker で動かすときは、さらに環境変数で上書きされることがあります。申請くんの `docker-compose.yml` も、環境変数で `application-dev.yml` の接続先を上書きしています。",
        },
        {
          type: "code",
          title: "docker-compose.yml（申請くん・抜粋）",
          lang: "yaml",
          highlightLines: [3],
          code: `app:
  environment:
    SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/shinsei_dev?characterEncoding=UTF-8
    SPRING_DATASOURCE_USERNAME: app
    SPRING_DATASOURCE_PASSWORD: app`,
        },
        {
          type: "p",
          text: "Spring Boot は `SPRING_DATASOURCE_URL` のような環境変数名を、`spring.datasource.url` に自動で対応づけます。ホスト名も `localhost` ではなく `db`（docker-compose のサービス名）に変わっています。イメージ自体には接続情報を含めず、起動時に環境変数で渡すのが一般的です。Kubernetes でも、ConfigMap や Secret から環境変数を渡す考え方は同じです。ファイルだけでなく環境変数まで見ないと、実際に接続している先を勘違いします。",
        },
        {
          type: "h2",
          text: "設定差を疑うとき",
        },
        {
          type: "p",
          text: "ローカルでは動き、別環境ではうまく動かない場合、まず設定差を見ましょう。",
        },
        {
          type: "ul",
          items: [
            "URL",
            "接続ユーザ",
            "プロファイル",
            "コンテキストパス",
            "ファイルパス",
            "メールサーバ",
          ],
        },
        {
          type: "p",
          text: "特に見落としやすいのは次の点です。",
        },
        {
          type: "ul",
          items: [
            "active プロファイルは起動引数で上書きされることがある",
            "`application-dev.yml`（または .properties）用と、本番環境用（`prod`）の設定でログ量が違う。出力先は `logging.file` や、Spring Boot 用の `logback-spring.xml` に書いてあることが多い",
            "`context-path` が違うと CSS が 404 になり、画面だけ崩れる",
            "パスワードは環境変数や別ファイルのことがある",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "接続情報",
          text: "接続文字列には本番相当の情報があることがあります。共有するときはマスクしましょう。",
        },
      ],
    },
    {
      id: "layers",
      title: "Controller / Service / Repository / Mapper",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "画面や API の URL からソースを追うときは、Controller → Service → DB アクセスの層、の順で開きます。この項目では、各層の役割と、開く順を見ます。",
        },
        {
          type: "h2",
          text: "層の役割とたどり方",
        },
        {
          type: "p",
          text: "DB アクセスのクラスは、JPA では Repository、MyBatis では Mapper と呼ぶことが多いです。",
        },
        {
          type: "ul",
          items: [
            "Controller … リクエストの受付と応答",
            "Service … ビジネスロジック（業務として何をするか）",
            "Repository / Mapper … データベースとのやり取り",
          ],
        },
        {
          type: "p",
          text: "申請くんの一覧を例にすると、Service の `findMine` は Mapper を呼ぶだけで、ログインユーザに関係し、かつ未承認の申請だけに絞り込む処理は Mapper の SQL にあります。",
        },
        { type: "diagram", name: "layers", caption: "探す順番。クラス名が違っても、受付 → ビジネスロジック → DB の流れは同じです。" },
        {
          type: "ol",
          items: [
            "URL を受ける Java メソッド（Spring の `@GetMapping` など）",
            "それが呼ぶ Java メソッド（ビジネスロジック）",
            "DB または外部 API",
          ],
        },
        {
          type: "p",
          text: "ここまでは、Controller → Service → Mapper と分かれている想定です。実際には Service を飛ばして Controller から Mapper を呼ぶなど、並びがずれることがあります。ずれていても、上の順番（受付 → ビジネスロジック → DB）で、今の Java メソッドから呼ばれている先を開いていけば十分です。",
        },
        {
          type: "h2",
          text: "Controller の返し方（出口の 2 パターン）",
        },
        {
          type: "p",
          text: "画面用はテンプレート名（文字列）を返します。Web API 用はオブジェクトを返し、JSON になります。",
        },
        {
          type: "code",
          title: "パターン1: テンプレート名を返す（画面）",
          lang: "java",
          highlightLines: [9, 10],
          code: `@Controller
@RequestMapping("/requests")
@RequiredArgsConstructor
public class RequestController {
  private final RequestService requestService;

  @GetMapping
  public String list(Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("applications", requestService.findMine(user.getId()));
    return "request/list";
  }
}`,
        },
        {
          type: "p",
          text: "URL を受ける Java メソッドは `list` です。その中で呼んでいる `requestService.findMine` が、次に開く Java メソッドです。`return \"request/list\"` は、HTML テンプレートの場所を指します。",
        },
        {
          type: "ul",
          items: [
            "サーバが `templates/request/list.html` を組み立てて、ブラウザへ HTML を届ける",
            "表示がおかしいときは templates も見ましょう",
          ],
        },
        {
          type: "code",
          title: "パターン2: オブジェクトを返す（Web API）",
          lang: "java",
          highlightLines: [9, 10, 11],
          code: `@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestApiController {
  private final RequestService requestService;

  @GetMapping
  public List<RequestResponse> list(@AuthenticationPrincipal LoginUser user) {
    return requestService.findMine(user.getId()).stream()
        .map(RequestResponse::from)
        .toList();
  }
}`,
        },
        {
          type: "ul",
          items: [
            "return のオブジェクトが JSON に変換されて届く",
            "templates は使わない",
            "データの中身だけおかしいときは Network タブの JSON を確認しましょう",
          ],
        },
        {
          type: "p",
          text: "同じ RequestService を呼んでも、出口が HTML か JSON かで、クライアントが受け取るものが変わります。たどる順番は同じです。最後に見る場所だけ切り替えましょう。",
        },
        {
          type: "p",
          text: "ブラウザが JSON から画面を組む例は、Webの基礎の「Web API から JSON を受け取る」から順に説明します。",
          link: {
            label: "Web API から JSON を受け取る",
            to: "/tracks/web/api-json",
          },
        },
        { type: "quiz", id: "java-layer" },
      ],
    },
    {
      id: "mapper-xml",
      title: "mapper.xml の読み方",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "MyBatis の Mapper は、メソッド宣言だけの Java インタフェースと、SQL を書いた XML ファイルの組であることが多いです。アノテーションだけで SQL を書く方法もありますが、申請くんは XML です。置き場所や細かい動きは、`application.yml` の `mybatis:` に書いてあります。",
        },
        {
          type: "code",
          title: "application.yml の mybatis 設定（申請くん・抜粋）",
          lang: "yaml",
          code: `mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: jp.co.example.shinsei.entity
  configuration:
    map-underscore-to-camel-case: true`,
        },
        {
          type: "h2",
          text: "インタフェースと XML の対応",
        },
        {
          type: "p",
          text: "Java 側は、メソッド宣言だけのインタフェースです。実装クラスはソースに無く、MyBatis が実行時に作ります。XML の `id` と Java のメソッド名が対応しています。",
        },
        {
          type: "code",
          title: "RequestMapper.java（申請くん・抜粋）",
          lang: "java",
          highlightLines: [2],
          code: `public interface RequestMapper {
  List<RequestEntity> findMine(@Param("userId") Long userId);
}`,
        },
        {
          type: "code",
          title: "RequestMapper.xml（申請くん・抜粋）",
          lang: "xml",
          highlightLines: [1],
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
          type: "p",
          text: "`@Param(\"userId\")` が付いた引数の値が、SQL 側の `#{userId}` に渡ります。呼び出し元は、この Java のメソッド名（`findMine`）で参照検索すれば見つかります。",
        },
        {
          type: "h2",
          text: "resultType とカラムの対応",
        },
        {
          type: "p",
          text: "`resultType=\"RequestEntity\"` と書くだけで、SELECT の各カラムが `RequestEntity` のフィールドへ自動で入ります。完全なパッケージ名を書かなくてよいことと、`applicant_id` が `applicantId` というフィールドに対応することには、それぞれ理由があります。さきほどの `application.yml` の2行がその答えです。",
        },
        {
          type: "ul",
          items: [
            "`type-aliases-package` … このパッケージ配下のクラスは、クラス名だけで参照できる。`RequestEntity` は `jp.co.example.shinsei.entity.RequestEntity` の型エイリアス",
            "`map-underscore-to-camel-case` … カラム名のスネークケースを、フィールド名のキャメルケースへ自動変換する。`applicant_id` → `applicantId`",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "自動変換されないとき",
          text: "この設定が無いプロジェクトでは、SQL 側に `applicant_id AS applicantId` のように別名を付けるか、`resultMap` で対応を書きます。件数は合っているのに一部のフィールドだけ null なら、カラム名とフィールド名の対応がずれていないか疑いましょう。",
        },
        {
          type: "h2",
          text: "#{} でパラメータを渡す",
        },
        {
          type: "p",
          text: "`#{userId}` は、実行時に安全な仕組みでバインドされるプレースホルダです。渡す値をそのまま文字列として組み込むわけではなく、`PreparedStatement` の `?` に変換されてから実行されます。",
        },
        {
          type: "callout",
          kind: "warn",
          title: "${} との違い",
          text: "`${}` という書き方もありますが、こちらは値をそのまま SQL の文字列に埋め込みます。渡す値によっては SQL インジェクションの原因になるため、利用者からの入力をそのまま `${}` に渡すのは避けます。`ORDER BY` のカラム名を可変にしたいときなど、値を限られた候補からしか選べない場面で使うことはあります。",
        },
        {
          type: "h2",
          text: "条件によって SQL を変える（動的 SQL）",
        },
        {
          type: "p",
          text: "検索条件が空なら絞り込まない、といった作りは `<if test=\"...\">` で書きます。申請履歴検索の例です。",
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
          text: "`test` に書いた条件が true のときだけ、そのタグの中の SQL が組み込まれます。件名が空なら、件名の絞り込み自体が無い SQL になります。この実例は、シナリオの「申請履歴検索の結果が不正」でも使っています。",
          link: {
            label: "申請履歴検索の結果が不正",
            to: "/tracks/scenario/history",
          },
        },
        {
          type: "p",
          text: "ログに出た SQL からこの XML を逆に探す手順は、「SQL からソースを探す」の「MyBatis で探す」です。",
          link: {
            label: "MyBatis で探す",
            to: "/tracks/trace/mybatis",
          },
        },
        { type: "quiz", id: "java-mapper-xml" },
      ],
    },
    {
      id: "transaction",
      title: "トランザクションと同時実行",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "Service のメソッドに付いている `@Transactional` や、DB の分離レベルが、具体的に何を保証していて、何を保証していないかを見ます。",
        },
        {
          type: "h2",
          text: "@Transactional が保証すること",
        },
        {
          type: "p",
          text: "`@Transactional` は、そのメソッドの中の複数の SQL を1つの単位にまとめる印です。途中で例外が起きれば、それまでの変更もすべて取り消されます（ロールバック）。ただし既定でロールバックされるのは `RuntimeException` や `Error` のような非検査例外だけです。検査例外は、`rollbackFor` を指定しない限りロールバックされません。",
        },
        {
          type: "code",
          title: "例（承認処理）",
          lang: "java",
          code: `@Transactional
public void approve(Long requestId, Long approverId) {
  RequestEntity request = requestMapper.findById(requestId, approverId);
  // 権限・状態のチェック（省略）
  request.setStatus("APPROVED");
  requestMapper.update(request);
  mailService.notifyApplicant(request);
}`,
        },
        {
          type: "callout",
          kind: "note",
          title: "DB 以外は取り消せない",
          text: "`update` のあとで例外が起きれば、その `update` も取り消されます。ただし、メール送信のような DB 以外への操作は、`@Transactional` の対象外です。取り消しても、送ってしまったメールは戻りません。",
        },
        {
          type: "p",
          text: "ここで保証されているのは「1つのリクエストの中の一貫性」だけです。別のリクエストが同時に来ることは、`@Transactional` の範囲外です。",
        },
        {
          type: "h2",
          text: "アノテーションが無いこともある",
        },
        {
          type: "p",
          text: "ここまでは `@Transactional` を前提にしましたが、同じことを別の書き方で行っているアプリもあります。`@Transactional` で検索してもヒットしないときは、次のような書き方を疑いましょう。",
        },
        {
          type: "h3",
          text: "XML でのトランザクション宣言",
        },
        {
          type: "p",
          text: "Spring の設定を XML で書いていたころからのアプリでは、Java のクラスにアノテーションを付けず、XML 側でトランザクションの対象メソッドを指定していることがあります。",
        },
        {
          type: "code",
          title: "例（applicationContext.xml。申請くんではありません）",
          lang: "xml",
          code: `<tx:advice id="txAdvice" transaction-manager="transactionManager">
  <tx:attributes>
    <tx:method name="approve*" propagation="REQUIRED"/>
    <tx:method name="find*" read-only="true"/>
  </tx:attributes>
</tx:advice>
<aop:config>
  <aop:pointcut id="serviceMethods"
      expression="execution(* jp.co.example.shinsei.service.*.*(..))"/>
  <aop:advisor advice-ref="txAdvice" pointcut-ref="serviceMethods"/>
</aop:config>`,
        },
        {
          type: "p",
          text: "`<tx:method name=\"approve*\" .../>` のように、メソッド名のパターンで対象を指定します。Java のソースだけを検索しても見つからないので、`applicationContext.xml` のような設定ファイルも確認しましょう。",
        },
        {
          type: "h3",
          text: "プログラムでのトランザクション管理",
        },
        {
          type: "p",
          text: "メソッド全体ではなく、一部分だけをトランザクションにしたいときは、`TransactionTemplate` を使って明示的に範囲を書くこともあります。",
        },
        {
          type: "code",
          title: "例",
          lang: "java",
          code: `public void approve(Long requestId, Long approverId) {
  RequestEntity request = transactionTemplate.execute(status -> {
    RequestEntity found = requestMapper.findById(requestId, approverId);
    found.setStatus("APPROVED");
    requestMapper.update(found);
    return found;
  });
  mailService.notifyApplicant(request);
}`,
        },
        {
          type: "p",
          text: "`transactionTemplate.execute(...)` の中だけがトランザクションです。メソッド全体ではなく、必要な範囲だけをトランザクションにできます。この書き方も `@Transactional` と同じで、同時に来た複数のリクエストを防ぐものではありません。",
        },
        {
          type: "h2",
          text: "分離レベル（アイソレーションレベル）",
        },
        {
          type: "p",
          text: "同時に動いている複数のトランザクションが、お互いの変更をどこまで見えるようにするか、という設定です。DB によって既定値は違います。MySQL（InnoDB）の既定は `REPEATABLE READ` です。",
        },
        {
          type: "p",
          text: "分離レベルを上げるほど、他のトランザクションの影響を受けにくくなりますが、待たされることも増えます。ここでは分離レベルの細かい違いより、「読んでから書く」処理がなぜ危ういかを見ます。",
        },
        {
          type: "h2",
          text: "「読んでから書く」処理は、分離レベルだけでは守れない",
        },
        {
          type: "p",
          text: "承認処理を例にします。読んで判定し、それから更新する、という順番自体に隙があります。`findById` の SELECT は、`update` より前に終わっており、その後の `update` には状態の条件が付いていません。ほぼ同時刻に来た2つのリクエストは、どちらも同じ `PENDING` を読み、どちらも判定を通過してしまいます。",
        },
        {
          type: "p",
          text: "分離レベルを上げても、この隙は埋まりません。2つのリクエストは、それぞれ自分の SELECT の時点で正しく `PENDING` を読んでいるからです。実際にこれが起きた例は、「実務のシナリオ」の「承認すると、申請者に確認メールが2通届く」で扱います。",
          link: {
            label: "承認すると、申請者に確認メールが2通届く",
            to: "/tracks/scenario/duplicate-mail",
          },
        },
        {
          type: "h2",
          text: "同時実行から守る2つの書き方",
        },
        {
          type: "h3",
          text: "楽観ロック：更新の条件に前提を含める",
        },
        {
          type: "p",
          text: "`UPDATE` の `WHERE` に、更新前提の状態を含める方法です。実際に更新できた件数（0件か1件か）で、他の処理が先に進んでいなかったかを判定します。DB 側で実際にレコードを専有するわけではないので「楽観」と呼びます。",
        },
        {
          type: "code",
          title: "対処例（RequestMapper.xml）",
          lang: "text",
          code: `<update id="update">
  UPDATE t_request
     SET status = 'APPROVED', updated_at = NOW()
   WHERE id = #{id}
     AND status = 'PENDING'
</update>`,
        },
        {
          type: "code",
          title: "対処例（Service 側の判定）",
          lang: "java",
          code: `int updated = requestMapper.update(request);
if (updated == 0) {
  throw new ConflictException("この申請は承認できません");
}`,
        },
        {
          type: "p",
          text: "先に `update` した側だけが1件更新でき、あとから来た側は0件になります。0件なら、他の処理がすでに状態を変えていた、と分かります。",
        },
        {
          type: "h3",
          text: "悲観ロック：先にレコードをロックする",
        },
        {
          type: "p",
          text: "`SELECT ... FOR UPDATE` で、読む時点からレコードをロックする方法です。あとから来たトランザクションは、先のトランザクションが確定するまで待たされます。",
        },
        {
          type: "code",
          title: "例",
          lang: "sql",
          code: `SELECT * FROM t_request WHERE id = ? FOR UPDATE;`,
        },
        {
          type: "p",
          text: "待たされたトランザクションは、先の変更が確定したあとに読むことになるので、`status` がもう `PENDING` ではないと気づけます。待ちが増える分、ロックする範囲と時間は短くしましょう。",
        },
        {
          type: "callout",
          kind: "warn",
          title: "デッドロック",
          text: "複数のレコードを別々の順番でロックすると、お互いが相手の解放を待ち続けるデッドロックが起きることがあります。ロックする順番はそろえましょう。",
        },
        {
          type: "p",
          text: "どちらを選ぶかは、競合の起きやすさと、待たされてよいかで判断します。競合が稀なら楽観ロック、確実に守りたいなら悲観ロックを使うことが多いです。",
        },
        { type: "quiz", id: "java-transaction" },
      ],
    },
    {
      id: "view-static",
      title: "テンプレートと静的ファイル",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "HTML は templates フォルダ、CSS や JS は static フォルダに置きます。申請くんの一覧を例に見ます。",
        },
        {
          type: "h2",
          text: "テンプレート（templates）",
        },
        {
          type: "p",
          text: "HTML は `src/main/resources/templates` 配下に置きます。Controller が名前で指定したテンプレートを組み立てて、その HTML をブラウザへ届けます。例えば `return \"request/list\"` なら `templates/request/list.html` を組み立てます。",
        },
        {
          type: "code",
          title: "RequestController.java（抜粋）",
          lang: "java",
          highlightLines: [11],
          code: requestControllerSample,
        },
        { type: "diagram", name: "view-file", caption: "`return \"request/list\"` が `templates/request/list.html` を指します。" },
        {
          type: "h2",
          text: "静的ファイル（static）",
        },
        {
          type: "p",
          text: "CSS や JS は Java ではなく `src/main/resources/static` 配下に置きます。テンプレートの head から読み込みます。",
        },
        {
          type: "code",
          title: "fragments/layout.html（抜粋）",
          lang: "html",
          highlightLines: [2],
          code: shinseiLayoutStaticSnippet,
        },
        {
          type: "p",
          text: "`th:href=\"@{/css/app.css}\"` は、`context-path` を含めた URL に変換されます。申請くんでは `/shinsei/css/app.css` のように見えます。",
        },
        {
          type: "code",
          title: "static/css/app.css（抜粋）",
          lang: "css",
          code: shinseiAppCssSnippet,
        },
        {
          type: "code",
          title: "static/js/app.js（抜粋）",
          lang: "javascript",
          code: shinseiAppJsSnippet,
        },
        {
          type: "p",
          text: "`static/js` には `app.js` のほかに `list.js` もあります。今見た `app.js` の確認ダイアログは申請詳細画面の承認ボタン用で、一覧画面の承認ボタンを押したときに動く JavaScript は `list.js` の方です。1つの画面が複数の JS ファイルを読み込むことは珍しくありません。",
        },
        {
          type: "p",
          text: "ブラウザは HTML のあと、CSS と JS を別リクエストで取りに行きます。これらの静的ファイルは、Controller や Service を通りません。ただし Filter や、内蔵のサーブレットコンテナ自体は通ることがあります。",
        },
        {
          type: "p",
          text: "一方で、CSS や JS をテンプレートや HTML に直接書いている画面もあります。申請くんは static に分けて置いていますが、見た目や動きを直すときは templates 内も見ましょう。",
        },
        {
          type: "ul",
          items: [
            "<style>",
            "<script>",
            "onclick などの属性",
          ],
        },
        {
          type: "code",
          title: "HTML に直接書く例",
          lang: "html",
          code: `<style>
  .warn { color: #c00; }
</style>
<button type="button" onclick="return confirm('承認してよいですか？')">承認</button>
<script>
  function confirmApprove() { /* ... */ }
</script>`,
        },
        {
          type: "callout",
          kind: "trap",
          title: "見た目だけ壊れる",
          text: "画面は出るのにスタイルだけ当たらないときは、Network タブで `/shinsei/css/app.css` が 404 になっていないかを見ましょう。ファイルの有無と URL のずれが多いです。崩れた画面の例は、シナリオ章の「一覧は出るが、画面だけ崩れている」にあります。",
        },
        {
          type: "p",
          text: "`@RestController` は templates を使いません。JSON を返す Web API では、前の項目のとおり出口が JSON になることが多いです。",
        },
      ],
    },
    {
      id: "template-read",
      title: "テンプレートの読み方",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "サーバが HTML を組み立てるアプリでは、画面の文言、ボタンの有無、送信先は、その多くがテンプレートに書かれています。",
        },
        {
          type: "p",
          text: "申請くんは Thymeleaf です。JSP や FreeMarker など別のテンプレートエンジンでも、Model に載せた名前と HTML 側の参照、form の action、表示条件を突き合わせる、という読み方は同じです。",
        },
        {
          type: "h2",
          text: "テンプレートファイルの特定",
        },
        {
          type: "p",
          text: "Controller の return が返す文字列が、templates 配下のパスになります。`return \"request/list\"` なら `templates/request/list.html` です。前の項目の図のとおりです。",
        },
        {
          type: "h2",
          text: "共通部分（フラグメント）",
        },
        {
          type: "p",
          text: "フラグメントは、テンプレートの一部に名前を付け、ほかのテンプレートから差し込んで使う仕組みです。複数の画面で共通する HTML を、1か所にまとめて共有できます。",
        },
        {
          type: "p",
          text: "申請くんの画面は、共通部分と個別部分に分かれています。ヘッダと CSS は全画面で共通なので、`fragments/layout.html` にまとめています。一覧の表や詳細の項目など、画面ごとに変わる部分は、`request/list.html` や `request/detail.html` のように、画面ごとのファイルに書きます。",
        },
        {
          type: "p",
          text: "画面ごとのファイルは `th:replace` で共通の `layout.html` を読み込みます。そのため `list.html` を開くと、その画面固有の <main> だけが見えます。共通のヘッダや CSS を追うときは `layout.html` も開きましょう。",
        },
        {
          type: "diagram",
          name: "template-fragment",
        },
        {
          type: "code",
          title: "fragments/layout.html（抜粋）",
          lang: "html",
          codeScope: "fragment-common",
          highlightLines: [19],
          code: `<!-- ① ヘッダ（共通） -->
<html th:fragment="layout (title, content)">
<head>
  <title th:text="\${title} + ' | 申請くん'">申請くん</title>
  <!-- ② CSS（共通） -->
  <link rel="stylesheet" th:href="@{/css/app.css}" />
</head>
<body>
  <header class="app-header">
    <a class="app-logo" th:href="@{/requests}">申請くん</a>
    <nav>
      <a th:href="@{/requests}">申請一覧</a>
      <a th:href="@{/requests/history}">申請履歴</a>
      ...
    </nav>
    <button type="submit" class="btn-text">ログアウト</button>
  </header>
  <!-- ③ main の枠。list.html などの <main> が入る -->
  <main class="app-main" th:insert="\${content}"></main>
</body>
</html>`,
        },
        {
          type: "code",
          title: "request/list.html（先頭）",
          lang: "html",
          codeScope: "fragment-individual",
          highlightLines: [1],
          code: `<html th:replace="fragments/layout :: layout(title='申請一覧', content=~{::main})">
<!-- ③ 個別（この画面の <main>） -->
<main>
  <h1>申請一覧</h1>
  <table class="data">
    <thead>
      <tr><th>件名</th><th>ステータス</th><th>操作</th></tr>
    </thead>
    <tbody>
      ...
    </tbody>
  </table>
</main>`,
        },
        {
          type: "p",
          text: "`fragments/layout :: layout` は、共通の `layout.html` を指します。`list.html` の <main>（一覧固有の部分）が、`layout.html` の <main> に入ります。",
        },
        {
          type: "h2",
          text: "Controller からテンプレートへの値の渡し方",
        },
        {
          type: "p",
          text: "テンプレートが参照する名前は、Controller が Model に載せたキーです。書き方はいくつかありますが、いずれもテンプレートに出ているキー名を、Controller 側で探せばよいです。",
        },
        {
          type: "table",
          headers: ["Controller の書き方", "テンプレートでの名前", "補足"],
          rows: [
            ["`model.addAttribute(\"applications\", list)`", "`${applications}`", "いちばん多い。申請くんはこの形"],
            ["`mav.addObject(\"applications\", list)` と `ModelAndView`", "`${applications}`", "`addAttribute` と同じ。戻り値が `ModelAndView`"],
            ["`model.put(\"applications\", list)` と Map", "`${applications}`", "引数が Map のとき。Model と同じ役割"],
            ["`@ModelAttribute(\"form\") RequestForm form`", "`${form}`", "フォーム表示・送信の両方で使うことがある"],
            ["`@ModelAttribute` メソッド（Controller 内）", "メソッドが返すキー名", "全画面に共通の値を載せる。各メソッドの前に実行される"],
            ["`redirectAttributes.addFlashAttribute(\"msg\", ...)`", "`${msg}`", "リダイレクト後の1回だけ。登録完了メッセージなど"],
          ],
        },
        {
          type: "p",
          text: "値は、リストやオブジェクト1件、文字列など何でも載せられます。テンプレートでは `${applications}` のようにキー名で取り出し、オブジェクトなら `${item.title}` のようにプロパティを辿ります。",
        },
        {
          type: "code",
          title: "書き方A: Model に載せて、テンプレート名を return（申請くん）",
          lang: "java",
          highlightLines: [9],
          code: `@Controller
@RequestMapping("/requests")
@RequiredArgsConstructor
public class RequestController {
  private final RequestService requestService;

  @GetMapping
  public String list(Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("applications", requestService.findMine(user.getId()));
    return "request/list";
  }
}`,
        },
        {
          type: "code",
          title: "書き方B: テンプレート名も値も ModelAndView に載せて return",
          lang: "java",
          highlightLines: [4],
          code: `@GetMapping("/requests")
public ModelAndView list(@AuthenticationPrincipal LoginUser user) {
  ModelAndView mav = new ModelAndView("request/list");
  mav.addObject("applications", requestMapper.findMine(user.getId()));
  return mav;
}`,
        },
        {
          type: "p",
          text: "ここでは Service を飛ばして Mapper を直接呼んでいます。前の項目「Controller / Service / Repository / Mapper」で触れた「並びがずれる」例です。",
        },
        {
          type: "callout",
          kind: "note",
          title: "@ModelAttribute は向きが2つ",
          text: "`@ModelAttribute` は、書く場所で意味が変わります。\n① 引数に付けると、送られてきたフォームの値をオブジェクトへ詰め、その同じオブジェクトを画面にも渡します。\n② メソッド自体に付けると（引数ではなく）、そのメソッドの戻り値を、Controller 内のどのリクエストでも毎回 Model に足します。\n同じ名前でも別の仕組みなので、混同しないでください。テンプレートを読むときは `${...}` のキー名だけ見れば十分です。",
        },
        {
          type: "h2",
          text: "よく見る Thymeleaf の属性",
        },
        {
          type: "table",
          headers: ["属性", "意味", "例"],
          rows: [
            ["`th:each`", "リストの繰り返し。要素ごとに内側のタグを出す", "`th:each=\"item : ${applications}\"`\n申請の件数だけ行が増える"],
            ["`th:text`", "画面に出す文字", "`th:text=\"${item.title}\"`\n画面に「交通費申請」などが出る"],
            ["`th:if` / `th:unless`", "条件が true のときだけタグを出す。ボタンが無い原因になりやすい", "`th:if=\"${item.status == 'PENDING'}\"`\nPENDING の行だけ承認ボタンが出る"],
            ["`th:action` / `th:href`", "form の送信先、リンク先。`@{...}` に書いたパスの前に、`context-path`（申請くんなら `/shinsei`）が付く", "`th:action=\"@{/requests/{id}/approve(id=${item.id})}\"`\n承認ボタンの送信先になる"],
            ["`th:name` / `name`", "フォームの項目名。Controller の `@RequestParam` と対応", "`name=\"title\"`\n送信時の項目名が title になる"],
            ["`th:fragment` / `th:replace`", "共通の HTML を、個別の画面から読み込む", "`layout.html` が共通、`list.html` が個別"],
          ],
        },
        {
          type: "p",
          text: "タグの中にある「交通費申請」「PENDING」などは、プレビュー用のダミーです。実行時は `th:text` の `${...}` が使われます。",
        },
        {
          type: "code",
          title: "templates/request/list.html（抜粋）",
          lang: "html",
          highlightLines: [5, 6],
          code: shinseiListTemplateSnippet,
        },
        {
          type: "p",
          text: "サーバが組み立てたあとは、th: 属性は消え、値だけが残ります。申請くんの一覧は、Mapper の SQL で未承認（`PENDING`）だけに絞り込まれています。テンプレートの `th:if` は、その一覧の各行について、`PENDING` のときだけボタンを出す条件です。この一覧では SQL 側ですでに `PENDING` だけに絞っているため、`th:if` は一覧内では常に true になります。",
        },
        {
          type: "code",
          title: "組み立て後の HTML（ブラウザが受け取る抜粋）",
          lang: "html",
          highlightLines: [5, 15],
          code: shinseiListRenderedSnippet,
        },
        {
          type: "diagram",
          name: "template-rendered",
          caption: "組み立て後の HTML をブラウザが描画したイメージ。申請くんの一覧は未承認だけなので、各行に承認ボタンが出る。",
        },
        {
          type: "h2",
          text: "読む順番",
        },
        {
          type: "ol",
          items: [
            "Controller の return から HTML ファイルを開く",
            "共通のヘッダや CSS は `fragments/layout.html` にある",
            "Model に載せた名前と、`th:each` / `th:text` の `${...}` が一致するか見る",
            "ボタンやリンクが無いときは `th:if` の条件を読む",
            "form の `th:action` と method で指定した送信先と HTTP メソッドが、想定の Controller のマッピングと一致するか見る",
            "POST なのに CSRF エラーなら、hidden の `_csrf` や `th:action` の有無を見る",
            "テンプレートと違う HTML がブラウザに出ているなら、別テンプレートか JS の書き換えを疑う（Elements タブで確認）",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ソースと画面の見比べ",
          text: "テンプレートはサーバ側のファイルです。ブラウザの Elements タブは、組み立て後の HTML です。`th:if` で消えたボタンは、テンプレートにはあっても画面には出ません。実務では、両方を見ましょう。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-list.jpg",
          alt: "組み立て後の申請一覧画面",
          caption: "一覧は未承認だけです。各行に承認ボタンがあります。承認済みは申請履歴で探します。",
        },
        { type: "quiz", id: "java-template" },
      ],
    },
    {
      id: "security-filter",
      title: "Filter / Interceptor / AOP / @ControllerAdvice",
      minutes: 11,
      blocks: [
        {
          type: "p",
          text: "Controller から Service を追うとき、ソースに書いてある Java メソッド呼び出しだけを見るのでは足りないことがあります。リクエストの前後や、メソッド呼び出しの手前に、別クラスが挟まることがあるためです。ソースを読んでも、挟まっている別クラスの名前は出てきません。",
        },
        { type: "diagram", name: "cross-cut", caption: "Controller や Service のソースに、これらの呼び出しは書かれていません。" },
        {
          type: "table",
          headers: ["種類", "動く位置", "ソースでの見え方"],
          rows: [
            ["Filter", "サーブレットコンテナ。Controller の前（静的ファイルも通ることがある）", "Controller から呼ばれない。Filter 実装や SecurityConfig を別検索する"],
            ["Interceptor", "Spring MVC。Controller の Java メソッドの直前・直後", "`HandlerInterceptor` と WebMvcConfigurer の `addInterceptors`。Controller に呼び出しは無い"],
            ["AOP / プロキシ", "Service などの Java メソッド呼び出しの手前", "見た目は `requestService.approve()`。実行時は `$Proxy` や CGLIB を経由する"],
            ["`@ControllerAdvice`", "例外のあと。戻り値や画面を別クラスが決める", "throw したメソッドの return を追っても、実際の応答はここ"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "見逃さないために",
          text: "実際の動きと、ソースから読める処理が食い違うときは、もっと深く探すのではなく、この4種類（Filter / Interceptor / AOP / `@ControllerAdvice`）のどれかを疑いましょう。症状からどれを疑うかは、この項目の最後にまとめます。",
        },
        {
          type: "h2",
          text: "Filter と Spring Security",
        },
        {
          type: "p",
          text: "リクエストは Controller の前にフィルタを通ります。ここに原因があると、Controller のブレークポイントで止まりません。Spring Security も、実体は Filter の連鎖です。",
        },
        {
          type: "p",
          text: "代表的な処理には次のようなものがあります。",
        },
        {
          type: "ul",
          items: [
            "ログイン必須",
            "CSRF",
            "文字コード",
          ],
        },
        {
          type: "diagram",
          name: "filters",
          caption: "既定の並びの例。どこで止まるか、何を返すかは設定によって変わります。",
        },
        {
          type: "p",
          text: "Java メソッドに入らないときは、Spring Security の設定を順に確認しましょう。",
        },
        {
          type: "ol",
          items: [
            "パス許可",
            "CSRF",
            "セッション",
            "コンテキストパス",
          ],
        },
        {
          type: "p",
          text: "画面の未ログインは 302 でログイン HTML、Web API は 401 で JSON、という違いがよくあります。決まりではありません。",
        },
        {
          type: "code",
          title: "静的ファイルの許可漏れの例（申請くんではありません）",
          lang: "java",
          highlightLines: [1],
          code: `.antMatchers("/login", "/css/**").permitAll()
.anyRequest().authenticated();
// /images を許可し忘れると、画像だけ 302 でログインへ
// Spring Boot 3.x では antMatchers ではなく requestMatchers を使う`,
        },
        {
          type: "h2",
          text: "Interceptor",
        },
        {
          type: "p",
          text: "Spring MVC の `HandlerInterceptor` は、Controller の Java メソッドの直前（preHandle）と直後（postHandle / afterCompletion）に動きます。ログ、共通の権限、アクセス記録などで使います。Controller のソースを上から読んでも、呼び出しは出てきません。",
        },
        {
          type: "code",
          title: "登録場所（呼び出し元ではない）",
          lang: "java",
          code: `@Override
public void addInterceptors(InterceptorRegistry registry) {
  registry.addInterceptor(accessLogInterceptor)
    .addPathPatterns("/requests/**");
}`,
        },
        {
          type: "p",
          text: "探すときは次の語で検索しましょう。",
        },
        {
          type: "ul",
          items: [
            "`HandlerInterceptor`",
            "`addInterceptors`",
            "WebMvcConfigurer",
          ],
        },
        {
          type: "p",
          text: "preHandle が false を返すと、Controller に届きません。",
        },
        {
          type: "h2",
          text: "AOP とプロキシ",
        },
        {
          type: "p",
          text: "Service のメソッドを直接呼んでいるように見えても、実行時はプロキシが先に動きます。スタックトレースに出る $Proxy や CGLIB は、この経由を通った跡です。",
        },
        {
          type: "ul",
          items: [
            "`@Transactional`",
            "独自の `@Aspect`",
            "メソッドの `@PreAuthorize`",
          ],
        },
        {
          type: "p",
          text: "これらのアノテーションはメソッドに付いていますが、処理の呼び出しはソースに出ません。読み飛ばさず確認しましょう。",
        },
        {
          type: "code",
          title: "Controller に書かれている呼び出し",
          lang: "java",
          code: `requestService.approve(id, userId);
// この1行の手前で、トランザクション開始や @Aspect が動くことがある
// 本体の1行目で止まった時点では、トランザクションが始まっていることがある`,
        },
        {
          type: "p",
          text: "このうち、よくあるのは `@Transactional` です。ここを例に確認方法を挙げます。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "Java メソッド本体より前",
          text: "`@Transactional` が付いていても、通常はトランザクションを開始したあとに Java メソッド本体へ進むため、本体のブレークポイントで止まります。止まらないときは、メソッド認可や独自の `@Aspect` が本体を呼ばずに終了していないか、トランザクション開始時に失敗していないかを確認しましょう。",
        },
        {
          type: "h2",
          text: "例外の出口",
        },
        {
          type: "p",
          text: "`@ControllerAdvice` や `HandlerExceptionResolver` は、throw したあとの応答を別クラスが決めます。業務例外を投げたメソッドの return を追っても、画面メッセージや JSON の形はここにあります。",
        },
        {
          type: "ul",
          items: [
            "Controller に届かない → Filter、Interceptor、SecurityConfig",
            "Controller には入るが Service の本体に入らない → メソッド認可、独自の AOP、トランザクション開始時の失敗",
            "例外の画面や JSON がメソッドに無い → `@ControllerAdvice`",
            "検索語: `HandlerInterceptor`、`addInterceptors`、`OncePerRequestFilter`、`@Aspect`、`@ControllerAdvice`",
          ],
        },
        { type: "quiz", id: "java-crosscut" },
      ],
    },
    {
      id: "arch",
      title: "HTTP サーバとサーブレットコンテナ",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "ここまでは、自分たちが書くソースの話です。ここからは、その外側でリクエストが通るプログラムの話です。ブラウザからのリクエストは、HTTP サーバやサーブレットコンテナを通ってから Controller に届きます。",
        },
        {
          type: "h2",
          text: "役割の違い",
        },
        {
          type: "table",
          headers: ["種類", "例", "すること"],
          rows: [
            ["HTTP サーバ", "Apache、nginx", "手前で受ける。ブラウザとの HTTPS をここで解き、静的ファイルを配信し、後ろへ中継する"],
            ["サーブレットコンテナ", "Tomcat、Jetty", "Java の画面や API を動かす"],
          ],
        },
        { type: "diagram", name: "arch-roles", caption: "手前の HTTP サーバは無いこともあります。Java は、どれかのサーブレットコンテナで動きます。" },
        {
          type: "callout",
          kind: "trap",
          title: "Apache と Tomcat",
          text: "Apache（httpd）は HTTP サーバ、Tomcat はサーブレットコンテナです。Tomcat の正式名は Apache Tomcat で、同じ Apache という名前が付きますが、別物です。",
        },
        {
          type: "h2",
          text: "重ね方のパターン",
        },
        {
          type: "p",
          text: "よく見る重ね方は次の3つです。",
        },
        {
          type: "steps",
          items: [
            {
              title: "内蔵だけ",
              text: "Spring Boot を IDE や java -jar で起動すると、同じプロセスの中で Tomcat や Jetty が動きます。別途 Tomcat を入れる必要はありません。",
            },
            {
              title: "外部に WAR",
              text: "アプリを WAR にして、すでに動いている Tomcat や Jetty に載せます。ログは catalina.out など、Tomcat 側の置き場を見ましょう。",
            },
            {
              title: "手前に Apache / nginx",
              text: "ブラウザからの HTTP リクエストは、まず Apache か nginx が受けます。ブラウザとの HTTPS はここで解き、後ろの Tomcat / Jetty へは HTTP で渡すことが多いです（SSL オフロード）。静的ファイルの配信やパスの振り分けもここで行い、動的な処理だけ後ろへ渡します。後ろは内蔵でも外部 WAR でも構いません。",
            },
          ],
        },
        { type: "diagram", name: "arch-patterns" },
        {
          type: "h2",
          text: "重ね方で変わる切り分け",
        },
        {
          type: "p",
          text: "上の3パターンのどれかによって、ログの見る場所が変わります。",
        },
        {
          type: "ul",
          items: [
            "静的ファイルの 404 は、手前の HTTP サーバのパス設定のことがある（パターン3）",
            "アプリのエラーログは、サーブレットコンテナ側にある",
            "コンテキストパスは、手前と後ろの両方に付いていることがある（パターン3）",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "APサーバ",
          text: "古い現場では WebLogic など APサーバに載せることもあります。動く先が Tomcat ではない、というだけです。",
        },
        {
          type: "h2",
          text: "さらに手前",
        },
        {
          type: "p",
          text: "上のどの重ね方でも、さらに手前にロードバランサや CDN、WAF が置かれることがあります。いずれも Java のコードより手前です。パターン3なら Apache / nginx の外側、パターン1・2なら Tomcat や Spring Boot の手前、という位置づけです。",
        },
        {
          type: "ul",
          items: [
            "ロードバランサ（LB）… 複数台へ振り分け。SSL 終端をここで行うこともある",
            "CDN … 静的ファイルを近い拠点から配る。キャッシュや SSL 終端を担うこともある",
            "WAF … HTTP リクエストを検査し、攻撃と判定したものを遮断する",
          ],
        },
        {
          type: "p",
          text: "ログの出る場所や、ブロックされたときの応答は環境次第です。実務では「アプリに届いたか」を先に確認しましょう。",
        },
        { type: "quiz", id: "java-arch" },
      ],
    },
  ],
};
