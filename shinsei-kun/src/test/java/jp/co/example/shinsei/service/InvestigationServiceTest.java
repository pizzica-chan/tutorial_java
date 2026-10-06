package jp.co.example.shinsei.service;

import jp.co.example.shinsei.controller.InvestigationController;
import jp.co.example.shinsei.mapper.RequestMapper;
import jp.co.example.shinsei.mapper.UserMapper;
import jp.co.example.shinsei.security.LoginUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.sql.Connection;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Signature;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("investigation")
class InvestigationServiceTest {
  @SpyBean InvestigationService service;
  @SpyBean UserMapper users;
  @Autowired RequestMapper requests;
  @Autowired JdbcTemplate jdbc;
  @Autowired InvestigationController controller;
  @Autowired MockMvc mvc;
  @Autowired SqlCounter sqlCounter;

  @Test
  void authenticatedPageAndPostsUseCsrfAndExpectedResponses() throws Exception {
    LoginUser user = new LoginUser(7L, "yamada", "", "山田太郎", "yamada@example.co.jp", "USER");
    MockHttpSession session = new MockHttpSession();
    session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
        new SecurityContextImpl(new UsernamePasswordAuthenticationToken(user, "", user.getAuthorities())));
    var page = mvc.perform(get("/investigation").session(session))
        .andExpect(status().isOk()).andExpect(view().name("request/investigation")).andReturn();
    CsrfToken token = (CsrfToken) page.getRequest().getAttribute(CsrfToken.class.getName());
    assertNotNull(token);
    mvc.perform(get("/investigation/list").session(session))
        .andExpect(status().isOk()).andExpect(jsonPath("$[0].applicantName").exists());
    mvc.perform(post("/investigation/api").session(session)
        .contentType("application/json").content("{\"title\":\"\",\"approverId\":3}"))
        .andExpect(status().isForbidden());
    mvc.perform(post("/investigation/form").session(session)
        .param("title", "").param("approverId", "3").param(token.getParameterName(), token.getToken()))
        .andExpect(status().isBadRequest());
    int before = count("");
    try {
      mvc.perform(post("/investigation/api").session(session)
          .header(token.getHeaderName(), token.getToken())
          .contentType("application/json").content("{\"title\":\"\",\"approverId\":3}"))
          .andExpect(status().isOk()).andExpect(jsonPath("$.title").value(""));
      assertEquals(before + 1, count(""));
    } finally {
      jdbc.update("DELETE FROM t_request WHERE title = ''");
    }
  }

  @Test
  void internalCallCommitsButProxyCallRollsBack() {
    String title = "transaction-test";
    jdbc.update("DELETE FROM t_request WHERE title = ?", title);
    try {
      assertThrows(IllegalArgumentException.class,
          () -> service.submitBatch(7L, 3L, List.of(title, "")));
      assertEquals(1, count(title));
      jdbc.update("DELETE FROM t_request WHERE title = ?", title);
      assertThrows(IllegalArgumentException.class,
          () -> service.saveBatch(7L, 3L, List.of(title, "")));
      assertEquals(0, count(title));
    } finally {
      jdbc.update("DELETE FROM t_request WHERE title = ?", title);
    }
  }

  @Test
  void oneNameQueryPerRequest() {
    int size = requests.findMineWithoutNames(7L).size();
    assertTrue(size > 1);
    clearInvocations(users);
    sqlCounter.reset();
    var result = service.listWithNames(7L);
    assertEquals(size, result.size());
    verify(users, times(size)).findById(anyLong());
    assertTrue(result.stream().allMatch(request -> request.getApplicantName() != null));
    assertEquals(1, sqlCounter.requestQueries());
    assertEquals(size, sqlCounter.userQueries());
  }

  @Test
  void threeHundredRequestsExecuteThreeHundredAndOneQueries() {
    String title = "nplus-one-test";
    int initialSize = requests.findMineWithoutNames(7L).size();
    try {
      for (int i = initialSize; i < 300; i++) {
        jdbc.update("INSERT INTO t_request (title, status, applicant_id, approver_id, created_at) VALUES (?, 'PENDING', 7, 3, CURRENT_TIMESTAMP)", title);
      }
      sqlCounter.reset();
      assertEquals(300, service.listWithNames(7L).size());
      assertEquals(1, sqlCounter.requestQueries());
      assertEquals(300, sqlCounter.userQueries());
    } finally {
      jdbc.update("DELETE FROM t_request WHERE title = ?", title);
    }
  }

  @Test
  void formRejectsEmptyTitleButApiInsertsIt() {
    LoginUser user = mock(LoginUser.class);
    when(user.getId()).thenReturn(7L);
    assertThrows(ResponseStatusException.class, () -> controller.form("", 3L, user));
    int before = count("");
    try {
      controller.api(new InvestigationController.NewRequest("", 3L), user);
      assertEquals(before + 1, count(""));
    } finally {
      jdbc.update("DELETE FROM t_request WHERE title = ''");
    }
  }

  @Test
  void overlappingSearchOverwritesTitleButKeepsUserScope() throws Exception {
    CountDownLatch firstPaused = new CountDownLatch(1);
    CountDownLatch resumeFirst = new CountDownLatch(1);
    AtomicInteger calls = new AtomicInteger();
    doAnswer(invocation -> {
      if (calls.incrementAndGet() == 1) {
        firstPaused.countDown();
        assertTrue(resumeFirst.await(5, TimeUnit.SECONDS));
      }
      return null;
    }).when(service).beforeSearch();
    ExecutorService executor = Executors.newSingleThreadExecutor();
    try {
      Future<?> first = executor.submit(() -> {
        var result = service.search(7L, "休暇");
        assertFalse(result.isEmpty());
        assertTrue(result.stream().allMatch(request -> request.getTitle().contains("交通費")));
        assertTrue(result.stream().allMatch(request ->
            Long.valueOf(7).equals(request.getApplicantId()) || Long.valueOf(7).equals(request.getApproverId())));
      });
      assertTrue(firstPaused.await(5, TimeUnit.SECONDS));
      service.search(3L, "交通費");
      resumeFirst.countDown();
      first.get(5, TimeUnit.SECONDS);
    } finally {
      resumeFirst.countDown();
      executor.shutdownNow();
    }
  }

  private int count(String title) {
    return jdbc.queryForObject("SELECT COUNT(*) FROM t_request WHERE title = ?", Integer.class, title);
  }

  @TestConfiguration
  static class QueryCountingConfiguration {
    @Bean
    SqlCounter sqlCounter() { return new SqlCounter(); }
  }

  @Intercepts(@Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class, Integer.class}))
  static class SqlCounter implements Interceptor {
    int requestQueries;
    int userQueries;

    void reset() { requestQueries = 0; userQueries = 0; }
    int requestQueries() { return requestQueries; }
    int userQueries() { return userQueries; }

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
      String sql = ((StatementHandler) invocation.getTarget()).getBoundSql().getSql();
      if (sql.contains("FROM t_request")) requestQueries++;
      if (sql.contains("FROM t_user")) userQueries++;
      return invocation.proceed();
    }
  }
}
