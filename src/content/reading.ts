import type { Track } from "../types";
import { requestListEntryPointReadingSnippet } from "../data/entryPoint";
import { requestServiceSample } from "../data/project";

export const readingTrack: Track = {
  id: "reading",
  no: "04",
  title: "ソースの読み方",
  kicker: "READING",
  description: "画面と URL を手がかりに、サーバ側の処理の入口を特定します。",
  accent: "#6ec8c0",
  lessons: [
    {
      id: "where-start",
      title: "どこから読み始めるか",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "この章では、ソースの読み方をいくつかの手法に分けています。先にどれを使うかは、いま分かっている手がかりで決まります。",
        },
        {
          type: "table",
          headers: ["知りたいこと・分かっていること", "先に読むレッスン"],
          rows: [
            [
              "特定の画面や API の処理の流れを追いたい。URL やパスが分かる",
              "処理の入口から読む",
            ],
            [
              "文言やログ名の出どころを知りたい。入口の場所はまだ分からない",
              "キーワードで探す",
            ],
            [
              "文字列検索のヒットが多すぎる。形で絞りたい",
              "正規表現で探す",
            ],
            [
              "入口は分かった。誰が呼び、何に渡すかを追いたい",
              "呼び出し元と呼び出し先",
            ],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "入口の手順の中でも検索する",
          text: "「処理の入口から読む」でも、ソース検索は使います。違うのは手がかりです。URL が分かっていればパスで入口を探しましょう。文言しかなければ、「キーワードで探す」です。",
        },
        {
          type: "callout",
          kind: "note",
          title: "探したい SQL が先にあるとき",
          text: "探したい SQL が先にあるときは、テーブル名や特徴のある文の一部を手がかりにしましょう。MyBatis と JPA では探し方が違います。手順は「SQL からソースを探す」です。",
        },
      ],
    },
    {
      id: "dont-read-all",
      title: "処理の入口から読む",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "リポジトリを上から読む必要はありません。操作が特定できているときは、画面と URL から処理の入口を探しましょう。",
        },
        {
          type: "p",
          text: "処理の入口とは、サーバ側でその操作の処理が始まる場所です。画面なら URL と HTTP メソッドに対応する Controller の Java メソッドが多いです。",
        },
        {
          type: "h2",
          text: "手順",
        },
        {
          type: "ol",
          items: [
            "対象の URL を確認する（画面ならアドレスバー、Web API なら Network タブの Fetch/XHR）",
            "パス文字列（requests など）でソースを検索する",
            "ヒットした Controller で、HTTP メソッドとパスが対象の操作に合うか確認する",
            "一致した Java メソッドを、処理の入口として特定する",
          ],
        },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "申請一覧を開くと `GET /shinsei/requests` が飛びます。処理の入口は `RequestController.list` です。",
        },
        {
          type: "figure",
          kind: "screen",
          src: "/images/screen-list.jpg",
          alt: "申請くんの申請一覧画面",
          caption: "申請一覧のアドレスバーは `/shinsei/requests` です。この URL を手がかりにします。",
        },
        {
          type: "table",
          headers: ["画面", "URL", "処理の入口"],
          rows: [
            ["申請一覧", "`GET /shinsei/requests`", "`RequestController.list`"],
            ["承認ボタン", "`POST /shinsei/requests/12/approve`", "`RequestController.approve`"],
          ],
        },
        { type: "diagram", name: "read-entry", caption: "URL から Controller へ。ここが処理の入口です。" },
        {
          type: "code",
          title: "RequestController.java（抜粋）",
          lang: "java",
          highlightLines: [3, 9, 10, 12],
          code: requestListEntryPointReadingSnippet,
        },
        {
          type: "p",
          text: "ここでは入口の特定までです。次の項目「読む順番」で、入口からどこを見るかを押さえます。そのあと、次章「リクエストの追跡」で、この `list` から Service、SQL、応答へ進みます。",
        },
        {
          type: "h2",
          text: "後回しにするもの",
        },
        {
          type: "ul",
          items: [
            "処理の入口が決まるまで、Repository や Mapper から通読しない",
            "生成コード、ライブラリ本体、圧縮された JS は後回し",
            "同じパスが二つヒットしたら、今の URL と HTTP メソッドに合う方を見る",
            "テストコードがあれば、呼び出し方の例として読む",
          ],
        },
        { type: "quiz", id: "ori-goal" },
      ],
    },
    {
      id: "order",
      title: "読む順番",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "手がかりの選び方は「どこから読み始めるか」です。入口の取り方は直前の項目です。",
        },
        {
          type: "p",
          text: "入口から先は、現象 → 処理の入口 → 分岐 → 永続化 → 出口 です。",
        },
        {
          type: "steps",
          items: [
            { title: "現象", text: "誰が、どの画面で、何をすると、何が起きるか。" },
            { title: "処理の入口", text: "URL と HTTP メソッド。Controller またはバッチから読み始める。" },
            { title: "分岐", text: "権限、ステータス、null。該当する if を特定。止められるならデバッガで値を見る。" },
            { title: "永続化", text: "SQL、ファイル、外部 API。" },
            { title: "出口", text: "画面メッセージ、リダイレクト、非同期の後処理。" },
          ],
        },
        {
          type: "p",
          text: "次の章「リクエストの追跡」では、この順を申請一覧で辿ります。",
        },
      ],
    },
    {
      id: "search",
      title: "キーワードで探す",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "処理の入口がまだ分からないときは、画面やログに出ている言葉でソースを検索しましょう。",
        },
        {
          type: "p",
          text: "URL が分かっているときは、「処理の入口から読む」の方が早く見つかります。",
        },
        {
          type: "p",
          text: "一つの言葉では見つからないことがあります。下の表のように、手がかりを変えて検索しましょう。画面の文言は、Java のソースには無く、プロパティファイルや DB のマスタにあることもあります。",
        },
        {
          type: "table",
          headers: ["手がかり", "検索の例"],
          rows: [
            ["画面の見出し", "承認待ち"],
            ["ボタン", "承認 / approve"],
            ["URL", "requests"],
            ["エラー文", "権限がありません"],
            ["テーブル", "t_request / REQUEST"],
            ["ログ", "RequestService"],
            ["実行された SQL", "テーブル名や特徴のある文の一部。SQL 全体では見つかりにくい"],
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "ソースが検索に出てこないとき",
          text: "画面の文言やログのクラス名で検索しても、プロジェクト内に無いことがあります。自作ライブラリを jar で取り込んでいると、IDE の検索対象にそのソースが含まれないことがあります。`pom.xml` や `build.gradle` の依存を見て、社内ライブラリかどうかを確認しましょう。ライブラリ側のソースが手元に無ければ、呼び出し元とスタックトレースを追い、必要なら別リポジトリや担当者を当たります。",
        },
        {
          type: "p",
          text: "IDE では、文字列の検索と、型やメソッドの参照検索は別です。",
        },
        {
          type: "ul",
          items: [
            "文言を探すときは文字列検索",
            "ヒットが多すぎるときは、次のレッスン「正規表現で探す」",
            "呼び出し元を知るときは参照検索。手順はこのあとのレッスン「呼び出し元と呼び出し先」",
          ],
        },
        {
          type: "p",
          text: "実行された SQL からソースを探す手順は、「リクエストの追跡」の「SQL からソースを探す」にあります。MyBatis と JPA では探し方が違います。",
        },
        { type: "quiz", id: "read-name" },
      ],
    },
    {
      id: "search-regex",
      title: "正規表現で探す",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "前のレッスンのように approve や request だけで探すと、ヒットが多すぎることがあります。正規表現検索を使うと、パターンで絞れます。",
        },
        {
          type: "p",
          text: "正規表現は、文字の並びのパターンを表す書き方です。まずは下の例をそのまま貼って試しましょう。必要になった記法だけ覚えればよいです。",
        },
        {
          type: "h2",
          text: "IDE で使う",
        },
        {
          type: "table",
          headers: ["操作", "IntelliJ IDEA（日本語UI）", "Eclipse（日本語UI）"],
          rows: [
            [
              "ファイル内検索",
              "「編集」→「検索」→「検索...」（Ctrl+F）。検索バー右の「.*」（正規表現）をオンにする",
              "「編集」→「検索/置換...」（Ctrl+F）。「正規表現」にチェックを入れる",
            ],
            [
              "プロジェクト全体",
              "「編集」→「検索」→「ファイル内を検索...」（Ctrl+Shift+F）。「正規表現」にチェックを入れる",
              "「検索」→「検索...」（Ctrl+H）→「ファイルの検索」タブ。「正規表現」にチェックを入れる",
            ],
            [
              "検索語の入力",
              "検索欄に正規表現を入力して Enter。ファイル内なら次の一致へは F3",
              "検索欄に正規表現を入力して「検索」。次の一致へは Ctrl+. など（キー割り当ては環境次第）",
            ],
          ],
        },
        {
          type: "h2",
          text: "よくあるパターンの例",
        },
        {
          type: "table",
          headers: ["やりたいこと", "パターン", "ヒットする行の例"],
          rows: [
            [
              "`approve` を含む行（広め）",
              "`approve`",
              "「`requestService.approve`」— ヒットする。「`disapprove`」— `approve` を含むのでヒットする",
            ],
            [
              "`approve` という単語だけ",
              "`\\bapprove\\b`",
              "「`requestService.approve`」— ヒットする。「`disapprove`」— 単語としてはヒットしない",
            ],
            [
              "`@RequestMapping` と `requests` が同じ行",
              "`@RequestMapping.*requests`",
              "「`@RequestMapping(\"/requests\")`」— ヒットする",
            ],
            [
              "承認の POST マッピング",
              "`@PostMapping.*approve`",
              "「`@PostMapping(\"/{id}/approve\")`」— ヒットする",
            ],
            [
              "`findMine` の呼び出し",
              "`\\bfindMine\\s*\\(`",
              "「`requestService.findMine(user.getId())`」— ヒットする",
            ],
            [
              "`import Request` の行",
              "`^import .+Request`",
              "「`import jp.co.example.shinsei.entity.RequestEntity;`」— 行頭の import でヒットする",
            ],
          ],
        },
        {
          type: "h2",
          text: "記号の読み方（チートシート）",
        },
        {
          type: "p",
          text: "上のパターンを組み立てるための部品です。",
        },
        {
          type: "ul",
          items: ["`.`", "`*`", "`\\b`", "`^`", "`\\.`"],
        },
        {
          type: "p",
          text: "つなげて書く — request と approve のあいだに何かあってもよい、といった書き方です。",
        },
        {
          type: "table",
          headers: ["書き方", "意味", "ヒットする例"],
          rows: [
            [
              "`approve`",
              "そのままの文字",
              "「`approve`」— 行内のこの文字列。「`disapprove`」— `approve` を含むのでヒットする",
            ],
            [
              "`request.*approve`",
              "`request` のあと、あとに `approve`",
              "「`requestService.approve`」— 同じ行ならヒットする",
            ],
            ["`a.c`", "`.` は任意の1文字", "「`abc`」— ヒットする。「`a1c`」— ヒットする"],
            [
              "`request.*`",
              "`request` のあとなら何でもよい",
              "「`requestMapper`」— ヒットする。「`requests`」— ヒットする",
            ],
          ],
        },
        {
          type: "p",
          text: "単語と行の位置 — approve だけに絞る、行頭の import、行末の ; だけ、など。",
        },
        {
          type: "table",
          headers: ["書き方", "意味", "ヒットする例"],
          rows: [
            [
              "`\\bapprove\\b`",
              "単語としての `approve`",
              "「`approve`」— ヒットする。「`disapprove`」— 単語としてはヒットしない",
            ],
            [
              "`^import`",
              "行の先頭が `import`",
              "「`import org.springframework...`」— 行頭ならヒットする",
            ],
            [
              "`^\\s*@`",
              "行頭の空白のあとに `@`",
              "「  `@GetMapping`」— インデントのあとの `@` でヒットする",
            ],
            [
              "`;\\s*$`",
              "行の末尾が `;`（そのあと空白のみ可）",
              "「`return \"request/list\";`」— 行末の `;` でヒットする",
            ],
            [
              "`approve\\(id, user\\.getId\\(\\)\\);\\s*$`",
              "行末まで含めて一致",
              "「`requestService.approve(id, user.getId());`」— この1行だけに絞れる",
            ],
            [
              "`\\blist\\s*\\(`",
              "`list` のあと `(`",
              "「`list(`」— ヒットする",
            ],
          ],
        },
        {
          type: "p",
          text: "そのまま探す・数字 — ドットやスラッシュを特別扱いしないで探すときに使います。",
        },
        {
          type: "table",
          headers: ["書き方", "意味", "ヒットする例"],
          rows: [
            [
              "`application\\.yml`",
              "`\\.` でドットをそのまま",
              "「`application.yml`」— ヒットする。「`application-yml`」— `.` だけだとこちらもヒットしてしまう",
            ],
            [
              "`\\s`",
              "空白1つ分",
              "「`public void`」— public と void のあいだの空白にヒットする",
            ],
            [
              "`\\d+`",
              "数字が1つ以上",
              "「`/requests/12/approve`」— 12 の部分にヒットする",
            ],
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "ヒットが0件",
          text: ". や ( は特別な意味があります。そのまま探すときは `\\` でエスケープします。`application.yml` なら `application\\.yml` です。[ ] の中では `.` は普通のドットとして扱われることが多いです。",
        },
        {
          type: "callout",
          kind: "note",
          title: "まずは単純に",
          text: "正規表現で見つからないときは、いったん通常の文字列検索に戻しましょう。パターンが厳しすぎることがあります。",
        },
        {
          type: "p",
          text: "メソッドの呼び出し元や呼び出し先を追うのは、参照検索と定義へジャンプです。次のレッスンです。",
        },
        { type: "quiz", id: "read-regex" },
      ],
    },
    {
      id: "call-chain",
      title: "呼び出し元と呼び出し先",
      minutes: 11,
      blocks: [
        {
          type: "p",
          text: "今開いている Java メソッドを起点に、前後を見ましょう。誰が呼んでいるかが呼び出し元、次に呼ぶ先が呼び出し先です。",
        },
        { type: "diagram", name: "call-chain", caption: "今のメソッドを真ん中に、誰から来て誰へ行くか。" },
        {
          type: "h2",
          text: "申請くんの例",
        },
        {
          type: "p",
          text: "承認ボタンは `POST /shinsei/requests/12/approve` です。処理の入口は `RequestController.approve` で、そこから `RequestService.approve` へ降ります。",
        },
        {
          type: "code",
          title: "RequestController.java（呼び出し元・抜粋）",
          lang: "java",
          highlightLines: [19],
          code: `@Controller
@RequestMapping("/requests")
@RequiredArgsConstructor
public class RequestController {
  private final RequestService requestService;

  @PostMapping("/{id}/approve")
  public String approve(
      @PathVariable Long id,
      @AuthenticationPrincipal LoginUser user,
      RedirectAttributes redirectAttributes) {
    var request = requestService.findById(id, user.getId());
    if (!"PENDING".equals(request.getStatus())) {
      redirectAttributes.addFlashAttribute(
          "errorMessage", "この申請は承認できません");
      return "redirect:/requests/" + id;
    }
    // → この approve にカーソルを置いて定義へジャンプすると、RequestService.approve へ着く
    requestService.approve(id, user.getId());
    return "redirect:/requests";
  }
}`,
        },
        {
          type: "code",
          title: "RequestService.java（呼び出し先）",
          lang: "java",
          highlightLines: [25],
          code: requestServiceSample,
        },
        {
          type: "p",
          text: "今どのファイルを開いているかで、向きが変わります。",
        },
        {
          type: "ul",
          items: [
            "Controller の approve から見ると、Service の approve が呼び出し先",
            "Service から見ると、Controller が呼び出し元、Mapper と MailService が呼び出し先",
          ],
        },
        {
          type: "h2",
          text: "呼び出し先へ降りる",
        },
        {
          type: "p",
          text: "呼ばれている側の中身を開くときは、定義へジャンプです。文字列検索ではありません。",
        },
        {
          type: "ol",
          items: [
            "呼び出しのメソッド名にカーソルを置く。上の例なら `requestService.approve` の `approve`。クラス名ではない",
            "定義へジャンプする。IntelliJ では「宣言または使用箇所に移動」、Eclipse では「宣言を開く」。メソッド名を Ctrl+クリックしても同じことが多い",
            "着いた先で、また次の呼び出しに同じ操作をする。Service の `requestMapper.findById` なら、Mapper の宣言へ着く",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "キーはキーマップで違う",
          text: "ショートカットは、IDE の種類やキーマップの設定で変わります。メニューの名前で覚えましょう。ここでの名前は、日本語化した IDE での表記です。IntelliJ の「宣言または使用箇所に移動」は、カーソルが呼び出しなら宣言へ、宣言なら使用箇所の一覧です。先にカーソル位置を合わせましょう。",
        },
        {
          type: "callout",
          kind: "note",
          title: "Mapper はインタフェース",
          text: "定義へジャンプは、Java の宣言に着きます。RequestMapper はインタフェースなので、着くのはメソッドの宣言です。SQL の文は XML 側です。手順は「リクエストの追跡」の「SQL からソースを探す」です。",
        },
        {
          type: "h2",
          text: "呼び出し元を一覧する",
        },
        {
          type: "p",
          text: "今のメソッドを誰が呼んでいるかを知るときは、参照検索です。前のレッスンの文字列検索とは別です。",
        },
        {
          type: "ol",
          items: [
            "メソッドの宣言の名前にカーソルを置く。上の例なら public void approve の approve",
            "参照検索する。IntelliJ では「使用箇所の検索」、Eclipse では「ワークスペース内の参照」（右クリックなら「参照」）",
            "一覧の行を開いて、引数に何を渡しているかを見る",
          ],
        },
        {
          type: "p",
          text: "申請くんでは、画面用の RequestController と、JSON 用の RequestApiController の両方が、同じ `RequestService.approve` を呼びます。文字列検索で approve を拾うと、URL のパスや別クラスの同名メソッドも混ざります。参照検索は、この Java メソッドを呼んでいる箇所に絞れます。",
        },
        {
          type: "code",
          title: "同じ Service を呼ぶ箇所（例）",
          lang: "java",
          highlightLines: [2, 5],
          code: `// RequestController（画面）
requestService.approve(id, user.getId());

// RequestApiController（JSON）
requestService.approve(id, user.getId());`,
        },
        {
          type: "p",
          text: "一覧にバッチやテストが出ることがあります。メソッドの中身は正しく見えても結果が違うときは、今見ている処理の入口とは別の呼び出し元を疑いましょう。画面用とバッチ用で実装が二つ、など。",
        },
        {
          type: "h2",
          text: "呼び出しを階層で見る",
        },
        {
          type: "p",
          text: "呼び出し元や呼び出し先が複数あるときは、呼び出し階層が使えます。今のメソッドを起点に、上（誰が呼ぶか）と下（誰を呼ぶか）が階層（ツリー）になります。1段だけなら、参照検索と定義へジャンプで足ります。",
        },
        {
          type: "table",
          headers: ["やりたいこと", "IntelliJ", "Eclipse"],
          rows: [
            ["呼ばれている側の中身を開く", "宣言または使用箇所に移動", "宣言を開く"],
            ["誰が呼んでいるかを一覧する", "使用箇所の検索", "ワークスペース内の参照"],
            ["呼び出しを階層で見る", "呼び出し階層", "呼び出し階層を開く"],
          ],
        },
        {
          type: "h2",
          text: "中身の前に見ること",
        },
        {
          type: "p",
          text: "辿れるようになったら、中身の前に次を見ましょう。",
        },
        {
          type: "ul",
          items: [
            "クラスとメソッドのアノテーション",
            "引数は誰が渡しているか（Controller、別 Service、バッチ）",
            "戻り値は画面に出るか、次の更新に使われるか",
            "例外はどこで catch され、どのメッセージになるか（`@ControllerAdvice` のこともある）",
            "同じ型（インタフェース）の別実装が無いか（モックなど、プロファイルで切り替わることがある）",
          ],
        },
        {
          type: "callout",
          kind: "trap",
          title: "アノテーションを読み飛ばす",
          text: "アノテーションが付いていると、Java メソッド本体に書いていない処理が動くことがあります。`@Transactional` のトランザクションや、`@PreAuthorize` の権限確認が例です。知らないアノテーションは飛ばさず、用語や検索で確認しましょう。",
        },
        {
          type: "p",
          text: "実装へジャンプは、同じインタフェースの実体クラスを開く操作です。モックや、プロファイルで切り替わる実装を見るときに使います。",
        },
        {
          type: "ul",
          items: [
            "IntelliJ … 「実装に移動」",
            "Eclipse … 「実装を開く」",
          ],
        },
        {
          type: "p",
          text: "MyBatis の Mapper は Java の実装クラスが無いことが多いので、ここでは使いません。SQL は XML 側です。",
        },
        {
          type: "callout",
          kind: "note",
          title: "ソースに呼び出しが無いもの",
          text: "Filter、Interceptor、AOP は、このメソッドのソースに呼び出しが無く、参照検索の一覧にも出ません。`@Transactional` や `@PreAuthorize` のように、アノテーションとして付いていることがあります。読み飛ばさず確認しましょう。探し方は「Javaアプリの構成」の「Filter / Interceptor / AOP」です。",
        },
        { type: "quiz", id: "read-call" },
      ],
    },
    {
      id: "where-from",
      title: "値の源流",
      minutes: 8,
      blocks: [
        {
          type: "p",
          text: "`NullPointerException` や表示不正の多くは、その変数がセットされた場所に原因があります。",
        },
        { type: "diagram", name: "value-origin" },
        {
          type: "ol",
          items: [
            "変数の宣言と代入を見る",
            "DB から来ているなら、カラムの null 許容と、データが欠ける条件を見る",
            "画面から来ているなら、name 属性とバインドを見る",
            "セッションや ThreadLocal なら、セットするフィルタを見る",
          ],
        },
        {
          type: "code",
          title: "未設定のまま保存される例",
          lang: "java",
          highlightLines: [1, 3],
          code: `request.setApproverId(form.getApproverId()); // null のまま保存
// 後日の承認処理で
request.getApproverId().equals(userId); // NPE`,
        },
        {
          type: "callout",
          kind: "trap",
          title: "途中の null チェック",
          text: "Optional や null チェックが途中まであると、その先ではもう null ではないと誤解しやすいです。分岐を書き出しましょう。",
        },
        {
          type: "p",
          text: "ソース上の代入を辿ったあと、今のリクエストで変数に何が入っているかを見たいときは、デバッガです。次の項目です。",
        },
      ],
    },
    {
      id: "debug",
      title: "デバッガで止めて見る",
      minutes: 10,
      blocks: [
        {
          type: "p",
          text: "デバッガは、動いているプログラムを指定した行で一時停止する道具です。止まった時点の変数の値と、次にどの if に入るかが見えます。",
        },
        {
          type: "p",
          text: "申請くんには「PENDING 以外は承認できない」という分岐があります。山田でログインし、申請履歴から申請 ID 11「備品購入」の詳細を開き、承認を送信します。`findById` の直後にある if で止めると、`status` が `APPROVED` だと確認できます。",
        },
        {
          type: "code",
          title: "RequestController.java（申請くん）",
          lang: "java",
          highlightLines: [2],
          code: `var request = requestService.findById(id, user.getId());
if (!"PENDING".equals(request.getStatus())) {
  redirectAttributes.addFlashAttribute(
      "errorMessage", "この申請は承認できません");
  return "redirect:/requests/" + id;
}`,
        },
        {
          type: "h2",
          text: "有効なとき",
        },
        {
          type: "p",
          text: "同じ操作を自分で再現できて、そのプロセスを止めてよいときです。ローカル環境が主です。",
        },
        {
          type: "table",
          headers: ["場面", "デバッガで見ること"],
          rows: [
            ["「この申請は承認できません」と出る", "if の直前で、status が何か"],
            ["NPE の行が分かっている", "その行の変数が null か"],
            ["同じメソッドが画面とバッチの両方から呼ばれる", "今の呼び出しの引数が何か"],
            ["JSON は正しいのに画面の数字が違う", "ブラウザで、画面に出す直前の JS の値"],
            ["ボタンを押してもリクエストが飛ばない", "ブラウザで、click の処理が走るか"],
            ["件数や中身がおかしい", "Mapper に渡す引数。実行される SQL の条件になる"],
          ],
        },
        {
          type: "p",
          text: "SQL ログが出ていれば、実行された文はログでも見えます。出ていないときや、バインドした値が知りたいときは、Mapper の呼び出しで止めましょう。",
        },
        {
          type: "h2",
          text: "向かないとき",
        },
        {
          type: "ul",
          items: [
            "再現できない、既に終わった障害 → ログ",
            "本番や、止めると他の人が待たされる検証用環境 → ログ",
            "遅さの調査 → 止めると時間が変わる",
          ],
        },
        {
          type: "diagram",
          name: "debug-two",
          caption: "Java は IDE、JS はブラウザ。止める場所が違います。",
        },
        {
          type: "h2",
          text: "バックエンド（IDE）",
        },
        {
          type: "p",
          text: "IntelliJ や Eclipse のデバッガです。見たい Java の行にブレークポイントを置き、デバッグ実行でアプリを起動しましょう。通常の起動とは別です。デバッグ実行していないと、印を置いても止まりません。",
        },
        {
          type: "ol",
          items: [
            "処理の入口のメソッド（申請くんなら Controller の approve など）にブレークポイントを置く",
            "デバッグ実行でアプリを起動する",
            "ブラウザで、調べたい操作をする",
            "止まったら引数と変数を見る。1行ずつ進める",
          ],
        },
        {
          type: "ul",
          items: [
            "止まらないときは、その行に処理が来ていません。Filter や別メソッド、別プロセス、デバッグ起動していないことを疑う",
            "次の行へ進むか、呼び出しの中へ入るか。操作名は IDE によって違う",
            "検証用環境のサーバへリモートでつなぐことがある。本番では、止めると他の人のリクエストも待つので、通常は使わない",
          ],
        },
        {
          type: "h2",
          text: "フロントエンド（ブラウザ）",
        },
        {
          type: "p",
          text: "ブラウザの開発者ツールです。Java の IDE は使いません。",
        },
        {
          type: "ul",
          items: [
            "Console … JS の例外。赤い行が、ボタンを押しても何も起きないときの手がかりになる",
            "Sources（ソース）… JS にブレークポイント。click や fetch の直前で止める",
            "Elements（要素）… いま画面にある HTML と CSS。サーバが返した HTML のあと、JS が書き換えていることがある",
            "Network タブ … 通信。デバッガではないが、同じ開発者ツール。リクエストが飛んだかを先に見る",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "申請くんと JS",
          text: "申請くんのようにサーバが HTML を組み立てるアプリでは、表示の多くはテンプレートです。JS のデバッガが主役になるのは、画面内で fetch している、ボタンを押しても Network タブに行が無い、JSON は正しいのに画面の数字が違う、ときです。",
        },
        {
          type: "h2",
          text: "どちらを使うか",
        },
        {
          type: "table",
          headers: ["見たいもの", "先に使うもの"],
          rows: [
            ["ボタンを押しても Network タブにリクエストが無い。Console に例外", "ブラウザ"],
            ["JSON や HTML の本文が期待と違う", "まず Network タブ。そのあと IDE でサーバ側"],
            ["Service の変数、if の条件、DB に渡す値", "IDE"],
            ["色や位置だけ", "Elements。デバッガではない"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "止めると待つ",
          text: "デバッガで止めたスレッドは待ちます。外部 API のタイムアウトや、検証用環境の他の利用者に影響することがあります。",
        },
        { type: "quiz", id: "read-debug" },
      ],
    },
    {
      id: "spec-gap",
      title: "仕様とコードの差",
      minutes: 7,
      blocks: [
        {
          type: "p",
          text: "設計書の日付がコードより古いことはよくあります。差があるときは次の順です。",
        },
        {
          type: "ol",
          items: [
            "求められているのが「文書どおり」か「今の動きの修正」かを確認する",
            "コードと、検証用環境の実挙動を見る",
            "どちらを正とするか、分かる人に確認する",
            "影響範囲を見ずに仕様を書き換えない",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "修正範囲",
          text: "依頼がバグ修正なら、まず原因箇所の最小変更です。構成の整理は別作業になります。",
        },
      ],
    },
  ],
};
