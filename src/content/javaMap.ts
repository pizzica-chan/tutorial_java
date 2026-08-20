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
  description: "ディレクトリ、依存関係、設定、動かし方、層、テンプレート、Filter / Interceptor / AOP。",
  accent: "#d46a5c",
  lessons: [
    {
      id: "tree",
      title: "ディレクトリ構成",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "例として、架空の社内申請アプリ「申請くん」を使います。Maven + Spring Boot です。申請の一覧・詳細・承認ができる、という想定で、実在しません。プロジェクトごとに名前は違いますが、役割の分け方は似ています。",
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
      title: "pom.xml / Gradle",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "Java プロジェクトには、ソースをまとめて動かすための設定ファイルがあります。Maven なら pom.xml、Gradle なら build.gradle（と settings.gradle）です。",
        },
        {
          type: "p",
          text: "どちらも、使うライブラリの一覧と、ビルドの仕方を書いたファイルです。プロジェクトによって Maven か Gradle かは決まっています。申請くんは Maven なので pom.xml があります。",
        },
        {
          type: "p",
          text: "切り分けでは、ファイルを上から通読する必要はありません。どのフレームワークや DB ライブラリを使っているかが分かれば、以降の検索語やログの読み方が決まります。",
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
          text: "Spring Boot 2.7 と 3.x では javax と jakarta が違います。参照するサンプルは、対象プロジェクトの版に合わせましょう。",
        },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "申請くんは Maven です。上の項目が、dependencies では次のとおりです。",
        },
        {
          type: "code",
          title: "pom.xml（抜粋）",
          lang: "xml",
          code: shinseiPomSnippet,
        },
        {
          type: "p",
          text: "Gradle のプロジェクトなら、同じライブラリが build.gradle の dependencies に書かれています。書き方は違いますが、見る目的は同じです。",
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
      id: "arch",
      title: "よくある構成",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "ブラウザから見た「サーバ」は、箱が重なっていることがあります。Controller の手前に、HTTPサーバとサーブレットコンテナがあります。",
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
            "WAF … HTTP リクエストを検査し、攻撃と判定したものを遮断する",
          ],
        },
        {
          type: "p",
          text: "ログの出る場所や、ブロックされたときの応答は環境次第です。切り分けでは「アプリに届いたか」を先に確認しましょう。",
        },
        { type: "quiz", id: "java-arch" },
      ],
    },
    {
      id: "yml",
      title: "application.yml / application.properties",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "Spring Boot 用の設定ファイルです。接続先、ポート、プロファイル、コンテキストパスはここに書きます。yml でも properties でも同じ意味です。申請くんは yml です。",
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
          text: "ローカルでは動き、別環境では落ちる場合、まず設定差を見ましょう。",
        },
        {
          type: "ul",
          items: [
            "URL",
            "ユーザ",
            "プロファイル",
            "コンテキストパス",
            "ファイルパス",
            "メールサーバ",
          ],
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
          text: "接続文字列には本番相当の情報があることがあります。共有するときはマスクしましょう。",
        },
      ],
    },
    {
      id: "layers",
      title: "Controller / Service / Repository",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "画面の URL や API のパスから、処理がどこで動いているかを追うときの型です。まずは層の役割と、開く順番だけを押さえます。",
        },
        {
          type: "h2",
          text: "層の役割とたどり方",
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
          text: "申請くんの承認を例にすると、承認可否の判定、ステータスの更新、メール送信が Service にあります。",
        },
        { type: "diagram", name: "layers", caption: "探す順番。クラス名が違っても、受付 → ビジネスロジック → DB の流れは同じです。" },
        {
          type: "ol",
          items: [
            "URL を受ける Java メソッド（Spring の @GetMapping など）",
            "それが呼ぶ Java メソッド（ビジネスロジック）",
            "DB または外部 API",
          ],
        },
        {
          type: "p",
          text: "ここまでは、Controller → Service → Mapper と分かれている想定です。実際には Service を飛ばして Controller から Mapper を呼ぶなど、並びがずれることがあります。ずれていても、上の順番（受付 → ビジネスロジック → DB）で、今のメソッドから呼ばれている先を開いていけば十分です。",
        },
        {
          type: "code",
          title: "たどる例（Controller → Service、抜粋）",
          lang: "java",
          code: `@GetMapping
public String list(Model model, @AuthenticationPrincipal LoginUser user) {
  model.addAttribute("requests", requestService.findMine(user.getId()));
  return "request/list";
}`,
        },
        {
          type: "p",
          text: "list が URL の受付です。requestService.findMine が次に開く先です。return の意味は、このあと別の話として見ます。",
        },
        {
          type: "code",
          title: "並びがずれる例（Controller → Mapper、抜粋）",
          lang: "java",
          code: `@GetMapping("/requests")
public String list(Model model, @AuthenticationPrincipal LoginUser user) {
  model.addAttribute("requests", requestMapper.findMine(user.getId()));
  return "request/list";
}`,
        },
        {
          type: "p",
          text: "Service を飛ばして Mapper を直呼びしている例です。たどり方は同じで、list から requestMapper.findMine を開きます。",
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
          code: `@Controller
@RequestMapping("/requests")
public class RequestController {
  @GetMapping
  public String list(Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("requests", requestService.findMine(user.getId()));
    return "request/list";
  }
}`,
        },
        {
          type: "ul",
          items: [
            "return \"request/list\" は HTML テンプレートの場所を指す",
            "サーバが templates/request/list.html を組み立て、ブラウザに HTML が届く",
            "表示がおかしいときは templates も見ましょう",
          ],
        },
        {
          type: "code",
          title: "パターン2: オブジェクトを返す（Web API）",
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
        { type: "quiz", id: "java-layer" },
      ],
    },
    {
      id: "view-static",
      title: "テンプレートと静的ファイル",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "申請くんの一覧画面を例に、templates と static の役割を見ます。Controller が返す文字列がテンプレートの場所になり、CSS や JS は多くの場合 static から読み込まれます。",
        },
        {
          type: "h2",
          text: "テンプレート（templates）",
        },
        {
          type: "p",
          text: "Controller は Model にデータを載せ、テンプレート名を return します。中身の th:each や th:if は、次の項目で読みます。",
        },
        {
          type: "code",
          title: "RequestController.java（抜粋）",
          lang: "java",
          code: requestControllerSample,
        },
        { type: "diagram", name: "view-file", caption: "return \"request/list\" が templates/request/list.html を指します。" },
        {
          type: "h2",
          text: "静的ファイル（static）",
        },
        {
          type: "p",
          text: "CSS や JS は Java ではなく src/main/resources/static 配下に置きます。テンプレートの head から読み込みます。",
        },
        {
          type: "code",
          title: "templates から static を読み込む（抜粋）",
          lang: "html",
          code: shinseiLayoutStaticSnippet,
        },
        {
          type: "p",
          text: "th:href=\"@{/css/app.css}\" は、context-path を含めた URL に変換されます。申請くんでは /shinsei/css/app.css のように見えます。",
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
          text: "ブラウザは HTML のあと、CSS と JS を別リクエストで取りに行きます。Java の処理は通りません。",
        },
        {
          type: "p",
          text: "一方で、テンプレートや HTML に直接書いている画面もあります。申請くんは static に分けて置いていますが、見た目や動きを直すときは templates 内も見ましょう。",
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
          text: "画面は出るのにスタイルだけ当たらないときは、Network タブで /shinsei/css/app.css が 404 になっていないかを見ましょう。ファイルの有無と URL のずれが多いです。",
        },
        {
          type: "p",
          text: "@RestController は templates を使いません。JSON を返す Web API は、前の項目のとおり出口が JSON です。",
        },
      ],
    },
    {
      id: "template-read",
      title: "テンプレートの読み方",
      minutes: 11,
      blocks: [
        {
          type: "p",
          text: "サーバが HTML を組み立てるアプリでは、画面の文言・ボタンの有無・送信先の多くがテンプレートに書かれています。Controller や SQL だけ見ても、ボタンが出ない・リンク先が違う、は説明できないことがあります。",
        },
        {
          type: "p",
          text: "申請くんは Thymeleaf です。JSP や FreeMarker など別のテンプレートエンジンでも、Model に載せた名前と HTML 側の参照、form の action、表示条件を突き合わせる、という読み方は同じです。",
        },
        {
          type: "h2",
          text: "ファイルの特定",
        },
        {
          type: "p",
          text: "Controller の return が返す文字列が、templates 配下のパスになります。return \"request/list\" なら templates/request/list.html です。前の項目の図のとおりです。",
        },
        {
          type: "h2",
          text: "Java から渡す書き方",
        },
        {
          type: "p",
          text: "テンプレートが参照する名前は、Controller が Model に載せたキーです。書き方はいくつかありますが、テンプレート側から見ると「\${キー名}」がどこから来たか、を突き合わせれば足ります。",
        },
        {
          type: "table",
          headers: ["Controller の書き方", "テンプレートでの名前", "補足"],
          rows: [
            ["model.addAttribute(\"requests\", list)", "${requests}", "いちばん多い。申請くんはこの形"],
            ["mav.addObject(\"requests\", list) と ModelAndView", "${requests}", "addAttribute と同じ。戻り値が ModelAndView"],
            ["model.put(\"requests\", list) と Map", "${requests}", "引数が Map のとき。Model と同じ役割"],
            ["@ModelAttribute(\"form\") RequestForm form", "${form}", "フォーム表示・送信の両方で使うことがある"],
            ["@ModelAttribute メソッド（Controller 内）", "メソッドが返すキー名", "全画面に共通の値を載せる。各メソッドの前に実行される"],
            ["redirectAttributes.addFlashAttribute(\"msg\", ...)", "${msg}", "リダイレクト後の1回だけ。登録完了メッセージなど"],
          ],
        },
        {
          type: "p",
          text: "値は、リストやオブジェクト1件、文字列など何でも載せられます。テンプレートでは \${requests} のようにキー名で取り出し、オブジェクトなら \${req.title} のようにプロパティを辿ります。",
        },
        {
          type: "code",
          title: "パターン1: Model + addAttribute（申請くん）",
          lang: "java",
          code: `@GetMapping("/requests")
public String list(Model model, @AuthenticationPrincipal LoginUser user) {
  model.addAttribute("requests", requestMapper.findMine(user.getId()));
  return "request/list";
}`,
        },
        {
          type: "code",
          title: "パターン2: ModelAndView",
          lang: "java",
          code: `@GetMapping("/requests")
public ModelAndView list(@AuthenticationPrincipal LoginUser user) {
  ModelAndView mav = new ModelAndView("request/list");
  mav.addObject("requests", requestMapper.findMine(user.getId()));
  return mav;
}`,
        },
        {
          type: "callout",
          kind: "note",
          title: "@ModelAttribute は向きが2つ",
          text: "メソッドの引数に付く @ModelAttribute は、フォームから画面へ値を運ぶときにも使われます。Controller 内の @ModelAttribute メソッドは、別の共通データを毎回 Model に足す書き方です。名前が紛らわしいので、テンプレートでは \${...} のキー名だけを見ましょう。",
        },
        {
          type: "h2",
          text: "よく見る Thymeleaf の印",
        },
        {
          type: "table",
          headers: ["印", "読み方"],
          rows: [
            ["th:each", "リストの繰り返し。\${requests} の1件ずつ"],
            ["th:text", "画面に出す文字。\${req.title} など"],
            ["th:if / th:unless", "条件が true のときだけタグを出す。ボタンが無い原因になりやすい"],
            ["th:action / th:href", "form の送信先、リンク先。@{/requests/{id}/approve} のように URL を組み立てる"],
            ["@{...}", "context-path を含めた URL。/shinsei が付くかはここで決まる"],
            ["th:name / name", "フォームの項目名。Controller の @RequestParam と対応"],
          ],
        },
        {
          type: "p",
          text: "タグの中にある「交通費申請」「申請中」などは、プレビュー用のダミーです。実行時は th:text の \${...} が使われます。",
        },
        {
          type: "code",
          title: "templates/request/list.html（抜粋）",
          lang: "html",
          code: shinseiListTemplateSnippet,
        },
        {
          type: "p",
          text: "サーバが組み立てたあとは、th: 属性は消え、値だけが残ります。status が PENDING の行だけ form が出ます。context-path が /shinsei なら action に付きます。",
        },
        {
          type: "code",
          title: "組み立て後の HTML（ブラウザが受け取る抜粋）",
          lang: "html",
          code: shinseiListRenderedSnippet,
        },
        {
          type: "diagram",
          name: "template-rendered",
          caption: "組み立て後の HTML をブラウザが描画したイメージ。PENDING の行だけ承認ボタンが出る。",
        },
        {
          type: "h2",
          text: "読む順番",
        },
        {
          type: "ol",
          items: [
            "Controller の return から HTML ファイルを開く",
            "Model に載せた名前と、th:each / th:text の \${...} が一致するか見る",
            "ボタンやリンクが無いときは th:if の条件を読む",
            "form の th:action と method が、想定の Controller のマッピングと一致するか見る",
            "POST なのに CSRF エラーなら、hidden の _csrf や th:action の有無を見る",
            "テンプレートと違う HTML がブラウザに出ているなら、別テンプレートか JS の書き換えを疑う（Elements タブで確認）",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ソースと画面の見比べ",
          text: "テンプレートはサーバ側のファイルです。ブラウザの Elements タブは、組み立て後の HTML です。th:if で消えたボタンは、テンプレートにはあっても画面には出ません。切り分けでは、両方を見ましょう。",
        },
        { type: "quiz", id: "java-template" },
      ],
    },
    {
      id: "security-filter",
      title: "Filter / Interceptor / AOP",
      minutes: 11,
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
          text: "リクエストは Controller の前にフィルタを通ります。ここに原因があると、Controller のブレークポイントは止まりません。Spring Security も、実体は Filter の連鎖です。",
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
          text: "探すときは次の語で検索しましょう。",
        },
        {
          type: "ul",
          items: [
            "HandlerInterceptor",
            "addInterceptors",
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
          text: "Service のメソッドを直接呼んでいるように見えても、実行時はプロキシが先に動きます。スタックトレースの $Proxy や CGLIB は、この経由です。",
        },
        {
          type: "ul",
          items: [
            "@Transactional",
            "独自の @Aspect",
            "メソッドの @PreAuthorize",
          ],
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
          text: "Service のブレークポイントが止まらない、または @Transactional のついたメソッドの前後でだけ失敗するときは、プロキシを疑いましょう。Filter / Interceptor が Controller の前なら、Controller 自体が止まりません。",
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
