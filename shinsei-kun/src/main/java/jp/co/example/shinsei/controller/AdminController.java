package jp.co.example.shinsei.controller;

import jp.co.example.shinsei.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
  private final UserMapper userMapper;

  @GetMapping("/users")
  public String users(Model model) {
    model.addAttribute("users", userMapper.findAll());
    return "admin/users";
  }
}
