package jp.co.example.shinsei.web;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HistorySearchCondition {
  private String title;
  private String requestStatus;
  private String createdFrom;
  private String createdTo;
}
