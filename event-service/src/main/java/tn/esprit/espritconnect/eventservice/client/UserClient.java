package tn.esprit.espritconnect.eventservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.esprit.espritconnect.eventservice.dto.UserDTO;

/**
 * Feign client for communicating with user-service.
 * The service name "user-service" is resolved via Eureka service discovery.
 */
@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/users/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);
}
