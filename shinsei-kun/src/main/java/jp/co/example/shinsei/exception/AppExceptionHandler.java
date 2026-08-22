package jp.co.example.shinsei.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@ControllerAdvice
public class AppExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  public Object notFound(NotFoundException ex, HttpServletRequest request) {
    if (isApi(request)) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
    }
    ModelAndView mav = new ModelAndView("error/not-found");
    mav.setStatus(HttpStatus.NOT_FOUND);
    mav.addObject("message", ex.getMessage());
    return mav;
  }

  @ExceptionHandler(ForbiddenException.class)
  public Object forbidden(ForbiddenException ex, HttpServletRequest request) {
    if (isApi(request)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", ex.getMessage()));
    }
    ModelAndView mav = new ModelAndView("error/forbidden");
    mav.setStatus(HttpStatus.FORBIDDEN);
    mav.addObject("message", ex.getMessage());
    return mav;
  }

  private boolean isApi(HttpServletRequest request) {
    return request.getRequestURI().contains("/api/");
  }
}
