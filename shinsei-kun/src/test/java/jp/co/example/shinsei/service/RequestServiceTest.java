package jp.co.example.shinsei.service;

import jp.co.example.shinsei.entity.RequestEntity;
import jp.co.example.shinsei.mapper.RequestMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestServiceTest {
  @Mock
  private RequestMapper requestMapper;
  @Mock
  private MailService mailService;
  @InjectMocks
  private RequestService requestService;

  @Test
  void approve_updatesStatusAndSendsMail() {
    RequestEntity request = new RequestEntity();
    request.setId(1L);
    request.setApproverId(10L);
    request.setStatus("PENDING");
    when(requestMapper.findById(1L, 10L)).thenReturn(request);

    requestService.approve(1L, 10L);

    assertEquals("APPROVED", request.getStatus());
    verify(requestMapper).update(request);
    verify(mailService).notifyApplicant(request);
  }

  @Test
  void approve_throwsNullPointerExceptionWhenApproverIsMissing() {
    RequestEntity request = new RequestEntity();
    request.setId(16L);
    request.setApproverId(null);
    request.setStatus("PENDING");
    when(requestMapper.findById(16L, 7L)).thenReturn(request);

    assertThrows(NullPointerException.class, () -> requestService.approve(16L, 7L));

    verify(requestMapper, never()).update(request);
    verify(mailService, never()).notifyApplicant(request);
  }
}
