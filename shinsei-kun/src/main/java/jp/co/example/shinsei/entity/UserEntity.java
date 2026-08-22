package jp.co.example.shinsei.entity;

import lombok.Data;

@Data
public class UserEntity {
  private Long id;
  private String username;
  private String password;
  private String displayName;
  private String email;
  private String role;
}
