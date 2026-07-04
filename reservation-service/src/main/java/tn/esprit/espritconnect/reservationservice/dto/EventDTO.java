package tn.esprit.espritconnect.reservationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Data Transfer Object representing an Event fetched from event-service via Feign.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {

    private Long id;

    private String title;

    private String description;

    private LocalDate date;

    private Long organizerId;
}
