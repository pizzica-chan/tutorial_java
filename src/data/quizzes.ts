import type { Quiz } from "../types";

export const quizzes: Record<string, Quiz> = {
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
  "ori-ask": {
    id: "ori-ask",
    question: "不具合を記録するとき、最低限そろえる情報はどれ？",
    choices: [
      "「動きません」だけ",
      "再現手順、期待結果、実際の結果、見たログ",
      "感想と、直してほしい箇所の推測だけ",
      "関係ないファイルの全文",
    ],
    answer: 1,
    explanation:
      "再現手順とログがあると、同じ現象を共有できます。仮説はその次です。",
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
      "件数の実体は DB の行です。バックエンドはその行を SQL で読み、フロントは返ってきた結果を出します。見た目の CSS とは切り分けが違います。",
  },
  "web-status": {
    id: "web-status",
    question: "ログイン後の操作で「権限がありません」と出た。ステータスについて妥当なのは？",
    choices: [
      "必ず 403 になる",
      "403 は「権限が無い」と読む番号だが、実際の番号や画面はアプリによる。Network で確認する",
      "必ず 401 になる",
      "必ず 500 なので、スタックトレースだけ見る",
    ],
    answer: 1,
    explanation:
      "403 は権限不足と読む番号です。画面に「権限がありません」と出ても、200 のエラー画面や別の番号のことがあります。番号の意味と、そのアプリが何を返すかは別です。",
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
    question: "画面の JS が JSON を期待しているのに「パースできない」と出る。Network では /api/requests が 200 で、Content-Type は text/html。疑うのは？",
    choices: [
      "JSON のキー名の綴りだけ",
      "ログイン画面など HTML が返っている",
      "CSS のバージョン",
      "Java のインデント",
    ],
    answer: 1,
    explanation:
      "API なのに HTML なら、認証リダイレクトや間違った URL で画面用の応答が来ていることが多いです。ステータスだけでなく Content-Type を見ます。",
  },
  "java-layer": {
    id: "java-layer",
    question: "画面の URL に対応する処理を最初に探すなら、どの層？",
    choices: ["Repository / Mapper", "Controller", "entity の getter", "pom.xml"],
    answer: 1,
    explanation:
      "URL と HTTP メソッドの受付口は Controller です。JSON を返す RestController も同じ層です。そこから Service、Repository へ降ります。",
  },
  "trace-start": {
    id: "trace-start",
    question: "申請一覧が遅い。最初に確認する場所として妥当なのは？",
    choices: [
      "pom.xml の作者名",
      "一覧画面の URL と、対応する Controller メソッド",
      "CSS の余白だけを疑う",
      "本番 DB を直接 UPDATE して試す",
    ],
    answer: 1,
    explanation:
      "入口メソッドを特定してから、その中の DB アクセスや外部呼び出しを見ます。",
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
  "ts-npe": {
    id: "ts-npe",
    question: "NullPointerException のスタックトレースで、最初に見るべき行は？",
    choices: [
      "一番下の java.lang.Thread",
      "会社名で始まるパッケージのうち、上から最初の at 行",
      "C ドライブのパス",
      "ログの日時だけ",
    ],
    answer: 1,
    explanation:
      "org.springframework や java. の行は飛ばして、会社名で始まるパッケージのうち、上から最初の行のソースを見ます。",
  },
  "ts-own-class": {
    id: "ts-own-class",
    question: "次のうち、スタックトレースで原因調査の入口にしやすいのはどれ？",
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
      "アプリはもともとログを出すのが一般的です。行き先を確認し、時刻を合わせて読みます。足すのは足りないときです。",
  },
  "ts-env": {
    id: "ts-env",
    question: "ローカルでは動き、検証環境では落ちる。仮説として弱いのは？",
    choices: [
      "application.yml（または .properties）の接続先が違う",
      "検証だけデータ件数が桁違い",
      "エディタのフォントが違う",
      "検証の権限やファイアウォールが違う",
    ],
    answer: 2,
    explanation:
      "環境差は設定・データ・権限・ネットワークが定番です。",
  },
  "java-arch": {
    id: "java-arch",
    question: "Apache と Tomcat の違いは？",
    choices: [
      "どちらも同じ HTTPサーバの別名",
      "Apache は HTTPサーバ、Tomcat はサーブレットコンテナ",
      "どちらもデータベース",
      "Tomcat はブラウザ、Apache は CSS",
    ],
    answer: 1,
    explanation:
      "Apache（httpd）と nginx が HTTPサーバ、Tomcat と Jetty がサーブレットコンテナです。名前に Apache が付いても、Tomcat とは別物です。",
  },
};

export function getQuiz(id: string): Quiz | undefined {
  return quizzes[id];
}
