import type { Track } from "../types";

export const troubleshootTrack: Track = {
  id: "troubleshoot",
  no: "06",
  title: "トラブルシューティング手法",
  kicker: "PATTERNS",
  description: "調査手順、ログの場所、ネットワーク疎通、どこまで届いたか、アプリのログで処理を追う、症状別の切り分け。",
  accent: "#d46a5c",
  lessons: [
    {
      id: "loop",
      title: "調査手順",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "いきなりソースは見ません。次の順で進めましょう。",
        },
        {
          type: "h2",
          text: "調査の手順",
        },
        {
          type: "steps",
          items: [
            {
              title: "再現する",
              text: "同じ操作をする。できないなら、できない条件（権限、データ、時間帯）が情報です。",
            },
            {
              title: "当たりをつける",
              text: "クライアント、ネットワーク、サーバのどれか。",
            },
            {
              title: "区間を切る",
              text: "ブラウザまで来ているか、サーバに届いているか、DB まで行っているか。Network タブとログで分ける。値の中身は、止められるならデバッガ。",
            },
            {
              title: "仮説を1つにする",
              text: "権限と SQL と JS が同時に怪しいのは、切り分けになっていません。確認コストが低いものから潰しましょう。",
            },
            {
              title: "変更は最小",
              text: "既存のログを先に読む。確認用のログ追加と、修正を混ぜない。切り分け用の変更は後で戻しましょう。",
            },
          ],
        },
        {
          type: "h2",
          text: "当たりをつける",
        },
        {
          type: "p",
          text: "原因はクライアント、ネットワーク、サーバのどれかに大別できることが多いです。",
        },
        { type: "diagram", name: "cause-sides" },
        {
          type: "ul",
          items: [
            "クライアント … ブラウザや PC 側。リクエストが送られていない、見た目だけおかしい、自分の PC だけ失敗する、など",
            "ネットワーク … 途中の経路。タイムアウト、接続できない、アプリのログにリクエストが無い、など",
            "サーバ … リクエストは届いている側。5xx や例外、件数だけおかしい、など。DB もここに含めます",
          ],
        },
        {
          type: "h2",
          text: "どこを先に確認するか",
        },
        {
          type: "p",
          text: "症状から、最初に見るものの例です。",
        },
        {
          type: "table",
          headers: ["症状の例", "最初に確認すること", "それで分かること"],
          rows: [
            [
              "画面にエラー、または真っ白",
              "Network タブのステータスコード。5xx なら同時刻のサーバログ",
              "画面の文言はアプリが決める。5xx はサーバ側の失敗と読む。中身はログを見る",
            ],
            [
              "見た目だけおかしい（色、レイアウト）",
              "HTML とは別の、CSS / JS のリクエスト。404 になっていないか",
              "色やレイアウトは CSS / JS が担当する。HTML が 200 でも、別リクエストが失敗していることがある",
            ],
            [
              "指定の画面が開かない",
              "Network タブにリクエストがあるか。あるなら URL とステータスコード",
              "画面が出ない原因を、リクエストが無い・URL のずれ・サーバ側の失敗に分けられる",
            ],
            [
              "操作のあとログイン画面に戻される、または権限エラーのメッセージ",
              "Network タブのステータスコードと Location、Cookie",
              "ステータスコードと Location で飛ばされた先が分かる。Cookie でセッション ID を送っているかが分かる",
            ],
            [
              "200 で例外も無く、件数や中身だけおかしい",
              "実行された SQL と、その条件の DB の行",
              "例外が無く 200 なら、処理は応答まで終わっている。おかしいのは読んだ行か条件",
            ],
            [
              "ボタンを押しても画面が変わらない",
              "Network タブに新しいリクエストがあるか",
              "画面が変わらなくても、アプリは呼ばれていないことがある",
            ],
            [
              "遅い",
              "Network タブの待ち時間。アプリに届いているなら、ログの時刻の空き",
              "遅さの原因は、Network の待ちならアプリの前、ログの時刻差ならアプリの中",
            ],
            [
              "操作したのにアプリログが無い、待ち続ける",
              "リクエストがアプリまで届いたか。手前の HTTP サーバ、別インスタンス、ネットワーク",
              "ログが無ければアプリに届いていないか、見ているログが違う。Controller の中はまだ関係ない",
            ],
            [
              "ある環境だけで再現する",
              "設定、データ、権限の差",
              "同じコードでも、接続先やマスタ、ログインユーザが違うと結果が変わる",
            ],
            [
              "更新はできたが、メールや通知だけ来ない",
              "アプリのログの外部呼び出し",
              "画面の更新とメール・通知は別処理。後者の成否は画面には出ない",
            ],
          ],
        },
        { type: "quiz", id: "ts-symptom-start" },
      ],
    },
    {
      id: "logs",
      title: "ログの場所と読み方",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "先に、ログの出力先を確認しましょう。そのあと、操作した時刻の行を読みます。",
        },
        {
          type: "h2",
          text: "出力先を確認する",
        },
        {
          type: "p",
          text: "出力先はアプリと環境で違います。決まった一箇所はありません。次の順で探しましょう。",
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
        { type: "diagram", name: "log-where", caption: "中身は同じ記録です。出力先が違うだけです。" },
        {
          type: "table",
          headers: ["よくある出力先", "見るとき"],
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
          text: "HTTP サーバのログ（Apache / nginx）",
        },
        {
          type: "p",
          text: "手前に Apache や nginx がある構成では、ブラウザが最初に当たるのは HTTP サーバです。logback のアプリログに載るのは、後ろの Java まで転送されたリクエストだけです。CSS や JS を HTTP サーバが直接返しているとき、Controller のログには出ません。",
        },
        {
          type: "ul",
          items: [
            "access.log（アクセスログ）… 届いた URL、ステータスコード、時刻。静的ファイルの 404 もここに残ることが多い",
            "error.log（エラーログ）… 設定ミス、後ろの Tomcat への接続失敗、SSL の問題",
          ],
        },
        {
          type: "table",
          headers: ["症状", "アプリログ", "HTTP サーバのログを見る理由"],
          rows: [
            ["HTML は 200、CSS / JS だけ 404", "一覧の INFO は出る", "静的ファイルは手前で返している。パスや alias / location のずれ"],
            ["ブラウザは 502 / 503", "無い、または少ない", "後ろのアプリに届いていない。upstream 接続失敗"],
            ["操作したのにアプリログが無い", "無い", "手前で止まった、別ホストに振られた、静的だけ返した、など"],
            ["HTTPS の証明書エラー", "関係ないことが多い", "TLS の終端はアプリより手前（HTTP サーバ、LB など）"],
            ["URL は合っているのに 404", "無いことがある", "手前の location が別ディレクトリを見ている"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "SSL 終端の位置",
          text: "SSL 終端は、必ずしも Apache / nginx で行われるとは限りません。ロードバランサや CDN など、HTTP サーバより前のレイヤで TLS を解読する構成もあります。WAF で遮断されたリクエストもアプリまで届かないことが多いです。証明書エラーはその手前で起きていることが多く、アプリの logback には出ません。",
        },
        {
          type: "code",
          title: "nginx の access.log の例（combined 形式）",
          code: `192.0.2.10 - - [16/Aug/2026:04:12:03 +0900] "GET /shinsei/css/app.css HTTP/1.1" 404 153 "-" "Mozilla/5.0 ..."`,
        },
        {
          type: "p",
          text: "上の例なら、/shinsei/css/app.css への GET が 404 です。同じ時刻に /shinsei/requests は 200 なら、動的処理は Java に届き、CSS だけ手前の設定がずれている、と切り分けできます。出力先と書式は環境次第です。",
        },
        {
          type: "callout",
          kind: "note",
          title: "内蔵 Tomcat だけのとき",
          text: "Spring Boot を java -jar だけで動かし、手前に Apache / nginx が無い環境では、HTTP サーバ用のログはありません。静的ファイルもアプリが返すことが多く、切り分けは Network タブとアプリログで足りることが多いです。",
        },
        {
          type: "callout",
          kind: "tip",
          title: "複数台",
          text: "ロードバランサの後ろだと、ログは別インスタンスに出ることがあります。操作が当たったサーバを特定してから読みましょう。",
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
          text: "DEBUG は量が多いので、普段は出していないことが多いです。必要なときだけ、そのパッケージのレベルを上げましょう。上げたら調査後に戻しましょう。",
        },
        {
          type: "p",
          text: "角括弧 [ ] のなかの nio-8080-exec-3 はスレッド名です。同じ操作の行を揃える手順は「アプリのログで処理を追う」です。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "ログが無い",
          text: "操作時刻にアプリログが無いこと自体が情報です。別インスタンス、別ファイル、リクエストが Java まで届いていないことを疑いましょう。手前に HTTP サーバがあるなら、access.log に行があるかも見ましょう。",
        },
        {
          type: "h2",
          text: "足りないときだけ足す",
        },
        {
          type: "p",
          text: "既存ログで到達も例外も分からないとき、一時的に ID と通過点を出しましょう。調査が終わったら戻しましょう。値を今の行で見たいだけなら、ログを足すよりデバッガが有効です。共有環境など、処理を止めるのが難しいときは、ログで対応しましょう。",
        },
        {
          type: "callout",
          kind: "warn",
          title: "共有環境",
          text: "検証用環境など他人と使っている場合、ログレベルの変更や調査用の出力は、他の人のログを読みにくくし、ディスクも食います。足す前に、その環境でよいか確認しましょう。",
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
      id: "net-check",
      title: "ネットワークの疎通確認",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Java のコードより手前や外側の経路を疑うのは、次のようなときです。",
        },
        {
          type: "ul",
          items: [
            "アプリのログにリクエストが無い",
            "ブラウザがタイムアウトする",
            "外部 API への接続エラーがログに出る",
          ],
        },
        {
          type: "p",
          text: "ここでは ping や curl などで、ホスト・ポート・HTTP のどこまで通るかを確認しましょう。",
        },
        {
          type: "h2",
          text: "TCP/IP と HTTP の層と対応する疎通確認コマンド",
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
          text: "打つ場所で結果が変わります。自分の PC からと、サーバからでは通る道が違います。ブラウザが届くのに開発 PC から届かない、サーバ上のアプリだけ外部 API に失敗する、ということもあります。再現に近い場所から打ちましょう。",
        },
        {
          type: "h2",
          text: "ホストまで届くか（ping）",
        },
        {
          type: "code",
          title: "例（検証用環境のホスト intranet.example.co.jp）",
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
          text: "ping が通らなくても HTTP は通ること、逆に ping は通るがアプリのポートは閉じていることもあります。ping だけで決め打ちは避けましょう。",
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
          text: "途中のホップが表示され、どこで * やタイムアウトが続くかを見ましょう。社内のどの境界で止まっているかの手がかりになります。",
        },
        {
          type: "h2",
          text: "ポートまで開いているか（TCP）",
        },
        {
          type: "p",
          text: "申請くんの検証用環境が 8080 なら、HTTP の前に TCP で 8080 が開いているかを見ましょう。アプリが起動していない、別ポートで待ち受けている、FW で閉じている、などが分かれます。",
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
          text: "ping が通ったから HTTP も通る、TCP が通ったから業務的に正しい応答、とは限りません。層ごとに確認し、最後に Network タブやアプリログと突き合わせましょう。",
        },
        { type: "quiz", id: "ts-net-check" },
      ],
    },
    {
      id: "divide",
      title: "どこまで届いたか",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "Java の分岐を読む前に、リクエストがサーバに届いているかを確認しましょう。コマンドの打ち方は前の「ネットワークの疎通確認」です。ここでは、確認と疑わしい箇所の対応だけまとめます。",
        },
        { type: "diagram", name: "divide", caption: "先に「どの箱まで届いたか」を切る。" },
        {
          type: "table",
          headers: ["確認", "疑わしい箇所"],
          rows: [
            ["Network タブにリクエストが無い", "サーバには届いていないことが多い。ボタンの JS、二重送信防止、別ウィンドウなど"],
            ["リクエストはあるがサーバログが無い", "見ているログが違うことがある。別インスタンス、パス違い、LB など"],
            ["SQLException", "アプリまでは届いている。DB 接続、SQL、ロック、DB 接続ユーザの権限など"],
            ["接続タイムアウト", "FW、DNS、接続先設定など。外部 API なら、あとの「トラブル例：外部システム / 外部 API」で向き先を特定してから、前の「ネットワークの疎通確認」を使う"],
            ["外部 API への接続失敗（例: ResourceAccessException）", "自社アプリは動いていることが多い。アプリサーバから外部ホスト・ポートへの TCP / curl"],
          ],
        },
      ],
    },
    {
      id: "log-follow",
      title: "アプリのログで処理を追う",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "出力先と 1 行の読み方は「ログの場所と読み方」です。ここでは、並んだ行から今の操作だけを取り出し、通った Java メソッドの順を見ましょう。ログ例は申請くんです。",
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
          text: "userId=7 の一覧なら、まず 7 で検索しましょう。ヒットした行のスレッド名は nio-8080-exec-3 です。その名前と、操作の前後数秒で再検索すると、上の list → findMine → Mapper の行が揃います。Parameters の書き方は MyBatis の例です。exec-5 は別の人の詳細です。",
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
          text: "Tomcat の exec-3 は、前のリクエストが終わったあと、別のリクエストに使われます。スレッド名だけで日付を問わず拾うと、別操作が混ざります。時刻の幅を付けましょう。",
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
          text: "ここからは MyBatis の DEBUG に限った話です。Mapper の DEBUG を出すと、実行された SQL が見えます。本番では普段 DEBUG を出していないことが多いです。検証用環境では、または調査のあいだだけレベルを上げましょう。終わったら戻しましょう。",
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
          text: "出す先は logging.level です。申請くんなら Mapper のパッケージ（jp.co.example.shinsei.mapper など）に DEBUG を付けましょう。XML の id と Java のメソッド名が Logger に出ることがあります。その SQL をソースで探す手順は、「リクエストの追跡」の「SQL の突き合わせ」です。",
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
          caption: "上から見て、自分たちが書いたコードのパッケージ名がある最初の行の、その行番号を調べましょう。",
        },
        {
          type: "p",
          text: "申請くんなら、自分たちが書いたコードのパッケージは jp.co.example.shinsei です。org.springframework や java. はライブラリや Java 本体なので、直す場所ではありません。$$Enhancer や $Proxy も生成コードなので飛ばしましょう。",
        },
        {
          type: "h2",
          text: "1行の読み方",
        },
        { type: "diagram", name: "stack-line", caption: "右端の括弧が、ソースのファイルと行です。" },
        {
          type: "p",
          text: "RequestService.java:41 なら、プロジェクト内の RequestService.java の 41 行目です。教材の抜粋では行を省略しているので、数字は教材上の位置です。Unknown Source とだけある行は、ソースが無いので飛ばしましょう。",
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
      title: "トラブル例：500 / 例外",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "利用者には「エラーが発生しました」としか出なくても、サーバログには例外があります。画面操作の時刻とログの時刻を合わせましょう。",
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
          text: "フロントが JSON を期待しているのに、500 の HTML エラーページが返ると、画面にはパースエラーとだけ出ることがあります。Network タブのステータスコードと Content-Type を先に見ましょう。",
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
      title: "トラブル例：404 / 画面が開かない",
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
      title: "トラブル例：401 / 403 / ログインへ戻る",
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
            ["権限がありません", "ステータスコードは 403 と読むことが多いが、200 のエラー画面などアプリ次第。ロール、hasRole、承認者 ID"],
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
      title: "トラブル例：件数・更新結果がおかしい",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "画面は 200 で、例外も無い。データだけ期待と違う場合は SQL と、DB に入っている行を見ましょう。",
        },
        {
          type: "table",
          headers: ["症状", "確認"],
          rows: [
            ["件数が少ない", "WHERE、削除フラグ、ログインユーザ条件。その条件の行が無い"],
            ["他人の行が見える", "ログインユーザ ID 条件の漏れ"],
            ["更新したつもりで戻る", "別 ID を更新、トランザクション未コミット、読み取り別 DB"],
            ["画面の値と DB が違う", "キャッシュ、画面の別項目を見ている、タイムゾーン"],
            ["SQL の結果は画面と同じなのに、期待と違う", "行の値がおかしい、マスタのずれ、別の DB"],
          ],
        },
        {
          type: "p",
          text: "ログに SQL とバインド値を出せるなら、検証用環境の DB で再実行しましょう。SELECT ならそのまま試せます。UPDATE や DELETE はデータを書き換えるので、「リクエストの追跡」の「SQL の突き合わせ」の注意を見ましょう。結果が画面と同じなら、SQL は合っています。コード上のメソッド名と、実際に飛んでいる SQL が一致しているかも確認しましょう。",
        },
      ],
    },
    {
      id: "p-env",
      title: "トラブル例：環境差",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "ある環境だけで再現するときは、コード差分より環境差分を先に表にしましょう。",
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
      title: "トラブル例：遅い",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "遅さは例外ログに出ないことが多いです。先に、同じリクエストのログのタイムスタンプを並べ、どこで時間が空いているかを見ましょう。",
        },
        {
          type: "h2",
          text: "タイムスタンプの差",
        },
        {
          type: "p",
          text: "連続した2行の時刻差が、その間にかかった時間です。差が大きい区間が、遅い箇所です。処理の入口のメソッドを読む前に、この差で範囲を狭めましょう。",
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
          text: "start と done のあいだに行が無いこと自体が、範囲です。その中の SQL、外部 API、ロック、ファイル I/O を見ましょう。",
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
          text: "SQL ログの回数を見ましょう。一覧の行数だけ SELECT が増えるなら N+1 です。",
        },
      ],
    },
    {
      id: "p-external",
      title: "トラブル例：外部システム / 外部 API",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "DB 以外にも、画面の外へ出る処理があります。画面の操作は自分のアプリまで届いていても、外部の応答待ちや接続失敗で止まることがあります。",
        },
        {
          type: "ul",
          items: [
            "別システムへの HTTP",
            "メール送信",
            "ファイル連携",
          ],
        },
        {
          type: "p",
          text: "外部 API とは、自社アプリの外にある HTTP の API や、SMTP・SFTP など別プロセスへの接続をまとめて呼ぶ言い方です。社内の人事マスタ API も、クラウドの通知 API も同じ切り分けです。",
        },
        {
          type: "table",
          headers: ["症状", "外部を疑う手がかり"],
          rows: [
            ["画面がずっと待つ、タイムアウト", "ログの2行のあいだだけ数秒〜数十秒空く。DB の SQL はすぐ終わっている"],
            ["業務エラー文だけ出て、スタックが短い", "メッセージに外部サービス名や連携失敗の文言がある"],
            ["検証用環境だけ成功、本番だけ失敗", "接続先 URL、認証情報、FW、モックの有無が環境で違う"],
            ["データの一部だけ古い・空", "DB は更新されたが、表示用に別 API から取った値が失敗している"],
            ["承認は成功したのに通知が来ない", "DB 更新のログはある。そのあと MailService や通知 API の行が無い、または ERROR"],
          ],
        },
        {
          type: "h2",
          text: "ログで範囲を切る",
        },
        {
          type: "p",
          text: "処理の入口から Service へ降りたあと、Mapper の SQL が終わった時刻と、次のログの時刻のあいだが空いていれば、その間で外部 I/O をしていることが多いです。",
        },
        {
          type: "code",
          title: "承認後に通知 API を呼ぶ例（抜粋）",
          code: `04:12:03.200 INFO  ... RequestService : approve start requestId=12
04:12:03.205 DEBUG ... RequestMapper : <==      Total: 1
04:12:03.206 INFO  ... RequestService : db updated requestId=12
04:12:08.910 ERROR ... NotificationClient : POST https://notify.example.internal/api/send failed
org.springframework.web.client.ResourceAccessException: I/O error on POST request ...
04:12:08.912 INFO  ... RequestService : approve done`,
        },
        {
          type: "p",
          text: "DB 更新は 03.206 で終わっています。ERROR は 08.910 です。あいだは外部への POST 待ちです。例外クラス名はライブラリごとに違いますが、接続失敗・タイムアウト・HTTP 4xx / 5xx を示すことが多いです。",
        },
        {
          type: "h2",
          text: "確認すること",
        },
        {
          type: "table",
          headers: ["確認", "理由"],
          rows: [
            ["ソースで外部呼び出し箇所を特定する", "RestTemplate、WebClient、Feign、HttpClient、メール送信クラスなど。名前はプロジェクト次第"],
            ["application.yml の URL・タイムアウト・認証", "プロファイルごとに向き先が違うことがある"],
            ["モックやスタブの有無", "ローカルだけ偽の応答を返し、検証用環境では本物につなぐ構成がある"],
            ["アプリサーバからの疎通", "開発 PC の curl が通っても、サーバからは FW で閉じていることがある → 「ネットワークの疎通確認」"],
            ["外部の応答本文", "200 でも JSON の形が違うと、パース例外になる。Network タブではアプリ⇔外部 API の通信は確認できない。サーバログや一時的なログ出力で見る"],
            ["リトライや非同期", "画面には成功と出たが、あとから通知だけ失敗している"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ブラウザの Network タブだけでは足りない",
          text: "Network タブで見えるのは、ブラウザと自社アプリの間です。アプリから外部 API へ出る通信は、通常そこでは確認できません。サーバ側のログ、または調査用に URL とステータスコードだけ一時的に出しましょう。",
        },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "承認処理は DB を更新したあと、MailService で申請者へメールを送る想定です。画面は承認済みなのにメールが来ないときは、Mapper の更新ログのあとに MailService の行があるかを見ましょう。SMTP サーバや通知 API の向き先は application.yml にあることが多いです。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "DB を直しても直らない",
          text: "一覧の件数やステータスは DB で説明できるのに、社員名や部署名だけ空、といったときは、別システムのマスタ API が失敗していることがあります。SQL だけを見続けないでください。",
        },
        {
          type: "h2",
          text: "疎通確認をするとき",
        },
        {
          type: "p",
          text: "ログと設定で「どの外部へ出ているか」まで分かったあと、接続そのものが疑われるときは、すでに見た「ネットワークの疎通確認」のコマンドを使いましょう。",
        },
        {
          type: "table",
          headers: ["ログや症状", "疎通確認でやること"],
          rows: [
            ["connection timed out、Read timed out", "アプリが動いているホストから、外部のホスト名・ポートへ TCP が開くか"],
            ["Connection refused", "ホストまでは届いたが、そのポートで待ち受けが無い。URL のポート番号と向き先を再確認"],
            ["UnknownHostException、名前解決できない", "ping や nslookup でホスト名が引けるか"],
            ["SSLHandshakeException、証明書エラー", "curl -vk で HTTPS まで届くか。TLS はアプリより手前で失敗することもある"],
            ["開発 PC の curl は 200、サーバ上のアプリだけ失敗", "打つ場所をアプリサーバに変える。経路と FW が PC と違う"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "順番",
          text: "URL とポートが分かってからコマンドです。application.yml の接続先を特定する前に ping しても、当たる先が定まりません。",
        },
        {
          type: "ol",
          items: [
            "再現操作の時刻で、Controller → Service → Mapper の順をログで確認する",
            "SQL のあとに時間が空く、または ERROR が外部クライアント付近なら、範囲を外部に絞る",
            "設定の URL と、検証用環境と本番の差分を見る",
            "接続エラー・タイムアウトなら「ネットワークの疎通確認」。アプリサーバから外部へ ping / TCP / curl する",
            "外部側の障害情報やメンテナンス予定も確認する",
          ],
        },
        { type: "quiz", id: "ts-external" },
      ],
    },

  ],
};
