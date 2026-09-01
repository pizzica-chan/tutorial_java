export type MapLink = { label: string; to: string };

export type MapLeaf = {
  symptom: string;
  check: string;
  links: MapLink[];
};

export type MapBucket = {
  id: string;
  label: string;
  hint: string;
  leaves: MapLeaf[];
};

export const troubleshootMap: MapBucket[] = [
  {
    id: "client",
    label: "クライアント",
    hint: "ブラウザや PC 側",
    leaves: [
      {
        symptom: "見た目だけおかしい（色・レイアウトが当たっていない）",
        check: "HTML とは別の CSS / JS のリクエストが 404 になっていないか、Network タブで確認しましょう。",
        links: [
          { label: "HTTP サーバのログを見る", to: "/tracks/troubleshoot/http-server-log" },
          { label: "[障害調査] 一覧は出るが、画面だけ崩れている", to: "/tracks/scenario/http-server" },
        ],
      },
      {
        symptom: "ボタンを押しても画面が変わらない",
        check: "Network タブに、押した瞬間の新しいリクエストが出ているか確認しましょう。",
        links: [
          { label: "調査手順", to: "/tracks/troubleshoot/loop" },
          { label: "[障害調査] 申請一覧で、承認ボタンを押しても何も起きない", to: "/tracks/scenario/front" },
        ],
      },
    ],
  },
  {
    id: "network",
    label: "ネットワーク",
    hint: "途中の経路",
    leaves: [
      {
        symptom: "操作しても反応が無い・読み込みが終わらない",
        check: "アプリのログに、操作時刻のアクセスがあるか確認しましょう。無ければ、まだアプリに届いていません。",
        links: [
          { label: "ネットワークの疎通確認", to: "/tracks/troubleshoot/net-check" },
          { label: "[障害調査] 検証用環境だけ、読み込みが終わらない", to: "/tracks/scenario/net" },
        ],
      },
      {
        symptom: "外部システム・外部 API との連携でエラーになる",
        check: "自社アプリから、その外部ホスト・ポートへ実際に届くか確認しましょう。",
        links: [
          { label: "トラブル例：外部システム / 外部 API", to: "/tracks/troubleshoot/p-external" },
          { label: "ネットワークの疎通確認", to: "/tracks/troubleshoot/net-check" },
        ],
      },
    ],
  },
  {
    id: "server",
    label: "サーバ",
    hint: "リクエストが届いている側（DB を含む）",
    leaves: [
      {
        symptom: "画面にエラー、または真っ白（5xx など）",
        check: "同時刻のサーバのエラーログと、スタックトレースを確認しましょう。",
        links: [
          { label: "スタックトレース", to: "/tracks/troubleshoot/stack" },
          { label: "トラブル例：画面にエラーが出る", to: "/tracks/troubleshoot/p-500" },
        ],
      },
      {
        symptom: "指定の画面が開かない（404 など）",
        check: "Network タブで、リクエストの URL とステータスコードを確認しましょう。",
        links: [{ label: "トラブル例：指定の画面が開かない", to: "/tracks/troubleshoot/p-404" }],
      },
      {
        symptom: "ログイン画面に戻される・権限エラーになる",
        check: "Network タブのステータスコードと、Location、Cookie を確認しましょう。",
        links: [{ label: "トラブル例：ログイン画面へ戻される / 権限エラー", to: "/tracks/troubleshoot/p-auth" }],
      },
      {
        symptom: "200 なのに件数や中身がおかしい",
        check: "実行された SQL と、その条件に合うレコードを確認しましょう。",
        links: [
          { label: "アプリのログで処理を追う", to: "/tracks/troubleshoot/log-follow" },
          { label: "トラブル例：件数・更新結果がおかしい", to: "/tracks/troubleshoot/p-data" },
        ],
      },
      {
        symptom: "遅い",
        check: "Network タブの待ち時間か、ログの時刻の空きかを確認しましょう。",
        links: [{ label: "トラブル例：遅い", to: "/tracks/troubleshoot/p-slow" }],
      },
      {
        symptom: "ある環境（検証用環境など）だけで再現する",
        check: "設定・データ・権限の差を確認しましょう。",
        links: [{ label: "トラブル例：環境差", to: "/tracks/troubleshoot/p-env" }],
      },
      {
        symptom: "アプリは正常そうなのに、DB やコンテナが怪しい",
        check: "DB へ直接つないでみる、コンテナや外部 Tomcat の起動状態を確認しましょう。",
        links: [
          { label: "ミドルウェアとコンテナの確認", to: "/tracks/troubleshoot/middleware-check" },
          { label: "Linux の基本操作", to: "/tracks/troubleshoot/linux-basics" },
        ],
      },
    ],
  },
];
