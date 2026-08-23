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
    explanation:
      "画面や API の URL → Controller が最短です。全体通読より、今動いている一本の線を追います。",
  },
  "web-roundtrip": {
    id: "web-roundtrip",
    question: "画面の不具合に気づいたとき、Java のコードより先に確認するのは？",
    choices: [
      "Network タブの該当リクエスト（ステータスコードと応答本文）",
      "pom.xml の version",
      "CSS の色指定",
      "クラス名のアルファベットの大小",
    ],
    answer: 0,
    explanation:
      "画面はレスポンスの HTML を表示したものです。まず該当リクエストのステータスコードと本文を見ましょう。Java はそのあとです。",
  },
  "web-front-back": {
    id: "web-front-back",
    question: "申請一覧の件数がおかしい。先に見るのはどれ？",
    choices: [
      "一覧テンプレートの色や余白",
      "検索条件や SQL、DB の行",
      "ブラウザのキャッシュを消すだけ",
      "pom.xml の Java の版",
    ],
    answer: 1,
    explanation:
      "一覧の件数は、SQL が読んだ DB の行です。先に実行された SQL を見て、同じ条件で行を数えます。見た目の CSS とは切り分けが違います。",
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
    explanation:
      "403 は権限不足と読むステータスコードです。画面に「権限がありません」と出ても、200 のエラー画面や別のステータスコードのことがあります。ステータスコードの意味と、そのアプリが何を返すかは別です。",
  },
  "web-params": {
    id: "web-params",
    question: "GET /shinsei/requests?status=PENDING で一覧を絞り込んでいる。status=PENDING はどこに載っている？",
    choices: [
      "クエリパラメータ（URL の ? 以降）",
      "パス /requests の一部",
      "レスポンスの HTML 本文",
      "CSS ファイル",
    ],
    answer: 0,
    explanation:
      "? 以降がクエリです。Network タブでは Query String Parameters に出ることが多いです。Controller では @RequestParam で受け取ることが多いです。",
  },
  "web-cookie": {
    id: "web-cookie",
    question: "セッション ID は通常どこに載って、次のリクエストに引き継がれる？",
    choices: [
      "HTML のタイトル",
      "Cookie（またはそれに相当するヘッダ）",
      "Java のクラス名",
      "CSS の class 属性",
    ],
    answer: 1,
    explanation:
      "ブラウザは Cookie を付けてサーバに返します。サーバはその ID でリクエストを同一セッションとみなします。",
  },
  "web-api": {
    id: "web-api",
    question: "画面の JS が JSON を期待しているのに「パースできない」と出る。Network タブでは /api/requests が 200 で、Content-Type は text/html。疑うのは？",
    choices: [
      "JSON のキー名の綴りだけ",
      "ログイン画面など HTML が返っている",
      "CSS のバージョン",
      "Java のインデント",
    ],
    answer: 1,
    explanation:
      "API なのに HTML なら、認証失敗や間違った URL で画面用の応答が来ていることが多いです。302 経由でログイン HTML になることも、200 のまま HTML が返ることもあります。ステータスコードだけでなく Content-Type を確認しましょう。",
  },
  "java-layer": {
    id: "java-layer",
    question: "画面の URL に対応する処理を最初に探すなら、どの層？",
    choices: ["Repository / Mapper", "Controller", "entity の getter", "pom.xml"],
    answer: 1,
    explanation:
      "URL と HTTP メソッドの受付口は Controller です。JSON を返す RestController も同じ層です。そこから Service、Repository へ降ります。",
  },
  "java-template": {
    id: "java-template",
    question: "承認ボタンが一覧に出ない。Controller は list を返し、Model に requests は入っている。次に見るのは？",
    choices: [
      "templates/request/list.html の th:if など表示条件",
      "pom.xml の groupId",
      "MySQL のポート番号だけ",
      "favicon.ico",
    ],
    answer: 0,
    explanation:
      "データは届いていても、テンプレートの th:if でボタンを出さない実装はあります。return から HTML を開き、表示条件と form の th:action を見ます。",
  },
  "java-crosscut": {
    id: "java-crosscut",
    question: "Controller の approve にブレークポイントを置いたが止まらない。ソース上はボタンからこの Java メソッドに来る。先に疑うのは？",
    choices: [
      "CSS の class 名",
      "Filter、Interceptor、Spring Security など、Controller に届く前の処理",
      "entity の toString",
      "README の作者名",
    ],
    answer: 1,
    explanation:
      "Filter と Interceptor と Security は、Controller のソースに呼び出しがありません。だから、ソースを追うだけでは見つかりません。ここで止まるとレスポンスは返っても、Controller は動いていません。",
  },
  "trace-start": {
    id: "trace-start",
    question: "申請一覧の処理の入口が RequestController.list だと分かった。この章で次に追うのは？",
    choices: [
      "pom.xml の作者名",
      "list から Service、SQL、返すテンプレートまでの一本の線",
      "CSS の余白の定義だけ",
      "リポジトリを先頭から通読する",
    ],
    answer: 1,
    explanation:
      "入口が分かったら、その Java メソッドから下へ降り、応答までを一本で追います。全体通読や見た目の定義は、この線の外です。",
  },
  "read-name": {
    id: "read-name",
    question: "画面に「承認待ち」と出る処理を探したい。有効な手がかりは？",
    choices: [
      "英語・日本語の文言、URL、テーブル名、カラム名",
      "PC のホスト名だけ",
      "IDE のテーマ名",
      "ビルドした曜日",
    ],
    answer: 0,
    explanation:
      "画面に出ている言葉、パス、DB 名のどれかがヒットします。言語は一致しないことがあるので複数試します。",
  },
  "read-regex": {
    id: "read-regex",
    question: "disapprove を除き、approve という単語だけにマッチさせたい。適切なパターンは？",
    choices: ["approve", "\\bapprove\\b", ".*approve.*", "approve$"],
    answer: 1,
    explanation:
      "\\b は単語の境目です。\\bapprove\\b なら approve だけにマッチし、disapprove は除外できます。approve だけだと部分一致で disapprove にも当たります。",
  },
  "read-call": {
    id: "read-call",
    question: "Controller の requestService.approve(...) の approve にカーソルがある。呼ばれている側の中身を開く操作は？",
    choices: [
      "文字列検索で approve を全ファイルから探す",
      "定義へジャンプ（宣言または使用箇所に移動 / 宣言を開く）",
      "参照検索（使用箇所の検索 / ワークスペース内の参照）",
      "Network タブでリクエストを見る",
    ],
    answer: 1,
    explanation:
      "呼び出し先の中身は定義へジャンプです。参照検索は、今のメソッドを誰が呼んでいるかの一覧です。文字列検索だと同名が混ざります。",
  },
  "read-debug": {
    id: "read-debug",
    question: "画面に「承認済み」と出る。Network タブの JSON は status: PENDING。次は？",
    choices: [
      "RequestService に IDE のブレークポイントを置く",
      "ブラウザの開発者ツールで、JSON を画面に出している JS を見る",
      "本番のテーブルを DROP する",
      "CSS の余白を疑う",
    ],
    answer: 1,
    explanation:
      "サーバは PENDING を返しています。画面の文言はフロント側です。Java のデバッガを止めても、正しい応答を返す処理に届くだけです。",
  },
  "ts-npe": {
    id: "ts-npe",
    question: "NullPointerException のスタックトレースで、最初に見るべき行は？",
    choices: [
      "一番下の java.lang.Thread",
      "自分たちが書いたコードのパッケージ名のうち、上から最初の at 行",
      "C ドライブのパス",
      "ログの日時だけ",
    ],
    answer: 1,
    explanation:
      "org.springframework や java. の行は飛ばして、自分たちが書いたコードのパッケージ名のうち、上から最初の行のソースを見ます。",
  },
  "ts-own-class": {
    id: "ts-own-class",
    question: "次のうち、スタックトレースで原因調査の起点にしやすいのはどれ？",
    choices: [
      "org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod",
      "jp.co.example.shinsei.service.RequestService.approve(RequestService.java:41)",
      "java.base/java.lang.Thread.run",
      "jdk.proxy2.$Proxy128.approve(Unknown Source)",
    ],
    answer: 1,
    explanation:
      "org.springframework や java. は自分たちが書いたコードではありません。jp.co.example で始まる RequestService の行を見ます。",
  },
  "ts-symptom-start": {
    id: "ts-symptom-start",
    question: "承認ボタンを押したらログイン画面に戻った。最初に確認するのはどれ？",
    choices: [
      "RequestService の承認判定の中身",
      "Network タブのステータスコードと Location、Cookie",
      "t_request の件数",
      "ping が通るか",
    ],
    answer: 1,
    explanation:
      "Controller の業務ロジックより先に、フィルタやセッションを疑います。ステータスコードと Location、Cookie を確認しましょう。",
  },
  "ts-log": {
    id: "ts-log",
    question: "画面がエラーになった。ログ調査で最初にやることは？",
    choices: [
      "とりあえず log.info をたくさん足して再起動する",
      "既存ログの出力先を確認し、操作した時刻の ERROR や WARN を見る",
      "本番のテーブルを直接 UPDATE する",
      "pom.xml を先頭から通読する",
    ],
    answer: 1,
    explanation:
      "先に出力先を確認し、操作した時刻の ERROR や WARN を読みます。調査用のログを足すのは、既存ログで足りないときです。",
  },
  "ts-http-log": {
    id: "ts-http-log",
    question: "HTML は 200 で一覧の INFO はアプリログにある。CSS だけ 404。次に見るログは？",
    choices: [
      "Mapper の SQL ログだけ",
      "HTTP サーバの access.log / error.log。静的ファイルは手前で返していることが多い",
      "DB のスロークエリログだけ",
      "Git のコミット履歴",
    ],
    answer: 1,
    explanation:
      "動的処理は Java まで届いています。CSS の 404 は手前の HTTP サーバで止まっていることが多く、アプリログには出ません。",
  },
  "ts-log-pick": {
    id: "ts-log-pick",
    question: "本番の同じ秒に INFO が大量。userId=7 の一覧処理を追う。次は？",
    choices: [
      "ERROR だけを日付無視で全部読む",
      "userId=7 で絞り、その行のスレッド名と前後の時刻で同じリクエストを揃える",
      "スレッド名 exec-3 だけで、日付を問わず全部見る",
      "CSS の余白を疑う",
    ],
    answer: 1,
    explanation:
      "同時刻には他人のリクエストも混ざります。userId や申請 ID で当たりをつけ、スレッド名と時刻の幅で一本にします。スレッド名は使い回されます。",
  },
  "ts-log-sql": {
    id: "ts-log-sql",
    question: "MyBatis の DEBUG に Preparing と Parameters、Total: 0 と出た。読み方は？",
    choices: [
      "SQL は実行されていない",
      "その SQL は実行され、条件に合う行が 0 件だった",
      "Controller が無い",
      "CSS が 404",
    ],
    answer: 1,
    explanation:
      "Preparing が文、Parameters がバインド値、Total が件数です。0 は実行失敗ではなく、その条件の行が無かった、と読みます。",
  },
  "ts-env": {
    id: "ts-env",
    question: "ローカルでは動き、検証用環境では落ちる。仮説として弱いのは？",
    choices: [
      "application.yml（または .properties）の接続先が違う",
      "検証用環境だけデータ件数が桁違い",
      "エディタのフォントが違う",
      "検証用環境の権限やファイアウォールが違う",
    ],
    answer: 2,
    explanation:
      "環境差は設定・データ・権限・ネットワークが定番です。",
  },
  "ts-external": {
    id: "ts-external",
    question: "承認は成功したが通知メールだけ来ない。Mapper の更新ログはある。次に疑うのは？",
    choices: [
      "テンプレートの CSS だけ",
      "DB 更新のあとに動く MailService や外部通知 API の呼び出し",
      "ブラウザの favicon",
      "pom.xml の groupId",
    ],
    answer: 1,
    explanation:
      "DB まで届いているなら、その後の外部 I/O を見ます。ログの時刻差や、MailService 付近の ERROR が手がかりです。",
  },
  "ts-net-check": {
    id: "ts-net-check",
    question: "検証用環境のホストへ ping は通るが、Test-NetConnection の 8080 は失敗。まず疑うのは？",
    choices: [
      "Mapper の XML のインデント",
      "8080 が FW で閉じている、または HTTP サーバやアプリがそのポートで待ち受けていない",
      "Thymeleaf の th:if",
      "ORDER BY の列名",
    ],
    answer: 1,
    explanation:
      "ping はホスト到達、TCP はポート到達です。層が違います。TCP が失敗すると HTTP も届きません。FW と、HTTP サーバやアプリの待ち受けを見ます。",
  },
  "java-arch": {
    id: "java-arch",
    question: "Apache と Tomcat の違いは？",
    choices: [
      "どちらも同じ HTTP サーバの別名",
      "Apache は HTTP サーバ、Tomcat はサーブレットコンテナ",
      "どちらもデータベース",
      "Tomcat はブラウザ、Apache は CSS",
    ],
    answer: 1,
    explanation:
      "Apache（httpd）と nginx が HTTP サーバ、Tomcat と Jetty がサーブレットコンテナです。名前に Apache が付いても、Tomcat とは別物です。",
  },
  "sc-front": {
    id: "sc-front",
    question: "承認ボタンを押しても何も起きない。Network タブに新しいリクエストが無い。次は？",
    choices: [
      "RequestService の SQL を読む",
      "サーバに届いていないので、フォームか JS、コンソールのエラーを見る",
      "検証用環境の DB の全テーブルを DROP する",
      "pom.xml の version を上げる",
    ],
    answer: 1,
    explanation:
      "リクエストが無ければサーバはまだ関係ありません。このシナリオでは list.js が、HTML に無い id の value を読んで止まっていました。",
  },
  "sc-back": {
    id: "sc-back",
    question: "承認の POST が 500。最初に見るのは？",
    choices: [
      "CSS の余白",
      "操作時刻のサーバ側のエラーログ",
      "favicon.ico",
      "ブラウザのテーマ",
    ],
    answer: 1,
    explanation:
      "5xx なら、見た目より先にサーバ側のエラーログを確認します。",
  },
  "sc-message": {
    id: "sc-message",
    question: "画面に「この申請は承認できません」と出る。操作時刻に ERROR もスタックも無い。次は？",
    choices: [
      "スタックが出るまで待つ",
      "その文言でソースを検索し、表示している if やメッセージ定義を見る",
      "CSS の色を疑う",
      "本番のテーブルを DROP する",
    ],
    answer: 1,
    explanation:
      "例外がログに無いなら at 行は使えません。画面の固有の文言が、ソース検索の手がかりです。ソースに無ければ DB や外部 API を疑います。",
  },
  "sc-db": {
    id: "sc-db",
    question: "検証用環境だけ一覧が 0 件。GET は 200。コードは同じと言われている。先に疑うのは？",
    choices: [
      "CSS の font-size",
      "今つないでいる DB を、実行された SQL と同じ条件で見る",
      "Java のインデント",
      "エディタの配色",
    ],
    answer: 1,
    explanation:
      "200 で件数が違うなら、原因は多くは DB の行や接続先です。コード通読より先に、実行された SQL と、その条件での件数を確認しましょう。キャッシュでずれることもあります。",
  },
  "sc-net": {
    id: "sc-net",
    question: "検証用環境だけ読み込み中のまま。アプリログにその時刻のアクセスが無い。読むのは？",
    choices: [
      "Thymeleaf の th:if",
      "リクエストがアプリに届いていない。宛先、ポート、ファイアウォール、プロキシ",
      "Mapper の ORDER BY",
      "ボタンのラベル文言",
    ],
    answer: 1,
    explanation:
      "ログが無いこと自体が情報です。Controller の中を読む段階ではありません。",
  },
  "sc-http": {
    id: "sc-http",
    question: "一覧の HTML は 200。表のスタイルだけ当たっていない。次は？",
    choices: [
      "RequestService の null チェック",
      "Network タブで CSS / JS のステータスコードを確認しましょう。404 ならパスか手前の HTTP サーバ",
      "DB の文字コードだけを疑う",
      "承認者マスタを全削除する",
    ],
    answer: 1,
    explanation:
      "HTML と CSS は別リクエストです。ドキュメントが 200 でも、静的ファイルだけ 404 のことがあります。",
  },
  "sc-impact-status": {
    id: "sc-impact-status",
    question: "ステータスに CANCELLED を足す影響調査。まず有効な手がかりは？",
    choices: [
      "操作時刻の ERROR ログだけ",
      "既存の status / PENDING / t_request で検索し、分岐・SQL・画面を分類する",
      "CSS の font-size",
      "favicon.ico の有無",
    ],
    answer: 1,
    explanation:
      "不具合ではなく波及先の洗い出しです。既存の値名から逆引きし、表示・分岐・永続化に分類します。",
  },
  "trace-sql-source": {
    id: "trace-sql-source",
    question:
      "スロークエリに SELECT ... FROM t_request WHERE applicant_id = ? と出た。JPA のプロジェクトで、この文を全文検索してもヒットしない。次は？",
    choices: [
      "Mapper XML が必ずあるので、XML だけを探す",
      "テーブル名や Entity、Repository から呼び出し元を辿る",
      "SQL がソースに無いなら、調査はできない",
      "pom.xml の作者名を疑う",
    ],
    answer: 1,
    explanation:
      "JPA では、実行される SQL をライブラリが組み立てることが多く、ソースに無いことがあります。テーブル名や Entity から Repository を見つけ、参照検索で呼び出し元を辿ります。MyBatis なら XML や @Select に近い文があることが多いです。",
  },
  "sc-impact-search": {
    id: "sc-impact-search",
    question: "一覧に部署の絞り込みを足す影響調査。処理の入口として先に決めるのは？",
    choices: [
      "Mapper XML を上から通読する",
      "一覧の URL（/shinsei/requests）から Controller を特定し、同じ一覧を使う export が無いかも見る",
      "本番 DB の全テーブルを DROP する",
      "ブラウザのテーマ",
    ],
    answer: 1,
    explanation:
      "影響調査も処理の入口は URL です。Controller → Service → Mapper に降り、一覧と同じ条件の別経路（CSV など）を見落としません。",
  },
} satisfies Record<string, Quiz>;

export type QuizId = keyof typeof quizzes;

export function getQuiz(id: string): Quiz | undefined {
  if (id in quizzes) return quizzes[id as QuizId];
  return undefined;
}
