package jp.co.example.shinsei.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.CookieManager;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.regex.Pattern;
import static org.junit.jupiter.api.Assertions.*;

/** モックの Controller 呼び出しではなく、ログインと CSRF を含む実 HTTP で検証する。 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("investigation")
class InvestigationHttpTest {
  @LocalServerPort int port;
  @Autowired JdbcTemplate jdbc;
  @Autowired ObjectMapper json;

  @Test
  void loggedInUserCanReproduceValidationDifferenceAndPartialBatchCommit() throws Exception {
    HttpClient client = HttpClient.newBuilder().cookieHandler(new CookieManager())
        .followRedirects(HttpClient.Redirect.NORMAL).build();
    var login = get(client, "/login");
    assertEquals(200, login.statusCode());
    String token = csrf(login.body());
    var signedIn = post(client, "/login", "application/x-www-form-urlencoded",
        "username=yamada&password=password&_csrf=" + token, null);
    assertEquals(200, signedIn.statusCode());
    assertTrue(signedIn.uri().getPath().endsWith("/requests"), signedIn.uri().toString());
    var page = get(client, "/investigation");
    assertEquals(200, page.statusCode());
    assertTrue(page.body().contains("調査用の申請"));
    token = csrf(page.body());
    var list = get(client, "/investigation/list");
    assertEquals(200, list.statusCode());
    assertEquals(4, json.readTree(list.body()).size());
    assertTrue(json.readTree(list.body()).get(0).hasNonNull("applicantName"));
    var search = get(client, "/investigation/search?title=%E4%BC%91%E6%9A%87");
    assertEquals(200, search.statusCode());
    assertEquals("休暇申請", json.readTree(search.body()).get(0).get("title").asText());
    var rejected = post(client, "/investigation/form", "application/x-www-form-urlencoded",
        "title=&approverId=3&_csrf=" + token, null);
    assertEquals(400, rejected.statusCode());
    var noCsrf = post(client, "/investigation/api", "application/json",
        "{\"title\":\"\",\"approverId\":3}", null);
    assertEquals(403, noCsrf.statusCode());
    Long createdId = null;
    String batchTitle = "http-batch-test";
    try {
      var accepted = post(client, "/investigation/api", "application/json",
          "{\"title\":\"\",\"approverId\":3}", token);
      assertEquals(200, accepted.statusCode());
      createdId = json.readTree(accepted.body()).get("id").asLong();
      assertEquals("", jdbc.queryForObject("SELECT title FROM t_request WHERE id = ?", String.class, createdId));
      var failed = post(client, "/investigation/batch", "application/json",
          "{\"approverId\":3,\"titles\":[\"" + batchTitle + "\",\"\"]}", token);
      assertEquals(500, failed.statusCode());
      assertEquals(1, jdbc.queryForObject("SELECT COUNT(*) FROM t_request WHERE title = ?", Integer.class, batchTitle));
    } finally {
      if (createdId != null) jdbc.update("DELETE FROM t_request WHERE id = ?", createdId);
      jdbc.update("DELETE FROM t_request WHERE title = ?", batchTitle);
    }
  }

  private HttpResponse<String> get(HttpClient client, String path) throws Exception {
    return client.send(HttpRequest.newBuilder(uri(path)).GET().build(), HttpResponse.BodyHandlers.ofString());
  }

  private HttpResponse<String> post(HttpClient client, String path, String contentType, String body, String csrf) throws Exception {
    var request = HttpRequest.newBuilder(uri(path)).header("Content-Type", contentType)
        .header("Accept", "application/json").POST(HttpRequest.BodyPublishers.ofString(body));
    if (csrf != null) request.header("X-CSRF-TOKEN", csrf);
    return client.send(request.build(), HttpResponse.BodyHandlers.ofString());
  }

  private URI uri(String path) { return URI.create("http://127.0.0.1:" + port + "/shinsei" + path); }

  private String csrf(String html) {
    var match = Pattern.compile("name=\"_csrf\"[^>]*value=\"([^\"]+)\"").matcher(html);
    assertTrue(match.find(), "CSRF hidden input must be rendered");
    return match.group(1);
  }
}
