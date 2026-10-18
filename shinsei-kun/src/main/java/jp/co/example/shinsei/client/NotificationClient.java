package jp.co.example.shinsei.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/** 再現用の通知 API クライアント。タイムアウトを設定していないので、相手が応答を返さないと待ち続ける。 */
@Component
@Profile("investigation")
@Slf4j
public class NotificationClient {
  private final RestTemplate restTemplate = new RestTemplate();
  private final String url;

  public NotificationClient(@Value("${shinsei.notify.url:http://notify:9000/api/send}") String url) {
    this.url = url;
  }

  public void send(Long requestId, String to) {
    log.info("POST {} requestId={}", url, requestId);
    restTemplate.postForObject(url, Map.of("requestId", requestId, "to", to), String.class);
    log.info("sent requestId={}", requestId);
  }
}
