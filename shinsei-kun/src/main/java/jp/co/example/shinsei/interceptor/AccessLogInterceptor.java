package jp.co.example.shinsei.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class AccessLogInterceptor implements HandlerInterceptor {
  private static final Logger log = LoggerFactory.getLogger(AccessLogInterceptor.class);

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    log.info("{} {}", request.getMethod(), request.getRequestURI());
    return true;
  }
}
