package jp.co.example.shinsei;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("jp.co.example.shinsei.mapper")
public class ShinseiApplication {
  public static void main(String[] args) {
    SpringApplication.run(ShinseiApplication.class, args);
  }
}
