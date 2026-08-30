import {
  requestControllerPath,
  requestControllerSample,
  requestListEntryPoint,
} from "./entryPoint";

export type ProjectFile = {
  path: string;
  note: string;
  why: string;
  code: string;
};

/** 申請くんの RequestService。ソースツリーと「呼び出し元と呼び出し先」で同じ抜粋を使う */
export const requestServiceSample = `@Service
@RequiredArgsConstructor
public class RequestService {
  private final RequestMapper requestMapper;
  private final MailService mailService;

  public List<RequestEntity> findMine(Long userId) {
    return requestMapper.findMine(userId);
  }

  public RequestEntity findById(Long id, Long userId) {
    return requestMapper.findById(id, userId);
  }

  public RequestEntity create(Long applicantId, String title, Long approverId) {
    RequestEntity request = new RequestEntity();
    request.setTitle(title);
    request.setApplicantId(applicantId);
    request.setApproverId(approverId);
    request.setStatus("PENDING");
    requestMapper.insert(request);
    return request;
  }

  public void approve(Long requestId, Long approverId) {
    RequestEntity request = requestMapper.findById(requestId, approverId);
    if (request == null) {
      throw new NotFoundException("指定した申請は無い、または見る権限がありません。");
    }
    if (!request.getApproverId().equals(approverId)) {
      throw new ForbiddenException("承認権限がありません");
    }
    request.setStatus("APPROVED");
    requestMapper.update(request);
    mailService.notifyApplicant(request);
  }
}`;

/** 教材用。申請くんの pom.xml 抜粋 */
export const shinseiPomSnippet = `<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>2.7.18</version>
</parent>

<properties>
  <java.version>17</java.version>
</properties>

<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
  </dependency>
  <dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.3.2</version>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  <dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
  </dependency>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
</dependencies>`;

/** 教材用。上の pom.xml と同じ依存を Gradle で書いた例 */
export const shinseiGradleSnippet = `plugins {
  id 'org.springframework.boot' version '2.7.18'
  id 'io.spring.dependency-management' version '1.1.4'
  id 'java'
}

java {
  sourceCompatibility = JavaVersion.VERSION_17
}

dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
  implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
  implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter:2.3.2'
  implementation 'org.springframework.boot:spring-boot-starter-security'
  runtimeOnly 'mysql:mysql-connector-java'
  implementation 'org.springframework.boot:spring-boot-starter-mail'
  compileOnly 'org.projectlombok:lombok'
  annotationProcessor 'org.projectlombok:lombok'
}`;

/** 教材用。申請くんの一覧テンプレート抜粋 */
export const shinseiListTemplateSnippet = `<tr th:each="item : \${applications}">
  <td th:text="\${item.title}">交通費申請</td>
  <td th:text="\${item.status}">PENDING</td>
  <td>
    <form th:if="\${item.status == 'PENDING'}"
          th:action="@{/requests/{id}/approve(id=\${item.id})}"
          method="post">
      <input type="hidden" th:name="\${_csrf.parameterName}" th:value="\${_csrf.token}" />
      <button type="submit">承認</button>
    </form>
  </td>
</tr>`;

/** 教材用。上のテンプレートを組み立てたあとの HTML（申請2件の例） */
export const shinseiListRenderedSnippet = `<tr>
  <td>交通費申請</td>
  <td>PENDING</td>
  <td>
    <form action="/shinsei/requests/12/approve" method="post">
      <input type="hidden" name="_csrf" value="8f3a2b1c-4e5f-6789-abcd-ef0123456789" />
      <button type="submit">承認</button>
    </form>
  </td>
</tr>
<tr>
  <td>備品購入</td>
  <td>APPROVED</td>
  <td></td>
</tr>`;

/** 教材用。テンプレートから static を読み込む抜粋 */
export const shinseiLayoutStaticSnippet = `<head>
  <link rel="stylesheet" th:href="@{/css/app.css}" />
  <script th:src="@{/js/app.js}" defer></script>
</head>`;

/** 教材用。申請くんの CSS 抜粋 */
export const shinseiAppCssSnippet = `body {
  font-family: sans-serif;
  margin: 1rem;
}

.btn-approve {
  background: #2d6a4f;
  color: #fff;
}`;

