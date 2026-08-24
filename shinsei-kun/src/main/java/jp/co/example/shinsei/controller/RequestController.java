package jp.co.example.shinsei.controller;

import jp.co.example.shinsei.mapper.UserMapper;
import jp.co.example.shinsei.security.LoginUser;
import jp.co.example.shinsei.service.RequestService;
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
  @GetMapping("/{id}")
  public String detail(@PathVariable Long id, Model model, @AuthenticationPrincipal LoginUser user) {
    model.addAttribute("requestItem", requestService.findById(id, user.getId()));
    model.addAttribute("currentUserId", user.getId());
    return "request/detail";
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
}
