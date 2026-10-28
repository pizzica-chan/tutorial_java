export type EclipseTip = {
  id: string;
  name: string;
  how: string;
  detail: string[];
};

export type EclipseSection = {
  id: string;
  title: string;
  intro: string;
  tips: EclipseTip[];
  source: { title: string; href: string };
};

export const eclipseSections: EclipseSection[] = [
  {
    id: "find",
    title: "1. ファイルや文字列を探す",
    intro: "ファイル名が分かっているなら名前で開き、中の文字列しか分からないならファイル検索を使いましょう。",
    source: {
      title: "Eclipse Help：File Search",
      href: "https://help.eclipse.org/latest/topic/org.eclipse.platform.doc.user/reference/ref-45.htm",
    },
    tips: [
      {
        id: "open-resource",
        name: "ファイル名で開く",
        how: "Ctrl+Shift+R → リソースを開く（Open Resource）",
        detail: [
          "ファイル名を入力して開きましょう。XML や設定ファイルなど、Java 以外のファイルも探せます。フォルダを順に展開する必要はありません。",
          "同名の候補が複数あれば、表示されたパスでプロジェクトやフォルダを区別しましょう。",
        ],
      },
      {
        id: "open-type",
        name: "Java のクラス名で開く",
        how: "Ctrl+Shift+T → 型を開く（Open Type）",
        detail: [
          "クラス名やインタフェース名で探せます。XML や HTML を開くときは、リソースを開くを使いましょう。",
        ],
      },
      {
        id: "file-search",
        name: "プロジェクト内の文字列を探す",
        how: "Ctrl+H → ファイル検索（File Search）タブ",
        detail: [
          "URL の一部、画面の文言、テーブル名などを検索しましょう。Java 以外の XML・HTML・設定ファイルも対象にできます。",
          "ファイル名のパターンを `*.xml` などに絞り、検索範囲も確認しましょう。見つからないときは、対象のファイルやプロジェクトが範囲から外れていないかを確かめましょう。",
        ],
      },
      {
        id: "find-in-editor",
        name: "開いているファイル内を探す",
        how: "Ctrl+F → 検索/置換（Find/Replace）",
        detail: [
          "エディタで開いて表示しているファイルだけを検索できます。プロジェクト全体から探したいときは Ctrl+H に切り替えましょう。",
        ],
      },
      {
        id: "quick-outline",
        name: "Java メソッドの一覧から移動する",
        how: "Java エディタで Ctrl+O → クイック・アウトライン（Quick Outline）",
        detail: [
          "今のクラスの Java メソッドやフィールドが一覧になり、名前を入力して絞れます。長いクラスの中で、目的の Java メソッドへ移動したいときに使いましょう。",
        ],
      },
      {
        id: "go-to-line",
        name: "行番号を指定して移動する",
        how: "ファイルを開いて Ctrl+L → 指定行へジャンプ（Go to Line）",
        detail: [
          "移動したい行番号を入力すると、その行へカーソルが移動します。長いファイルでも、スクロールして探す必要がありません。",
        ],
      },
      {
        id: "stack-trace-link",
        name: "スタックトレースからソースの行を開く",
        how: "コンソール（Console）ビューで at 行のリンクをクリック。ログからコピーしたものは、コンソールを開く → Java スタック・トレース・コンソール（Open Console → Java Stack Trace Console）に貼り付ける",
        detail: [
          "at 行の右端にある、ファイル名と行番号の部分がリンクになります。クリックすると、そのファイルのその行が開きます。",
          "サーバのログからコピーしたスタックトレースでも、貼り付ければ同じようにリンクになります。ワークスペースにソースが無いクラスの行は、ソースを開けないことがあります。",
        ],
      },
    ],
  },
  {
    id: "navigate",
    title: "2. 宣言・呼び出し元・実装を辿る",
    intro: "Java メソッドの呼び出しを追うときに使います。文字列の検索と、Java の参照関係の検索を使い分けましょう。",
    source: {
      title: "Eclipse Help：Navigate Actions",
      href: "https://help.eclipse.org/latest/topic/org.eclipse.jdt.doc.user/reference/ref-menu-navigate.htm",
    },
    tips: [
      {
        id: "open-declaration",
        name: "呼び出している処理の宣言を開く",
        how: "Java メソッド名や型名にカーソルを置いて F3 → 宣言を開く（Open Declaration）",
        detail: [
          "呼び出している Java メソッドの名前から、宣言されている場所へ移動できます。Ctrl を押しながら名前をクリックする方法もあります。",
        ],
      },
      {
        id: "back-forward",
        name: "移動前の場所に戻る",
        how: "Alt+← で戻る（Back）、Alt+→ で進む（Forward）",
        detail: [
          "宣言へ何段も移動したあと、読んでいた呼び出し元へ戻れます。ファイルのタブを探し直す代わりに使いましょう。",
        ],
      },
      {
        id: "references",
        name: "使われている場所を探す",
        how: "対象の名前にカーソルを置いて Ctrl+Shift+G → ワークスペース内の参照（References in Workspace）",
        detail: [
          "Java メソッドやフィールドを参照している場所を探せます。文字列検索と違い、名前が同じだけの別の Java メソッドは結果に入りません。",
          "XML やテンプレートに書かれた名前、実行時に組み立てる呼び出しは拾えないことがあります。変更の影響を調べるときは、ファイル検索も組み合わせましょう。",
        ],
      },
      {
        id: "call-hierarchy",
        name: "呼び出し関係を階層で確認する",
        how: "Java メソッド名にカーソルを置いて Ctrl+Alt+H → 呼び出し階層を開く（Open Call Hierarchy）",
        detail: [
          "呼び出し元をツリーで辿れます。呼び出し階層ビューでは、呼び出し先を表示する方向にも切り替えられます。",
          "これはソースから分かる呼び出し関係です。実行時にどの経路を通ったかは、ログやデバッガで確認しましょう。",
        ],
      },
      {
        id: "open-implementation",
        name: "インタフェースから実装を開く",
        how: "対象の型名や Java メソッド名を選び、ナビゲート → 実装を開く（Navigate → Open Implementation）",
        detail: [
          "宣言を開いても処理の中身が無いときに使いましょう。実装が複数ある場合は、候補から選びます。",
          "MyBatis の Mapper のように、対応する Java の実装クラスをソースに持たない仕組みもあります。その場合は Mapper XML や SQL のアノテーションを確認しましょう。",
        ],
      },
      {
        id: "quick-type-hierarchy",
        name: "実装クラスの一覧をすぐ出す",
        how: "型名や Java メソッド名にカーソルを置いて Ctrl+T → クイック型階層（Quick Type Hierarchy）",
        detail: [
          "インタフェースや親クラスの Java メソッドで使うと、それを実装・オーバーライドしているクラスがポップアップで出ます。選ぶと、そのクラスの実装へ移動できます。",
          "もう一度 Ctrl+T を押すと、親クラスやインタフェースの方向の階層に切り替わります。",
        ],
      },
      {
        id: "type-hierarchy",
        name: "継承・実装の関係を確認する",
        how: "型名にカーソルを置いて F4 → 型階層を開く（Open Type Hierarchy）",
        detail: [
          "親クラスや子クラス、インタフェースと実装クラスの関係を確認できます。Java メソッドが親クラスに定義されているときにも使いましょう。",
        ],
      },
    ],
  },
  {
    id: "debug",
    title: "3. デバッガで値と分岐を確認する",
    intro: "デバッグ実行したアプリか、デバッガをつないだアプリが対象です。ブレークポイントは、処理を一時停止する位置の印です。止まったときの変数や呼び出し元を確認できます。",
    source: {
      title: "Eclipse Help：Stepping Through the Execution of a Java Program",
      href: "https://help.eclipse.org/latest/topic/org.eclipse.jdt.doc.user/tasks/task-stepping.htm",
    },
    tips: [
      {
        id: "breakpoint",
        name: "確認したい行で止める",
        how: "Java エディタの左端をダブルクリック、または Ctrl+Shift+B → ブレークポイントの切り替え（Toggle Breakpoint）",
        detail: [
          "実行できる行に印を付けてから、その行を通る処理を動かしましょう。その行を実行する直前に止まります。",
          "通常の起動では止まりません。デバッグ実行しているかを確かめましょう。",
        ],
      },
      {
        id: "variables",
        name: "変数の値を確認する",
        how: "停止中に変数へマウスを重ねる、または変数（Variables）ビューを開く",
        detail: [
          "引数やローカル変数の値を確認できます。オブジェクトは展開すると、フィールドの値まで確認できます。",
          "デバッグ（Debug）ビューで選んだ呼び出しの位置によって、表示される変数が変わります。確認したい Java メソッドの位置を選びましょう。",
        ],
      },
      {
        id: "step-over",
        name: "呼び出し先へ入らず進める",
        how: "停止中に F6 → ステップ・オーバー（Step Over）",
        detail: [
          "今の行を実行して、次の実行可能な行で止まります。Java メソッドの呼び出しがあっても、中へ入らずに進められます。呼び出し先のブレークポイントに達した場合は、そこで止まります。",
        ],
      },
      {
        id: "step-into",
        name: "呼び出し先の中へ入る",
        how: "停止中に F5 → ステップ・イン（Step Into）",
        detail: [
          "次に実行する Java メソッドの中へ進みます。ライブラリ内部などへ入ってしまったら、F7 のステップ・リターン（Step Return）で今の Java メソッドから呼び出し元へ戻れます。",
        ],
      },
      {
        id: "step-filter",
        name: "ライブラリの中へ入らないようにする",
        how: "ウィンドウ → 設定 → Java → デバッグ → ステップ・フィルター（Window → Preferences → Java → Debug → Step Filtering）で対象のパッケージを追加。オンとオフは Shift+F5 → ステップ・フィルターの使用（Use Step Filters）",
        detail: [
          "`org.springframework.*` のようなパッケージを登録すると、ステップ・インしてもその中では止まらず、自分たちのコードまで進みます。",
          "フィルタしたパッケージの中にも、ブレークポイントを置けば止まります。ライブラリの中を確かめたいときは、Shift+F5 で一時的にオフにしましょう。",
        ],
      },
      {
        id: "resume",
        name: "実行を再開する",
        how: "停止中に F8 → 再開（Resume）",
        detail: [
          "実行を続け、次のブレークポイントなどの停止条件に達すると再び止まります。停止条件が無ければ、そのまま処理が進みます。",
        ],
      },
      {
        id: "change-value",
        name: "変数の値を書き換える",
        how: "停止中に変数（Variables）ビューで変数を右クリック → 値の変更（Change Value）",
        detail: [
          "値を書き換えてから実行を進めると、別の値だったときの分岐を試せます。ソースは変わりません。書き換えた値が効くのは、その実行の間だけです。",
          "変数ビューの値の欄をクリックして、直接入力することもできます。",
        ],
      },
      {
        id: "evaluate",
        name: "停止中に任意のコードを実行する",
        how: "停止中にデバッグ・シェル（Debug Shell）ビューへコードを書き、選択して Ctrl+U → 実行（Execute）。結果を表示するなら Ctrl+Shift+D → 表示（Display）",
        detail: [
          "止まっている位置の変数を使って、Java の式や文を実行できます。Java メソッドの戻り値や、条件式の結果を確かめたいときに使いましょう。",
          "Java エディタで式を選択して Ctrl+Shift+I → インスペクション（Inspect）を押すと、その式の値をポップアップで確認できます。",
          "ビューが見当たらないときは、Ctrl+3 で「Debug Shell」と入力して開きましょう。古いバージョンでは表示（Display）ビューという名前です。",
          "書いたコードは実際に実行されます。データを更新する Java メソッドを呼ぶと、DB の内容も変わります。",
        ],
      },
      {
        id: "conditional-breakpoint",
        name: "特定の値のときだけ止める",
        how: "ブレークポイントを右クリック → ブレークポイント・プロパティー（Breakpoint Properties）で条件を設定",
        detail: [
          "ループの中や何度も呼ばれる処理で、毎回止まると調べにくいときに使いましょう。条件には、その位置で参照できる変数を使います。",
          "条件式も実行されます。データを更新する Java メソッドを条件から呼び出さないようにしましょう。",
        ],
      },
      {
        id: "exception-breakpoint",
        name: "例外が投げられた行で止める",
        how: "実行 → Java 例外ブレークポイントの追加（Run → Add Java Exception Breakpoint）で例外のクラスを選ぶ",
        detail: [
          "`NullPointerException` など、例外のクラスを指定すると、その例外が投げられた行で止まります。どの行で起きるか分からないときに使いましょう。",
          "Web アプリでは、例外の多くをフレームワークが捕まえてエラー画面に変えます。例外がキャッチされた時に中断（Suspend on caught exceptions）がオンになっているかを確かめましょう。",
          "よく使われる例外を指定すると、ライブラリの中で何度も止まることがあります。不要になったら、ブレークポイント（Breakpoints）ビューで無効にしましょう。",
        ],
      },
      {
        id: "remote-debug",
        name: "起動中のアプリにデバッガをつなぐ",
        how: "実行 → デバッグ構成 → リモート Java アプリケーション（Run → Debug Configurations → Remote Java Application）でホストとポートを指定して接続",
        detail: [
          "Tomcat やコンテナで動いているアプリを、Eclipse から起動し直さずにデバッグできます。アプリ側は、`-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005` のようなオプションを付けて起動しておく必要があります。Java 8 では、`address=5005` のようにポート番号だけを書きます。",
          "コンテナで動かすときは、デバッグ用のポートも公開しましょう。接続したアプリのソースと手元のソースの版が違うと、ブレークポイントの行がずれます。",
          "ブレークポイントで止まっている間は、そのリクエストの処理も止まります。ほかの人も使う環境では、つなぐ前に相談しましょう。デバッグ用のポートは、外部から届く場所で開けないようにしましょう。",
        ],
      },
    ],
  },
  {
    id: "edit",
    title: "4. コードを編集・整形する",
    intro: "修正候補や自動整形を使うと、手作業を減らせます。適用したあとは、意図した変更になっているか差分を確認しましょう。",
    source: {
      title: "Eclipse Help：Source Actions",
      href: "https://help.eclipse.org/latest/topic/org.eclipse.jdt.doc.user/reference/ref-menu-source.htm",
    },
    tips: [
      {
        id: "content-assist",
        name: "名前や引数を補完する",
        how: "Java エディタで Ctrl+Space → コンテンツ・アシスト（Content Assist）",
        detail: [
          "変数名や Java メソッド名の候補を出せます。オブジェクトの `.` のあとで使うと、その型で使える Java メソッドやフィールドを探せます。",
        ],
      },
      {
        id: "quick-fix",
        name: "エラーの修正候補を出す",
        how: "エラーが出ている箇所で Ctrl+1 → クイック・フィックス（Quick Fix）",
        detail: [
          "不足している import の追加など、修正候補が出ます。候補の内容を読んでから選びましょう。同じ名前のクラスを別のパッケージから import しないように確認が必要です。",
        ],
      },
      {
        id: "organize-imports",
        name: "import を整理する",
        how: "Ctrl+Shift+O → インポートの編成（Organize Imports）",
        detail: [
          "不足している import を追加し、使っていないものを削除できます。同名の型が複数ある場合は、使う型を選びましょう。",
        ],
      },
      {
        id: "format",
        name: "インデントや改行を整える",
        how: "Ctrl+Shift+F → フォーマット（Format）",
        detail: [
          "Java コードを、設定された規則に合わせて整形します。範囲を選択して使うと、その範囲を整形できます。選択が無い場合はファイル全体が対象です。",
          "既存のファイルでは、直した範囲だけを選んで整形しましょう。ファイル全体を整形すると、修正と関係ない行まで差分に入ることがあります。",
        ],
      },
      {
        id: "rename",
        name: "名前と参照箇所をまとめて変更する",
        how: "対象の名前にカーソルを置いて Alt+Shift+R → 名前変更（Rename）",
        detail: [
          "変数・Java メソッド・クラスなどの名前を、参照箇所と合わせて変更できます。単純な文字列の一括置換より、対象を区別しやすくなります。",
          "XML やテンプレート、文字列で書いた名前まで追えるかは構成によって違います。変更後は差分とファイル検索で確認しましょう。",
        ],
      },
      {
        id: "local-history",
        name: "保存前の状態と比べる・戻す",
        how: "ファイルを右クリック → 比較 → ローカル・ヒストリー（Compare With → Local History）。戻すときは 置換 → ローカル・ヒストリー（Replace With → Local History）",
        detail: [
          "Eclipse は、ファイルを保存するたびにその時点の内容を手元に残します。Git にコミットする前の変更でも、保存した時点ごとに比べたり戻したりできます。",
          "残る期間や件数には上限があります。設定は ウィンドウ → 設定 → 一般 → ワークスペース → ローカル・ヒストリー（Window → Preferences → General → Workspace → Local History）で確認しましょう。",
        ],
      },
    ],
  },
  {
    id: "workbench",
    title: "5. エディタやビューを使いやすくする",
    intro: "ビューは、検索結果や変数などを表示する領域です。開く場所が分からなくなったときや、ファイルを行き来するときに使いましょう。",
    source: {
      title: "Eclipse Help：Platform Tips and Tricks",
      href: "https://help.eclipse.org/latest/topic/org.eclipse.platform.doc.user/tips/platform_tips.html",
    },
    tips: [
      {
        id: "find-actions",
        name: "機能名から操作を探す",
        how: "Ctrl+3 → アクションの検索（Find Actions。バージョンによっては Quick Access）",
        detail: [
          "ビュー・設定・コマンドなどを、名前の一部から探して開けます。メニューの場所を覚えていない機能にも使いましょう。",
        ],
      },
      {
        id: "switch-editor",
        name: "開いているファイルを切り替える",
        how: "Ctrl+E → エディターのクイック切り替え（Quick Switch Editor）",
        detail: [
          "ファイル名を入力して候補を絞れます。タブが多くなり、目的のファイルが隠れたときに使いましょう。",
        ],
      },
      {
        id: "maximize-editor",
        name: "エディタを広く表示する",
        how: "エディタのタブをダブルクリック。もう一度ダブルクリックすると元に戻る",
        detail: [
          "長い SQL や Java コードを読むときに、エディタの領域を最大化できます。ビューのタイトル部分でも同じ操作ができます。",
        ],
      },
      {
        id: "show-in",
        name: "今のファイルがある場所を確認する",
        how: "Alt+Shift+W → 表示（Show In）からパッケージ・エクスプローラーなどを選ぶ",
        detail: [
          "開いているファイルをツリーの中で選択できます。同じフォルダの設定ファイルや、同じパッケージのクラスを探すときに使いましょう。",
        ],
      },
      {
        id: "key-assist",
        name: "使えるショートカットを確認する",
        how: "Ctrl+Shift+L → キー・アシスト（Key Assist）",
        detail: [
          "現在の画面で使えるキーの割り当てを表示できます。設定を確認・変更したいときは、ウィンドウ → 設定 → 一般 → キー（Window → Preferences → General → Keys）を開きましょう。",
        ],
      },
    ],
  },
  {
    id: "history",
    title: "6. 変更の履歴を確認する",
    intro: "既存のコードを読むときは、いつ、なぜ変わったかが手がかりになります。Git で管理しているプロジェクトが対象です。",
    source: {
      title: "EGit User Guide",
      href: "https://help.eclipse.org/latest/topic/org.eclipse.egit.doc/help/EGit/User_Guide/User-Guide.html",
    },
    tips: [
      {
        id: "revision-information",
        name: "その行を誰がいつ変えたかを確認する",
        how: "エディタ内を右クリック → チーム → リビジョン情報の表示（Team → Show Revision Information）",
        detail: [
          "エディタの左端に、行ごとに最後に変更したコミットと作成者が出ます。マウスを重ねると、コミットメッセージを確認できます。Git の blame と同じ情報です。",
          "ファイル全体の変更の流れを見たいときは、チーム → ヒストリーに表示（Team → Show in History）を使いましょう。",
        ],
      },
    ],
  },
];

export function eclipseTipText(tip: EclipseTip): string {
  return [tip.name, tip.how, ...tip.detail].join("\n");
}
