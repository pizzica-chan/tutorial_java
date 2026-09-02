package jp.co.example.shinsei.controller;

import jp.co.example.shinsei.mapper.UserMapper;
import jp.co.example.shinsei.security.LoginUser;
import jp.co.example.shinsei.service.RequestService;
import jp.co.example.shinsei.web.HistorySearchCondition;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpSession;
import java.util.Optional;

@Controller
@RequestMapping("/requests")
@RequiredArgsConstructor
public class RequestController {
  private final RequestService requestService;
  private final UserMapper userMapper;

  // 処理の入口: GET /shinsei/requests（context-path /shinsei + /requests）
  @GetMapping
  public String list(Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("applications", requestService.findMine(user.getId()));
    return "request/list";
  }

  @GetMapping("/new")
  public String newForm(Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("approvers", userMapper.findAll().stream()
        .filter(candidate -> !candidate.getId().equals(user.getId()))
        .toList());
    return "request/form";
  }

  @PostMapping
  public String create(
      @RequestParam String title,
      @RequestParam Long approverId,
      @AuthenticationPrincipal LoginUser user
  ) {
    requestService.create(user.getId(), title, approverId);
    return "redirect:/requests";
  }

  // 処理の入口: GET /shinsei/requests/12
  @GetMapping("/{id:[0-9]+}")
  public String detail(
      @PathVariable Long id,
      @RequestParam(value = "from", required = false) String from,
      Model model,
      @AuthenticationPrincipal LoginUser user,
      HttpSession session
  ) {
    model.addAttribute("requestItem", requestService.findById(id, user.getId()));
    model.addAttribute("currentUserId", user.getId());
    if ("history".equals(from)) {
      model.addAttribute("backLabel", "← 申請履歴");
      model.addAttribute("backTo", buildHistoryBackUrl(session));
    } else {
      model.addAttribute("backLabel", "← 申請一覧");
      model.addAttribute("backTo", "/requests");
    }
    return "request/detail";
  }

  // 履歴検索から来たときは、直前の検索条件に戻す
  private String buildHistoryBackUrl(HttpSession session) {
    var condition = (HistorySearchCondition) session.getAttribute("historyCondition");
    if (condition == null) {
      return "/requests/history";
    }
    return UriComponentsBuilder.fromPath("/requests/history")
        .queryParamIfPresent("title", Optional.ofNullable(condition.getTitle()))
        .queryParamIfPresent("requestStatus", Optional.ofNullable(condition.getRequestStatus()))
        .queryParamIfPresent("createdFrom", Optional.ofNullable(condition.getCreatedFrom()))
        .queryParamIfPresent("createdTo", Optional.ofNullable(condition.getCreatedTo()))
        .toUriString();
  }

  // 処理の入口: POST /shinsei/requests/{id}/approve
  @PostMapping("/{id}/approve")
  public String approve(
      @PathVariable Long id,
      @AuthenticationPrincipal LoginUser user,
      RedirectAttributes redirectAttributes
  ) {
    var request = requestService.findById(id, user.getId());
    if (!"PENDING".equals(request.getStatus())) {
      redirectAttributes.addFlashAttribute(
          "errorMessage", "この申請は承認できません");
      return "redirect:/requests/" + id;
    }
    requestService.approve(id, user.getId());
    return "redirect:/requests";
  }

  // 処理の入口: GET /shinsei/requests/history
  @GetMapping("/history")
  public String history(
      @RequestParam(value = "title", required = false) String title,
      @RequestParam(value = "requestStatus", required = false) String requestStatus,
      @RequestParam(value = "createdFrom", required = false) String createdFrom,
      @RequestParam(value = "createdTo", required = false) String createdTo,
      Model model,
      @AuthenticationPrincipal LoginUser user,
      HttpSession session
  ) {
    session.setAttribute(
        "historySearchCondition",
        new HistorySearchCondition(title, requestStatus, createdFrom, createdTo));
    model.addAttribute("searchTitle", title);
    model.addAttribute("createdFrom", createdFrom);
    model.addAttribute("createdTo", createdTo);
    model.addAttribute(
        "results",
        requestService.searchHistory(user.getId(), title, requestStatus, createdFrom, createdTo)
    );
    return "request/history";
  }
}
