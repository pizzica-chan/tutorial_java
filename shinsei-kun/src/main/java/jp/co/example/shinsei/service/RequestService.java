package jp.co.example.shinsei.service;

import jp.co.example.shinsei.entity.RequestEntity;
import jp.co.example.shinsei.exception.ForbiddenException;
import jp.co.example.shinsei.exception.NotFoundException;
import jp.co.example.shinsei.mapper.RequestMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {
  private final RequestMapper requestMapper;
  private final MailService mailService;

  public List<RequestEntity> findMine(Long userId) {
    return requestMapper.findMine(userId);
  }

  public RequestEntity findById(Long id, Long userId) {
    RequestEntity request = requestMapper.findById(id, userId);
    if (request == null) {
      throw new NotFoundException("指定した申請は無い、または見る権限がありません。");
    }
    return request;
  }

  public RequestEntity create(Long applicantId, String title, Long approverId) {
    RequestEntity request = new RequestEntity();
    request.setTitle(title);
    request.setApplicantId(applicantId);
    request.setApproverId(approverId);
    request.setStatus("PENDING");
    requestMapper.insert(request);
    return request;
  }

  @Transactional
  public void approve(Long requestId, Long approverId) {
    RequestEntity request = requestMapper.findById(requestId, approverId);
    if (request == null) {
      throw new NotFoundException("指定した申請は無い、または見る権限がありません。");
    }
    if (!request.getApproverId().equals(approverId)) {
      throw new ForbiddenException("承認権限がありません");
    }
    request.setStatus("APPROVED");
    requestMapper.update(request);
    mailService.notifyApplicant(request);
  }

  public List<RequestEntity> searchHistory(
      Long userId,
      String title,
      String requestStatus,
      String createdFrom,
      String createdTo
  ) {
    return requestMapper.searchHistory(userId, title, requestStatus, createdFrom, createdTo);
  }
}
