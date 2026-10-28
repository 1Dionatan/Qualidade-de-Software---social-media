package com.demoapp.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

  @Bean
  public RestTemplate restTemplate() {
    return new RestTemplate();
  }

  @Bean
  public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatProtocolCustomizer() {
    return factory -> factory.setProtocol("org.apache.coyote.http11.Http11Nio2Protocol");
  }

}

