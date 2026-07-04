package tn.esprit.espritconnect.eventservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.esprit.espritconnect.eventservice.entity.Event;
import tn.esprit.espritconnect.eventservice.entity.EventStatus;

import java.util.List;
import java.util.Map;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    long countByStatus(EventStatus status);

    @Query("SELECT e.category as category, COUNT(e) as count FROM Event e GROUP BY e.category")
    List<Map<String, Object>> countEventsByCategory();

    @Query("SELECT e.id as eventId, e.title as title, e.registeredCount as registrations FROM Event e")
    List<Map<String, Object>> getRegistrationsPerEvent();
}
