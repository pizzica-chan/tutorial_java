import type { Quiz } from "../types";

export const quizzes = {
  "ori-goal": {
    id: "ori-goal",
    question: "既存アプリで特定の画面処理を追うとき、最初にやることはどれ？",
    choices: [
      "リポジトリを先頭ファイルから通読する",
      "対象画面の URL を確認し、同じパスをソース検索する",
      "仕様書を最初から最後まで暗記する",
      "本番 DB を直接更新して挙動を確認する",
    ],
    answer: 1,
    explanation: "画面や API の URL → Controller が最短です。全体通読より、今動いている一本の線を追います。",
  },
  "web-front-back": {
    id: "web-front-back",
    question: "申請一覧の件数がおかしい。先に見るのはどれ？",
    choices: [
      "一覧テンプレートの色や余白",
      "実行された SQL と、その条件の DB のレコード",
      "ブラウザのキャッシュを消すだけ",
      "一覧の 1 ページあたりの表示件数（ページングの設定）",
    ],
    answer: 1,
    explanation: "一覧の件数は、SQL が読んだ DB のレコードの数です。先に実行された SQL を見て、同じ条件でレコードを数えます。ページングの表示件数は、SQL で読んだあとの見せ方の設定なので、まずは SQL 側を確認します。見た目の CSS とは切り分けが違います。",
  },
  "web-front-roles": {
    id: "web-front-roles",
    question: "申請一覧の承認ボタンが画面に見えない。まず確認するのはどれ？",
    choices: [
      "CSS ファイルが 404 になっていないか、Network タブで確認する",
      "開発者ツールの Elements タブで、ボタンの要素があるかを確認する",
      "JavaScript のコンソールにエラーが出ていないか確認する",
      "サーバを再起動する",
    ],
    answer: 1,
    explanation: "要素が無ければ HTML の表示条件や JavaScript を疑い、要素があれば CSS で隠れていないかを疑います。見えない原因がどちらかで、確認する場所が変わります。",
  },
  "web-ajax": {
    id: "web-ajax",
    question: "画面内の検索でアドレスバーが変わらない。HTTP 通信について妥当なのはどれ？",
    choices: [
      "アドレスバーが同じなら、通信は無い",
      "無いとは限らない。Network タブの Fetch/XHR を確認する",
      "必ずページ全体が読み直される",
      "必ず JSON が返る",
    ],
    answer: 1,
    explanation: "Ajax では、今のページを残したまま JavaScript が HTTP 通信できます。アドレスバーだけでは判断できません。Network タブの Fetch/XHR を確認しましょう。応答が JSON かどうかは、その通信の本文と `Content-Type` で分かります。",
  },
  "web-api-json": {
    id: "web-api-json",
    question: "fetch で Web API を呼んだ。JSON を読む前に確認するのはどれ？",
    choices: [
      "ステータスコードと `Content-Type`",
      "レスポンス本文の文字数（`Content-Length`）",
      "リクエストヘッダの `Accept`",
      "呼び出し元の JavaScript の行番号",
    ],
    answer: 0,
    explanation: "401 や 500 でも fetch の通信自体は完了します。ステータスコードが成功で、`Content-Type` が `application/json` であることを確認してから JSON を読みましょう。",
  },
  "web-json-ui": {
    id: "web-json-ui",
    question: "上の React の例で、一覧の件数がおかしい。先に確認するのはどれ？",
    choices: [
      "最初に返ってきた HTML に行が入っているかだけ",
      "JSON を返す Web API の応答（ステータスコードと本文）",
      "アドレスバーが変わったかだけ",
      "React の state が更新されたかだけ",
    ],
    answer: 1,
    explanation: "上の例では一覧の行を JSON から組みます。Network タブの Fetch/XHR で応答を確認しましょう。JSON の件数も違うなら API の SQL と DB、JSON が正しいなら画面側の filter、React の state、React のプロパティ名を調べます。",
  },
  "web-status": {
    id: "web-status",
    question: "ログイン後の操作で「権限がありません」と出た。ステータスコードについて妥当なのは？",
    choices: [
      "必ず 403 になる",
      "403 は「権限が無い」と読むステータスコードだが、実際のステータスコードや画面はアプリによる。Network タブで確認する",
      "必ず 401 になる",
      "必ず 500 なので、スタックトレースだけ見る",
    ],
    answer: 1,
    explanation: "403 は権限不足と読むステータスコードです。画面に「権限がありません」と出ても、200 のエラー画面や別のステータスコードのことがあります。ステータスコードの意味と、そのアプリが何を返すかは別です。",
  },
  "web-params": {
    id: "web-params",
    question: "`GET /shinsei/requests/history?title=交通費` で申請履歴を絞り込んでいる。`title=交通費` はどこに載っている？",
    choices: [
      "クエリパラメータ（URL の ? 以降）",
      "パス `/requests/history` の一部",
      "レスポンスの HTML 本文",
      "リクエストヘッダの一部",
    ],
    answer: 0,
    explanation: "? 以降がクエリです。Network タブでは Query String Parameters に出ることが多いです。Controller では `@RequestParam` で受け取ることが多いです。",
  },
  "web-cookie": {
    id: "web-cookie",
    question: "セッション ID は通常どこに載って、次のリクエストに引き継がれる？",
    choices: [
      "リクエストボディ（JSON）の中",
      "Cookie（またはそれに相当するヘッダ）",
      "URL のクエリパラメータ",
      "レスポンスヘッダの `Content-Type`",
    ],
    answer: 1,
    explanation: "ブラウザは Cookie を付けてサーバに返します。サーバはその ID でリクエストを同一セッションとみなします。",
  },
  "web-api": {
    id: "web-api",
    question: "画面の JS が JSON を期待しているのに「パースできない」と出る。Network タブでは `/shinsei/api/requests` が 200 で、`Content-Type` は `text/html`。疑うのは？",
    choices: [
      "JSON のキー名の綴りだけ",
      "ログイン画面など HTML が返っている",
      "リクエストの HTTP メソッドが GET か POST か",
      "ステータスコードが 200 以外だったかだけ",
    ],
    answer: 1,
    explanation: "API なのに HTML なら、認証失敗や間違った URL で画面用の応答が来ていることが多いです。302 経由でログイン HTML になることも、200 のまま HTML が返ることもあります。この例のようにステータスコードが 200 でも、`Content-Type` まで確認しないと HTML が返っていることに気づけません。",
  },
  "java-layer": {
    id: "java-layer",
    question: "画面の URL に対応する処理を最初に探すなら、どの層？",
    choices: ["Repository / Mapper", "Controller", "Service（業務ロジック層）", "View（テンプレート）"],
    answer: 1,
    explanation: "URL と HTTP メソッドの受付口は Controller です。JSON を返す RestController も同じ層です。そこから Service、Repository へ降ります。",
  },
  "java-mapper-xml": {
    id: "java-mapper-xml",
    question:
      "RequestMapper.xml の `WHERE r.status = #{status}` を `WHERE r.status = ${status}` に書き換えた。何が変わる？",
    choices: [
      "動きは変わらない。書き方の好みの違いだけ",
      "PreparedStatement へのバインドではなく、値がそのまま SQL の文字列に埋め込まれるようになる。利用者からの入力を渡すと SQL インジェクションの危険がある",
      "`resultType` の自動変換が効かなくなる",
      "Java のメソッド名と XML の `id` の対応が外れる",
    ],
    answer: 1,
    explanation:
      "`#{}` は `PreparedStatement` の `?` にバインドされる安全な書き方です。`${}` は文字列としてそのまま SQL に埋め込まれるため、利用者からの入力をそのまま渡すと SQL インジェクションの原因になります。",
  },
  "java-transaction": {
    id: "java-transaction",
    question:
      "`findById` で status を読んで判定したあと、条件の無い `UPDATE` で更新する承認処理がある。分離レベルを上げれば、2つのリクエストがほぼ同時に来ても安全になる？",
    choices: [
      "なる。分離レベルを上げれば同時実行はすべて防げる",
      "ならない。それぞれのリクエストは自分の SELECT の時点では正しく PENDING を読んでいるため",
      "ならない。@Transactional を外さないと意味が無いため",
      "なる。ただしメール送信だけは防げない",
    ],
    answer: 1,
    explanation:
      "分離レベルは、他のトランザクションの変更がどこまで見えるかを決めるものです。今回の2つのリクエストは、それぞれ自分が読んだ時点では本当に PENDING だったので、分離レベルを上げても隙は埋まりません。UPDATE の WHERE に状態の条件を含める（楽観ロック）か、SELECT ... FOR UPDATE で先にレコードをロックする（悲観ロック）必要があります。",
  },
  "java-template": {
    id: "java-template",
    question: "申請くんの一覧は未承認だけ出る。テンプレートの `th:if=\"${item.status == 'PENDING'}\"` は何をする？",
    choices: [
      "PENDING のときだけ承認ボタンを出す表示条件",
      "一覧の SQL で未承認だけ取る条件",
      "Spring Security の `hasRole` によるアクセス制御",
      "Controller が return するビュー名の分岐",
    ],
    answer: 0,
    explanation: "未承認だけ取るのは Mapper の SQL です。`th:if` は、組み立てる HTML にボタンを出すかどうかです。今の一覧は未承認だけなので、画面では各行にボタンが出ます。",
  },
  "java-crosscut": {
    id: "java-crosscut",
    question: "詳細の承認ボタンから Controller の `approve` に来る。ブレークポイントを置いたが止まらない。先に疑うのは？",
    choices: [
      "@Transactional の AOP プロキシが Service を包んでいる",
      "Filter、Interceptor、Spring Security など、Controller に届く前の処理",
      "ブレークポイントの条件式の書き間違い",
      "entity の toString が呼ばれて例外になっている",
    ],
    answer: 1,
    explanation: "Filter と Interceptor と Security は、Controller のソースに呼び出しがありません。だから、ソースを追うだけでは見つかりません。ここで処理が遮断されると、レスポンスは返っても、Controller は動いていません。",
  },
  "read-name": {
    id: "read-name",
    question: "画面に「承認待ち」と出る処理を探したい。有効な手がかりは？",
    choices: [
      "英語・日本語の文言、URL、テーブル名、カラム名",
      "エラーコードの数字だけ",
      "変数名の英語表記だけ",
      "ログの出力レベル（INFO / DEBUG）だけ",
    ],
    answer: 0,
    explanation: "画面に出ている言葉、パス、DB 名のどれかがヒットします。言語は一致しないことがあるので複数試します。",
  },
  "read-regex": {
    id: "read-regex",
    question: "disapprove を除き、`approve` という単語だけにマッチさせたい。適切なパターンは？",
    choices: ["`approve`", "`\\bapprove\\b`", "`.*approve.*`", "`approve$`"],
    answer: 1,
    explanation: "`\\b` は単語の境目です。`\\bapprove\\b` なら `approve` だけにマッチし、`disapprove` は除外できます。`approve` だけだと部分一致で `disapprove` にもヒットします。",
  },
  "read-call": {
    id: "read-call",
    question: "Controller の `requestService.approve(...)` の approve にカーソルがある。呼ばれている側の中身を開く操作は？",
    choices: [
      "文字列検索で approve を全ファイルから探す",
      "定義へジャンプ（宣言または使用箇所に移動 / 宣言を開く）",
      "参照検索（使用箇所の検索 / ワークスペース内の参照）",
      "呼び出し階層（Call Hierarchy）を開く",
    ],
    answer: 1,
    explanation: "呼び出し先の中身は定義へジャンプです。参照検索は、今のメソッドを誰が呼んでいるかの一覧です。文字列検索だと同名が混ざります。呼び出し階層は呼び出し元・呼び出し先の両方をツリーで見せますが、1 段だけ開くには使い過ぎです。",
  },
  "read-history": {
    id: "read-history",
    question: "ある if 文がなぜ書かれたか知りたい。blame で、最後にその行を変更した人が分かった。次にすべきことは？",
    choices: [
      "その変更者に直接聞く以外に方法はない",
      "コミットメッセージを読み、リファクタだけの変更ならさらに履歴を遡る",
      "diff は見ずに、blame の行だけで判断する",
      "変更者の名前が分かれば、それ以上は調べない",
    ],
    answer: 1,
    explanation: "blame が示すのは「誰が・いつ」までです。「なぜ」はコミットメッセージやチケット番号にあることが多く、整形やリファクタだけの変更なら git log -p などでさらに遡りましょう。",
  },
  "read-debug": {
    id: "read-debug",
    question: "JSON から画面を組むアプリで、画面に「承認済み」と出る。Network タブの JSON は `status: PENDING`。次は？",
    choices: [
      "RequestService に IDE のブレークポイントを置く",
      "ブラウザの開発者ツールで、JSON を画面に出している JS を見る",
      "Network タブでレスポンスの JSON をもう一度確認する",
      "Controller の戻り値をログに出して確認する",
    ],
    answer: 1,
    explanation: "サーバは PENDING を返しています。画面の文言はフロント側です。Java のデバッガを止めても、正しい応答を返す処理に届くだけです。",
  },
  "read-js": {
    id: "read-js",
    question: "新規申請で「提出」を押すと確認ダイアログが出る。どの JavaScript が動いているかを知りたい。先にやることは？",
    choices: [
      "`static/js` のファイルを上から順にすべて読む",
      "押したボタンとそれを囲む form を Elements タブで見て、`class` の名前で `static/js` を検索する",
      "サーバのアプリログで、その時刻の行を探す",
      "Controller にブレークポイントを置いてデバッグ実行する",
    ],
    answer: 1,
    explanation:
      "確認ダイアログはブラウザ側の動きで、サーバにはまだ関係ありません。申請くんの新規申請では、form に付いた `js-submit-confirm` で検索すると `form.js` に着きます。手がかりになる名前が無いときは、Sources タブでブレークポイントを置いて確かめましょう。",
  },
  "ts-npe": {
    id: "ts-npe",
    question: "`NullPointerException` のスタックトレースで、最初に見るべき行は？",
    choices: [
      "一番下の java.lang.Thread",
      "自分たちが書いたコードのパッケージ名のうち、上から最初の at 行",
      "Caused by があるときは、いちばん上に出ている例外",
      "ログの日時だけ",
    ],
    answer: 1,
    explanation: "`org.springframework` や `java.` の行は飛ばして、自分たちが書いたコードのパッケージ名のうち、上から最初の行のソースを見ます。`Caused by` があるときは、いちばん下（原因）を優先します。",
  },
  "ts-own-class": {
    id: "ts-own-class",
    question: "次のうち、スタックトレースで原因調査の起点にしやすいのはどれ？",
    choices: [
      "org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod",
      "`jp.co.example.shinsei.service.RequestService.approve(RequestService.java:48)`",
      "java.base/java.lang.Thread.run",
      "jdk.proxy2.$Proxy128.approve(Unknown Source)",
    ],
    answer: 1,
    explanation: "`org.springframework` や `java.` は自分たちが書いたコードではありません。`jp.co.example` で始まる `RequestService` の行を見ます。",
  },
  "ts-symptom-start": {
    id: "ts-symptom-start",
    question: "承認ボタンを押したらログイン画面に戻った。最初に確認するのはどれ？",
    choices: [
      "RequestService の承認判定の中身",
      "Network タブのステータスコードと `Location`、Cookie",
      "`t_request` の件数",
      "ping が通るか",
    ],
    answer: 1,
    explanation: "Controller の業務ロジックより先に、フィルタやセッションを疑います。ステータスコードと `Location`、Cookie を確認しましょう。",
  },
  "ts-linux": {
    id: "ts-linux",
    question: "サーバ上のログファイルを開こうとすると Permission denied になった。まず確認することは？",
    choices: [
      "アプリのロジックにバグがある",
      "`ls -l` で、そのファイルの権限と所有者を確認する",
      "ファイルを削除して作り直す",
      "`chmod 777` で全員に権限を与える",
    ],
    answer: 1,
    explanation: "Permission denied は権限やユーザが原因であることが多く、コードの不具合ではありません。まず `ls -l` で権限と所有者を確認しましょう。777 のような広い権限をいきなり付けるのは避けます。",
  },
  "ts-linux-user": {
    id: "ts-linux-user",
    question:
      "アプリのログファイルへの書き込みで Permission denied になった。SSH でログインした自分のユーザには、そのファイルへの書き込み権限がある。次に確認するのは？",
    choices: [
      "アプリを動かしているプロセスのユーザに、書き込み権限があるか",
      "自分のログインパスワードが正しいか",
      "ディスクの空き容量",
      "ネットワークが疎通しているか",
    ],
    answer: 0,
    explanation:
      "Permission denied は、操作している自分ではなく、アプリを動かしているプロセスのユーザの権限で起きます。`ps -ef -o user,pid,cmd` でそのユーザを確認し、`sudo -u` で同じユーザとして試すと再現できます。",
  },
  "ts-log": {
    id: "ts-log",
    question: "画面がエラーになった。ログ調査で最初にやることは？",
    choices: [
      "とりあえず `log.info` をたくさん足して再起動する",
      "既存ログの出力先を確認し、操作した時刻の ERROR や WARN を見る",
      "ログレベルを DEBUG に上げてから、もう一度再現するのを待つ",
      "ERROR が無ければ、WARN は読まなくてよい",
    ],
    answer: 1,
    explanation: "先に出力先を確認し、操作した時刻の ERROR や WARN を読みます。調査用のログを足すのは、既存ログで足りないときです。",
  },
  "ts-http-log": {
    id: "ts-http-log",
    question: "HTML は 200 で一覧の INFO はアプリログにある。CSS だけ 404。次に見るログは？",
    choices: [
      "Mapper の SQL ログだけ",
      "HTTP サーバの `access.log` / `error.log`。静的ファイルは手前で返していることが多い",
      "DB のスロークエリログだけ",
      "アプリの INFO ログをもう一度読み直す",
    ],
    answer: 1,
    explanation: "動的処理は Java まで届いています。CSS の 404 は手前の HTTP サーバで止まっていることが多く、アプリログには出ません。",
  },
  "ts-log-pick": {
    id: "ts-log-pick",
    question: "本番の同じ秒に INFO が大量。`userId=7` の一覧処理を追う。次は？",
    choices: [
      "ERROR だけを日付を問わず全部読む",
      "`userId=7` で絞り、その行のスレッド名と前後の時刻で同じリクエストを揃える",
      "スレッド名 `exec-3` だけで、日付を問わず全部見る",
      "同じ時刻の行を、全リクエスト分ひとつずつ目視で確認する",
    ],
    answer: 1,
    explanation: "同時刻には他人のリクエストも混ざります。userId や申請 ID で当たりをつけ、スレッド名と時刻の幅で一本にします。スレッド名は使い回されます。",
  },
  "ts-log-sql": {
    id: "ts-log-sql",
    question: "MyBatis の DEBUG に Preparing と Parameters、Total: 0 と出た。読み方は？",
    choices: [
      "SQL は実行されていない",
      "その SQL は実行され、条件に合うレコードが 0 件だった",
      "Parameters の値がバインドされていないので、もう一度実行する必要がある",
      "MyBatis の設定ファイルが壊れている",
    ],
    answer: 1,
    explanation: "Preparing が文、Parameters がバインド値、Total が件数です。0 は実行失敗ではなく、その条件のレコードが無かった、と読みます。",
  },
  "ts-env": {
    id: "ts-env",
    question: "ローカルでは動き、検証用環境では落ちる。仮説として弱いのは？",
    choices: [
      "`application.yml`（または .properties）の接続先が違う",
      "検証用環境だけデータ件数が桁違い",
      "エディタのフォントが違う",
      "検証用環境の権限やファイアウォールが違う",
    ],
    answer: 2,
    explanation: "環境差は設定・データ・権限・ネットワークが定番です。",
  },
  "ts-slow-explain": {
    id: "ts-slow-explain",
    question: "遅い SQL を検証用 DB で `EXPLAIN` すると、`type` が `ALL`、`possible_keys` が `NULL`、`rows` が数十万だった。ここから言えるのは？",
    choices: [
      "`possible_keys` が `NULL` なので、このテーブルにはインデックスが一つも無い",
      "条件に合うカラムに使えるインデックスの候補が無く、テーブルをほぼ全件読んでいる",
      "その SQL の文法が間違っている",
      "`rows` は、実際に読んだ件数の実測値である",
    ],
    answer: 1,
    explanation: "`type` が `ALL` は先頭から全部読むフルスキャン、`possible_keys` が `NULL` はこの SQL の条件で使える候補が無いという意味です。`rows` は読む見積もり件数で、ここが大きいほどフルスキャンの負荷も大きくなります。",
  },
  "ts-memory": {
    id: "ts-memory",
    question: "エラーログに `java.lang.OutOfMemoryError: Java heap space` が出ている。まず疑うのは？",
    choices: [
      "`Metaspace` 不足なので、クラスローダーの構成を疑う",
      "大量のレコードを一度にメモリへ載せている、または参照を持ち続けて解放されていない",
      "`-Xmx` を上げれば、原因を調べなくても解決する",
      "GC ログを出力していないことが直接の原因",
    ],
    answer: 1,
    explanation: "`Java heap space` はヒープ不足を示すメッセージです（`Metaspace` 不足は別のメッセージで出ます）。一度に大量のデータを読み込んでいないか、不要になったオブジェクトの参照を持ち続けていないか（メモリリーク）を疑います。`-Xmx` を上げるだけでは、リークが原因なら根本的な解決になりません。",
  },
  "ts-hang": {
    id: "ts-hang",
    question: "特定の操作だけ、いつまでも応答が返らない。ログの続きも出ない。次にすることは？",
    choices: [
      "遅い SQL を疑い、検証用 DB で `EXPLAIN` する",
      "止まっている最中にスレッドダンプを取り、各スレッドの状態と待っているロックを確認する",
      "サーバを再起動して、ログをきれいな状態に戻す",
      "コネクションプールの最大接続数を増やして様子を見る",
    ],
    answer: 1,
    explanation: "ログが進みながら時間がかかる「遅い」とは違い、ログの続きが出ないのは止まっている状態です。`EXPLAIN` は SQL が進んでいるときの手がかりで、ここでは使えません。止まっている最中にスレッドダンプを取り、`BLOCKED` のスレッドがどのロックを待っているかを確認します。再起動すると状態が消えてしまうので、先にスレッドダンプを取りましょう。",
  },
  "ts-external": {
    id: "ts-external",
    question: "承認は成功したが通知メールだけ来ない。Mapper の更新ログはある。次に疑うのは？",
    choices: [
      "Mapper の SQL 自体が間違っている",
      "DB 更新のあとに動く MailService や外部通知 API の呼び出し",
      "承認フォームの CSRF トークンの有効期限切れ",
      "非同期のキューに溜まっているだけで、そのうち届く",
    ],
    answer: 1,
    explanation: "DB まで届いているなら、その後の外部 I/O を見ます。ログの時刻差や、MailService 付近の ERROR が手がかりです。",
  },
  "ts-net-check": {
    id: "ts-net-check",
    question: "検証用環境のホストへ ping は通るが、Test-NetConnection の 8080 は失敗。まず疑うのは？",
    choices: [
      "DNS の名前解決に失敗している",
      "8080 が FW で閉じている、または HTTP サーバやアプリがそのポートで待ち受けていない",
      "TLS 証明書の期限切れ",
      "ロードバランサの振り分け設定",
    ],
    answer: 1,
    explanation: "ping はホスト到達、TCP はポート到達です。層が違います。ping が通っているので DNS の名前解決はできています。TCP が失敗する時点では、その上の TLS や HTTP、ロードバランサの振り分けもまだ関係ありません。FW と、HTTP サーバやアプリの待ち受けを見ます。",
  },
  "ts-middleware": {
    id: "ts-middleware",
    question: "DB クライアントで直接つなぐと成功するのに、アプリからは処理が待たされる。まず疑うのは？",
    choices: [
      "DB サーバの CPU 使用率",
      "アプリのコネクションプールの枯渇",
      "ネットワークの MTU 設定",
      "DB のディスク I/O 待ち",
    ],
    answer: 1,
    explanation: "DB に直接つながるなら DB 自体は動いています。アプリから待たされるときは、アプリ側のコネクションプールが枯渇していないかを疑いましょう。",
  },
  "java-arch": {
    id: "java-arch",
    question: "Apache と Tomcat の違いは？",
    choices: [
      "どちらも同じ HTTP サーバの別名",
      "Apache は HTTP サーバ、Tomcat はサーブレットコンテナ",
      "どちらもデータベース",
      "Apache は静的ファイルの配信専用で、動的処理は一切できない",
    ],
    answer: 1,
    explanation: "Apache（httpd）と nginx が HTTP サーバ、Tomcat と Jetty がサーブレットコンテナです。名前に Apache が付いても、Apache（httpd）とは別物です。",
  },
  "sc-front": {
    id: "sc-front",
    question: "承認ボタンを押しても何も起きない。Network タブに新しいリクエストが無い。次は？",
    choices: [
      "RequestService の SQL を読む",
      "サーバに届いていないので、フォームか JS、コンソールのエラーを見る",
      "サーバのアプリログで、その時刻の ERROR が無いか確認する",
      "ブラウザを再起動してもう一度試す",
    ],
    answer: 1,
    explanation: "リクエストが無ければサーバはまだ関係ありません。このシナリオでは `list.js` が、HTML に無い `id` の `value` を読んで止まっていました。",
  },
  "sc-back": {
    id: "sc-back",
    question: "承認の POST が 500。最初に見るのは？",
    choices: [
      "ブラウザの Console タブのエラー",
      "操作時刻のサーバ側のエラーログ",
      "Network タブのレスポンス本文の JSON を整形して読む",
      "リクエストヘッダの Cookie の値",
    ],
    answer: 1,
    explanation: "5xx なら、見た目より先にサーバ側のエラーログを確認します。",
  },
  "sc-message": {
    id: "sc-message",
    question: "画面に「この申請は承認できません」と出る。操作時刻に ERROR もスタックも無い。次は？",
    choices: [
      "スタックが出るまで待つ",
      "その文言でソースを検索し、表示している if やメッセージ定義を見る",
      "Network タブのステータスコードだけで原因を断定する",
      "RequestService の全メソッドにログを足して再現を待つ",
    ],
    answer: 1,
    explanation: "例外がログに無いなら at 行は使えません。画面の固有の文言が、ソース検索の手がかりです。ソースに無ければ DB や外部 API を疑います。",
  },
  "sc-duplicate-mail": {
    id: "sc-duplicate-mail",
    question:
      "承認すると、申請者に同じ内容のメールが2通届いた。画面にエラーは無く、DB のレコードは1件だけ APPROVED になっている。アプリのログを見ると、同じ requestId への approve 処理が、別スレッドでほぼ同時刻に2回実行されていた。疑うのは？",
    choices: [
      "@Transactional の設定漏れで、SQL がロールバックされていないこと",
      "承認ボタンの二重送信と、update の SQL に status の条件が無いこと",
      "MailService の設定ミスで、送信先アドレスが重複していること",
      "DB のレプリケーション遅延で、古いレコードを読んでいること",
    ],
    answer: 1,
    explanation:
      "@Transactional は1つのリクエスト内の SQL をまとめる仕組みで、複数リクエストの同時実行は防ぎません。二重送信を防ぐ仕組みが無いボタンと、status = 'PENDING' を条件にしていない UPDATE が重なると、ほぼ同時に来た2つのリクエストが両方とも承認処理を通してしまいます。",
  },
  "sc-mail-silent": {
    id: "sc-mail-silent",
    question:
      "承認は成功し、画面にもエラーが出ない。しかし申請者に通知メールが届かない。アプリログには、DB 更新の直後に `WARN ... MailService : 通知メールの送信に失敗しました` とだけあり、例外のクラス名やスタックトレースは無い。次にすることは？",
    choices: [
      "WARN ログで説明がついているので、これ以上は追わない",
      "その WARN を出しているログ出力が、例外を握りつぶしていないかソースを確認する",
      "DB のレコードを直接見て、承認日時が正しいか確認する",
      "メールサーバーを再起動する",
    ],
    answer: 1,
    explanation:
      "WARN の1行だけでは、想定内の失敗なのかバグによる例外なのか区別できません。`catch (Exception e)` がログに `e` を渡していないと、種類やスタックトレースが残りません。ソースの catch ブロックを確認し、必要なら一時的に `e` をログへ渡して再現させましょう。",
  },
  "sc-db": {
    id: "sc-db",
    question: "検証用環境だけ一覧が 0 件。GET は 200。コードは同じと言われている。先に疑うのは？",
    choices: [
      "Controller の `@RequestParam` の型変換に失敗している",
      "アプリが接続している DB を、実行された SQL と同じ条件で見る",
      "検証用環境のログインセッションが壊れている",
      "Controller の権限チェックで弾かれて 0 件に見えている",
    ],
    answer: 1,
    explanation: "200 で件数が違うなら、原因の多くは DB のレコードや接続先です。コード通読より先に、実行された SQL と、その条件での件数を確認しましょう。キャッシュでずれることもあります。",
  },
  "sc-history": {
    id: "sc-history",
    question: "申請履歴で件名「申請」、ステータス承認済みを選んだ。Network のクエリには `title=申請` と `status=APPROVED` がある。MyBatis の SQL の WHERE に `title` の条件はあり、`status` が無い。同じ SQL を DB で実行すると画面と同じ 2 件になる。次は？",
    choices: [
      "検証用環境の DB を作り直す",
      "WHERE に使う変数が、どこでセットされているかを追う",
      "MyBatis のキャッシュをクリアする",
      "同じ SQL をもう一度 DB で実行して結果を確かめる",
    ],
    answer: 1,
    explanation: "その SQL の結果としては正しいので、DB を作り直しても原因は残りません。条件に載っていない変数を、Mapper から Controller、フォームの `name` まで辿って確認します。このシナリオでは `requestStatus` と `status` が違っていました。",
  },
  "sc-history-back": {
    id: "sc-history-back",
    question: "申請履歴で検索してから詳細を開き、「← 申請履歴」で戻ると、絞り込みが消えて全件が表示される。エラーは出ない。詳細を開くリクエストと、戻ったあとのリクエストは両方 200。戻ったあとの `GET /requests/history` にクエリパラメータが無い。原因は？",
    choices: [
      "`th:href` の書き方が間違っていて、リンクが機能していない",
      "検索条件をセッションに保存するキーと、取り出すキーの文字列が違い、`getAttribute` が常に `null` を返している",
      "セッションタイムアウトで、ログイン状態が切れている",
      "MyBatis のキャッシュが古い検索結果を返している",
    ],
    answer: 1,
    explanation: "`HttpSession` の `setAttribute` / `getAttribute` は、キーの文字列が完全に一致していないと結び付きません。今回は保存側が `historySearchCondition`、取り出す側が `historyCondition` で、1文字も一致していないため、条件は常に見つからず `null` になります。コンパイルも実行も止まらないので、気づくには両方のキーを見比べる必要があります。",
  },
  "sc-history-approved-at": {
    id: "sc-history-approved-at",
    question:
      "申請履歴の「承認日時」列が、承認済みのレコードでも常に「-」になる。DB には `updated_at` の値があり、MyBatis のログにも SELECT に `r.updated_at` が含まれている。原因は？",
    choices: [
      "SQL の WHERE 条件が間違っている",
      "カラム名 `updated_at` は自動変換で `updatedAt` になるが、Java 側のフィールド名は `approvedAt` で一致しない",
      "Thymeleaf の `th:text` の書き方が間違っている",
      "トランザクションがロールバックされている",
    ],
    answer: 1,
    explanation:
      "SQL も DB の値も正しいので、疑うのは `resultType` の自動変換です。`map-underscore-to-camel-case` により `updated_at` は `updatedAt` に変換されますが、`RequestEntity` のフィールド名は `approvedAt` です。名前が一致しないカラムは、MyBatis が黙って無視します。",
  },
  "sc-history-slow": {
    id: "sc-history-slow",
    question: "申請履歴の検索が遅い。`GET /shinsei/requests/history` は 200。ログでは `searchHistory` の `Preparing` と `Total` のあいだが数秒。`EXPLAIN` で `t_request` の `type` は `ALL`。原因は？",
    choices: [
      "一覧の `list.js` が例外を出している",
      "履歴検索の SQL がフルスキャンになっている。この SQL で使えるインデックス候補が無い",
      "フォームの `name` と `@RequestParam` がずれている",
      "検証用環境のコネクションプールが枯渇している",
    ],
    answer: 1,
    explanation: "`type` が `ALL` なら、そのテーブルを先頭から全部読むことが多いです。`possible_keys` が `NULL` なのは、この SQL で使える候補が無い、という意味です。`PRIMARY KEY` があっても、この `WHERE` の候補になるとは限りません。",
  },
  "sc-net": {
    id: "sc-net",
    question: "検証用環境だけ読み込みが終わらない。アプリログにその時刻のアクセスが無い。読むのは？",
    choices: [
      "Thymeleaf の `th:if`",
      "リクエストがアプリに届いていない。宛先、ポート、ファイアウォール、プロキシ",
      "Mapper の ORDER BY",
      "DB へ接続できるかどうか",
    ],
    answer: 1,
    explanation: "ログが無いこと自体が情報です。Controller の中を読む段階ではありません。",
  },
  "sc-db-network": {
    id: "sc-db-network",
    question:
      "検証用環境だけ、申請一覧を開くとしばらくして 500 になる。ログには DB への `CommunicationsException` が出ている。`application-stg.yml` の接続先は正しそうに見える。次にすることは？",
    choices: [
      "SQL の文法を疑う",
      "設定ファイルに書かれた接続先へ、アプリのサーバから疎通確認をする",
      "とりあえず `chmod 777` する",
      "アプリを再起動してログをクリアにする",
    ],
    answer: 1,
    explanation:
      "`CommunicationsException` は SQL ではなく通信の失敗です。設定が正しくても、その先への経路が届くとは限りません。アプリのサーバから接続先への疎通を確認しましょう。再起動するとログが消えるので、先に疎通確認をしましょう。",
  },
  "sc-process-user": {
    id: "sc-process-user",
    question:
      "デプロイ後、検証用環境でブラウザが 502 になった。`ps -ef` で見ると、申請くんのプロセスが起動していない。`sudo -u appuser` で手動起動すると `Permission denied` が出た。次に見るのは？",
    choices: [
      "Thymeleaf の `th:if`",
      "書き込み先ディレクトリの `ls -l` で、所有者・グループがアプリの実行ユーザに合っているか",
      "MySQL の `EXPLAIN`",
      "ブラウザのコンソールの `TypeError`",
    ],
    answer: 1,
    explanation:
      "起動時の書き込み失敗なら、対象ファイルやディレクトリの所有者・グループを `ls -l` で確認します。SSH でログインしたユーザに権限があっても、アプリの実行ユーザに権限が無ければ書き込めません。",
  },
  "sc-http": {
    id: "sc-http",
    question: "一覧の HTML は 200。表のスタイルだけ当たっていない。次は？",
    choices: [
      "RequestService の null チェック",
      "Network タブで CSS / JS のステータスコードを確認する。404 ならパスか手前の HTTP サーバを疑う",
      "DB の文字コードだけを疑う",
      "テンプレートの `th:if` 条件を見直す",
    ],
    answer: 1,
    explanation: "HTML と CSS は別リクエストです。ドキュメントが 200 でも、静的ファイルだけ 404 のことがあります。",
  },
  "sc-impact-status": {
    id: "sc-impact-status",
    question: "申請一覧の SQL は `status = 'PENDING'` です。`CANCELLED` を追加するとき、この SQL の修正は？",
    choices: [
      "取り下げ済みも一覧に出るよう、WHERE を直す",
      "申請一覧は未承認の作業画面なので、修正は不要",
      "履歴の選択肢が無いので、一覧の SQL も必ず直す",
      "承認者向けの通知メールの文言も、念のため合わせて直す",
    ],
    answer: 1,
    explanation: "申請一覧は未承認の作業画面です。取り下げ済みは、この画面で扱う申請ではないので、今の `status = 'PENDING'` のままで妥当です。ヒットしたから直す、ではありません。履歴の選択肢など、依頼内容から断定できない箇所は、依頼者へ確認するため情報をまとめます。",
  },
  "trace-sql-source": {
    id: "trace-sql-source",
    question: "スロークエリに SELECT ... FROM `t_request` WHERE `applicant_id` = 7 と出た。JPA のプロジェクトで、この文を全文検索してもヒットしない。次は？",
    choices: [
      "Mapper XML が必ずあるので、XML だけを探す",
      "テーブル名や Entity、Repository から呼び出し元を辿る",
      "SQL がソースに無いなら、調査はできない",
      "JPA は SQL をログに出力できないので、確認しようがない",
    ],
    answer: 1,
    explanation: "JPA では、実行される SQL をライブラリが組み立てることが多く、ソースに無いことがあります。テーブル名や Entity から Repository を見つけ、参照検索で呼び出し元を辿ります。MyBatis なら XML や `@Select` に近い文があることが多いです。",
  },
  "sc-impact-search": {
    id: "sc-impact-search",
    question: "一覧と履歴に部署の絞り込みを追加する。`RequestController.list` から `findMine` へ降りた。同じ `findMine` を呼んでいる別経路は？",
    choices: [
      "`RequestApiController.list`（JSON 一覧）",
      "`RequestController.history`（`searchHistory`）",
      "`RequestController.detail`（申請詳細）",
      "`RequestService.approve`（承認処理）",
    ],
    answer: 0,
    explanation: "申請履歴は今回の対象ですが、`searchHistory` で別の SQL です。`detail` や `approve` も、`findMine` とは別の SQL や別の入口です。同じ `findMine` を呼んでいるのは JSON 一覧です。",
  },
} satisfies Record<string, Quiz>;

export type QuizId = keyof typeof quizzes;

export function getQuiz(id: string): Quiz | undefined {
  if (id in quizzes) return quizzes[id as QuizId];
  return undefined;
}
