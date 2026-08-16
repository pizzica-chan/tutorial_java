import type { Track } from "../types";

export const javaMapTrack: Track = {
  id: "java-map",
  no: "02",
  title: "Javaアプリの構成",
  kicker: "STRUCTURE",
  description: "ディレクトリ、依存関係、設定、動かし方、層、Security。",
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
          text: "例として、Maven + Spring Boot の社内申請アプリ「申請くん」を使います。プロジェクトごとに名前は違いますが、役割の分け方は似ています。",
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
      summary: "HTTPサーバとサーブレットコンテナ。重ね方が違う。",
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
          text: "パターン1: 内蔵だけ",
        },
        {
          type: "p",
          text: "Spring Boot を IDE や java -jar で起動すると、同じプロセスの中で Tomcat や Jetty が動きます。別途 Tomcat を入れる必要はありません。申請くんの手元起動はこれです。",
        },
        {
          type: "h2",
          text: "パターン2: 外部に WAR",
        },
        {
          type: "p",
          text: "アプリを WAR にして、すでに動いている Tomcat や Jetty に載せます。ログは catalina.out など、Tomcat 側の置き場を見ます。",
        },
        {
          type: "h2",
          text: "パターン3: 手前に Apache / nginx",
        },
        {
          type: "p",
          text: "ブラウザはまず Apache か nginx へリクエストを送ります。ブラウザとの HTTPS はここで解き、後ろの Tomcat / Jetty へは HTTP で渡すことが多いです。SSL オフロードと呼ばれることもあります。CSS の配信やパスの振り分けもここで行い、動的な処理だけ後ろへ渡します。後ろの Java は、パターン1の内蔵 Tomcat でも、パターン2の外部 WAR でも構いません。",
        },
        { type: "diagram", name: "arch-patterns", caption: "左から、内蔵だけ、外部 WAR、手前に HTTPサーバ。" },
        {
          type: "ul",
          items: [
            "静的ファイルの 404 は、手前の HTTPサーバのパス設定のことがある",
            "アプリの例外は、サーブレットコンテナ側のログを見る",
            "コンテキストパスは、手前と後ろの両方に付いていることがある",
            "Docker の中身も、このどれかです。コンテナだから別構成、ではありません",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "APサーバ",
          text: "古い現場では WebLogic など APサーバに載せることもあります。Java が動く箱が Tomcat ではない、というだけです。",
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
          text: "Controller に SQL が書いてある、Service が薄い、層の名前が違う、はよくあります。名前より、次の順で探します。",
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
public String list(Model model) {
  model.addAttribute("requests", requestMapper.findMine(userId()));
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
  public List<RequestResponse> list() {
    return requestService.findMine(userId());
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
          text: "画面が白い、スタイルが当たっていない、は Java 例外ではなく静的ファイルのパス違いであることが多いです。Network で 404 を探します。",
        },
        {
          type: "p",
          text: "Spring の @RestController や @ResponseBody は、戻り値を JSON にします。templates 配下は探しません。画面用の Controller と API 用が並んでいることがあります。",
        },
      ],
    },
    {
      id: "security-filter",
      title: "Filter と Security",
      minutes: 8,
      summary: "Controller に届く前に弾かれる。",
      blocks: [
        {
          type: "p",
          text: "リクエストは Controller の前にフィルタを通ります。ログイン必須、CSRF、文字コード。ここに原因があると、Controller のブレークポイントは止まりません。",
        },
        { type: "diagram", name: "filters" },
        {
          type: "p",
          text: "メソッドに入らないときは、Spring Security の SecurityConfig のパス許可、CSRF、セッション、コンテキストパスを順に確認します。画面の未ログインは 302 でログイン HTML、Web API は 401 で JSON、という違いがよくあります。決まりではありません。",
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
      ],
    },
  ],
};
