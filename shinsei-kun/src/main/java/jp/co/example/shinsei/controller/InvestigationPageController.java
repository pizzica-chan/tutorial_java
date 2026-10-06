package jp.co.example.shinsei.controller;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Profile("investigation")
@RequestMapping("/investigation")
public class InvestigationPageController {
  @GetMapping
  public String page() {
    return "request/investigation";
  }
}
