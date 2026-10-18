import { Icon } from "./Icon";

export function ThreadDumpAnatomy() {
  const rows = [
    { label: "見出し行", code: '"http-nio-8080-exec-7" … cpu=83.44ms … nid=0x34 …', note: "どのスレッドか。使った CPU 時間や ID もここにある。", tone: "header" },
    { label: "状態", code: "java.lang.Thread.State: RUNNABLE", note: "状態だけで、CPU を使っているとは判断できない。", tone: "state" },
    { label: "最上段の at 行", code: "at sun.nio.ch.SocketDispatcher.read0(…)", note: "いまいる場所。この例では、ソケットから読もうとしている。", tone: "wait" },
    { label: "ライブラリ", code: "at …RestTemplate.postForObject(…)", note: "何の処理か。HTTP の POST の応答を待っている。", tone: "library" },
    { label: "自分たちのコード", code: "at …NotificationClient.send(NotificationClient.java:25)", note: "ソースを開く場所。この例では通知 API を呼んでいる。", tone: "own" },
    { label: "呼び出し元", code: "at …InvestigationService.approveAndNotify(…)", note: "下へ行くほど呼び出し元。その下には Controller の行がある。", tone: "caller" },
  ];
  return <div className="thread-figure">
    <h3 className="thread-figure-title"><Icon name="file" size={20} />1 スレッド分を、上から読む</h3>
    <p className="thread-figure-intro">申請くんで通知 API の応答を待っている例。行の一部と、間の at 行は省略しています。</p>
    <div className="thread-anatomy">{rows.map((row) =>
      <div className={`thread-anatomy-row thread-tone-${row.tone}`} key={row.label}>
        <strong>{row.label}</strong>
        <div><code>{row.code}</code><p>{row.note}</p></div>
      </div>,
    )}</div>
    <p className="thread-figure-footnote"><code>- locked &lt;0x…&gt;</code> は、そのスレッドが持っているロックを示します。待っている場所を示す行とは別です。</p>
  </div>;
}

export function ThreadDumpWait() {
  return <div className="thread-figure">
    <h3 className="thread-figure-title"><Icon name="route" size={20} />呼び出した順と、いま待っている場所</h3>
    <p className="thread-figure-intro">申請くんの通知処理の例。矢印は Java メソッドを呼び出す向きです。</p>
    <div className="thread-wait-layout">
      <div className="thread-call-chain">
        <div className="thread-call-node"><span>Controller</span><code>InvestigationController.approve</code></div>
        <div className="thread-call-arrow" aria-hidden="true">↓</div>
        <div className="thread-call-node"><span>Service</span><code>InvestigationService.approveAndNotify</code></div>
        <div className="thread-call-arrow" aria-hidden="true">↓</div>
        <div className="thread-call-node thread-call-own"><span>通知 API を呼ぶ</span><code>NotificationClient.send</code><small>ここから RestTemplate を使って POST する</small></div>
        <div className="thread-call-arrow" aria-hidden="true">↓</div>
        <div className="thread-call-node thread-call-wait"><strong><Icon name="clock" size={18} />いま、この中で応答を待っている</strong><code>SocketDispatcher.read0</code><small>ダンプでは、この at 行が最上段に出る</small></div>
      </div>
      <div className="thread-wait-summary">
        <div className="thread-api"><Icon name="server" size={26} /><strong>通知 API</strong><span>POST は送信済み</span><span>応答はまだ返っていない</span></div>
        <p>同じスレッドが、呼び出し先の中で待っています。Controller や Service が、それぞれ別のスレッドになっているわけではありません。</p>
        <div className="thread-state-note"><strong>この例の状態は RUNNABLE</strong><span>CPU で計算し続けているとは限りません。数秒あけて取り、最上段と <code>cpu=</code> を比べましょう。</span></div>
      </div>
    </div>
  </div>;
}
