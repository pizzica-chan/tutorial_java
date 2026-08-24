# 申請くんのメモ

画面キャプチャやソース追跡のとき、「教材の抜粋と違う」と感じる箇所のメモです。バグではありません。直す前に、教材に出る動きが追えるかを優先します。本番品質までは求めません。

## 意図している動き

- **申請者（山田）にも承認ボタンが出る。** 教材の一覧抜粋と同じです。一覧で押しても POST しません（下の `list.js`）。詳細で押すと POST します。山田が詳細で押すと「権限がありません」になり、`ForbiddenException` の画面が撮れます。佐藤が詳細で承認すると通ります。
- **一覧の承認は POST しない。** シナリオ「承認ボタンを押しても何も起きない」用です。`list.js` が `id="csrfToken"` の value を読みますが、一覧 HTML にその id はありません。`preventDefault()` のあと例外になり、POST は飛びません。詳細の承認は `form.js-approve-confirm` と `app.js` の確認ダイアログだけで、POST します。
- **パスワードは BCrypt、POST フォームには CSRF 用 hidden がある。** 動かすための簡略はありますが、平文パスワード・CSRF 無効・SQL の文字列連結はしません。
- **教材の短い抜粋に無いクラスや処理がある。** 新規申請、`findById` の null チェック、`@Transactional`、ログインユーザ、例外の出口、画面レイアウトなどです。動かすための穴埋めです。
- **ID 16 は、承認者が未設定の教材用データ。** `approver_id=NULL` は意図的な不整合です。山田で詳細を開いて承認すると、`RequestService.approve` の `request.getApproverId().equals(...)` で NullPointerException が発生します。原因を追うシナリオのため、この行を null 安全にはしません。
- **ID 11 は、承認済み申請の業務メッセージ用データ。** 詳細ではステータスにかかわらず承認フォームを表示します。送信すると Controller の PENDING 判定で「この申請は承認できません」を flash 表示します。通常の業務画面より操作範囲を広げた教材用仕様です。

## 教材の抜粋との差

- **一覧 SQL は `t_user` を JOIN している。** 申請者名・承認者名を画面に出すためです。教材の抜粋は `FROM t_request WHERE ...` だけです。MyBatis の DEBUG ログは抜粋と一致しません。実ファイルの XML とは一致します。
- **初期データは 5 件。** 教材の一覧 HTML 例は「交通費申請」「備品購入」の 2 行です。実データは休暇申請・出張旅費・承認者未設定が足されています。`ORDER BY created_at DESC` なので、交通費申請（ID 12）は先頭ではありません。
- **教材に載せるスタックの行番号は実ファイルと合わせる。** `RequestService.java` と `RequestController.java` を変更したときは、ラボ、図、クイズ、シナリオの番号も更新します。
- **教材のソースツリーに無いファイルがある。** `WebMvcConfig`、`LoggingJavaMailSender`、`AccessLogInterceptor`、`ServiceLoggingAspect`、エラー画面などです。Interceptor / AOP / メールログを動かすために足しています。
- **`static/demo/` は教材キャプチャ用のモック HTML です。** 0 件や CSS 無しなど、起動中のアプリでは出しにくい見え方を撮るためのものです。業務の画面ではありません。Network タブは偽 HTML ではなく、headed Chrome の実物を撮ります。手順は `.cursor/rules/textbook-screenshots.mdc` です。
- **画面にエラーが出ているが POST が無い見え方は、ページ単体のモックでは撮りません。** サーバの flash に見えるためです。一覧で submit を止めて画面にエラーを出し、headed Chrome のウィンドウ全体を撮ります。
- **承認 500 と業務メッセージの画面は実アプリ経路で撮る。** ID 16 の実 POST で 500 画面と Network タブを、ID 11 の実 POST で flash 画面を撮ります。500 テンプレートの見出しは教材と同じ「エラーが発生しました」です。
- **ページ画像のアドレスバーは合成です。** 三点は macOS 風です。Network タブは Windows の実 Chrome なので、枠の見た目は揃いません。
- **HTML が終わらない見え方は、ページ内スピナーではありません。** 申請くんの一覧はサーバ側で HTML を返します。リロードが止まると、直前の一覧が残ったまま Network の document 行が pending になります。

## レビューで求めないこと

テスト網羅、層の厳密な分離、DTO と Entity の使い分け、国際化、監視、メール再送、パフォーマンス、セキュリティ診断の完遂は、このサンプルの範囲外です。
