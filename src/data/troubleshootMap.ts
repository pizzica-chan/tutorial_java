export type MapLink = { label: string; to: string };

export type CauseSide = "クライアント" | "ネットワーク" | "サーバ";

/** 「調査手順」の「当たりのつけ方」と同じ3分類。文言もそこに合わせる */
export const causeHints: Record<CauseSide, string> = {
  クライアント: "ブラウザや PC 側",
  ネットワーク: "途中の経路",
  サーバ: "リクエストが届いている側（DB を含む）",
};

export type MapLeaf = {
  /** 画面を見れば分かる事実だけを書く。原因の名指しは書かない */
  symptom: string;
  /** 原因の当たり。この症状だけでは1つに決まらないときは2つ入れる */
  cause: CauseSide[];
  /** 当たりが1つに決まらないとき、何で分かれるかを書く。省略時は causeHints を並べる */
  causeNote?: string;
  /** 最初に確認すること */
  check: string;
  /** それで分かること */
  tells: string;
  /** 1レッスンにつき1つまで。多くても3つ */
  links: MapLink[];
};

export type ObservableGroup = {
  id: string;
  label: string;
  leaves: MapLeaf[];
};

export const troubleshootMap: ObservableGroup[] = [
  {
    id: "error",
    label: "画面にエラーが出る",
    leaves: [
      {
        symptom: "エラーの文言だけが出る、または画面が真っ白になる",
        cause: ["クライアント", "サーバ"],
        causeNote: "新しいリクエストがあるかどうかで分かれます",
        check: "Network タブに、操作した瞬間の新しいリクエストがあるかを確認しましょう。無ければ Console を、あればステータスコードを見ましょう。",
        tells: "新しいリクエストが無ければ、サーバには届いていません。5xx なら、原因は同時刻のサーバのエラーログに出ていることが多いです。2xx でも本文がエラーなら、届いてはいるので、次に見るのはレスポンスの中身かアプリのログです。",
        links: [
          { label: "トラブル例：画面にエラーが出る", to: "/tracks/troubleshoot/p-500" },
          { label: "スタックトレース", to: "/tracks/troubleshoot/stack" },
          { label: "[障害調査] 申請詳細で承認すると「エラーが発生しました」", to: "/tracks/scenario/back" },
        ],
      },
      {
        symptom: "リンクやブックマークから、その画面が開かない",
        cause: ["クライアント", "サーバ"],
        causeNote: "リクエストがあるかどうかで分かれます",
        check: "Network タブに、その画面へのリクエストがあるかを確認しましょう。あれば URL とステータスコードも見ましょう。",
        tells: "画面が出ない原因は、リクエストが無い・URL のずれ・サーバ側の失敗に分けられます。リクエストが無ければ、リンクや JS などブラウザ側の問題です。404 は、その URL に対応するものが無い、という応答です。",
        links: [
          { label: "トラブル例：指定の画面が開かない", to: "/tracks/troubleshoot/p-404" },
          { label: "どこまで届いたか", to: "/tracks/troubleshoot/divide" },
        ],
      },
      {
        symptom: "ログイン画面に戻される、または権限エラーのメッセージが出る",
        cause: ["サーバ"],
        check: "Network タブのステータスコードと `Location`、Cookie を確認しましょう。",
        tells: "ステータスコードと `Location` で、飛ばされた先が分かります。Cookie で、セッション ID を送っているかが分かります。権限が足りないときのステータスコードや画面は、アプリによって違います。",
        links: [{ label: "トラブル例：ログイン画面へ戻される / 権限エラー", to: "/tracks/troubleshoot/p-auth" }],
      },
      {
        symptom: "そのアプリ固有の文言でエラーが出る（「この申請は承認できません」など）",
        cause: ["サーバ"],
        check: "画面に出ている文言で、ソース全体を全文検索しましょう。Network タブのステータスコードも控えておきましょう。",
        tells: "固有の文言は、いちばん短い検索語です。ヒットした分岐の条件と、Network タブのステータスコードを突き合わせると、どの分岐を通ったかが分かります。ソースにヒットしなければ、DB のメッセージや外部 API の応答が疑わしいです。",
        links: [
          { label: "[障害調査] 申請詳細で承認すると「この申請は承認できません」、ログに例外が無い", to: "/tracks/scenario/message" },
          { label: "アプリのログで処理を追う", to: "/tracks/troubleshoot/log-follow" },
        ],
      },
      {
        symptom: "画面のエラーに、外部のサービス名や連携失敗の文言が出る",
        cause: ["ネットワーク", "サーバ"],
        causeNote: "経路の問題か、外部システム自体の応答かで分かれます。向き先を決めてから見ます",
        check: "アプリのログで、その外部呼び出しの例外クラスとメッセージを確認しましょう。そのあと `application.yml` の接続先も見ましょう。",
        tells: "接続タイムアウトや `Connection refused` なら経路や向き先、HTTP の 4xx / 5xx なら外部側の応答です。向き先が決まってから、疎通確認のコマンドを打ちましょう。",
        links: [
          { label: "トラブル例：外部システム / 外部 API", to: "/tracks/troubleshoot/p-external" },
          { label: "ネットワークの疎通確認", to: "/tracks/troubleshoot/net-check" },
        ],
      },
    ],
  },
  {
    id: "wrong-content",
    label: "画面は出るが内容がおかしい",
    leaves: [
      {
        symptom: "見た目だけおかしい（色やレイアウトが当たっていない）",
        cause: ["サーバ"],
        check: "HTML とは別の CSS / JS のリクエストが 404 になっていないか、Network タブで確認しましょう。",
        tells: "色やレイアウトは CSS / JS が担当します。HTML が 200 でも、別のリクエストだけ失敗していることがあります。手前に HTTP サーバがある構成では、静的ファイルはそこが返すことが多く、アプリのログには出ません。",
        links: [
          { label: "HTTP サーバのログを見る", to: "/tracks/troubleshoot/http-server-log" },
          { label: "[障害調査] 一覧は出るが、画面だけ崩れている", to: "/tracks/scenario/http-server" },
        ],
      },
      {
        symptom: "エラーは出ないのに、一覧の件数や中身がおかしい",
        cause: ["サーバ"],
        check: "アプリのログで、実行された SQL とバインドした値を確認しましょう。そのあと、その条件に合うレコードを DB でも確認しましょう。",
        tells: "エラーが無く応答まで終わっているなら、おかしいのは読んだレコードか、SQL の条件のどちらかです。SQL の結果が画面と同じなら、SQL は合っています。",
        links: [
          { label: "トラブル例：件数・更新結果がおかしい", to: "/tracks/troubleshoot/p-data" },
          { label: "アプリのログで処理を追う", to: "/tracks/troubleshoot/log-follow" },
          { label: "[障害調査] 検証用環境だけ、申請一覧が 0 件", to: "/tracks/scenario/db" },
        ],
      },
      {
        symptom: "検索の条件を指定したのに、条件に合わないレコードが結果に出る",
        cause: ["サーバ"],
        check: "Network タブで、指定した条件がクエリに入っているかを確認しましょう。入っていれば、アプリのログの SQL とバインドした値を見ましょう。",
        tells: "クエリに条件が無ければ、画面から送れていません。送れているのに SQL のバインド値に無ければ、受け取りから SQL までのどこかで条件が落ちています。",
        links: [
          { label: "[障害調査] 申請履歴検索の結果が不正", to: "/tracks/scenario/history" },
          { label: "[障害調査] 申請履歴から詳細を開いて戻ると、検索条件が消える", to: "/tracks/scenario/history-back" },
          { label: "どこまで届いたか", to: "/tracks/troubleshoot/divide" },
        ],
      },
      {
        symptom: "一覧は出るが、社員名や部署名など一部の項目だけ空になっている",
        cause: ["サーバ"],
        check: "アプリのログで、その画面の SQL のあとに外部 API を呼んでいる行が無いかを確認しましょう。",
        tells: "件数やステータスは DB で説明できるのに一部の項目だけ空なら、その値を別システムから取っていることがあります。SQL だけを見続けても見つかりません。",
        links: [
          { label: "トラブル例：外部システム / 外部 API", to: "/tracks/troubleshoot/p-external" },
          { label: "アプリのログで処理を追う", to: "/tracks/troubleshoot/log-follow" },
        ],
      },
    ],
  },
  {
    id: "no-response",
    label: "反応が無い・変わらない・遅い",
    leaves: [
      {
        symptom: "ボタンを押しても画面が変わらない",
        cause: ["クライアント"],
        check: "Network タブに、押した瞬間の新しいリクエストが出ているかを確認しましょう。",
        tells: "画面が変わらなくても、アプリは呼ばれていないことがあります。新しいリクエストが無ければ、原因はボタンの JS や二重送信防止など、ブラウザ側にあります。",
        links: [
          { label: "[障害調査] 申請一覧で、承認ボタンを押しても何も起きない", to: "/tracks/scenario/front" },
          { label: "どこまで届いたか", to: "/tracks/troubleshoot/divide" },
        ],
      },
      {
        symptom: "操作しても反応が無い、または読み込みが終わらない",
        cause: ["ネットワーク"],
        check: "アプリのログに、操作した時刻の行があるかを確認しましょう。",
        tells: "行が無ければ、まだアプリに届いていません。見ているログが違う、別インスタンスで動いている、手前の HTTP サーバで止まっている、なども疑わしいです。Controller の中はまだ関係ありません。",
        links: [
          { label: "アプリログの場所と読み方", to: "/tracks/troubleshoot/logs" },
          { label: "ネットワークの疎通確認", to: "/tracks/troubleshoot/net-check" },
          { label: "[障害調査] 検証用環境だけ、読み込みが終わらない", to: "/tracks/scenario/net" },
        ],
      },
      {
        symptom: "操作は成功するが、応答が遅い",
        cause: ["ネットワーク", "サーバ"],
        causeNote: "待っているのが Network タブ側か、アプリのログ側かで分かれます",
        check: "Network タブの待ち時間と、アプリのログの時刻の空きを見比べましょう。",
        tells: "Network タブだけ長ければ、遅い箇所はアプリに入る前（待ち行列、ロードバランサ、DNS）です。ログの時刻差が大きければ、遅い箇所はアプリの中です。",
        links: [
          { label: "トラブル例：遅い", to: "/tracks/troubleshoot/p-slow" },
          { label: "[障害調査] 申請履歴の検索が遅い", to: "/tracks/scenario/history-slow" },
        ],
      },
      {
        symptom: "アプリが急に落ちる、または重くなる。エラーログに `OutOfMemoryError` や `Full GC` の記録がある",
        cause: ["サーバ"],
        check: "エラーログに `OutOfMemoryError` が無いかを確認しましょう。あればメッセージの種類を、無ければ GC の記録があるかを見ましょう。",
        tells: "`OutOfMemoryError` はメッセージによって疑う場所が変わります。`Full GC` が繰り返されているだけなら、まだ落ちてはいませんが、その間処理が止まって遅くなります。",
        links: [{ label: "トラブル例：メモリ不足・GC の当たりをつける", to: "/tracks/troubleshoot/p-memory" }],
      },
      {
        symptom: "特定の操作だけ、ずっと応答が返ってこない。ログも途中から出ない",
        cause: ["サーバ"],
        check: "操作した時刻のログで、最後に出た行を確認しましょう。その行から先が進んでいなければ、止まっている最中にスレッドダンプを取りましょう。",
        tells: "ログが進みながら時間がかかる「遅い」とは違い、こちらは処理そのものが止まっています。スレッドダンプで、止まっている行とロックの持ち合いを確認できます。",
        links: [{ label: "トラブル例：処理が返ってこない（スレッドダンプ）", to: "/tracks/troubleshoot/p-hang" }],
      },
      {
        symptom: "さっきまで動いていたのに、急に全部の操作がダメになった、または直ったり悪くなったりを繰り返す",
        cause: ["サーバ"],
        check: "アプリのプロセスやコンテナが起動しているかを確認しましょう。起動していれば、DB へ直接つないでみましょう。",
        tells: "アプリのプロセスやコンテナが無ければ、原因はソースを読んでも見つかりません。起動と停止を繰り返していると、操作したのにログが無い、という症状にも見えます。",
        links: [
          { label: "ミドルウェアとコンテナの確認", to: "/tracks/troubleshoot/middleware-check" },
          { label: "Linux の基本操作", to: "/tracks/troubleshoot/linux-basics" },
        ],
      },
      {
        symptom: "デプロイした直後から、その環境の画面が一つも開かない",
        cause: ["サーバ"],
        check: "アプリのプロセスが起動しているかを `ps` で確認しましょう。起動していなければ、アプリの実行ユーザで手動起動して、出るメッセージを読みましょう。",
        tells: "デプロイ直後だけ起きるなら、変わったのは資材か設定か権限です。起動時のメッセージに `Permission denied` があれば、原因はコードではなく、ファイルの所有者と権限です。",
        links: [
          { label: "[障害調査] デプロイ後、検証用環境でアプリが起動しなくなった", to: "/tracks/scenario/process-user" },
          { label: "Linux の基本操作", to: "/tracks/troubleshoot/linux-basics" },
        ],
      },
    ],
  },
  {
    id: "after-success",
    label: "操作は成功したのに、メールが届かない・更新が反映されていない",
    leaves: [
      {
        symptom: "承認や登録は画面に反映されたのに、メールや通知だけ届かない",
        cause: ["サーバ"],
        check: "アプリのログで、DB を更新した行のあとに、メール送信や通知 API の行があるかを確認しましょう。",
        tells: "画面の更新とメール・通知は別の処理です。後者の成否は画面には出ません。行が無ければ呼ばれておらず、ERROR があればそこが失敗した箇所です。",
        links: [
          { label: "トラブル例：外部システム / 外部 API", to: "/tracks/troubleshoot/p-external" },
          { label: "[障害調査] 承認は成功するのに、申請者への通知メールが届かない", to: "/tracks/scenario/mail-silent" },
          { label: "アプリのログで処理を追う", to: "/tracks/troubleshoot/log-follow" },
        ],
      },
      {
        symptom: "更新に成功と出たのに、画面を開き直すと元の値のままになっている",
        cause: ["サーバ"],
        check: "アプリのログで、その操作の UPDATE とバインドした値を確認しましょう。そのあと、その ID のレコードを DB でも確認しましょう。",
        tells: "UPDATE の行が無ければ、更新処理まで届いていません。行はあるのに DB が変わっていなければ、別の ID を更新した、コミットされていない、読み書きで別の DB を見ている、などが疑わしいです。",
        links: [
          { label: "トラブル例：件数・更新結果がおかしい", to: "/tracks/troubleshoot/p-data" },
          { label: "アプリのログで処理を追う", to: "/tracks/troubleshoot/log-follow" },
        ],
      },
    ],
  },
  {
    id: "specific-condition",
    label: "特定の人・データ・環境でだけ起きる",
    leaves: [
      {
        symptom: "ある環境（検証用環境など）だけで再現する",
        cause: ["サーバ"],
        check: "設定・データ・権限の差を確認しましょう。まず、起動プロファイルと `application.yml` の接続先を見ましょう。",
        tells: "同じコードでも、接続先やマスタ、ログインユーザが違えば結果は変わります。原因はコードよりも、こうした環境の差にあることが多いです。",
        links: [
          { label: "トラブル例：環境差", to: "/tracks/troubleshoot/p-env" },
          { label: "[障害調査] 検証用環境だけ、申請一覧が 0 件", to: "/tracks/scenario/db" },
        ],
      },
      {
        symptom: "特定の利用者だけ、同じ操作に失敗する",
        cause: ["サーバ"],
        check: "成功する利用者と失敗する利用者で、Network タブのステータスコードを見比べましょう。そのあと、DB のロールや承認者のレコードを確認しましょう。",
        tells: "ステータスコードが利用者で違えば、権限チェックで分かれています。同じなら、コードは通っていて、データで結果が変わっています。",
        links: [
          { label: "トラブル例：ログイン画面へ戻される / 権限エラー", to: "/tracks/troubleshoot/p-auth" },
          { label: "トラブル例：件数・更新結果がおかしい", to: "/tracks/troubleshoot/p-data" },
        ],
      },
      {
        symptom: "特定の申請やレコードのときだけ失敗する",
        cause: ["サーバ"],
        check: "失敗する ID と成功する ID で、DB のレコードの差を確認しましょう。エラーログにスタックトレースがあれば、その行が見ている値も確認しましょう。",
        tells: "コードは同じなので、差はデータにあります。null や未設定のカラムが `NullPointerException` の原因になっていることがあります。",
        links: [
          { label: "スタックトレース", to: "/tracks/troubleshoot/stack" },
          { label: "[障害調査] 申請詳細で承認すると「エラーが発生しました」", to: "/tracks/scenario/back" },
        ],
      },
      {
        symptom: "同じ操作でも、時間帯によって遅くなる",
        cause: ["サーバ"],
        check: "遅い時間帯のログの時刻差と、同じ時間帯に動いているバッチを確認しましょう。DB へ直接つないで、応答するかどうかも見ましょう。",
        tells: "DB へ直接つなげるのにアプリだけ待たされるなら、コネクションプールの枯渇が疑わしいです。時間帯が決まっているなら、同時に動く処理が疑わしいです。",
        links: [
          { label: "トラブル例：遅い", to: "/tracks/troubleshoot/p-slow" },
          { label: "ミドルウェアとコンテナの確認", to: "/tracks/troubleshoot/middleware-check" },
        ],
      },
    ],
  },
];
