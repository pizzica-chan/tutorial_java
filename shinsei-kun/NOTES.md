# 申請くんのメモ

画面キャプチャやソース追跡のとき、「教材の抜粋と違う」と感じる箇所のメモです。バグではありません。直す前に、教材に出る動きが追えるかを優先します。本番品質までは求めません。

## 意図している動き

- **追加のソース追跡シナリオは `investigation` プロファイルで動く。** `InvestigationController` と `InvestigationService` は通常起動では登録されません。`/shinsei/investigation` の画面から検索、名前付き一覧、フォーム登録へ進めます。通常の一覧・承認の処理は変更していません。教材のログは観測例であり、時刻や件数は再現時に確認します。
- **調査用検索は、件名を Service の共有フィールドへ保存する。** 同時実行で `searchTitle` が上書きされる原因を残しています。ログインユーザの ID は引数で渡すため、検索条件が混ざっても参照権限の条件は維持します。`beforeSearch` はデバッガで現在のスレッドだけ止める場所です。単独操作では再現しません。
- **調査用一括登録は内部呼び出しで `@Transactional` を通らない。** `submitBatch` から同じインスタンスの `saveBatch` を呼びます。`RequestService.create` にもトランザクション指定は無いため、2 件目の件名チェックで例外になると 1 件目が残ります。承認処理を変更する例ではありません。トランザクション開始の有無は `transactionActive` のログに出します。
- **調査用一覧は申請ごとに申請者名を取得する。** `findMineWithoutNames` のあとで `UserMapper.findById` を繰り返す N+1 の例です。通常の `findMine` は JOIN のままです。初期データでも回数は確認できますが、遅さを体感するには件数や DB との通信時間が必要です。
- **N+1 の時刻付きログは説明用の例。** 300 件の一覧について、一覧検索と名前取得の時間を比較する流れを示しています。配布環境の実測値ではありません。実際の所要時間はデータと環境に依存するため、SQL の回数だけで今回の遅さの原因と断定しません。各シナリオから、本文の「手元で再現するには」へリンクしています。
- **調査用のフォームと API で件名の検証が違う。** `/investigation/form` は空白を拒否し、`/investigation/api` は共通の `create` へそのまま渡します。NOT NULL は空文字を拒否しません。CSRF とログインは通常どおり有効です。これらは原因を読むための不具合なので、共通チェックを足して消さないでください。

### 追加シナリオの起動

`shinsei-kun` で実行します。通常の app が起動していたら先に `docker compose stop app` を実行します。

```bash
docker compose run --build --service-ports -e SPRING_PROFILES_ACTIVE=dev,investigation app
```

山田の ID は 7、佐藤の ID は 3 です。`/shinsei/investigation` を開きます。POST の Console 例は教材本文にあります。一括登録や空文字の登録を再実行するとレコードが増えるため、レスポンスや SQL で ID を記録してください。

デバッガを使う場合は、run のオプションに `-e "JAVA_TOOL_OPTIONS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005" -p 127.0.0.1:5005:5005` を追加します。IDE から localhost:5005 に接続します。

以下は通常の教材用の動きです。

