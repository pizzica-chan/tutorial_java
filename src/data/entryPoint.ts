/** 申請くんの「処理の入口」サンプル。project.ts と教材本文から参照する。 */

export const requestControllerPath = "src/main/java/.../controller/RequestController.java";

export const requestListEntryPoint = {
  screen: "申請一覧",
  url: "/shinsei/requests",
  httpMethod: "GET",
  javaMethod: "list",
};

/** 教材「処理の入口から読む」用。URL マッピングと Service 呼び出しに注釈付き */
export const requestListEntryPointReadingSnippet = `// 申請一覧: ブラウザは GET /shinsei/requests を送る（/shinsei は context-path）
@Controller
@RequestMapping("/requests")
@RequiredArgsConstructor
public class RequestController {
  private final RequestService requestService;

  // → URL マッピング: @RequestMapping + @GetMapping で GET /shinsei/requests がこのメソッドへ
  @GetMapping
  public String list(Model model, @AuthenticationPrincipal LoginUser user) {
    // → Service 呼び出し: ここから RequestService.findMine へ降りる
    model.addAttribute("applications", requestService.findMine(user.getId()));
    return "request/list";
  }

  // 承認は POST /shinsei/requests/12/approve → approve の Java メソッド（同じ要領）
  // 詳細は GET /shinsei/requests/12 → detail の Java メソッド
}`;

/** 教材本文用の短い抜粋 */
export const requestListEntryPointSnippet = `// ブラウザ: GET /shinsei/requests
@Controller
@RequestMapping("/requests")
public class RequestController {

  @GetMapping  // ← 処理の入口（一覧）
  public String list(Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("applications", requestService.findMine(user.getId()));
    return "request/list";
  }

  @GetMapping("/{id}")  // ← 処理の入口（詳細）
  public String detail(@PathVariable Long id, Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("application", requestService.findById(id, user.getId()));
    return "request/detail";
  }

  @PostMapping("/{id}/approve")  // ← 処理の入口（承認）
  public String approve(@PathVariable Long id, @AuthenticationPrincipal LoginUser user) {
    requestService.approve(id, user.getId());
    return "redirect:/requests";
  }
}`;

/** ラボのソースツリー用 */
export const requestControllerSample = `@Controller
@RequestMapping("/requests")
@RequiredArgsConstructor
public class RequestController {
  private final RequestService requestService;

  // 処理の入口: GET /shinsei/requests（context-path /shinsei + /requests）
  @GetMapping
  public String list(Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("applications", requestService.findMine(user.getId()));
    return "request/list";
  }

  // 処理の入口: GET /shinsei/requests/12
  @GetMapping("/{id}")
  public String detail(@PathVariable Long id, Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("application", requestService.findById(id, user.getId()));
    return "request/detail";
  }

  // 処理の入口: POST /shinsei/requests/12/approve
  @PostMapping("/{id}/approve")
  public String approve(@PathVariable Long id, @AuthenticationPrincipal LoginUser user) {
    requestService.approve(id, user.getId());
    return "redirect:/requests";
  }
}`;
