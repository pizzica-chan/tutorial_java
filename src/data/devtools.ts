import type { MapLink } from "./troubleshootMap";

/** 症状から、使う機能を引く1行 */
export type DevtoolsLookupRow = {
  /** 画面や操作で分かる事実。原因の名指しは書かない */
  symptom: string;
  /** 使うタブと機能 */
  tool: string;
  /** 確認することと、それで分かること。1手順または1つの事実ずつ */
  check: string[];
  links?: MapLink[];
};

/** 機能ごとの1行 */
export type DevtoolsTipRow = {
  name: string;
  /** 操作の場所やショートカット */
  how: string;
  desc: string;
};

export type DevtoolsGroup<Row> = {
  title: string;
  note?: string;
  rows: Row[];
};

export type DevtoolsSection =
  | { id: string; title: string; kind: "lookup"; groups: DevtoolsGroup<DevtoolsLookupRow>[] }
  | { id: string; title: string; kind: "tips"; groups: DevtoolsGroup<DevtoolsTipRow>[] };

export const devtools: DevtoolsSection[] = [
  {
    id: "lookup",
    title: "1. 症状からの逆引き",
    kind: "lookup",
    groups: [
      {
        title: "画面・ボタンがおかしい",
        rows: [
          {
            symptom: "ボタンを押しても何も起きない",
            tool: "Network → Console",
            check: [
              "押した瞬間に、Network タブに新しいリクエストが増えるかを確認しましょう。",
              "増えなければ、Console を開きましょう。エラーの右端のファイル名と行番号をクリックすると、その行が Sources タブで開きます。",
              "エラーも無ければ、Sources タブの Event Listener Breakpoints で click を選び、押したときに動く JS の最初の行で止めましょう。",
            ],
            links: [{ label: "ブラウザの JavaScript を辿る", to: "/tracks/reading/js-trace" }],
          },
          {
            symptom: "ボタンや項目が画面に無い",
            tool: "Elements（検索）",
            check: [
              "Elements タブで Ctrl+F を押し、ボタンの文言や `name` で検索しましょう。",
              "要素があれば、Styles の `display: none` など、CSS で隠れていないかを確認しましょう。",
              "要素が無ければ、サーバが返した HTML に入っていないか、JS が消したかのどちらかです。",
              "見分けるには、Network タブで Type 列が `document` の行を選び、Response に同じ文言があるかを確認しましょう。あれば、JS が消したと分かります。",
            ],
            links: [{ label: "HTML / CSS / JavaScript の役割", to: "/tracks/web/front-roles" }],
          },
          {
            symptom: "画面の値が、表示のあとで別の値に変わる",
            tool: "Elements（Break on）",
            check: [
              "値が変わる要素を右クリックし、Break on → subtree modifications を選びましょう。",
              "JS が要素を書き換えた瞬間に止まり、書き換えた行が分かります。",
            ],
            links: [{ label: "ブラウザの JavaScript を辿る", to: "/tracks/reading/js-trace" }],
          },
          {
            symptom: "画面に出ている値が、どこから来たか分からない",
            tool: "Network（検索）",
            check: [
              "Network タブを開いたまま再読み込みしてから、Ctrl+F でその値を検索しましょう。",
              "ヒットしたレスポンスを見ると、値が HTML に埋め込まれていたのか、Ajax で受け取った JSON にあったのかが分かります。",
              "画面に出すときに書式を変えていると（JSON では `1000`、画面では `1,000` など）、ヒットしないことがあります。",
            ],
            links: [{ label: "値の源流", to: "/tracks/reading/where-from" }],
          },
          {
            symptom: "色やレイアウトが崩れている",
            tool: "Network（フィルタ）",
            check: [
              "フィルタのボタンで CSS や JS に絞り、ステータスコードが 404 などになっている行が無いかを確認しましょう。失敗したリクエストは赤い文字で出ます。",
              "HTML が 200 でも、CSS だけ失敗していることがあります。",
            ],
            links: [{ label: "HTTP サーバのログを見る", to: "/tracks/troubleshoot/http-server-log" }],
          },
          {
            symptom: "直した CSS や JS が、画面に反映されない",
            tool: "Network（Disable cache）",
            check: [
              "Size 列に `(memory cache)` や `(disk cache)` と出ていれば、サーバへ取りに行かず、ブラウザに残っているファイルを使っています。",
              "直す前のファイルかもしれないので、Disable cache を付けて再読み込みしましょう。",
              "それでも変わらなければ、Response の中身が直したあとの内容になっているかを確認しましょう。なっていなければ、サーバに置いてあるファイルがまだ古いままです。",
            ],
          },
        ],
      },
      {
        title: "通信の中身を確かめたい",
        rows: [
          {
            symptom: "画面が切り替わると、見たいリクエストが Network タブから消える",
            tool: "Network（Preserve log）",
            check: [
              "Preserve log を付けてから操作しましょう。",
              "POST のあとにリダイレクトする処理やログインの流れも、画面が切り替わる前のリクエストから順に追えます。",
            ],
          },
          {
            symptom: "送ったはずの値が、サーバで受け取った値と違う",
            tool: "Network（Payload）",
            check: [
              "リクエストを選び、Payload タブで Query String Parameters や Form Data を確認しましょう。",
              "ここに出ている `name` と値の組が、ブラウザが実際に送ったものです。",
              "view source を押すと、URL エンコードされたままの形も確認できます。",
            ],
            links: [{ label: "リクエストのパラメータ", to: "/tracks/web/params" }],
          },
          {
            symptom: "画面にはエラーの文言しか出ず、詳しいことが分からない",
            tool: "Network（Response / Preview）",
            check: [
              "失敗したリクエストを選び、Response で本文を確認しましょう。JSON なら、Preview のほうが折りたたんだ形で読めます。",
              "JSON のエラー詳細やエラー画面の HTML に、画面に出ている文言より詳しい情報が入っていることがあります。何を返すかはアプリによって違います。",
            ],
            links: [{ label: "Web API から JSON を受け取る", to: "/tracks/web/api-json" }],
          },
          {
            symptom: "どの JS がそのリクエストを送ったか分からない",
            tool: "Network（Initiator）",
            check: [
              "リクエストを選び、Initiator タブの Request call stack を確認しましょう。",
              "いちばん上がリクエストを送った行で、下へ行くほど呼び出し元です。",
              "ファイル名と行番号をクリックすると、Sources タブでその行が開きます。",
            ],
            links: [{ label: "ブラウザの JavaScript を辿る", to: "/tracks/reading/js-trace" }],
          },
          {
            symptom: "ブラウザと同じリクエストを、コマンドから送り直したい",
            tool: "Network（Copy as cURL）",
            check: [
              "リクエストを右クリックし、Copy → Copy as cURL を選びましょう。",
              "URL・ヘッダ・Cookie・送った値が、まとめて1つの curl のコマンドになります。",
              "サーバや別の PC で実行すれば、ブラウザを使わずに同じリクエストを試せます。",
            ],
            links: [{ label: "ネットワークの疎通確認", to: "/tracks/troubleshoot/net-check" }],
          },
          {
            symptom: "リクエストが多すぎて、失敗したものが見つからない",
            tool: "Network（フィルタ）",
            check: [
              "フィルタの入力欄に `status-code:500` や `method:POST` と入れて絞りましょう。",
              "条件の先頭に `-` を付けると、その条件に合うものを除きます（`-status-code:200`）。",
            ],
          },
        ],
      },
      {
        title: "遅い",
        rows: [
          {
            symptom: "画面が出るまでが遅い",
            tool: "Network（Time 列・Timing）",
            check: [
              "Time 列で時間のかかっているリクエストを探し、Timing タブを開きましょう。",
              "Waiting for server response が長ければ、応答が返り始めるまでに時間がかかっています。同じ時刻のサーバのログで、処理時間を確認しましょう。",
              "Content Download が長ければ、レスポンスが大きいか、経路が遅いことを疑いましょう。",
            ],
            links: [{ label: "トラブル例：遅い", to: "/tracks/troubleshoot/p-slow" }],
          },
          {
            symptom: "回線が遅いときだけ起きる不具合を再現したい（ボタンの二度押しなど）",
            tool: "Network（Throttling）",
            check: [
              "No throttling と出ている選択肢を、Slow 4G などに変えましょう。",
              "応答が返る前にボタンをもう一度押せてしまうか、読み込み中の表示が出るかを確かめられます。",
              "確認が終わったら No throttling に戻しましょう。",
            ],
          },
        ],
      },
      {
        title: "ログイン・Cookie",
        rows: [
          {
            symptom: "操作するとログイン画面へ戻される",
            tool: "Network（Headers）→ Application（Cookies）",
            check: [
              "Preserve log を付けて再現し、戻される直前のリクエストで Status Code と `Location` を確認しましょう。",
              "同じリクエストの Request Headers に `Cookie` があるかを確認しましょう。",
              "Application タブの Cookies に、セッション ID の Cookie があるかも確認しましょう。",
              "Ajax の場合は、Response が JSON ではなくログイン画面の HTML になっていないかも見ましょう。",
            ],
            links: [{ label: "トラブル例：ログイン画面へ戻される / 権限エラー", to: "/tracks/troubleshoot/p-auth" }],
          },
          {
            symptom: "セッションが切れたときの動きを確かめたい",
            tool: "Application（Cookies）",
            check: [
              "Cookies でセッション ID の Cookie（Java の Web アプリでは `JSESSIONID` が多い）を選んで削除し、画面を操作しましょう。",
              "ブラウザがセッション ID を送らなくなるので、ログインしていないときと同じ状態を作れます。",
              "サーバ側のセッションは残ったままです。",
            ],
            links: [{ label: "Cookie とセッション", to: "/tracks/web/session" }],
          },
          {
            symptom: "別の利用者でログインして、動きを比べたい",
            tool: "シークレットウィンドウ",
            check: [
              "通常のウィンドウとシークレットウィンドウは、Cookie が別です。2 つのアカウントで同時にログインして比べられます。",
              "シークレットウィンドウ同士は Cookie を共有します。3 つ目のアカウントには、Chrome の別のプロファイルを使いましょう。",
            ],
            links: [{ label: "正常なケースと突き合わせる", to: "/tracks/troubleshoot/compare-working" }],
          },
        ],
      },
    ],
  },
  {
    id: "tips",
    title: "2. タブごとの便利な機能",
    kind: "tips",
    groups: [
      {
        title: "開く・全体",
        rows: [
          { name: "開発者ツールを開く", how: "F12、または Ctrl+Shift+I", desc: "Mac は Cmd+Option+I。Network タブに出るのは、開発者ツールを開いたブラウザのタブの通信だけ" },
          { name: "要素を選んで開く", how: "Ctrl+Shift+C、または要素を右クリック → 検証", desc: "画面でクリックした要素の HTML が、Elements タブで選ばれた状態で開く" },
          {
            name: "キャッシュを空にして再読み込み",
            how: "開発者ツールを開いたまま、再読み込みボタンを右クリック",
            desc: "Empty cache and hard reload を選ぶと、手元のキャッシュを消してから読み直す。開発者ツールを閉じていると、このメニューは出ない",
          },
          {
            name: "コマンドメニュー",
            how: "Ctrl+Shift+P",
            desc: "機能を名前で探して実行する。screenshot と入れると、ページ全体のスクリーンショットを撮れる。Disable JavaScript と入れると、JS を止めたときの表示を確認できる",
          },
          { name: "画面幅を変える", how: "Ctrl+Shift+M", desc: "スマートフォンの幅など、指定した幅でページを表示する" },
          {
            name: "シークレットウィンドウ",
            how: "Ctrl+Shift+N",
            desc: "Cookie とキャッシュが通常のウィンドウと別になる。拡張機能も既定では動かないので、拡張機能が原因かどうかの切り分けにも使える",
          },
        ],
      },
      {
        title: "Network タブ",
        note: "一覧に出るのは、開発者ツールを開いたあとの通信だけです。開く前に済んだ通信は、再読み込みしないと出ません。",
        rows: [
          { name: "Preserve log", how: "上部のチェックボックス", desc: "画面の切り替えや再読み込みで、一覧を消さない" },
          { name: "Disable cache", how: "上部のチェックボックス", desc: "開発者ツールを開いている間だけ、キャッシュを使わずに毎回サーバへ取りに行く" },
          {
            name: "フィルタ",
            how: "上部の入力欄と、Fetch/XHR・Doc・CSS・JS などのボタン",
            desc: "種類で絞る。入力欄では `status-code:404`、`method:POST`、`-status-code:200`（除外）のように条件でも絞れる",
          },
          { name: "列を足す", how: "一覧の見出しを右クリック", desc: "Method 列などを足す。既定の列では、GET か POST かが一覧から分からない" },
          { name: "全リクエストを検索", how: "Network タブで Ctrl+F", desc: "すべてのリクエストのヘッダとレスポンス本文から、文字列を探す" },
          { name: "Headers", how: "リクエストを選ぶ", desc: "URL、HTTP メソッド、ステータスコードと、リクエスト・レスポンスそれぞれのヘッダ" },
          { name: "Payload", how: "リクエストを選ぶ", desc: "クエリ、フォームで送った値、JSON の本文。view source を押すと、送ったままの形も確認できる" },
          {
            name: "Preview / Response",
            how: "リクエストを選ぶ",
            desc: "返ってきた本文。Preview は、JSON なら折りたためる形で、HTML なら描画して見せる。Response は受け取ったままの文字列。画面が切り替わる前のリクエストは、Preserve log を付けていても本文が出ないことがある",
          },
          { name: "Initiator", how: "リクエストを選ぶ", desc: "そのリクエストを送った JS の呼び出し履歴。ファイル名と行番号をクリックすると、Sources タブでその行が開く" },
          {
            name: "Timing",
            how: "リクエストを選ぶ",
            desc: "時間の内訳。Waiting for server response は、リクエストを送り終えてから、応答の最初の部分が届くまで。Queueing や Stalled は、送る前のブラウザ側の待ち",
          },
          {
            name: "Copy as cURL",
            how: "リクエストを右クリック → Copy",
            desc: "同じリクエストを curl のコマンドとしてコピーする。Windows では `(cmd)` と `(bash)` があり、貼り付けて実行するシェルに合わせて選ぶ（コマンドプロンプトなら `(cmd)`）。Cookie の値もコピーされるので、そのままチャットやチケットに貼らない",
          },
          {
            name: "Copy as PowerShell",
            how: "リクエストを右クリック → Copy",
            desc: "PowerShell 用のコマンドとしてコピーする。Windows PowerShell では `curl` が `Invoke-WebRequest` の別名なので、Copy as cURL でコピーしたコマンドを貼っても動かないことがある",
          },
          {
            name: "Copy as fetch",
            how: "リクエストを右クリック → Copy",
            desc: "JS の fetch の呼び出しとしてコピーする。Console に貼って実行すると、ブラウザから同じリクエストをもう一度送れる",
          },
          {
            name: "Replay XHR",
            how: "Fetch/XHR のリクエストを右クリック",
            desc: "同じ Ajax のリクエストをもう一度送る。POST なら、サーバの更新ももう一度実行される",
          },
          { name: "Block request URL", how: "リクエストを右クリック", desc: "その URL を読み込ませない。CSS や JS が読めないときの見え方を再現できる" },
          {
            name: "Throttling",
            how: "No throttling と出ている選択肢",
            desc: "回線を遅くする。Offline を選ぶと、通信が切れたときの動きを確かめられる",
          },
          {
            name: "Export HAR",
            how: "上部の下向き矢印のボタン",
            desc: "一覧を HAR ファイル（通信の記録を保存する形式）に書き出す。他の人に通信の記録を渡すときに使う。新しい Chrome では、Cookie などを除いて書き出すのが既定。除かずに書き出したファイルは、扱いに注意する",
          },
          {
            name: "Override content",
            how: "リクエストを右クリック",
            desc: "レスポンスを手元のファイルで差し替える。初めて使うときは、差し替えるファイルを置くフォルダを選ぶ。API がエラーを返したときの画面を、サーバを変えずに確かめられる。差し替わるのは自分のブラウザだけ",
          },
        ],
      },
      {
        title: "Console タブ",
        rows: [
          { name: "エラーの行を開く", how: "エラーの右端のファイル名と行番号をクリック", desc: "Sources タブで、例外が起きた行が開く" },
          {
            name: "表示するレベル",
            how: "Default levels と出ている選択肢",
            desc: "Errors だけを選ぶと、警告やログに埋もれずにエラーを探せる。Verbose は既定では表示されない",
          },
          { name: "Preserve log", how: "歯車のボタン → Preserve log", desc: "画面が切り替わっても、それまでのログを消さない" },
          { name: "選んだ要素を使う", how: "`$0`", desc: "Elements タブで選んでいる要素を指す。`$0.value` で、入力欄のいまの値を確認できる" },
          { name: "値をコピーする", how: "`copy(値)`", desc: "変数やオブジェクトの中身を、クリップボードへコピーする" },
        ],
      },
      {
        title: "Elements タブ",
        note: "Elements タブに出ているのは、JS が書き換えたあとの、いまの HTML です。サーバが返した HTML そのものは、Network タブの Response で確認しましょう。",
        rows: [
          { name: "検索", how: "Elements タブで Ctrl+F", desc: "文言や `name`、`id` で要素を探す" },
          {
            name: "Break on",
            how: "要素を右クリック → Break on",
            desc: "subtree modifications（中身の変更）、attribute modifications（属性の変更）、node removal（削除）が起きた瞬間に、JS の実行を止める",
          },
          {
            name: "Event Listeners",
            how: "右側の Event Listeners",
            desc: "その要素に登録されている click などの処理と、その処理がある JS のファイル・行番号。ライブラリ経由で登録していると、ライブラリのファイルが出ることがある",
          },
          {
            name: "Styles / Computed",
            how: "右側の Styles と Computed",
            desc: "その要素に当たっている CSS と、それが書かれたファイル・行番号。Computed では最終的に効いている値（`display` など）が分かる",
          },
          {
            name: "hidden の値",
            how: "`type=\"hidden\"` の input を選ぶ",
            desc: "画面に出ない値も確認できる。たとえば、フォームと一緒に送る CSRF のトークン",
          },
          {
            name: "手元で書き換える",
            how: "HTML や CSS をダブルクリック",
            desc: "表示だけが変わる。再読み込みで元に戻り、サーバには何も送られない",
          },
        ],
      },
      {
        title: "Sources タブ",
        rows: [
          { name: "ファイルを開く", how: "Ctrl+P", desc: "読み込んだ JS や CSS を、ファイル名で開く" },
          { name: "全ファイルを検索", how: "Ctrl+Shift+F（Mac は Cmd+Option+F）", desc: "読み込んだすべてのファイルから、文字列を探す" },
          { name: "Pretty print", how: "`{}` のボタン", desc: "1 行に詰めた JS を、改行とインデントを入れて読める形にする" },
          {
            name: "条件付きブレークポイント / ログポイント",
            how: "行番号を右クリック",
            desc: "条件を満たしたときだけ止める。ログポイントは止めずに、値を Console へ出す",
          },
          {
            name: "XHR/fetch Breakpoints",
            how: "右側の XHR/fetch Breakpoints",
            desc: "URL の一部を登録すると、その URL へリクエストを送る直前で止まる",
          },
          {
            name: "Event Listener Breakpoints",
            how: "右側の Event Listener Breakpoints → Mouse → click",
            desc: "クリックで動く処理の、最初の行で止まる。どの JS が動くか分からないときに使う",
          },
          {
            name: "例外で止める",
            how: "右側の Pause on uncaught exceptions",
            desc: "例外が起きた行で止まる。Pause on caught exceptions も付けると、`catch` で捕まえている例外でも止まる",
          },
        ],
      },
      {
        title: "Application タブ",
        rows: [
          {
            name: "Cookies",
            how: "Storage → Cookies → 開いているサイト",
            desc: "Cookie の名前・値・Domain・Path・有効期限・HttpOnly・Secure。選んで Delete キーで削除できる",
          },
          {
            name: "Local Storage / Session Storage",
            how: "Storage の下",
            desc: "JS がブラウザに保存した値。Cookie と違い、リクエストと一緒にサーバへは送られない",
          },
          {
            name: "Clear site data",
            how: "左の Storage を選んだ画面",
            desc: "そのサイトの Cookie・保存した値・キャッシュを、まとめて消す",
          },
        ],
      },
    ],
  },
];

export type DevtoolsAnchors = {
  sectionId: string;
  groupIds: string[];
};

/** 見出しへの通し番号の id。ArticleToc・目次・検索のジャンプ先で共通して使う唯一の割り当て元 */
export function devtoolsAnchors(): DevtoolsAnchors[] {
  let index = 0;
  return devtools.map((section) => {
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

/** 検索用に1行を文字列へ */
export function devtoolsRowText(row: DevtoolsLookupRow | DevtoolsTipRow): string {
  if ("symptom" in row) return [row.symptom, row.tool, ...row.check].join(" ");
  return [row.name, row.how, row.desc].join(" ");
}
