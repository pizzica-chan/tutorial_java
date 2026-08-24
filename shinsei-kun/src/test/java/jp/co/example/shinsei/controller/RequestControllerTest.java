package jp.co.example.shinsei.controller;

import jp.co.example.shinsei.entity.RequestEntity;
import jp.co.example.shinsei.mapper.UserMapper;
import jp.co.example.shinsei.security.LoginUser;
import jp.co.example.shinsei.service.RequestService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestControllerTest {
  @Mock
  private RequestService requestService;
  @Mock
  private UserMapper userMapper;
  @Mock
  private LoginUser loginUser;
  @Mock
  private RedirectAttributes redirectAttributes;
  @InjectMocks
  private RequestController requestController;

  @Test
  void approve_redirectsWithMessageWhenRequestIsAlreadyApproved() {
    RequestEntity request = new RequestEntity();
    request.setId(11L);
    request.setStatus("APPROVED");
    when(loginUser.getId()).thenReturn(7L);
    when(requestService.findById(11L, 7L)).thenReturn(request);

    String view = requestController.approve(11L, loginUser, redirectAttributes);

    assertEquals("redirect:/requests/11", view);
    verify(redirectAttributes).addFlashAttribute(
        "errorMessage", "この申請は承認できません");
    verify(requestService, never()).approve(11L, 7L);
  }
}