/** 教材用。申請くんの JS 抜粋 */
export const shinseiAppJsSnippet = `document.querySelectorAll("form.js-approve-confirm").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!window.confirm("承認してよいですか？")) {
      event.preventDefault();
    }
  });
});`;

export const projectFiles: ProjectFile[] = [
  {
    path: "pom.xml",
    note: "何で動いているか",
    why: "Spring Boot の版、Thymeleaf、MyBatis、MySQL ドライバなど、使っているものがここに並びます。知らない依存を全部理解する必要はありません。画面と DB に直結するものから見ます。",
    code: shinseiPomSnippet,
  },
  {
    path: "src/main/resources/application.yml",
    note: "Spring Boot 用。接続先とプロファイル",
    why: "接続先、ID、ログレベル、ファイルパスは環境ごとに違います。コードを疑う前に、今どの設定で起動しているかを確認します。yml ではなく `application.properties` のプロジェクトもあります。username / password は教材用のサンプル値です。",
    code: `spring:
  profiles:
    active: dev
  datasource:
    url: jdbc:mysql://localhost:3306/shinsei
    username: app
    password: app
server:
  port: 8080
  servlet:
    context-path: /shinsei
logging:
  level:
    jp.co.example.shinsei: DEBUG`,
  },
  {
    path: "src/main/resources/application-dev.yml",
    note: "dev プロファイル用の上書き",
    why: "`spring.profiles.active` が `dev` のとき、`application.yml` のあとにこのファイルが読み込まれます。同じ項目はこちらの設定が優先されます。ローカルだけ DB 名やログ量を変える、という使い方が多いです。",
    code: `spring:
  datasource:
    url: jdbc:mysql://localhost:3306/shinsei_dev
logging:
  level:
    jp.co.example.shinsei: DEBUG
    org.mybatis: DEBUG`,
  },
  {
    path: "src/main/resources/application-stg.yml",
    note: "stg プロファイル用の追加分",
    why: "`spring.profiles.active` が `stg` のとき、`application.yml` のあとにこのファイルが読み込まれます。同じ項目はこちらの設定が優先されます。検証環境の DB 接続先やログ量をまとめて書く、という使い方が多いです。password の `${DB_PASSWORD}` は、起動時に環境変数 `DB_PASSWORD` の値に差し替わる書き方です。yml にパスワードを直書きしないときに使います。",
    code: `spring:
  datasource:
    url: jdbc:mysql://stg-db.example.internal:3306/shinsei
    username: app
    password: \${DB_PASSWORD}
logging:
  level:
    jp.co.example.shinsei: INFO`,
  },
  {
    path: "src/main/java/.../ShinseiApplication.java",
    note: "起動の入口",
    why: "main があるクラスです。普段は触りませんが、「どのパッケージがルートか」を知る目印になります。",
    code: `@SpringBootApplication
public class ShinseiApplication {
  public static void main(String[] args) {
    SpringApplication.run(ShinseiApplication.class, args);
  }
}`,
  },
  {
    path: requestControllerPath,
    note: "処理の入口（画面）",
    why: `${requestListEntryPoint.httpMethod} ${requestListEntryPoint.url} など、画面の URL と HTTP メソッドがここの Java メソッド（${requestListEntryPoint.javaMethod}）に対応します。調べたい画面の処理の入口は、ほぼここから始まります。`,
    code: requestControllerSample,
  },
  {
    path: "src/main/java/.../controller/RequestApiController.java",
    note: "JSON を返す Web API",
    why: "画面用の Controller と並ぶ受付口です。戻り値がオブジェクトなら JSON になります。templates は見ません。探す順番は画面と同じです。",
    code: `@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestApiController {
  private final RequestService requestService;

  @GetMapping
  public List<RequestResponse> list(@AuthenticationPrincipal LoginUser user) {
    return requestService.findMine(user.getId());
  }

  @PostMapping
  public RequestEntity create(@RequestBody NewRequest body, @AuthenticationPrincipal LoginUser user) {
    return requestService.create(user.getId(), body.title(), body.approverId());
  }

  @PostMapping("/{id}/approve")
  public void approve(@PathVariable Long id, @AuthenticationPrincipal LoginUser user) {
    requestService.approve(id, user.getId());
  }

  public record NewRequest(String title, Long approverId) {}
}`,
  },
  {
    path: "src/main/java/.../controller/LoginController.java",
    note: "ログイン画面の入口",
    why: "SecurityConfig で loginPage(\"/login\") と書いてあるとき、ブラウザが開く画面はここから返されます。認証失敗で戻る画面も同じテンプレートのことが多いです。",
    code: `@Controller
public class LoginController {

  @GetMapping("/login")
  public String login() {
    return "login";
  }
}`,
  },
  {
    path: "src/main/java/.../service/RequestService.java",
    note: "ビジネスロジック",
    why: "業務として何をするかを書きます。申請くんの承認を例にすると、承認可否の判定、ステータスの更新、メール送信がここにあります。バグの本体もここに多いです。",
    code: requestServiceSample,
  },
  {
    path: "src/main/java/.../service/MailService.java",
    note: "メール送信",
    why: "承認後の通知など、画面に出ない処理がここにあります。DB 更新は成功したのにメールが来ないときは、Service のログのあとにこのクラスの行があるかを確認しましょう。",
    code: `@Service
@RequiredArgsConstructor
public class MailService {
  private final JavaMailSender mailSender;

  public void notifyApplicant(RequestEntity request) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(request.getApplicantEmail());
    message.setSubject("申請が承認されました");
    message.setText(request.getTitle() + " が承認されました。");
    mailSender.send(message);
  }
}`,
  },
  {
    path: "src/main/java/.../mapper/RequestMapper.java",
    note: "SQL との対応（インタフェース）",
    why: "Java のメソッド名と、XML の id が対になります。申請くんは MyBatis なので、Spring Data の Repository ではなく Mapper です。",
    code: `public interface RequestMapper {
  List<RequestEntity> findMine(@Param("userId") Long userId);
  RequestEntity findById(@Param("id") Long id, @Param("userId") Long userId);
  int insert(RequestEntity request);
  int update(RequestEntity request);
}`,
  },
  {
    path: "src/main/java/.../entity/RequestEntity.java",
    note: "1 件の申請データ",
    why: "DB の行と Java の対応です。Mapper の resultType や update の引数に使われます。null のフィールドがあると、Service の equals などで `NullPointerException` になることがあります。",
    code: `public class RequestEntity {
  private Long id;
  private String title;
  private String status;
  private Long applicantId;
  private Long approverId;
  private String applicantEmail;
  private LocalDateTime createdAt;
  // getter / setter …
}`,
  },
  {
    path: "src/main/resources/mapper/RequestMapper.xml",
    note: "実際の SQL",
    why: "一覧が遅い、件数が合わない、更新されないといった症状は、SQL を見ないと終わりません。Java のメソッド名と XML の id が対になっています。`findById` は詳細表示と承認で 1 件取り、`applicant_email` は通知先です。",
    code: `<select id="findMine" resultType="RequestEntity">
  SELECT id, title, status, applicant_id, approver_id, applicant_email, created_at
  FROM t_request
  WHERE applicant_id = #{userId}
     OR approver_id = #{userId}
  ORDER BY created_at DESC
</select>

<select id="findById" resultType="RequestEntity">
  SELECT id, title, status, applicant_id, approver_id, applicant_email, created_at
  FROM t_request
  WHERE id = #{id}
    AND (applicant_id = #{userId} OR approver_id = #{userId})
</select>

<insert id="insert" useGeneratedKeys="true" keyProperty="id">
  INSERT INTO t_request (title, status, applicant_id, approver_id, created_at)
  VALUES (#{title}, #{status}, #{applicantId}, #{approverId}, NOW())
</insert>

<update id="update">
  UPDATE t_request
     SET status = #{status},
         updated_at = NOW()
   WHERE id = #{id}
</update>`,
  },
  {
    path: "src/main/resources/templates/request/list.html",
    note: "画面テンプレート",
    why: "ボタンの遷移先、hidden 項目、表示条件（ステータスでボタンを出す等）は HTML 側にあります。サーバだけ見ても足りないことがあります。`th:action` なら CSRF 用 hidden が自動で付くことが多いです。教材では明示して見せています。欠けると POST が弾かれます。",
    code: shinseiListTemplateSnippet,
  },
  {
    path: "src/main/resources/templates/request/detail.html",
    note: "申請詳細の画面テンプレート",
    why: "表示する項目やフォームの送信先は HTML 側にあります。申請くんの詳細はシナリオでサーバ側の判定を確認できるよう、ステータスにかかわらず承認ボタンを表示します。通常の画面では `th:if` で表示を制限する実装もあります。",
    code: `<h1 th:text="\${requestItem.title}">交通費申請</h1>
<p>ステータス: <span th:text="\${requestItem.status}">PENDING</span></p>
<form th:action="@{/requests/{id}/approve(id=\${requestItem.id})}"
      method="post">
  <input type="hidden" th:name="\${_csrf.parameterName}" th:value="\${_csrf.token}" />
  <button type="submit">承認</button>
</form>`,
  },
  {
    path: "src/main/resources/templates/login.html",
    note: "ログイン画面",
    why: "form の action、CSRF 用 hidden、エラー表示の有無はここにあります。SecurityConfig の loginPage とセットで見ます。",
    code: `<form th:action="@{/login}" method="post">
  <input type="text" name="username" placeholder="ユーザID" />
  <input type="password" name="password" placeholder="パスワード" />
  <input type="hidden" th:name="\${_csrf.parameterName}" th:value="\${_csrf.token}" />
  <button type="submit">ログイン</button>
</form>`,
  },
  {
    path: "src/main/resources/static/css/app.css",
    note: "画面用 CSS",
    why: "見た目の調整は Java ではなく static 配下に置かれることが多いです。404 のときは、ファイルの有無と URL（`context-path` 付きか）を Network タブで確認します。",
    code: shinseiAppCssSnippet,
  },
  {
    path: "src/main/resources/static/js/app.js",
    note: "画面用 JavaScript",
    why: "ボタンの確認ダイアログなど、ブラウザ側の動きは static/js に置かれることが多いです。HTML から読み込みます。`context-path` があるときは `th:src=\"@{/js/app.js}\"` のように書くことが多いです。",
    code: shinseiAppJsSnippet,
  },
  {
    path: "src/main/java/.../config/SecurityConfig.java",
    note: "Spring Security。ログインと権限",
    why: "401/403、ログイン画面への飛ばされ、CSRFエラーはまずここを疑います。",
    code: `@Bean
SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http.authorizeHttpRequests(auth -> auth
      .antMatchers("/login", "/css/**", "/js/**").permitAll()
      .antMatchers("/admin/**").hasRole("ADMIN")
      .anyRequest().authenticated()
    )
    .formLogin(login -> login.loginPage("/login").defaultSuccessUrl("/requests"))
    .logout(logout -> logout.logoutSuccessUrl("/login"));
  return http.build();
}`,
  },
  {
    path: "src/main/resources/logback-spring.xml",
    note: "Spring Boot 用。ログの出力先",
    why: "ファイルに出すか、コンソールだけか、日付で分けるかといった設定がここに書かれていることが多いです。障害調査は、まずこの出力先を確認します。",
    code: `<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
  <file>logs/shinsei.log</file>
  <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
    <fileNamePattern>logs/shinsei.%d{yyyy-MM-dd}.log</fileNamePattern>
  </rollingPolicy>
</appender>`,
  },
  {
    path: "src/test/java/.../ShinseiApplicationTests.java",
    note: "起動テスト",
    why: "Spring Boot が生成することが多い、最小のテストです。`@SpringBootTest` でコンテキストが立ち上がるかを見ます。本番の業務ロジックのテストとは別枠です。",
    code: `@SpringBootTest
class ShinseiApplicationTests {

  @Test
  void contextLoads() {
  }
}`,
  },
  {
    path: "src/test/java/.../service/RequestServiceTest.java",
    note: "Service の単体テスト",
    why: "本番の RequestService と同じパッケージ構成で、test 配下に置きます。Mapper や MailService をモックにして、承認ロジックだけを切り出して確認する、という形が多いです。",
    code: `@ExtendWith(MockitoExtension.class)
class RequestServiceTest {
  @Mock
  private RequestMapper requestMapper;
  @Mock
  private MailService mailService;
  @InjectMocks
  private RequestService requestService;

  @Test
  void approve_updatesStatusAndSendsMail() {
    RequestEntity request = new RequestEntity();
    request.setId(1L);
    request.setApproverId(10L);
    request.setStatus("PENDING");
    when(requestMapper.findById(1L, 10L)).thenReturn(request);

    requestService.approve(1L, 10L);

    assertEquals("APPROVED", request.getStatus());
    verify(requestMapper).update(request);
    verify(mailService).notifyApplicant(request);
  }
}`,
  },
];

