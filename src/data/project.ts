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
}`;

/** 教材用。申請くんの一覧テンプレート抜粋 */
export const shinseiListTemplateSnippet = `<tr th:each="req : \${requests}">
  <td th:text="\${req.title}">交通費申請</td>
  <td th:text="\${req.status}">申請中</td>
  <td>
    <form th:if="\${req.status == 'PENDING'}"
          th:action="@{/requests/{id}/approve(id=\${req.id})}"
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

export const projectFiles: ProjectFile[] = [
  {
    path: "pom.xml",
    note: "何のライブラリで動いているか",
    why: "Spring Boot の版、Thymeleaf、MyBatis、MySQL ドライバなど、使っているライブラリがここに並びます。知らない依存を全部理解する必要はありません。画面と DB に直結するものから見ます。",
    code: shinseiPomSnippet,
  },
  {
    path: "src/main/resources/application.yml",
    note: "Spring Boot 用。接続先とプロファイル",
    why: "接続先、ID、ログレベル、ファイルパスは環境ごとに違います。コードを疑う前に、今どの設定で起動しているかを確認します。yml ではなく application.properties のプロジェクトもあります。username / password は教材用のサンプル値です。",
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

  @PostMapping("/{id}/approve")
  public void approve(@PathVariable Long id, @AuthenticationPrincipal LoginUser user) {
    requestService.approve(id, user.getId());
  }
}`,
  },
  {
    path: "src/main/java/.../service/RequestService.java",
    note: "業務の判断",
    why: "権限チェック、ステータス遷移、メール送信など「何をしてよいか」がここに集まります。バグの本体もここに多いです。",
    code: `@Service
@RequiredArgsConstructor
public class RequestService {
  private final RequestMapper requestMapper;
  private final MailService mailService;

  public void approve(Long requestId, Long approverId) {
    RequestEntity request = requestMapper.findById(requestId);
    if (request == null) {
      throw new NotFoundException("申請がありません");
    }
    if (!request.getApproverId().equals(approverId)) {
      throw new ForbiddenException("承認権限がありません");
    }
    request.setStatus("APPROVED");
    requestMapper.update(request);
    mailService.notifyApplicant(request);
  }
}`,
  },
  {
    path: "src/main/java/.../mapper/RequestMapper.java",
    note: "SQL との対応（インタフェース）",
    why: "Java のメソッド名と、XML の id が対になります。申請くんは MyBatis なので、Spring Data の Repository ではなく Mapper です。",
    code: `public interface RequestMapper {
  List<RequestEntity> findMine(@Param("userId") Long userId);
  RequestEntity findById(Long id);
  int update(RequestEntity request);
}`,
  },
  {
    path: "src/main/resources/mapper/RequestMapper.xml",
    note: "実際の SQL",
    why: "一覧が遅い、件数が合わない、更新されないといった症状は、SQL を見ないと終わりません。Java のメソッド名と XML の id が対になっています。",
    code: `<select id="findMine" resultType="RequestEntity">
  SELECT id, title, status, applicant_id, approver_id, created_at
  FROM t_request
  WHERE applicant_id = #{userId}
     OR approver_id = #{userId}
  ORDER BY created_at DESC
</select>

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
    why: "ボタンの遷移先、hidden 項目、表示条件（ステータスでボタンを出す等）は HTML 側にあります。サーバだけ見ても足りないことがあります。th:action なら CSRF 用 hidden が自動で付くことが多いです。欠けると POST が弾かれます。",
    code: shinseiListTemplateSnippet,
  },
  {
    path: "src/main/java/.../config/SecurityConfig.java",
    note: "Spring Security。ログインと権限",
    why: "401/403、ログイン画面への飛ばされ、CSRFエラーはまずここを疑います。",
    code: `@Bean
SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http.authorizeHttpRequests(auth -> auth
      .antMatchers("/login", "/css/**").permitAll()
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
    note: "Spring Boot 用。ログの行き先",
    why: "ファイルに出すか、コンソールだけか、日付で分けるかといった設定がここに書かれていることが多いです。障害調査は、まずこの出力先を確認します。",
    code: `<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
  <file>logs/shinsei.log</file>
  <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
    <fileNamePattern>logs/shinsei.%d{yyyy-MM-dd}.log</fileNamePattern>
  </rollingPolicy>
</appender>`,
  },
];

export const projectTree = [
  "shinsei-kun/",
  "  pom.xml",
  "  src/main/java/jp/co/example/shinsei/",
  "    ShinseiApplication.java",
  "    config/SecurityConfig.java",
    "    controller/RequestController.java",
    "    controller/RequestApiController.java",
    "    controller/LoginController.java",
  "    service/RequestService.java",
  "    service/MailService.java",
  "    mapper/RequestMapper.java",
  "    entity/RequestEntity.java",
  "  src/main/resources/",
    "    application.yml",
    "    application-dev.yml",
    "    logback-spring.xml",
  "    mapper/RequestMapper.xml",
  "    templates/request/list.html",
  "    templates/login.html",
];
