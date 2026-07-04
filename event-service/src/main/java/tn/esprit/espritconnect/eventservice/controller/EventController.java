package tn.esprit.espritconnect.eventservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.espritconnect.eventservice.dto.EventWithOrganizerDTO;
import tn.esprit.espritconnect.eventservice.entity.Event;
import tn.esprit.espritconnect.eventservice.service.EventService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event created = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}/with-organizer")
    public ResponseEntity<EventWithOrganizerDTO> getEventWithOrganizer(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventWithOrganizer(id));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<Void> registerToEvent(@PathVariable Long id, @RequestParam String userId) {
        eventService.registerToEvent(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/unregister")
    public ResponseEntity<Void> unregisterFromEvent(@PathVariable Long id, @RequestParam String userId) {
        eventService.unregisterFromEvent(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getEventStats() {
        return ResponseEntity.ok(eventService.getEventStats());
    }
}
