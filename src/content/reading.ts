import type { Track } from "../types";

export const readingTrack: Track = {
  id: "reading",
  no: "03",
  title: "ソースの読み方",
  kicker: "READING",
  description: "検索、呼び出しの追跡、値の源流、仕様とコードの差。",
  accent: "#6ec8c0",
  lessons: [
    {
      id: "dont-read-all",
      title: "入口から読む",
      minutes: 6,
      summary: "全体を通読しない。調べたい処理の入口を探す。",
      blocks: [
        {
          type: "p",
          text: "リポジトリを上から読む必要はありません。調べたい画面や機能に対して、URL または画面上の文字列から入口を特定します。画面が遷移しない Web API は、アドレスバーではなく Network の XHR / fetch の URL を使います。",
        },
        {
          type: "figure",
          src: "/images/code-screen.jpg",
          alt: "ソースを開いたエディタ",
          caption: "入口のファイルを開いたら、その処理だけを追います。全体は読みません。",
        },
        { type: "diagram", name: "read-entry" },
        {
          type: "ol",
          items: [
            "対象の URL を確認する（画面ならアドレスバー、API なら Network）",
            "同じパス文字列をソース検索する",
            "ヒットした Controller から Service、SQL へ降りる",
            "テンプレートのボタン、または JS の fetch 先と突き合わせる",
          ],
        },
        {
          type: "ul",
          items: [
            "テストコードがあれば、呼び出し方の例として読む",
            "生成コード、ライブラリ本体、圧縮された JS は後回し",
            "同じ処理が二つあるなら、今の URL に繋がっている方を見る",
          ],
        },
        { type: "quiz", id: "ori-goal" },
      ],
    },
    {
      id: "search",
      title: "名前で探す",
      minutes: 8,
      summary: "画面の文字、パス、テーブル、メッセージ。",
      blocks: [
        {
          type: "p",
          text: "画面に出ている日本語は、プロパティファイルや DB マスタにあることがあります。英語のメソッド名とは限らないので、複数の検索語を使います。",
        },
        {
          type: "table",
          headers: ["手がかり", "検索の例"],
          rows: [
            ["画面の見出し", "承認待ち"],
            ["ボタン", "承認 / approve"],
            ["URL", "requests"],
            ["エラー文", "権限がありません"],
            ["テーブル", "t_request / REQUEST"],
            ["ログ", "RequestService"],
          ],
        },
        {
          type: "p",
          text: "IDE の文字列検索と、型・メソッドの参照検索は別です。文言は全文検索、メソッドの行方は Find Usages です。",
        },
        { type: "quiz", id: "read-name" },
      ],
    },
    {
      id: "call-chain",
      title: "呼び出し元と呼び出し先",
      minutes: 8,
      summary: "誰に呼ばれ、誰を呼ぶか。",
      blocks: [
        {
          type: "p",
          text: "メソッドを開いたら、中身の前に境界を見ます。",
        },
        { type: "diagram", name: "call-chain", caption: "中身より先に、誰から来て誰へ行くか。" },
        {
          type: "ul",
          items: [
            "引数は誰が渡しているか（Controller、別 Service、バッチ）",
            "戻り値は画面に出るか、次の更新に使われるか",
            "例外はどこで catch され、どのメッセージになるか",
            "同じインタフェースの別実装が無いか（プロファイルで切り替わることがある）",
          ],
        },
        {
          type: "p",
          text: "メソッドの中身は正しく見えても結果が違うときは、別の入口から呼ばれていることがあります。画面用とバッチ用で実装が二つ、など。",
        },
      ],
    },
    {
      id: "where-from",
      title: "値の源流",
      minutes: 8,
      summary: "null や不正値は、今の行より上流にあることが多い。",
      blocks: [
        {
          type: "p",
          text: "NullPointerException や表示不正の多くは、その変数がセットされた場所に原因があります。",
        },
        { type: "diagram", name: "value-origin" },
        {
          type: "ol",
          items: [
            "変数の宣言と代入を見る",
            "DB から来ているなら、列の null 許容と、データが欠ける条件を見る",
            "画面から来ているなら、name 属性とバインドを見る",
            "セッションや ThreadLocal なら、セットするフィルタを見る",
          ],
        },
        {
          type: "code",
          title: "未設定のまま保存される例",
          lang: "java",
          code: `request.setApproverId(form.getApproverId()); // null のまま保存
// 後日の承認処理で
request.getApproverId().equals(userId); // NPE`,
        },
        {
          type: "callout",
          kind: "trap",
          title: "途中の null チェック",
          text: "Optional や null チェックが途中まであると、その先ではもう null ではないと誤解しやすいです。分岐を書き出します。",
        },
      ],
    },
    {
      id: "spec-gap",
      title: "仕様とコードの差",
      minutes: 7,
      summary: "設計書より、現在のコードと実挙動を先に確認する。",
      blocks: [
        {
          type: "p",
          text: "設計書の日付がコードより古いことはよくあります。差があるときは次の順です。",
        },
        {
          type: "ol",
          items: [
            "求められているのが「文書どおり」か「今の動きの修正」かを確認する",
            "コードと、検証環境の実挙動を見る",
            "どちらを正とするか、分かる人に確認する",
            "影響範囲を見ずに仕様を書き換えない",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "修正範囲",
          text: "依頼がバグ修正なら、まず原因箇所の最小変更です。構成の整理は別作業になります。",
        },
      ],
    },
    {
      id: "order",
      title: "読む順番",
      minutes: 6,
      summary: "現象 → 入口 → 分岐 → 永続化 → 出口。",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "現象", text: "誰が、どの画面で、何をすると、何が起きるか。" },
            { title: "入口", text: "URL と HTTP メソッド。Controller またはバッチの入口。" },
            { title: "分岐", text: "権限、ステータス、null。該当する if を特定。" },
            { title: "永続化", text: "SQL、ファイル、外部 API。" },
            { title: "出口", text: "画面メッセージ、リダイレクト、非同期の後処理。" },
          ],
        },
      ],
    },
  ],
};
