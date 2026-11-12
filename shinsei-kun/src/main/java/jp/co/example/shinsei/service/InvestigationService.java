package jp.co.example.shinsei.service;

import jp.co.example.shinsei.client.NotificationClient;
import jp.co.example.shinsei.entity.RequestEntity;
import jp.co.example.shinsei.exception.ConflictException;
import jp.co.example.shinsei.exception.ForbiddenException;
import jp.co.example.shinsei.mapper.RequestMapper;
import jp.co.example.shinsei.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** 教材のシナリオを再現する不具合を残す。通常の画面とは別の入口で実行する。 */
@Service
@Profile("investigation")
@RequiredArgsConstructor
@Slf4j
public class InvestigationService {
  private final RequestMapper requestMapper;
  private final UserMapper userMapper;
  private final RequestService requestService;
  private final NotificationClient notificationClient;
  private String searchTitle;

  public List<RequestEntity> search(Long userId, String title) {
    searchTitle = title;
    log.debug("search user={} title={}", userId, title);
    beforeSearch();
    return requestMapper.searchHistory(userId, searchTitle, null, null, null);
  }

  // デバッガでここにブレークポイントを置き、別リクエストとの順序を確認する。
  protected void beforeSearch() {}

  // 申請履歴を CSV にする。検索条件なしの履歴検索で全件を読み込んでから組み立てる。
  public String exportCsv(Long userId) {
    List<RequestEntity> requests = requestMapper.searchHistory(userId, null, null, null, null);
    StringBuilder csv = new StringBuilder("id,title,status,applicant,approver,created_at\n");
    for (RequestEntity request : requests) {
      csv.append(request.getId()).append(',')
          .append(request.getTitle()).append(',')
          .append(request.getStatus()).append(',')
          .append(request.getApplicantName()).append(',')
          .append(request.getApproverName()).append(',')
          .append(request.getCreatedAt()).append('\n');
    }
    return csv.toString();
  }

  // 承認待ちの申請ごとに、承認者へのリマインドを別スレッドで送る。
  public int remindAll(Long userId) {
    List<RequestEntity> requests = requestMapper.findMine(userId);
    for (RequestEntity request : requests) {
      ExecutorService executor = Executors.newSingleThreadExecutor();
      executor.submit(() -> log.info("remind requestId={} approverId={}",
          request.getId(), request.getApproverId()));
    }
    return requests.size();
  }

  public List<RequestEntity> listWithNames(Long userId) {
    List<RequestEntity> requests = requestMapper.findMineWithoutNames(userId);
    for (RequestEntity request : requests) {
      request.setApplicantName(userMapper.findById(request.getApplicantId()).getDisplayName());
    }
    return requests;
  }

  public void submitBatch(Long userId, Long approverId, List<String> titles) {
    saveBatch(userId, approverId, titles);
  }

  @Transactional
  public void approveAndNotify(Long requestId, Long approverId) {
    RequestEntity request = requestService.findById(requestId, approverId);
    if (!approverId.equals(request.getApproverId())) {
      throw new ForbiddenException("承認権限がありません");
    }
    if (!"PENDING".equals(request.getStatus())) {
      throw new ConflictException("この申請は承認できません");
    }
    request.setStatus("APPROVED");
    requestMapper.update(request);
    notificationClient.send(request.getId(), request.getApplicantEmail());
  }

  // 承認の期限は申請日の 1 週間後。土日に当たるときは、次の平日にずらす。
  public LocalDate dueDate(Long requestId, Long userId) {
    RequestEntity request = requestService.findById(requestId, userId);
    LocalDate due = request.getCreatedAt().toLocalDate().plusDays(7);
    while (due.getDayOfWeek() == DayOfWeek.SATURDAY || due.getDayOfWeek() == DayOfWeek.SUNDAY) {
      due.plusDays(1);
    }
    return due;
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
  }
}