- **申請一覧は未承認だけ出す。** `findMine` は `status = 'PENDING'` です。承認と新規申請は一覧から行います。承認済みの備品購入は一覧に出ず、申請履歴で探します。
- **申請履歴は検索用。** 件名・ステータス・申請日で絞ります。未承認も承認済みも出ます。承認ボタンはありません。
- **申請者（山田）にも承認ボタンが出る。** 教材の一覧抜粋と同じです。一覧で押しても POST しません（下の `list.js`）。詳細で押すと POST します。山田が詳細で押すと「権限がありません」になり、`ForbiddenException` の画面が撮れます。佐藤が詳細で承認すると通ります。
- **一覧の承認は POST しない。** シナリオ「承認ボタンを押しても何も起きない」用です。`list.js` が `id="csrfToken"` の value を読みますが、一覧 HTML にその id はありません。`tokenEl.value` の行で例外になり、POST は飛びません。詳細の承認は `form.js-approve-confirm` と `app.js` の確認ダイアログだけで、POST します。
- **新規申請の「提出」にも確認ダイアログが出る。** `form.html` の form に `js-submit-confirm` を付け、画面ごとの JS として `static/js/form.js` を読み込みます。`form.js` の submit ハンドラは、`app.js` の `confirmAction` を呼びます。クリックから動く JavaScript を見つけ、そこから別ファイルの関数へ辿る教材用の例です。`app.js` は `<head>` の `defer` 付きなので、`form.js` が実行される時点では `confirmAction` はまだ定義されていません。呼び出しは送信のとき（あとから発生するイベント）なので問題なく動きます。`form.js` のトップレベルから `confirmAction` を呼ぶ形に書き換えてはいけません。
- **確認ダイアログの文言は `app.js` の `confirmAction` が組み立てる。** 承認は「承認してよいですか？」、新規申請は「提出してよいですか？」です。詳細の承認の見え方はこれまでと変わりません。
- **パスワードは BCrypt、POST フォームには CSRF 用 hidden がある。** 動かすための簡略はありますが、平文パスワード・CSRF 無効・SQL の文字列連結はしません。テンプレートに書いた hidden に加え、`th:action` の POST フォームには Spring Security が同じ `_csrf` の hidden を自動で足すので、組み立て後の HTML と送信の Form Data には `_csrf` が 2 つ出ます（`screen-network-approve-payload.jpg`）。教材の「組み立て後の HTML」の抜粋は 1 つだけ載せています。
- **教材の短い抜粋に無いクラスや処理がある。** 新規申請、`findById` の null チェック、`@Transactional`、ログインユーザ、例外の出口、画面レイアウトなどです。動かすための穴埋めです。
- **ID 16「研修参加」は、承認者が未設定の教材用データ。** タイトルは業務らしい名前にしてあります。`approver_id=NULL` は意図的な不整合です。山田で詳細を開いて承認すると、`RequestService.approve` の `request.getApproverId().equals(...)` で NullPointerException が発生します。原因を追うシナリオのため、この行を null 安全にはしません。
- **ID 11 は、承認済み申請の業務メッセージ用データ。** 一覧には出ません。詳細ではステータスにかかわらず承認フォームを表示します。送信すると Controller の PENDING 判定で「この申請は承認できません」を flash 表示します。通常の業務画面より操作範囲を広げた教材用仕様です。
- **申請履歴のステータス検索は、条件に乗らない。** フォームの name は `status`、Controller の `@RequestParam` は `requestStatus` です。シナリオ「申請履歴検索の結果が不正」用です。件名と申請日は効きます。教材では件名「申請」とステータス承認済みで検索し、件名だけ効いていることを見せます。識別子を揃えて直してはいけません。
- **申請履歴の件名の Model キーは `searchTitle`。** layout の `title`（画面名）とぶつからないようにしています。フォームの name は `title` のままです。
- **詳細のパスは `/{id:[0-9]+}`。** `/requests/history` と数字の ID が共存するためです。教材の `RequestController` の抜粋も同じ `/{id:[0-9]+}` にしています。承認の `@PostMapping("/{id}/approve")` は `/history` とぶつからないので、`/{id}` のままです。
- **申請履歴から詳細を開いて戻ると、検索条件が消える。** `RequestController#history` はセッションに `historySearchCondition` というキーで検索条件を保存しますが、`buildHistoryBackUrl` が読むキーは `historyCondition` です。キーが一致せず `session.getAttribute` は常に `null` を返すため、「← 申請履歴」で戻ると毎回、絞り込みの無い申請履歴が表示されます。画面にエラーは出ません。シナリオ「セッションに保存したはずの検索条件が戻ってこない」用の意図した不一致です。キーを揃えて直してはいけません。
- **承認しても、通知メールが届かないことがある。** `MailService.notifyApplicant` は件名を `request.getTitle().substring(0, 10)` で切り詰めますが、10文字未満の件名（「休暇申請」など、教材データのほとんど）では `StringIndexOutOfBoundsException` になります。この例外は `catch (Exception e)` で捕まえ、`log.warn(...)` するだけで `e` を渡していないため、ログには例外の種類もスタックトレースも残りません。DB の更新自体は成功し、画面にもエラーは出ません。シナリオ「承認は成功するのに、申請者への通知メールが届かない」用の意図した不具合です。件名の切り詰めやログ出力を直してはいけません。
- **申請履歴の「承認日時」列が、承認済みでも常に「-」になる。** `RequestMapper.xml` の `searchHistory` は `r.updated_at` を SELECT に足しましたが、エイリアスを付けていません。`map-underscore-to-camel-case: true` により `updated_at` は `updatedAt` に変換されますが、`RequestEntity` 側のフィールド名は `approvedAt` です。名前が一致せず、MyBatis はこの列を黙って無視するため、`approvedAt` は常に `null` のままです。SQL は正しく実行され、DB にも値があり、画面にもエラーは出ません。シナリオ「申請履歴の『承認日時』が、承認済みでも空欄になる」用の意図した不一致です。エイリアスやフィールド名を揃えて直してはいけません。

