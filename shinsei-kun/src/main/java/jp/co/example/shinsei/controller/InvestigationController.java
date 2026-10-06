package jp.co.example.shinsei.controller;

import jp.co.example.shinsei.dto.RequestResponse;
import jp.co.example.shinsei.security.LoginUser;
import jp.co.example.shinsei.service.InvestigationService;
import jp.co.example.shinsei.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@Profile("investigation")
@RequestMapping("/investigation")
@RequiredArgsConstructor
public class InvestigationController {
  private final InvestigationService investigationService;
  private final RequestService requestService;

  @GetMapping("/search")
  public List<RequestResponse> search(@RequestParam String title,
      @AuthenticationPrincipal LoginUser user) {
    return investigationService.search(user.getId(), title).stream()
        .map(RequestResponse::from).toList();
  }

  @GetMapping("/list")
  public List<NamedRequest> list(@AuthenticationPrincipal LoginUser user) {
    return investigationService.listWithNames(user.getId()).stream()
        .map(request -> new NamedRequest(RequestResponse.from(request), request.getApplicantName())).toList();
  }

  @PostMapping("/batch")
  public void batch(@RequestBody Batch body, @AuthenticationPrincipal LoginUser user) {
    investigationService.submitBatch(user.getId(), body.approverId(), body.titles());
  }

  @PostMapping("/form")
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
  }

  public record Batch(Long approverId, List<String> titles) {}
  public record NewRequest(String title, Long approverId) {}
  public record NamedRequest(RequestResponse request, String applicantName) {}
}
