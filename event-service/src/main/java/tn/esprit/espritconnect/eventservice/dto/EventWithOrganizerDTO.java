package tn.esprit.espritconnect.eventservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.esprit.espritconnect.eventservice.entity.Event;

/**
 * Combined DTO that pairs an Event with its organizer's details
 * fetched from user-service.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventWithOrganizerDTO {

    private Event event;
    private UserDTO organizer;
}
