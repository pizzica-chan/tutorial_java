package jp.co.example.shinsei.dto;

import jp.co.example.shinsei.entity.RequestEntity;

import java.time.LocalDateTime;

public record RequestResponse(
    Long id,
    String title,
    String status,
    Long applicantId,
    Long approverId,
    String applicantEmail,
    LocalDateTime createdAt
) {
  public static RequestResponse from(RequestEntity entity) {
    return new RequestResponse(
        entity.getId(),
        entity.getTitle(),
        entity.getStatus(),
        entity.getApplicantId(),
        entity.getApproverId(),
        entity.getApplicantEmail(),
        entity.getCreatedAt()
    );
  }
}
