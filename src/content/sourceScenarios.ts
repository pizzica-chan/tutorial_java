import type { Lesson } from "../types";

export const sourceScenarios: Lesson[] = [
  {
    id: "shared-state",
    title: "[障害調査] 同時に検索すると、別の利用者の検索条件で結果が出る",
    minutes: 12,
    blocks: [
      {
        type: "callout",
        kind: "tip",
        title: "申請くんで試すには",
        text: "このシナリオを申請くんで試すには、いつもと違う起動方法が要ります。手順は、末尾の「手元で再現するには」にあります。",
      },
      {
        type: "h2",
        text: "シナリオ",
      },
      {
        type: "p",
        text: "申請の検索で、山田が件名に「休暇」を指定したのに、「交通費」の申請が表示された。ちょうど同じ時刻に、佐藤が「交通費」を検索していた。山田が参照できる申請の範囲は変わらず、件名の条件だけが変わっている。",
      },
      {
        type: "h2",
        text: "いま分かっていること",
      },
      {
        type: "ul",
        items: [
          "山田が検索したとき、Network タブのクエリは `title=休暇`",
          "検索のステータスコードは 200。画面にも、サーバのログにも例外は無い",
          "山田が 1 人で検索すると、「休暇」の申請だけが出て再現しない",
          "表示された結果は、佐藤の検索条件に合う申請。山田が参照できない申請は混ざっていない",
        ],
      },
      {
        type: "h2",
        text: "先に見ること",
      },
      {
        type: "p",
        text: "画面から送った条件は `title=休暇` で、正しく届いています。条件が変わったのは、サーバの中です。単独では再現しないことから、別のリクエストと同時に動いたときだけ起きる問題を疑いましょう。Controller に届いた値と、SQL に渡った値を、スレッドごとに比べます。",
      },
      {
        type: "h2",
        text: "原因の追跡",
      },
      {
        type: "h3",
        text: "Controller に届いた値と SQL の値を比較する",
      },
      {
        type: "p",
        text: "`InvestigationController.search` から `InvestigationService.search` へ進みましょう。次は、山田と佐藤の検索が重なった時刻のログです。スレッド名と時刻で、二人の操作を区別します。",
      },
      {
        type: "code",
        title: "操作が重なったときのサーバログ（申請くん・再現用の機能を有効にした起動・抜粋）",
        code: `04:12:03.100 DEBUG [nio-8080-exec-1] j.c.e.s.service.InvestigationService : search user=7 title=休暇
04:12:03.200 DEBUG [nio-8080-exec-2] j.c.e.s.service.InvestigationService : search user=3 title=交通費
04:12:03.300 DEBUG [nio-8080-exec-1] j.c.e.s.m.R.searchHistory : ==> Parameters: 7(Long), 7(Long), 交通費(String)`,
      },
      {
        type: "p",
        text: "Service の引数は「休暇」ですが、SQL の件名条件は「交通費」です。`userId` は山田の 7 のままで、件名だけが佐藤の条件に変わっています。フォームの `name` の不一致では説明できません。Service の中で、件名をどこへ保存し、どこから読んでいるかを確認しましょう。",
      },
      {
        type: "code",
        title: "InvestigationService.search（申請くん）",
        lang: "java",
        code: `private String searchTitle;

public List<RequestEntity> search(Long userId, String title) {
  searchTitle = title;
  log.debug("search user={} title={}", userId, title);
  beforeSearch();
  return requestMapper.searchHistory(userId, searchTitle, null, null, null);
}`,
      },
      {
        type: "h3",
        text: "代入と読み取りの間に別のリクエストが入る",
      },
      {
        type: "p",
        text: "この Service は、Spring が生成・管理するオブジェクトである Bean として登録されています。既定のスコープはシングルトン（singleton）で、複数のリクエストが同じインスタンスを使います。`searchTitle` はそのインスタンスのフィールドなので、複数のリクエストが同じ保存場所を読み書きします。",
      },
      {
        type: "p",
        text: "山田が代入したあと、佐藤が同じフィールドを上書きすると、山田の SQL に佐藤の条件が渡ります。`userId` は引数のままなので、参照できる申請の範囲は変わりません。",
      },
      {
        type: "table",
        headers: ["順序", "山田の処理", "佐藤の処理", "フィールドの値"],
        rows: [
          ["1", "休暇を代入", "", "休暇"],
          ["2", "一時停止", "交通費を代入", "交通費"],
          ["3", "フィールドを SQL に渡す", "", "交通費"],
        ],
      },
      {
        type: "p",
        text: "複数のスレッドから同時に使われても、処理の順序によって値が混ざったり、結果が壊れたりせず、正しく動く性質をスレッドセーフと呼びます。この検索処理は、山田と佐藤の処理が重なると別の検索条件を使ってしまうので、スレッドセーフではありません。",
      },
      {
        type: "p",
        text: "シングルトンであること自体が問題なのではありません。問題は、リクエストごとの検索条件を、複数のスレッドが読み書きするフィールドに保存していることです。この処理では、引数の `title` をそのまま Mapper へ渡せば、共有フィールドを経由せず、それぞれの検索条件を使えます。",
      },
      {
        type: "h2",
        text: "このシナリオの要点",
      },
      {
        type: "ul",
        items: [
          "リクエストごとの検索条件を、singleton の Service のフィールドへ保存すると、同時に動く別のリクエストの値で上書きされる",
          "修正するなら、フィールドを使わず、引数の `title` をそのまま Mapper へ渡すか、ローカル変数に入れて渡す。`volatile` にしても、リクエストごとの値は分けられない",
        ],
      },
      {
        type: "h2",
        text: "調査の流れの振り返り",
      },
      {
        type: "investigation-flow",
        items: [
          "Network タブで、山田が送った件名の条件は正しいことを確認",
          "サーバログで、山田の Service の引数は「休暇」、SQL の件名条件は「交通費」と食い違うことを確認",
          "`InvestigationService.search` に、件名を保存するフィールド `searchTitle` を発見",
          "Service が singleton で、同じインスタンスを複数のリクエストが使うことを確認",
          "山田の代入と読み取りの間に、佐藤の代入が入る順序を、デバッガで重ねて再現",
          "共有フィールドの上書きが原因と特定",
        ],
      },
      { type: "quiz", id: "sc-shared-state" },
      {
        type: "h2",
        text: "手元で再現するには",
        aside: "hands-on",
      },
      {
        type: "p",
        text: "ここからは、シナリオの中の出来事ではなく、申請くんを手元で動かして、このシナリオを試すための手順です。普通に起動しただけでは、このシナリオで使う再現用の画面と処理は有効になりません。有効にするには、起動するときにプロファイルを指定します。プロファイルは、起動時に使う設定や部品を選ぶ名前です。ここでは通常の設定である `dev` に加えて、再現用の部品を有効にする `investigation` を指定します。",
      },
      {
        type: "p",
        text: "Docker を起動し、端末で `shinsei-kun` ディレクトリへ移動しましょう。通常の app コンテナが起動している場合は、先に `docker compose stop app` で 8080 番ポートを空けます。そのあと次を実行します。DB は Compose が起動します。",
      },
      {
        type: "code",
        title: "再現用の機能を有効にして起動する",
        lang: "bash",
        code: `docker compose run --build --service-ports -e SPRING_PROFILES_ACTIVE=dev,investigation app`,
      },
      {
        type: "p",
        text: "ブラウザで `http://localhost:8080/shinsei/login` を開き、山田（`yamada`）でログインしましょう。パスワードは `password` です。ログイン後に `http://localhost:8080/shinsei/investigation` を開くと、再現用の画面が表示されます。佐藤は `sato`、パスワードは同じです。山田の ID は 7、佐藤の ID は 3 です。",
      },
      {
        type: "p",
        text: "このシナリオでは、二つの検索を重ねる必要があります。別の Chrome プロファイルで佐藤をログインさせ、Cookie を分けましょう。同じプロファイルのタブを増やすだけでは、ログイン状態を分けられません。手動では、二つの検索が重なる瞬間を偶然にしか作れません。確実に再現するには、デバッガを使います。",
      },
      {
        type: "p",
        text: "デバッガを使う場合は、上のコマンドの代わりに次を実行しましょう。IDE から localhost の 5005 番へ接続します。",
      },
      {
        type: "code",
        title: "デバッガから接続できる状態で起動する",
        lang: "bash",
        code: `docker compose run --build --service-ports -e SPRING_PROFILES_ACTIVE=dev,investigation -e "JAVA_TOOL_OPTIONS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005" -p 127.0.0.1:5005:5005 app`,
      },
      {
        type: "p",
        text: "山田は「休暇」、佐藤は「交通費」を検索フォームに入力しましょう。`beforeSearch` にブレークポイントを置き、停止する範囲は現在のスレッドだけにしましょう。山田の検索を止めたあと、ブレークポイントを一時的に無効にして佐藤の検索を実行します。佐藤の応答が返ってから山田の検索を再開すると、山田の結果にも「交通費」の条件が使われます。",
      },
    ],
  },
  {
    id: "self-invocation",
    title: "[障害調査] 一括登録が失敗したのに、最初の申請だけ残る",
    minutes: 12,
    blocks: [
      {
        type: "callout",
        kind: "tip",
        title: "申請くんで試すには",
        text: "このシナリオを申請くんで試すには、いつもと違う起動方法が要ります。手順は、末尾の「手元で再現するには」にあります。",
      },
      {
        type: "h2",
        text: "シナリオ",
      },
      {
        type: "p",
        text: "申請者の山田から、「一括登録がエラーになったのに、最初の申請だけ登録されている」と報告があった。一括登録は、すべての申請を登録するか、失敗したら全部取り消す仕様である。件名「一括調査用」と空の件名を送ると、件名のチェックでエラーになるが、最初の申請は DB に残った。",
      },
      {
        type: "h2",
        text: "いま分かっていること",
      },
      {
        type: "ul",
        items: [
          "POST はサーバへ届き、2 件目の空の件名で `IllegalArgumentException` が発生している",
          "Network タブの応答はエラー。ただし最初の INSERT は実行済み",
          "DB に件名「一括調査用」のレコードが 1 件残っている（取り消されていない）",
          "保存する Java メソッドには `@Transactional` が付いている",
          "手元で、再現用の機能を有効にして起動している。ログは DEBUG",
        ],
      },
      {
        type: "h2",
        text: "先に見ること",
      },
      {
        type: "p",
        text: "例外が出たのに INSERT が残るのは、取り消しの仕組みであるトランザクションが働いていないときです。`@Transactional` が付いていても、トランザクションが実際に開始されたとは限りません。この Service は、開始されたかをログに出しているので、確かめましょう。",
      },
      {
        type: "p",
        text: "山田でログインし、`/shinsei/investigation` を開きましょう。この画面を開いたまま、開発者ツールの Console で次のコードを実行しましょう。コードは、画面のフォームに含まれる CSRF トークンを読み取り、一括登録のリクエストに付けて送信します。",
      },
      {
        type: "code",
        title: "Console から一括登録を送る",
        lang: "javascript",
        code: `const token = document.querySelector('input[name="_csrf"]').value;
await fetch('/shinsei/investigation/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
  body: JSON.stringify({ approverId: 3, titles: ['一括調査用', ''] })
});`,
      },
      {
        type: "p",
        text: "Network タブの応答とサーバログを確認し、DB で件名を検索しましょう。再試行すると最初の申請が追加されます。毎回、ID と件数を記録して区別します。",
      },
      {
        type: "code",
        title: "登録結果を確認する SQL",
        lang: "sql",
        code: `SELECT id, title, applicant_id FROM t_request
WHERE title = '一括調査用' ORDER BY id;`,
      },
      {
        type: "h2",
        text: "原因の追跡",
      },
      {
        type: "h3",
        text: "トランザクションが開始されたか確認する",
      },
      {
        type: "code",
        title: "サーバログ（申請くん・再現用の機能を有効にした起動・抜粋）",
        code: `j.c.e.s.service.InvestigationService : batch transactionActive=false
j.c.e.s.mapper.RequestMapper.insert : ==>  Preparing: INSERT INTO t_request ...
java.lang.IllegalArgumentException: 件名は必須です`,
      },
      {
        type: "p",
        text: "`transactionActive=false` は、この処理で Spring が管理するトランザクションが開始されていないことを示します。`IllegalArgumentException` は実行時例外なので、Spring の `@Transactional` の既定の設定ではロールバックの対象です。ロールバックの条件を調べる前に、入口から呼び出しを辿りましょう。",
      },
      {
        type: "code",
        title: "InvestigationService（申請くん）",
        lang: "java",
        code: `public void submitBatch(Long userId, Long approverId, List<String> titles) {
  saveBatch(userId, approverId, titles);
}

@Transactional
public void saveBatch(Long userId, Long approverId, List<String> titles) {
  log.debug("batch transactionActive={}",
      TransactionSynchronizationManager.isActualTransactionActive());
  for (String title : titles) {
    if (title == null || title.isBlank()) {
      throw new IllegalArgumentException("件名は必須です");
    }
    requestService.create(userId, title, approverId);
  }
}`,
      },
      {
        type: "h3",
        text: "同じインスタンス内の呼び出しを見つける",
      },
      {
        type: "p",
        text: "Controller が呼ぶのは、アノテーションの無い `submitBatch` です。そこから `saveBatch` を同じインスタンス内で呼んでいます。Spring の通常のプロキシ方式では、`@Transactional` の付いた Java メソッドを Bean の外から呼んだときに、プロキシがトランザクションを開始します。この内部呼び出しはプロキシを通らず、`saveBatch` のアノテーションによるトランザクションは開始されません。",
      },
      {
        type: "p",
        text: "`RequestService.create` にもトランザクションの指定はありません。この構成では最初の INSERT が確定し、次の件名で例外になっても、まとめて取り消すトランザクションがありません。これが一部だけ残った原因です。",
      },
      {
        type: "callout",
        kind: "trap",
        title: "内部呼び出しでも、既に始まったトランザクションは続く",
        text: "呼び出し元にトランザクションがあれば、その中で内部の Java メソッドも動きます。「内部呼び出しは常にトランザクションの外」ではありません。この例では、入口の `submitBatch` にもトランザクションが無いことを確認しました。",
      },
      {
        type: "h2",
        text: "このシナリオの要点",
      },
      {
        type: "ul",
        items: [
          "`@Transactional` によるトランザクション管理は、プロキシを通った呼び出しにだけ適用される。同じインスタンス内の呼び出しでは、トランザクションは開始されない",
          "修正するなら、外から呼ばれる `submitBatch` に `@Transactional` を付けて、一括処理全体を囲む。1 件ごとに確定する方法では、一括処理の仕様を満たさない",
        ],
      },
      {
        type: "h2",
        text: "調査の流れの振り返り",
      },
      {
        type: "investigation-flow",
        items: [
          "Network タブの応答と DB で、例外が出たのに最初の申請が残っていることを確認",
          "サーバログで、`transactionActive=false`、つまりトランザクションが開始されていないことを確認",
          "Controller が呼ぶ `submitBatch` に、`@Transactional` が付いていないことを確認",
          "`submitBatch` から、同じインスタンスの `saveBatch` を呼んでいることを確認",
          "内部呼び出しはプロキシを通らず、`saveBatch` の `@Transactional` が効かないことを確認",
          "`RequestService.create` にもトランザクションが無く、最初の INSERT を取り消す単位が無かったと特定",
        ],
      },
      { type: "quiz", id: "sc-self-invocation" },
      {
        type: "h2",
        text: "手元で再現するには",
        aside: "hands-on",
      },
      {
        type: "p",
        text: "ここからは、シナリオの中の出来事ではなく、申請くんを手元で動かして、このシナリオを試すための手順です。普通に起動しただけでは、このシナリオで使う再現用の画面と処理は有効になりません。有効にするには、起動するときにプロファイルを指定します。プロファイルは、起動時に使う設定や部品を選ぶ名前です。ここでは通常の設定である `dev` に加えて、再現用の部品を有効にする `investigation` を指定します。",
      },
      {
        type: "p",
        text: "Docker を起動し、端末で `shinsei-kun` ディレクトリへ移動しましょう。通常の app コンテナが起動している場合は、先に `docker compose stop app` で 8080 番ポートを空けます。そのあと次を実行します。DB は Compose が起動します。",
      },
      {
        type: "code",
        title: "再現用の機能を有効にして起動する",
        lang: "bash",
        code: `docker compose run --build --service-ports -e SPRING_PROFILES_ACTIVE=dev,investigation app`,
      },
      {
        type: "p",
        text: "ブラウザで `http://localhost:8080/shinsei/login` を開き、山田（`yamada`）でログインしましょう。パスワードは `password` です。ログイン後に `http://localhost:8080/shinsei/investigation` を開くと、再現用の画面が表示されます。Console の例で承認者に指定している ID 3 は、佐藤です。",
      },
    ],
  },
  {
    id: "list-n-plus-one",
    title: "[障害調査] 申請が多い利用者だけ、一覧表示が遅い",
    minutes: 10,
    blocks: [
      {
        type: "callout",
        kind: "tip",
        title: "申請くんで試すには",
        text: "このシナリオを申請くんで試すには、いつもと違う起動方法が要ります。手順は、末尾の「手元で再現するには」にあります。",
      },
      {
        type: "h2",
        text: "シナリオ",
      },
      {
        type: "p",
        text: "申請の多い利用者から、「一覧表示だけ遅い」と相談があった。対象は、申請者名付きの一覧 `/shinsei/investigation/list` である。画面にエラーは出ていない。",
      },
      {
        type: "h2",
        text: "いま分かっていること",
      },
      {
        type: "ul",
        items: [
          "申請が多い利用者の一覧だけが遅い。申請が少ない利用者は遅くない",
          "画面にエラーは出ておらず、申請者名も正しく表示されている",
          "一覧を開くたびに再現する",
          "SQL の回数が増えているのか、一つの SQL が遅いのかはまだ分からない",
        ],
      },
      {
        type: "h2",
        text: "先に見ること",
      },
      {
        type: "p",
        text: "一覧が遅い原因は、Java の処理や JSON への変換などにもあります。DB が原因なら、一つの SQL が遅いのか、SQL の回数が多いのかを切り分けます。Network タブで GET の所要時間を確認し、操作時刻の MyBatis の DEBUG ログで、SQL の文と実行回数を確認しましょう。",
      },
      {
        type: "p",
        text: "申請くんの初期データでは、申請の件数が少ないため、一覧がすぐに表示されることがあります。この場合も、ログで SQL の実行回数を確認しましょう。",
      },
      {
        type: "h2",
        text: "原因の追跡",
      },
      {
        type: "h3",
        text: "同じ SQL が繰り返されている",
      },
      {
        type: "code",
        title: "操作時刻の SQL ログ（申請くん・再現用の機能を有効にした起動・抜粋）",
        code: `j.c.e.s.m.R.findMineWithoutNames : ==>  Preparing: SELECT id, title, ... FROM t_request ...
j.c.e.s.m.R.findMineWithoutNames : <==      Total: 4
j.c.e.s.mapper.UserMapper.findById : ==>  Preparing: SELECT id, username, ... FROM t_user WHERE id = ?
j.c.e.s.mapper.UserMapper.findById : ==> Parameters: 7(Long)
j.c.e.s.mapper.UserMapper.findById : ==>  Preparing: SELECT id, username, ... FROM t_user WHERE id = ?
j.c.e.s.mapper.UserMapper.findById : ==> Parameters: 7(Long)
...（申請ごとに繰り返す）`,
      },
      {
        type: "p",
        text: "一覧検索のあと、申請者の検索が繰り返されています。`UserMapper.findById` の参照検索から呼び出し元を辿りましょう。",
      },
      {
        type: "code",
        title: "InvestigationService.listWithNames（申請くん）",
        lang: "java",
        code: `public List<RequestEntity> listWithNames(Long userId) {
  List<RequestEntity> requests = requestMapper.findMineWithoutNames(userId);
  for (RequestEntity request : requests) {
    request.setApplicantName(userMapper.findById(request.getApplicantId()).getDisplayName());
  }
  return requests;
}`,
      },
      {
        type: "h3",
        text: "取得件数と呼び出し回数を突き合わせる",
      },
      {
        type: "p",
        text: "ループは申請ごとに Mapper を呼びます。一覧の 1 回と、申請 N 件に対する N 回を合わせて N+1 と呼びます。上のログでは、同じ申請者の名前を繰り返し取得しています。",
      },
      {
        type: "p",
        text: "このコードで、取得件数が 4 件または 300 件なら、SQL の回数は次のようになります。回数の比較であり、応答時間の測定結果ではありません。",
      },
      {
        type: "table",
        headers: ["申請件数", "一覧検索", "名前の検索", "合計"],
        rows: [
          ["4 件", "1 回", "4 回", "5 回"],
          ["300 件", "1 回", "300 回", "301 回"],
        ],
      },
      {
        type: "p",
        text: "この例の名前検索は主キーで絞ります。一つの SQL の実行計画だけを見ても、301 回の往復は分かりません。同じ操作に属する SQL の回数と、Java のループを突き合わせることが原因の特定につながります。",
      },
      {
        type: "callout",
        kind: "note",
        title: "Mapper の呼び出し回数と SQL の実行回数は同じとは限らない",
        text: "取得結果を再利用するキャッシュがあれば、Mapper を呼んでも SQL は実行されないことがあります。MyBatis にも同じ SqlSession（DB 操作をまとめるオブジェクト）内で結果を再利用する仕組みがあります。この処理にはトランザクションが無いので、ループの 1 回ごとに SqlSession が変わり、結果は再利用されません。実際の SQL の回数は、呼び出し元だけでなく `Preparing` のログでも確認しましょう。",
      },
      {
        type: "h3",
        text: "名前取得が応答時間のどれだけを占めるか確認する",
      },
      {
        type: "p",
        text: "N+1 があることだけでは、今回の遅さの原因と断定できません。一覧検索が終わる時刻と、名前取得をすべて終える時刻を比較しましょう。次は、名前取得が待ち時間の大半を占める場合を示す説明用のログ例です。配布環境で測定した値ではありません。",
      },
      {
        type: "code",
        title: "300 件の一覧で時間を比較する例（申請くん・説明用・途中のログは省略）",
        lang: "text",
        code: `04:12:03.100 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : start InvestigationService.listWithNames(..)
04:12:03.101 DEBUG [nio-8080-exec-3] j.c.e.s.m.R.findMineWithoutNames : ==>  Preparing: SELECT ...
04:12:03.110 DEBUG [nio-8080-exec-3] j.c.e.s.m.R.findMineWithoutNames : <==      Total: 300
04:12:03.111 DEBUG [nio-8080-exec-3] j.c.e.s.mapper.UserMapper.findById : ==>  Preparing: SELECT ... WHERE id = ?
...（名前取得の SQL が合計 300 回）
04:12:03.690 DEBUG [nio-8080-exec-3] j.c.e.s.mapper.UserMapper.findById : <==      Total: 1
04:12:03.700 DEBUG [nio-8080-exec-3] j.c.e.s.aspect.ServiceLoggingAspect : end InvestigationService.listWithNames(..)`,
      },
      {
        type: "p",
        text: "このログ例では、Service 全体が約 600 ミリ秒、最初の一覧検索が約 9 ミリ秒、繰り返す名前取得が約 579 ミリ秒です。時間の大半が名前取得にあり、ループ内の 300 回の DB アクセスが遅さにつながっていると判断できます。",
      },
      {
        type: "p",
        text: "この例では、`nio-8080-exec-3` というスレッドのログで、処理の開始から終了までを追っています。調査するときは、スレッド名と処理の開始・終了時刻を確認し、別のリクエストのログを混ぜないようにしましょう。",
      },
      {
        type: "h2",
        text: "このシナリオの要点",
      },
      {
        type: "ul",
        items: [
          "ループの中で申請者を一人ずつ取得すると、一覧の 1 回と、申請 N 件に対する N 回の SQL（N+1）になる",
          "N+1 があるだけでは遅さの原因と断定せず、ログの時刻差で、名前取得が待ち時間の大半を占めるかを確認する",
          "通常の `RequestMapper.findMine` は JOIN で名前も取得する。修正するなら JOIN でまとめるか、必要な申請者 ID を集めて一度に取得する",
        ],
      },
      {
        type: "h2",
        text: "調査の流れの振り返り",
      },
      {
        type: "investigation-flow",
        items: [
          "申請が多い利用者の一覧だけが遅く、エラーは無いことを確認",
          "Network タブで GET の応答待ちが長いことを確認",
          "SQL ログで、名前を取得する SQL が繰り返されていることを確認",
          "`UserMapper.findById` の呼び出し元から、`listWithNames` の申請ごとのループを発見",
          "申請 N 件で SQL が N+1 回になることを、件数と回数で確認",
          "ログの時刻差から、名前取得が待ち時間の大半を占めると特定",
        ],
      },
      { type: "quiz", id: "sc-list-n-plus-one" },
      {
        type: "h2",
        text: "手元で再現するには",
        aside: "hands-on",
      },
      {
        type: "p",
        text: "ここからは、シナリオの中の出来事ではなく、申請くんを手元で動かして、このシナリオを試すための手順です。普通に起動しただけでは、このシナリオで使う再現用の画面と処理は有効になりません。有効にするには、起動するときにプロファイルを指定します。プロファイルは、起動時に使う設定や部品を選ぶ名前です。ここでは通常の設定である `dev` に加えて、再現用の部品を有効にする `investigation` を指定します。",
      },
      {
        type: "p",
        text: "Docker を起動し、端末で `shinsei-kun` ディレクトリへ移動しましょう。通常の app コンテナが起動している場合は、先に `docker compose stop app` で 8080 番ポートを空けます。そのあと次を実行します。DB は Compose が起動します。",
      },
      {
        type: "code",
        title: "再現用の機能を有効にして起動する",
        lang: "bash",
        code: `docker compose run --build --service-ports -e SPRING_PROFILES_ACTIVE=dev,investigation app`,
      },
      {
        type: "p",
        text: "ブラウザで `http://localhost:8080/shinsei/login` を開き、山田（`yamada`）でログインしましょう。パスワードは `password` です。ログイン後に `http://localhost:8080/shinsei/investigation` を開くと、再現用の画面が表示されます。一覧は、再現用の画面の「申請者名付きの一覧」から開けます。",
      },
    ],
  },
  {
    id: "validation-paths",
    title: "[障害調査] 画面では拒否される空の件名が、API から登録できる",
    minutes: 10,
    blocks: [
      {
        type: "callout",
        kind: "tip",
        title: "申請くんで試すには",
        text: "このシナリオを申請くんで試すには、いつもと違う起動方法が要ります。手順は、末尾の「手元で再現するには」にあります。",
      },
      {
        type: "h2",
        text: "シナリオ",
      },
      {
        type: "p",
        text: "申請者の山田から、「件名を空にしたのに申請できてしまった」と連絡があった。申請には件名が必須で、画面のフォームでは空のまま提出できない。しかし、JSON API から送ると、空の件名の申請が作られた。",
      },
      {
        type: "h2",
        text: "いま分かっていること",
      },
      {
        type: "ul",
        items: [
          "ブラウザのフォームには `required` がある",
          "フォームの POST は、空の件名を拒否する",
          "API の POST は、空文字を受け付けて DB にレコードが残る",
          "`t_request` の `title` は NOT NULL。ただし、空文字のレコードが増えている",
          "手元で、再現用の機能を有効にして起動している。ログは DEBUG",
        ],
      },
      {
        type: "h2",
        text: "先に見ること",
      },
      {
        type: "p",
        text: "提出フォームでは、件名を空にして送信しようとすると、`required` によるチェックで送信が止まります。リクエストがサーバに届かないため、これだけではサーバが空の件名を拒否するか分かりません。",
      },
      {
        type: "p",
        text: "山田でログインし、`/shinsei/investigation` を開きましょう。提出フォームの件名を空にして提出ボタンを押し、Network タブで POST が送信されていないことを確認しましょう。",
      },
      {
        type: "p",
        text: "次に、この画面の開発者ツールの Console で次のコードを実行しましょう。このコードは、`required` のチェックを経由せずに、空の件名をフォームの送信先と API に送ります。Console に表示された二つのステータスコードを比べましょう。",
      },
      {
        type: "code",
        title: "同じ空文字をフォームと API に送る（Console）",
        lang: "javascript",
        code: `const csrf = document.querySelector('input[name="_csrf"]').value;
const formResult = await fetch('/shinsei/investigation/form', {
  method: 'POST',
  body: new URLSearchParams({ title: '', approverId: '3', _csrf: csrf })
});
const apiResult = await fetch('/shinsei/investigation/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
  body: JSON.stringify({ title: '', approverId: 3 })
});
console.log(formResult.status, apiResult.status);`,
      },
      {
        type: "p",
        text: "この再現用の実装では、フォームの応答は 400、API の応答は 200 です。API のレスポンスの ID で DB を確認すると、`title` が空文字のレコードがあります。SQL が成功したことと、業務上正しい入力であることは別です。",
      },
      {
        type: "h2",
        text: "原因の追跡",
      },
      {
        type: "h3",
        text: "二つの入口から共通処理まで比較する",
      },
      {
        type: "code",
        title: "InvestigationController（申請くん）",
        lang: "java",
        code: `@PostMapping("/form")
public RequestResponse form(@RequestParam String title, @RequestParam Long approverId,
    @AuthenticationPrincipal LoginUser user) {
  if (title.isBlank()) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "件名は必須です");
  }
  return RequestResponse.from(requestService.create(user.getId(), title, approverId));
}

@PostMapping("/api")
public RequestResponse api(@RequestBody NewRequest body,
    @AuthenticationPrincipal LoginUser user) {
  return RequestResponse.from(requestService.create(user.getId(), body.title(), body.approverId()));
}`,
      },
      {
        type: "p",
        text: "フォーム側には `title.isBlank()` の判定があります。API 側にはありません。両方が呼ぶ `RequestService.create` に進み、同じ判定があるか確認しましょう。",
      },
      {
        type: "p",
        text: "フォーム側の `ResponseStatusException` は、応答に使うステータスコードを指定する例外です。このコードは 400 を指定しています。API 側の `@RequestBody` は、JSON の本文を Java のオブジェクトとして受け取る印です。JSON を受け取るだけでは、件名が空かどうかはチェックされません。",
      },
      {
        type: "code",
        title: "RequestService.create（申請くん）",
        lang: "java",
        code: `public RequestEntity create(Long applicantId, String title, Long approverId) {
  RequestEntity request = new RequestEntity();
  request.setTitle(title);
  request.setApplicantId(applicantId);
  request.setApproverId(approverId);
  request.setStatus("PENDING");
  requestMapper.insert(request);
  return requestMapper.findById(request.getId(), applicantId);
}`,
      },
      {
        type: "p",
        text: "共通の登録処理は、受け取った件名をそのまま保存しています。`schema.sql` の `title` は NOT NULL ですが、空文字は NULL ではないため、この制約では拒否されません。入力チェックはフォーム側にしか無く、API から送った空文字はそのまま DB に保存されたと分かります。",
      },
      {
        type: "h2",
        text: "このシナリオの要点",
      },
      {
        type: "ul",
        items: [
          "ブラウザの `required` は、API の入力を検証しない。入力チェックが入口ごとに違うと、チェックの無い入口から不正な値が入る",
          "NOT NULL は空文字を拒否しない。件名必須のような業務上の条件は、共通の Service で保証し、各入口で適切な応答に変換する",
        ],
      },
      {
        type: "h2",
        text: "調査の流れの振り返り",
      },
      {
        type: "investigation-flow",
        items: [
          "フォームは空の件名を拒否し、API は受け付けて DB にレコードが残ることを確認",
          "同じ空文字を、Console から二つの POST で比較し、応答が 400 と 200 で違うことを確認",
          "二つの Controller のメソッドを比べ、フォーム側にだけ `title.isBlank()` の判定があることを確認",
          "両方が呼ぶ `RequestService.create` に、同じ判定が無いことを確認",
          "NOT NULL が空文字を拒否しないことを確認",
          "件名必須の判定が、フォーム側の入口にしか無かったと特定",
        ],
      },
      { type: "quiz", id: "sc-validation-paths" },
      {
        type: "h2",
        text: "手元で再現するには",
        aside: "hands-on",
      },
      {
        type: "p",
        text: "ここからは、シナリオの中の出来事ではなく、申請くんを手元で動かして、このシナリオを試すための手順です。普通に起動しただけでは、このシナリオで使う再現用の画面と処理は有効になりません。有効にするには、起動するときにプロファイルを指定します。プロファイルは、起動時に使う設定や部品を選ぶ名前です。ここでは通常の設定である `dev` に加えて、再現用の部品を有効にする `investigation` を指定します。",
      },
      {
        type: "p",
        text: "Docker を起動し、端末で `shinsei-kun` ディレクトリへ移動しましょう。通常の app コンテナが起動している場合は、先に `docker compose stop app` で 8080 番ポートを空けます。そのあと次を実行します。DB は Compose が起動します。",
      },
      {
        type: "code",
        title: "再現用の機能を有効にして起動する",
        lang: "bash",
        code: `docker compose run --build --service-ports -e SPRING_PROFILES_ACTIVE=dev,investigation app`,
      },
      {
        type: "p",
        text: "ブラウザで `http://localhost:8080/shinsei/login` を開き、山田（`yamada`）でログインしましょう。パスワードは `password` です。ログイン後に `http://localhost:8080/shinsei/investigation` を開くと、再現用の画面が表示されます。Console の例で承認者に指定している ID 3 は、佐藤です。",
      },
    ],
  },
];
