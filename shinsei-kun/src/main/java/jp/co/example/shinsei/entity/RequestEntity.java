package jp.co.example.shinsei.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RequestEntity {
  private Long id;
  private String title;
  private String status;
  private Long applicantId;
  private Long approverId;
  private String applicantEmail;
  private LocalDateTime createdAt;
  private String applicantName;
  private String approverName;
}
