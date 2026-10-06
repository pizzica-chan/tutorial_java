package jp.co.example.shinsei.service;

import jp.co.example.shinsei.entity.RequestEntity;
import jp.co.example.shinsei.mapper.RequestMapper;
import jp.co.example.shinsei.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import java.util.List;

/** 教材のシナリオを再現する不具合を残す。通常の画面とは別の入口で実行する。 */
@Service
@Profile("investigation")
@RequiredArgsConstructor
@Slf4j
public class InvestigationService {
  private final RequestMapper requestMapper;
  private final UserMapper userMapper;
  private final RequestService requestService;
  private String searchTitle;

  public List<RequestEntity> search(Long userId, String title) {
    searchTitle = title;
    log.debug("search user={} title={}", userId, title);
    beforeSearch();
    return requestMapper.searchHistory(userId, searchTitle, null, null, null);
  }

  // デバッガでここにブレークポイントを置き、別リクエストとの順序を確認する。
  protected void beforeSearch() {}

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
