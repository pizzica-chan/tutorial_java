# 申請くん

教材「参画前に知っておきたい Java Web アプリ」で使っている社内申請アプリの、動くソースです。画面キャプチャ用に、ログインから一覧・詳細・承認まで一通り操作できます。

構成は教材と同じです。Spring Boot 2.7、Java 17、Thymeleaf、MyBatis、MySQL、Spring Security。コンテキストパスは `/shinsei` です。

## 起動（Docker）

リポジトリ直下ではなく、このディレクトリで実行します。JDK はコンテナ側の 17 を使います。

```bash
cd shinsei-kun
docker compose up --build
```

ブラウザで http://localhost:8080/shinsei/login を開きます。

アプリのログファイルは、このディレクトリの `logs/shinsei.log` です。`logback-spring.xml` の出力先と同じです。

止めるときは `docker compose down` です。DB の中身を消すときは `docker compose down -v` です。

## 起動（JDK 17 と Maven）

MySQL だけ Docker で上げ、アプリは IDE や Maven から起動できます。デバッガを付けるとき向けです。

```bash
cd shinsei-kun
docker compose up db -d
mvn spring-boot:run
```

`JAVA_HOME` は 17 にしてください。8 ではコンパイルできません。

## ログイン

パスワードはすべて `password` です。

| ユーザID | 名前 | ロール | 使い方 |
| --- | --- | --- | --- |
| yamada | 山田太郎 | USER | 申請者。教材の申請 ID 12（交通費申請）の申請者 |
| sato | 佐藤花子 | USER | 承認者。交通費申請などを承認できる |
| admin | 管理者 | ADMIN | `/shinsei/admin/users` を開ける |

山田でログインすると、承認ボタンは一覧にも詳細にも見えます。一覧で押しても、教材シナリオのため POST しません（`static/js/list.js`）。詳細で押すと POST します。交通費申請（ID 12）は山田が申請者で承認者ではないため「権限がありません」になります。佐藤が詳細で承認すると通ります。確認ダイアログは `static/js/app.js` です。

## 画面と API

| 操作 | URL |
| --- | --- |
| ログイン | GET `/shinsei/login` |
| 申請一覧 | GET `/shinsei/requests` |
| 申請履歴 | GET `/shinsei/requests/history` |
| 申請詳細 | GET `/shinsei/requests/12` |
| 承認 | POST `/shinsei/requests/12/approve` |
| 新規申請 | GET `/shinsei/requests/new` |
| 利用者管理 | GET `/shinsei/admin/users` |
| JSON 一覧 | GET `/shinsei/api/requests` |

初期データは `src/main/resources/data.sql` です。交通費申請の ID は 12、備品購入は承認済みです。備品購入は申請一覧には出ず、申請履歴で探せます。承認したあとにこの状態へ戻すには、アプリを再起動します。教材用の初期レコード（ID 11〜13、15、16）のステータスが戻ります。画面から新規に作った申請は残ります。

承認後のメールは SMTP には出さず、アプリのログ（コンソールと `logs/shinsei.log`）に内容を出します。

## ソースの場所

パッケージは `jp.co.example.shinsei` です。教材のソースツリーと同じ並びです。動かすために足している主なものは、ログインユーザ、利用者マスタ、例外の出口、Interceptor / AOP、画面のレイアウトです。

教材の抜粋との差、意図している動きは `NOTES.md` にあります。

## 教材用のモック画面

`src/main/resources/static/demo/` は、トラブルシューティング章向けの静的 HTML です。アプリを壊さずに、500、0 件、CSS 無し、承認できない、権限が無い、といった見え方を撮るためのものです。

画面キャプチャの再撮影は、リポジトリ直下で次を実行します。起動中の申請くん（http://localhost:8080/shinsei）が必要です。モック HTML だけ撮るときは `--mocks-only` を付けます。Network タブは headed Chrome なので、モックだけでは撮れません。

```bash
node shinsei-kun/scripts/capture-screens.mjs
node shinsei-kun/scripts/capture-network.mjs
```

成果物は `public/images/screen-*.jpg` です。Network タブは headed Chrome でウィンドウ全体を撮ります。手順の詳細は `.cursor/rules/textbook-screenshots.mdc` です。
