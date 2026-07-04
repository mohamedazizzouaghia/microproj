package tn.esprit.espritconnect.eventservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import tn.esprit.espritconnect.eventservice.entity.Event;
import tn.esprit.espritconnect.eventservice.entity.EventCategory;
import tn.esprit.espritconnect.eventservice.entity.EventStatus;
import tn.esprit.espritconnect.eventservice.repository.EventRepository;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final EventRepository eventRepository;

    public DataLoader(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (eventRepository.count() == 0) {
            Event e1 = new Event(null, "Tech Talk", "Talk on latest tech", LocalDate.now().plusDays(10), 1L, 100, 0, EventCategory.SEMINAR, EventStatus.UPCOMING);
            Event e2 = new Event(null, "Hackathon", "Annual hackathon", LocalDate.now().plusDays(20), 2L, 50, 0, EventCategory.COMPETITION, EventStatus.UPCOMING);
            
            eventRepository.saveAll(List.of(e1, e2));
            System.out.println("Sample events loaded.");
        }
    }
}
