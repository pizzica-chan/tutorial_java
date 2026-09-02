import type { Track } from "../types";

export const troubleshootTrack: Track = {
  id: "troubleshoot",
  no: "06",
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
          text: "症状を選ぶと、原因の当たり（クライアント・ネットワーク・サーバ）と、最初に確認すること、それで分かることが並びます。この当たりの分け方は、次の「調査手順」の「当たりのつけ方」と同じです。ここに近い症状が無いときや、症状を一覧で見比べたいときは、「調査手順」の表も見ましょう。",
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
              text: "報告された操作を、同じ手順で試しましょう。再現できないなら、障害が起きたときと自分で試したときで、権限・データ・発生時刻の違いを控えておきましょう。",
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
              text: "当たりと、どこまで届いたかが分かったら、その範囲のログとソースを読みましょう。",
            },
          ],
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
        {
          type: "p",
          text: "上の表は、最初に見るものの目安です。ここからの切り分け方は、次の「どこまで届いたか」で詳しく見ます。",
        },
        { type: "quiz", id: "ts-symptom-start" },
      ],
    },
    {
      id: "divide",
      title: "どこまで届いたか",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "Java の分岐を読む前に、リクエストがどこまで届いたかを確認しましょう。Network タブの見方は「Webの基礎」の章で見たとおりです。ログの見方は、このあとの項目で見ていきます。ping や curl の打ち方は「ネットワークの疎通確認」です。",
        },
        { type: "diagram", name: "divide", caption: "先に「どこまで届いたか」で切り分ける。" },
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
      id: "linux-basics",
      title: "Linux の基本操作",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "アプリが動いているサーバには、画面（GUI）が無く、ターミナルだけで調べることが多いです。ここでは、Java Web アプリの調査に使う最低限の Linux コマンドを見ます。",
        },
        {
          type: "h2",
          text: "サーバに入る",
        },
        {
          type: "p",
          text: "SSH は、ネットワーク越しにサーバのターミナルを操作する仕組みです。接続先やアカウントはチームやインフラの手順で決まっていることが多いので、分からなければ先に聞きましょう。",
        },
        {
          type: "code",
          title: "例",
          lang: "text",
          code: `ssh ユーザ名@ホスト名`,
        },
        {
          type: "p",
          text: "Docker や Kubernetes のコンテナに入るときは、SSH ではなく別のコマンドを使います。",
        },
        {
          type: "ul",
          items: [
            "docker exec -it コンテナ名 bash",
            "kubectl exec -it Pod名 -- bash",
          ],
        },
        {
          type: "h2",
          text: "ファイルを見る",
        },
        {
          type: "p",
          text: "ログファイルを開く・追う・検索する、という操作が中心です。",
        },
        {
          type: "table",
          headers: ["コマンド", "すること"],
          rows: [
            ["`pwd`", "今いる場所（ディレクトリ）を表示する"],
            ["`ls -l`", "ファイル一覧と、パーミッション・所有者を表示する"],
            ["`cd ディレクトリ名`", "そのディレクトリへ移動する"],
            ["`cat ファイル名`", "ファイル全体を表示する。大きいファイルには向かない"],
            ["`less ファイル名`", "1 画面ずつ見る。`q` で終了、`/文字列` で検索"],
            ["`tail -f ファイル名`", "追記される行をリアルタイムで見る。操作を再現しながら流し見るときに使う"],
            ["`grep 文字列 ファイル名`", "その文字列を含む行だけ表示する"],
          ],
        },
        {
          type: "p",
          text: "`tail -f` と `grep` を組み合わせると、流れてくるログをリアルタイムで絞り込めます。",
        },
        {
          type: "code",
          title: "例（requestId=12 を含む行だけ見る）",
          lang: "text",
          code: `tail -f app.log | grep requestId=12`,
        },
        {
          type: "h2",
          text: "パーミッションとユーザ",
        },
        {
          type: "p",
          text: "`ls -l` の先頭に出る `-rwxr-xr-x` のような文字列が、そのファイルのパーミッション（権限）です。",
        },
        {
          type: "code",
          title: "例（ログファイルの権限を見る）",
          lang: "text",
          code: `$ ls -l app.log
-rw-r--r-- 1 appuser appuser 48213 Aug 20 09:10 app.log`,
        },
        {
          type: "table",
          headers: ["部分", "意味"],
          rows: [
            ["`r` / `w` / `x`", "読み取り（read）/ 書き込み（write）/ 実行（execute）"],
            ["先頭から2〜4文字目", "所有者（owner）の権限"],
            ["5〜7文字目", "所有グループ（group）の権限"],
            ["8〜10文字目", "それ以外（other）の権限"],
          ],
        },
        {
          type: "p",
          text: "`ls -l` の出力には、パーミッションの右側に所有者名とグループ名も並びます。ログファイルを開けない、書き込めないときは、まずこの所有者・グループと、自分が今どのユーザとして操作しているかを確認しましょう。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "Permission denied はコードの不具合ではない",
          text: "`Permission denied` は、パーミッションかユーザが原因であることが多く、アプリのロジックの不具合ではありません。`ls -l` で対象ファイルの権限と所有者を確認し、今のユーザに読み書きの権限があるかを見ましょう。権限を変える `chmod` / `chown` は、理由を確認してから使いましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "SELinux が原因のこともある",
          text: "`ls -l` の権限も所有者も正しいのに `Permission denied` になるときは、SELinux が原因のこともあります。RHEL 系でよく有効です。`getenforce` で `Enforcing` なら疑い、`ls -Z` でファイルのセキュリティコンテキストも確認しましょう。",
        },
        {
          type: "h3",
          text: "SSH のユーザと、アプリを動かしているユーザは別のことが多い",
        },
        {
          type: "p",
          text: "SSH でログインした直後は、そのログインに使ったユーザ（自分の名前のアカウントや、チームで決まった共通ユーザなど）で操作しています。ただし、Java のプロセス自体は、別のユーザで動いていることが多いです。そのユーザは、サービスとして自動起動する設定や、コンテナの実行ユーザで決まります。",
        },
        {
          type: "p",
          text: "ログへの書き込みで `Permission denied` が起きたとき、見るべきなのは「SSH でログインした自分の権限」ではなく「アプリを動かしているユーザの権限」です。ここを混同すると、自分には権限があるのにアプリだけが失敗する理由が分からなくなります。",
        },
        {
          type: "code",
          title: "例（そのプロセスを動かしているユーザを見る）",
          lang: "text",
          code: `$ ps -ef -o user,pid,cmd | grep java | grep -v grep
appuser   1842  java -jar shinsei-kun.jar`,
        },
        {
          type: "p",
          text: "うしろの `grep -v grep` は、`grep java` というコマンド自身の行を除く指定です。`grep java` の行にも文字列 `java` が含まれるため、これを付けないと自分自身の行まで一致してしまいます。",
        },
        {
          type: "p",
          text: "`USER` の列に出る `appuser` が、そのプロセスを動かしているユーザです。この例では、SSH でログインしたのが `yamada` というユーザだったとしても、Java プロセス自体は別の `appuser` というユーザで動いています。自分がログインしたユーザ名と、プロセスの `USER` 列が違うことは珍しくありません。",
        },
        {
          type: "code",
          title: "例（アプリと同じユーザで書き込めるか試す）",
          lang: "text",
          code: `$ sudo -u appuser touch app.log`,
        },
        {
          type: "callout",
          kind: "trap",
          title: "自分の sudo とアプリの権限は別物",
          text: "sudo で何でもできる自分のアカウントでも、アプリ自身はアプリの実行ユーザの権限でしか動けません。自分が sudo で直接ファイルを作れたとしても、アプリの実行ユーザに権限が無ければアプリは失敗したままです。直すときは、アプリの実行ユーザ側の権限を変えましょう。",
        },
        {
          type: "h2",
          text: "プロセスとリソースを見る",
        },
        {
          type: "p",
          text: "アプリが起動しているか、サーバのリソースが足りているかを確認します。",
        },
        {
          type: "table",
          headers: ["コマンド", "すること"],
          rows: [
            ["`ps aux | grep java | grep -v grep`", "Java のプロセスが起動しているかを見る"],
            ["`df -h`", "ディスクの空き容量を見る"],
            ["`free -h`", "メモリの空き容量を見る"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ディスクが埋まっていることがある",
          text: "ログが溜まり続けてディスクが埋まると、アプリがファイルへ書き込めなくなり、起動や処理そのものが失敗することがあります。原因が分からない障害では、`df -h` も見ておきましょう。",
        },
        {
          type: "h3",
          text: "ポートを使っているプロセスを探す",
        },
        {
          type: "p",
          text: "アプリを起動しようとして `Address already in use`（`BindException`）のようなエラーが出るときは、そのポートを別のプロセスがすでに使っています。どのプロセスかを探しましょう。",
        },
        {
          type: "code",
          title: "例（ポート 8080 を使っているプロセスを見る）",
          lang: "text",
          code: `$ lsof -i :8080
COMMAND  PID    USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
java    1842 appuser   45u  IPv6 123456      0t0  TCP *:8080 (LISTEN)`,
        },
        {
          type: "p",
          text: "`lsof` が入っていない環境では、`ss` で代わりに調べられます。多くの Linux に標準で入っています。",
        },
        {
          type: "code",
          title: "例（同じことを ss で見る）",
          lang: "text",
          code: `$ ss -ltnp
State   Recv-Q  Send-Q     Local Address:Port     Peer Address:Port
LISTEN  0       128              0.0.0.0:8080          0.0.0.0:*      users:(("java",pid=1842,fd=45))`,
        },
        {
          type: "p",
          text: "どちらも `PID`（プロセス ID）と `COMMAND`（コマンド名）が分かります。同じポートに、想定していない別プロセスが乗っていないかを確認しましょう。",
        },
        {
          type: "h3",
          text: "特定のファイルを使っているプロセスを探す",
        },
        {
          type: "p",
          text: "ファイルが削除できない、書き込めない、というときは、どのプロセスがそのファイルを開いたままかを確認しましょう。ポートを調べたのと同じ `lsof` で、対象をファイル名に変えるだけです。",
        },
        {
          type: "code",
          title: "例（app.log を開いているプロセスを見る）",
          lang: "text",
          code: `$ lsof app.log
COMMAND  PID    USER   FD   TYPE DEVICE SIZE/OFF   NODE NAME
java    1842 appuser   8w   REG    8,1    48213 123457 app.log`,
        },
        {
          type: "callout",
          kind: "note",
          title: "削除したのに、ディスクの空きが増えない",
          text: "ログファイルを `rm` で消しても、そのファイルを開いたままのプロセスがあると、ディスクの空き容量はすぐには増えません。プロセスがファイルを閉じる（多くは再起動）まで、OS 内部では領域を確保したままになります。`lsof | grep deleted` で、削除済みなのに開いたままのファイルを探せます。`df -h` でディスクが埋まっているときは、これも疑いましょう。",
        },
        {
          type: "p",
          text: "ここで見たコマンドは、「アプリログの場所と読み方」や「ネットワークの疎通確認」でログや接続を確認するときにも使います。",
        },
        { type: "quiz", id: "ts-linux" },
        { type: "quiz", id: "ts-linux-user" },
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
          text: "出力先はアプリと環境で違います。決まった一箇所はありません。次の順で探しましょう。",
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
          type: "p",
          text: "手前に nginx や Apache があるときの access.log / error.log は、あとのレッスン「HTTP サーバのログを見る」で扱います。",
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
          title: "例外が出たとき（申請くん・ID 16）",
          highlightLines: [3],
          highlightKind: "error",
          code: `04:12:03.512 ERROR [nio-8080-exec-3] o.a.c.c.C.[.[.[/shinsei].[dispatcherServlet] : Servlet.service() for servlet [dispatcherServlet] threw exception
java.lang.NullPointerException: Cannot invoke "java.lang.Long.equals(Object)" because the return value of "jp.co.example.shinsei.entity.RequestEntity.getApproverId()" is null
    at jp.co.example.shinsei.service.RequestService.approve(RequestService.java:48)
    at jp.co.example.shinsei.controller.RequestController.approve(RequestController.java:102)`,
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
          text: "角括弧 [ ] のなかの `nio-8080-exec-3` はスレッド名です。同じ操作の行を揃える手順は「アプリのログで処理を追う」です。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "ログが無い",
          text: "操作時刻にアプリログが無いこと自体が情報です。別インスタンス、別ファイル、リクエストが Java まで届いていないことを疑いましょう。手前に HTTP サーバがあるなら、あとのレッスン「HTTP サーバのログを見る」で access.log も確認しましょう。",
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
          text: "検証用環境など他人と使っている場合、ログレベルの変更や調査用の出力は、他の人のログを読みにくくし、ディスクも食います。足す前に、その環境でよいか確認しましょう。",
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
      id: "http-server-log",
      title: "HTTP サーバのログを見る",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "アプリ自身のログは前のレッスンで見ました。ここでは、手前の HTTP サーバのログを見ます。",
        },
        {
          type: "p",
          text: "手前に Apache や nginx がある構成では、ブラウザのリクエストが最初に届くのは HTTP サーバです。CSS や JS は、この手前の HTTP サーバがそのまま返すことが多く、Java まで届かないためアプリのログには出ません。",
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
            ["ブラウザは 502", "無い、または少ない", "後ろのアプリに届いていない。後ろへの接続失敗（nginx でいう upstream 接続失敗）"],
            ["ブラウザは 503", "無いこともあれば、出ていることも", "手前で弾かれたか、アプリ自身の過負荷・メンテナンス。アプリのログも確認する"],
            ["操作したのにアプリログが無い", "無い", "手前で止まった、別ホストに振られた、静的だけ返した、など"],
            ["HTTPS の証明書エラー", "関係ないことが多い", "TLS の終端はアプリより手前（HTTP サーバ、LB など）"],
            ["URL は合っているのに 404", "無いことがある", "手前の location が別ディレクトリを見ている"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "SSL 終端の位置",
          text: "SSL 終端は、必ずしも Apache / nginx で行われるとは限りません。ロードバランサや CDN など、HTTP サーバより前のレイヤで TLS を復号する構成もあります。WAF で遮断されたリクエストもアプリまで届かないことが多いです。証明書エラーは、この TLS を終端する層で起きていることが多く、アプリのログには出ません。",
        },
        {
          type: "code",
          title: "nginx の access.log の例（combined 形式）",
          code: `192.0.2.10 - - [16/Aug/2026:04:12:03 +0900] "GET /shinsei/css/app.css HTTP/1.1" 404 153 "-" "Mozilla/5.0 ..."`,
        },
        {
          type: "p",
          text: "上の例なら、`/shinsei/css/app.css` への GET が 404 です。同じ時刻に `/shinsei/requests` は 200 なら、動的処理は Java に届き、CSS だけ手前の設定がずれている、と切り分けできます。出力先と書式は環境次第です。",
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
          text: "アプリが複数台で動き、手前にロードバランサがあると、ログは操作のたびに別のサーバ（インスタンス）に出ることがあります。まず、その操作を処理したサーバを特定してから読みましょう。",
        },
        { type: "quiz", id: "ts-http-log" },
      ],
    },
    {
      id: "net-check",
      title: "ネットワークの疎通確認",
      minutes: 16,
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
            "ping … ホストが応答するか（ICMP。HTTP とは別）",
            "traceroute / tracert … 途中のどこで止まったか",
            "Test-NetConnection / nc / telnet … TCP でポートが開いているか",
            "curl … HTTP でパスまで届き、どんな応答が返るか",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "打つ場所で結果が変わる",
          text: "打つ場所で結果が変わります。自分の PC からと、サーバからでは通る道が違います。ブラウザからは届くのに開発 PC からは届かない、サーバ上のアプリだけ外部 API に失敗する、ということもあります。再現に近い場所から打ちましょう。",
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
          text: "ping が通らなくても HTTP は通ることもあれば、逆に ping は通るがアプリのポートは閉じていることもあります。ping だけで決め打ちは避けましょう。",
        },
        {
          type: "h2",
          text: "経路（traceroute）",
        },
        {
          type: "code",
          title: "例",
          code: `# Windows（ICMP が多い）
tracert intranet.example.co.jp

# Linux（環境により traceroute または tracepath。UDP が多い）
traceroute intranet.example.co.jp

# Linux：ICMP
traceroute -I intranet.example.co.jp

# Linux：TCP（申請くんの 8080 の例）
traceroute -T -p 8080 intranet.example.co.jp`,
        },
        {
          type: "p",
          text: "途中のホップが表示され、どこで * やタイムアウトが続くかを見ましょう。社内のどの境界で止まっているかの手がかりになります。",
        },
        {
          type: "p",
          text: "何も指定しないと、Windows の tracert は ICMP、Linux の traceroute は UDP になることが多いです。プロトコルやポートは、オプションで変えられます。",
        },
        {
          type: "callout",
          kind: "note",
          title: "プロトコルとポートで経路が変わる",
          text: "ブラウザは HTTP を TCP で送ります。ポートは 80 や 443、8080 など、接続先で決まります。traceroute の既定が ICMP や UDP だと、見える経路が変わることがあります。途中の FW の許可だけでなく、ポリシーベースルーティングのように、プロトコルやポートで道を分ける制御もあります。HTTP と同じ道（プロトコル）を見る TCP の例は、上の Linux の例です。Windows の tracert は ICMP のままなので、ポートまで届くかは次で確認しましょう。",
        },
        {
          type: "h2",
          text: "ポートまで開いているか（TCP）",
        },
        {
          type: "p",
          text: "申請くんの検証用環境はポート 8080 を使います。HTTP の前に、TCP で 8080 が開いているかを見ましょう。待ち受けが無い、別ポートで待ち受けている、FW で閉じている、などが分かれます。手前に Apache や nginx がある構成では、ブラウザのリクエストが最初に届くのは、その HTTP サーバのポートです。",
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
          text: "アプリから外部への疎通",
        },
        {
          type: "p",
          text: "ここまでは、ブラウザや開発 PC から申請くんへ向けての疎通でした。同じコマンドを、申請くんが動いているサーバから外部のシステムへ向けて打つこともあります。「外部 API への接続エラーがログに出る」というときは、この向きで確認しましょう。打つ場所は申請くんのサーバ、向き先は外部システムのホスト・ポートです。ping → TCP → curl の順は同じです。",
        },
        {
          type: "code",
          title: "例（申請くんのサーバから、外部の通知 API へ）",
          code: `# 申請くんのサーバにログインしてから実行

ping notify.example.internal

Test-NetConnection -ComputerName notify.example.internal -Port 443
# Linux: nc -zv notify.example.internal 443

curl -I https://notify.example.internal/api/send`,
        },
        {
          type: "p",
          text: "開発 PC からは通っても、サーバからは FW で閉じていることがあります。逆に、サーバからは通るのに開発 PC からは通らないこともあります。向き先だけでなく、打つ場所もアプリサーバに合わせましょう。外部への接続がどんな症状やログに出るかは、「トラブル例：外部システム / 外部 API」で詳しく見ます。",
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
            ["ping 可、TCP 不可", "ポート閉鎖、待ち受けが無い、FW", "HTTP サーバやアプリがそのポートで待ち受けているか、FW ルール、LB の向き先"],
            ["TCP 可、curl で HTTP エラー", "パス違い、コンテキストパス、リダイレクト", "URL、server.servlet.context-path、Controller のマッピング"],
            ["curl 可、ブラウザだけ不可", "クライアント側の設定差", "プロキシ、VPN、Cookie、別マシンからの再現"],
            ["すべて可、ログだけ無い", "別インスタンス、別ログファイル", "LB の振り分け、ログの出力先"],
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "1 つ成功ですべて OK ではない",
          text: "ping が通ったから HTTP も通る、TCP が通ったから業務的に正しい応答が返る、とは限りません。層ごとに確認し、最後に Network タブやアプリログと突き合わせましょう。",
        },
        { type: "quiz", id: "ts-net-check" },
      ],
    },
    {
      id: "middleware-check",
      title: "ミドルウェアとコンテナの確認",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "ネットワークが通っていても、DB やコンテナ、外部の Tomcat・HTTP サーバ自体に問題があることがあります。ここでは、その切り分け方を見ます。",
        },
        {
          type: "h2",
          text: "DB へ直接つないでみる",
        },
        {
          type: "p",
          text: "アプリの接続エラーについて、DB 自体の問題か、アプリ側の接続設定の問題かを切り分けます。アプリが動いているサーバから、DB のクライアントで直接つないでみましょう。",
        },
        {
          type: "code",
          title: "例（MySQL、つながるとき）",
          lang: "text",
          code: `$ mysql -h ホスト名 -u ユーザ名 -p -e "SELECT 1"
Enter password:
+---+
| 1 |
+---+
| 1 |
+---+`,
        },
        {
          type: "p",
          text: "`SELECT 1` の結果が返れば、DB 自体は動いています。つながらないときは、エラーの種類で疑う先が変わります。",
        },
        {
          type: "code",
          title: "例（MySQL、つながらないとき）",
          lang: "text",
          code: `$ mysql -h ホスト名 -u ユーザ名 -p -e "SELECT 1"
Enter password:
ERROR 2003 (HY000): Can't connect to MySQL server on 'ホスト名:3306' (110)`,
        },
        {
          type: "ul",
          items: [
            "`SELECT 1` の結果が返る … DB 自体は動いている。アプリ側の接続設定（URL、ユーザ、パスワード）を疑う",
            "`ERROR 2003` など、TCP 自体がつながらないエラー … DB が落ちている、ポートが閉じている。「ネットワークの疎通確認」で TCP から確認する",
            "`ERROR 1045` など、認証で失敗するエラー（Access denied） … ユーザ名やパスワードが違う。DB 側のアカウント設定を確認する",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "DB は動くがアプリが待つ",
          text: "DB 自体には直接つながるのに、アプリからは待たされる、というときは、コネクションプールの枯渇が疑われます。設定した最大接続数と、今使われている接続数を確認しましょう。",
        },
        {
          type: "h2",
          text: "コンテナ自体が動いているか",
        },
        {
          type: "p",
          text: "Docker や Kubernetes で動かしている構成では、アプリのコンテナ自体が起動していない、または起動と停止を繰り返していることがあります。",
        },
        {
          type: "code",
          title: "例（Docker）",
          lang: "text",
          code: `$ docker ps
CONTAINER ID   IMAGE            STATUS                         PORTS                     NAMES
1a2b3c4d5e6f   shinsei:latest   Up 2 hours                     0.0.0.0:8080->8080/tcp   shinsei-app
7f8e9d0c1b2a   mysql:8.0        Restarting (1) 5 seconds ago                             shinsei-db`,
        },
        {
          type: "code",
          title: "例（Kubernetes）",
          lang: "text",
          code: `$ kubectl get pods
NAME                       READY   STATUS             RESTARTS   AGE
shinsei-7d8f9c6b5d-abcde   0/1     CrashLoopBackOff   7          12m`,
        },
        {
          type: "ul",
          items: [
            "Docker の `STATUS` が `Up` 以外（`Restarting` など）… 起動直後に落ちている可能性",
            "Kubernetes の `STATUS` が `CrashLoopBackOff` … 起動に失敗して再起動を繰り返している",
            "`RESTARTS`（Kubernetes）の回数が多い … 一定間隔で落ちている可能性",
          ],
        },
        {
          type: "p",
          text: "コンテナが起動と停止を繰り返していると、アプリのログが急に途切れる、操作したのにログが無い、といった症状に見えることがあります。ログの出力先は「アプリログの場所と読み方」のとおりですが、コンテナ自体が無ければ、そのログもありません。",
        },
        {
          type: "h2",
          text: "外部の Tomcat や HTTP サーバが動いているか",
        },
        {
          type: "p",
          text: "Docker や Kubernetes を使わない構成では、外部の Tomcat や、その手前の nginx / Apache などが、それぞれ別のプロセス・サービスとして動いています。アプリのコードや DB に問題が無くても、これらが止まっていれば同じような症状に見えます。",
        },
        {
          type: "p",
          text: "Spring Boot を内蔵 Tomcat だけで動かしている構成では、Java プロセス自体がサーブレットコンテナなので、ここは「プロセスとリソースを見る」で確認したものと同じです。",
        },
        {
          type: "code",
          title: "例（Linux、systemd を使う環境。動いているとき）",
          lang: "text",
          code: `$ systemctl status nginx
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled)
   Active: active (running) since Mon 2026-08-31 09:12:03 JST; 3h ago
 Main PID: 1234 (nginx)
    Tasks: 3 (limit: 4915)
   CGroup: /system.slice/nginx.service
           ├─1234 nginx: master process /usr/sbin/nginx
           └─1235 nginx: worker process`,
        },
        {
          type: "p",
          text: "`Active: active (running)` なら動いています。`inactive (dead)` や `failed` なら止まっています。",
        },
        {
          type: "code",
          title: "例（サービス名が違うとき）",
          lang: "text",
          code: `$ systemctl status tomcat
Unit tomcat.service could not be found.`,
        },
        {
          type: "p",
          text: "ここでの `nginx` `tomcat` はサービス名の例で、実際の名前は環境によって違います（`tomcat9` など）。`Unit ... could not be found` と出た場合は、止まっているのではなく名前が違うだけのことが多いです。名前が分からないときは、「Linux の基本操作」で見た `ps` に、探したいプロセス名（`tomcat` や `nginx`）を渡して探しましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "手前が止まっていると、アプリのログにも何も残らない",
          text: "手前の HTTP サーバや外部の Tomcat が止まっていると、リクエストはアプリまで届きません。アプリのログを探しても見つからないのは当然です。「アプリログの場所と読み方」で追う前に、ここを確認しましょう。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "アプリは正常でもミドルウェアが原因のことがある",
          text: "コードやデータに問題が見つからないときは、DB やメッセージキューなどのミドルウェア、コンテナや外部の Tomcat・HTTP サーバの起動状態も疑いましょう。アプリのソースだけを読み続けても見つかりません。",
        },
        { type: "quiz", id: "ts-middleware" },
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
04:12:03.105 DEBUG [nio-8080-exec-3] j.c.e.s.a.ServiceLoggingAspect : start RequestService.findMine(..)
04:12:03.110 DEBUG [nio-8080-exec-3] j.c.e.s.m.RequestMapper.findMine : ==>  Preparing: SELECT r.id, r.title, r.status, r.applicant_id, r.approver_id, r.applicant_email, r.created_at, a.display_name AS applicant_name, v.display_name AS approver_name FROM t_request r JOIN t_user a ON a.id = r.applicant_id LEFT JOIN t_user v ON v.id = r.approver_id WHERE (r.applicant_id = ? OR r.approver_id = ?) AND r.status = 'PENDING' ORDER BY r.created_at DESC
04:12:03.112 DEBUG [nio-8080-exec-3] j.c.e.s.m.RequestMapper.findMine : ==> Parameters: 7(Long), 7(Long)
04:12:03.115 DEBUG [nio-8080-exec-3] j.c.e.s.m.RequestMapper.findMine : <==      Total: 4
04:12:03.118 DEBUG [nio-8080-exec-3] j.c.e.s.a.ServiceLoggingAspect : end RequestService.findMine(..)`,
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
          code: `04:12:03.100 INFO  [nio-8080-exec-3] ...AccessLogInterceptor : GET /shinsei/requests
04:12:03.102 INFO  [nio-8080-exec-5] ...AccessLogInterceptor : GET /shinsei/requests/12
04:12:03.105 DEBUG [nio-8080-exec-3] ...ServiceLoggingAspect : start RequestService.findMine(..)
04:12:03.108 DEBUG [nio-8080-exec-5] ...ServiceLoggingAspect : start RequestService.findById(..)
04:12:03.110 DEBUG [nio-8080-exec-3] ...RequestMapper.findMine : ==> Parameters: 7(Long), 7(Long)`,
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
          text: "Tomcat の exec-3 は、前のリクエストが終わったあと、別のリクエストに使われます。スレッド名だけで日付を問わず拾うと、別操作が混ざります。時刻の幅を付けましょう。逆に、時刻が近いだけでは別ユーザーの操作と区別できません。userId や申請 ID などの識別子で、同じ操作かを確認しましょう。同じユーザーの次の操作が、別のスレッド名になることもあります。",
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
          text: "ここからは MyBatis の DEBUG に限った話です。Mapper の DEBUG を出すと、実行された SQL が見えます。本番では普段 DEBUG を出していないことが多いです。必要なときだけレベルを上げ、終わったら戻しましょう。",
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
          text: "出す先は `logging.level` です。申請くんなら Mapper のパッケージ（`jp.co.example.shinsei.mapper` など）に DEBUG を付けましょう。XML の id と Java のメソッド名が Logger に出ることがあります。その SQL をソースで探す手順は、「リクエストの追跡」の「SQL からソースを探す」です。",
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
          text: "申請くんなら、自分たちが書いたコードのパッケージは jp.co.example.shinsei です。org.springframework や java. はフレームワークや Java 本体なので、直す場所ではありません。$$Enhancer や $Proxy も生成コードなので飛ばしましょう。",
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
          title: "RequestService.java（申請くん・抜粋、42〜49行目）",
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
          caption: "「エラーが発生しました」だけでは、サーバ側かフロント側かは分かりません。先に Network タブで、操作した瞬間のリクエストを確認しましょう。",
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
          text: "at 行があれば、フレームワークやライブラリは飛ばし、自分たちが書いたコードのパッケージ名がある行のソースを見ましょう。原因になった値や条件が、どこでその状態になったかを上流へ辿りましょう。辿り方は「ソースの読み方」の「値の源流」です。",
          link: {
            label: "値の源流",
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
            "DB 上のロールや承認者マスタ（コードは通っているのにデータで落ちる）",
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
          text: "ログに SQL とバインド値を出せるなら、検証用環境の DB で再実行しましょう。SELECT ならそのまま試せます。UPDATE や DELETE はデータを書き換えるので、「リクエストの追跡」の「SQL からソースを探す」の注意を見ましょう。結果が画面と同じなら、その SQL 自体は正しく動いています。それでも期待と違うなら、上の表のとおりレコードの値やマスタのずれを疑いましょう。コード上のメソッド名と、実際に飛んでいる SQL が一致しているかも確認しましょう。",
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
            "Spring Boot の起動プロファイルと `application-*.yml` / `application-*.properties`",
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
          text: "遅さはエラーログに出ないことが多いです。先に、同じリクエストのログのタイムスタンプを並べ、どこで時間が空いているかを見ましょう。",
        },
        {
          type: "h2",
          text: "タイムスタンプの差",
        },
        {
          type: "p",
          text: "連続した 2 行の時刻差が、その間にかかった時間です。差が大きい区間が、遅い箇所です。処理の入口のメソッドを読む前に、この差で範囲を狭めましょう。",
        },
        {
          type: "code",
          title: "計測ログを追加した例（申請くんの実ログではない）",
          highlightLines: [2, 3],
          code: `2026-08-16 04:12:03.100 INFO  ... [nio-8080-exec-3] j.c.e.s.controller.RequestController : list start
2026-08-16 04:12:03.105 INFO  ... [nio-8080-exec-3] j.c.e.s.service.RequestService : findMine start
2026-08-16 04:12:08.410 INFO  ... [nio-8080-exec-3] j.c.e.s.service.RequestService : findMine done
2026-08-16 04:12:08.412 INFO  ... [nio-8080-exec-3] j.c.e.s.controller.RequestController : list done`,
        },
        {
          type: "p",
          text: "上は計測ログを追加した例で、申請くんの実ログではありません。`findMine` の start と done のあいだが約 5 秒なので、遅いのは Service の中（SQL やその前後の I/O）です。申請くんの既存ログでは `ServiceLoggingAspect` が DEBUG で start / end を出します。",
        },
        {
          type: "ul",
          items: [
            "ミリ秒まで見る。秒だけだと差が消える",
            "スレッド名（`nio-8080-exec-3` など）やリクエスト ID で、同じリクエストの行だけを揃える。別リクエストの行が混ざると差が無意味になる",
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
            ["1 件の詳細が遅い", "関連の逐次取得、外部 API"],
            ["更新が待たされる", "レコードロック、別トランザクション"],
            ["時間帯で遅い", "バッチ、同時実行、コネクションプール枯渇"],
          ],
        },
        {
          type: "p",
          text: "SQL ログの回数を見ましょう。一覧のレコード数だけ SELECT が増えるなら N+1 です。",
        },
        {
          type: "h2",
          text: "`EXPLAIN` で SQL の実行計画を見る",
        },
        {
          type: "p",
          text: "ログの時刻差で、遅い SQL まで絞れたら、その SQL を検証用 DB で `EXPLAIN` してみましょう。実行計画とは、DB がその SQL をどう読むかの手順です。MySQL では次の書き方です。",
        },
        {
          type: "code",
          title: "例（検証用環境の MySQL）",
          lang: "sql",
          code: `EXPLAIN SELECT * FROM t_request WHERE applicant_id = 7;`,
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
          text: "`type` が `ALL` で `rows` の見積もりが大きいなら、条件に合わないレコードも大量に読んでからフィルタしています。それがそのままログの `Preparing` から `Total` までの時間に表れます。",
        },
        {
          type: "callout",
          kind: "note",
          title: "possible_keys が NULL でもインデックスが無いとは限らない",
          text: "`possible_keys` が `NULL` なのは、その SQL の条件で使える候補が無いという意味です。テーブルに他のインデックスがあっても、`WHERE` や `ORDER BY` のカラムと合わなければ候補になりません。",
        },
        {
          type: "p",
          text: "`EXPLAIN` の結果だけで、インデックスを足せば直るとは限りません。`OR` の左右が別カラムだったり、絞り込みと並べ替えのカラムが違ったりすると、`INDEX` を 1 本足すだけでは `type` が `ALL` のまま変わらないこともあります。SQL の書き方自体を見直す必要があることもあります。この読み方を使った具体例は、シナリオの「申請履歴の検索が遅い」で見られます。",
          link: {
            label: "[障害調査] 申請履歴の検索が遅い",
            to: "/tracks/scenario/history-slow",
          },
        },
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
          text: "アプリが急に落ちる、動きが重くなる、といった症状のときは、メモリと GC（ガベージコレクション）にも当たりをつけましょう。エラーログに `OutOfMemoryError` が出ていれば、メモリ不足の可能性が高いです。出ていなくても、`Full GC` が短い間隔で繰り返されていると、そのあいだ処理が止まり、遅く感じられることがあります。",
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
          text: "落ちるところまでいかなくても、`Full GC` が短い間隔で繰り返されていると、その間アプリの処理が止まります。GC の記録を出す設定があれば見ましょう。",
        },
        {
          type: "code",
          title: "GC ログの例（設定と JDK のバージョンで書式は変わる）",
          lang: "text",
          code: `[12.345s][info][gc] GC(42) Pause Full (Allocation Failure) 1900M->1850M(2048M) 3210.123ms`,
        },
        {
          type: "p",
          text: "`->` の前後がヒープの使用量（回収前 → 回収後）で、括弧の中が上限です。回収してもほとんど減っていなければ、解放できるはずのオブジェクトが残っている、つまりメモリリークの兆候です。",
        },
        {
          type: "callout",
          kind: "note",
          title: "書式は JDK のバージョンとオプション次第",
          text: "GC ログの出し方と書式は、JDK のバージョンや起動オプションによって違います。ここで見る要点は書式そのものではなく、回収の頻度と、回収前後のヒープ使用量です。",
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
          text: "外部 API への応答待ちで止まっているときは、スレッドの状態が `RUNNABLE` のまま長時間動かないこともあります。デッドロックの表示が無いからといって、正常とは限りません。at 行の一番上に、どのクラスのどのメソッドで止まっているかが出ます。それが自分たちのコードか、外部呼び出し用のライブラリかを確認しましょう。外部呼び出しで止まっているなら、次に進むのは疎通確認です。",
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
            ["画面がずっと待つ、タイムアウト", "ログの 2 行のあいだだけ数秒〜数十秒空く。DB の SQL はすぐ終わっている"],
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
          text: "処理の入口から Service へ降りたあと、Mapper の SQL が終わった時刻と、次のログの時刻のあいだが空いていれば、その間で外部 I/O をしていることが多いです。",
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
          text: "DB 更新は 03.206 で終わっています。ERROR は 08.910 です。あいだは外部への POST 待ちです。例外クラス名はフレームワークやライブラリごとに違いますが、接続失敗・タイムアウト・HTTP 4xx / 5xx を示すことが多いです。",
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
          text: "承認処理は DB を更新したあと、MailService で申請者へメールを送る想定です。画面は承認済みなのにメールが来ないときは、Mapper の更新ログのあとに MailService の行があるかを見ましょう。SMTP サーバや通知 API の向き先は `application.yml` にあることが多いです。ただし、MailService の行が `WARN` などで残っていても、そこで例外が握りつぶされていると、それだけでは原因まで辿れません。実際にこれが起きた例は、「実務のシナリオ」の「承認は成功するのに、申請者への通知メールが届かない」で扱います。",
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
          type: "callout",
          kind: "tip",
          title: "順番",
          text: "URL とポートが分かってから、コマンドを打ちましょう。`application.yml` の接続先を特定する前に ping しても、当たる先が定まりません。",
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
