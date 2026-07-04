package tn.esprit.espritconnect.reservationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.esprit.espritconnect.reservationservice.entity.Reservation;

/**
 * Combined DTO that pairs a Reservation with its associated Event details
 * fetched from event-service.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationWithEventDTO {

    private Reservation reservation;

    private EventDTO event;
}
