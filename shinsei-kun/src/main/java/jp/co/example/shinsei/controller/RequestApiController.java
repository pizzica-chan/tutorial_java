package jp.co.example.shinsei.controller;

import jp.co.example.shinsei.dto.RequestResponse;
import jp.co.example.shinsei.entity.RequestEntity;
import jp.co.example.shinsei.security.LoginUser;
import jp.co.example.shinsei.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestApiController {
  private final RequestService requestService;

  @GetMapping
  public List<RequestResponse> list(@AuthenticationPrincipal LoginUser user) {
    return requestService.findMine(user.getId()).stream()
        .map(RequestResponse::from)
        .toList();
  }

  @GetMapping("/{id}")
  public RequestResponse detail(@PathVariable Long id, @AuthenticationPrincipal LoginUser user) {
    return RequestResponse.from(requestService.findById(id, user.getId()));
  }

  @PostMapping
  public RequestEntity create(@RequestBody NewRequest body, @AuthenticationPrincipal LoginUser user) {
    return requestService.create(user.getId(), body.title(), body.approverId());
  }

  @PostMapping("/{id}/approve")
  public void approve(@PathVariable Long id, @AuthenticationPrincipal LoginUser user) {
    requestService.approve(id, user.getId());
  }

  public record NewRequest(String title, Long approverId) {}
}