## 教材の抜粋との差

- **初期データは 5 件。** 一覧は未承認の 4 件です。承認済みの備品購入は申請履歴に出ます。「HTTP のリクエストとレスポンス」の一覧 HTML 例（ラボの `httpSample` と本文）は、一覧スクリーンショット（`screen-list.jpg`）と同じ 4 行です。`<head>` の `app.css`・`app.js` と、表のあとの `list.js` の読み込みも載せています（Network タブの 4 行と対応）。列は件名とステータスだけに省いています。テンプレートの章の「組み立て後の HTML」と Web API の JSON は、2 件の抜粋です。
- **申請履歴の検索が遅いシナリオは、検証用に履歴が多い想定。** ローカルの初期データでは遅くなりません。`schema.sql` に履歴検索向けの `INDEX` は足しません。原因を残すためです。`t_request` には外部キー制約も付けていません。InnoDB は外部キー制約のカラムにインデックスを自動で作るので、付けると `applicant_id` と `approver_id` にインデックスができ、教材の `EXPLAIN`（`possible_keys` が `NULL`、`type` が `ALL`）と合わなくなるためです。外部キー制約を戻してはいけません。`possible_keys` が `NULL` は、インデックスが存在しない、ではなく、この SQL で使える候補が無いとオプティマイザが見ている、と読みます。`OR` と `ORDER BY` が重なるため、単純な `INDEX` 追加では足りないことがあります。以前の `schema.sql` で作った DB ボリュームには外部キー制約とそのインデックスが残るので、作り直すときは `docker compose down -v` を使います（`README.md` の「起動（Docker）」にも同じ注意があります）。
- **二重メールのシナリオは、検証用環境で SMTP 送信に約3秒かかる想定。** `approve` は `@Transactional` の中でメールを送るので、送信が終わるまで確定しません。その間に届いた2回目の承認が、確定前の `PENDING` を読みます。申請くんの `LoggingJavaMailSender` はログに出すだけですぐ終わるので、ローカルでは1回目がすぐ確定し、2回目は Controller の `PENDING` 判定で止まります。人が二度押しする速さでは、ローカルでは再現しにくいです。
- **DB に接続できないシナリオのログは、実物を撮ったもの。** 申請くんで一覧を一度開いたあと、アプリのコンテナのネットワークで `iptables -A OUTPUT -p tcp --dport 3306 -j DROP` を実行し、もう一度一覧を開いて出たログです。時刻は教材の 04:12:03.512 起点に置き換えています。生のログでは、リクエストの行から ERROR まで 28.9 秒でしたが、HikariCP は 30052ms 待ったと出していました。logback の時刻（実時刻）と HikariCP の待ち時間（`System.nanoTime`）が、Docker Desktop（WSL2）のコンテナでずれたためと推定しています。教材では、WARN と ERROR の時刻をこの比率で伸ばし、ERROR が約 30 秒後になるようにしています。HikariCP の既定の待ち時間（30 秒）で `SQLTransientConnectionException` になり、root cause は `ConnectionIsClosedException` でした。root cause は、そのとき裏で失敗した接続によって変わることがあります。`docker-compose.yml` は変えず、使い捨てのコンテナを `--net container:shinsei-kun-app-1 --cap-add NET_ADMIN` で起動して iptables を実行しました。
- **ログのロガー名は `%logger{36}` の短縮に合わせる。** 左のパッケージ名から順に頭文字 1 文字にしていき、36 文字以内になったところで止まります。右端の名前（メソッド名やクラス名）は縮みません。そのため `j.c.e.s.aspect.ServiceLoggingAspect`、`j.c.e.s.mapper.RequestMapper.update`、`j.c.e.s.m.RequestMapper.findMine`、`j.c.e.s.m.R.searchHistory` のように、長さで形が変わります。教材のログ例を足すときは、この規則で計算した字面にします。
- **ログのスレッド名は後ろから 15 文字（`%.15thread`）。** 本来の名前は `http-nio-8080-exec-3` ですが、教材のログ例は Spring Boot の既定の書式と同じ `nio-8080-exec-3` の形で書いています。`logback-spring.xml` の書式を `%thread` に戻すと、教材の 60 か所以上のログ例と合わなくなります。
- **教材に載せるスタックの行番号は実ファイルと合わせる。** `RequestService.java` と `RequestController.java` を変更したときは、ラボ、図、クイズ、シナリオの番号も更新します。
- **教材のソースツリーに無いファイルがある。** `WebMvcConfig`、`LoggingJavaMailSender`、`AccessLogInterceptor`、`ServiceLoggingAspect`、エラー画面などです。Interceptor / AOP / メールログを動かすために足しています。
- **`static/demo/` は教材キャプチャ用のモック HTML です。** 0 件や CSS 無しなど、起動中のアプリでは出しにくい見え方を撮るためのものです。業務の画面ではありません。Network タブは偽 HTML ではなく、headed Chrome の実物を撮ります。手順は `.cursor/rules/textbook-screenshots.mdc` です。
- **CSS 404 の Network キャプチャは、Puppeteer が `app.css` を intercept して 404 にしている。** シナリオ「一覧は出るが、画面だけ崩れている」の原因は、手前の nginx が `/shinsei/css/` を先に受け、ディスクの別ディレクトリを見ている例です。起動中の申請くん（Docker）に nginx は無く、静的ファイルはアプリが返します。画面・Network の URL は検証用ホスト `intranet.example.co.jp` です。
- **同じシナリオの「WAR を Tomcat へ展開」は、この検証用環境だけの想定です。** 申請くん自体は `pom.xml` に war パッケージング指定が無く、常に `spring-boot-maven-plugin` の実行可能 jar（`java -jar`）で動きます。static も実際は jar 内の `classpath:/static/` で、`WEB-INF/classes/static` を外部 Tomcat に展開する構成ではありません。WAR/Tomcat 配置のトラブルシューティングを教えるためのシナリオ用の設定です。
- **画面にエラーが出ているが POST が無い見え方は、ページ単体のモックでは撮りません。** サーバの flash に見えるためです。一覧で submit を止めて画面にエラーを出し、headed Chrome のウィンドウ全体を撮ります。
- **承認 500 と業務メッセージの画面は実アプリ経路で撮る。** ID 16 の実 POST で 500 画面と Network タブを、ID 11 の実 POST で flash 画面を撮ります。500 テンプレートの見出しは教材と同じ「エラーが発生しました」です。本文は利用者向けの定型文です。
- **ページ画像のアドレスバーは合成です。** 三点は macOS 風です。Network タブは Windows の実 Chrome なので、枠の見た目は揃いません。
- **`screen-network-login-fail.jpg` だけ URL は `intranet.example.co.jp` です。** 教材の検証用ホスト名に合わせるため、撮影 PC の hosts で `127.0.0.1 intranet.example.co.jp` を足します。`shinsei-kun/scripts/setup-capture-hosts.ps1`（管理者 PowerShell）。検証用シナリオ向けの画面・Network キャプチャも同じホスト名です。再撮影は `node shinsei-kun/scripts/capture-screens.mjs --verify-scenarios` と `node shinsei-kun/scripts/capture-network.mjs --verify-scenarios`。

## レビューで求めないこと

テスト網羅、層の厳密な分離、DTO と Entity の使い分け、国際化、監視、メール再送、パフォーマンス、セキュリティ診断の完遂は、このサンプルの範囲外です。
