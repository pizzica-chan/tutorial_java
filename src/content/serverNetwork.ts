import type { Track } from "../types";

export const serverNetworkTrack: Track = {
  id: "server-network",
  no: "04",
  title: "サーバ＆ネットワーク",
  kicker: "SERVER & NETWORK",
  description: "Java Web アプリが動く環境とリクエストの経路を理解し、コンテナの中と外の違い、Linux の基本操作、HTTP サーバのログ、ネットワークの疎通、ミドルウェアの稼働状態を確認できるようにします。",
  accent: "#f5cf4d",
  lessons: [
    {
      id: "arch",
      title: "HTTP サーバとサーブレットコンテナ",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "前の章では、Java アプリのファイルと処理の役割を見ました。この章では、アプリが動く環境とリクエストが通る経路を見ます。Java Web アプリの Controller に届くリクエストは、サーブレットコンテナを通ります。その手前に、別の HTTP サーバが置かれることもあります。",
        },
        {
          type: "h2",
          text: "役割の違い",
        },
        {
          type: "table",
          headers: ["種類", "例", "すること"],
          rows: [
            ["HTTP サーバ", "Apache、nginx", "手前で受ける。ブラウザとの HTTPS をここで解き、静的ファイルを配信し、後ろへ中継する"],
            ["サーブレットコンテナ", "Tomcat、Jetty", "Java の画面や API を動かす"],
          ],
        },
        { type: "diagram", name: "arch-roles", caption: "手前の HTTP サーバは無いこともあります。Java は、どれかのサーブレットコンテナで動きます。" },
        {
          type: "callout",
          kind: "trap",
          title: "Apache と Tomcat",
          text: "Apache（httpd）は HTTP サーバ、Tomcat はサーブレットコンテナです。Tomcat の正式名は Apache Tomcat で、同じ Apache という名前が付きますが、別物です。",
        },
        {
          type: "h2",
          text: "重ね方のパターン",
        },
        {
          type: "p",
          text: "よく見る重ね方は次の 3 つです。",
        },
        {
          type: "steps",
          items: [
            {
              title: "内蔵だけ",
              text: "Spring Boot を IDE や java -jar で起動すると、同じプロセスの中で Tomcat や Jetty が動きます。別途 Tomcat を入れる必要はありません。",
            },
            {
              title: "外部に WAR",
              text: "アプリを WAR にして、すでに動いている Tomcat や Jetty に載せます。",
            },
            {
              title: "手前に Apache / nginx",
              text: "ブラウザからの HTTP リクエストは、まず Apache か nginx が受けます。ブラウザとの HTTPS はここで解き、後ろの Tomcat / Jetty へは HTTP で渡すことが多いです（SSL オフロード）。静的ファイルの配信やパスの振り分けもここで行い、動的な処理だけ後ろへ渡します。後ろは内蔵でも外部 WAR でも構いません。",
            },
          ],
        },
        { type: "diagram", name: "arch-patterns" },
        {
          type: "h2",
          text: "重ね方で変わる切り分け",
        },
        {
          type: "p",
          text: "気をつけることは、上のどのパターンかで変わります。手前に Apache / nginx がある構成（パターン 3）では、確認することが増えます。",
        },
        {
          type: "table",
          headers: ["パターン", "気をつけること"],
          rows: [
            ["1: 内蔵だけ", "手前の HTTP サーバが無いので、手前と後ろでパスがずれることはありません。コンテキストパスは `server.servlet.context-path` で決まります。"],
            ["2: 外部 WAR", "手前の HTTP サーバが無いので、手前と後ろでパスがずれることはありません。ただし、コンテキストパスは WAR のファイル名や Tomcat の設定で決まり、`server.servlet.context-path` は使われません。`shinsei.war` なら `/shinsei` です。"],
            ["3: 手前に Apache / nginx", "静的ファイルの 404 は、手前のパス設定のことがあります。コンテキストパスが、手前と後ろの両方に付いていることもあります。"],
          ],
        },
        {
          type: "p",
          text: "アプリのログがどこに出るかは、重ね方だけでなく logback などの設定次第です。見分け方は「アプリログの場所と読み方」で扱います。",
          link: {
            label: "アプリログの場所と読み方",
            to: "/tracks/troubleshoot/logs",
          },
        },
        {
          type: "h2",
          text: "さらに手前",
        },
        {
          type: "p",
          text: "上のどの重ね方でも、さらに手前にロードバランサや CDN、WAF が置かれることがあります。いずれも Java のコードより手前です。パターン 3 なら Apache / nginx の外側、パターン 1・2 なら Tomcat や Spring Boot の手前に置かれます。",
        },
        {
          type: "ul",
          items: [
            "ロードバランサ（LB）… 複数台へ振り分け。SSL 終端をここで行うこともある",
            "CDN … 静的ファイルを近い拠点から配る。キャッシュや SSL 終端を担うこともある",
            "WAF … HTTP リクエストを検査し、攻撃と判定したものを遮断する",
          ],
        },
        {
          type: "p",
          text: "ログの出る場所や、ブロックされたときの応答は環境次第です。実務では「アプリに届いたか」を先に確認しましょう。",
        },
        { type: "quiz", id: "java-arch" },
      ],
    },
    {
      id: "container",
      title: "コンテナで動くアプリ",
      minutes: 19,
      blocks: [
        {
          type: "p",
          text: "コンテナは、アプリに必要なファイルや実行環境をまとめ、ほかのアプリから分けて動かす仕組みです。まず、サーバに直接アプリを置く場合との違いを確認します。そのあと、環境を作り直す考え方と、申請くんの設定・調査方法を見ていきましょう。",
        },
        {
          type: "h2",
          text: "サーバに直接置く場合と、コンテナで動かす場合",
        },
        {
          type: "p",
          text: "コンテナを使う場合も、アプリは PC やサーバの上で動きます。違うのは、アプリに必要なファイルや実行環境の用意の仕方です。",
        },
        {
          type: "p",
          text: "Java アプリをサーバに直接置く場合は、サーバに JRE などを用意してから起動します。コンテナでは、アプリと必要な JRE などをコンテナイメージ（以下、イメージ）にまとめます。コンテナは、そのイメージから作って動かす実体です。",
        },
        {
          type: "p",
          text: "申請くんのイメージには Java 17 が含まれています。ホスト OS に入っている Java の代わりに、この Java 17 を使います。同じイメージを配布すれば、手元の PC とサーバで、アプリや JRE のバージョンをそろえやすくなります。",
        },
        {
          type: "p",
          text: "コンテナで動かせるのは、自作のアプリだけではありません。MySQL のようなミドルウェアも、コンテナで起動できます。申請くんでは、Java アプリを app コンテナ、MySQL を db コンテナで動かします。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "サーブレットコンテナとは別物",
          text: "Tomcat や Jetty を指すサーブレットコンテナは、Java の処理を動かす仕組みです。ここで扱うコンテナは、アプリが使う環境を分ける仕組みです。申請くんでは、app コンテナの中で、Tomcat を内蔵した Spring Boot が動きます。",
        },
        {
          type: "h2",
          text: "名前空間で、プロセスから見える範囲を分ける",
        },
        {
          type: "p",
          text: "コンテナを動かしている側の OS を、ホスト OS と呼びます。Linux のコンテナ内のアプリも、ホスト OS 上のプロセスとして動きます。コンテナごとに独立した OS 全体を起動するわけではなく、Linux のカーネルを共有します。",
        },
        {
          type: "p",
          text: "それでも環境を分けられるのは、Linux の名前空間という仕組みを使うためです。名前空間は、プロセスから見えるプロセスの一覧や、ネットワーク、マウントなどの範囲を分けます。コンテナは、複数の種類の名前空間を組み合わせて動きます。",
        },
        {
          type: "diagram",
          name: "container-isolation",
          caption: "Linux 上で動かす例です。app と db はカーネルを共有し、別々の名前空間を使います。名前空間を共有する構成もあります。",
        },
        {
          type: "p",
          text: "申請くんでは、app と db のネットワーク名前空間が分かれています。そのため、app コンテナ内の `localhost` は app 自身を指し、db コンテナにはつながりません。DB には、同じ Compose のネットワーク上の `db` という名前でつなぎます。",
        },
        {
          type: "p",
          text: "ファイルについても、コンテナ内の `/app` とホスト OS の `/app` は別です。ホスト OS で `ls /app` を実行しても、app コンテナ内のファイルを確認したことにはなりません。外部のファイルを共有する場合は、後で説明するマウントを使います。",
        },
        {
          type: "callout",
          kind: "note",
          title: "自分の PC で Linux のコンテナを動かす場合",
          text: "Windows や macOS の Docker Desktop は、Linux の仮想環境を介して Linux のコンテナを動かします。カーネルを共有する相手は、その Linux 環境です。",
        },
        {
          type: "h2",
          text: "イメージと起動時の構成をファイルに残す",
        },
        {
          type: "p",
          text: "環境を分けるだけでなく、同じ環境を用意し直せることも大切です。Docker では、イメージを作る手順を `Dockerfile` に、複数のコンテナの起動時の構成を `docker-compose.yml` に残せます。",
        },
        {
          type: "p",
          text: "Compose には、「このイメージを使う」「このポートを公開する」「この保存場所をつなぐ」と書きます。このように、実現したい構成を指定する書き方を、宣言的と呼びます。Compose は、その指定に沿ってコンテナやネットワークなどを作成・起動します。",
        },
        {
          type: "p",
          text: "`Dockerfile` はイメージを作る手順、Compose のファイルは起動する構成です。両方をファイルで管理すると、構成を共有し、変更履歴も確認できます。サーバに直接アプリを置く場合も、自動化の仕組みを使えば構成をファイルで管理できます。",
        },
        {
          type: "h2",
          text: "コンテナは作り直し、必要なデータは残す",
        },
        {
          type: "p",
          text: "イメージと起動時の設定が残っていれば、コンテナを作り直せます。アプリの更新では、新しいイメージからコンテナを起動するのが基本です。稼働中のコンテナを手作業で直し続けるよりも、同じ構成を再び用意しやすくなります。",
        },
        {
          type: "p",
          text: "この考え方を、コンテナを「使い捨て」にすると表すことがあります。捨てるのは、作り直せる実行環境です。長期間動かすコンテナもありますが、必要なときに交換できるようにしておきます。",
        },
        {
          type: "p",
          text: "DB のデータや残したいログは、コンテナの外の保存場所をマウントします。マウントは、その保存場所をコンテナ内のパスから使えるようにすることです。申請くんでは、DB のデータを `shinsei-mysql` というボリュームに、ログをホスト OS の `shinsei-kun/logs` に保存します。",
        },
        {
          type: "diagram",
          name: "container-recreate",
          caption: "db コンテナを作り直す例です。同じボリュームを新しいコンテナにもマウントするので、DB のデータを引き継げます。ボリューム自体は削除しない前提です。",
        },
        {
          type: "p",
          text: "外部にマウントしていないファイルの変更は、コンテナを削除すると消えます。`docker restart` で同じコンテナを再起動するだけなら、変更は残ります。外部にマウントしたデータは、その保存場所を削除しなければコンテナを作り直しても残ります。",
        },
        {
          type: "p",
          text: "ホスト OS のファイルやディレクトリをマウントする方法は、bind mount と呼びます。書き込み可能な bind mount 上の設定ファイルをコンテナ内から変更すると、ホスト OS のファイルも変わります。この変更は、コンテナを作り直しても残ります。",
        },
        {
          type: "h2",
          text: "Kubernetes とサーバレスの位置づけ",
        },
        {
          type: "p",
          text: "ここまで説明したのは、コンテナで環境を分け、作り直せるようにする考え方です。実務では、そのコンテナの稼働を Kubernetes で管理したり、クラウドのサーバレスサービスに任せたりすることもあります。役割を分けて確認しましょう。",
        },
        {
          type: "table",
          headers: ["用語", "主な役割"],
          rows: [
            ["コンテナ", "アプリが使うファイルや実行環境をまとめ、ほかの環境から分けて動かす"],
            ["Kubernetes（K8s）", "指定した構成に近づくように、コンテナの配置や稼働状態を管理する"],
            ["サーバレス", "サーバの用意や管理をクラウド事業者に任せて、アプリを動かす"],
          ],
        },
        {
          type: "p",
          text: "Kubernetes では、コンテナを Pod という単位で動かします。たとえば、アプリを動かす Pod を 3 つ維持する構成を指定すると、Pod が失われた場合には新しい Pod を作り、指定した数に近づけます。宣言的な構成と、作り直せる実行環境という考え方が、ここでも使われます。",
        },
        {
          type: "p",
          text: "サーバレスでも、アプリを動かすサーバは存在します。その用意や管理をクラウド事業者が担います。コンテナと両立し、Cloud Run のようにコンテナでアプリを動かすサービスもあります。サーバレスサービスには、関数単位のコードを渡すものなどもあり、すべてが同じ実行方法ではありません。",
        },
        {
          type: "p",
          text: "調査で確認する場所も変わります。Docker で直接動かしているならコンテナの状態やログ、Kubernetes なら Pod の状態やログを確認しましょう。サーバレスなら、サービスの管理画面で設定やログを確認しましょう。後半で、環境に応じた確認方法を見ていきましょう。",
        },
        {
          type: "h2",
          text: "申請くんのイメージと接続設定を読む",
        },
        {
          type: "p",
          text: "ここまでの考え方を、申請くんのファイルで確認しましょう。app のイメージは `Dockerfile` から作り、db には公開されている `mysql:8.0` のイメージを使います。",
        },
        {
          type: "code",
          title: "Dockerfile（申請くん・抜粋）",
          lang: "text",
          highlightLines: [1, 5],
          code: `FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /src/target/shinsei-kun-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Duser.timezone=Asia/Tokyo", "-jar", "app.jar"]`,
        },
        {
          type: "p",
          text: "`FROM` は土台にするイメージ、`ENTRYPOINT` はコンテナを起動したときに実行するコマンドです。この例では、イメージに含まれる JRE で `app.jar` を起動します。",
        },
        {
          type: "p",
          text: "次に、`docker-compose.yml` の接続設定を確認しましょう。`SPRING_DATASOURCE_URL` の `db` はサービス名です。申請くんの app と db は同じネットワークにつながり、この名前で通信できます。",
        },
        {
          type: "code",
          title: "docker-compose.yml（申請くん・抜粋）",
          lang: "yaml",
          highlightLines: [5, 9, 11],
          code: `services:
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/shinsei_dev?characterEncoding=UTF-8`,
        },
        {
          type: "p",
          text: "`ports` の `\"8080:8080\"` は、ホスト OS の 8080 番ポートを app コンテナの 8080 番ポートへつなぐ指定です。左がホスト OS、右がコンテナです。ホスト OS のブラウザから `http://localhost:8080/shinsei/login` を開くと、この公開ポートを通って app に届きます。",
        },
        {
          type: "diagram",
          name: "container-network",
          caption: "申請くんの接続例です。ブラウザはホスト OS の公開ポートを使い、app は Compose のネットワーク上のサービス名で db に接続します。",
        },
        {
          type: "p",
          text: "db の `\"3306:3306\"` も同じ指定です。ホスト OS から TCP で `127.0.0.1:3306` に接続すると、この公開ポートを通って db に届きます。app コンテナ内では `localhost` や `127.0.0.1` が app 自身を指すため、`db:3306` を使います。",
        },
        {
          type: "code",
          title: "例（ホスト OS から MySQL に TCP で接続する）",
          lang: "text",
          code: `mysql --host=127.0.0.1 --port=3306 --user=app --password`,
        },
        {
          type: "callout",
          kind: "trap",
          title: "mysql コマンドの localhost は、接続方法も変えることがある",
          text: "Unix 系の OS で `mysql --host=localhost` を実行すると、既定では TCP ではなく Unix ソケットを使い、ポート指定も無視されます。公開ポートへ接続するときは、上の例のように `127.0.0.1` を指定するか、`--protocol=TCP` を付けましょう。",
        },
        {
          type: "p",
          text: "ここまでの例は、手元の PC で申請くんを動かす場合です。サーバで動かしているアプリをブラウザから開くときは、`http://intranet.example.co.jp:8080/shinsei/login` のように対象サーバのホスト名を使います。",
        },
        {
          type: "h2",
          text: "調査では、操作対象を確認してから中を見る",
        },
        {
          type: "p",
          text: "調査するときは、まず調べるアプリが動いているコンテナを確認しましょう。自分の PC とサーバのどちらのコンテナなのかを確かめてから、そのコンテナのファイルやログを確認しましょう。",
        },
        {
          type: "p",
          text: "`docker` コマンドは、接続先の Docker が管理するコンテナを操作します。この教材は手元の Docker に接続する設定が前提です。サーバのコンテナを調べる方法の 1 つは、`ssh` でサーバに入り、サーバの Docker に接続して操作することです。",
        },
        {
          type: "code",
          title: "例（各マシンの Docker に接続して docker ps を実行する）",
          lang: "text",
          code: `user@my-pc:~$ docker ps --format '{{.Names}}'
shinsei-kun-app-1
shinsei-kun-db-1
user@my-pc:~$ ssh user@app-server
user@app-server:~$ docker ps --format '{{.Names}}'
shinsei-app`,
        },
        {
          type: "p",
          text: "`--format '{{.Names}}'` はコンテナ名だけを出す指定です。指定しない場合は、`docker ps` の `NAMES` で名前を確認しましょう。この例では、手元の Docker に app と db があり、サーバの Docker には `shinsei-app` があります。",
        },
        {
          type: "callout",
          kind: "note",
          title: "コマンドを打った場所だけでは、操作対象は決まらない",
          text: "Docker context には接続先などが保存されています。`docker context show` と `docker context inspect` で選択中の設定を確認しましょう。`DOCKER_HOST`・`DOCKER_CONTEXT` や、`--host`・`--context` で接続先を変えている場合は、その指定も確認しましょう。",
        },
        {
          type: "h3",
          text: "ファイルと起動時の設定を確認する",
        },
        {
          type: "p",
          text: "コンテナ内のファイルは、`docker exec` でコマンドを実行して確認しましょう。次の例は、app コンテナ内でシェルを起動し、ファイルの一覧を出しています。`exit` でこのシェルを終了します。",
        },
        {
          type: "code",
          title: "例（申請くんの app コンテナに入る）",
          lang: "text",
          code: `$ docker exec -it shinsei-kun-app-1 bash
root@1a2b3c4d5e6f:/app# ls
app.jar  logs
root@1a2b3c4d5e6f:/app# exit`,
        },
        {
          type: "callout",
          kind: "note",
          title: "必要なコマンドが無い場合",
          text: "軽量なイメージに `bash` が無い場合は、代わりに `sh` を指定しましょう。JRE だけのイメージには、`jstack` などの JDK の診断コマンドも入っていません。申請くんの `eclipse-temurin:17-jre` も JRE だけです。",
        },
        {
          type: "p",
          text: "設定ファイルを変更する前に、`docker inspect コンテナ名` の `Mounts` を確認しましょう。ファイルがマウント先にある場合は、ボリュームやホスト OS に変更が保存されます。マウント先に無ければ、変更はそのコンテナ内だけに残ります。",
        },
        {
          type: "p",
          text: "コンテナに渡した環境変数は、コンテナ内で `env` を実行すると確認できます。申請くんの DB 接続先は、この環境変数で `application-dev.yml` の値を上書きしています。",
        },
        {
          type: "code",
          title: "例（app コンテナに渡した環境変数のうち、SPRING で始まるもの）",
          lang: "text",
          code: `$ docker exec shinsei-kun-app-1 env | grep SPRING
SPRING_DATASOURCE_PASSWORD=app
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/shinsei_dev?characterEncoding=UTF-8
SPRING_DATASOURCE_USERNAME=app`,
        },
        {
          type: "p",
          text: "設定ファイルと環境変数の優先順位は「application.yml / application.properties」で確認できます。",
          link: {
            label: "application.yml / application.properties",
            to: "/tracks/java-map/yml",
          },
        },
        {
          type: "h3",
          text: "ログを確認する",
        },
        {
          type: "p",
          text: "Docker は既定の設定で、コンテナの標準出力と標準エラー出力を記録します。申請くんも標準出力にログを出しているので、`docker logs` で読めます。",
        },
        {
          type: "code",
          title: "例（app コンテナのログの末尾 3 行）",
          lang: "text",
          code: `$ docker logs --tail 3 shinsei-kun-app-1
04:12:03.100 INFO  [nio-8080-exec-3] j.c.e.s.i.AccessLogInterceptor : GET /shinsei/requests
04:12:03.105 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : start RequestService.findMine(..)
04:12:03.118 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : end RequestService.findMine(..)`,
        },
        {
          type: "p",
          text: "`--tail` は末尾から何行出すかの指定です。`-f` を付けると新しい行を表示し続けます。Compose では、サービス名を指定した `docker compose logs app` でもログを読めます。",
        },
        {
          type: "p",
          text: "申請くんは `/app/logs/shinsei.log` にもログを書きます。ホスト OS の `shinsei-kun/logs` をコンテナ内の `/app/logs` にマウントしているので、ホスト OS からも同じログファイルを開けます。ログの出力先を調べる方法は「アプリログの場所と読み方」で扱います。",
          link: {
            label: "アプリログの場所と読み方",
            to: "/tracks/troubleshoot/logs",
          },
        },
        {
          type: "h3",
          text: "Kubernetes やサーバレスの環境で確認する",
        },
        {
          type: "p",
          text: "Kubernetes の名前空間は、Pod などをまとめて区別する範囲です。前半で説明した Linux の名前空間とは別の仕組みです。調査では、どのクラスタのどの名前空間にある Pod を調べるかを確認しましょう。",
        },
        {
          type: "p",
          text: "`kubectl` は、自分の PC からサーバ側のクラスタも操作できます。Kubernetes の context は、接続先のクラスタ、認証に使う設定、既定の名前空間をまとめた設定です。Docker context とは別の設定です。",
        },
        {
          type: "p",
          text: "まず `kubectl config current-context` で、選択中の context の名前を確認しましょう。名前だけでは接続先が分からない場合は、`kubectl config view --minify` で、その context に関係する設定を表示できます。出力の `contexts` にある `cluster` でクラスタ名、`clusters` にある `server` で接続先の URL を確かめましょう。そのあと、対象の名前空間を指定して Pod の状態とログを確認しましょう。",
        },
        {
          type: "code",
          title: "例（Kubernetes の対象の名前空間で Pod の状態とログを確認する）",
          lang: "text",
          code: `kubectl get pods --namespace 名前空間名
kubectl logs --namespace 名前空間名 Pod名`,
        },
        {
          type: "p",
          text: "コード例の `名前空間名` と `Pod名` は、調べる環境の値に置き換えましょう。Pod に複数のコンテナがある場合は、ログを読むコマンドに `-c コンテナ名` も指定しましょう。Pod が交換されると名前が変わることがあるため、調査対象の Pod と、問題が起きた時刻を確かめましょう。",
        },
        {
          type: "p",
          text: "クラウドのサーバレスでは、ホスト OS に SSH で入ることを前提にせず、サービスの管理画面やログから確認を始めましょう。対象のアプリやサービス、設定、問題が起きた時刻のログを確認する点は共通です。サービスごとに確認方法が違うため、その環境で案内されている管理画面やコマンドを使いましょう。",
        },
        {
          type: "quiz",
          id: "server-container",
        },
      ],
    },
    {
      id: "linux-basics",
      title: "Linux の基本操作",
      minutes: 20,
      blocks: [
        {
          type: "p",
          text: "アプリが動いているサーバには、画面（GUI）が無く、ターミナルだけで調べることが多いです。ここでは、Java Web アプリの調査に使う最低限の Linux コマンドを見ます。",
        },
        {
          type: "h2",
          text: "サーバに入る",
        },
        {
          type: "p",
          text: "SSH は、ネットワーク越しにサーバのターミナルを操作する仕組みです。",
        },
        {
          type: "code",
          title: "例",
          lang: "text",
          code: `ssh ユーザ名@ホスト名`,
        },
        {
          type: "p",
          text: "Docker や Kubernetes のコンテナに入るときは、SSH ではなく別のコマンドを使います。",
        },
        {
          type: "ul",
          items: [
            "`docker exec -it コンテナ名 bash`",
            "`kubectl exec -it Pod名 -- bash`",
          ],
        },
        {
          type: "h2",
          text: "ファイルを見る",
        },
        {
          type: "p",
          text: "ログファイルを開く・追う・検索するという操作が中心です。",
        },
        {
          type: "table",
          headers: ["コマンド", "すること"],
          rows: [
            ["`pwd`", "今いる場所（ディレクトリ）を表示する"],
            ["`ls -l`", "ファイル一覧と、パーミッション・所有者を表示する"],
            ["`cd ディレクトリ名`", "そのディレクトリへ移動する"],
            ["`cat ファイル名`", "ファイル全体を表示する。大きいファイルには向かない"],
            ["`less ファイル名`", "1 画面ずつ見る。`q` で終了、`/文字列` で検索"],
            ["`tail -f ファイル名`", "追記される行をリアルタイムで見る。操作を再現しながら流し見るときに使う"],
            ["`grep 文字列 ファイル名`", "その文字列を含む行だけ表示する"],
          ],
        },
        {
          type: "p",
          text: "`tail -f` は、ログファイルの末尾と、そのあと追記された行を表示し続けます。パイプ（`|`）を使うと、その出力を `grep` に渡せます。次の例では、`grep` が `requestId=12` を含む行だけを表示します。",
        },
        {
          type: "code",
          title: "app.log の例（説明用）",
          lang: "text",
          code: `04:12:03.100 INFO requestId=12 承認処理を開始
04:12:03.150 INFO requestId=13 詳細を取得
04:12:03.200 ERROR requestId=12 承認処理で例外が発生`,
        },
        {
          type: "code",
          title: "実行例（requestId=12 を含む行だけ表示する）",
          lang: "text",
          code: `$ tail -f app.log | grep --line-buffered 'requestId=12'
04:12:03.100 INFO requestId=12 承認処理を開始
04:12:03.200 ERROR requestId=12 承認処理で例外が発生`,
        },
        {
          type: "p",
          text: "`--line-buffered` は、`grep` の出力をまとめてためずに、1 行ずつ表示する指定です。新しいログが追記されると、条件に一致する行も続けて表示されます。終了するときは Ctrl + C を押しましょう。",
        },
        {
          type: "h2",
          text: "パーミッションとユーザ",
        },
        {
          type: "p",
          text: "`ls -l` の先頭に出る `-rwxr-xr-x` のような文字列が、そのファイルのパーミッション（権限）です。",
        },
        {
          type: "code",
          title: "例（ログファイルの権限を見る）",
          lang: "text",
          code: `$ ls -l app.log
-rw-r--r-- 1 appuser appuser 48213 Aug 20 09:10 app.log`,
        },
        {
          type: "table",
          headers: ["部分", "意味"],
          rows: [
            ["`r` / `w` / `x`", "読み取り（read）/ 書き込み（write）/ 実行（execute）"],
            ["先頭から 2〜4 文字目", "所有者（owner）の権限"],
            ["5〜7 文字目", "所有グループ（group）の権限"],
            ["8〜10 文字目", "それ以外（other）の権限"],
          ],
        },
        {
          type: "p",
          text: "`ls -l` の出力には、パーミッションの右側に所有者名とグループ名も並びます。ログファイルを開けない、書き込めないときは、まずこの所有者・グループと、自分が今どのユーザとして操作しているかを確認しましょう。",
        },
        {
          type: "callout",
          kind: "trap",
          title: "Permission denied はコードの不具合ではない",
          text: "`Permission denied` は、パーミッションかユーザが原因であることが多く、アプリのロジックの不具合ではありません。権限を変える `chmod` / `chown` は、理由を確認してから使いましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "SELinux が原因のこともある",
          text: "`ls -l` の権限も所有者も正しいのに `Permission denied` になるときは、SELinux が原因のこともあります。RHEL 系でよく有効です。`getenforce` で `Enforcing` なら疑い、`ls -Z` でファイルのセキュリティコンテキストも確認しましょう。",
        },
        {
          type: "h3",
          text: "アプリを動かしているユーザは、SSH でログインしたユーザとは別のことが多い",
        },
        {
          type: "p",
          text: "Java のプロセスは、サービスとして自動起動する設定やコンテナの実行ユーザで決まる、専用のユーザで動いていることが多いです。SSH でログインした直後に操作しているユーザ（自分の名前のアカウントや、チームで決まった共通ユーザなど）とは別のことがあります。",
        },
        {
          type: "p",
          text: "ファイルの読み書きで `Permission denied` が起きたとき、見るべきなのは「アプリを動かしているユーザの権限」です。ここを混同すると、自分には権限があるのにアプリだけが失敗する理由が分からなくなります。",
        },
        {
          type: "code",
          title: "例（そのプロセスを動かしているユーザを見る）",
          lang: "text",
          code: `$ ps -eo user,pid,cmd | grep java | grep -v grep
appuser   1842  java -jar shinsei-kun.jar`,
        },
        {
          type: "p",
          text: "`-e` はすべてのプロセスを対象にする指定で、`-o user,pid,cmd` はユーザ・PID・コマンドの順に出す指定です。左端の `appuser` が、そのプロセスを動かしているユーザです。うしろの `grep -v grep` は、`grep java` 自身が結果に混ざらないようにする指定です。",
        },
        {
          type: "code",
          title: "例（アプリと同じユーザで書き込めるか試す）",
          lang: "text",
          code: `$ sudo -u appuser touch app.log`,
        },
        {
          type: "p",
          text: "失敗すれば、原因は `appuser` 側の権限です。",
        },
        {
          type: "h3",
          text: "よくある権限不足の例",
        },
        {
          type: "p",
          text: "同じ `Permission denied` でも、足りていない権限は操作によって違います。",
        },
        {
          type: "table",
          headers: ["症状（例）", "足りていない権限"],
          rows: [
            ["シェルスクリプトが起動しない", "そのファイルの実行権限（`x`）"],
            ["ファイルには書き込めるのに、新しいファイルを作れない・消せない", "そのファイルが置かれているディレクトリの書き込み権限（`w`）"],
            ["ファイル自身の権限も所有者も合っているのに、開けない", "パスの途中にあるディレクトリの実行権限（`x`）"],
          ],
        },
        {
          type: "p",
          text: "`./start.sh` のように直接実行するには、そのファイルに `x` が必要です。実行されると中身が読まれるので、スクリプトの場合は `r` も要ります。",
        },
        {
          type: "code",
          title: "例（実行権限が無いスクリプト）",
          lang: "text",
          code: `$ ls -l start.sh
-rw-r--r-- 1 appuser appuser 312 Aug 20 09:10 start.sh
$ ./start.sh
-bash: ./start.sh: Permission denied`,
        },
        {
          type: "p",
          text: "同じスクリプトでも、`bash start.sh` なら動くことがあります。この書き方では bash がファイルを読んで実行するので、`x` が無くても `r` があれば動きます。",
        },
        {
          type: "p",
          text: "ファイルを作る・消すことができるかは、そのファイル自身ではなく、置かれているディレクトリの権限で決まります。",
        },
        {
          type: "code",
          title: "例（ファイルには書けるが、ディレクトリには書けない）",
          lang: "text",
          code: `$ ls -l /var/log/shinsei/app.log
-rw-rw-r-- 1 root appuser 48213 Aug 20 09:10 /var/log/shinsei/app.log
$ ls -ld /var/log/shinsei
drwxr-xr-x 2 root root 4096 Aug 20 09:10 /var/log/shinsei`,
        },
        {
          type: "p",
          text: "`ls -ld` は、ディレクトリの中身ではなく、そのディレクトリ自身の権限を出す指定です。先頭が `d` なら、ディレクトリを表します。",
        },
        {
          type: "p",
          text: "この例では、`app.log` に所有グループの `w` があるので、`appuser` は追記できます。一方、ディレクトリに `w` を持つのは所有者の `root` だけです。`appuser` は新しいファイルを作れず、既存のファイルも消せません。",
        },
        {
          type: "table",
          headers: ["ディレクトリの権限", "できること"],
          rows: [
            ["`x`", "このディレクトリを通るパスで、その先のファイルを開ける"],
            ["`w`", "中身を書き換える。ファイルの作成、削除、リネーム"],
            ["`r`", "中のファイル名を一覧する（`ls`）"],
          ],
        },
        {
          type: "p",
          text: "ファイルの作成と削除には、`w` と `x` の両方が必要です。`x` はパスの途中のすべてのディレクトリで要るので、ファイル自身が読める権限でも、上位のディレクトリのどこかに `x` が無ければ、そのファイルは開けません。",
        },
        {
          type: "h2",
          text: "プロセスとリソースを見る",
        },
        {
          type: "table",
          headers: ["コマンド", "すること"],
          rows: [
            ["`ps aux | grep java | grep -v grep`", "Java のプロセスが起動しているかを見る"],
            ["`df -h`", "ディスクの空き容量を見る"],
            ["`free -h`", "メモリの空き容量を見る"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ディスクが埋まっていることがある",
          text: "ログが溜まり続けてディスクが埋まると、アプリがファイルへ書き込めなくなり、起動や処理そのものが失敗することがあります。原因が分からない障害では、`df -h` も見ておきましょう。",
        },
        {
          type: "h3",
          text: "ポートを使っているプロセスを探す",
        },
        {
          type: "p",
          text: "アプリを起動しようとして `Address already in use`（`BindException`）のようなエラーが出るときは、アプリが使おうとしたポートを、別のプロセスがすでに使っています。どのプロセスかを探しましょう。",
        },
        {
          type: "code",
          title: "例（ポート 8080 を使っているプロセスを見る）",
          lang: "text",
          code: `$ lsof -i :8080
COMMAND  PID    USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
java    1842 appuser   45u  IPv6 123456      0t0  TCP *:8080 (LISTEN)`,
        },
        {
          type: "p",
          text: "`lsof` が入っていない環境では、`ss` で代わりに調べられます。多くの Linux に標準で入っています。",
        },
        {
          type: "code",
          title: "例（同じことを ss で見る）",
          lang: "text",
          code: `$ ss -ltnp | grep 8080
LISTEN  0       100                    *:8080                *:*      users:(("java",pid=1842,fd=45))`,
        },
        {
          type: "p",
          text: "どちらも `PID`（プロセス ID）と `COMMAND`（コマンド名）が分かります。同じポートに、想定していない別プロセスが待ち受けていないかを確認しましょう。",
        },
        {
          type: "h3",
          text: "特定のファイルを使っているプロセスを探す",
        },
        {
          type: "p",
          text: "ファイルが削除できない、書き込めないというときは、どのプロセスがそのファイルを開いたままかを確認しましょう。ポートを調べたのと同じ `lsof` で、対象をファイル名に変えるだけです。",
        },
        {
          type: "code",
          title: "例（app.log を開いているプロセスを見る）",
          lang: "text",
          code: `$ lsof app.log
COMMAND  PID    USER   FD   TYPE DEVICE SIZE/OFF   NODE NAME
java    1842 appuser   8w   REG    8,1    48213 123457 app.log`,
        },
        {
          type: "callout",
          kind: "note",
          title: "削除したのに、ディスクの空きが増えない",
          text: "ログファイルを `rm` で消しても、そのファイルを開いたままのプロセスがあると、ディスクの空き容量はすぐには増えません。プロセスがファイルを閉じる（多くは再起動）まで、OS 内部では領域を確保したままになります。`lsof | grep deleted` で、削除済みなのに開いたままのファイルを探せます。`df -h` でディスクが埋まっているときは、これも疑いましょう。",
        },
        {
          type: "h3",
          text: "プロセスが呼んでいるシステムコールを見る",
        },
        {
          type: "p",
          text: "`strace` を使うのは、そのプロセスが実際に何をしようとしたのかが、アプリのログからは分からないときです。ログに例外とパスが出ているなら、まずその行を読みましょう。`strace` が向いているのは、次のような場面です。",
        },
        {
          type: "table",
          headers: ["こういうとき", "他のコマンドでは足りない理由"],
          rows: [
            ["ファイルを読めていないが、どのパスを開こうとしたのかがログに出ていない", "設定ファイルで分かるのは、開くはずのパスまで。アプリが実際に開いたパスは推測の域を出ない"],
            ["処理が返ってこない", "スレッドダンプで分かるのは、Java のどの行で止まっているかまで。どのファイルや接続先で待っているかは見えない"],
            ["設定の接続先は正しく見えるのに、アプリだけが外部につながらない", "`curl` や `nc` で分かるのは、自分の端末から相手へ届くかまで。アプリ自身がどこへつないでいるかは分からない"],
          ],
        },
        {
          type: "p",
          text: "実行中のプロセスに `strace` を付けると、そのプロセスが OS へ出している依頼（システムコール）が見えます。ファイルを開く、相手へつなぐといった操作は、どれも OS への依頼として通るので、アプリのログに出ていなくても確認できます。",
        },
        {
          type: "p",
          text: "付ける前に、対象の PID（プロセス ID）を上の `ps` で調べておきましょう。コマンドには次の 4 つを指定します。",
        },
        {
          type: "table",
          headers: ["指定", "すること"],
          rows: [
            ["`-p 1842`", "付ける相手を指定する。`1842` は `ps` で調べた PID"],
            ["`-f`", "そのプロセスの中のすべてのスレッドも対象にする"],
            ["`-e trace=file`", "ファイル関連のシステムコールだけに絞る"],
            ["`-s 256`", "パスなどの文字列が省略されないようにする"],
          ],
        },
        {
          type: "p",
          text: "`strace` は、そのサーバにインストールされていないことがあります（実行すると `command not found` になります）。アプリが別のユーザで動いているときは、root 権限も要ります。権限が足りないと `Operation not permitted` で失敗します。次の例で `sudo` を付けているのは、このためです。",
        },
        {
          type: "code",
          title: "例（どのファイルを開こうとしているかを見る）",
          lang: "text",
          code: `$ sudo strace -f -p 1842 -e trace=file -s 256
[pid 1842] openat(AT_FDCWD, "/opt/app/config/application.yml", O_RDONLY) = -1 ENOENT (No such file or directory)`,
        },
        {
          type: "table",
          headers: ["出力", "意味"],
          rows: [
            ["`openat`", "ファイルを開こうとしている"],
            ["`/opt/app/config/application.yml`", "探しているパス"],
            ["`= -1`", "失敗した。成功なら 0 以上の値が出る"],
            ["`ENOENT`", "失敗の理由。そのパスにファイルが無い"],
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "ENOENT は、正常なときもたくさん出る",
          text: "Java は、クラスパスに指定された場所を順に開こうとします。そこに無ければ `ENOENT` になるので、問題なく動いているプロセスでも `ENOENT` は何度も出ます。見るべきなのは、いま調べている処理が読むはずのファイルで `ENOENT` になっているかです。設定ファイルやエラーメッセージに書かれたパスと、出力のパスを見比べましょう。",
        },
        {
          type: "p",
          text: "接続先を見るときは、`-e trace=file` を `-e trace=network` に変えましょう。読み方は同じです。",
        },
        {
          type: "code",
          title: "例（どこへつなごうとしているかを見る）",
          lang: "text",
          code: `$ sudo strace -f -p 1842 -e trace=network -s 256
[pid 1842] connect(48, {sa_family=AF_INET, sin_port=htons(3306), sin_addr=inet_addr("10.0.2.31")}, 16) = -1 ECONNREFUSED (Connection refused)`,
        },
        {
          type: "table",
          headers: ["出力", "意味"],
          rows: [
            ["`connect`", "相手へつなごうとしている"],
            ["`sin_addr`", "つなごうとしている相手の IP アドレス"],
            ["`sin_port`", "つなごうとしているポート"],
            ["`ECONNREFUSED`", "失敗の理由。相手のホストまでは届いたが、そのポートで待ち受けが無いことが多い"],
          ],
        },
        {
          type: "p",
          text: "設定ファイルに書いたはずの接続先と、ここに出た IP アドレスやポートが違えば、読み込まれている設定が想定と違います。",
        },
        {
          type: "callout",
          kind: "note",
          title: "行が止まって見えるときは、絞り込みを外す",
          text: "`connect` は成功しているのに、そのあとの行が出ないときは、応答を待つ `poll` や `read` で止まっていることがあります。これらは `-e trace=network` の対象に入りません。`-e` を外して、すべてのシステムコールを見ましょう。",
        },
        {
          type: "callout",
          kind: "warn",
          title: "付けたままにしない",
          text: "`strace` を付けているあいだ、対象のプロセスは遅くなります。必要な行が出たら Ctrl+C で外しましょう。",
        },
        {
          type: "p",
          text: "ここで見たのは最低限です。ログの絞り込み、`strace` の集計、パケットキャプチャなど、組み合わせた実務向けのコマンドはチートシートにまとめています。",
          link: {
            label: "チートシート",
            to: "/cheatsheet",
          },
        },
        { type: "quiz", id: "ts-linux" },
        { type: "quiz", id: "ts-linux-user" },
      ],
    },
    {
      id: "http-server-log",
      title: "HTTP サーバのログを見る",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "手前に Apache や nginx がある構成では、ブラウザのリクエストが最初に届くのは HTTP サーバです。CSS や JS は、この手前の HTTP サーバがそのまま返すことが多く、Java まで届かないためアプリのログには出ません。",
        },
        {
          type: "ul",
          items: [
            "access.log（アクセスログ）… 届いた URL、ステータスコード、時刻。静的ファイルの 404 もここに残ることが多い",
            "error.log（エラーログ）… 設定ミス、後ろの Tomcat への接続失敗、SSL の問題",
          ],
        },
        {
          type: "table",
          headers: ["症状", "アプリログ", "HTTP サーバのログを見る理由"],
          rows: [
            ["HTML は 200、CSS / JS だけ 404", "一覧の INFO は出る", "静的ファイルは手前で返している。パスや alias / location のずれ"],
            ["ブラウザは 502", "無い、または少ない", "後ろのアプリに届いていない。後ろへの接続失敗（nginx でいう upstream 接続失敗）"],
            ["ブラウザは 503", "無いこともあれば、出ていることも", "手前で弾かれたか、アプリ自身の過負荷・メンテナンス。アプリのログも確認する"],
            ["操作したのにアプリログが無い", "無い", "手前で止まった、別ホストに振られた、静的だけ返した、など"],
            ["HTTPS の証明書エラー", "関係ないことが多い", "SSL 終端は、アプリより手前（HTTP サーバ、LB など）で行うことが多い"],
            ["URL は合っているのに 404", "無いことがある", "手前の location が別ディレクトリを見ている"],
          ],
        },
        {
          type: "code",
          title: "nginx の access.log の例（combined 形式）",
          highlightLines: [2],
          highlightKind: "error",
          code: `192.0.2.10 - - [16/Aug/2026:04:12:03 +0900] "GET /shinsei/requests HTTP/1.1" 200 5423 "-" "Mozilla/5.0 ..."
192.0.2.10 - - [16/Aug/2026:04:12:03 +0900] "GET /shinsei/css/app.css HTTP/1.1" 404 153 "-" "Mozilla/5.0 ..."
192.0.2.10 - - [16/Aug/2026:04:12:03 +0900] "GET /shinsei/js/app.js HTTP/1.1" 200 812 "-" "Mozilla/5.0 ..."`,
        },
        {
          type: "p",
          text: "3 行とも同じ接続元 IP・同じ時刻です。`/shinsei/css/app.css` への GET だけ 404 で、`/shinsei/requests` と `/shinsei/js/app.js` は 200 です。動的処理は Java に届いており、CSS だけ手前の設定がずれていると切り分けられます。出力先と書式は環境次第です。",
        },
        {
          type: "table",
          headers: ["部分", "意味"],
          rows: [
            ["`192.0.2.10`", "接続元 IP（先頭の項目）"],
            ["`[16/Aug/2026:04:12:03 +0900]`", "リクエストを受けた日時"],
            ["`\"GET /shinsei/css/app.css HTTP/1.1\"`", "HTTP メソッド・URL のパス・バージョン"],
            ["`404`", "ステータスコード"],
            ["`153`", "レスポンスのサイズ（バイト）"],
            ["`\"Mozilla/5.0 ...\"`", "User-Agent（ブラウザやツールの情報）"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "接続元 IP は NAT されていることがある",
          text: "先頭の IP は、あくまで HTTP サーバに直接つないできた相手のアドレスです。手前にロードバランサやリバースプロキシ、社内 NAT があると、ここに残るのはその機器の IP で、利用者本人の IP ではないことがあります。本来の送信元は `X-Forwarded-For` ヘッダに入っていることがありますが、詰め方は構成次第で、途中の機器が正しく引き継いでいるとは限りません。",
        },
        {
          type: "callout",
          kind: "note",
          title: "内蔵 Tomcat だけのとき",
          text: "Spring Boot を java -jar だけで動かし、手前に Apache / nginx が無い環境では、HTTP サーバ用のログはありません。静的ファイルもアプリが返すことが多く、切り分けは Network タブとアプリログで足りることが多いです。",
        },
        {
          type: "callout",
          kind: "tip",
          title: "複数台",
          text: "アプリが複数台で動き、手前にロードバランサがあると、ログは操作のたびに別のサーバ（インスタンス）に出ることがあります。まず、その操作を処理したサーバを特定してから読みましょう。",
        },
        { type: "quiz", id: "ts-http-log" },
      ],
    },
    {
      id: "net-check",
      title: "ネットワークの疎通確認",
      minutes: 16,
      blocks: [
        {
          type: "p",
          text: "Java のコードより手前や外側の経路を疑うのは、次のようなときです。",
        },
        {
          type: "ul",
          items: [
            "アプリのログにリクエストが無い",
            "ブラウザがタイムアウトする",
            "外部 API への接続エラーがログに出る",
          ],
        },
        {
          type: "p",
          text: "ここでは ping や curl などで、ホスト・ポート・HTTP のどこまで通るかを確認しましょう。",
        },
        {
          type: "h2",
          text: "TCP/IP と HTTP の層と対応する疎通確認コマンド",
        },
        {
          type: "p",
          text: "ブラウザの Network タブが見ているのは HTTP です。その下に TCP（ポートまで届くか）があり、さらに下に IP（ホストまで届くか）があります。コマンドごとに見ている層が違います。",
        },
        {
          type: "diagram",
          name: "protocol-stack",
          caption: "上ほどアプリに近い。下の層が通らなければ、上の HTTP も届きません。",
        },
        {
          type: "ul",
          items: [
            "ping … ホストが応答するか（ICMP。HTTP とは別）",
            "traceroute / tracert … 途中のどこで止まったか",
            "Test-NetConnection / nc / telnet … TCP でポートが開いているか",
            "curl … HTTP でパスまで届き、どんな応答が返るか",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "打つ場所で結果が変わる",
          text: "自分の PC からと、サーバからでは通る道が違います。ブラウザからは届くのに開発 PC からは届かない、サーバ上のアプリだけ外部 API に失敗するということもあります。再現に近い場所から打ちましょう。",
        },
        {
          type: "h2",
          text: "ホストまで届くか（ping）",
        },
        {
          type: "code",
          title: "例（検証用環境のホスト intranet.example.co.jp）",
          code: `# Windows（PowerShell または cmd）
ping intranet.example.co.jp

# Linux
ping -c 4 intranet.example.co.jp`,
        },
        {
          type: "code",
          title: "結果の例（Windows の日本語表示。統計の行は省略）",
          lang: "text",
          code: `# 応答がある
intranet.example.co.jp [10.20.30.40]に ping を送信しています 32 バイトのデータ:
10.20.30.40 からの応答: バイト数 =32 時間 =2ms TTL=58
10.20.30.40 からの応答: バイト数 =32 時間 =1ms TTL=58
10.20.30.40 からの応答: バイト数 =32 時間 =1ms TTL=58
10.20.30.40 からの応答: バイト数 =32 時間 =1ms TTL=58

# 要求がタイムアウト
intranet.example.co.jp [10.20.30.40]に ping を送信しています 32 バイトのデータ:
要求がタイムアウトしました。
要求がタイムアウトしました。
要求がタイムアウトしました。
要求がタイムアウトしました。

# 名前解決できない
ping 要求ではホスト intranet.example.co.jp が見つかりませんでした。ホスト名を確認してもう一度実行してください。`,
        },
        {
          type: "ul",
          items: [
            "応答がある … 名前解決でき、ホスト自体には届いている（ICMP が許可されている）",
            "要求がタイムアウト … ホストダウン、経路の遮断、ICMP が FW で拒否、など",
            "名前解決できない … DNS の設定や向き先を疑う",
          ],
        },
        {
          type: "p",
          text: "タイムアウトの例でも、1 行目に IP アドレス（10.20.30.40）が出ています。名前解決まではできていて、その先で応答が返っていないと分かります。",
        },
        {
          type: "p",
          text: "ping が通らなくても HTTP は通ることもあれば、逆に ping は通るがアプリのポートは閉じていることもあります。",
        },
        {
          type: "h2",
          text: "経路（traceroute）",
        },
        {
          type: "code",
          title: "例",
          code: `# Windows（ICMP が多い）
tracert intranet.example.co.jp

# Linux（環境により traceroute または tracepath。UDP が多い）
traceroute intranet.example.co.jp

# Linux：ICMP
traceroute -I intranet.example.co.jp

# Linux：TCP（申請くんの 8080 の例）
traceroute -T -p 8080 intranet.example.co.jp`,
        },
        {
          type: "code",
          title: "結果の例（Windows の日本語表示。途中で止まる場合）",
          lang: "text",
          code: `intranet.example.co.jp [10.20.30.40] へのルートをトレースしています
経由するホップ数は最大 30 です:

  1    <1 ms    <1 ms    <1 ms  192.168.10.1
  2     2 ms     1 ms     1 ms  10.10.0.1
  3     *        *        *     要求がタイムアウトしました。
  4     *        *        *     要求がタイムアウトしました。
  5     *        *        *     要求がタイムアウトしました。`,
        },
        {
          type: "p",
          text: "途中のホップが表示され、どこで * やタイムアウトが続くかを見ましょう。社内のどの境界で止まっているかの手がかりになります。この例では、2 つ目のホップ（10.10.0.1）までは応答があり、3 つ目から先が返っていません。",
        },
        {
          type: "p",
          text: "途中の 1 ホップだけが * でも、そのあとのホップや宛先（10.20.30.40）から応答があれば、その機器が応答を返さない設定なだけで、通信は先へ進んでいます。",
        },
        {
          type: "p",
          text: "何も指定しないと、Windows の tracert は ICMP、Linux の traceroute は UDP になることが多いです。プロトコルやポートは、オプションで変えられます。",
        },
        {
          type: "callout",
          kind: "note",
          title: "プロトコルとポートで経路が変わる",
          text: "ブラウザは HTTP を TCP で送ります。ポートは 80 や 443、8080 など、接続先で決まります。traceroute の既定が ICMP や UDP だと、見える経路が変わることがあります。途中の FW の許可だけでなく、ポリシーベースルーティングのように、プロトコルやポートで道を分ける制御もあります。HTTP と同じ TCP で経路を見るには、上の Linux の TCP の例（`traceroute -T -p 8080`）を使いましょう。Windows の tracert は ICMP のままなので、ポートまで届くかは次で確認しましょう。",
        },
        {
          type: "h2",
          text: "ポートまで開いているか（TCP）",
        },
        {
          type: "p",
          text: "申請くんの検証用環境はポート 8080 を使います。HTTP の前に、TCP で 8080 が開いているかを見ましょう。待ち受けが無い、別ポートで待ち受けている、FW で閉じている、などが分かれます。手前に Apache や nginx がある構成では、ブラウザのリクエストが最初に届くのは、その HTTP サーバのポートです。",
        },
        {
          type: "code",
          title: "例（ポート 8080）",
          code: `# Windows（PowerShell）
Test-NetConnection -ComputerName intranet.example.co.jp -Port 8080

# Linux（nc が入っている環境）
nc -zv intranet.example.co.jp 8080

# Linux / Windows（telnet クライアントが入っている場合）
telnet intranet.example.co.jp 8080`,
        },
        {
          type: "code",
          title: "結果の例（Test-NetConnection）",
          lang: "text",
          code: `# TCP 接続成功
ComputerName     : intranet.example.co.jp
RemoteAddress    : 10.20.30.40
RemotePort       : 8080
InterfaceAlias   : イーサネット
SourceAddress    : 192.168.10.23
TcpTestSucceeded : True

# TCP 接続失敗（ping は通っている）
警告: TCP connect to (10.20.30.40 : 8080) failed

ComputerName           : intranet.example.co.jp
RemoteAddress          : 10.20.30.40
RemotePort             : 8080
InterfaceAlias         : イーサネット
SourceAddress          : 192.168.10.23
PingSucceeded          : True
PingReplyDetails (RTT) : 1 ms
TcpTestSucceeded       : False`,
        },
        {
          type: "code",
          title: "結果の例（nc）",
          lang: "text",
          code: `# TCP 接続成功
Connection to intranet.example.co.jp (10.20.30.40) 8080 port [tcp/http-alt] succeeded!

# 接続拒否
nc: connect to intranet.example.co.jp (10.20.30.40) port 8080 (tcp) failed: Connection refused

# タイムアウト
nc: connect to intranet.example.co.jp (10.20.30.40) port 8080 (tcp) failed: Connection timed out`,
        },
        {
          type: "p",
          text: "これは Ubuntu などに入っている nc の表示です。RHEL 系の Linux では、`nc` と打つと中身は ncat で、表示が違います。成功なら `Ncat: Connected to 10.20.30.40:8080.`、接続拒否なら `Ncat: Connection refused.`、タイムアウトなら `Ncat: TIMEOUT.` と出ます。",
        },
        {
          type: "ul",
          items: [
            "TCP 接続成功 … そのポートで何かが待ち受けている。アプリ未起動ならすぐ切れることもある",
            "接続拒否（connection refused）… ホストまでは届いたが、そのポートで待ち受けが無いことが多い。FW が拒否を返す設定でも同じ表示になる",
            "タイムアウト … FW、ルータ、セキュリティグループ、経路のどこかで止まっていることが多い",
          ],
        },
        {
          type: "p",
          text: "Test-NetConnection は、接続拒否でもタイムアウトでも `TcpTestSucceeded : False` になります。拒否ならすぐに、タイムアウトなら数十秒待ってから結果が出るので、待ち時間で見分けましょう。nc なら、拒否とタイムアウトがメッセージで分かれます。",
        },
        {
          type: "h2",
          text: "HTTP まで届くか（curl）",
        },
        {
          type: "p",
          text: "TCP が通っても、URL パスやコンテキストパスが違えば HTTP は 404 になります。curl はブラウザに近い形で HTTP を送れます。",
        },
        {
          type: "code",
          title: "例（申請一覧）",
          code: `# ヘッダだけ見る（本文は捨てる）
# Windows PowerShell では curl.exe と打つ（curl だけだと Invoke-WebRequest の別名になる）
curl -I http://intranet.example.co.jp:8080/shinsei/requests

# 詳細（手前の HTTP サーバが HTTPS で受ける構成の例。-k は TLS 証明書の検証を緩める指定で、社内検証のみ）
curl -vk https://intranet.example.co.jp/shinsei/requests`,
        },
        {
          type: "code",
          title: "結果の例（curl -I。ヘッダは抜粋）",
          lang: "text",
          code: `# 申請一覧（ログインしていないので、ログイン画面へ 302）
$ curl -I http://intranet.example.co.jp:8080/shinsei/requests
HTTP/1.1 302
Set-Cookie: JSESSIONID=3F2A9C1E7B4D8A05C6E1F0B29D7A4C18; Path=/shinsei; HttpOnly
Location: http://intranet.example.co.jp:8080/shinsei/login
Content-Length: 0

# コンテキストパスの打ち間違い（shinse）
$ curl -I http://intranet.example.co.jp:8080/shinse/requests
HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en`,
        },
        {
          type: "p",
          text: "1 行目のステータスコードで、HTTP まで届いたかが分かります。申請くんでは、ログインしていないと 302 でログイン画面へ転送されます。302 が返れば、アプリまでは届いています。",
        },
        {
          type: "ul",
          items: [
            "200 や 302 … HTTP までは届き、アプリか前段の HTTP サーバが応答した",
            "404 … 届いているがパスやマッピングが違う",
            "接続できない / タイムアウト … TCP 以前、または TLS・プロキシの手前。curl 自身のエラーメッセージも手がかりになる",
            "ブラウザだけ失敗 … Cookie、プロキシ設定、別ネットワークからのアクセス制限も疑う",
          ],
        },
        {
          type: "p",
          text: "HTTP の応答すら返らないときは、curl 自身が出すエラーメッセージ（よくある例）で、どこまで届いていないかが分かります。",
        },
        {
          type: "table",
          headers: ["curl のエラーメッセージ（よくある例）", "疑うこと"],
          rows: [
            ["`Could not resolve host`", "DNS で名前が引けない。ホスト名の綴り、DNS サーバ、hosts ファイル（Windows は `C:\\Windows\\System32\\drivers\\etc\\hosts`、Linux / macOS は `/etc/hosts`）を疑う"],
            ["`Connection refused`", "ホストまでは届いたが、指定したポートで待ち受けが無いことが多い。そのポートを待ち受けるはずのプロセス（アプリや HTTP サーバ）が未起動、またはポート番号違いを疑う"],
            ["`Connection timed out`", "応答が返ってこない。FW やセキュリティグループで止められていることが多い"],
            ["`SSL certificate problem` / `SSL connect error`", "TLS 証明書や設定の問題。証明書の期限切れ、ホスト名不一致、社内 CA が信頼されていない、など"],
            ["`Empty reply from server`", "TCP はつながったが、HTTP の応答が無いまま切れた。別プロトコルが動いている、アプリのプロセスが処理中に終了した、など"],
          ],
        },
        {
          type: "h2",
          text: "アプリから外部への疎通",
        },
        {
          type: "p",
          text: "ここまでは、ブラウザや開発 PC から申請くんへ向けての疎通でした。同じコマンドを、申請くんが動いているサーバから外部のシステムへ向けて打つこともあります。「外部 API への接続エラーがログに出る」というときは、この向きで確認しましょう。打つ場所は申請くんのサーバ、向き先は外部システムのホスト・ポートです。ping → TCP → curl の順は同じです。",
        },
        {
          type: "code",
          title: "例（申請くんのサーバから、外部の通知 API へ）",
          code: `# 申請くんのサーバにログインしてから実行

ping notify.example.internal

Test-NetConnection -ComputerName notify.example.internal -Port 443
# Linux: nc -zv notify.example.internal 443

curl -I https://notify.example.internal/api/send`,
        },
        {
          type: "p",
          text: "ping と TCP の確認は、HTTP に限らず使えます。DB も TCP で通信するので、同じ手順で打てます。変わるのは、その先の確認方法だけです。HTTP なら curl ですが、DB なら `mysql` のようなクライアントで確認します（「ミドルウェアとコンテナの確認」）。",
        },
        {
          type: "p",
          text: "開発 PC からは通っても、サーバからは FW で閉じていることがあります。向き先だけでなく、打つ場所もアプリサーバに合わせましょう。外部への接続がどんな症状やログに出るかは、「トラブル例：外部システム / 外部 API」で詳しく見ます。",
        },
        {
          type: "h2",
          text: "結果から切り分ける",
        },
        {
          type: "table",
          headers: ["結果の型", "よくある意味", "次に見るもの"],
          rows: [
            ["ping 不可", "DNS、ホスト停止、ICMP 拒否", "名前解決、別経路からの ping、ICMP 以外の確認"],
            ["ping 可、TCP 不可", "ポート閉鎖、待ち受けが無い、FW", "HTTP サーバやアプリがそのポートで待ち受けているか、FW ルール、LB の向き先"],
            ["TCP 可、curl で HTTP エラー", "パス違い、コンテキストパス、リダイレクト", "URL、server.servlet.context-path、Controller のマッピング"],
            ["curl 可、ブラウザだけ不可", "クライアント側の設定差", "プロキシ、VPN、Cookie、別マシンからの再現"],
            ["すべて可、ログだけ無い", "別インスタンス、別ログファイル", "LB の振り分け、ログの出力先"],
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "1 つ成功ですべて OK ではない",
          text: "ping が通ったから HTTP も通る、TCP が通ったから業務的に正しい応答が返る、とは限りません。層ごとに確認し、最後に Network タブやアプリログと突き合わせましょう。",
        },
        { type: "quiz", id: "ts-net-check" },
      ],
    },
    {
      id: "middleware-check",
      title: "ミドルウェアとコンテナの確認",
      minutes: 9,
      blocks: [
        {
          type: "p",
          text: "ネットワークが通っていても、DB やコンテナ、外部の Tomcat・HTTP サーバ自体に問題があることがあります。ここでは、その切り分け方を見ます。",
        },
        {
          type: "h2",
          text: "DB へ直接つないでみる",
        },
        {
          type: "p",
          text: "アプリの接続エラーについて、DB 自体の問題か、アプリ側の接続設定の問題かを切り分けます。アプリが動いているサーバから、DB のクライアントで直接つないでみましょう。",
        },
        {
          type: "code",
          title: "例（MySQL、つながるとき）",
          lang: "text",
          code: `$ mysql -h ホスト名 -u ユーザ名 -p -e "SELECT 1"
Enter password:
+---+
| 1 |
+---+
| 1 |
+---+`,
        },
        {
          type: "p",
          text: "結果が返るか、どのエラーで止まるかで、疑う先が変わります。",
        },
        {
          type: "code",
          title: "例（MySQL、つながらないとき）",
          lang: "text",
          code: `$ mysql -h ホスト名 -u ユーザ名 -p -e "SELECT 1"
Enter password:
ERROR 2003 (HY000): Can't connect to MySQL server on 'ホスト名:3306' (110)`,
        },
        {
          type: "ul",
          items: [
            "`SELECT 1` の結果が返る … DB 自体は動いている。アプリ側の接続設定（URL、ユーザ、パスワード）を疑う",
            "`ERROR 2003` など、TCP 自体がつながらないエラー … DB が停止している、ポートが閉じている。「ネットワークの疎通確認」で TCP から確認する",
            "`ERROR 1045` など、認証で失敗するエラー（Access denied） … ユーザ名やパスワードが違う。DB 側のアカウント設定を確認する",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "DB は動くがアプリが待つ",
          text: "DB 自体には直接つながるのに、アプリからは待たされるというときは、コネクションプールの枯渇が疑われます。設定した最大接続数と、今使われている接続数を確認しましょう。",
        },
        {
          type: "h2",
          text: "コンテナ自体が動いているか",
        },
        {
          type: "p",
          text: "Docker や Kubernetes で動かしている構成では、アプリのコンテナ自体が起動していない、または起動と停止を繰り返していることがあります。",
        },
        {
          type: "code",
          title: "例（Docker）",
          lang: "text",
          code: `$ docker ps
CONTAINER ID   IMAGE             COMMAND                  CREATED       STATUS                         PORTS                     NAMES
1a2b3c4d5e6f   shinsei-kun-app   "java -Duser.timezon…"   2 hours ago   Up 2 hours                     0.0.0.0:8080->8080/tcp   shinsei-kun-app-1
7f8e9d0c1b2a   mysql:8.0         "docker-entrypoint.s…"   2 hours ago   Restarting (1) 5 seconds ago                             shinsei-kun-db-1`,
        },
        {
          type: "code",
          title: "例（Kubernetes）",
          lang: "text",
          code: `$ kubectl get pods
NAME                       READY   STATUS             RESTARTS   AGE
shinsei-7d8f9c6b5d-abcde   0/1     CrashLoopBackOff   7          12m`,
        },
        {
          type: "ul",
          items: [
            "Docker の `STATUS` が `Up` 以外（`Restarting` など）… 起動直後に終了している可能性",
            "Kubernetes の `STATUS` が `CrashLoopBackOff` … 起動に失敗して再起動を繰り返している",
            "`RESTARTS`（Kubernetes）の回数が多い … 終了と再起動を繰り返している可能性",
          ],
        },
        {
          type: "p",
          text: "コンテナが起動と停止を繰り返していると、アプリのログが急に途切れる、操作したのにログが無いといった症状に見えることがあります。コンテナが作られていなければ、そのコンテナのアプリログもありません。ログの出力先の確認方法は、後の章の「アプリログの場所と読み方」で扱います。",
          link: {
            label: "アプリログの場所と読み方",
            to: "/tracks/troubleshoot/logs",
          },
        },
        {
          type: "h2",
          text: "外部の Tomcat や HTTP サーバが動いているか",
        },
        {
          type: "p",
          text: "Docker や Kubernetes を使わない構成では、外部の Tomcat や、その手前の nginx / Apache などが、それぞれ別のプロセス・サービスとして動いています。アプリのコードや DB に問題が無くても、これらが止まっていれば同じような症状に見えます。",
        },
        {
          type: "p",
          text: "Spring Boot を内蔵 Tomcat だけで動かしている構成では、Java プロセス自体がサーブレットコンテナなので、ここは「プロセスとリソースを見る」で確認したものと同じです。",
        },
        {
          type: "code",
          title: "例（Linux、systemd を使う環境。動いているとき）",
          lang: "text",
          code: `$ systemctl status nginx
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled)
   Active: active (running) since Mon 2026-08-31 09:12:03 JST; 3h ago
 Main PID: 1234 (nginx)
    Tasks: 3 (limit: 4915)
   CGroup: /system.slice/nginx.service
           ├─1234 nginx: master process /usr/sbin/nginx
           └─1235 nginx: worker process`,
        },
        {
          type: "p",
          text: "`Active: active (running)` なら動いています。`inactive (dead)` や `failed` なら止まっています。止まっていれば、リクエストはアプリまで届かず、アプリのログにも何も残りません。",
        },
        {
          type: "code",
          title: "例（サービス名が違うとき）",
          lang: "text",
          code: `$ systemctl status tomcat
Unit tomcat.service could not be found.`,
        },
        {
          type: "p",
          text: "ここでの `nginx` `tomcat` はサービス名の例で、実際の名前は環境によって違います（`tomcat9` など）。`Unit ... could not be found` と出た場合は、止まっているのではなく名前が違うだけのことが多いです。正しいユニット名を探すには、`systemctl list-unit-files --type=service` の出力を `grep` で絞り込みましょう。動いていないサービスも含めて、登録されているユニットが一覧できます。",
        },
        {
          type: "code",
          title: "例（サービス名の一部で絞り込む）",
          lang: "text",
          code: `$ systemctl list-unit-files --type=service | grep -i tomcat
tomcat9.service                            enabled`,
        },
        {
          type: "p",
          text: "`enabled` は起動時に自動起動する設定で、今動いているかどうかとは別です。名前が分かったら `systemctl status tomcat9` のように、その名前で改めて Active の行を確認しましょう。",
        },
        {
          type: "p",
          text: "nginx や Tomcat のようなミドルウェアが、systemd のサービスとして登録されていない環境もあります。その場合は `systemctl` 側にユニット自体が無いので、`list-unit-files` で探しても見つかりません。そのときは「Linux の基本操作」で見た `ps` に、探したいプロセス名（`tomcat` や `nginx`）を渡して、プロセスが実際に動いているかを直接確認しましょう。ただし `ps` に出るのは今動いているプロセスだけです。見つからなければ、名前ではなく、そもそも止まっている可能性を疑いましょう。",
        },
        { type: "quiz", id: "ts-middleware" },
      ],
    },
  ],
};
