package tn.esprit.espritconnect.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;

/**
 * Main entry point for the User Service microservice.
 * Registers with Eureka for service discovery.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

    @Bean
    public Queue incidentQueue() {
        return new Queue("incidentQueue", false);
    }

    @RabbitListener(queues = "incidentQueue")
    public void receiveMessage(String message) {
        System.out.println("=== NOTIFICATION RECUE DANS USER-SERVICE ===");
        System.out.println(message);
        System.out.println("============================================");
    }
}
