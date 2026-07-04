package tn.esprit.espritconnect.eventservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.espritconnect.eventservice.client.UserClient;
import tn.esprit.espritconnect.eventservice.dto.EventWithOrganizerDTO;
import tn.esprit.espritconnect.eventservice.dto.UserDTO;
import tn.esprit.espritconnect.eventservice.entity.Event;
import tn.esprit.espritconnect.eventservice.entity.EventRegistration;
import tn.esprit.espritconnect.eventservice.entity.EventStatus;
import tn.esprit.espritconnect.eventservice.repository.EventRegistrationRepository;
import tn.esprit.espritconnect.eventservice.repository.EventRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final UserClient userClient;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public Event createEvent(Event event) {
        if (event.getRegisteredCount() == null) event.setRegisteredCount(0);
        return eventRepository.save(event);
    }

    public EventWithOrganizerDTO getEventWithOrganizer(Long id) {
        Event event = getEventById(id);
        UserDTO organizer = userClient.getUserById(event.getOrganizerId());
        return new EventWithOrganizerDTO(event, organizer);
    }

    @Transactional
    public void registerToEvent(Long eventId, String userId) {
        Event event = getEventById(eventId);
        if (event.getCapacity() != null && event.getRegisteredCount() >= event.getCapacity()) {
            throw new RuntimeException("Event is full");
        }
        
        Optional<EventRegistration> existing = registrationRepository.findByEventIdAndUserId(eventId, userId);
        if (existing.isPresent()) {
            throw new RuntimeException("User is already registered to this event");
        }

        EventRegistration registration = new EventRegistration(null, eventId, userId, LocalDateTime.now());
        registrationRepository.save(registration);

        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);
    }

    @Transactional
    public void unregisterFromEvent(Long eventId, String userId) {
        Event event = getEventById(eventId);
        EventRegistration registration = registrationRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        registrationRepository.delete(registration);

        event.setRegisteredCount(event.getRegisteredCount() - 1);
        eventRepository.save(event);
    }

    public Map<String, Object> getEventStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", eventRepository.count());
        stats.put("upcoming", eventRepository.countByStatus(EventStatus.UPCOMING));
        stats.put("byCategory", eventRepository.countEventsByCategory());
        stats.put("registrationsPerEvent", eventRepository.getRegistrationsPerEvent());
        return stats;
    }
}
