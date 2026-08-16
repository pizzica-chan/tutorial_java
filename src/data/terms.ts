export type TermDef = {
  term: string;
  aliases: string[];
  body: string;
};

export const terms: TermDef[] = [
  {
    term: "申請くん",
    aliases: ["申請くん"],
    body: "この教材の架空の社内申請アプリ。社員が申請を出し、承認者が承認する、という想定です。Spring Boot、Thymeleaf、MyBatis、MySQL、Spring Security。実在しません。",
  },
  {
    term: "HTTP",
    aliases: ["HTTP"],
    body: "ブラウザとサーバがデータをやり取りする約束事。1回の会話はリクエストとレスポンスで完結します。",
  },
  {
    term: "HTTPS",
    aliases: ["HTTPS"],
    body: "HTTP を暗号化したもの。通信の途中で中身を読まれにくくします。アドレスは https:// で始まります。",
  },
  {
    term: "GET / POST",
    aliases: ["GET", "POST"],
    body: "HTTP メソッドの代表例。GET は取得、POST は登録や状態を変える操作に使われることが多いです。PUT / PATCH / DELETE も API でよく使います。約束と実装がずれることもあるので、Network タブで確認します。",
  },
  {
    term: "ステータスコード",
    aliases: ["ステータスコード", "ステータス番号", "2xx", "3xx", "4xx", "5xx"],
    body: "応答の結果を表す 3 桁の番号。2xx は成功、3xx は別 URL へ、4xx はクライアント側、5xx はサーバ側の問題です。",
  },
  {
    term: "404",
    aliases: ["404"],
    body: "Not Found。その URL に対応する処理やファイルが無い、という応答です。",
  },
  {
    term: "401 / 403",
    aliases: ["401", "403"],
    body: "番号の読み方として、401 は未ログイン、403 は権限が無い。画面にそう出ても、実際の番号や遷移はアプリによって違います。Network タブで確認します。",
  },
  {
    term: "400",
    aliases: ["400"],
    body: "Bad Request。送り方やパラメータが不正、という応答です。",
  },
  {
    term: "500",
    aliases: ["500"],
    body: "Internal Server Error。サーバ側で例外が起きた、という応答です。",
  },
  {
    term: "302",
    aliases: ["302", "303"],
    body: "リダイレクト。別の URL へ誘導する応答です。ログイン画面へ飛ばすときや、POST 後の画面遷移でよく使います。",
  },
  {
    term: "200",
    aliases: ["200"],
    body: "OK。サーバは応答を返せた、という意味です。中身が業務的に正しいかは別です。",
  },
  {
    term: "ヘッダ",
    aliases: ["レスポンスヘッダ", "リクエストヘッダ", "ヘッダ"],
    body: "HTTP の本文の前に付く付加情報。Content-Type、Cookie、Location などがあります。",
  },
  {
    term: "Cookie",
    aliases: ["Set-Cookie", "Cookie"],
    body: "サーバがブラウザに預ける小さなデータ。ログイン状態の識別子（セッションID）を載せるのに使います。",
  },
  {
    term: "セッション",
    aliases: ["セッションタイムアウト", "セッションID", "JSESSIONID", "セッション"],
    body: "サーバ側に置く「この人の状態」。ブラウザはCookieでIDだけ持ち、サーバがそのIDでログインユーザなどを思い出します。",
  },
  {
    term: "リダイレクト",
    aliases: ["リダイレクト"],
    body: "サーバが「別のURLを開き直して」と返すこと。302 と Location ヘッダの組み合わせが典型です。",
  },
  {
    term: "コンテキストパス",
    aliases: ["コンテキストパス", "context-path"],
    body: "アプリの根っこのURL。例: /shinsei。Controllerのパスの手前に付きます。Spring Boot では server.servlet.context-path に書きます。",
  },
  {
    term: "クエリ",
    aliases: ["クエリパラメータ", "クエリ"],
    body: "URLの ? 以降。同じ資源の見え方や検索条件を渡すのに使います。",
  },
  {
    term: "CSRF",
    aliases: ["CSRFトークン", "CSRF"],
    body: "Cross-Site Request Forgery。ログイン中の利用者に、別サイトから意図しない POST をさせる攻撃。トークンで防ぎます。",
  },
  {
    term: "Controller",
    aliases: ["Controller"],
    body: "URL と HTTP メソッドを受けて、次の処理へ渡す層。画面処理を追うときの起点です。Spring ではこの名前が多いです。",
  },
  {
    term: "処理の入口",
    aliases: ["処理の入口"],
    body: "調べたい画面や機能で、サーバ側の処理が始まる場所。多くは URL に対応する Controller の Java メソッドです。申請くんでは RequestController.java の @GetMapping などが該当します。",
  },
  {
    term: "RestController",
    aliases: ["@RestController", "RestController"],
    body: "Controller の一種。戻り値を HTML ではなく JSON にします。templates は使いません。Spring のアノテーションです。",
  },
  {
    term: "@ResponseBody",
    aliases: ["@ResponseBody", "ResponseBody"],
    body: "戻り値をテンプレート名ではなく、JSON などの本文にする印です。@RestController はクラス全体にこれを付けたもの、と考えてよいです。Spring のアノテーションです。",
  },
  {
    term: "Service",
    aliases: ["Service"],
    body: "業務ルールを置く層。権限チェックや更新、他サービス呼び出しが集まりやすいです。Spring ではこの名前が多いです。",
  },
  {
    term: "Repository",
    aliases: ["Repository"],
    body: "DB アクセスを担当する層。テーブルの読み書きをここに寄せます。Spring Data JPA ではこの名前が多いです。申請くんは MyBatis の Mapper です。",
  },
  {
    term: "Mapper",
    aliases: ["Mapper"],
    body: "MyBatis などで、Java のメソッドと SQL を対応づける部品です。",
  },
  {
    term: "Entity",
    aliases: ["Entity"],
    body: "テーブルの1行に相当するJavaのオブジェクトです。",
  },
  {
    term: "Spring Boot",
    aliases: ["Spring Boot"],
    body: "JavaのWebアプリを作るための土台。設定や内蔵サーバがまとまっています。",
  },
  {
    term: "Spring MVC",
    aliases: ["Spring MVC"],
    body: "URLとControllerを結びつける、SpringのWebの仕組みです。",
  },
  {
    term: "Spring Security",
    aliases: ["Spring Security", "SecurityConfig"],
    body: "ログイン、権限、CSRFなどを担う、Spring のライブラリです。",
  },
  {
    term: "Thymeleaf",
    aliases: ["Thymeleaf"],
    body: "サーバ側でHTMLを組み立てるテンプレートエンジンです。Spring でよく使います。",
  },
  {
    term: "JSP",
    aliases: ["JSP"],
    body: "JavaServer Pages。サーバ側でHTMLを組み立てる、古くからある方式です。",
  },
  {
    term: "SQL",
    aliases: ["SQL"],
    body: "データベースに問い合わせる言語。SELECT や UPDATE など。",
  },
  {
    term: "MyBatis",
    aliases: ["MyBatis"],
    body: "SQLをXMLやアノテーションで書き、Javaから実行するライブラリです。",
  },
  {
    term: "JPA",
    aliases: ["JPA", "JPQL"],
    body: "Java Persistence API。オブジェクトとテーブルを対応づけてDBアクセスします。",
  },
  {
    term: "JDBC",
    aliases: ["JDBC"],
    body: "JavaからDBへ接続するための標準APIです。",
  },
  {
    term: "Maven",
    aliases: ["Maven", "pom.xml"],
    body: "Javaのビルドとライブラリ管理の仕組み。pom.xml に依存関係を書きます。",
  },
  {
    term: "Gradle",
    aliases: ["Gradle"],
    body: "Javaのビルドとライブラリ管理の仕組みのひとつです。",
  },
  {
    term: "application.yml",
    aliases: [
      "application.yml",
      "application.yaml",
      "application.properties",
      "application-dev.yml",
      "application-*.yml",
      "application-dev.properties",
      "application-*.properties",
    ],
    body: "接続先、ポート、ログ、プロファイルなど、起動時の設定ファイルです。Spring Boot 用です。yml でも properties でも同じ意味です。",
  },
  {
    term: "プロファイル",
    aliases: ["プロファイル"],
    body: "dev / stg / prod など、設定の切り替え単位。今どれで起動しているかで接続先が変わります。Spring Boot では application-dev.yml や application-dev.properties のように使います。",
  },
  {
    term: "スタックトレース",
    aliases: ["スタックトレース"],
    body: "例外が起きたときの呼び出し履歴。右端の (File.java:行番号) がソースの位置です。org.springframework や java. は飛ばして、自分たちが書いたコードのパッケージ名の行を上から探します。",
  },
  {
    term: "自作クラス",
    aliases: ["自作クラス", "自作パッケージ"],
    body: "このプロジェクトで書いたコード。at 行のパッケージが、自分たちが書いたコードのもの（申請くんなら jp.co.example.shinsei）で始まる行です。",
  },
  {
    term: "NullPointerException",
    aliases: ["NullPointerException", "NPE"],
    body: "null のオブジェクトに対してメソッドを呼んだときに出る例外です。",
  },
  {
    term: "SQLException",
    aliases: ["SQLException", "BadSqlGrammarException", "SQLSyntaxErrorException"],
    body: "SQLの失敗や、DB接続の失敗で出る例外です。",
  },
  {
    term: "例外",
    aliases: ["例外"],
    body: "プログラムが通常どおり進めなくなったときに投げられるエラーオブジェクトです。",
  },
  {
    term: "N+1",
    aliases: ["N+1"],
    body: "一覧の件数だけ追加のSQLが飛ぶパターン。画面は動くが遅くなります。",
  },
  {
    term: "Filter",
    aliases: ["フィルタ", "フィルター", "Filter"],
    body: "Controller の手前で全リクエストを通す処理。ログイン確認や CSRF 検査がここにあります。Spring Security も、実体は Filter の連鎖です。Controller のソースからは呼ばれません。",
  },
  {
    term: "Interceptor",
    aliases: ["Interceptor", "HandlerInterceptor", "addInterceptors"],
    body: "Spring MVC で、Controller メソッドの直前・直後に動く処理。preHandle / postHandle。WebMvcConfigurer の addInterceptors で登録します。Controller のソースに呼び出しは出ません。",
  },
  {
    term: "AOP",
    aliases: ["AOP", "@Aspect", "アスペクト"],
    body: "メソッド呼び出しの手前やあとに、別処理を挟む仕組み。トランザクションや独自ログがここに載ります。ソース上は service.approve() に見えて、実行時はプロキシが先に動きます。",
  },
  {
    term: "@Transactional",
    aliases: ["@Transactional", "Transactional"],
    body: "そのメソッドをトランザクションで囲む印です。Spring の AOP プロキシが先に動くので、メソッド本体の1行目より前に処理があります。",
  },
  {
    term: "@ControllerAdvice",
    aliases: ["@ControllerAdvice", "ControllerAdvice"],
    body: "複数の Controller の例外や共通処理をまとめる印です。throw したメソッドの return ではなく、こちらが画面や JSON を決めることがあります。",
  },
  {
    term: "@Controller",
    aliases: ["@Controller"],
    body: "このクラスが画面用の Controller だと Spring に伝える印です。戻り値はテンプレート名として解釈されます。Spring のアノテーションです。",
  },
  {
    term: "@Service",
    aliases: ["@Service"],
    body: "このクラスが Service 層だと Spring に伝える印です。業務ルールを置く層としてコンテナに登録されます。Spring のアノテーションです。",
  },
  {
    term: "@Async",
    aliases: ["@Async"],
    body: "別スレッドで非同期実行する印です。ログの続きが別のスレッド名になることがあります。Spring のアノテーションです。",
  },
  {
    term: "@PreAuthorize",
    aliases: ["@PreAuthorize"],
    body: "メソッドやクラスに必要な権限を書く印です。Spring Security のアノテーションです。実行時は AOP プロキシが先に判定します。",
  },
  {
    term: "@SpringBootApplication",
    aliases: ["@SpringBootApplication"],
    body: "Spring Boot アプリの起動の入口クラスに付ける印です。コンポーネントスキャンと自動設定がまとめて有効になります。",
  },
  {
    term: "@RequiredArgsConstructor",
    aliases: ["@RequiredArgsConstructor"],
    body: "final フィールドだけを引数に取るコンストラクタを自動生成する印です。Lombok のアノテーションです。",
  },
  {
    term: "@Bean",
    aliases: ["@Bean"],
    body: "メソッドの戻り値を Spring のコンテナに登録する印です。SecurityConfig の filterChain などで使います。Spring のアノテーションです。",
  },
  {
    term: "アノテーション",
    aliases: ["アノテーション"],
    body: "クラスやメソッドに付ける印。SpringではURLの対応づけなどに使います。",
  },
  {
    term: "@GetMapping",
    aliases: ["@GetMapping"],
    body: "指定した URL への GET を、この Java メソッドが受け取るという印です。画面を開く、一覧を表示するといった取得処理で使います。Spring のアノテーションです。",
  },
  {
    term: "@PostMapping",
    aliases: ["@PostMapping"],
    body: "指定した URL への POST を、この Java メソッドが受け取るという印です。登録・更新・承認など、状態を変える操作で使います。Spring のアノテーションです。",
  },
  {
    term: "@RequestMapping",
    aliases: ["@RequestMapping"],
    body: "クラスや Java メソッドに付ける URL の土台。クラスに /requests と書くと、配下のメソッドのパスと合成されます。Spring のアノテーションです。",
  },
  {
    term: "@RequestParam",
    aliases: ["@RequestParam"],
    body: "URLのクエリやフォームの name を、メソッド引数に取り出す印です。Spring のアノテーションです。",
  },
  {
    term: "マッピング",
    aliases: ["URLマッピング", "マッピング"],
    body: "どの URL と HTTP メソッド（GET など）を、どの Java メソッドが処理するかの対応づけです。Spring では @GetMapping などで書きます。",
  },
  {
    term: "バリデーション",
    aliases: ["バリデーション"],
    body: "入力値が規則どおりかの検査。不足や形式不正は 400 になりやすいです。",
  },
  {
    term: "トランザクション",
    aliases: ["トランザクション"],
    body: "DB更新をまとめて確定（または取り消す）単位。途中で失敗したら元に戻します。",
  },
  {
    term: "コミット",
    aliases: ["コミット"],
    body: "トランザクションの確定。これが無いと更新が DB に残りません。",
  },
  {
    term: "永続化",
    aliases: ["永続化"],
    body: "メモリ上の値を、DB やファイルへ残すことです。画面を閉じても残るデータの書き込みがこれです。",
  },
  {
    term: "バインド",
    aliases: ["バインド値", "バインド"],
    body: "画面の入力やSQLの ? に、実際の値をはめ込むことです。",
  },
  {
    term: "論理削除",
    aliases: ["論理削除"],
    body: "行を物理的に消さず、削除フラグで「無いもの」として扱う方式です。",
  },
  {
    term: "DDL",
    aliases: ["DDL"],
    body: "テーブル定義を変えるSQL（CREATE / ALTER など）。コードとDB定義がずれる原因になります。",
  },
  {
    term: "インデックス",
    aliases: ["インデックス"],
    body: "検索を速くするためのDBの索引。無いと全件スキャンになりやすいです。",
  },
  {
    term: "接続プール",
    aliases: ["接続プール"],
    body: "DB接続を使い回す仕組み。枯渇すると待ちやタイムアウトが起きます。",
  },
  {
    term: "リバースプロキシ",
    aliases: ["リバースプロキシ"],
    body: "利用者の手前で受け、後ろのアプリへ中継するサーバ。ブラウザとの HTTPS をここで解き、パスの振り分けもここで決まることが多いです。",
  },
  {
    term: "ロードバランサ",
    aliases: ["ロードバランサ", "LB"],
    body: "複数サーバへリクエストを振り分ける装置。ログが別インスタンスに出ることがあります。",
  },
  {
    term: "CDN",
    aliases: ["CDN"],
    body: "Content Delivery Network。静的ファイルをキャッシュして近くから配る仕組み。SSL 終端やキャッシュの都合で、ブラウザが当たる先がアプリ本体とずれることがあります。",
  },
  {
    term: "WAF",
    aliases: ["WAF"],
    body: "Web Application Firewall。HTTP リクエストを検査し、攻撃らしいパターンを遮断する装置。ブロックされたリクエストはアプリまで届かないことが多いです。",
  },
  {
    term: "ファイアウォール",
    aliases: ["ファイアウォール", "FW"],
    body: "通信の許可・拒否を制御する壁。接続タイムアウトの原因になることがあります。",
  },
  {
    term: "DNS",
    aliases: ["DNS"],
    body: "名前（ホスト名）を IP アドレスに変換する仕組みです。",
  },
  {
    term: "名前解決",
    aliases: ["名前解決"],
    body: "ホスト名を IP アドレスに変換すること。多くの環境では DNS が担当します。名前解決に失敗すると、ping や curl の前段で止まります。",
  },
  {
    term: "TCP/IP",
    aliases: ["TCP/IP", "TCP"],
    body: "インターネットでデータを届ける約束の組み合わせ。IP がホストまで、TCP がポートまで届ける役割を持ちます。HTTP はその上で動きます。",
  },
  {
    term: "ping",
    aliases: ["ping"],
    body: "ICMP で相手ホストが応答するかを見るコマンド。名前解決やホスト到達の手がかりになります。ping が通らなくても HTTP は通ることもあります。",
  },
  {
    term: "traceroute",
    aliases: ["traceroute", "tracert", "tracepath"],
    body: "パケットが途中のどの機器を通るかを見るコマンド。どこで止まったかの手がかりになります。",
  },
  {
    term: "curl",
    aliases: ["curl"],
    body: "コマンドから HTTP リクエストを送るツール。ステータスとヘッダを確認できます。Windows 10 以降にも入っていることが多いです。",
  },
  {
    term: "access.log",
    aliases: ["access.log", "access_log", "アクセスログ"],
    body: "HTTPサーバが受けたリクエストの記録。URL、ステータス、時刻が並びます。静的ファイルの 404 もここに残ることが多いです。",
  },
  {
    term: "error.log",
    aliases: ["error.log", "error_log", "エラーログ"],
    body: "HTTPサーバ側のエラー記録。設定ミス、後ろのアプリへの接続失敗、SSL の問題など。",
  },
  {
    term: "ブレークポイント",
    aliases: ["ブレークポイント"],
    body: "デバッガで実行を止める印。そこに処理が来なければ、手前で弾かれています。",
  },
  {
    term: "静的ファイル",
    aliases: ["静的ファイル"],
    body: "CSS / JS / 画像など、サーバが組み立てないファイルです。",
  },
  {
    term: "テンプレート",
    aliases: ["テンプレート"],
    body: "HTMLの雛形。サーバがデータを流し込んで画面を作ります。",
  },
  {
    term: "JSON",
    aliases: ["JSON"],
    body: "データを文字列で表す形式。Web API の応答でよく使います。画面の HTML ではありません。",
  },
  {
    term: "Web API",
    aliases: ["Web API", "WebAPI"],
    body: "画面ではなくデータを返す HTTP の窓口。本文は JSON が多いです。",
  },
  {
    term: "Content-Type",
    aliases: ["Content-Type"],
    body: "本文の種類を示すヘッダ。text/html は画面、application/json は API のデータです。",
  },
  {
    term: "Ajax",
    aliases: ["XMLHttpRequest", "Ajax", "fetch", "XHR"],
    body: "画面を丸ごと遷移せず、裏でHTTP通信する方式です。応答は JSON が多いです。",
  },
  {
    term: "PRG",
    aliases: ["PRG"],
    body: "Post/Redirect/Get。POSTのあとリダイレクトし、再読込で二重送信しにくくする型です。",
  },
  {
    term: "WAR",
    aliases: ["war", "WAR"],
    body: "Java Web アプリの配布形式。外部の Tomcat などに載せるときに使います。",
  },
  {
    term: "HTTPサーバ",
    aliases: ["HTTPサーバ"],
    body: "ブラウザの手前でリクエストを受ける箱。Apache や nginx。静的ファイルの配信や後ろへの中継を担うことが多く、access.log と error.log を持ちます。",
  },
  {
    term: "Apache",
    aliases: ["Apache", "httpd"],
    body: "HTTPサーバのひとつです。Tomcat とは別物です。",
  },
  {
    term: "nginx",
    aliases: ["nginx", "Nginx"],
    body: "HTTPサーバのひとつです。リバースプロキシや静的ファイルの配信でよく使います。",
  },
  {
    term: "サーブレットコンテナ",
    aliases: ["サーブレットコンテナ"],
    body: "Java の画面や API を動かす実行基盤です。Tomcat や Jetty。Controller が動く場所です。",
  },
  {
    term: "Tomcat",
    aliases: ["Tomcat"],
    body: "JavaのWebアプリを動かすサーバ（サーブレットコンテナ）です。",
  },
  {
    term: "Jetty",
    aliases: ["Jetty"],
    body: "サーブレットコンテナのひとつです。Spring Boot の内蔵サーバとして使うこともあります。",
  },
  {
    term: "内蔵サーバ",
    aliases: ["内蔵サーバ", "内蔵 Tomcat", "embedded"],
    body: "Spring Boot が jar の中で起動する Tomcat や Jetty です。別プロセスの Tomcat は不要です。",
  },
  {
    term: "catalina.out",
    aliases: ["catalina.out"],
    body: "Tomcat の標準出力を書き出すログファイルです。外部 Tomcat に載せているとき、アプリのログがここに出ることがあります。",
  },
  {
    term: "JDK",
    aliases: ["JDK"],
    body: "Javaの開発・実行環境。版が違うと起動できないことがあります。",
  },
  {
    term: "APサーバ",
    aliases: ["APサーバ"],
    body: "アプリケーションサーバ。アプリを動かす実行基盤です。",
  },
  {
    term: "logback",
    aliases: ["logback", "logback-spring.xml", "logback.xml"],
    body: "Javaでよく使うログ出力のライブラリです。行き先は logback-spring.xml や logback.xml に書くことが多いです。logback-spring.xml は Spring Boot 用です。",
  },
  {
    term: "MDC",
    aliases: ["MDC"],
    body: "ログの各行に userId やセッション ID を載せる仕組み。アプリがセットし、パターンに %X があるときだけ出ます。",
  },
  {
    term: "スレッド",
    aliases: ["スレッド名", "スレッド"],
    body: "同時に動く処理の単位。Tomcat ならログの [nio-8080-exec-3] が名前です。同じリクエストの行を揃える手がかりですが、使い回されます。",
  },
  {
    term: "ThreadLocal",
    aliases: ["ThreadLocal"],
    body: "スレッドごとに値を持つ入れ物。フィルタでセットし、後段で読む使い方があります。",
  },
  {
    term: "Optional",
    aliases: ["Optional"],
    body: "値が無いかもしれないことを表す入れ物。中身が空なら get で例外になります。",
  },
  {
    term: "Struts",
    aliases: ["Struts"],
    body: "Spring以前からあるJavaのWebフレームワークです。",
  },
  {
    term: "SameSite",
    aliases: ["SameSite"],
    body: "Cookieをどのサイト経由のリクエストに付けるかの制限。緩いとCSRF、厳しいとログイン切れの原因になります。",
  },
  {
    term: "Find Usages",
    aliases: ["Find Usages"],
    body: "IDEの機能。そのメソッドや型がどこから呼ばれているかを一覧します。",
  },
  {
    term: "Networkタブ",
    aliases: ["Network タブ", "Networkタブ", "Network"],
    body: "ブラウザ開発者ツールの画面。実際に飛んだHTTPリクエストを見られます。",
  },
  {
    term: "ホスト",
    aliases: ["ホスト名", "ホスト"],
    body: "URLのサーバ名の部分。どの機械（またはその手前）に届くかを表します。",
  },
  {
    term: "タイムアウト",
    aliases: ["タイムアウト"],
    body: "制限時間内に終わらず打ち切られること。接続待ちやセッション切れで起きます。",
  },
  {
    term: "ロック",
    aliases: ["行ロック", "ロック"],
    body: "同時更新を防ぐため、DBが行や表を一時的に専有すること。待ちの原因になります。",
  },
  {
    term: "モック",
    aliases: ["モック"],
    body: "外部サービスなどの代わりに用意する偽物。ローカルではメール送信しない、など。",
  },
  {
    term: "環境変数",
    aliases: ["環境変数"],
    body: "OSや起動元が渡す設定値。パスワードをファイルに書かないときに使います。",
  },
  {
    term: "javax / jakarta",
    aliases: ["jakarta", "javax"],
    body: "Javaの標準APIのパッケージ名。Spring Boot 2系は javax、3系は jakarta です。",
  },
  {
    term: "URL",
    aliases: ["URL"],
    body: "資源の住所。ホスト、パス、クエリなどが並びます。",
  },
  {
    term: "リクエスト",
    aliases: ["リクエスト"],
    body: "ブラウザや API クライアントからサーバへ送る要求です。",
  },
  {
    term: "レスポンス",
    aliases: ["レスポンス"],
    body: "サーバから返る応答。ステータス、ヘッダ、本文がセットです。",
  },
  {
    term: "ブラウザ",
    aliases: ["ブラウザ"],
    body: "利用者が画面を見るソフト。Chrome など。開発者ツールの Network タブもここにあります。",
  },
  {
    term: "サーバ",
    aliases: ["サーバ"],
    body: "リクエストを受けて処理し、レスポンスを返す側です。",
  },
  {
    term: "フロントエンド",
    aliases: ["フロントエンド"],
    body: "ブラウザ側。画面を出し、操作を受けてリクエストを送ります。HTML / CSS / JS がここにあります。",
  },
  {
    term: "バックエンド",
    aliases: ["バックエンド"],
    body: "サーバ側。リクエストを受け、業務と DB を扱い、HTML や JSON を返します。Java の Controller 以降がここにあります。",
  },
  {
    term: "HTML",
    aliases: ["HTML"],
    body: "画面の骨組み。ブラウザがこれを描画します。",
  },
  {
    term: "CSS",
    aliases: ["CSS"],
    body: "見た目の指定。当たっていないときは、処理が無いのではなくファイルの 404 が多いです。",
  },
  {
    term: "JavaScript",
    aliases: ["JavaScript", "JS"],
    body: "ブラウザ上で動くプログラム。fetch で Web API を呼ぶのもこれです。",
  },
  {
    term: "DB",
    aliases: ["データベース", "DB"],
    body: "データを保存する置き場。MySQL など。一覧の件数や更新結果はここにあります。",
  },
  {
    term: "MySQL",
    aliases: ["MySQL"],
    body: "よく使われるリレーショナルデータベースの一種です。",
  },
  {
    term: "テーブル",
    aliases: ["テーブル"],
    body: "DBの表。行が1件のデータ、列が項目です。",
  },
  {
    term: "カラム",
    aliases: ["カラム", "列名"],
    body: "テーブルの項目。コードの列名と DB の定義がずれると SQL エラーになります。",
  },
  {
    term: "XML",
    aliases: ["XML"],
    body: "タグで構造を書く文書。MyBatis の SQL や古い設定ファイルで使います。",
  },
  {
    term: "Hibernate",
    aliases: ["Hibernate"],
    body: "JPA の実装としてよく使われる、オブジェクトとテーブルを対応づけるライブラリです。",
  },
  {
    term: "FreeMarker",
    aliases: ["FreeMarker", "freemarker"],
    body: "サーバ側で HTML を組み立てるテンプレートエンジンのひとつです。",
  },
  {
    term: "PUT / PATCH / DELETE",
    aliases: ["PUT", "PATCH", "DELETE"],
    body: "HTTP メソッド。PUT は置き換え、PATCH は一部更新、DELETE は削除、と読むことが多いです。POST にまとめている実装もあります。",
  },
  {
    term: "Location",
    aliases: ["Location"],
    body: "リダイレクト先を示すレスポンスヘッダです。意図しない /login なら認証を疑います。",
  },
  {
    term: "Referer",
    aliases: ["Referer"],
    body: "どの画面から来たかを示すリクエストヘッダです。綴りは Referer が正しい名前です。",
  },
  {
    term: "Secure",
    aliases: ["Secure"],
    body: "Cookie の属性。HTTPS のときだけブラウザが付けます。http で見るとログインが切れて見えることがあります。",
  },
  {
    term: "ドメイン",
    aliases: ["ドメイン"],
    body: "example.co.jp のようなサイトの範囲。Cookie の届く先もここで決まります。",
  },
  {
    term: "ポート",
    aliases: ["ポート"],
    body: "同じマシンでサービスを区別する番号。例: 8080。設定と実際が違うとつながりません。",
  },
  {
    term: "フォーム",
    aliases: ["フォーム", "form"],
    body: "画面で値を書いて送る部分です。入力欄と送信ボタンがセットになっています。どこへ送るか、GET か POST かも、ここに書いてあります。",
  },
  {
    term: "hidden",
    aliases: ["hidden"],
    body: "画面には出さない入力欄。ID や CSRF トークンを載せるのに使います。",
  },
  {
    term: "th:action",
    aliases: ["th:action", "th:href", "th:if", "c:if"],
    body: "Thymeleaf などの印。送信先、リンク先、表示条件をテンプレート側に書きます。",
  },
  {
    term: "name属性",
    aliases: ["name 属性", "name属性"],
    body: "フォーム項目の名前。サーバの @RequestParam と対応づきます。名前が違うと null やバインドエラーになりやすいです。required = false なら必須ではありません。@RequestParam は Spring のアノテーションです。",
  },
  {
    term: "@PathVariable",
    aliases: ["@PathVariable"],
    body: "URL の /requests/12 の 12 のように、パスの一部を引数に取る印です。Spring のアノテーションです。",
  },
  {
    term: "@Query",
    aliases: ["@Query"],
    body: "JPA で SQL や JPQL をメソッドに直接書く印です。Spring Data JPA のアノテーションです。",
  },
  {
    term: "ModelAndView",
    aliases: ["ModelAndView"],
    body: "画面名と Model の中身をまとめて返す型です。addObject で載せた名前が、テンプレートの ${...} になります。Spring MVC のものです。",
  },
  {
    term: "Model",
    aliases: ["Model", "addAttribute"],
    body: "画面へ渡すデータの入れ物。ここに載せた名前がテンプレートから参照されます。Spring MVC のものです。",
  },
  {
    term: "@AuthenticationPrincipal",
    aliases: ["@AuthenticationPrincipal"],
    body: "今ログインしているユーザを、メソッド引数として受け取る印です。Spring Security のアノテーションです。",
  },
  {
    term: "パッケージ",
    aliases: ["パッケージ"],
    body: "クラスの住所。jp.co.example.shinsei のようにドットで区切り、フォルダと対応します。",
  },
  {
    term: "クラス",
    aliases: ["クラス"],
    body: "データと処理をまとめた設計図。RequestService などがクラスです。",
  },
  {
    term: "メソッド",
    aliases: ["メソッド"],
    body: "HTTP の GET / POST / PUT などと Java の処理のまとまりのどちらも「メソッド」と呼ばれます。まず前後の文脈でどちらの話かを見分けます。Network タブや URL なら HTTP メソッド、list() やクラス名なら Java メソッドです。",
  },
  {
    term: "オブジェクト",
    aliases: ["オブジェクト"],
    body: "クラスをもとに実体化した値。null だと、その実体が無い状態です。",
  },
  {
    term: "引数",
    aliases: ["引数"],
    body: "メソッドに渡す値です。誰が渡しているかを見ると、呼び出し元が分かります。",
  },
  {
    term: "戻り値",
    aliases: ["戻り値"],
    body: "メソッドが返す値。画面のテンプレート名や、JSON の中身になります。",
  },
  {
    term: "null",
    aliases: ["null"],
    body: "値が無いこと。ここにメソッドを呼ぶと NullPointerException になります。",
  },
  {
    term: "Caused by",
    aliases: ["Caused by"],
    body: "例外が別の例外を包んでいる印。いちばん下の原因を優先して読みます。",
  },
  {
    term: "Unknown Source",
    aliases: ["Unknown Source"],
    body: "スタックのその行に、対応するソースが無い、という印です。飛ばします。",
  },
  {
    term: "groupId",
    aliases: ["groupId"],
    body: "Maven で組織を表す識別子。パッケージ名の先頭（申請くんなら jp.co.example）と揃えることが多いです。",
  },
  {
    term: "artifactId",
    aliases: ["artifactId"],
    body: "Maven で、その部品の名前です。",
  },
  {
    term: "$Proxy / CGLIB",
    aliases: ["$Proxy", "CGLIB", "generated"],
    body: "フレームワークが実行時に作るクラス。自作コードではないので、隣の会社パッケージへ戻ります。Spring ではよく見ます。",
  },
  {
    term: "org.springframework",
    aliases: ["org.springframework"],
    body: "Spring のライブラリのパッケージです。スタックトレースでは飛ばします。",
  },
  {
    term: "permitAll",
    aliases: ["permitAll", "authenticated", "hasRole"],
    body: "Spring Security の許可設定。誰でも可、ログイン必須、特定ロールのみといった設定を並べます。",
  },
  {
    term: "認証",
    aliases: ["認証"],
    body: "誰であるかを確認すること。ログインがこれです。失敗したときの応答は、401 やログイン画面など、アプリによって違います。",
  },
  {
    term: "未ログイン",
    aliases: ["未ログイン"],
    body: "ログインしていない状態です。401 やログイン画面へ飛ばす実装が多いですが、決まりではありません。",
  },
  {
    term: "認可",
    aliases: ["認可"],
    body: "「権限を確かめること」という言い方です。認証（誰であるか）のあとで、その操作をしてよいかを見ます。",
  },
  {
    term: "権限",
    aliases: ["権限"],
    body: "その人に、その操作やデータを扱ってよいか。承認者かどうかのチェックもこれです。足りないときの画面やステータスは、アプリによって違います。",
  },
  {
    term: "ロール",
    aliases: ["ロール"],
    body: "権限のまとまり。ADMIN や USER など。hasRole や DB のマスタで見ます。",
  },
  {
    term: "WHERE",
    aliases: ["WHERE"],
    body: "SQL の条件。件数が合わないときは、まずここが厳しすぎないか・漏れていないかを見ます。",
  },
  {
    term: "SELECT",
    aliases: ["SELECT"],
    body: "DBから行を読む SQL です。",
  },
  {
    term: "UPDATE",
    aliases: ["UPDATE", "INSERT"],
    body: "DBを変える SQL。更新されないときは WHERE とコミットを疑います。",
  },
  {
    term: "ORDER BY",
    aliases: ["ORDER BY"],
    body: "SQL の並び順。件数が多いと遅さの原因になります。",
  },
  {
    term: "キャッシュ",
    aliases: ["キャッシュ"],
    body: "一度読んだ結果を再利用する仕組み。画面と DB が違うときに疑います。",
  },
  {
    term: "タイムゾーン",
    aliases: ["タイムゾーン"],
    body: "時刻の基準。環境でずれると、日付の見え方が変わります。",
  },
  {
    term: "文字コード",
    aliases: ["文字コード"],
    body: "文字の表し方。UTF-8 と Shift_JIS が混ざると文字化けします。",
  },
  {
    term: "ログ",
    aliases: ["ログ"],
    body: "アプリが出す記録。例外や SQL はここに残ります。ログインとは別です。調査では、まず既存ログの出力先を確認します。",
  },
  {
    term: "ログレベル",
    aliases: ["ログレベル"],
    body: "重大さの段階。ERROR / WARN / INFO / DEBUG など。設定で、どこから出すかを変えます。",
  },
  {
    term: "ERROR",
    aliases: ["ERROR"],
    body: "失敗の記録。例外の直後に出ることが多いです。調査ではここを先に見ます。",
  },
  {
    term: "WARN",
    aliases: ["WARN"],
    body: "処理は続いているが、おかしい、という記録です。",
  },
  {
    term: "INFO",
    aliases: ["INFO"],
    body: "処理の通過点。そこにリクエストが届いたかの確認に使います。",
  },
  {
    term: "DEBUG",
    aliases: ["DEBUG"],
    body: "詳細な記録。量が多いので、普段は出していないことが多いです。",
  },
  {
    term: "標準出力",
    aliases: ["標準出力"],
    body: "プロセスが画面や起動元へ流す出力です。コンテナでは、これを集めてログにすることが多いです。",
  },
  {
    term: "コンテナ",
    aliases: ["コンテナ"],
    body: "アプリを、ホストOSから切り離した箱として動かす単位です。中の標準出力を集めてログにすることが多いです。サーブレットコンテナとは別物です。",
  },
  {
    term: "Docker",
    aliases: ["Docker", "docker"],
    body: "アプリをコンテナとして動かす仕組みです。ログはコンテナの標準出力に出ることが多く、docker logs で見ます。",
  },
  {
    term: "Kubernetes",
    aliases: ["Kubernetes", "K8s", "k8s"],
    body: "コンテナを複数のサーバで動かす仕組みです。ログは各 Pod の標準出力にあり、kubectl logs などで見ます。",
  },
  {
    term: "ローテート",
    aliases: ["ローテート"],
    body: "日付やサイズでログファイルを切り替えることです。昨日の障害は、昨日のファイルにあります。",
  },
  {
    term: "IDE",
    aliases: ["IDE"],
    body: "ソースを編集・検索する開発環境。IntelliJ や Eclipse など。デバッガもここにあります。",
  },
  {
    term: "デバッガ",
    aliases: ["デバッガ"],
    body: "動いているプログラムを指定した行で一時停止し、そのときの変数を見る道具。バックエンドは IDE、フロントエンドはブラウザの開発者ツールです。",
  },
  {
    term: "ライブラリ",
    aliases: ["ライブラリ"],
    body: "自分たちが書いていない、再利用する部品。Spring や MyBatis など。",
  },
  {
    term: "フレームワーク",
    aliases: ["フレームワーク"],
    body: "アプリの土台になる枠組み。スタックトレースの FW 行は、だいたいここです。",
  },
  {
    term: "プロキシ",
    aliases: ["プロキシ"],
    body: "間に入って中継するもの。Spring が作る $Proxy も、通信のプロキシも、この言葉を使います。",
  },
  {
    term: "インスタンス",
    aliases: ["インスタンス"],
    body: "動いている実体。サーバが複数あると、ログが別インスタンスに出ることがあります。",
  },
  {
    term: "バッチ",
    aliases: ["バッチ"],
    body: "画面を使わず、決まった時刻や指示で動く処理です。画面用と処理の入口が違うことがあります。",
  },
  {
    term: "アドレスバー",
    aliases: ["アドレスバー"],
    body: "ブラウザ上部の URL 表示欄。処理の入口を特定するときに見ます。",
  },
  {
    term: "開発者ツール",
    aliases: ["開発者ツール"],
    body: "ブラウザに付いている調査画面。Network タブで通信、Console で JS の例外、Sources で JS のブレークポイントを見ます。",
  },
  {
    term: "パース",
    aliases: ["パース", "パースエラー"],
    body: "文字列をプログラムが読める形に分解すること。JSON のつもりが HTML だと失敗します。",
  },
  {
    term: "I/O",
    aliases: ["I/O"],
    body: "入出力。DB や外部 API、ファイルの読み書き。遅さの原因になりやすいです。",
  },
  {
    term: "依存関係",
    aliases: ["依存関係", "starter"],
    body: "使っているライブラリの一覧。pom.xml や build.gradle に書きます。",
  },
  {
    term: "DTO",
    aliases: ["DTO"],
    body: "画面や API に渡すための入れ物。テーブルそのもの（Entity）とは分けて作ることがあります。",
  },
];

