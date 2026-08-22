package jp.co.example.shinsei.service;

import jp.co.example.shinsei.entity.RequestEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
  private final JavaMailSender mailSender;

  public void notifyApplicant(RequestEntity request) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(request.getApplicantEmail());
    message.setSubject("申請が承認されました");
    message.setText(request.getTitle() + " が承認されました。");
    mailSender.send(message);
  }
}