export type ProjectTreeNode = {
  name: string;
  children?: ProjectTreeNode[];
  /** projectFiles の path と一致するとき、右ペインに詳細を出す */
  filePath?: string;
};

export const projectTree: ProjectTreeNode = {
  name: "shinsei-kun",
  children: [
    { name: "pom.xml", filePath: "pom.xml" },
    {
      name: "src",
      children: [
        {
          name: "main",
          children: [
            {
              name: "java",
              children: [
                {
                  name: "jp/co/example/shinsei",
                  children: [
                    { name: "ShinseiApplication.java", filePath: "src/main/java/.../ShinseiApplication.java" },
                    {
                      name: "config",
                      children: [{ name: "SecurityConfig.java", filePath: "src/main/java/.../config/SecurityConfig.java" }],
                    },
                    {
                      name: "controller",
                      children: [
                        { name: "RequestController.java", filePath: requestControllerPath },
                        { name: "RequestApiController.java", filePath: "src/main/java/.../controller/RequestApiController.java" },
                        { name: "LoginController.java", filePath: "src/main/java/.../controller/LoginController.java" },
                      ],
                    },
                    {
                      name: "service",
                      children: [
                        { name: "RequestService.java", filePath: "src/main/java/.../service/RequestService.java" },
                        { name: "MailService.java", filePath: "src/main/java/.../service/MailService.java" },
                      ],
                    },
                    {
                      name: "mapper",
                      children: [{ name: "RequestMapper.java", filePath: "src/main/java/.../mapper/RequestMapper.java" }],
                    },
                    {
                      name: "entity",
                      children: [{ name: "RequestEntity.java", filePath: "src/main/java/.../entity/RequestEntity.java" }],
                    },
                  ],
                },
              ],
            },
            {
              name: "resources",
              children: [
                { name: "application.yml", filePath: "src/main/resources/application.yml" },
                { name: "application-dev.yml", filePath: "src/main/resources/application-dev.yml" },
                { name: "application-stg.yml", filePath: "src/main/resources/application-stg.yml" },
                { name: "logback-spring.xml", filePath: "src/main/resources/logback-spring.xml" },
                {
                  name: "mapper",
                  children: [{ name: "RequestMapper.xml", filePath: "src/main/resources/mapper/RequestMapper.xml" }],
                },
                {
                  name: "templates",
                  children: [
                    {
                      name: "request",
                      children: [
                        { name: "list.html", filePath: "src/main/resources/templates/request/list.html" },
                        { name: "detail.html", filePath: "src/main/resources/templates/request/detail.html" },
                      ],
                    },
                    { name: "login.html", filePath: "src/main/resources/templates/login.html" },
                  ],
                },
                {
                  name: "static",
                  children: [
                    {
                      name: "css",
                      children: [{ name: "app.css", filePath: "src/main/resources/static/css/app.css" }],
                    },
                    {
                      name: "js",
                      children: [{ name: "app.js", filePath: "src/main/resources/static/js/app.js" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "test",
          children: [
            {
              name: "java",
              children: [
                {
                  name: "jp/co/example/shinsei",
                  children: [
                    {
                      name: "ShinseiApplicationTests.java",
                      filePath: "src/test/java/.../ShinseiApplicationTests.java",
                    },
                    {
                      name: "service",
                      children: [
                        {
                          name: "RequestServiceTest.java",
                          filePath: "src/test/java/.../service/RequestServiceTest.java",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export function getProjectFile(path: string): ProjectFile | undefined {
  return projectFiles.find((file) => file.path === path);
}
