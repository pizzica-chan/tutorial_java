# 申請くんのメモ

画面キャプチャやソース追跡のとき、「教材の抜粋と違う」と感じる箇所のメモです。バグではありません。直す前に、教材に出る動きが追えるかを優先します。本番品質までは求めません。

## 意図している動き

- **申請一覧は未承認だけ出す。** `findMine` は `status = 'PENDING'` です。承認と新規申請は一覧から行います。承認済みの備品購入は一覧に出ず、申請履歴で探します。
- **申請履歴は検索用。** 件名・ステータス・申請日で絞ります。未承認も承認済みも出ます。承認ボタンはありません。
- **申請者（山田）にも承認ボタンが出る。** 教材の一覧抜粋と同じです。一覧で押しても POST しません（下の `list.js`）。詳細で押すと POST します。山田が詳細で押すと「権限がありません」になり、`ForbiddenException` の画面が撮れます。佐藤が詳細で承認すると通ります。
- **一覧の承認は POST しない。** シナリオ「承認ボタンを押しても何も起きない」用です。`list.js` が `id="csrfToken"` の value を読みますが、一覧 HTML にその id はありません。`tokenEl.value` の行で例外になり、POST は飛びません。詳細の承認は `form.js-approve-confirm` と `app.js` の確認ダイアログだけで、POST します。
- **パスワードは BCrypt、POST フォームには CSRF 用 hidden がある。** 動かすための簡略はありますが、平文パスワード・CSRF 無効・SQL の文字列連結はしません。
- **教材の短い抜粋に無いクラスや処理がある。** 新規申請、`findById` の null チェック、`@Transactional`、ログインユーザ、例外の出口、画面レイアウトなどです。動かすための穴埋めです。
- **ID 16「研修参加」は、承認者が未設定の教材用データ。** タイトルは業務らしい名前にしてあります。`approver_id=NULL` は意図的な不整合です。山田で詳細を開いて承認すると、`RequestService.approve` の `request.getApproverId().equals(...)` で NullPointerException が発生します。原因を追うシナリオのため、この行を null 安全にはしません。
- **ID 11 は、承認済み申請の業務メッセージ用データ。** 一覧には出ません。詳細ではステータスにかかわらず承認フォームを表示します。送信すると Controller の PENDING 判定で「この申請は承認できません」を flash 表示します。通常の業務画面より操作範囲を広げた教材用仕様です。
- **申請履歴のステータス検索は、条件に乗らない。** フォームの name は `status`、Controller の `@RequestParam` は `requestStatus` です。シナリオ「申請履歴検索の結果が不正」用です。件名と申請日は効きます。教材では件名「申請」とステータス承認済みで検索し、件名だけ効いていることを見せます。識別子を揃えて直してはいけません。
- **申請履歴の件名の Model キーは `searchTitle`。** layout の `title`（画面名）とぶつからないようにしています。フォームの name は `title` のままです。
- **詳細のパスは `/{id:[0-9]+}`。** `/requests/history` と数字の ID が共存するためです。教材の抜粋は `/{id}` のままです。

## 教材の抜粋との差

- **初期データは 5 件。** 一覧は未承認の 4 件です。承認済みの備品購入は申請履歴に出ます。教材の一覧 HTML 例は「研修参加」「休暇申請」の 2 行で、一覧スクリーンショット（`screen-list.jpg`）の先頭 2 件（ID 16、ID 13）に揃えています。
- **申請履歴の検索が遅いシナリオは、検証用に履歴が多い想定。** ローカルの初期データでは遅くなりません。`schema.sql` に履歴検索向けの `INDEX` は足しません。原因を残すためです。教材の `EXPLAIN` は検証用の例で、`possible_keys` も `NULL` にしています。`possible_keys` が `NULL` は、インデックスが存在しない、ではなく、この SQL で使える候補が無いとオプティマイザが見ている、と読みます。MySQL は外部キー列にインデックスを付けることがあります。`OR` と `ORDER BY` が重なるため、単純な `INDEX` 追加では足りないことがあります。
- **教材に載せるスタックの行番号は実ファイルと合わせる。** `RequestService.java` と `RequestController.java` を変更したときは、ラボ、図、クイズ、シナリオの番号も更新します。
- **教材のソースツリーに無いファイルがある。** `WebMvcConfig`、`LoggingJavaMailSender`、`AccessLogInterceptor`、`ServiceLoggingAspect`、エラー画面などです。Interceptor / AOP / メールログを動かすために足しています。
- **`static/demo/` は教材キャプチャ用のモック HTML です。** 0 件や CSS 無しなど、起動中のアプリでは出しにくい見え方を撮るためのものです。業務の画面ではありません。Network タブは偽 HTML ではなく、headed Chrome の実物を撮ります。手順は `.cursor/rules/textbook-screenshots.mdc` です。
- **CSS 404 の Network キャプチャは、Puppeteer が `app.css` を intercept して 404 にしている。** シナリオ「一覧は出るが、画面だけ崩れている」の原因は、手前の nginx が `/shinsei/css/` を先に受け、ディスクの別ディレクトリを見ている例です。起動中の申請くん（Docker）に nginx は無く、静的ファイルはアプリが返します。画面・Network の URL は検証用ホスト `intranet.example.co.jp` です。
- **画面にエラーが出ているが POST が無い見え方は、ページ単体のモックでは撮りません。** サーバの flash に見えるためです。一覧で submit を止めて画面にエラーを出し、headed Chrome のウィンドウ全体を撮ります。
- **承認 500 と業務メッセージの画面は実アプリ経路で撮る。** ID 16 の実 POST で 500 画面と Network タブを、ID 11 の実 POST で flash 画面を撮ります。500 テンプレートの見出しは教材と同じ「エラーが発生しました」です。本文は利用者向けの定型文です。
- **ページ画像のアドレスバーは合成です。** 三点は macOS 風です。Network タブは Windows の実 Chrome なので、枠の見た目は揃いません。
- **`screen-network-login-fail.jpg` だけ URL は `intranet.example.co.jp` です。** 教材の検証用ホスト名に合わせるため、撮影 PC の hosts で `127.0.0.1 intranet.example.co.jp` を足します。`shinsei-kun/scripts/setup-capture-hosts.ps1`（管理者 PowerShell）。検証用シナリオ向けの画面・Network キャプチャも同じホスト名です。再撮影は `node shinsei-kun/scripts/capture-screens.mjs --verify-scenarios` と `node shinsei-kun/scripts/capture-network.mjs --verify-scenarios`。

## レビューで求めないこと

テスト網羅、層の厳密な分離、DTO と Entity の使い分け、国際化、監視、メール再送、パフォーマンス、セキュリティ診断の完遂は、このサンプルの範囲外です。
