package jp.co.example.shinsei.service;

import jp.co.example.shinsei.entity.RequestEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {
  private final JavaMailSender mailSender;

  public void notifyApplicant(RequestEntity request) {
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(request.getApplicantEmail());
      message.setSubject(request.getTitle().substring(0, 10) + " が承認されました");
      message.setText(request.getTitle() + " が承認されました。");
      mailSender.send(message);
    } catch (Exception e) {
      log.warn("通知メールの送信に失敗しました requestId={}", request.getId());
    }
  }
}
