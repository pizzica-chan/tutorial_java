import type { Track } from "../types";

export const javaMapTrack: Track = {
  id: "java-map",
  no: "02",
  title: "Javaアプリの構成",
  kicker: "STRUCTURE",
  description: "ディレクトリ、依存関係、設定、動かし方、層、Filter / Interceptor / AOP。",
  accent: "#d46a5c",
  lessons: [
    {
      id: "tree",
      title: "ディレクトリ構成",
      minutes: 8,
      summary: "ファイルの役割を先に把握する。",
      blocks: [
        {
          type: "p",
          text: "例として、架空の社内申請アプリ「申請くん」を使います。Maven + Spring Boot です。申請の一覧・詳細・承認ができる、という想定で、実在しません。プロジェクトごとに名前は違いますが、役割の分け方は似ています。",
        },
        { type: "widget", name: "explorer" },
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
      title: "pom.xml / Gradle",
      minutes: 7,
      summary: "Java の版と、使っているライブラリ。",
      blocks: [
        {
          type: "p",
          text: "ビルドファイルで確認する項目です。",
        },
        {
          type: "ul",
          items: [
            "Java の version（8 / 11 / 17 で起動方法が違う）",
            "spring-boot-starter-web … Web アプリ",
            "thymeleaf / jsp / freemarker … 画面の種類",
            "mybatis / jpa / jdbc … DB アクセスの種類",
            "spring-security … 認証・認可の有無",
            "war パッケージ … 外部 Tomcat に載せる構成",
          ],
        },
        {
          type: "p",
          text: "Spring Boot 2.7 と 3.x では javax と jakarta が違います。参照するサンプルは、対象プロジェクトの版に合わせます。",
        },
      ],
    },
    {
      id: "arch",
      title: "よくある構成",
      minutes: 10,
      summary: "HTTPサーバとサーブレットコンテナの重ね方。手前の LB・CDN・WAF も。",
      blocks: [
        {
          type: "p",
          text: "ブラウザから見た「サーバ」は、箱が重なっていることがあります。Controller の手前に、HTTPサーバとサーブレットコンテナがあります。申請くんのコードは、どの重ね方でも同じです。違うのは外側です。",
        },
        {
          type: "h2",
          text: "役割の違い",
        },
        {
          type: "table",
          headers: ["種類", "例", "すること"],
          rows: [
            ["HTTPサーバ", "Apache、nginx", "手前で受ける。ブラウザとの HTTPS をここで解き、静的ファイル、後ろへの中継"],
            ["サーブレットコンテナ", "Tomcat、Jetty", "Java の画面や API を動かす"],
          ],
        },
        { type: "diagram", name: "arch-roles", caption: "手前の箱は無いこともあります。Java が動く箱は、どれかのサーブレットコンテナです。" },
        {
          type: "callout",
          kind: "trap",
          title: "Apache と Tomcat",
          text: "Apache（httpd）は HTTPサーバ、Tomcat はサーブレットコンテナです。名前に Apache が付きますが、別物です。",
        },
        {
          type: "h2",
          text: "重ね方のパターン",
        },
        {
          type: "p",
          text: "よく見る重ね方は次の3つです。ローカルの申請くんは「内蔵だけ」です。",
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
              text: "アプリを WAR にして、すでに動いている Tomcat や Jetty に載せます。ログは catalina.out など、Tomcat 側の置き場を見ます。",
            },
            {
              title: "手前に Apache / nginx",
              text: "ブラウザはまず Apache か nginx へ送ります。ブラウザとの HTTPS はここで解き、後ろの Tomcat / Jetty へは HTTP で渡すことが多いです（SSL オフロード）。静的ファイルの配信やパスの振り分けもここで行い、動的な処理だけ後ろへ渡します。後ろは内蔵でも外部 WAR でも構いません。",
            },
          ],
        },
        { type: "diagram", name: "arch-patterns", caption: "左から、パターン1 内蔵だけ、パターン2 外部 WAR、パターン3 手前に HTTPサーバ。" },
        {
          type: "h2",
          text: "重ね方で変わる切り分け",
        },
        {
          type: "p",
          text: "上の3パターンのどれかかで、ログの見る場所が変わります。",
        },
        {
          type: "ul",
          items: [
            "静的ファイルの 404 は、手前の HTTPサーバのパス設定のことがある（パターン3）",
            "アプリの例外は、サーブレットコンテナ側のログを見る",
            "コンテキストパスは、手前と後ろの両方に付いていることがある（パターン3）",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "Docker",
          text: "コンテナの中身も、上の3パターンのどれかです。Docker だから別構成ということはありません。",
        },
        {
          type: "callout",
          kind: "note",
          title: "APサーバ",
          text: "古い現場では WebLogic など APサーバに載せることもあります。Java が動く箱が Tomcat ではない、というだけです。",
        },
        {
          type: "h2",
          text: "さらに手前の箱",
        },
        {
          type: "p",
          text: "上のどの重ね方でも、さらに手前に別の箱が置かれることがあります。いずれも Java のコードより手前です。パターン3なら Apache / nginx の外側、パターン1・2なら Tomcat や Spring Boot の手前、という位置づけです。",
        },
        {
          type: "ul",
          items: [
            "ロードバランサ（LB）… 複数台へ振り分け。SSL 終端をここで行うこともある",
            "CDN … 静的ファイルを近い拠点から配る。キャッシュや SSL 終端を担うこともある",
            "WAF … HTTP リクエストを検査し、攻撃らしいパターンを遮断する",
          ],
        },
        {
          type: "p",
          text: "ログの出る場所や、ブロックされたときの応答は環境次第です。切り分けでは「アプリに届いたか」を先に確認します。",
        },
        { type: "quiz", id: "java-arch" },
      ],
    },
    {
      id: "yml",
      title: "application.yml / application.properties",
      minutes: 8,
      summary: "接続先、ポート、プロファイル、コンテキストパス。",
      blocks: [
        {
          type: "p",
          text: "Spring Boot 用の設定ファイルです。yml でも properties でも同じ意味です。申請くんは yml です。",
        },
        {
          type: "code",
          title: "application.yml（抜粋）",
          lang: "yaml",
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
          text: "ローカルでは動き、別環境では落ちる場合、まず設定差を見ます。URL、ユーザ、プロファイル、コンテキストパス、ファイルパス、メールサーバ。",
        },
        {
          type: "ul",
          items: [
            "active プロファイルは起動引数で上書きされることがある",
            "application-dev.yml（または .properties）と prod でログ量が違う。行き先は logging.file や、Spring Boot 用の logback-spring.xml に書いてあることが多い",
            "context-path が違うと CSS が 404 になり、画面だけ崩れる",
            "パスワードは環境変数や別ファイルのことがある",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "接続情報",
          text: "接続文字列には本番相当の情報があることがあります。共有するときはマスクします。",
        },
      ],
    },
    {
      id: "layers",
      title: "Controller / Service / Repository",
      minutes: 9,
      summary: "名前が崩れていても、探す順番は同じ。",
      blocks: [
        {
          type: "p",
          text: "Controller に SQL が書いてある、Service が薄い、層の名前が違うといったことはよくあります。名前より、次の順で探します。",
        },
        { type: "diagram", name: "layers", caption: "探す順番。層の名前が違っても、この縦の線は同じです。" },
        {
          type: "ol",
          items: [
            "URL を受けるメソッド（Spring の @GetMapping など）",
            "それが呼ぶメソッド（業務判断）",
            "DB または外部 API",
            "戻り値を画面または JSON に載せる場所",
          ],
        },
        {
          type: "code",
          title: "Controller が直接 Mapper を呼ぶ例",
          lang: "java",
          code: `@GetMapping("/requests")
public String list(Model model, @AuthenticationPrincipal LoginUser user) {
  model.addAttribute("requests", requestMapper.findMine(user.getId()));
  return "request/list";
}`,
        },
        {
          type: "p",
          text: "JSON を返す Web API でも、探す順番は同じです。違うのは出口です。テンプレート名ではなく、オブジェクトを返します。",
        },
        {
          type: "code",
          title: "RestController（JSON）",
          lang: "java",
          code: `@RestController
@RequestMapping("/api/requests")
public class RequestApiController {
  @GetMapping
  public List<RequestResponse> list(@AuthenticationPrincipal LoginUser user) {
    return requestService.findMine(user.getId());
  }
}`,
        },
        { type: "quiz", id: "java-layer" },
      ],
    },
    {
      id: "view-static",
      title: "テンプレートと静的ファイル",
      minutes: 7,
      summary: "return \"request/list\" が指すファイル。",
      blocks: [
        {
          type: "p",
          text: "Spring MVC + Thymeleaf では、Controller が返す文字列が templates 配下のファイル名になります。request/list なら templates/request/list.html です。",
        },
        { type: "diagram", name: "view-file" },
        {
          type: "ul",
          items: [
            "templates … サーバが組み立てる HTML",
            "static … CSS / JS / 画像。URL が /css/app.css のように直接見える",
            "JSP なら webapp/WEB-INF/views が多い",
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "見た目だけ壊れる",
          text: "画面が白い、スタイルが当たっていない、は Java 例外ではなく静的ファイルのパス違いであることが多いです。Network タブで 404 を探します。",
        },
        {
          type: "p",
          text: "Spring の @RestController や @ResponseBody は、戻り値を JSON にします。templates 配下は探しません。画面用の Controller と API 用が並んでいることがあります。",
        },
      ],
    },
    {
      id: "security-filter",
      title: "Filter / Interceptor / AOP",
      minutes: 11,
      summary: "ソースの呼び出しだけ追うと、通っていない処理がある。",
      blocks: [
        {
          type: "p",
          text: "Controller から Service を追うとき、ソースに書いてあるメソッド呼び出しだけを見ると足りないことがあります。リクエストの前後や、service.approve() の実体の手前に、別クラスが挟まります。呼び出し元のメソッドには、その名前が出ません。",
        },
        { type: "diagram", name: "cross-cut", caption: "Controller や Service のソースに、これらの呼び出しは書かれていません。" },
        {
          type: "table",
          headers: ["種類", "動く位置", "ソースでの見え方"],
          rows: [
            ["Filter", "サーブレットコンテナ。Controller の前（静的ファイルも通ることがある）", "Controller から呼ばれない。Filter 実装や SecurityConfig を別検索する"],
            ["Interceptor", "Spring MVC。Controller メソッドの直前・直後", "HandlerInterceptor と WebMvcConfigurer の addInterceptors。Controller に呼び出しは無い"],
            ["AOP / プロキシ", "Service などのメソッド呼び出しの手前", "見た目は requestService.approve()。実行時は $Proxy や CGLIB を経由する"],
            ["@ControllerAdvice", "例外のあと。戻り値や画面を別クラスが決める", "throw したメソッドの return を追っても、実際の応答はここ"],
          ],
        },
        {
          type: "h2",
          text: "Filter と Spring Security",
        },
        {
          type: "p",
          text: "リクエストは Controller の前にフィルタを通ります。ログイン必須、CSRF、文字コード。ここに原因があると、Controller のブレークポイントは止まりません。Spring Security も、実体は Filter の連鎖です。",
        },
        {
          type: "diagram",
          name: "filters",
          caption: "既定の並びの例。どこで止まるか、何を返すかは設定によって変わります。",
        },
        {
          type: "p",
          text: "Java メソッドに入らないときは、Spring Security の SecurityConfig のパス許可、CSRF、セッション、コンテキストパスを順に確認します。画面の未ログインは 302 でログイン HTML、Web API は 401 で JSON、という違いがよくあります。決まりではありません。",
        },
        {
          type: "code",
          title: "静的ファイルの許可漏れ",
          lang: "java",
          code: `.antMatchers("/login", "/css/**").permitAll()
.anyRequest().authenticated();
// /images を許可し忘れ -> 画像だけ 302 でログインへ
// 申請くんは Spring Boot 2.7。3.x では requestMatchers`,
        },
        {
          type: "h2",
          text: "Interceptor",
        },
        {
          type: "p",
          text: "Spring MVC の HandlerInterceptor は、Controller のメソッドの直前（preHandle）と直後（postHandle / afterCompletion）に動きます。ログ、共通の権限、アクセス記録などで使います。Controller のソースを上から読んでも、呼び出しは出てきません。",
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
          text: "探すときは HandlerInterceptor、addInterceptors、WebMvcConfigurer で検索します。preHandle が false を返すと、Controller に届きません。",
        },
        {
          type: "h2",
          text: "AOP とプロキシ",
        },
        {
          type: "p",
          text: "Service のメソッドを直接呼んでいるように見えても、実行時はプロキシが先に動きます。@Transactional、独自の @Aspect、メソッドの @PreAuthorize がここに載ります。スタックトレースの $Proxy や CGLIB は、この経由です。",
        },
        {
          type: "code",
          title: "Controller に書かれている呼び出し",
          lang: "java",
          code: `requestService.approve(id, userId);
// この1行の手前で、トランザクション開始や @Aspect が動くことがある
// RequestService の1行目にブレークポイントを置いても、その前で弾かれる`,
        },
        {
          type: "callout",
          kind: "trap",
          title: "メソッドの1行目より前",
          text: "Service のブレークポイントが止まらない、または @Transactional のついたメソッドの前後でだけ失敗する、ときはプロキシを疑います。Filter / Interceptor が Controller の前なら、Controller 自体が止まりません。",
        },
        {
          type: "h2",
          text: "例外の出口",
        },
        {
          type: "p",
          text: "@ControllerAdvice や HandlerExceptionResolver は、throw したあとの応答を別クラスが決めます。業務例外を投げたメソッドの return を追っても、画面メッセージや JSON の形はここにあります。",
        },
        {
          type: "ul",
          items: [
            "Controller に届かない → Filter、Interceptor、SecurityConfig",
            "Controller には入るが Service の本体に入らない → プロキシ、AOP、@Transactional、メソッド認可",
            "例外の画面や JSON がメソッドに無い → @ControllerAdvice",
            "検索語: HandlerInterceptor、addInterceptors、OncePerRequestFilter、@Aspect、@ControllerAdvice",
          ],
        },
        { type: "quiz", id: "java-crosscut" },
      ],
    },
  ],
};
