export type MapLink = { label: string; to: string };

export type MapLeaf = {
  symptom: string;
  causeLabel: string;
  causeHint: string;
  check: string;
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
        symptom: "画面にエラー、または真っ白（5xx など）",
        causeLabel: "サーバ",
        causeHint: "リクエストが届いている側（DB を含む）",
        check: "同時刻のサーバのエラーログと、スタックトレースを確認しましょう。",
        links: [
          { label: "スタックトレース", to: "/tracks/troubleshoot/stack" },
          { label: "トラブル例：画面にエラーが出る", to: "/tracks/troubleshoot/p-500" },
        ],
      },
      {
        symptom: "指定の画面が開かない（404 など）",
        causeLabel: "サーバ",
        causeHint: "リクエストが届いている側（DB を含む）",
        check: "Network タブで、リクエストの URL とステータスコードを確認しましょう。",
        links: [{ label: "トラブル例：指定の画面が開かない", to: "/tracks/troubleshoot/p-404" }],
      },
      {
        symptom: "ログイン画面に戻される・権限エラーになる",
        causeLabel: "サーバ",
        causeHint: "リクエストが届いている側（DB を含む）",
        check: "Network タブのステータスコードと、Location、Cookie を確認しましょう。",
        links: [{ label: "トラブル例：ログイン画面へ戻される / 権限エラー", to: "/tracks/troubleshoot/p-auth" }],
      },
      {
        symptom: "外部システム・外部 API との連携でエラーになる",
        causeLabel: "ネットワーク",
        causeHint: "途中の経路",
        check: "自社アプリから、その外部ホスト・ポートへ実際に届くか確認しましょう。",
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
        symptom: "見た目だけおかしい（色・レイアウトが当たっていない）",
        causeLabel: "クライアント",
        causeHint: "ブラウザや PC 側",
        check: "HTML とは別の CSS / JS のリクエストが 404 になっていないか、Network タブで確認しましょう。",
        links: [
          { label: "HTTP サーバのログを見る", to: "/tracks/troubleshoot/http-server-log" },
          { label: "[障害調査] 一覧は出るが、画面だけ崩れている", to: "/tracks/scenario/http-server" },
        ],
      },
      {
        symptom: "200 なのに件数や中身がおかしい",
        causeLabel: "サーバ",
        causeHint: "リクエストが届いている側（DB を含む）",
        check: "実行された SQL と、その条件に合うレコードを確認しましょう。",
        links: [
          { label: "アプリのログで処理を追う", to: "/tracks/troubleshoot/log-follow" },
          { label: "トラブル例：件数・更新結果がおかしい", to: "/tracks/troubleshoot/p-data" },
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
        causeLabel: "クライアント",
        causeHint: "ブラウザや PC 側",
        check: "Network タブに、押した瞬間の新しいリクエストが出ているか確認しましょう。",
        links: [
          { label: "調査手順", to: "/tracks/troubleshoot/loop" },
          { label: "[障害調査] 申請一覧で、承認ボタンを押しても何も起きない", to: "/tracks/scenario/front" },
        ],
      },
      {
        symptom: "操作しても反応が無い・読み込みが終わらない",
        causeLabel: "ネットワーク",
        causeHint: "途中の経路",
        check: "アプリのログに、操作時刻のアクセスがあるか確認しましょう。無ければ、まだアプリに届いていません。",
        links: [
          { label: "ネットワークの疎通確認", to: "/tracks/troubleshoot/net-check" },
          { label: "[障害調査] 検証用環境だけ、読み込みが終わらない", to: "/tracks/scenario/net" },
        ],
      },
      {
        symptom: "遅い",
        causeLabel: "サーバ",
        causeHint: "リクエストが届いている側（DB を含む）",
        check: "Network タブの待ち時間か、ログの時刻の空きかを確認しましょう。",
        links: [{ label: "トラブル例：遅い", to: "/tracks/troubleshoot/p-slow" }],
      },
      {
        symptom: "さっきまで動いていたのに、急に全部の操作がダメになった。または直ったり悪くなったりを繰り返す",
        causeLabel: "サーバ",
        causeHint: "リクエストが届いている側（DB を含む）",
        check: "DB へ直接つないでみる、コンテナや外部 Tomcat の起動状態を確認しましょう。",
        links: [
          { label: "ミドルウェアとコンテナの確認", to: "/tracks/troubleshoot/middleware-check" },
          { label: "Linux の基本操作", to: "/tracks/troubleshoot/linux-basics" },
        ],
      },
    ],
  },
  {
    id: "specific-condition",
    label: "特定の環境・条件でだけ起きる",
    leaves: [
      {
        symptom: "ある環境（検証用環境など）だけで再現する",
        causeLabel: "サーバ",
        causeHint: "リクエストが届いている側（DB を含む）",
        check: "設定・データ・権限の差を確認しましょう。",
        links: [{ label: "トラブル例：環境差", to: "/tracks/troubleshoot/p-env" }],
      },
    ],
  },
];
