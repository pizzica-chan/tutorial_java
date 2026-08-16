import type { Track } from "../types";

export const troubleshootTrack: Track = {
  id: "troubleshoot",
  no: "06",
  title: "トラブルシュート",
  kicker: "PATTERNS",
  description: "調査手順、ログの場所、ログで処理を追う、ネットワーク疎通、症状別の切り分け。",
  accent: "#d46a5c",
  lessons: [
    {
      id: "loop",
      title: "調査手順",
      minutes: 8,
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
            ["nginx の access.log / error.log", "手前に nginx がある。静的ファイルやプロキシの切り分け"],
            ["Apache の access_log / error_log", "手前に Apache（httpd）がある。同上"],
          ],
        },
        {
          type: "h2",
          text: "HTTPサーバのログ（Apache / nginx）",
        },
        {
          type: "p",
          text: "手前に Apache や nginx がある構成では、ブラウザが最初に当たるのは HTTPサーバです。logback のアプリログに載るのは、後ろの Java まで転送されたリクエストだけです。CSS や JS を HTTPサーバが直接返しているとき、Controller のログには出ません。",
        },
        {
          type: "ul",
          items: [
            "access.log（アクセスログ）… 届いた URL、ステータス、時刻。静的ファイルの 404 もここに残ることが多い",
            "error.log（エラーログ）… 設定ミス、後ろの Tomcat への接続失敗、SSL の問題",
          ],
        },
        {
          type: "table",
          headers: ["症状", "アプリログ", "HTTPサーバログを見る理由"],
          rows: [
            ["HTML は 200、CSS / JS だけ 404", "一覧の INFO は出る", "静的ファイルは手前で返している。パスや alias / location のずれ"],
            ["ブラウザは 502 / 503", "無い、または少ない", "後ろのアプリに届いていない。upstream 接続失敗"],
            ["操作したのにアプリログが無い", "無い", "手前で止まった、別ホストに振られた、静的だけ返した、など"],
            ["HTTPS の証明書エラー", "関係ないことが多い", "TLS の終端はアプリより手前（HTTPサーバ、LB など）"],
            ["URL は合っているのに 404", "無いことがある", "手前の location が別ディレクトリを見ている"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "SSL 終端の位置",
          text: "SSL 終端は、必ずしも Apache / nginx で行われるとは限りません。ロードバランサや CDN など、HTTPサーバより前のレイヤで TLS を解読する構成もあります。WAF で遮断されたリクエストもアプリまで届かないことが多いです。証明書エラーはその手前で起きていることが多く、アプリの logback には出ません。",
        },
        {
          type: "code",
          title: "nginx の access.log の例（combined 形式）",
          code: `192.0.2.10 - - [16/Aug/2026:04:12:03 +0900] "GET /shinsei/css/app.css HTTP/1.1" 404 153 "-" "Mozilla/5.0 ..."`,
        },
        {
          type: "p",
          text: "上の例なら、/shinsei/css/app.css への GET が 404 です。同じ時刻に /shinsei/requests は 200 なら、動的処理は Java に届き、CSS だけ手前の設定がずれている、と切り分けできます。置き場所と書式は環境次第です。",
        },
        {
          type: "callout",
          kind: "note",
          title: "内蔵 Tomcat だけのとき",
          text: "Spring Boot を java -jar だけで動かし、手前に Apache / nginx が無い環境では、HTTPサーバ用のログはありません。静的ファイルもアプリが返すことが多く、切り分けは Network タブとアプリログで足りることが多いです。",
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
          type: "p",
          text: "角括弧 [ ] のなかの nio-8080-exec-3 はスレッド名です。同じ操作の行を揃える手順は次の項目です。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "ログが無い",
          text: "操作時刻にアプリログが無いこと自体が情報です。別インスタンス、別ファイル、リクエストが Java まで届いていないことを疑います。手前に HTTPサーバがあるなら、access.log に行があるかも見ます。",
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
        { type: "quiz", id: "ts-http-log" },
      ],
    },
    {
      id: "log-follow",
      title: "ログで処理を追う",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "出力先と 1 行の読み方は前の項目です。ここでは、並んだ行から今の操作だけを取り出し、通った Java メソッドの順を見ます。ログ例は申請くんです。",
        },
        {
          type: "h2",
          text: "Java メソッドの順番",
        },
        {
          type: "p",
          text: "同じリクエストの行を時刻順に並べると、通ったクラスの順が見えます。行のクラス名は Logger で出力したクラスです。",
        },
        {
          type: "code",
          title: "同じスレッドの通過点（申請くん・MyBatis）",
          code: `04:12:03.100 INFO  [nio-8080-exec-3] j.c.e.s.controller.RequestController : list start userId=7
04:12:03.105 INFO  [nio-8080-exec-3] j.c.e.s.service.RequestService : findMine start userId=7
04:12:03.110 DEBUG [nio-8080-exec-3] j.c.e.s.mapper.RequestMapper : ==>  Preparing: SELECT ... WHERE applicant_id = ? OR approver_id = ?
04:12:03.112 DEBUG [nio-8080-exec-3] j.c.e.s.mapper.RequestMapper : ==> Parameters: 7(Long), 7(Long)
04:12:03.115 DEBUG [nio-8080-exec-3] j.c.e.s.mapper.RequestMapper : <==      Total: 3
04:12:03.118 INFO  [nio-8080-exec-3] j.c.e.s.service.RequestService : findMine done count=3
04:12:03.120 INFO  [nio-8080-exec-3] j.c.e.s.controller.RequestController : list done`,
        },
        {
          type: "p",
          text: "Controller の list のあと Service の findMine、そのあと Mapper です。この並びはライブラリが違っても同じ型です。Mapper の 3 行（Preparing / Parameters / Total）は MyBatis の DEBUG の書き方で、JPA や JDBC なら文言は違います。間に Filter や Interceptor の行が挟まることもあります。Java のメソッド名は、メッセージに書いてあるときだけ分かります。",
        },
        {
          type: "ul",
          items: [
            "同じクラスの別の Java メソッドは、メッセージで見分ける",
            "@Async やキューに渡すと、続きは別のスレッド名になる。メール送信の行が exec-3 に無い、など",
            "start と done が対になっていれば、そのあいだがその Java メソッドの中",
          ],
        },
        {
          type: "h2",
          text: "混在した本番ログから一本を拾う",
        },
        {
          type: "p",
          text: "本番は同時に何本もリクエストが動きます。時刻だけで拾うと、他人の行が混ざります。",
        },
        {
          type: "code",
          title: "同じ秒に混ざった行（MyBatis の Parameters 例）",
          code: `04:12:03.100 INFO  [nio-8080-exec-3] ...RequestController : list start userId=7
04:12:03.102 INFO  [nio-8080-exec-5] ...RequestController : detail start userId=22
04:12:03.105 INFO  [nio-8080-exec-3] ...RequestService : findMine start userId=7
04:12:03.108 INFO  [nio-8080-exec-5] ...RequestService : findById start userId=22
04:12:03.110 DEBUG [nio-8080-exec-3] ...RequestMapper : ==> Parameters: 7(Long)`,
        },
        {
          type: "p",
          text: "userId=7 の一覧なら、まず 7 で検索します。ヒットした行のスレッド名は nio-8080-exec-3 です。その名前と、操作の前後数秒で再検索すると、上の list → findMine → Mapper の行が揃います。Parameters の書き方は MyBatis の例です。exec-5 は別の人の詳細です。",
        },
        {
          type: "ol",
          items: [
            "操作した時刻を決める。サーバログのタイムゾーンと、画面を見た側の時計がずれていないか",
            "複数台なら、操作が当たったインスタンスのファイルを開く",
            "メッセージや MDC に userId、申請 ID、セッション ID があれば、それで絞る",
            "ヒットした行のスレッド名（[nio-8080-exec-3]）を控える",
            "そのスレッド名と、操作の前後の時刻で再検索する",
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "スレッド名は使い回される",
          text: "Tomcat の exec-3 は、前のリクエストが終わったあと、別のリクエストに使われます。スレッド名だけで日付を問わず拾うと、別操作が混ざります。時刻の幅を付けます。",
        },
        {
          type: "ul",
          items: [
            "アプリが userId をログに出していないこともある。そのときは申請 ID、画面の固有メッセージ、URL",
            "セッション ID は、MDC やメッセージに出ているときだけ使える。Cookie の値そのものがログに無いことも多い",
            "アクセスログ（URL と時刻）とアプリログの時刻を合わせると、処理の入口の特定に使える",
          ],
        },
        {
          type: "h2",
          text: "MyBatis の SQL",
        },
        {
          type: "p",
          text: "ここからは MyBatis の DEBUG に限った話です。Mapper の DEBUG を出すと、実行された SQL が見えます。本番では普段 DEBUG を出していないことが多いです。検証環境では、または調査のあいだだけレベルを上げます。終わったら戻します。",
        },
        {
          type: "code",
          title: "MyBatis の DEBUG（申請くんの findMine）",
          code: `==>  Preparing: SELECT id, title, status, applicant_id, approver_id, created_at
FROM t_request WHERE applicant_id = ? OR approver_id = ? ORDER BY created_at DESC
==> Parameters: 7(Long), 7(Long)
<==      Total: 3`,
        },
        {
          type: "ul",
          items: [
            "Preparing が SQL 文。? がプレースホルダ",
            "Parameters がバインドした値。上の例なら applicant_id も approver_id も 7",
            "Total がその SQL の件数。0 なら、その条件に合う行が無かった",
          ],
        },
        {
          type: "p",
          text: "出す先は logging.level です。申請くんなら Mapper のパッケージ（jp.co.example.shinsei.mapper など）に DEBUG を付けます。XML の id と Java のメソッド名が Logger に出ることがあります。",
        },
        {
          type: "callout",
          kind: "note",
          title: "形式は設定次第",
          text: "Preparing / Parameters は MyBatis の DEBUG で多い形です。JDBC のログや別ライブラリだと書き方が違います。見るのは文、バインド値、件数です。",
        },
        { type: "quiz", id: "ts-log-pick" },
        { type: "quiz", id: "ts-log-sql" },
      ],
    },
    {
      id: "stack",
      title: "スタックトレース",
      minutes: 12,
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
          text: "Spring の長いクラス名の行で止まらないでください。直すのは RequestService や RequestMapper です。",
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
            ["GET では出るが POST で 404", "HTTP メソッドのマッピング。Spring の @GetMapping しか無いなど"],
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
          text: "連続した2行の時刻差が、その間にかかった時間です。差が大きい区間が、遅い箇所です。処理の入口のメソッドを読む前に、この差で範囲を狭めます。",
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
      id: "net-check",
      title: "ネットワークの疎通確認",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "アプリのログにリクエストが無い、ブラウザがタイムアウトする、といったときは、Java のコードより手前を疑います。ここでは、自分の PC からコマンドで届く箱を切り分けます。",
        },
        {
          type: "h2",
          text: "TCP/IP と HTTP の層",
        },
        {
          type: "p",
          text: "ブラウザの Network タブが見ているのは HTTP です。その下に TCP（ポートまで届くか）があり、さらに下に IP（ホストまで届くか）があります。コマンドごとに見ている層が違います。",
        },
        {
          type: "diagram",
          name: "protocol-stack",
          caption: "上ほどアプリに近い。下の層が通らなければ、上の HTTP も届きません。",
        },
        {
          type: "ul",
          items: [
            "ping … ホストが応答するか（ICMP）。HTTP とは別の話",
            "traceroute / tracert … 途中のどこで止まったか",
            "Test-NetConnection / nc / telnet … TCP でポートが開いているか",
            "curl … HTTP でパスまで届き、どんな応答が返るか",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "打つ場所で結果が変わる",
          text: "自分の PC からと、サーバからでは通る道が違います。ブラウザが届くのに開発 PC から届かない、ということもあります。再現に近い場所から打ちます。",
        },
        {
          type: "h2",
          text: "ホストまで届くか（ping）",
        },
        {
          type: "code",
          title: "例（検証ホスト intranet.example.co.jp）",
          code: `# Windows（PowerShell または cmd）
ping intranet.example.co.jp

# Linux
ping -c 4 intranet.example.co.jp`,
        },
        {
          type: "ul",
          items: [
            "応答がある … 名前解決でき、ホスト自体には届いている（ICMP が許可されている）",
            "要求がタイムアウト … ホストダウン、経路の遮断、ICMP が FW で拒否、など",
            "名前解決できない … DNS の設定や向き先を疑う",
          ],
        },
        {
          type: "p",
          text: "ping が通らなくても HTTP は通ること、逆に ping は通るがアプリのポートは閉じていることもあります。ping だけで決め打ちしません。",
        },
        {
          type: "h2",
          text: "経路（traceroute）",
        },
        {
          type: "code",
          title: "例",
          code: `# Windows
tracert intranet.example.co.jp

# Linux（環境により traceroute または tracepath）
traceroute intranet.example.co.jp`,
        },
        {
          type: "p",
          text: "途中のホップが表示され、どこで * やタイムアウトが続くかを見ます。社内のどの境界で止まっているかの手がかりになります。",
        },
        {
          type: "h2",
          text: "ポートまで開いているか（TCP）",
        },
        {
          type: "p",
          text: "申請くんの検証が 8080 なら、HTTP の前に TCP で 8080 が開いているかを見ます。アプリが起動していない、別ポートで待ち受けている、FW で閉じている、などが分かれます。",
        },
        {
          type: "code",
          title: "例（ポート 8080）",
          code: `# Windows（PowerShell）
Test-NetConnection -ComputerName intranet.example.co.jp -Port 8080
# TcpTestSucceeded : True なら TCP 接続できた

# Linux（nc が入っている環境）
nc -zv intranet.example.co.jp 8080

# Linux / Windows（telnet クライアントが入っている場合）
telnet intranet.example.co.jp 8080`,
        },
        {
          type: "ul",
          items: [
            "TCP 接続成功 … そのポートで何かが待ち受けている。アプリ未起動ならすぐ切れることもある",
            "接続拒否（connection refused）… ホストまでは届いたが、そのポートで待ち受けが無い",
            "タイムアウト … FW、ルータ、セキュリティグループ、経路のどこかで止まっていることが多い",
          ],
        },
        {
          type: "h2",
          text: "HTTP まで届くか（curl）",
        },
        {
          type: "p",
          text: "TCP が通っても、URL パスやコンテキストパスが違えば HTTP は 404 になります。curl はブラウザに近い形で HTTP を送れます。",
        },
        {
          type: "code",
          title: "例（申請一覧）",
          code: `# ヘッダだけ見る（本文は捨てる）
curl -I http://intranet.example.co.jp:8080/shinsei/requests

# 詳細（TLS 証明書の検証を緩める例。社内検証のみ）
curl -vk https://intranet.example.co.jp/shinsei/requests`,
        },
        {
          type: "ul",
          items: [
            "200 や 302 … HTTP までは届き、アプリか前段の HTTP サーバが応答した",
            "404 … 届いているがパスやマッピングが違う",
            "接続できない / タイムアウト … TCP 以前、または TLS・プロキシの手前",
            "ブラウザだけ失敗 … Cookie、プロキシ設定、別ネットワークからのアクセス制限も疑う",
          ],
        },
        {
          type: "h2",
          text: "結果から切り分ける",
        },
        {
          type: "table",
          headers: ["結果の型", "よくある意味", "次に見るもの"],
          rows: [
            ["ping 不可", "DNS、ホスト停止、ICMP 拒否", "名前解決、別経路からの ping、ICMP 以外の確認"],
            ["ping 可、TCP 不可", "ポート閉鎖、アプリ未起動、FW", "プロセス、listen ポート、FW ルール、LB の向き先"],
            ["TCP 可、curl で HTTP エラー", "パス違い、コンテキストパス、リダイレクト", "URL、server.servlet.context-path、Controller のマッピング"],
            ["curl 可、ブラウザだけ不可", "クライアント側の設定差", "プロキシ、VPN、Cookie、別マシンからの再現"],
            ["すべて可、ログだけ無い", "別インスタンス、別ログファイル", "LB の振り分け、ログの出力先"],
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "1つ成功ですべて OK ではない",
          text: "ping が通ったから HTTP も通る、TCP が通ったから業務的に正しい応答、とは限りません。層ごとに確認し、最後に Network タブやアプリログと突き合わせます。",
        },
        { type: "quiz", id: "ts-net-check" },
      ],
    },
    {
      id: "divide",
      title: "届いていない切り分け",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "Java の分岐を読む前に、リクエストがサーバに届いているかを確認します。コマンドの打ち方は前の項目です。ここでは症状と意味の対応だけまとめます。",
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
