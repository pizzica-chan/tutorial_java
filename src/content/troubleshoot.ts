import type { Track } from "../types";

export const troubleshootTrack: Track = {
  id: "troubleshoot",
  no: "05",
  title: "トラブルシュート",
  kicker: "PATTERNS",
  description: "調査手順、ログの読み方、症状別の切り分け。",
  accent: "#d46a5c",
  lessons: [
    {
      id: "loop",
      title: "調査手順",
      minutes: 8,
      summary: "再現、区間切り分け、仮説、最小変更。",
      blocks: [
        {
          type: "p",
          text: "先に現象を固定し、線のどこで期待と違うかを狭めます。",
        },
        {
          type: "steps",
          items: [
            {
              title: "再現する",
              text: "同じ操作をする。できないなら、できない条件（権限、データ、時間帯）が情報です。",
            },
            {
              title: "区間を切る",
              text: "ブラウザまで来ているか、サーバに届いているか、DB まで行っているか。Network タブとログで分ける。値の中身は、止められるならデバッガ。",
            },
            {
              title: "仮説を1つにする",
              text: "権限と SQL と JS が同時に怪しいのは、切り分けになっていません。確認コストが低いものから潰します。",
            },
            {
              title: "変更は最小",
              text: "既存のログを先に読む。確認用のログ追加と、修正を混ぜない。切り分け用の変更は後で戻します。",
            },
          ],
        },
        {
          type: "h2",
          text: "現象の記録",
        },
        {
          type: "table",
          headers: ["項目", "例"],
          rows: [
            ["操作", "検証環境で申請 ID 12 を承認した"],
            ["期待", "一覧に戻り、ステータスが承認済み"],
            ["実際", "ログイン画面に戻った"],
            ["観測", "画面 URL、ステータス、コンソールの WARN、該当メソッド"],
            ["仮説", "CSRF またはセッション切れ"],
          ],
        },
        { type: "quiz", id: "ori-ask" },
      ],
    },
    {
      id: "logs",
      title: "ログの場所と読み方",
      minutes: 12,
      summary: "アプリはもともとログを出す。行き先を確認し、時刻とレベルで読む。",
      blocks: [
        {
          type: "p",
          text: "障害調査では、まず既存のログを見ます。アプリは最初からログが出るように作られているのが一般的です。調査用の log.info を足すのは、既存ログで足りないときです。",
        },
        {
          type: "h2",
          text: "出力先を確認する",
        },
        {
          type: "p",
          text: "行き先はアプリと環境で違います。決まった一箇所はありません。次の順で探します。",
        },
        {
          type: "ol",
          items: [
            "手順書、README、聞ける人に「今の環境のログはどこか」を確認する",
            "application.yml や application.properties の logging.file や logging.path、logging.level を見る",
            "logback-spring.xml や log4j2.xml があれば、file のパスを見る",
            "ローカル環境なら、起動したコンソールに同じ内容が出ていることが多い",
          ],
        },
        { type: "diagram", name: "log-where", caption: "中身は同じ記録です。置き場所が違うだけです。" },
        {
          type: "table",
          headers: ["よくある置き場", "見るとき"],
          rows: [
            ["起動コンソール", "ローカルで java -jar や IDE から起動している"],
            ["Tomcat の logs/、catalina.out", "外部 Tomcat に WAR を載せている"],
            ["日付で分かれた .log ファイル", "logback などでローテートしている"],
            ["コンテナの標準出力", "Docker や Kubernetes。docker logs や同等のコマンド"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "複数台",
          text: "ロードバランサの後ろだと、ログは別インスタンスに出ることがあります。操作が当たったサーバを特定してから読みます。",
        },
        {
          type: "h2",
          text: "1行の読み方",
        },
        {
          type: "p",
          text: "書式は設定次第ですが、次の要素が並ぶことが多いです。",
        },
        { type: "diagram", name: "log-line" },
        {
          type: "code",
          title: "例外が出たときの例",
          code: `2026-08-16 04:12:03.512 ERROR 8120 --- [nio-8080-exec-3] j.c.e.s.service.RequestService : approve failed requestId=12
java.lang.NullPointerException: Cannot invoke "Long.equals(Object)" because ...
    at jp.co.example.shinsei.service.RequestService.approve(RequestService.java:41)
    at jp.co.example.shinsei.controller.RequestController.approve(RequestController.java:58)`,
        },
        {
          type: "ol",
          items: [
            "操作した時刻と、ログの時刻を合わせる。日付が違うファイルなら、まず日付を合わせる",
            "ERROR と WARN を先に見る。INFO は「処理がそこに届いたか」の確認に使う",
            "メッセージで何が起きたかを読む。その下に at 行が続けばスタックトレース",
            "自分たちが書いたコードのパッケージ名なら、そのソースの行番号を調べる",
          ],
        },
        {
          type: "p",
          text: "DEBUG は量が多いので、普段は出していないことが多いです。必要なときだけ、そのパッケージのレベルを上げます。上げたら調査後に戻します。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "ログが無い",
          text: "操作時刻に何も無いこと自体が情報です。別インスタンス、別ファイル、リクエストがサーバに届いていないことを疑います。",
        },
        {
          type: "h2",
          text: "足りないときだけ足す",
        },
        {
          type: "p",
          text: "既存ログで到達も例外も分からないとき、一時的に ID と通過点を出します。パスワードやトークンは出しません。調査が終わったら戻します。値を今の行で見たいだけなら、ログを足すよりデバッガです。止められない環境ではログです。",
        },
        {
          type: "callout",
          kind: "warn",
          title: "共有環境",
          text: "検証環境など他人と使っている場合、ログレベルの変更や調査用の出力は、他の人の調査やディスクを圧迫することがあります。足す前に、その環境でよいか確認します。",
        },
        {
          type: "code",
          title: "調査用（あとで戻す）",
          lang: "java",
          code: `log.info("approve start requestId={} userId={}", id, userId);`,
        },
        { type: "quiz", id: "ts-log" },
      ],
    },
    {
      id: "stack",
      title: "スタックトレース",
      minutes: 12,
      summary: "右端がファイル名。自分たちが書いたコードのパッケージ名の行から調べる。",
      blocks: [
        {
          type: "p",
          text: "スタックトレースは、例外が起きたときの呼び出し履歴です。現場のログでは、次のように長く出ます。",
        },
        {
          type: "diagram",
          name: "stack-own",
          caption: "上から見て、自分たちが書いたコードのパッケージ名がある最初の行の、その行番号を調べます。",
        },
        {
          type: "p",
          text: "申請くんなら、自分たちが書いたコードのパッケージは jp.co.example.shinsei です。org.springframework や java. はライブラリや Java 本体なので、直す場所ではありません。$$Enhancer や $Proxy も生成コードなので飛ばします。",
        },
        {
          type: "h2",
          text: "1行の読み方",
        },
        { type: "diagram", name: "stack-line", caption: "右端の括弧が、ソースのファイルと行です。" },
        {
          type: "p",
          text: "RequestService.java:41 なら、プロジェクト内の RequestService.java の 41 行目です。Unknown Source とだけある行は、ソースが無いので飛ばします。",
        },
        {
          type: "figure",
          src: "/images/code-screen.jpg",
          alt: "エディタにソースと行番号が出ている画面",
          caption: "ログの :41 は、エディタ左端の行番号と同じものです。",
        },
        {
          type: "h2",
          text: "見る順番",
        },
        {
          type: "ol",
          items: [
            "先頭の例外クラスとメッセージを読む",
            "Caused by があれば、いちばん下の原因例外を優先する",
            "at 行を上から見て、自分たちが書いたコードのパッケージ名がある最初の行のソースを見る",
            "その下の自作クラスは、誰から呼ばれたかの手がかり",
          ],
        },
        {
          type: "h2",
          text: "パッケージ名で見分ける",
        },
        {
          type: "table",
          headers: ["パッケージの先頭", "扱い"],
          rows: [
            ["jp.co.example.shinsei など、自分たちが書いたコードのパッケージ", "自作。このクラスの行番号を調べる"],
            ["org.springframework / org.apache / org.mybatis / org.hibernate", "ライブラリ。飛ばす"],
            ["java. / javax. / jakarta. / jdk. / sun.", "JDK。飛ばす"],
            ["$Proxy / CGLIB / generated", "生成コード。隣の自作クラスへ戻る"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "上から最初の自作コード",
          text: "Spring の長いクラス名の行で止まらないでください。直すのは RequestService や RequestRepository です。",
        },
        { type: "widget", name: "stack" },
        { type: "quiz", id: "ts-npe" },
        { type: "quiz", id: "ts-own-class" },
      ],
    },
    {
      id: "p-500",
      title: "パターン: 500 / 例外",
      minutes: 8,
      summary: "画面はエラー。サーバログにスタックがある。",
      blocks: [
        {
          type: "p",
          text: "利用者には「エラーが発生しました」としか出なくても、サーバログには例外があります。画面操作の時刻とログの時刻を合わせます。",
        },
        {
          type: "table",
          headers: ["例外", "まず見ること"],
          rows: [
            ["NullPointerException", "その行のオブジェクト。DB の null、未バインド、未設定の関連"],
            ["IllegalArgumentException / 業務例外", "メッセージと、throw している if 条件"],
            ["TemplateInputException など", "return したビュー名と、templates 配下の実ファイル"],
            ["BadSqlGrammarException", "Mapper の列名と、DB の定義差"],
          ],
        },
        {
          type: "p",
          text: "フロントが JSON を期待しているのに、500 の HTML エラーページが返ると、画面にはパースエラーとだけ出ることがあります。Network タブのステータスと Content-Type を先に見ます。",
        },
        {
          type: "ol",
          items: [
            "再現操作と時刻を控える",
            "同時刻の ERROR を取る",
            "ライブラリの at 行は飛ばし、自分たちが書いたコードのパッケージ名がある行のソースを見る",
            "その値がどこでセットされたかを上流へ辿る",
          ],
        },
      ],
    },
    {
      id: "p-404",
      title: "パターン: 404 / 画面が開かない",
      minutes: 7,
      summary: "マッピング、コンテキストパス、静的ファイル、HTTP メソッド。",
      blocks: [
        {
          type: "p",
          text: "404 は「サーバ例外」ではなく、「その URL に対応する資源が無い」です。",
        },
        { type: "diagram", name: "not-found" },
        {
          type: "table",
          headers: ["状況", "確認"],
          rows: [
            ["HTML ごと 404", "Controller のパス、context-path、末尾スラッシュ"],
            ["Web API が 404", "パス、HTTP メソッド、Spring の @RestController のプレフィックス"],
            ["画面は出るが CSS/JS だけ 404", "static の置き場所、許可パス、context-path"],
            ["GET では出るが POST で 404", "メソッドのマッピング。Spring の @GetMapping しか無いなど"],
            ["リンク先だけ 404", "テンプレートの th:href / action と、実際のマッピング"],
          ],
        },
        {
          type: "p",
          text: "画面 URL が /shinsei/requests なのに、検索語を /shinsei/requests のままにするとヒットしません。アプリ内パスは /requests であることが多いです。",
        },
      ],
    },
    {
      id: "p-auth",
      title: "パターン: 401 / 403 / ログインへ戻る",
      minutes: 9,
      summary: "未ログイン、権限、セッション、CSRF。",
      blocks: [
        {
          type: "p",
          text: "Controller に入る前、または入った直後の権限チェックで落ちます。500 ではないので、スタックが少ないことがあります。",
        },
        {
          type: "table",
          headers: ["症状", "切り分け"],
          rows: [
            ["最初からログイン画面", "未ログイン、Cookie 未送信、セッション無効"],
            ["操作後にログイン画面", "セッションタイムアウト、CSRF 不一致、セッション固定"],
            ["権限がありません", "番号は 403 と読むことが多いが、200 のエラー画面などアプリ次第。ロール、hasRole、承認者 ID"],
            ["API が 401 の JSON", "画面側でログインへ飛ばすのと同じ未ログイン、という実装が多い。形はアプリ次第"],
            ["API なのに HTML が返る", "認証リダイレクト。JSON ではなくログイン画面。Content-Type を見る"],
          ],
        },
        {
          type: "ul",
          items: [
            "Spring Security の SecurityConfig の permitAll / authenticated / hasRole",
            "フォームの CSRF トークン",
            "Cookie の Path / Secure / SameSite",
            "DB 上のロールや承認者マスタ（コードは通っているのにデータで落ちる）",
          ],
        },
        { type: "widget", name: "http" },
      ],
    },
    {
      id: "p-data",
      title: "パターン: 件数・更新結果がおかしい",
      minutes: 8,
      summary: "WHERE、論理削除、別テーブル、コミット。",
      blocks: [
        {
          type: "p",
          text: "画面は 200 で、例外も無い。データだけ期待と違う場合は SQL と投入データを見ます。",
        },
        {
          type: "table",
          headers: ["症状", "確認"],
          rows: [
            ["件数が少ない", "WHERE、削除フラグ、ログインユーザ条件"],
            ["他人の行が見える", "ユーザ ID 条件の漏れ"],
            ["更新したつもりで戻る", "別 ID を更新、トランザクション未コミット、読み取り別 DB"],
            ["画面の値と DB が違う", "キャッシュ、画面の別項目を見ている、タイムゾーン"],
          ],
        },
        {
          type: "p",
          text: "ログに SQL とバインド値を出せるなら、それを検証 DB で再実行します。コード上のメソッド名と、実際に飛んでいる SQL が一致しているかも確認します。",
        },
      ],
    },
    {
      id: "p-env",
      title: "パターン: 環境差",
      minutes: 8,
      summary: "設定、データ、権限、ネットワーク。",
      blocks: [
        {
          type: "p",
          text: "ある環境だけで再現するときは、コード差分より環境差分を先に表にします。",
        },
        { type: "diagram", name: "env-diff", caption: "コードが同じでも、設定とデータと権限は別物です。" },
        {
          type: "ul",
          items: [
            "Spring Boot の起動プロファイルと application-*.yml / application-*.properties",
            "DB の中身（マスタ、件数、文字コード、DDL）",
            "ログインユーザの権限",
            "ファイルパスと書き込み権限",
            "メールや外部 API のモック有無",
            "リバースプロキシ、HTTPS、コンテキストパス",
          ],
        },
        { type: "quiz", id: "ts-env" },
      ],
    },
    {
      id: "p-slow",
      title: "パターン: 遅い",
      minutes: 9,
      summary: "時刻差、SQL、N+1、外部 API、ロック。",
      blocks: [
        {
          type: "p",
          text: "遅さは例外ログに出ないことが多いです。先に、同じリクエストのログのタイムスタンプを並べ、どこで時間が空いているかを見ます。",
        },
        {
          type: "h2",
          text: "タイムスタンプの差",
        },
        {
          type: "p",
          text: "連続した2行の時刻差が、その間にかかった時間です。差が大きい区間が、遅い箇所です。入口メソッドを読む前に、この差で範囲を狭めます。",
        },
        {
          type: "code",
          title: "同じスレッドの INFO（抜粋）",
          code: `2026-08-16 04:12:03.100 INFO  ... [nio-8080-exec-3] j.c.e.s.controller.RequestController : list start
2026-08-16 04:12:03.105 INFO  ... [nio-8080-exec-3] j.c.e.s.service.RequestService : findMine start
2026-08-16 04:12:08.410 INFO  ... [nio-8080-exec-3] j.c.e.s.service.RequestService : findMine done
2026-08-16 04:12:08.412 INFO  ... [nio-8080-exec-3] j.c.e.s.controller.RequestController : list done`,
        },
        {
          type: "p",
          text: "上の例では findMine の start と done のあいだが約 5 秒、前後は数ミリ秒です。遅いのは Service の中（SQL やその前後の I/O）です。Controller の組み立てではありません。start / done は時刻差の読み方の例で、同じ文言が必ず出るわけではありません。既存の通過点でも、見方は同じです。",
        },
        {
          type: "ul",
          items: [
            "ミリ秒まで見る。秒だけだと差が消える",
            "スレッド名（nio-8080-exec-3 など）やリクエスト ID で、同じリクエストの行だけを揃える。別リクエストの行が混ざると差が無意味になる",
            "Network タブの待ち時間と、サーバログの最初と最後の時刻を比べる。Network タブだけ長いなら、アプリに入る前（待ち行列、LB、DNS）",
            "通過点のログが少なければ、空いている区間の中を疑う。足りないときだけ、ID 付きの通過点を一時的に足す",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ログが無い区間",
          text: "start と done のあいだに行が無いこと自体が、範囲です。その中の SQL、外部 API、ロック、ファイル I/O を見ます。",
        },
        {
          type: "h2",
          text: "区間の中で疑うもの",
        },
        { type: "diagram", name: "n-plus-one" },
        {
          type: "table",
          headers: ["兆候", "疑う場所"],
          rows: [
            ["一覧だけ遅い", "件数、ORDER BY、インデックス、N+1"],
            ["1件の詳細が遅い", "関連の逐次取得、外部 API"],
            ["更新が待たされる", "行ロック、別トランザクション"],
            ["時間帯で遅い", "バッチ、同時実行、接続プール枯渇"],
          ],
        },
        {
          type: "p",
          text: "SQL ログの回数を見ます。一覧の行数だけ SELECT が増えるなら N+1 です。",
        },
      ],
    },
    {
      id: "divide",
      title: "届いていない切り分け",
      minutes: 7,
      summary: "アプリの if より手前。",
      blocks: [
        {
          type: "p",
          text: "Java の分岐を読む前に、リクエストがサーバに届いているかを確認します。",
        },
        { type: "diagram", name: "divide", caption: "先に「どの箱まで届いたか」を切る。" },
        {
          type: "table",
          headers: ["確認", "意味"],
          rows: [
            ["Network タブにリクエストが無い", "ボタンの JS、二重送信防止、別ウィンドウ"],
            ["リクエストはあるがサーバログが無い", "別インスタンス、パス違い、LB"],
            ["SQLException", "DB 接続、SQL、ロック、DB ユーザ権限"],
            ["接続タイムアウト", "FW、DNS、接続先設定"],
            ["権限エラーなのにコードは permit", "DB のロール、グループマスタ"],
          ],
        },
      ],
    },
  ],
};
