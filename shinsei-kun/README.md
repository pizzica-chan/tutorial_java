# 申請くん

教材「現場で読む Java Web」で使っている社内申請アプリの、動くソースです。画面キャプチャ用に、ログインから一覧・詳細・承認まで一通り操作できます。

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

山田でログインすると、承認ボタンは見えます。承認者ではないので、押すと「権限がありません」になります。佐藤で同じ申請を承認すると通ります。確認ダイアログは `static/js/app.js` です。

## 画面と API

| 操作 | URL |
| --- | --- |
| ログイン | GET `/shinsei/login` |
| 申請一覧 | GET `/shinsei/requests` |
| 申請詳細 | GET `/shinsei/requests/12` |
| 承認 | POST `/shinsei/requests/12/approve` |
| 新規申請 | GET `/shinsei/requests/new` |
| 利用者管理 | GET `/shinsei/admin/users` |
| JSON 一覧 | GET `/shinsei/api/requests` |

初期データは `src/main/resources/data.sql` です。交通費申請の ID は 12、備品購入は承認済みです。承認したあとにこの状態へ戻すには、アプリを再起動します。教材用の初期行（ID 11〜15）のステータスが戻ります。画面から新規に作った申請は残ります。

承認後のメールは SMTP には出さず、アプリのログ（コンソールと `logs/shinsei.log`）に内容を出します。

## ソースの場所

パッケージは `jp.co.example.shinsei` です。教材のソースツリーと同じ並びです。動かすために足している主なものは、ログインユーザ、利用者マスタ、例外の出口、Interceptor / AOP、画面のレイアウトです。

教材の抜粋との差、意図している動きは `NOTES.md` にあります。
