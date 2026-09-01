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
    body: "ブラウザとサーバがデータをやり取りする約束事。1 回の会話はリクエストとレスポンスで完結します。",
  },
  {
    term: "HTTPS",
    aliases: ["HTTPS"],
    body: "HTTP を暗号化したもの。通信の途中で中身を読まれにくくします。アドレスは https:// で始まります。",
  },
  {
    term: "GET / POST",
    aliases: ["GET", "POST"],
    body: "HTTP メソッドの代表例。GET は取得、POST は登録や状態を変える操作に使われることが多いです。PUT / PATCH / DELETE も API でよく使います。約束事と実装がずれることもあるので、Network タブで確認しましょう。",
  },
  {
    term: "HTTPステータスコード",
    aliases: ["HTTPステータスコード", "HTTP ステータスコード", "ステータスコード", "2xx", "3xx", "4xx", "5xx"],
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
    body: "ステータスコードとしての読み方は、401 が未ログイン、403 が権限が無い、です。ただしこの2つが実際に返るとは限らず、遷移先やエラー画面もアプリ次第です。Network タブで確認しましょう。",
  },
  {
    term: "400",
    aliases: ["400"],
    body: "Bad Request。送り方やパラメータが不正、という応答です。",
  },
  {
    term: "500",
    aliases: ["500"],
    body: "Internal Server Error。サーバ側の失敗を示す応答です。",
  },
  {
    term: "502 / 503",
    aliases: ["502", "503"],
    body: "502 は Bad Gateway、503 は Service Unavailable。502 は、手前の HTTP サーバやロードバランサが後ろのアプリに届かないときに多いステータスコードです。503 はそれに加え、アプリ自身が過負荷やメンテナンスで返すこともあるので、手前だけでなくアプリのログも確認しましょう。",
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
    body: "HTTP の本文の前に付く付加情報。`Content-Type`、Cookie、`Location` などがあります。",
  },
  {
    term: "Cookie",
    aliases: ["Set-Cookie", "Cookie"],
    body: "サーバがブラウザに預ける小さなデータ。ログイン状態の識別子（セッション ID）を載せるのに使います。",
  },
  {
    term: "セッション",
    aliases: ["セッションタイムアウト", "セッション ID", "セッションID", "JSESSIONID", "セッション"],
    body: "サーバ側に置く「この人の状態」。ブラウザは Cookie で ID だけ持ち、サーバがその ID でログインユーザなどを思い出します。",
  },
  {
    term: "HttpSession",
    aliases: ["HttpSession"],
    body: "サーバ側でリクエストをまたいで値を保持する入れ物です。`setAttribute` / `getAttribute` で読み書きします。Servlet API のクラスで、ログインユーザ以外の値も持てます。",
  },
  {
    term: "リダイレクト",
    aliases: ["リダイレクト"],
    body: "サーバが「別の URL を開き直して」と返すこと。302 と `Location` ヘッダの組み合わせが典型です。",
  },
  {
    term: "コンテキストパス",
    aliases: ["コンテキストパス", "context-path"],
    body: "アプリの根っこの URL。例: `/shinsei`。Controller のパスの手前に付きます。Spring Boot では `server.servlet.context-path` に書きます。",
  },
  {
    term: "クエリ",
    aliases: ["クエリパラメータ", "クエリ"],
    body: "URL の ? 以降。同じ資源の見え方や検索条件を渡すのに使います。",
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
    body: "調べたい画面や機能で、サーバ側の処理が始まる場所。多くは URL に対応する Controller の Java メソッドです。申請くんでは `RequestController.java` の `@GetMapping` などが該当します。",
  },
  {
    term: "RestController",
    aliases: ["@RestController", "RestController"],
    body: "Controller の一種。戻り値を HTML ではなく JSON にします。templates は使いません。Spring のアノテーションです。",
  },
  {
    term: "@ResponseBody",
    aliases: ["@ResponseBody", "ResponseBody"],
    body: "戻り値をテンプレート名ではなく、JSON などの本文にする印です。`@RestController` はクラス全体にこれを付けたもの、と考えてよいです。Spring のアノテーションです。",
  },
  {
    term: "Service",
    aliases: ["Service"],
    body: "ビジネスロジックを置く層。業務として何をするかを書きます。申請くんの承認を例にすると、承認可否の判定、ステータスの更新、メール送信がここにあります。Spring ではこの名前が多いです。",
  },
  {
    term: "Repository",
    aliases: ["Repository"],
    body: "DB アクセスを担当する層。JPA ではこの名前が多いです。Mapper と役割が同じことも、Mapper の手前に置くこともあります。",
  },
  {
    term: "Mapper",
    aliases: ["Mapper"],
    body: "MyBatis などで、Java メソッドと SQL を対応づける部品です。データアクセス層として単体で置くことも、Repository から呼ばれることもあります。",
  },
  {
    term: "DataSource",
    aliases: ["DataSource"],
    body: "DB への接続をまとめて管理する部品です。実体はコネクションプールで、そこから接続を借りて使います。application.yml の設定から作られることも、サーブレットコンテナ側の設定（JNDI）から受け取ることもあります。",
  },
  {
    term: "JNDI",
    aliases: ["JNDI"],
    body: "Java Naming and Directory Interface。名前を指定して、サーブレットコンテナが用意した DataSource などのリソースを取得する仕組みです。接続情報をアプリではなくサーブレットコンテナ側に持たせる構成で使われます。",
  },
  {
    term: "Entity",
    aliases: ["Entity"],
    body: "テーブルのレコード 1 件に相当する Java のオブジェクトです。",
  },
  {
    term: "@Table",
    aliases: ["@Table"],
    body: "Entity がどのテーブルに対応するかを示す印です。name にテーブル名を書きます。JPA のアノテーションです。Hibernate のログからソースを探すときは、このテーブル名で検索します。",
  },
  {
    term: "Spring Framework",
    aliases: ["Spring Framework", "Spring"],
    body: "Java のアプリを作るための枠組みです。略して Spring と呼ぶことが多いです。この教材では、起動の土台が Spring Boot、URL と Controller が Spring MVC、ログインと権限が Spring Security です。",
  },
  {
    term: "Spring Boot",
    aliases: ["Spring Boot"],
    body: "Java の Web アプリを作るための土台。設定や内蔵サーバがまとまっています。",
  },
  {
    term: "Spring MVC",
    aliases: ["Spring MVC"],
    body: "URL と Controller を結びつける、Spring の Web の仕組みです。",
  },
  {
    term: "Spring Security",
    aliases: ["Spring Security", "SecurityConfig"],
    body: "ログイン、権限、CSRF などを担う、Spring のセキュリティフレームワークです。",
  },
  {
    term: "Thymeleaf",
    aliases: ["Thymeleaf"],
    body: "サーバ側で HTML を組み立てるテンプレートエンジンです。Spring でよく使います。共通の部品はフラグメントに分けます。",
  },
  {
    term: "フラグメント",
    aliases: ["フラグメント", "th:fragment", "th:replace"],
    body: "Thymeleaf で、テンプレートの一部に名前を付け、ほかのテンプレートから差し込んで使う仕組みです。複数画面で共通する HTML を1か所にまとめて共有できます。申請くんでは `fragments/layout.html` が全画面共通のヘッダと CSS を持ち、各画面の個別ファイルが `th:replace` で使います。",
  },
  {
    term: "JSP",
    aliases: ["JSP"],
    body: "JavaServer Pages。サーバ側で HTML を組み立てる、古くからある方式です。",
  },
  {
    term: "SQL",
    aliases: ["SQL"],
    body: "データベースに問い合わせる言語。SELECT や UPDATE など。",
  },
  {
    term: "MyBatis",
    aliases: ["MyBatis"],
    body: "SQL を XML やアノテーションで書き、Java から実行するライブラリです。ログに出た文に近い SQL が、プロジェクト内のファイルにあることが多いです。",
  },
  {
    term: "JPA",
    aliases: ["JPA", "JPQL"],
    body: "Java Persistence API。オブジェクトとテーブルを対応づけて DB アクセスします。実行される SQL はライブラリが組み立てることが多く、ソースに書いてないことがあります。",
  },
  {
    term: "JDBC",
    aliases: ["JDBC"],
    body: "Java から DB へ接続するための標準 API です。",
  },
  {
    term: "JdbcTemplate",
    aliases: ["JdbcTemplate"],
    body: "Spring が JDBC を使いやすくしたクラスです。SQL を Java の文字列として書き、実行します。ログに出た文に近い SQL が、ソースにあることが多いです。",
  },
  {
    term: "Maven",
    aliases: ["Maven", "pom.xml"],
    body: "Java のビルドと依存関係の管理の仕組み。`pom.xml` にフレームワークやライブラリを書きます。",
  },
  {
    term: "Gradle",
    aliases: ["Gradle", "build.gradle", "settings.gradle"],
    body: "Java のビルドと依存関係の管理の仕組みのひとつです。`build.gradle` にフレームワークやライブラリを書きます。",
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
    body: "接続先、ポート、ログ、プロファイルなど、起動時の設定ファイルです。Spring Boot 用です。yml でも properties でも、書き方が異なるだけで同じ意味です。",
  },
  {
    term: "プロファイル",
    aliases: ["プロファイル"],
    body: "dev / stg / prod など、設定の切り替え単位。今どれで起動しているかで接続先が変わります。Spring Boot では `application-dev.yml` や `application-dev.properties` のように使います。",
  },
  {
    term: "スタックトレース",
    aliases: ["スタックトレース"],
    body: "例外が起きたときの呼び出し履歴。右端の `(File.java:行番号)` がソースの位置です。`org.springframework` や `java.` は飛ばして、自分たちが書いたコードのパッケージ名の行を上から探します。",
  },
  {
    term: "自作クラス",
    aliases: ["自作クラス", "自作パッケージ"],
    body: "このプロジェクトで書いたコード。at 行のパッケージが、自分たちが書いたコードのもの（申請くんなら `jp.co.example.shinsei`）で始まる行です。",
  },
  {
    term: "NullPointerException",
    aliases: ["NullPointerException", "NPE"],
    body: "null の参照に対してメソッドやフィールドにアクセスしたときに出る例外です。",
  },
  {
    term: "SQLException",
    aliases: ["SQLException", "BadSqlGrammarException", "SQLSyntaxErrorException"],
    body: "SQL の失敗や、DB 接続の失敗で出る例外です。",
  },
  {
    term: "例外",
    aliases: ["例外", "Exception"],
    body: "プログラムが通常どおり進めなくなったときに投げられるエラーオブジェクトです。Java では Exception と呼びます。",
  },
  {
    term: "N+1",
    aliases: ["N+1"],
    body: "一覧の件数だけ追加の SQL が飛ぶパターン。画面は動くが遅くなります。",
  },
  {
    term: "Filter",
    aliases: ["フィルタ", "フィルター", "Filter"],
    body: "Controller の手前で全リクエストを通す処理。ログイン確認や CSRF 検査がここにあります。Spring Security も、実体は Filter の連鎖です。Controller のソースからは呼ばれません。",
  },
  {
    term: "Interceptor",
    aliases: ["Interceptor", "HandlerInterceptor", "addInterceptors"],
    body: "Spring MVC で、Controller の Java メソッドの直前・直後に動く処理。`preHandle` / `postHandle`。WebMvcConfigurer の `addInterceptors` で登録します。Controller のソースに呼び出しは出ません。",
  },
  {
    term: "AOP",
    aliases: ["AOP", "@Aspect", "アスペクト"],
    body: "メソッド呼び出しの手前やあとに、別処理を挟む仕組み。トランザクションや独自ログがここに載ります。ソース上は `service.approve()` に見えて、実行時はプロキシが先に動きます。",
  },
  {
    term: "@Transactional",
    aliases: ["@Transactional", "Transactional"],
    body: "その Java メソッドをトランザクションで囲む印です。Spring の AOP プロキシが先に動くので、Java メソッド本体の 1 行目より前に処理があります。",
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
    body: "このクラスが Service 層だと Spring に伝える印です。Spring のアノテーションです。",
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
    body: "メソッドの戻り値を Spring のコンテナに登録する印です。SecurityConfig の `filterChain` などで使います。Spring のアノテーションです。",
  },
  {
    term: "アノテーション",
    aliases: ["アノテーション"],
    body: "クラスやメソッドに付けます。Spring では URL の対応づけなどに使います。種類によっては、本体に書いていない処理が動きます。読み飛ばさず確認しましょう。",
  },
  {
    term: "@GetMapping",
    aliases: ["@GetMapping"],
    body: "指定した URL への GET を、この Java メソッドが受け取るという印です。画面を開く、一覧を表示するといった取得処理で使います。Spring のアノテーションです。",
  },
  {
    term: "@PostMapping",
    aliases: ["@PostMapping"],
    body: "指定した URL への POST を、この Java メソッドが受け取るという印です。登録・更新・承認など、状態を変える操作で使うことが多いです。参照だけの操作にも POST を使うアプリもあります。Spring のアノテーションです。",
  },
  {
    term: "@RequestMapping",
    aliases: ["@RequestMapping"],
    body: "クラスや Java メソッドに付ける URL の土台。クラスに `/requests` と書くと、配下のメソッドのパスと合成されます。Spring のアノテーションです。",
  },
  {
    term: "@RequestParam",
    aliases: ["@RequestParam"],
    body: "URL のクエリやフォームの `name` を、Java メソッドの引数に取り出す印です。Spring のアノテーションです。",
  },
  {
    term: "マッピング",
    aliases: ["URLマッピング", "マッピング"],
    body: "どの URL と HTTP メソッド（GET など）を、どの Java メソッドが処理するかの対応づけです。Spring では `@GetMapping` などで書きます。",
  },
  {
    term: "バリデーション",
    aliases: ["バリデーション"],
    body: "入力値が規則どおりかの検査。不足や形式不正は 400 になりやすいです。",
  },
  {
    term: "トランザクション",
    aliases: ["トランザクション"],
    body: "DB 更新をまとめて確定（または取り消す）単位。途中で失敗したら元に戻します。",
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
    body: "画面の入力や SQL の ? に、実際の値をはめ込むことです。",
  },
  {
    term: "プレースホルダ",
    aliases: ["プレースホルダ"],
    body: "SQL の値の穴です。ログでは `?` 、MyBatis の XML では `#{userId}` のように書きます。実行時に実際の値が入ります。",
  },
  {
    term: "スロークエリ",
    aliases: ["スロークエリ", "スロークエリログ"],
    body: "実行に時間がかかった SQL です。DB のスロークエリログに残ることがあります。何秒から記録するかは設定次第です。",
  },
  {
    term: "論理削除",
    aliases: ["論理削除"],
    body: "レコードを物理的に消さず、削除フラグで「無いもの」として扱う方式です。",
  },
  {
    term: "DDL",
    aliases: ["DDL"],
    body: "テーブル定義を変える SQL（CREATE / ALTER など）。コードと DB 定義がずれる原因になります。",
  },
  {
    term: "トリガー",
    aliases: ["トリガー", "TRIGGER"],
    body: "特定の操作（INSERT や UPDATE など）をきっかけに、DB が自動で実行する処理です。Java のソースには現れません。",
  },
  {
    term: "DEFAULT",
    aliases: ["DEFAULT"],
    body: "カラムに値が指定されなかったときに使う、DB 側の初期値の定義です。`DEFAULT CURRENT_TIMESTAMP` なら、INSERT した時刻が自動で入ります。",
  },
  {
    term: "正規化",
    aliases: ["正規化"],
    body: "同じ情報を複数のテーブルに重複させず、意味のまとまりごとに分けて持つ設計です。更新は楽になりますが、取得時に複数テーブルの結合が必要になることがあります。",
  },
  {
    term: "結合",
    aliases: ["結合", "JOIN"],
    body: "複数のテーブルを、共通のカラムで紐付けて1つの結果にまとめる SQL の操作です。SQL では JOIN と書きます。",
  },
  {
    term: "インデックス",
    aliases: ["インデックス"],
    body: "検索を速くするための DB の索引。無いとフルスキャンになりやすいです。",
  },
  {
    term: "フルスキャン",
    aliases: ["フルスキャン", "全件スキャン"],
    body: "テーブルを先頭から全部読む実行の仕方です。インデックスが無いとこうなりやすいです。",
  },
  {
    term: "EXPLAIN",
    aliases: ["EXPLAIN"],
    body: "SQL の実行計画を見るコマンドです。MySQL では type が ALL だと、フルスキャンであることが多いです。rows は実測ではなく、オプティマイザの推定です。",
  },
  {
    term: "実行計画",
    aliases: ["実行計画"],
    body: "DB が SQL をどう実行するかの手順です。どのテーブルをどう読むか、インデックスを使うかを含みます。MySQL では EXPLAIN で見ます。",
  },
  {
    term: "オプティマイザ",
    aliases: ["オプティマイザ"],
    body: "SQL の実行計画を決める DB の処理です。どのインデックスを使うか、テーブルをどう読むかを選びます。",
  },
  {
    term: "コネクションプール",
    aliases: ["コネクションプール", "接続プール"],
    body: "DB 接続を使い回す仕組み。枯渇すると待ちやタイムアウトが起きます。",
  },
  {
    term: "SSL / TLS",
    aliases: ["SSL", "TLS"],
    body: "HTTP を暗号化する仕組みです。SSL は古い呼び名で、現在の規格は TLS ですが、SSL という呼び方も現場でよく使われます。",
  },
  {
    term: "SSL 終端",
    aliases: ["SSL終端", "SSL 終端", "SSLオフロード", "SSL オフロード"],
    body: "暗号化された通信を復号する場所のことです。ロードバランサや CDN、手前の HTTP サーバなど、アプリより前のレイヤで行われることが多く、その場合はアプリのログに証明書エラーが出ません。「SSL オフロード」も同じ意味で使われます。",
  },
  {
    term: "証明書",
    aliases: ["証明書"],
    body: "SSL / TLS で使う、サーバの身元を保証するファイルです。期限切れや設定ミスがあると、SSL 終端の手前でエラーになり、アプリまで届きません。",
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
    body: "Content Delivery Network。静的ファイルをキャッシュして近くから配る仕組み。SSL 終端やキャッシュの都合で、ブラウザのリクエストが届く先がアプリ本体とずれることがあります。",
  },
  {
    term: "WAF",
    aliases: ["WAF"],
    body: "Web Application Firewall。HTTP リクエストを検査し、攻撃と判定したものを遮断する装置。ブロックされたリクエストはアプリまで届かないことが多いです。",
  },
  {
    term: "ファイアウォール",
    aliases: ["ファイアウォール", "FW"],
    body: "通信の許可・拒否を制御する壁。接続タイムアウトの原因になることがあります。",
  },
  {
    term: "ポリシーベースルーティング",
    aliases: ["ポリシーベースルーティング", "PBR"],
    body: "宛先だけでなく、プロトコルやポートなどの条件で通す道を変える経路制御です。ICMP と TCP で道が分かれることがあります。",
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
    term: "ICMP",
    aliases: ["ICMP"],
    body: "ホストの到達確認や、届かないときの通知に使うプロトコルです。ping や Windows の tracert でよく使います。HTTP とは別です。",
  },
  {
    term: "UDP",
    aliases: ["UDP"],
    body: "事前の接続を張らずにデータを送るプロトコルです。TCP のように届いたかの確認を待ちません。",
  },
  {
    term: "ping",
    aliases: ["ping"],
    body: "ICMP で相手ホストが応答するかを見るコマンド。名前解決やホスト到達の手がかりになります。ping が通らなくても HTTP は通ることもあります。",
  },
  {
    term: "traceroute",
    aliases: ["traceroute", "tracert", "tracepath"],
    body: "パケットが途中のどの機器を通るかを見るコマンド。ICMP、UDP、TCP などプロトコルを選べることがあります。プロトコルやポートが違うと、見える経路も変わることがあります。",
  },
  {
    term: "curl",
    aliases: ["curl"],
    body: "コマンドから HTTP リクエストを送るツール。ステータスコードとヘッダを確認できます。Windows 10 以降にも入っていることが多いです。",
  },
  {
    term: "access.log",
    aliases: ["access.log", "access_log", "アクセスログ"],
    body: "HTTP サーバが受けたリクエストの記録。URL、ステータスコード、時刻が並びます。静的ファイルの 404 もここに残ることが多いです。",
  },
  {
    term: "error.log",
    aliases: ["error.log", "error_log"],
    body: "HTTP サーバ側のエラー記録。設定ミス、後ろのアプリへの接続失敗、SSL の問題など。",
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
    body: "HTML の雛形。サーバがデータを流し込んで画面を作ります。",
  },
  {
    term: "JSON",
    aliases: ["JSON"],
    body: "名前と値のペアを波括弧で書いたデータ形式です。例: {\"status\":\"APPROVED\"}。Network タブの Response や Request Payload に載ります。HTML のように画面にはなりません。",
  },
  {
    term: "Jackson",
    aliases: ["Jackson"],
    body: "Java のオブジェクトと JSON を相互に変換するライブラリです。Spring Boot に標準で組み込まれています。フィールド名と JSON のキー名を対応づけて変換します。",
  },
  {
    term: "Web API",
    aliases: ["Web API", "WebAPI"],
    body: "データを HTTP で提供する窓口。本文は JSON が多く、ブラウザの画面、モバイルアプリ、ほかのサーバなどから使われます。",
  },
  {
    term: "Content-Type",
    aliases: ["Content-Type"],
    body: "本文の種類を示すヘッダ。`text/html` は画面、`application/json` は API のデータです。",
  },
  {
    term: "Ajax",
    aliases: ["Ajax"],
    body: "Asynchronous JavaScript and XML。ページ全体を読み直さず、JavaScript から HTTP 通信する方法です。名前に XML とありますが、JSON も扱えます。",
  },
  {
    term: "fetch",
    aliases: ["fetch"],
    body: "ブラウザの JavaScript から HTTP 通信するための API です。XMLHttpRequest より新しい書き方としてよく使われます。Network タブでは、XMLHttpRequest とまとめて Fetch/XHR に表示されます。",
  },
  {
    term: "XMLHttpRequest",
    aliases: ["XMLHttpRequest", "XHR"],
    body: "ブラウザの JavaScript から HTTP 通信するための API です。XHR は XMLHttpRequest の略です。名前に XML とありますが、JSON も扱えます。Network タブでは、fetch とまとめて Fetch/XHR に表示されます。",
  },
  {
    term: "Fetch/XHR",
    aliases: ["Fetch/XHR"],
    body: "ブラウザ開発者ツールの Network タブにある絞り込み項目。fetch または XMLHttpRequest で始まった通信だけを表示します。対象の通信を選ぶと、送信先、ステータスコード、応答の本文などを確認できます。",
  },
  {
    term: "SPA",
    aliases: ["SPA", "シングルページアプリケーション"],
    body: "Single Page Application。ページ全体の読み直しを減らし、JavaScript で画面を切り替えるアプリの形です。Web API の JSON を使う構成が多く、React などで作れます。",
  },
  {
    term: "React",
    aliases: ["React"],
    body: "ブラウザで画面を組むための JavaScript のライブラリです。Web API から受け取った JSON を一覧などにすることが多いです。",
  },
  {
    term: "React の state",
    aliases: ["React の state"],
    body: "React が画面の表示に使う、変化する値です。useState で作った state を更新すると、React がその値に合わせて画面を描画し直します。",
  },
  {
    term: "PRG",
    aliases: ["PRG"],
    body: "Post/Redirect/Get。POST のあとリダイレクトし、再読込で二重送信しにくくする型です。",
  },
  {
    term: "WAR",
    aliases: ["war", "WAR"],
    body: "Java Web アプリの配布形式。外部の Tomcat などに載せるときに使います。",
  },
  {
    term: "HTTP サーバ",
    aliases: ["HTTP サーバ", "HTTPサーバ"],
    body: "ブラウザの手前でリクエストを受けるサーバ。Apache や nginx。静的ファイルの配信や後ろへの中継を担うことが多く、access.log と error.log を持ちます。",
  },
  {
    term: "Apache",
    aliases: ["Apache", "httpd"],
    body: "HTTP サーバのひとつです。Tomcat とは別物です。",
  },
  {
    term: "nginx",
    aliases: ["nginx", "Nginx"],
    body: "HTTP サーバのひとつです。リバースプロキシや静的ファイルの配信でよく使います。",
  },
  {
    term: "サーブレットコンテナ",
    aliases: ["サーブレットコンテナ"],
    body: "Java の画面や API を動かす実行基盤です。Tomcat や Jetty。Controller が動く場所です。いわゆる Docker などのコンテナとは別物です。",
  },
  {
    term: "Tomcat",
    aliases: ["Tomcat"],
    body: "Java の Web アプリを動かすサーバ（サーブレットコンテナ）です。",
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
    body: "Java の開発・実行環境。版が違うと起動できないことがあります。",
  },
  {
    term: "APサーバ",
    aliases: ["APサーバ"],
    body: "アプリケーションサーバ。アプリを動かす実行基盤です。",
  },
  {
    term: "logback",
    aliases: ["logback", "logback-spring.xml", "logback.xml"],
    body: "Java でよく使うログ出力のライブラリです。出力先は `logback-spring.xml` や `logback.xml` に書くことが多いです。`logback-spring.xml` は Spring Boot 用です。",
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
    body: "Spring 以前からある Java の Web フレームワークです。",
  },
  {
    term: "SameSite",
    aliases: ["SameSite"],
    body: "Cookie のクロスサイト送信を制限する属性です。緩い設定では CSRF のリスクが上がることがあり、厳しい設定では外部サイト経由の遷移などに影響することがあります。",
  },
  {
    term: "参照検索",
    aliases: ["参照検索", "使用箇所の検索", "ワークスペース内の参照", "Find Usages", "References", "Find References"],
    body: "IDE の機能。その Java メソッドや型がどこから呼ばれているかを一覧します。日本語化した IntelliJ では「使用箇所の検索」、Eclipse では「ワークスペース内の参照」という名前です。",
  },
  {
    term: "定義へジャンプ",
    aliases: ["定義へジャンプ", "宣言または使用箇所に移動", "宣言を開く", "宣言へジャンプ", "Go to Declaration", "Open Declaration"],
    body: "IDE の機能。呼び出している Java メソッドの名前から、その宣言（呼ばれている側）を開きます。日本語化した IntelliJ では「宣言または使用箇所に移動」、Eclipse では「宣言を開く」という名前です。",
  },
  {
    term: "呼び出し階層",
    aliases: ["呼び出し階層", "呼び出し階層を開く", "Call Hierarchy"],
    body: "IDE の機能。今の Java メソッドを起点に、呼び出し元と呼び出し先を階層（ツリー）で出します。日本語化した IntelliJ では「呼び出し階層」、Eclipse では「呼び出し階層を開く」です。1 段だけなら参照検索と定義へジャンプで足ります。",
  },
  {
    term: "実装へジャンプ",
    aliases: ["実装へジャンプ", "実装に移動", "実装を開く", "Go to Implementation"],
    body: "IDE の機能。インタフェースの宣言から、実体のクラスを開きます。日本語化した IntelliJ では「実装に移動」、Eclipse では「実装を開く」という名前です。MyBatis の Mapper は Java の実装クラスが無いことが多いです。",
  },
  {
    term: "リポジトリ",
    aliases: ["リポジトリ"],
    body: "ソースコードと、その変更履歴を保存する場所です。Git や SVN で管理します。Spring の Repository（DB アクセス層）とは別物です。",
  },
  {
    term: "Git",
    aliases: ["Git"],
    body: "分散型のバージョン管理システムです。ファイルの変更履歴を、ひとまとまりの単位（commit）ごとに記録します。GitHub や GitLab などでリポジトリを共有することが多いです。",
  },
  {
    term: "git blame",
    aliases: ["git blame"],
    body: "指定したファイルの各行を、最後に変更した人・日時とともに示すコマンドです。IDE にも同等の機能があります。行の意図を知る手がかりになりますが、整形やリファクタだけの変更が表示されることもあります。",
  },
  {
    term: "SVN",
    aliases: ["SVN", "Subversion"],
    body: "Apache Subversion。Git より古くからある、集中型のバージョン管理システムです。今も使っている現場があります。Git の commit にあたる単位を「リビジョン」と呼びます。",
  },
  {
    term: "リビジョン",
    aliases: ["リビジョン"],
    body: "SVN で、ある時点までの変更のまとまりを指す番号です。Git の commit にあたります。`svn log` や `svn blame` の結果に出ます。",
  },
  {
    term: "Networkタブ",
    aliases: ["Network タブ", "Networkタブ", "Network"],
    body: "ブラウザ開発者ツールの画面。実際に飛んだ HTTP リクエストを見られます。見られるのは、開発者ツールを開いているウィンドウの通信です。別ウィンドウで送ったリクエストは、元のウィンドウには出ません。",
  },
  {
    term: "Elementsタブ",
    aliases: ["Elements タブ", "Elements（要素）", "Elements"],
    body: "ブラウザ開発者ツールの画面。現在のページにある HTML 要素と、適用されている CSS を確認できます。サーバが返した後に JavaScript が書き換えた内容も反映されます。",
  },
  {
    term: "ホスト",
    aliases: ["ホスト名", "ホスト"],
    body: "URL のサーバ名の部分。どのサーバに届くかを表します。",
  },
  {
    term: "タイムアウト",
    aliases: ["タイムアウト"],
    body: "制限時間内に終わらず打ち切られること。接続待ちやセッション切れで起きます。",
  },
  {
    term: "ロック",
    aliases: ["行ロック", "レコードロック", "ロック"],
    body: "同時更新を防ぐため、DB がレコードやテーブルを一時的に専有すること。待ちの原因になります。",
  },
  {
    term: "モック",
    aliases: ["モック"],
    body: "外部サービスなどの代わりに用意する偽物。ローカルではメール送信しない、など。",
  },
  {
    term: "環境変数",
    aliases: ["環境変数"],
    body: "OS や起動元が渡す設定値。パスワードをファイルに書かないときに使います。",
  },
  {
    term: "javax / jakarta",
    aliases: ["jakarta", "javax"],
    body: "Java の標準 API のパッケージ名。Spring Boot 2 系は javax、3 系は jakarta です。",
  },
  {
    term: "URL",
    aliases: ["URL"],
    body: "資源の住所。ホスト、パス、クエリなどが並びます。",
  },
  {
    term: "オリジン",
    aliases: ["オリジン"],
    body: "Web で通信元を区別する単位。URL のスキーム（http または https）、ホスト、ポートの組み合わせです。どれか 1 つでも違えば、別のオリジンです。",
  },
  {
    term: "リクエスト",
    aliases: ["リクエスト"],
    body: "ブラウザや API クライアントからサーバへ送る要求です。",
  },
  {
    term: "レスポンス",
    aliases: ["レスポンス"],
    body: "サーバから返る応答。ステータスコード、ヘッダ、本文がセットです。",
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
    term: "Uncaught TypeError",
    aliases: ["Uncaught TypeError", "TypeError"],
    body: "JavaScript の例外の一種です。型が合わない操作（null のプロパティを読むなど）で出ます。Uncaught は、例外を catch しなかった、という意味です。",
  },
  {
    term: "getElementById",
    aliases: ["getElementById"],
    body: "id 属性が一致する HTML 要素を返す JavaScript の関数です。見つからないと null です。",
  },
  {
    term: "preventDefault",
    aliases: ["preventDefault"],
    body: "イベントのあとブラウザが本来する動きを止める関数です。フォームの submit なら、送信を止めます。",
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
    body: "レコードをまとめた単位です。レコードが 1 件のデータ、カラムが項目です。",
  },
  {
    term: "レコード",
    aliases: ["レコード"],
    body: "テーブルの 1 件のデータです。Java では同じレコードを Entity として扱うことが多いです。",
  },
  {
    term: "カラム",
    aliases: ["カラム", "カラム名", "列名"],
    body: "テーブルの項目。コードのカラム名と DB の定義がずれると SQL エラーになります。",
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
    body: "HTTP メソッド。PUT は置き換え、PATCH は一部更新、DELETE は削除です。POST にまとめている実装もあります。",
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
    body: "Cookie の属性。HTTPS のときだけブラウザが付けます。http で開くと、ログインが切れて見えることがあります。",
  },
  {
    term: "ドメイン",
    aliases: ["ドメイン"],
    body: "example.co.jp のようなサイトの範囲。Cookie の届く先もここで決まります。",
  },
  {
    term: "ドメイン知識",
    aliases: ["ドメイン知識"],
    body: "その業務の決まりや慣習についての知識です。ソースを読んだだけでは分からないことがあります。",
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
    body: "Thymeleaf などの属性。送信先、リンク先、表示条件をテンプレート側に書きます。",
  },
  {
    term: "name属性",
    aliases: ["name 属性", "name属性"],
    body: "フォーム項目の名前。サーバの `@RequestParam` と対応づきます。名前が違うと null やバインドエラーになりやすいです。`required = false` なら必須ではありません。`@RequestParam` は Spring のアノテーションです。",
  },
  {
    term: "@PathVariable",
    aliases: ["@PathVariable"],
    body: "URL の `/requests/12` の 12 のように、パスの一部を引数に取る印です。Spring のアノテーションです。",
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
    term: "@ModelAttribute",
    aliases: ["@ModelAttribute"],
    body: "フォームの入力値を、Java のオブジェクトへ自動で詰め替える印です。Setter をリフレクションで呼んで値を入れるので、ソースには呼び出しの行がありません。Spring のアノテーションです。",
  },
  {
    term: "@AuthenticationPrincipal",
    aliases: ["@AuthenticationPrincipal"],
    body: "今ログインしているユーザを、メソッド引数として受け取る印です。Spring Security のアノテーションです。",
  },
  {
    term: "パッケージ",
    aliases: ["パッケージ"],
    body: "クラスの住所。`jp.co.example.shinsei` のようにドットで区切り、フォルダと対応します。",
  },
  {
    term: "クラス",
    aliases: ["クラス"],
    body: "データと処理をまとめた設計図。`RequestService` などがクラスです。",
  },
  {
    term: "メソッド",
    aliases: ["メソッド"],
    body: "HTTP の GET / POST / PUT などと Java の処理のまとまりのどちらも「メソッド」と呼ばれます。まず前後の文脈でどちらの話かを見分けます。Network タブや URL なら HTTP メソッド、`list()` やクラス名なら Java メソッドです。",
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
    term: "リフレクション",
    aliases: ["リフレクション", "reflection"],
    body: "実行時に、クラスやメソッドの名前を文字列などから調べて操作する仕組みです。Setter の名前を対応づけて呼ぶ、といったことができます。フレームワークが裏側でよく使い、ソースには呼び出しの行が現れません。",
  },
  {
    term: "null",
    aliases: ["null"],
    body: "値が無いことです。null の参照でメソッドを呼ぶと、Java では NullPointerException になります。",
  },
  {
    term: "Caused by",
    aliases: ["Caused by"],
    body: "例外が別の例外を包んでいる印。いちばん下の原因を優先して読みます。",
  },
  {
    term: "Unknown Source",
    aliases: ["Unknown Source"],
    body: "スタックのその行に対応するソースが無い印です。",
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
    body: "フレームワークが実行時に作るクラス。自作コードではないので、隣の自作パッケージへ戻ります。Spring ではよく見ます。",
  },
  {
    term: "org.springframework",
    aliases: ["org.springframework"],
    body: "Spring Framework のパッケージです。スタックトレースでは飛ばします。",
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
    body: "その人に、その操作やデータを扱ってよいか。承認者かどうかのチェックもこれです。足りないときの画面やステータスコードは、アプリによって違います。",
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
    body: "DB からレコードを読む SQL です。",
  },
  {
    term: "UPDATE",
    aliases: ["UPDATE", "INSERT"],
    body: "DB を変える SQL。更新されないときは WHERE とコミットを疑います。",
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
    body: "何が起きたかを残した記録です。アプリ、HTTP サーバ、コンテナの標準出力など、出る場所は環境ごとに違います。",
  },
  {
    term: "ログレベル",
    aliases: ["ログレベル"],
    body: "重大さの段階。ERROR / WARN / INFO / DEBUG など。設定で、どこから出すかを変えます。",
  },
  {
    term: "ERROR",
    aliases: ["ERROR"],
    body: "失敗の記録。調査ではここを先に見ます。",
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
    body: "アプリを、ホスト OS から切り離して動かす単位です。Docker とは限りません。中の標準出力を集めてログにすることが多いです。サーブレットコンテナとは別物です。",
  },
  {
    term: "Docker",
    aliases: ["Docker", "docker"],
    body: "コンテナを動かす仕組みのひとつです。コンテナそのものではありません。ログはコンテナの標準出力に出ることが多く、docker logs で見ることがあります。",
  },
  {
    term: "Kubernetes",
    aliases: ["Kubernetes", "K8s", "k8s"],
    body: "コンテナを複数のサーバで動かす仕組みです。ログは各 Pod の標準出力にあり、kubectl logs などで見ます。",
  },
  {
    term: "ConfigMap",
    aliases: ["ConfigMap"],
    body: "Kubernetes で、設定値をコンテナの外に置く仕組みです。環境変数やファイルとしてコンテナへ渡します。",
  },
  {
    term: "Secret",
    aliases: ["Secret"],
    body: "Kubernetes で、パスワードなどの機密情報をコンテナの外に置く仕組みです。ConfigMap と似ていますが、機密情報向けです。",
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
    body: "自分たちが書いていない、再利用する部品。MyBatis や JDBC ドライバなど。アプリの土台そのものではなく、機能を足すものです。",
  },
  {
    term: "フレームワーク",
    aliases: ["フレームワーク"],
    body: "アプリの土台になる枠組み。Spring Framework など。スタックトレースの FW 行は、だいたいここです。",
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
    body: "使うフレームワークやライブラリの一覧。`pom.xml` や `build.gradle` に書きます。",
  },
  {
    term: "DTO",
    aliases: ["DTO"],
    body: "画面や API に渡すための入れ物。テーブルそのもの（Entity）とは分けて作ることがあります。",
  },
];

/** `%` を使うと hash が復号され id とずれるので、`.` に置き換える */
export function glossaryAnchor(term: string) {
  return `g-${encodeURIComponent(term).replace(/%/g, ".")}`;
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

const termRegex = new RegExp(matchers.map((item) => item.pattern).join("|"), "g");

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
  termRegex.lastIndex = 0;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = termRegex.exec(text)) !== null) {
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
  termRegex.lastIndex = 0;
  return parts;
}
