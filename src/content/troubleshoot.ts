import type { Track } from "../types";

export const troubleshootTrack: Track = {
  id: "troubleshoot",
  no: "07",
  title: "トラブルシューティング手法",
  kicker: "TROUBLESHOOT",
  description: "いきなりソースを読まず、リクエストがどこまで届いたかと症状から当たりをつけます。",
  accent: "#f5cf4d",
  lessons: [
    {
      id: "map",
      title: "症状から探す",
      minutes: 3,
      blocks: [
        {
          type: "p",
          text: "この章の入口です。今の症状に近いものを選ぶと、最初に確認することと、詳しく見るレッスンに辿り着けます。じっくり読みたいときは、次の「調査手順」から順に読んでも構いません。",
        },
        { type: "widget", name: "troubleshoot-map" },
        {
          type: "p",
          text: "ここに近い症状が無いときは「調査手順」を順に読みましょう。症状を一覧で見比べたいときは、そこにある表も見ましょう。",
        },
        {
          type: "p",
          text: "当たりをつけたあと、Network タブや Console のどの機能で確かめるかは「開発者ツールの Tips」の逆引きにまとめています。",
          link: {
            label: "開発者ツールの Tips",
            to: "/devtools",
          },
        },
      ],
    },
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
              text: "報告された操作を、同じ手順で試しましょう。決済や外部通知など、実行すると影響が残る操作は、再現してよいかを先に確認しましょう。再現できないなら、障害が起きたときと自分で試したときで、権限・データ・発生時刻の違いを控えておきましょう。",
            },
            {
              title: "当たりをつける",
              text: "原因がクライアント、ネットワーク、サーバのどれにあるかを推測しましょう。",
            },
            {
              title: "どこまで届いているか見る",
              text: "Network タブとログで、リクエストが出ているか、サーバに届いているか、DB まで進んでいるかを確認しましょう。この切り分け方は、次の「どこまで届いたか」で詳しく見ます。",
            },
            {
              title: "詳細を追う",
              text: "原因の見当と、どこまで届いたかが分かったら、その範囲のログとソースを読みましょう。",
            },
          ],
        },
        {
          type: "p",
          text: "報告にエラーログやスタックトレースが付いていれば、先にそれを読みましょう。どこで何が起きたかの手がかりになるので、当たりをつけるところから始められます。",
        },
        {
          type: "h2",
          text: "当たりのつけ方",
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
            "サーバ … リクエストが届いている側。5xx やエラーログ、件数だけおかしい、など。DB もここに含めます",
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
              "Network タブに、操作した瞬間のリクエストがあるか。無ければ Console。あればステータスコード",
              "新しいリクエストが無ければサーバには届いていない。5xx なら、原因は同時刻のサーバ側のエラーログに出ていることが多い。2xx でも本文がエラーなら、レスポンスの中身かアプリのログを確認する",
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
              "200 でエラーログも無く、件数や中身だけおかしい",
              "実行された SQL と、その条件の DB のレコード",
              "エラーログが無く 200 なら、処理は応答まで終わっている。おかしいのは読んだレコードか条件のどちらかだ",
            ],
            [
              "ボタンを押しても画面が変わらない",
              "Network タブに新しいリクエストがあるか",
              "画面が変わらなくても、アプリは呼ばれていないことがある",
            ],
            [
              "遅い",
              "Network タブの待ち時間。アプリに届いているなら、ログの時刻の空き",
              "遅さの原因は、Network の待ちならアプリの前、ログの時刻差ならアプリの中にある",
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
      id: "recent-change",
      title: "いつから起きているかを疑う",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "昨日までは動いていたのに、今日から症状が出る。そういうときは、原因を「直近に変わったもの」に絞れることが多いです。何も変わっていないように見えても、まず変化を疑いましょう。",
        },
        {
          type: "h2",
          text: "何が変わったかを洗い出す",
        },
        {
          type: "table",
          headers: ["変わるもの", "確認する場所"],
          rows: [
            ["コード", "デプロイ履歴、`git log`"],
            ["設定", "`application.yml` / `.properties`、環境変数、コンテナのイメージタグ"],
            ["データ", "件数やマスタの増減。その条件に当てはまるレコードが初めて入っただけのこともある"],
            ["外部要因", "証明書の期限、外部 API の仕様変更、依存ライブラリの更新"],
          ],
        },
        {
          type: "h2",
          text: "コードの変更を確認する",
        },
        {
          type: "p",
          text: "`git log` で、症状が報告された時刻より前に、関係しそうな変更が無いかを確認しましょう。`--until` に報告時刻を指定すると、それより後のコミットを除けます。`--oneline` はコミット日時が出ないので、`--pretty` と `--date` で日時も一緒に出しましょう。",
        },
        {
          type: "code",
          title: "例（架空のログです。症状の報告は 2026-08-30 09:00）",
          lang: "text",
          code: `$ git log --until="2026-08-30 09:00" -3 --pretty=format:"%h %ad %s" --date=format:"%Y-%m-%d %H:%M"
7b2e8f4 2026-08-29 15:40 依存ライブラリのバージョンを更新
1d4a6c0 2026-08-29 09:05 ログ出力の書式を変更
9e0f2a1 2026-08-27 18:20 承認一覧のページングを追加`,
        },
        {
          type: "h2",
          text: "設定やデプロイのタイミングを確認する",
        },
        {
          type: "p",
          text: "自分でデプロイしていない共有環境でも、設定ファイルの更新時刻や、コンテナが作られた時刻を見れば、いつ変わったかが分かります。ここから先のコマンドは、共有サーバに入って実行するものです。サーバへの入り方は「Linux の基本操作」にあります。",
          link: {
            label: "Linux の基本操作",
            to: "/tracks/server-network/linux-basics",
          },
        },
        {
          type: "p",
          text: "更新時刻は `ls -l` でも出ますが、`stat` の方が詳しく分かります。",
        },
        {
          type: "code",
          title: "例（架空のログです）",
          lang: "text",
          code: `$ stat application.yml
  File: application.yml
  Size: 842        Blocks: 8          IO Block: 4096   regular file
Access: (0644/-rw-r--r--)  Uid: ( 1000/deploy)   Gid: ( 1000/deploy)
Access: 2026-08-30 10:15:03.000000000 +0900
Modify: 2026-08-27 18:05:00.000000000 +0900
Change: 2026-08-30 09:58:11.000000000 +0900`,
        },
        {
          type: "table",
          headers: ["項目", "意味", "分かること"],
          rows: [
            ["Modify（mtime）", "ファイルの中身が最後に変更された時刻。`ls -l` が出すのもこの時刻", "設定の中身がいつ書き換わったかが分かる"],
            ["Change（ctime）", "パーミッションや所有者、中身などのメタデータが変わった時刻。`touch` などで任意の値に変えることはできない", "コピーや配置でも更新されるので、Modify より配置のタイミングに近いことが多い"],
          ],
        },
        {
          type: "p",
          text: "この例では、Modify が 8/27 の編集時刻のまま、Change だけが配置した 8/30 の時刻になっています。`rsync -a` や `cp -p` のように元の Modify（mtime）を保つデプロイだと、こうなります。ここで主に見るのは Change です。コピーや配置でも必ず更新されるので、このサーバに実際に配置された時刻を反映します。Change が症状の報告時刻の直前にあれば、その配置が原因の候補です。Modify は中身がいつ書かれたか（開発時の編集時刻など）の参考程度に留めましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "WAR や JAR の展開でも同じ",
          text: "WAR や JAR はアーカイブの中に元のタイムスタンプ（ビルド時刻）を持っていて、展開時にそれを復元します。復元そのものもメタデータの変更なので、Modify はビルド時刻のまま、Change は展開した時刻になります。`application.yml` を jar の外部に置く構成（外だし設定）もよく使われます。そのときはそのファイルの Change を見ましょう。jar に同梱している構成なら、`application.yml` は単体のファイルとしては存在しないので、WAR や JAR ファイルそのものの Change を見ましょう。",
        },
        {
          type: "p",
          text: "コンテナで動いているアプリでは、`application.yml` に直接アクセスできなかったり、設定がイメージに焼き込まれていたりします。そのときは、コンテナ自体がいつ作られたかを見ましょう。",
        },
        {
          type: "code",
          title: "例（架空のログです）",
          lang: "text",
          code: `$ docker inspect --format='{{.Created}}' shinsei-kun-app-1
2026-08-30T00:58:22.104512Z  # UTC。日本時間では 09:58:22`,
        },
        {
          type: "p",
          text: "これがコンテナの作成時刻です。ファイルの Change と同じように、症状の報告時刻の直前であれば、そのデプロイが原因の候補です。",
        },
        {
          type: "h2",
          text: "データの変化を確認する",
        },
        {
          type: "p",
          text: "レコードに更新日時のカラムがあれば、それも手がかりになります。",
        },
        {
          type: "code",
          title: "例（申請くんの t_request）",
          lang: "sql",
          code: `SELECT id, title, status, created_at, updated_at FROM t_request WHERE id = 11;`,
        },
        {
          type: "table",
          headers: ["id", "title", "status", "created_at", "updated_at"],
          rows: [["11", "備品購入", "APPROVED", "2026-04-08 14:00:00", "2026-04-12 10:03:00"]],
        },
        {
          type: "p",
          text: "`created_at` は申請された時刻、`updated_at` はレコードが最後に更新された時刻です。申請くんでは、承認の `UPDATE` 文（`RequestMapper.xml` の `update`）が `status` と一緒に `updated_at` を書き換えています。この `updated_at` が症状の報告時刻に近ければ、その更新が関係している候補になります。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "更新日時カラムを信用する前に",
          text: "更新日時カラムは、必ずしもすべての更新経路で書き換えられているとは限りません。一部の `UPDATE` 文だけがこのカラムを書き換えている、そもそもこのカラムが無い、ということもあります。実際にどの処理が書き換えているかは、Mapper の `UPDATE` 文を確認しましょう。",
        },
        { type: "quiz", id: "ts-recent-change" },
      ],
    },
    {
      id: "divide",
      title: "どこまで届いたか",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "Java の分岐を読む前に、リクエストがどこまで届いたかを確認しましょう。アプリログの場所と読み方は、このあとの項目で扱います。ping や curl の打ち方は、「サーバ＆ネットワーク」の「ネットワークの疎通確認」にあります。",
          link: {
            label: "ネットワークの疎通確認",
            to: "/tracks/server-network/net-check",
          },
        },
        { type: "diagram", name: "divide", caption: "ブラウザ、サーバ、DB のどこまで進んだかで、疑う範囲が変わります。" },
        {
          type: "table",
          headers: ["確認", "疑わしい箇所"],
          rows: [
            ["Network タブにリクエストが無い", "サーバには届いていないことが多い。疑うのは、ボタンの JS や二重送信防止。別ウィンドウで送っているときは、そのウィンドウの Network タブを見る"],
            ["リクエストはあるがサーバログが無い", "見ているログが違うことがある。疑うのは、別インスタンス、パス違い、LB など"],
            ["SQLException", "アプリまでは届いている。疑うのは、DB 接続、SQL、ロック、DB 接続ユーザの権限など"],
            ["接続タイムアウト", "疑うのは、FW、DNS、接続先設定など。外部 API なら、あとの「トラブル例：外部システム / 外部 API」で向き先を特定してから、「ネットワークの疎通確認」を使う"],
            ["外部 API への接続失敗（例: ResourceAccessException）", "自社アプリは動いていることが多い。疑うのは、アプリサーバから外部ホスト・ポートへの疎通。TCP / curl で確認する"],
          ],
        },
      ],
    },
    {
      id: "logs",
      title: "アプリログの場所と読み方",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "先に、ログの出力先を確認しましょう。そのあと、操作した時刻の行を読みましょう。",
        },
        {
          type: "h2",
          text: "出力先を確認する",
        },
        {
          type: "p",
          text: "出力先はアプリと環境で違います。次の順で探しましょう。",
        },
        {
          type: "ol",
          items: [
            "手順書、README、聞ける人に「今の環境のログはどこか」を確認する",
            "`application.yml` や `application.properties` の `logging.file` や `logging.path`、`logging.level` を見る",
            "`logback-spring.xml` や `log4j2.xml` があれば、file のパスを見る",
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
          ],
        },
        {
          type: "h2",
          text: "アプリのログの 1 行を読む",
        },
        {
          type: "p",
          text: "書式は設定次第ですが、次の要素が並ぶことが多いです。",
        },
        { type: "diagram", name: "log-line", caption: "ログの名前は、原因のクラスとは限りません。原因は下の at 行で見ます。" },
        {
          type: "code",
          title: "例外が出たとき（申請くん・ID 16。抜粋）",
          lang: "text",
          highlightLines: [3],
          highlightKind: "error",
          code: `04:12:03.512 ERROR [nio-8080-exec-3] o.a.c.c.C.[.[.[.[dispatcherServlet] : Servlet.service() for servlet [dispatcherServlet] in context with path [/shinsei] threw exception [Request processing failed; nested exception is java.lang.NullPointerException: Cannot invoke "java.lang.Long.equals(Object)" because the return value of "jp.co.example.shinsei.entity.RequestEntity.getApproverId()" is null] with root cause
java.lang.NullPointerException: Cannot invoke "java.lang.Long.equals(Object)" because the return value of "jp.co.example.shinsei.entity.RequestEntity.getApproverId()" is null
    at jp.co.example.shinsei.service.RequestService.approve(RequestService.java:48)
    （中略）
    at jp.co.example.shinsei.controller.RequestController.approve(RequestController.java:102)
    （中略）`,
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
          text: "DEBUG は量が多いので、普段は出していないことが多いです。必要なときだけログレベルを上げましょう。",
        },
        {
          type: "p",
          text: "角括弧 [ ] のなかの `nio-8080-exec-3` はスレッド名です。申請くんのログは、スレッド名を後ろから 15 文字だけ出しています（Spring Boot の既定の書式と同じ）。スレッドダンプでは `http-nio-8080-exec-3` と出ます。同じ操作の行を揃える手順は「アプリのログで処理を追う」です。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "ログが無い",
          text: "操作時刻にアプリログが無いこと自体が情報です。別インスタンス、別ファイル、リクエストが Java まで届いていないことを疑いましょう。手前に HTTP サーバがあるなら、「サーバ＆ネットワーク」の「HTTP サーバのログを見る」を参考に、`access.log` も確認しましょう。",
        },
        {
          type: "h2",
          text: "足りないときだけ足す",
        },
        {
          type: "p",
          text: "ログ自体はあるのに、到達したかも原因も分からないときは、疑わしい箇所に、ID と通過点を出すログ出力を一時的に足しましょう。動かして確認したら、その行は戻しましょう。値を今の行で見たいだけなら、ログを足すよりデバッガが有効です。共有環境など、処理を止めるのが難しいときは、ログで対応しましょう。",
        },
        {
          type: "callout",
          kind: "warn",
          title: "共有環境",
          text: "検証用環境など他人と使っている場合、ログレベルの変更や調査用の出力は、他の人のログを読みにくくし、ディスクの容量も使います。足す前に、その環境でよいか確認しましょう。",
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
      id: "log-follow",
      title: "アプリのログで処理を追う",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "出力先と 1 行の読み方は「アプリログの場所と読み方」です。ここでは、並んだ行から今の操作だけを取り出し、通った Java メソッドの順を見ましょう。ログ例は申請くんです。",
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
          code: `04:12:03.100 INFO  [nio-8080-exec-3] j.c.e.s.i.AccessLogInterceptor : GET /shinsei/requests
04:12:03.105 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : start RequestService.findMine(..)
04:12:03.110 DEBUG [nio-8080-exec-3] j.c.e.s.m.RequestMapper.findMine : ==>  Preparing: SELECT r.id, r.title, r.status, r.applicant_id, r.approver_id, r.applicant_email, r.created_at, a.display_name AS applicant_name, v.display_name AS approver_name FROM t_request r JOIN t_user a ON a.id = r.applicant_id LEFT JOIN t_user v ON v.id = r.approver_id WHERE (r.applicant_id = ? OR r.approver_id = ?) AND r.status = 'PENDING' ORDER BY r.created_at DESC
04:12:03.112 DEBUG [nio-8080-exec-3] j.c.e.s.m.RequestMapper.findMine : ==> Parameters: 7(Long), 7(Long)
04:12:03.115 DEBUG [nio-8080-exec-3] j.c.e.s.m.RequestMapper.findMine : <==      Total: 4
04:12:03.118 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : end RequestService.findMine(..)`,
        },
        {
          type: "p",
          text: "申請くんでは `AccessLogInterceptor` の GET、`ServiceLoggingAspect` の start、Mapper、`ServiceLoggingAspect` の end の順です。Mapper の 3 行（Preparing / Parameters / Total）は MyBatis の DEBUG の書き方で、JPA や JDBC なら文言は違います。Java のメソッド名は、メッセージに書いてあるときだけ分かります。",
        },
        {
          type: "ul",
          items: [
            "同じクラスの別の Java メソッドは、メッセージで見分ける",
            "`@Async` やキューに渡すと、続きは別のスレッド名になる。メール送信の行が exec-3 に無い、など",
            "start と end が対になっていれば、そのあいだがその Java メソッドの中",
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
          highlightLines: [1, 5],
          code: `04:12:03.100 INFO  [nio-8080-exec-3] j.c.e.s.i.AccessLogInterceptor : GET /shinsei/requests
04:12:03.102 INFO  [nio-8080-exec-5] j.c.e.s.i.AccessLogInterceptor : GET /shinsei/requests/12
04:12:03.105 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : start RequestService.findMine(..)
04:12:03.108 DEBUG [nio-8080-exec-5] j.c.e.s.aspect.ServiceLoggingAspect : start RequestService.findById(..)
04:12:03.110 DEBUG [nio-8080-exec-3] j.c.e.s.m.RequestMapper.findMine : ==> Parameters: 7(Long), 7(Long)`,
        },
        {
          type: "p",
          text: "山田の一覧なら、まず Parameters の 7(Long) や URL で検索しましょう。ヒットした行のスレッド名は `nio-8080-exec-3` です。その名前と、操作の前後数秒で再検索すると、GET → `findMine` → Mapper の行が揃います。exec-5 は別の詳細表示です。",
        },
        {
          type: "ol",
          items: [
            "操作した時刻を決める。サーバログのタイムゾーンと、画面を見た側の時計がずれていないか",
            "複数台なら、操作を処理したインスタンスのファイルを開く",
            "メッセージや MDC に userId、申請 ID、セッション ID があれば、それで絞る",
            "ヒットした行のスレッド名（[nio-8080-exec-3]）を控える",
            "そのスレッド名と、操作の前後の時刻で再検索する",
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "スレッド名は使い回される",
          text: "Tomcat の exec-3 は、前のリクエストが終わったあと、別のリクエストに使われます。スレッド名だけで日付を問わず拾うと、別操作が混ざります。時刻の幅を付けましょう。逆に、時刻が近いだけでは別の利用者の操作と区別できません。userId や申請 ID などの識別子で、同じ操作かを確認しましょう。同じ利用者の次の操作が、別のスレッド名になることもあります。",
        },
        {
          type: "ul",
          items: [
            "アプリが userId をログに出していないこともある。そのときは申請 ID、画面の固有メッセージ、URL",
            "セッション ID は、MDC やメッセージに出ているときだけ使える。Cookie の値そのものがログに無いことも多い",
            "申請くんなら `AccessLogInterceptor` の URL 行とアプリログの時刻を合わせると、処理の入口の特定に使える",
          ],
        },
        {
          type: "h2",
          text: "MyBatis の SQL",
        },
        {
          type: "p",
          text: "ここからは MyBatis の DEBUG に限った話です。Mapper の DEBUG を出すと、実行された SQL が見えます。必要なときだけレベルを上げ、終わったら戻しましょう。",
        },
        {
          type: "code",
          title: "MyBatis の DEBUG（申請くんの findMine）",
          code: `==>  Preparing: SELECT r.id, r.title, r.status, r.applicant_id, r.approver_id, r.applicant_email, r.created_at,
       a.display_name AS applicant_name, v.display_name AS approver_name
FROM t_request r
JOIN t_user a ON a.id = r.applicant_id
LEFT JOIN t_user v ON v.id = r.approver_id
WHERE (r.applicant_id = ? OR r.approver_id = ?)
AND r.status = 'PENDING'
ORDER BY r.created_at DESC
==> Parameters: 7(Long), 7(Long)
<==      Total: 4`,
        },
        {
          type: "ul",
          items: [
            "Preparing が SQL 文。? がプレースホルダ",
            "Parameters がバインドした値。上の例なら `applicant_id` も `approver_id` も 7",
            "Total がその SQL の件数。0 なら、その条件に合うレコードが無かった",
          ],
        },
        {
          type: "p",
          text: "出す先は `logging.level` です。申請くんなら Mapper のパッケージ（`jp.co.example.shinsei.mapper` など）に DEBUG を付けましょう。XML の id と Java のメソッド名が Logger に出ることがあります。その SQL をソースで探す手順は、「SQL からソースを探す」の章で説明しています。",
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
          text: "スタックトレースは、例外が起きたときの呼び出し履歴です。",
        },
        {
          type: "diagram",
          name: "stack-own",
          caption: "自分たちが書いたコードの行と、フレームワークや JDK の行が混ざって並びます。",
        },
        {
          type: "p",
          text: "申請くんなら、自分たちが書いたコードのパッケージは jp.co.example.shinsei です。org.springframework や java. はフレームワークや Java 本体なので、見る対象ではありません。",
        },
        {
          type: "h2",
          text: "1 行の読み方",
        },
        { type: "diagram", name: "stack-line", caption: "右端の括弧が、ソースのファイルと行です。" },
        {
          type: "p",
          text: "`RequestService.java:48` なら、プロジェクト内の `RequestService.java` の 48 行目です。ログの :48 は、エディタ左端の行番号と同じものです。Unknown Source とだけある行は、ソースが無いので飛ばしましょう。",
        },
        {
          type: "code",
          title: "RequestService.java（申請くん・抜粋、42〜49 行目）",
          lang: "java",
          highlightLines: [7],
          highlightKind: "error",
          code: `@Transactional
public void approve(Long requestId, Long approverId) {
  RequestEntity request = requestMapper.findById(requestId, approverId);
  if (request == null) {
    throw new NotFoundException("指定した申請は無い、または見る権限がありません。");
  }
  if (!request.getApproverId().equals(approverId)) {
    throw new ForbiddenException("承認権限がありません");
  }
  // ...
}`,
        },
        {
          type: "p",
          text: "48 行目を開くと、この `if` です。`request.getApproverId()` が `null` を返すと、続く `.equals(...)` で `NullPointerException` になります。開いたファイルの行番号を、ログの :48 と照らし合わせる。これがスタックトレースを読むということです。",
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
          text: "Caused by の読み方",
        },
        {
          type: "p",
          text: "例外は、別の例外に包まれて投げ直されることがあります。フレームワークやライブラリがよく行います。このとき、スタックトレースには包んだ側の例外が先に出て、その下に `Caused by:` として包まれた元の例外が続きます。何段も続くこともあります。いちばん下が最初に起きた例外で、これが直接の原因です。",
        },
        {
          type: "code",
          title: "例（申請くんの Web API に、件名を付けずに登録を送った場合。抜粋）",
          lang: "text",
          highlightLines: [19, 23],
          code: `org.springframework.dao.DataIntegrityViolationException:
### Error updating database.  Cause: java.sql.SQLIntegrityConstraintViolationException: Column 'title' cannot be null
### The error may exist in URL [jar:file:/app/app.jar!/BOOT-INF/classes!/mapper/RequestMapper.xml]
### The error may involve jp.co.example.shinsei.mapper.RequestMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO t_request (title, status, applicant_id, approver_id, applicant_email, created_at) VALUES (?, ?, ?, ?, (SELECT email FROM t_user WHERE id = ?), NOW())
### Cause: java.sql.SQLIntegrityConstraintViolationException: Column 'title' cannot be null
; Column 'title' cannot be null; nested exception is java.sql.SQLIntegrityConstraintViolationException: Column 'title' cannot be null
	at org.springframework.jdbc.support.SQLErrorCodeSQLExceptionTranslator.doTranslate(SQLErrorCodeSQLExceptionTranslator.java:247)
	at org.springframework.jdbc.support.AbstractFallbackSQLExceptionTranslator.translate(AbstractFallbackSQLExceptionTranslator.java:70)
	at org.mybatis.spring.MyBatisExceptionTranslator.translateExceptionIfPossible(MyBatisExceptionTranslator.java:91)
	at org.mybatis.spring.SqlSessionTemplate$SqlSessionInterceptor.invoke(SqlSessionTemplate.java:441)
	at jdk.proxy2/jdk.proxy2.$Proxy78.insert(Unknown Source)
	at org.mybatis.spring.SqlSessionTemplate.insert(SqlSessionTemplate.java:272)
	at org.apache.ibatis.binding.MapperMethod.execute(MapperMethod.java:62)
	at org.apache.ibatis.binding.MapperProxy$PlainMethodInvoker.invoke(MapperProxy.java:145)
	at org.apache.ibatis.binding.MapperProxy.invoke(MapperProxy.java:86)
	at jdk.proxy2/jdk.proxy2.$Proxy84.insert(Unknown Source)
	at jp.co.example.shinsei.service.RequestService.create(RequestService.java:38)
	（中略。AOP プロキシなど）
	at jp.co.example.shinsei.controller.RequestApiController.create(RequestApiController.java:38)
	（中略）
Caused by: java.sql.SQLIntegrityConstraintViolationException: Column 'title' cannot be null
	at com.mysql.cj.jdbc.exceptions.SQLError.createSQLException(SQLError.java:117)
	at com.mysql.cj.jdbc.exceptions.SQLExceptionsMapping.translateException(SQLExceptionsMapping.java:122)
	at com.mysql.cj.jdbc.ClientPreparedStatement.executeInternal(ClientPreparedStatement.java:916)
	（中略）
	at org.mybatis.spring.SqlSessionTemplate$SqlSessionInterceptor.invoke(SqlSessionTemplate.java:427)
	... 63 more`,
        },
        {
          type: "p",
          text: "先頭の `DataIntegrityViolationException` は、Spring が包んだ例外です。何が起きたかは、`Caused by` の元の例外が示しています。`Column 'title' cannot be null` なので、`title` カラムに null を入れようとして、DB の `NOT NULL` で拒まれたと分かります。MyBatis では、先頭のメッセージにも `### SQL:` や `RequestMapper.insert` のように、失敗した SQL と Mapper の id が出ます。",
        },
        {
          type: "p",
          text: "この例では、自分たちが書いたコードの行は、`Caused by` の側ではなく、先頭の（包んだ側の）例外の at 行にあります。`Caused by` の側は、先頭の例外と共通する呼び出し元を `... 63 more` のようにまとめて省略するためです。先頭の例外の at 行で最初に出てくる自作の行は `RequestService.java:38` の `requestMapper.insert` で、その呼び出し元は `RequestApiController.create` です。Web API から件名の無い登録が来たと読めます。",
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
            ["org.springframework / org.apache / org.mybatis / org.hibernate", "フレームワークやライブラリ。飛ばす"],
            ["java. / javax. / jakarta. / jdk. / sun.", "JDK。飛ばす"],
            ["$Proxy / CGLIB / generated", "生成コード。隣の自作クラスへ戻る"],
          ],
        },
        { type: "widget", name: "stack" },
        { type: "quiz", id: "ts-npe" },
        { type: "quiz", id: "ts-own-class" },
      ],
    },
    {
      id: "compare-working",
      title: "正常なケースと突き合わせる",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "同じ操作なのに、あるデータやある利用者だけ失敗する。そういうときは、うまくいくケースと失敗するケースを突き合わせるのが近道です。何が違うかが分かれば、原因の見当がつきます。",
        },
        {
          type: "h2",
          text: "何を突き合わせるか",
        },
        {
          type: "table",
          headers: ["層", "見るもの"],
          rows: [
            ["リクエスト", "パラメータ、ヘッダ、Cookie の違い"],
            ["ログインユーザ", "権限、所属、ログインしているアカウント自体の違い"],
            ["DB のレコード", "失敗する側だけ null や想定外の値になっているカラムが無いか"],
            ["設定・環境", "接続先や機能フラグが、ケースごとに違っていないか"],
          ],
        },
        {
          type: "p",
          text: "実際にこの考え方で原因を特定した例が、シナリオ「申請詳細で承認すると「エラーが発生しました」」にあります。山田（yamada）は ID 15「出張旅費」は承認できるのに、ID 16「研修参加」だけ 500 になる、というケースで、DB のレコードを見比べると `approver_id` だけ ID 16 が NULL でした。",
          link: {
            label: "申請詳細で承認すると「エラーが発生しました」",
            to: "/tracks/scenario/back",
          },
        },
        {
          type: "callout",
          kind: "note",
          title: "差分を 1 つずつ戻す",
          text: "違いが複数見つかったときは、1 つずつ元に戻しながら試すと、どれが原因かを絞り込めます。全部を一度に変えると、直っても、どの変更で直ったのか分かりません。",
        },
        { type: "quiz", id: "ts-compare-working" },
      ],
    },
    {
      id: "p-500",
      title: "トラブル例：画面にエラーが出る",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "画面にエラーが出ても、文言だけではサーバ側かフロント側かは分かりません。先に Network タブで、操作した瞬間のリクエストを確認しましょう。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-error-500.jpg",
          alt: "エラーが発生しましたと出た申請くんの画面",
          caption: "承認を押したあとの画面。出ているのは「エラーが発生しました」だけです。",
        },
        {
          type: "h2",
          text: "新しいリクエストが無い",
        },
        {
          type: "p",
          text: "画面にエラーが出ていても、新しいリクエストが無ければサーバには届いていません。サーバ側のエラーログはまだ見ません。Console を確認しましょう。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-js-error.jpg",
          alt: "画面にエラーが出ているが新しいリクエストが無く Console に TypeError が出ている Network タブ",
          caption: "例：画面にエラーが出ています。新しいリクエストは増えていません。Console に TypeError のメッセージが出ています。",
        },
        {
          type: "p",
          text: "Console にエラーがあれば、クラスとメッセージを読みましょう。その行が指す JS を見て、click や submit の手前で止まっていないかを確認しましょう。",
        },
        {
          type: "p",
          text: "Console にも何も無ければ、未捕捉の例外で処理が止まったわけではありません。開発者ツールで、いま画面にある HTML からエラーの文言を検索しましょう。クリックイベントのハンドラが付いているか、ボタンが無効になっていないかも確認しましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "テンプレートと画面の HTML",
          text: "テンプレートは、画面に出る前のひな形です。モデルの値やメッセージ定義、JS の書き換えがあると、画面の文言はテンプレートのファイルに無いことがあります。",
        },
        {
          type: "h2",
          text: "新しいリクエストがある",
        },
        {
          type: "p",
          text: "ステータスコードを確認しましょう。5xx なら、同時刻のサーバ側のエラーログを確認しましょう。2xx でも本文がエラーなら、レスポンスの中身かアプリのログを確認しましょう。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-500.jpg",
          alt: "POST が 500 の Network タブ",
          caption: "例：POST が 500。5xx と分かってから、サーバ側のエラーログを確認しましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "パースエラーに見えるとき",
          text: "フロントが JSON を期待しているのに、500 の HTML エラーページが返ると、画面にはパースエラーとだけ出ることがあります。Network タブのステータスコードと `Content-Type` を先に見ましょう。",
        },
        {
          type: "p",
          text: "ログに例外があれば、種類ごとにまず見る場所が違います。",
        },
        {
          type: "table",
          headers: ["例外", "まず見ること"],
          rows: [
            ["`NullPointerException`", "その行のオブジェクト。DB の null、未バインド、未設定の関連"],
            ["`IllegalArgumentException` / 業務例外", "メッセージと、throw している if 条件"],
            ["TemplateInputException など", "return したビュー名と、templates 配下の実ファイル"],
            ["`BadSqlGrammarException`", "Mapper のカラム名と、DB の定義差"],
          ],
        },
        {
          type: "p",
          text: "at 行があれば、フレームワークやライブラリは飛ばし、自分たちが書いたコードのパッケージ名がある行のソースを見ましょう。原因になった値や条件が、どこでその状態になったかを上流へ辿りましょう。辿り方は「ソースの読み方」の「値がどこで入ったかを辿る」です。",
          link: {
            label: "値がどこで入ったかを辿る",
            to: "/tracks/reading/where-from",
          },
        },
      ],
    },
    {
      id: "p-404",
      title: "トラブル例：指定の画面が開かない",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "指定した画面が開かないときは、まず Network タブでステータスコードを確認しましょう。404 は「その URL に対応する資源が無い」というステータスコードです。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-not-found.jpg",
          alt: "申請がありませんと出た申請くんの画面",
          caption: "存在しない申請 ID を開いた例です。HTML ごと 404 のときは、パスとマッピングを先に見ましょう。",
        },
        { type: "diagram", name: "not-found" },
        {
          type: "table",
          headers: ["状況", "確認"],
          rows: [
            ["HTML ごと 404", "Controller のパス、`context-path`、末尾スラッシュ"],
            ["Web API が 404", "パス、HTTP メソッド、Spring の `@RestController` のプレフィックス"],
            ["画面は出るが CSS/JS だけ 404", "static の置き場所、許可パス、`context-path`"],
            ["GET では出るが POST で 404", "HTTP メソッドのマッピング。Spring の `@GetMapping` しか無いなど"],
            ["リンク先だけ 404", "テンプレートの `th:href` / action と、実際のマッピング"],
          ],
        },
        {
          type: "p",
          text: "画面 URL が `/shinsei/requests` なのに、検索語を `/shinsei/requests` のままにするとヒットしません。アプリ内パスは `/requests` であることが多いです。",
        },
      ],
    },
    {
      id: "p-auth",
      title: "トラブル例：ログイン画面へ戻される / 権限エラー",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "ログイン画面へ戻される、または権限エラーが出たら、まず Network タブでステータスコードを確認しましょう。多くは Controller に入る前、または入った直後の権限チェックで止まっているため、500 のようなアプリ例外のスタックトレースは出ないことがあります。",
        },
        {
          type: "h2",
          text: "ログイン失敗",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-login-error.jpg",
          alt: "ログインに失敗した申請くんの画面",
          caption: "ユーザIDまたはパスワードが違うときのログイン画面。未ログインや認証失敗のときは、ログイン画面へ戻ることが多いです。",
        },
        {
          type: "h2",
          text: "権限が無い",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-forbidden.jpg",
          alt: "権限がありませんと出た申請くんの画面",
          caption: "承認者ではない利用者が承認しようとした画面です。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-network-403.jpg",
          alt: "承認 POST が 403 の Network タブ",
          caption: "申請くんの例。山田が承認すると POST は 403 です。",
        },
        {
          type: "table",
          headers: ["症状", "切り分け"],
          rows: [
            ["最初からログイン画面", "未ログイン、Cookie 未送信、セッション無効"],
            ["操作後にログイン画面", "セッションタイムアウト、セッション失効、Cookie 属性の不一致、CSRF 不一致"],
            ["権限がありません", "ステータスコードは 403 のことが多いが、200 のエラー画面などアプリ次第。ロール、hasRole、承認者 ID"],
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
            "DB 上のロールや承認者マスタ（コードは正しくても、DB の値で権限エラーになる）",
          ],
        },
      ],
    },
    {
      id: "p-data",
      title: "トラブル例：件数・更新結果がおかしい",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "画面は 200 で、エラーログも無いのに、データだけ期待と違うときは、SQL と、DB に入っているレコードを見ましょう。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-list-empty.jpg",
          alt: "申請が 0 件の申請一覧",
          caption: "一覧は 200 で、表だけ空です。エラーログでは分からないので、実行された SQL とその条件のレコードを見ましょう。",
        },
        {
          type: "table",
          headers: ["症状", "確認"],
          rows: [
            ["件数が少ない", "WHERE、削除フラグ、ログインユーザ条件。その条件のレコードが無い"],
            ["他人のレコードが見える", "ログインユーザ ID 条件の漏れ"],
            ["更新したつもりで戻る", "別 ID を更新、トランザクション未コミット、読み取り別 DB"],
            ["画面の値と DB が違う", "キャッシュ、画面の別項目を見ている、タイムゾーン"],
            ["SQL の結果は画面と同じなのに、期待と違う", "レコードの値がおかしい、マスタのずれ、別の DB"],
          ],
        },
        {
          type: "p",
          text: "ログに SQL とバインド値を出せるなら、検証用環境の DB で再実行しましょう。SELECT ならそのまま試せます。UPDATE や DELETE はデータを書き換えるので、「SQL からソースを探す」の「見つけたあとの確認」の注意を見ましょう。結果が画面と同じなら、その SQL 自体は正しく動いています。それでも期待と違うなら、上の表のとおりレコードの値やマスタのずれを疑いましょう。コード上のメソッド名と、実際に飛んでいる SQL が一致しているかも確認しましょう。",
        },
      ],
    },
    {
      id: "p-env",
      title: "トラブル例：ある環境だけで再現する",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "ある環境だけで再現するときは、コードよりも環境の差を先に疑いましょう。同じコードでも、設定・データ・権限・経路が違えば結果は変わります。",
        },
        { type: "diagram", name: "env-diff", caption: "コードが同じでも、設定・データ・権限は環境ごとに違います。" },
        {
          type: "h2",
          text: "同じコードが動いているかを確かめる",
        },
        {
          type: "p",
          text: "設定を見比べる前に、両方の環境で同じビルドのアプリが動いていることを確かめましょう。片方のデプロイが古いままだと、環境の差をいくら探しても答えは出ません。",
        },
        {
          type: "p",
          text: "デプロイ履歴やビルド番号が分かるなら、それを見ましょう。分からないときは、jar やコンテナがいつ配置されたかで確かめられます。手順は「いつから起きているかを疑う」にあります。",
          link: {
            label: "いつから起きているかを疑う",
            to: "/tracks/troubleshoot/recent-change",
          },
        },
        {
          type: "h2",
          text: "症状から差の種類を絞る",
        },
        {
          type: "p",
          text: "症状によって、疑う差と最初に見るものは変わります。当てはまる行から確認しましょう。",
        },
        {
          type: "table",
          headers: ["症状", "最初に確認すること", "それで分かること"],
          rows: [
            [
              "一覧や検索の件数が環境で違う",
              "アプリのログに出た SQL と、そのプロセスの接続先（`SPRING_DATASOURCE_URL` など）",
              "同じ SQL で件数が違うなら、見ている DB かレコードが違う",
            ],
            [
              "その環境だけ起動しない、起動直後に停止する",
              "起動時のログの最後に出ている例外と、そこに書かれた設定キーやパス",
              "設定の値が渡っていないのか、パスや権限で失敗しているのかが分かる",
            ],
            [
              "ファイルの読み書きだけ失敗する",
              "アプリの実行ユーザ（`ps -eo user,pid,cmd`）と、対象ファイルの所有者（`ls -l`）",
              "実行ユーザは環境で違う。自分で開けても、アプリが開けるとは限らない",
            ],
            [
              "メールや外部 API だけ失敗する",
              "その環境の接続先 URL と、アプリのサーバからその宛先への疎通",
              "向き先が違うのか、経路が閉じているのかが分かる。モックのままのこともある",
            ],
            [
              "画面だけ崩れる、CSS や JS だけ 404",
              "返ってきた HTML の中の参照パスと、手前の HTTP サーバの access.log",
              "コンテキストパスや HTTPS の扱いが環境で違うと、パスがずれる",
            ],
            [
              "日時がずれる、文字化けする",
              "アプリのプロセスに渡っている `TZ` と、DB のタイムゾーン・文字コード設定",
              "アプリと DB のどちらの設定が違うかが分かる",
            ],
          ],
        },
        {
          type: "p",
          text: "ネットワークの差が疑わしいときは、アプリのサーバから接続先へ届くかを確認しましょう。手順は「ネットワークの疎通確認」にあります。",
          link: {
            label: "ネットワークの疎通確認",
            to: "/tracks/server-network/net-check",
          },
        },
        {
          type: "p",
          text: "環境の差が原因だったシナリオが 4 本あります。どれも、症状から原因までを追っています。",
        },
        {
          type: "p",
          text: "[障害調査] 検証用環境だけ、申請一覧が 0 件 … データの差",
          link: {
            label: "[障害調査] 検証用環境だけ、申請一覧が 0 件",
            to: "/tracks/scenario/db",
          },
        },
        {
          type: "p",
          text: "[障害調査] 検証用環境だけ、読み込みが終わらない … 経路の差",
          link: {
            label: "[障害調査] 検証用環境だけ、読み込みが終わらない",
            to: "/tracks/scenario/net",
          },
        },
        {
          type: "p",
          text: "[障害調査] デプロイ後、検証用環境でアプリが起動しなくなった … 実行ユーザと権限の差",
          link: {
            label: "[障害調査] デプロイ後、検証用環境でアプリが起動しなくなった",
            to: "/tracks/scenario/process-user",
          },
        },
        {
          type: "p",
          text: "[障害調査] 一覧は出るが、画面だけ崩れている … 手前の HTTP サーバの差",
          link: {
            label: "[障害調査] 一覧は出るが、画面だけ崩れている",
            to: "/tracks/scenario/http-server",
          },
        },
        {
          type: "h2",
          text: "読み込まれている設定を確認する",
        },
        {
          type: "p",
          text: "設定ファイルを読むだけでは、そのファイルが実際に読み込まれたかは分かりません。どのプロファイルで起動したかは、起動時のログに出ます。",
        },
        {
          type: "code",
          title: "例（架空のログです）",
          lang: "text",
          code: `$ grep -i profile logs/shinsei.log
2026-08-30 09:58:30.412 INFO  [main] j.c.e.shinsei.ShinseiApplication : The following 1 profile is active: "stg"`,
        },
        {
          type: "p",
          text: "この行が出ていれば、`application.yml` のあとに `application-stg.yml` が読み込まれています。文言は Spring Boot のバージョンで変わるので、`profile` で絞って探しましょう。プロファイル別のファイルの重ね方は「application.yml / application.properties」で扱っています。",
          link: {
            label: "application.yml / application.properties",
            to: "/tracks/java-map/yml",
          },
        },
        {
          type: "callout",
          kind: "note",
          title: "`No active profile set` と出ていたら",
          text: "プロファイルの指定が、そのプロセスに渡っていません。起動引数や環境変数を渡したつもりでも、サービスやコンテナの設定を経由すると抜けることがあります。この行を見れば、指定がプロセスに渡っているかどうかが分かります。",
        },
        {
          type: "p",
          text: "接続先も、設定ファイルに書いてあるとおりとは限りません。起動引数や環境変数で上書きされます。動いているプロセスが実際に受け取っている値を見ましょう。",
        },
        {
          type: "code",
          title: "例（起動引数と、プロセスに渡っている環境変数を見る）",
          lang: "text",
          code: `$ ps -p 1842 -o args=
java -jar /opt/app/shinsei-kun.jar --spring.profiles.active=stg
$ sudo cat /proc/1842/environ | tr '\\0' '\\n' | grep SPRING
SPRING_DATASOURCE_URL=jdbc:mysql://10.0.2.31:3306/shinsei`,
        },
        {
          type: "p",
          text: "`-o args=` は、ヘッダを出さずに起動コマンド全体を出す指定です。`/proc/PID/environ` は、そのプロセスを動かしているユーザしか読めないので、`sudo` で読んでいます。中身は NUL 区切りで並んでいるので、`tr` で改行に直しています。コンテナで動いているなら、`docker exec` でコンテナに入り、その中の PID に対して同じことをしましょう。",
        },
        {
          type: "p",
          text: "申請くんも、`docker-compose.yml` の環境変数で接続先を上書きしています。`application-dev.yml` には `localhost` と書いてありますが、コンテナの中では `db` というホスト名の MySQL につないでいます。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "同じ環境の中に差があることもある",
          text: "アプリが複数のインスタンスで動いている構成では、片方だけ設定やビルドが古いことがあります。同じ URL でも、振り分けられたインスタンスによって症状が出たり出なかったりします。何度か試して結果が変わるときは、どのインスタンスのログに残っているかも確認しましょう。",
        },
        { type: "quiz", id: "ts-env-build" },
        { type: "quiz", id: "ts-env" },
      ],
    },
    {
      id: "p-slow",
      title: "トラブル例：遅い",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "原因を考える前に、どこで時間がかかっているかを見ましょう。同じリクエストのログを時刻順に並べると、時間が空いている区間が見つかります。",
        },
        {
          type: "p",
          text: "ただし、アプリに入る前で待っていることもあります。Network タブの待ち時間と、サーバログの最初と最後の時刻を比べましょう。Network タブだけが長ければ、アプリの手前（待ち行列、LB、DNS）で時間を使っています。",
        },
        {
          type: "h2",
          text: "タイムスタンプの差",
        },
        {
          type: "p",
          text: "連続した 2 行の時刻差が、そのあいだにかかった時間です。差が大きい区間が、遅い箇所です。処理の入口のメソッドを読む前に、この差で範囲を狭めましょう。",
        },
        {
          type: "code",
          title: "例（申請くんの実ログではない）",
          lang: "text",
          highlightLines: [4, 5],
          code: `04:12:03.100 INFO  [nio-8080-exec-3] j.c.e.s.i.AccessLogInterceptor : GET /shinsei/requests/history
04:12:03.105 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : start RequestService.searchByTitle(..)
04:12:03.108 DEBUG [nio-8080-exec-3] j.c.e.s.m.R.searchByTitle : ==>  Preparing: SELECT ... FROM t_request WHERE title LIKE ? ORDER BY created_at DESC
04:12:03.109 DEBUG [nio-8080-exec-3] j.c.e.s.m.R.searchByTitle : ==> Parameters: %申請%(String)
04:12:08.410 DEBUG [nio-8080-exec-3] j.c.e.s.m.R.searchByTitle : <==      Total: 36
04:12:08.413 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : end RequestService.searchByTitle(..)`,
        },
        {
          type: "p",
          text: "上から順に、連続した 2 行の差を見ていきます。ほとんどは数ミリ秒ですが、`Parameters` の行と `Total` の行のあいだだけが約 5 秒です。",
        },
        {
          type: "p",
          text: "この 2 行のあいだは、SQL を DB へ投げてから結果が返るまでです。つまり、Java の処理ではなく SQL の実行に時間がかかっています。",
        },
        {
          type: "p",
          text: "時刻差で絞るときは、次の点に気をつけましょう。",
        },
        {
          type: "ul",
          items: [
            "ミリ秒まで見る。秒だけだと差が消える",
            "スレッド名（`nio-8080-exec-3` など）やリクエスト ID で、同じリクエストの行だけを揃える。別リクエストの行が混ざると差が無意味になる",
          ],
        },
        {
          type: "h2",
          text: "細かいログが出ていないとき",
        },
        {
          type: "p",
          text: "どこまで絞れるかは、出ているログの細かさで決まります。上の例で SQL の実行まで分かったのは、Mapper が 1 回の SQL につき 3 行を出していたからです。",
        },
        {
          type: "p",
          text: "申請くんは `logback-spring.xml` で、`ServiceLoggingAspect` と `jp.co.example.shinsei.mapper` をそれぞれ DEBUG にしています。Mapper 側を DEBUG にしていない環境では、同じリクエストでも次の 3 行しか出ません。",
        },
        {
          type: "code",
          title: "Mapper のログが出ていない場合（同じリクエスト）",
          lang: "text",
          highlightLines: [2, 3],
          code: `04:12:03.100 INFO  [nio-8080-exec-3] j.c.e.s.i.AccessLogInterceptor : GET /shinsei/requests/history
04:12:03.105 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : start RequestService.searchByTitle(..)
04:12:08.413 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : end RequestService.searchByTitle(..)`,
        },
        {
          type: "p",
          text: "連続した 2 行は `start` と `end` になり、差は最初の例と同じ約 5 秒です。ここから分かるのは、この Service のメソッドの中で 5 秒かかったことまでです。",
        },
        {
          type: "p",
          text: "1 回の SQL に 5 秒かかっていても、速い SQL を 1000 回投げていても（N+1）、ログはこの 3 行のままです。直し方は違うので、ここを取り違えると見当違いの対処になります。",
        },
        {
          type: "p",
          text: "検証用環境で Mapper のログレベルを DEBUG にすると、SQL の回数と、1 回ごとにかかった時間が分かります。ログレベルを変えられないときは、調べたい範囲の前後にログを一時的に足すか、下の「区間の中で疑うもの」で当たりをつけましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "本番で SQL のログが切られていることがある",
          text: "本番では、ログの量や性能への影響を避けるために、SQL のログを切っている環境もあります。出ていないからといって、設定ミスとは限りません。",
        },
        {
          type: "h2",
          text: "区間の中で疑うもの",
        },
        {
          type: "table",
          headers: ["兆候", "疑う場所"],
          rows: [
            ["一覧だけ遅い", "件数、ORDER BY、インデックス、N+1"],
            ["1 件の詳細が遅い", "関連の逐次取得、外部 API"],
            ["更新が待たされる", "レコードロック、別トランザクション"],
            ["時間帯で遅い", "バッチ、同時実行、コネクションプール枯渇"],
          ],
        },
        {
          type: "p",
          text: "外部 API が疑わしいときは「トラブル例：外部システム / 外部 API」で扱います。",
          link: {
            label: "トラブル例：外部システム / 外部 API",
            to: "/tracks/troubleshoot/p-external",
          },
        },
        {
          type: "p",
          text: "レコードロックや同時実行が疑わしいときは「トランザクションと同時実行」で扱います。",
          link: {
            label: "トランザクションと同時実行",
            to: "/tracks/java-map/transaction",
          },
        },
        {
          type: "h2",
          text: "SQL が原因のとき",
        },
        {
          type: "p",
          text: "SQL に時間がかかっているときは、2 つの形があります。SQL の回数そのものが多いのか、1 回の SQL が遅いのかで、見るものが変わります。",
        },
        {
          type: "h3",
          text: "回数が多い（N+1）",
        },
        { type: "diagram", name: "n-plus-one" },
        {
          type: "p",
          text: "SQL ログの回数を見ましょう。一覧のレコード数だけ SELECT が増えるなら N+1 です。",
        },
        {
          type: "code",
          title: "例（申請くんの実ログではない）",
          lang: "text",
          highlightLines: [4, 5, 6, 7, 8, 9, 11],
          code: `04:20:11.100 DEBUG [nio-8080-exec-7] j.c.e.s.m.R.findByApplicant : ==>  Preparing: SELECT id, title, status, applicant_id, approver_id FROM t_request WHERE applicant_id = ?
04:20:11.101 DEBUG [nio-8080-exec-7] j.c.e.s.m.R.findByApplicant : ==> Parameters: 7(Long)
04:20:11.102 DEBUG [nio-8080-exec-7] j.c.e.s.m.R.findByApplicant : <==      Total: 1000
04:20:11.103 DEBUG [nio-8080-exec-7] j.c.e.s.mapper.UserMapper.findById : ==>  Preparing: SELECT id, display_name FROM t_user WHERE id = ?
04:20:11.104 DEBUG [nio-8080-exec-7] j.c.e.s.mapper.UserMapper.findById : ==> Parameters: 3(Long)
04:20:11.105 DEBUG [nio-8080-exec-7] j.c.e.s.mapper.UserMapper.findById : <==      Total: 1
04:20:11.106 DEBUG [nio-8080-exec-7] j.c.e.s.mapper.UserMapper.findById : ==>  Preparing: SELECT id, display_name FROM t_user WHERE id = ?
04:20:11.107 DEBUG [nio-8080-exec-7] j.c.e.s.mapper.UserMapper.findById : ==> Parameters: 5(Long)
04:20:11.108 DEBUG [nio-8080-exec-7] j.c.e.s.mapper.UserMapper.findById : <==      Total: 1
（同じ 3 行が、一覧の件数だけ繰り返す）
04:20:14.102 DEBUG [nio-8080-exec-7] j.c.e.s.mapper.UserMapper.findById : <==      Total: 1`,
        },
        {
          type: "p",
          text: "一覧を取る `findByApplicant` は 1 回だけですが、そのあとに同じ形の `UserMapper.findById` が件数分（ここでは 1000 回）並びます。1 回は 3 ミリ秒ほどでも、最初の `findById` が `04:20:11.103`、最後が `04:20:14.102` なので、この区間だけで約 3 秒です。",
        },
        {
          type: "p",
          text: "JOIN や IN 句でまとめて取得するなど、SQL を 1 回にまとめると減らせます。",
        },
        {
          type: "p",
          text: "ログの回数と Java のループを突き合わせて原因を特定する流れは、実務のシナリオ「申請が多い利用者だけ、一覧表示が遅い」で追えます。",
          link: {
            label: "申請が多い利用者だけ、一覧表示が遅い",
            to: "/tracks/scenario/list-n-plus-one",
          },
        },
        {
          type: "h3",
          text: "1 回の SQL が遅い（EXPLAIN）",
        },
        {
          type: "p",
          text: "SQL の回数は増えず、1 回の SQL に時間がかかっているときです。このページの最初に見た `searchByTitle` が、この形でした。",
        },
        {
          type: "p",
          text: "`Preparing` の行に出ている SQL を、検証用 DB で `EXPLAIN` してみましょう。DB がその SQL をどう読むか（実行計画）が分かります。",
        },
        {
          type: "p",
          text: "ログの `?` は、`Parameters` の行に出ている値に置き換えます。MySQL では次のように書きます。",
        },
        {
          type: "code",
          title: "例（検証用環境の MySQL）",
          lang: "sql",
          code: `EXPLAIN SELECT * FROM t_request WHERE title LIKE '%申請%' ORDER BY created_at DESC;`,
        },
        {
          type: "code",
          title: "EXPLAIN の結果（検証用環境）",
          lang: "text",
          code: `table      type  possible_keys  key   rows    Extra
t_request  ALL   NULL           NULL  850234  Using where; Using filesort`,
        },
        {
          type: "p",
          text: "`title LIKE '%申請%'` のように先頭が `%` の条件は、`title` にインデックスを足しても使えません。先頭の文字が決まっていないと、インデックスで絞り込む手がかりにならないためです。",
        },
        {
          type: "p",
          text: "そのため `possible_keys` は `NULL`（使える候補が無い）、`type` は `ALL`（フルスキャン）になっています。`ORDER BY created_at` の並び替えもインデックスで賄えず、`Extra` に `Using filesort` と出ています。",
        },
        {
          type: "p",
          text: "結果のカラムのうち、遅さを疑うときによく見るのは次の 5 つです。",
        },
        {
          type: "table",
          headers: ["カラム", "見ること"],
          rows: [
            ["`type`", "そのテーブルをどう読むか。`ALL` は先頭から全部読むフルスキャン"],
            ["`possible_keys`", "この SQL の条件で使えるインデックスの候補。`NULL` なら候補が無い"],
            ["`key`", "実際に使うと決めたインデックス。`possible_keys` があっても `key` が `NULL` のことがある"],
            ["`rows`", "そのテーブルを何件読むかの見積もり。実測ではなくオプティマイザの推定"],
            ["`Extra`", "補足。`Using filesort` は `ORDER BY` を追加のソートで行っている、`Using temporary` は一時テーブルを使っている、など"],
          ],
        },
        {
          type: "p",
          text: "この例では `rows` が約 85 万件なのに、最初に見たログの `Total` は 36 件です。`rows` は DB が読む見積もり、`Total` は SQL が返した件数です。36 件を返すために約 85 万件を読んでいて、その時間が `Parameters` から `Total` までの 5 秒に表れています。",
        },
        {
          type: "callout",
          kind: "note",
          title: "possible_keys が NULL でもインデックスが無いとは限らない",
          text: "`possible_keys` が `NULL` なのは、その SQL の条件で使える候補が無いという意味です。テーブルに他のインデックスがあっても、`WHERE` や `ORDER BY` のカラムと合わなければ候補になりません。",
        },
        {
          type: "p",
          text: "フルスキャンになる原因は、先頭が `%` の `LIKE` だけではありません。シナリオ「申請履歴の検索が遅い」では、別の SQL で `type` が `ALL` になる例を扱っています。",
          link: {
            label: "申請履歴の検索が遅い",
            to: "/tracks/scenario/history-slow",
          },
        },
        { type: "quiz", id: "ts-slow-log-level" },
        { type: "quiz", id: "ts-slow-explain" },
      ],
    },
    {
      id: "p-memory",
      title: "トラブル例：メモリ不足・GC の当たりをつける",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "アプリのプロセスが急に終了する、動きが重くなる、といった症状のときは、メモリと GC（ガベージコレクション）も疑いましょう。エラーログに `OutOfMemoryError` が出ていれば、メモリ不足の可能性が高いです。出ていなくても、`Full GC` が短い間隔で繰り返されていると、そのあいだ処理が止まり、遅く感じられることがあります。",
        },
        {
          type: "h2",
          text: "`OutOfMemoryError` のメッセージ",
        },
        {
          type: "p",
          text: "`OutOfMemoryError` は、メッセージによって疑う場所が変わります。まずメッセージを読みましょう。",
        },
        {
          type: "code",
          title: "例（申請くんの実ログではない）",
          lang: "text",
          highlightLines: [1],
          highlightKind: "error",
          code: `java.lang.OutOfMemoryError: Java heap space
    at jp.co.example.shinsei.service.RequestService.searchHistory(RequestService.java:66)`,
        },
        {
          type: "table",
          headers: ["メッセージ", "疑うこと"],
          rows: [
            ["`Java heap space`", "ヒープが足りない。一度に大量のレコードをメモリに載せていないか、参照を持ち続けて解放されていないか（メモリリーク）"],
            ["`GC overhead limit exceeded`", "GC を繰り返しても十分に回収できていない。ヒープ不足かメモリリークの兆候"],
            ["`Metaspace`", "クラス情報を置く領域の不足。動的にクラスを生成するライブラリや、クラスローダーが解放されない構成で起きることがある"],
            ["`unable to create new native thread`", "OS が許すスレッド数の上限に達している。スレッドが増え続けていないか"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ヒープの上限は設定次第",
          text: "ヒープの上限は `-Xmx` などの JVM 起動オプションで決まります。アプリのコードに問題が無くても、割り当てが小さすぎれば `OutOfMemoryError` になります。まずは起動コマンドやコンテナの設定で、どの値になっているかを確認しましょう。",
        },
        {
          type: "h2",
          text: "GC の頻度を見る",
        },
        {
          type: "p",
          text: "プロセスが終了するまでには至らなくても、`Full GC` が短い間隔で繰り返されていると、その間アプリの処理が止まります。GC の記録を出す設定があれば見ましょう。",
        },
        {
          type: "code",
          title: "GC ログの例（設定と JDK のバージョンで書式は変わる）",
          lang: "text",
          code: `[12.345s][info][gc] GC(42) Pause Full (Allocation Failure) 1900M->1850M(2048M) 3210.123ms`,
        },
        {
          type: "p",
          text: "`->` の前後がヒープの使用量（回収前 → 回収後）で、括弧の中はそのときのコミット済みヒープサイズ（今 OS から確保している大きさ）です。回収してもほとんど減っていなければ、解放できるはずのオブジェクトが残っている、つまりメモリリークの兆候です。",
        },
        {
          type: "h2",
          text: "簡単に確認できるコマンド",
        },
        {
          type: "p",
          text: "サーバに入れるなら、次のコマンドで今の状態を確認できます。対象は Java プロセスの PID（プロセス ID）です。PID は「Linux の基本操作」で見た `ps` で調べられます。",
        },
        {
          type: "table",
          headers: ["コマンド", "すること"],
          rows: [
            ["`jstat -gcutil PID 1000`", "1 秒おきに GC の状況を表示する。`FGC` は `Full GC` の回数、`FGCT` はその合計時間"],
            ["`jcmd PID GC.heap_info`", "今のヒープの使用状況を表示する"],
            ["`jmap -dump:format=b,file=heap.hprof PID`", "ヒープの中身をファイルに書き出す（ヒープダンプ）"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "ヒープダンプは重い",
          text: "ヒープダンプの取得中は、アプリの処理が止まることがあります。本番環境で取るときは、影響とタイミングを確認してから実行しましょう。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "これらのコマンドが無いコンテナもある",
          text: "軽量化のため、コンテナは JRE だけ（JDK 抜き）で作られていることがあります。申請くんの Docker イメージ（`eclipse-temurin:17-jre`）もこの構成で、`jstat` / `jcmd` / `jmap` は入っていません。ヒープの大まかな使用量だけなら、「トラブル例：処理が返ってこない（スレッドダンプ）」で見る `kill -3 PID` の出力の末尾にも出ます。GC の頻度の推移や、MAT などで開けるヒープダンプ本体が必要なときは、簡単な代替が無いため、詳しい人や運用担当に相談しましょう。",
        },
        {
          type: "p",
          text: "ダンプを開いて中身を見るには、VisualVM や Eclipse Memory Analyzer (MAT) のようなツールを使います。読み方はツールの資料を見ましょう。",
        },
        {
          type: "p",
          text: "ここで見たのは、当たりをつけるまでの最低限です。GC アルゴリズムの選び方や、ヒープサイズの細かい調整は、この教材の範囲外です。メモリ不足やリークの疑いが強まったら、詳しい人に相談するか、専門の資料を見ましょう。",
        },
        { type: "quiz", id: "ts-memory" },
      ],
    },
    {
      id: "p-hang",
      title: "トラブル例：処理が返ってこない（スレッドダンプ）",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "「トラブル例：遅い」は、ログが進みながら時間がかかっているケースでした。ここで扱うのは、ログの続きが一切出ないまま、処理が止まっているように見えるケースです。",
        },
        {
          type: "h2",
          text: "止まっている範囲をログで絞る",
        },
        {
          type: "p",
          text: "「トラブル例：遅い」と同じく、まず操作した時刻のログを確認しましょう。最後に出た行から先が進んでいなければ、その行のあとで止まっています。",
          link: {
            label: "トラブル例：遅い",
            to: "/tracks/troubleshoot/p-slow",
          },
        },
        {
          type: "h2",
          text: "スレッドダンプを取る",
        },
        {
          type: "p",
          text: "スレッドダンプとは、ある瞬間に、動いている各スレッドが何をしているかを書き出した記録です。止まっている最中に取ると、どこで止まっているかの手がかりになります。",
        },
        {
          type: "table",
          headers: ["環境", "コマンド"],
          rows: [
            ["Java プロセスに直接", "`jstack PID`"],
            ["Docker コンテナの中", "`docker exec -it コンテナ名 jstack PID`"],
            ["Kubernetes の Pod の中", "`kubectl exec -it Pod名 -- jstack PID`"],
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "`jstack` が入っていないコンテナもある",
          text: "軽量化のため、コンテナは JRE だけ（JDK 抜き）で作られていることがあります。申請くんの Docker イメージ（`eclipse-temurin:17-jre`）もこの構成で、`jstack` はコンテナの中に入っていません。`command not found` になったら、Java プロセスへ `kill -3 PID` を送りましょう。スレッドダンプと同じ内容が標準出力に書き出されます。Docker なら `docker logs` で見られますが、これは JVM が直接書く出力なので、Logback などロギングフレームワークが書くログファイルには入りません。追加のツールが要らないので、JDK が無いコンテナでも使えます。",
        },
        {
          type: "callout",
          kind: "note",
          title: "1 回だけでなく数回取る",
          text: "同じスレッドが何度取っても同じ場所で止まっていれば、そこが疑わしいです。数秒おきに 2〜3 回取って比べましょう。",
        },
        {
          type: "h2",
          text: "スレッドの状態を読む",
        },
        {
          type: "p",
          text: "スレッドダンプの各スレッドには、そのときの状態が書かれています。",
        },
        {
          type: "table",
          headers: ["状態", "意味"],
          rows: [
            ["`RUNNABLE`", "実行中、または OS レベルの入出力待ちを含む実行可能な状態"],
            ["`BLOCKED`", "他のスレッドが持つロック（`synchronized` など）の解放を待っている"],
            ["`WAITING` / `TIMED_WAITING`", "`wait()` や `join()`、外部からの応答など、何かの完了を待っている"],
          ],
        },
        {
          type: "h2",
          text: "デッドロックを見分ける",
        },
        {
          type: "p",
          text: "`jstack` の出力の最後に「Found one Java-level deadlock」という行が出ることがあります。出ていれば、どのスレッドがどのロックを待っているかが明示されます。",
        },
        {
          type: "code",
          title: "デッドロックの出力例（申請くんの実ログではない）",
          lang: "text",
          code: `Found one Java-level deadlock:
=============================
"pool-1-thread-1":
  waiting to lock monitor 0x00007f... (object 0x000000076ab12345, a jp.co.example.shinsei.service.RequestService),
  which is held by "pool-1-thread-2"
"pool-1-thread-2":
  waiting to lock monitor 0x00007f... (object 0x000000076ab67890, a jp.co.example.shinsei.service.UserService),
  which is held by "pool-1-thread-1"`,
        },
        {
          type: "p",
          text: "2 つのスレッドが、お互いの持つロックを待ち合っています。この出力が無くても、複数のスレッドが `BLOCKED` のまま同じロックを待っていれば、デッドロックに近い状態を疑いましょう。",
        },
        {
          type: "h2",
          text: "スタックだけでは分からないこと",
        },
        {
          type: "p",
          text: "外部 API への応答待ちで止まっているときは、スレッドの状態が `RUNNABLE` のまま長時間動かないこともあります。デッドロックの表示が無いからといって、正常とは限りません。at 行の一番上に、どのクラスのどのメソッドで止まっているかが出ます。それが自分たちのコードか、外部呼び出し用のライブラリかを確認しましょう。外部呼び出しで止まっているなら、「トラブル例：外部システム / 外部 API」で向き先を特定しましょう。",
          link: {
            label: "トラブル例：外部システム / 外部 API",
            to: "/tracks/troubleshoot/p-external",
          },
        },
        { type: "quiz", id: "ts-hang" },
      ],
    },
    {
      id: "p-external",
      title: "トラブル例：外部システム / 外部 API",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "DB 以外にも、画面の外へ出る処理があります。画面の操作によるリクエストが自分のアプリまで届いていても、外部の応答待ちや接続失敗で止まることがあります。",
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
          text: "外部 API とは、自社アプリの外にある HTTP API や、SMTP・SFTP のような別プロセスへの接続の総称です。社内の人事マスタ API も、クラウドの通知 API も、これに含まれます。",
        },
        {
          type: "table",
          headers: ["症状", "外部を疑う手がかり"],
          rows: [
            ["画面の読み込みが終わらない、タイムアウト", "ログの 2 行のあいだだけ数秒〜数十秒空く。DB の SQL はすぐ終わっている"],
            ["業務エラー文だけ出て、スタックが短い", "メッセージに外部サービス名や連携失敗の文言がある"],
            ["検証用環境だけ成功、本番だけ失敗", "接続先 URL、認証情報、FW、モックの有無が環境で違う"],
            ["データの一部だけ古い・空", "DB は更新されたが、表示用に別 API から値を取る処理が失敗している"],
            ["承認は成功したのに通知が来ない", "DB 更新のログはある。そのあと MailService や通知 API の行が無い、または ERROR"],
          ],
        },
        {
          type: "h2",
          text: "ログで範囲を切る",
        },
        {
          type: "p",
          text: "ログを順に並べ、時刻が大きく空いている行を探しましょう。DB の SQL がそこまで時間を使っていなければ、その間で外部 I/O をしていることが多いです。",
        },
        {
          type: "code",
          title: "計測ログと通知 API の例（申請くんの実ログではない）",
          highlightLines: [4],
          highlightKind: "error",
          code: `04:12:03.200 INFO  ... RequestService : approve start requestId=12
04:12:03.205 DEBUG ... RequestMapper : <==      Total: 1
04:12:03.206 INFO  ... RequestService : db updated requestId=12
04:12:08.910 ERROR ... NotificationClient : POST https://notify.example.internal/api/send failed
org.springframework.web.client.ResourceAccessException: I/O error on POST request ...
04:12:08.912 INFO  ... RequestService : approve done`,
        },
        {
          type: "p",
          text: "DB 更新は 03.206 で終わっています。ERROR は 08.910 です。あいだは外部への POST 待ちです。`ERROR` 行自体にも `NotificationClient` というクラス名と、送信先の URL（`https://notify.example.internal/api/send`）が出ており、外部の通知 API への接続が失敗したと分かります。",
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
            ["`application.yml` の URL・タイムアウト・認証", "プロファイルごとに向き先が違うことがある"],
            ["モックやスタブの有無", "ローカルだけ偽の応答を返し、検証用環境では本物につなぐ構成がある"],
            ["アプリサーバからの疎通", "開発 PC の curl が通っても、サーバからは FW で閉じていることがある → 「ネットワークの疎通確認」"],
            ["外部の応答本文", "200 でも JSON の形が違うと、パース例外になる"],
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
          text: "承認処理は DB を更新したあと、MailService で申請者へメールを送る想定です。画面は承認済みなのにメールが来ないときは、Mapper の更新ログのあとに MailService の行があるかを見ましょう。SMTP サーバや通知 API の向き先は `application.yml` にあることが多いです。実際にこれが起きた例は、「実務のシナリオ」の「承認は成功するのに、申請者への通知メールが届かない」で扱います。",
          link: {
            label: "承認は成功するのに、申請者への通知メールが届かない",
            to: "/tracks/scenario/mail-silent",
          },
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
            ["SSLHandshakeException、証明書エラー", "`curl -vk` で HTTPS まで届くか。TLS はアプリより手前で失敗することもある"],
            ["開発 PC の curl は 200、サーバ上のアプリだけ失敗", "打つ場所をアプリサーバに変える。経路と FW が PC と違う"],
          ],
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
