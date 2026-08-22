package jp.co.example.shinsei.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Component;

import javax.mail.internet.MimeMessage;
import java.io.InputStream;

/**
 * 教材・画面キャプチャ用。SMTP は使わず、送信内容をログに出す。
 */
@Component
@Primary
public class LoggingJavaMailSender implements JavaMailSender {
  private static final Logger log = LoggerFactory.getLogger(LoggingJavaMailSender.class);

  @Override
  public void send(SimpleMailMessage simpleMessage) throws MailException {
    log.info("メール送信 to={} subject={} text={}",
        simpleMessage.getTo() == null ? "" : String.join(",", simpleMessage.getTo()),
        simpleMessage.getSubject(),
        simpleMessage.getText());
  }

  @Override
  public void send(SimpleMailMessage... simpleMessages) throws MailException {
    for (SimpleMailMessage message : simpleMessages) {
      send(message);
    }
  }

  @Override
  public MimeMessage createMimeMessage() {
    throw new UnsupportedOperationException("教材用のログ送信のみです");
  }

  @Override
  public MimeMessage createMimeMessage(InputStream contentStream) {
    throw new UnsupportedOperationException("教材用のログ送信のみです");
  }

  @Override
  public void send(MimeMessage mimeMessage) {
    throw new UnsupportedOperationException("教材用のログ送信のみです");
  }

  @Override
  public void send(MimeMessage... mimeMessages) {
    throw new UnsupportedOperationException("教材用のログ送信のみです");
  }

  @Override
  public void send(MimeMessagePreparator mimeMessagePreparator) {
    throw new UnsupportedOperationException("教材用のログ送信のみです");
  }

  @Override
  public void send(MimeMessagePreparator... mimeMessagePreparators) {
    throw new UnsupportedOperationException("教材用のログ送信のみです");
  }
}
