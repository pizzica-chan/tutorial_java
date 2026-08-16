export type ProjectFile = {
  path: string;
  note: string;
  why: string;
  code: string;
};

export const projectFiles: ProjectFile[] = [
  {
    path: "pom.xml",
    note: "何のライブラリで動いているか",
    why: "Spring Boot の版、Thymeleaf、MyBatis、MySQL ドライバなど、使っているライブラリがここに並びます。知らない依存を全部理解する必要はありません。画面と DB に直結するものから見ます。",
    code: `<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>2.7.18</version>
</parent>
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
</dependencies>`,
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
    path: "src/main/java/.../controller/RequestController.java",
    note: "URLの受付口",
    why: "画面のアドレスと HTTP メソッドが、ここの Java メソッドに対応します。障害調査はほぼここから始まります。",
    code: `@Controller
@RequestMapping("/requests")
@RequiredArgsConstructor
public class RequestController {
  private final RequestService requestService;

  @GetMapping
  public String list(Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("requests", requestService.findMine(user.getId()));
    return "request/list";
  }

  @PostMapping("/{id}/approve")
  public String approve(@PathVariable Long id, @AuthenticationPrincipal LoginUser user) {
    requestService.approve(id, user.getId());
    return "redirect:/requests";
  }
}`,
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
  private final RequestRepository requestRepository;
  private final MailService mailService;

  public void approve(Long requestId, Long approverId) {
    RequestEntity request = requestRepository.findById(requestId);
    if (request == null) {
      throw new NotFoundException("申請がありません");
    }
    if (!request.getApproverId().equals(approverId)) {
      throw new ForbiddenException("承認権限がありません");
    }
    request.setStatus("APPROVED");
    requestRepository.update(request);
    mailService.notifyApplicant(request);
  }
}`,
  },
  {
    path: "src/main/resources/mapper/RequestMapper.xml",
    note: "実際のSQL",
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
    code: `<tr th:each="req : \${requests}">
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
</tr>`,
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
  "    repository/RequestRepository.java",
  "    entity/RequestEntity.java",
  "  src/main/resources/",
    "    application.yml",
    "    application-dev.yml",
    "    logback-spring.xml",
  "    mapper/RequestMapper.xml",
  "    templates/request/list.html",
  "    templates/login.html",
];
