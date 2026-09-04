export type CheatRow = {
  cmd: string;
  /** 何で使うコマンドか（Linux / Windows / Git / MySQL / JDK / Docker / Kubernetes など） */
  env: string;
  desc: string;
};

export type CheatGroup = {
  title: string;
  note?: string;
  rows: CheatRow[];
};

export type CheatSection = {
  id: string;
  title: string;
  groups: CheatGroup[];
};

export const cheatSheet: CheatSection[] = [
  {
    id: "linux",
    title: "1. Linux 調査コマンド",
    groups: [
      {
        title: "サーバに入る・ファイルを見る",
        rows: [
          { cmd: "`ssh ユーザ名@ホスト名`", env: "Linux", desc: "サーバのターミナルに入る" },
          { cmd: "`docker exec -it コンテナ名 bash`", env: "Docker", desc: "コンテナに入る" },
          { cmd: "`kubectl exec -it Pod名 -- bash`", env: "Kubernetes", desc: "Pod に入る" },
          { cmd: "`ls -l`", env: "Linux", desc: "ファイル一覧と、パーミッション・所有者を見る" },
        ],
      },
      {
        title: "ログを絞り込む・数える",
        note: "1つのファイルが大きい、パターンが複数ある、圧縮済みで探せない、といった「ログが多すぎる／見づらい」ときの組み合わせです。",
        rows: [
          { cmd: "`tail -f app.log | grep requestId=12`", env: "Linux", desc: "追記される行をリアルタイムで絞り込む" },
          { cmd: "`grep -n -A 5 -B 5 'ERROR' app.log`", env: "Linux", desc: "`ERROR` の行と、その前後 5 行ずつを行番号付きで見る。例外の直前に何が起きていたかが分かる" },
          { cmd: "`grep -c 'NullPointerException' app.log`", env: "Linux", desc: "件数だけ数える。頻発しているかどうかの当たりをつける" },
          { cmd: "`grep -E 'ERROR|WARN' app.log`", env: "Linux", desc: "`-E` で複数パターンを `|`（または）でまとめて拾う" },
          { cmd: "`zgrep 'requestId=12' app.log.1.gz`", env: "Linux", desc: "ローテートで `.gz` 圧縮された過去ログも、展開せずそのまま検索する" },
          { cmd: "`tail -n 5000 app.log | grep ERROR`", env: "Linux", desc: "ファイル全体を検索すると重いとき、直近だけに絞ってから検索する" },
          { cmd: "`awk '$1 >= \"04:12:00.000\" && $1 <= \"04:13:00.000\"' app.log`", env: "Linux", desc: "行の先頭が時刻のログで、特定の時間帯だけを切り出す" },
          {
            cmd: "`sed -n '/04:12:00/,/04:13:00/p' app.log`",
            env: "Linux",
            desc: "`04:12:00` を含む最初の行から、次に `04:13:00` を含む行までを、まるごと抜き出す。時刻に限らず、2つの目印文字列で挟まれた範囲を取り出したいときにも使える",
          },
        ],
      },
      {
        title: "access.log を集計する（combined 形式）",
        note: "「HTTP サーバのログを見る」の combined 形式（`IP - - [日時] \"メソッド パス バージョン\" ステータス サイズ`）が前提です。空白区切りのフィールド番号は、この形式の並びに合わせています。",
        rows: [
          { cmd: "`awk '{print $9}' access.log | sort | uniq -c | sort -rn`", env: "Linux", desc: "ステータスコード別の件数を、多い順に集計する" },
          { cmd: "`awk '$9 == 500 {print $7}' access.log | sort | uniq -c | sort -rn`", env: "Linux", desc: "500 が出ているパスだけを、多い順に集計する" },
          { cmd: "`awk '{print $7}' access.log | sort | uniq -c | sort -rn | head`", env: "Linux", desc: "アクセスが多いパスの上位を見る" },
        ],
      },
      {
        title: "プロセス・スレッドの負荷",
        note: "「重い」がアプリ全体か、特定のスレッド（処理）かを切り分けるときに使います。",
        rows: [
          { cmd: "`ps -eo pid,ppid,%cpu,%mem,etime,cmd --sort=-%cpu | head`", env: "Linux", desc: "CPU 使用率が高いプロセスを上位から見る" },
          { cmd: "`top -H -p PID`", env: "Linux", desc: "そのプロセスの中で、どのスレッドが CPU を使っているかを見る" },
          { cmd: "`ps -o rss,vsz,cmd -p PID`", env: "Linux", desc: "OS から見た実メモリ使用量（RSS）と仮想メモリサイズ（VSZ）を見る" },
        ],
      },
      {
        title: "ポート・ファイル・ディスク",
        rows: [
          { cmd: "`lsof -i :8080`", env: "Linux", desc: "そのポートを使っているプロセスを見る" },
          { cmd: "`ss -ltnp | grep 8080`", env: "Linux", desc: "同じことを `ss` で見る。`lsof` が無い環境向け" },
          { cmd: "`lsof app.log`", env: "Linux", desc: "そのファイルを開いているプロセスを見る" },
          { cmd: "`df -h`", env: "Linux", desc: "ディスクの空き容量を見る" },
          { cmd: "`free -h`", env: "Linux", desc: "メモリの空き容量を見る" },
          { cmd: "`du -sh * | sort -rh | head`", env: "Linux", desc: "今いるディレクトリの中で、容量を食っている項目を上位から見る" },
          { cmd: "`find /var/log -name \"*.log\" -mtime -1`", env: "Linux", desc: "直近 1 日以内に更新されたログファイルを探す" },
          { cmd: "`find / -xdev -type f -size +100M`", env: "Linux", desc: "100MB を超えるファイルを、マウント境界（`-xdev`）を越えずに再帰的に探す。`du` は今いる階層しか見ないので、原因がどこにあるか分からないときに使う" },
          { cmd: "`find . -type f -name \"*.log\" | xargs du -h | sort -rh | head`", env: "Linux", desc: "見つけたログファイルをまとめてサイズ順に並べる（`find` と `du`・`sort` の組み合わせ）" },
        ],
      },
      {
        title: "systemd サービスの確認",
        rows: [
          { cmd: "`systemctl status nginx`", env: "Linux", desc: "サービスの稼働状態を見る" },
          { cmd: "`systemctl list-unit-files --type=service | grep -i tomcat`", env: "Linux", desc: "正しいユニット名を探す。停止中のサービスも一覧に出る" },
          { cmd: "`journalctl -u tomcat9 --since \"10 min ago\"`", env: "Linux", desc: "systemd 管理下のサービスの、直近のログをまとめて見る" },
          { cmd: "`journalctl -u tomcat9 -f`", env: "Linux", desc: "同じログをリアルタイムで追う。`tail -f` の systemd 版" },
        ],
      },
      {
        title: "プロセス・サービスを止める・再起動する",
        note: "ここからは調査ではなく操作です。本番・共有環境では、対象と影響範囲（他の利用者がいないか、処理の途中でないか）を確認してから実行しましょう。",
        rows: [
          { cmd: "`kill -TERM PID`", env: "Linux", desc: "正常終了のシグナルを送る。アプリ側の後始末（シャットダウン処理）が動く猶予がある。`kill PID` も既定で同じ" },
          { cmd: "`kill -9 PID`", env: "Linux", desc: "強制終了。後始末は動かない。`TERM` で終わらないときの最終手段" },
          { cmd: "`systemctl restart tomcat9`", env: "Linux", desc: "サービスを再起動する" },
          { cmd: "`systemctl stop tomcat9`\n`systemctl start tomcat9`", env: "Linux", desc: "停止と起動を別々に行う。設定を変えたあとに使うことが多い" },
          { cmd: "`docker restart コンテナ名`", env: "Docker", desc: "コンテナを再起動する" },
          { cmd: "`docker kill コンテナ名`", env: "Docker", desc: "コンテナを強制停止する（SIGKILL 相当）。`docker stop` はまず正常終了を試みてから止める点が違う" },
        ],
      },
      {
        title: "直近の変更を確認する",
        rows: [
          { cmd: "`stat application.yml`", env: "Linux", desc: "ファイルの Modify（中身の変更） / Change（メタデータの変更）時刻を見る" },
          { cmd: "`docker inspect --format='{{.Created}}' shinsei-app`", env: "Docker", desc: "コンテナの作成時刻を見る" },
          { cmd: "`find /opt/app -newer application.yml -type f`", env: "Linux", desc: "特定のファイルより後に更新された（＝配置された）ファイルだけを探す。デプロイで一括更新された範囲の当たりをつける" },
          { cmd: "`find . -newermt \"2026-08-30 09:00\" ! -newermt \"2026-08-30 10:00\"`", env: "Linux", desc: "指定した時間帯だけに更新されたファイルを探す（GNU find の `-newermt`。日時を直接指定できる）" },
        ],
      },
      {
        title: "設定ファイルを横断して探す",
        note: "設定は `application.yml` / `application-dev.yml` / `docker-compose.yml` のように複数ファイルへ分かれ、あとから読み込む方や環境変数が上書きすることもあります。特定のキーや値がどのファイルに書いてあるかを、ディレクトリごと探すときに使います。",
        rows: [
          { cmd: "`grep -Rn \"context-path\" --include=\"*.yml\" .`", env: "Linux", desc: "カレントディレクトリ以下の `.yml` ファイルから、そのキーを持つ行をファイル名・行番号付きで探す" },
          { cmd: "`grep -Rln \"shinsei_dev\" .`", env: "Linux", desc: "その値（DB 名やホスト名など）を含むファイルの名前だけを一覧する（`-l` は行内容ではなくファイル名を出す指定）" },
          { cmd: "`grep -Rn \"shinsei_dev\" --include=\"*.yml\" . | grep -v test`", env: "Linux", desc: "検索結果からさらに `grep -v` で除きたいファイル・行を弾く（テスト用の設定を除外する、など）" },
          { cmd: "`find . -name \"*.yml\" -exec grep -l \"context-path\" {} \\;`", env: "Linux", desc: "`find` でファイルを絞ってから `grep` に渡す書き方。ファイル名の条件（更新日時やサイズなど）を `find` 側で細かく指定したいときに使う" },
        ],
      },
    ],
  },
  {
    id: "git",
    title: "2. Git 調査コマンド",
    groups: [
      {
        title: "いつ、誰が、何を変えたか",
        note: "「昨日まで動いていたのに」という調査で、疑わしいファイルや行を起点に、変更の経緯を辿るときの組み合わせです。",
        rows: [
          {
            cmd: "`git log --until=\"2026-08-30 09:00\" -3 --pretty=format:\"%h %ad %s\" --date=format:\"%Y-%m-%d %H:%M\"`",
            env: "Git",
            desc: "症状が報告された時刻より前の変更だけを見る",
          },
          { cmd: "`git log -p -- src/main/java/.../RequestService.java`", env: "Git", desc: "特定ファイルに絞って、コミット履歴と差分を一緒に見る" },
          { cmd: "`git log -S\"getApproverId\" --oneline`", env: "Git", desc: "その文字列を追加・削除したコミットだけを探す（pickaxe）。メソッド名や設定キーの変更点を追うときに使う" },
          { cmd: "`git blame -L 40,60 RequestService.java`", env: "Git", desc: "40〜60 行目が、それぞれ最後にどのコミットで今の形になったかを見る" },
          { cmd: "`git show コミットハッシュ`", env: "Git", desc: "特定のコミットの変更内容だけを見る" },
          { cmd: "`git diff HEAD~5 -- application.yml`", env: "Git", desc: "直近 5 コミットでの、その設定ファイルの差分だけを見る" },
          { cmd: "`git log --since=\"2026-08-29\" --until=\"2026-08-30\" --author=\"yamada\"`", env: "Git", desc: "期間と作成者の両方で絞り込む" },
        ],
      },
      {
        title: "壊れたコミットを二分探索で特定する",
        note: "「いつからか」は分かったが、その間に何十件もコミットがあって1件ずつ追えないときの手段です。",
        rows: [
          {
            cmd: "`git bisect start`\n`git bisect bad`\n`git bisect good コミットハッシュ`",
            env: "Git",
            desc: "今を bad、正常だったと分かっている時点を good に指定すると、Git が残りを自動で二分探索してくれる。動作確認のたびに `git bisect good` / `git bisect bad` を答え、終わったら `git bisect reset`",
          },
        ],
      },
    ],
  },
  {
    id: "sql",
    title: "3. SQL 調査（EXPLAIN・ログ・ロック）",
    groups: [
      {
        title: "テーブル定義を確認する",
        note: "ソースだけを見て思い込んだカラム名や型が、実際の DB と違っていることがあります。SQL やコードを疑う前に、まず実物を見ましょう。",
        rows: [
          { cmd: "`SHOW TABLES;`", env: "MySQL", desc: "今つないでいる DB にあるテーブルの一覧を見る" },
          { cmd: "`DESCRIBE t_request;`", env: "MySQL", desc: "カラム名・型・NULL を許すか・キーの種類を一覧する" },
          { cmd: "`SHOW CREATE TABLE t_request;`", env: "MySQL", desc: "CREATE TABLE 文そのものを見る。外部キー制約やデフォルト値、文字コードまでまとめて分かる" },
          { cmd: "`SHOW INDEX FROM t_request;`", env: "MySQL", desc: "そのテーブルに張られているインデックスを見る。`EXPLAIN` の `possible_keys` と突き合わせるときに使う" },
        ],
      },
      {
        title: "実行計画とレコードの確認",
        rows: [
          { cmd: "`EXPLAIN SELECT * FROM t_request WHERE applicant_id = 7;`", env: "MySQL", desc: "その SQL の実行計画（DB がどう読むか）を見る" },
          { cmd: "`EXPLAIN ANALYZE SELECT * FROM t_request WHERE applicant_id = 7;`", env: "MySQL", desc: "実行計画に、実際にかかった時間も添えて見る（MySQL 8.0.18 以降）" },
          { cmd: "MyBatis の DEBUG ログ（`Preparing` / `Parameters` / `Total`）", env: "MyBatis", desc: "発行された SQL 文、バインド値、件数を見る" },
          { cmd: "`SELECT id, title, status, created_at, updated_at FROM t_request WHERE id = 11;`", env: "MySQL", desc: "レコードの更新日時を直接確認する" },
        ],
      },
      {
        title: "詰まっている・待たされているとき",
        note: "「更新が返ってこない」「アプリの接続がなかなか空かない」というときに、DB 側から見る手段です。MyBatis のログとあわせて、どのクエリがどれだけ待っているかを見ましょう。",
        rows: [
          { cmd: "`SHOW PROCESSLIST;`", env: "MySQL", desc: "今実行中のクエリと、その状態を一覧する。長時間残っているクエリやロック待ちが無いかを見る" },
          { cmd: "`SELECT * FROM information_schema.INNODB_TRX;`", env: "MySQL", desc: "今実行中のトランザクションを一覧する（InnoDB）" },
          { cmd: "`SHOW ENGINE INNODB STATUS\\G`", env: "MySQL", desc: "直近のロック待ち・デッドロックの詳細を見る（InnoDB）。`\\G` は mysql クライアントでの縦表示指定" },
        ],
      },
    ],
  },
  {
    id: "http",
    title: "4. HTTP・ネットワーク確認",
    groups: [
      {
        title: "層ごとに確認する（ping → TCP → HTTP）",
        note: "「アプリのログにリクエストが無い」「外部 API への接続でエラーが出る」というときは、届いていない層を上から順に絞り込みます。",
        rows: [
          { cmd: "`ping intranet.example.co.jp`", env: "Linux / Windows", desc: "ホストが応答するか（ICMP。HTTP とは別）" },
          { cmd: "`Test-NetConnection -ComputerName intranet.example.co.jp -Port 8080`", env: "Windows", desc: "そのポートで TCP 接続できるか" },
          { cmd: "`nc -zv intranet.example.co.jp 8080`", env: "Linux", desc: "同じ確認を `nc` で行う" },
          { cmd: "`curl -I http://intranet.example.co.jp:8080/shinsei/requests`", env: "Linux / Windows", desc: "HTTP でパスまで届くか。ヘッダだけを見る" },
          { cmd: "`curl -vk https://intranet.example.co.jp/shinsei/requests`", env: "Linux / Windows", desc: "TLS のハンドシェイクまで含めて詳しく見る" },
          { cmd: "`traceroute -T -p 8080 intranet.example.co.jp`", env: "Linux", desc: "HTTP と同じ TCP で、途中どこまで届いているかを見る" },
          { cmd: "`nslookup intranet.example.co.jp`", env: "Linux / Windows", desc: "名前解決できるか、どの IP を引いているかを見る" },
        ],
      },
      {
        title: "応答内容・応答時間を掘る",
        note: "疎通はしているのに、内容や速さがおかしいときの組み合わせです。",
        rows: [
          { cmd: "`curl -o /dev/null -s -w \"%{http_code} %{time_total}s\\n\" URL`", env: "Linux / Windows", desc: "本文は捨てて、ステータスコードと合計時間だけを簡潔に見る" },
          { cmd: "`curl -s URL | jq .`", env: "Linux", desc: "JSON の応答を整形して見る（`jq` が入っている環境）" },
          { cmd: "`for i in 1 2 3 4 5; do curl -o /dev/null -s -w \"%{http_code} %{time_total}s\\n\" URL; done`", env: "Linux", desc: "同じ URL を複数回叩いて、応答のブレ（毎回同じか、時々遅い・失敗するか）を見る" },
        ],
      },
      {
        title: "待ち受けポート・経路・ファイアウォールを見る",
        note: "TCP は通るのにこのホストだけ失敗する、経路の途中で止まっている、といったときに、ホスト側の設定を見る手段です。",
        rows: [
          { cmd: "`ip addr`", env: "Linux", desc: "自分のホストの NIC（ネットワークインタフェース）と、割り当てられている IP アドレスを見る" },
          { cmd: "`ifconfig`", env: "Linux", desc: "同じ確認を、より古い `ifconfig` で見る（`ip` コマンドが無い環境向け）" },
          { cmd: "`ipconfig /all`", env: "Windows", desc: "NIC と IP アドレス、デフォルトゲートウェイ、DNS サーバをまとめて見る" },
          { cmd: "`ss -tnlp`", env: "Linux", desc: "このホストで今 `LISTEN` しているポートと、それを持つプロセスを一覧する" },
          { cmd: "`netstat -tnlp`", env: "Linux", desc: "同じことを、より古い `netstat` で見る（`ss` が無い環境向け）" },
          { cmd: "`ip route`", env: "Linux", desc: "ルーティングテーブルを見る。宛先ごとに、どのゲートウェイ・インターフェースへ出ていくかが分かる" },
          { cmd: "`route -n`", env: "Linux", desc: "同じルーティングテーブルを、より古い `route` コマンドで見る" },
          { cmd: "`route print`", env: "Windows", desc: "ルーティングテーブルを見る" },
          { cmd: "`iptables -L -n -v`", env: "Linux", desc: "現在のファイアウォールルール（許可・拒否）を見る（`iptables` を使っている環境）" },
          { cmd: "`firewall-cmd --list-all`", env: "Linux", desc: "`firewalld` を使っている環境（RHEL 系で多い）でのルール確認" },
          { cmd: "`netsh advfirewall show allprofiles state`", env: "Windows", desc: "ファイアウォールが有効になっているかを見る" },
        ],
      },
      {
        title: "実際に流れているパケットを見る（tcpdump）",
        note: "curl や nc の結果だけでは分からない、通信そのものの中身やタイミングを見たいときに使います。curl より一段低いレイヤーです。実行には root 権限が要ることが多く（`sudo` を付けるなど）、`-i any` は全インタフェースを対象にする指定です。特定の NIC に絞りたいときは、上の `ip addr` で名前（`eth0` や `ens5` など、環境によって違います）を確認してから置き換えましょう。",
        rows: [
          { cmd: "`tcpdump -i any port 8080`", env: "Linux", desc: "そのポートに実際にパケットが届いているかを見る。`ss`/`netstat` は待ち受けの有無までで、通信そのものは見えない" },
          { cmd: "`tcpdump -i any host notify.example.internal`", env: "Linux", desc: "特定の相手先とのやり取りだけに絞る。外部 API への疎通確認と組み合わせる" },
          { cmd: "`tcpdump -nn -i any -A port 80`", env: "Linux", desc: "HTTP（暗号化されていない通信）の中身を文字として表示する。HTTPS では中身までは読めない" },
          { cmd: "`tcpdump -i any -w capture.pcap`", env: "Linux", desc: "その場で読まずファイルに書き出す。あとで自分の PC に持ち帰り、Wireshark で開いて詳しく見る" },
        ],
      },
    ],
  },
  {
    id: "jvm",
    title: "5. JVM（スレッド・GC・メモリ）",
    groups: [
      {
        title: "スレッドダンプ（処理が返ってこないとき）",
        note: "1回だけでなく、数秒おきに2〜3回取って比べましょう。同じスレッドが毎回同じ場所で止まっていれば、そこが疑わしい箇所です。",
        rows: [
          { cmd: "`jstack PID`", env: "JDK", desc: "その瞬間の全スレッドの状態を書き出す" },
          { cmd: "`docker exec -it コンテナ名 jstack PID`", env: "Docker", desc: "Docker コンテナの中の Java プロセスに対して取る" },
          { cmd: "`kubectl exec -it Pod名 -- jstack PID`", env: "Kubernetes", desc: "Kubernetes の Pod の中の Java プロセスに対して取る" },
          { cmd: "`jcmd PID Thread.print`", env: "JDK", desc: "`jstack` が使えない環境で、同等のスレッドダンプを取る" },
          { cmd: "`kill -3 PID`", env: "Linux", desc: "Java プロセスに送ると、プロセスは終了せず、`jstack` と同じ内容のスレッドダンプを標準出力（多くはアプリのログ）へ書き出す。`jstack` コマンド自体が使えない環境で使う" },
        ],
      },
      {
        title: "GC・メモリ",
        rows: [
          { cmd: "`jstat -gcutil PID 1000`", env: "JDK", desc: "1 秒おきに GC の状況を表示する。`FGC` は `Full GC` の回数、`FGCT` はその合計時間" },
          { cmd: "`jcmd PID GC.heap_info`", env: "JDK", desc: "今のヒープの使用状況を表示する" },
          { cmd: "`jmap -dump:format=b,file=heap.hprof PID`", env: "JDK", desc: "ヒープの中身をファイルに書き出す（ヒープダンプ）" },
          { cmd: "`jinfo -flag MaxHeapSize PID`", env: "JDK", desc: "実際に効いている `-Xmx`（最大ヒープサイズ）の値を確認する" },
        ],
      },
    ],
  },
];

export type CheatSheetAnchors = {
  sectionId: string;
  groupIds: string[];
};

/** 見出しへの通し番号の id。ArticleToc・目次・検索のジャンプ先で共通して使う唯一の割り当て元 */
export function cheatSheetAnchors(): CheatSheetAnchors[] {
  let index = 0;
  return cheatSheet.map((section) => {
    const sectionId = `h-${index}`;
    index += 1;
    const groupIds = section.groups.map(() => {
      const id = `h-${index}`;
      index += 1;
      return id;
    });
    return { sectionId, groupIds };
  });
}
