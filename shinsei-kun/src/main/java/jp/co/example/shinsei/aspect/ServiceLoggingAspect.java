package jp.co.example.shinsei.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ServiceLoggingAspect {
  private static final Logger log = LoggerFactory.getLogger(ServiceLoggingAspect.class);

  @Around("execution(* jp.co.example.shinsei.service..*(..))")
  public Object log(ProceedingJoinPoint joinPoint) throws Throwable {
    String name = joinPoint.getSignature().toShortString();
    log.debug("start {}", name);
    try {
      return joinPoint.proceed();
    } finally {
      log.debug("end {}", name);
    }
  }
}
