package tn.esprit.espritconnect.reservationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.esprit.espritconnect.reservationservice.dto.EventDTO;

/**
 * Feign client for communicating with event-service.
 * Uses Eureka service discovery to resolve the event-service URL.
 */
@FeignClient(name = "event-service")
public interface EventClient {

    /**
     * Fetches an event by its ID from event-service.
     *
     * @param id the event ID
     * @return the event details as EventDTO
     */
    @GetMapping("/events/{id}")
    EventDTO getEventById(@PathVariable("id") Long id);
}