export function glossaryAnchor(term: string) {
  return `g-${encodeURIComponent(term)}`;
}

export type GlossaryItem = {
  term: string;
  body: string;
};

export const glossary: GlossaryItem[] = uniqueTerms(terms);

function uniqueTerms(list: TermDef[]): GlossaryItem[] {
  const seen = new Set<string>();
  const result: GlossaryItem[] = [];
  for (const item of list) {
    if (seen.has(item.term)) continue;
    seen.add(item.term);
    result.push({ term: item.term, body: item.body });
  }
  return result.sort((a, b) => a.term.localeCompare(b.term, "ja"));
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isAsciiTerm(alias: string): boolean {
  return /^[\x00-\x7F]+$/.test(alias);
}

function isKatakanaTerm(alias: string): boolean {
  return /^[\u30A0-\u30FFー]+$/.test(alias);
}

type Matcher = {
  alias: string;
  pattern: string;
  def: TermDef;
};

const matchers: Matcher[] = terms
  .flatMap((def) => def.aliases.map((alias) => ({ alias, def })))
  .sort((a, b) => b.alias.length - a.alias.length)
  .map(({ alias, def }) => {
    const escaped = escapeRegex(alias);
    let pattern = escaped;
    if (isAsciiTerm(alias)) {
      pattern = `(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`;
    } else if (isKatakanaTerm(alias)) {
      pattern = `(?<![\\u30A0-\\u30FFー])${escaped}(?![\\u30A0-\\u30FFー])`;
    }
    return { alias, pattern, def };
  });

const termRegex = new RegExp(matchers.map((item) => item.pattern).join("|"), "gi");

const aliasLookup = new Map<string, TermDef>();
for (const item of matchers) {
  aliasLookup.set(item.alias.toLowerCase(), item.def);
}

export function lookupTerm(alias: string): TermDef | undefined {
  return aliasLookup.get(alias.toLowerCase());
}

export type TextPart =
  | { type: "text"; value: string }
  | { type: "term"; value: string; def: TermDef };

export function splitByTerms(text: string): TextPart[] {
  const parts: TextPart[] = [];
  const re = new RegExp(termRegex.source, termRegex.flags);
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", value: text.slice(last, match.index) });
    }
    const raw = match[0];
    const def = aliasLookup.get(raw.toLowerCase());
    if (def) {
      parts.push({ type: "term", value: raw, def });
    } else {
      parts.push({ type: "text", value: raw });
    }
    last = match.index + raw.length;
  }
  if (last < text.length) {
    parts.push({ type: "text", value: text.slice(last) });
  }
  return parts;
}
