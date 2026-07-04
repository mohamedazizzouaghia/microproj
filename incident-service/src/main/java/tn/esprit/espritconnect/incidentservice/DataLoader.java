package tn.esprit.espritconnect.incidentservice;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import tn.esprit.espritconnect.incidentservice.entity.Incident;
import tn.esprit.espritconnect.incidentservice.entity.IncidentCategory;
import tn.esprit.espritconnect.incidentservice.entity.IncidentPriority;
import tn.esprit.espritconnect.incidentservice.entity.IncidentStatus;
import tn.esprit.espritconnect.incidentservice.repository.IncidentRepository;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final IncidentRepository incidentRepository;

    @Override
    public void run(String... args) throws Exception {
        if (incidentRepository.count() == 0) {
            incidentRepository.save(Incident.builder()
                    .title("Leaking Pipe in Building A")
                    .description("Water is leaking from the ceiling in the main lobby.")
                    .location("Building A Lobby")
                    .category(IncidentCategory.MAINTENANCE)
                    .priority(IncidentPriority.URGENT)
                    .status(IncidentStatus.OPEN)
                    .reportedBy("user1")
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build());

            incidentRepository.save(Incident.builder()
                    .title("Broken Projector in Room 101")
                    .description("The projector is not turning on.")
                    .location("Room 101")
                    .category(IncidentCategory.MAINTENANCE)
                    .priority(IncidentPriority.HIGH)
                    .status(IncidentStatus.IN_PROGRESS)
                    .reportedBy("user2")
                    .assignedTo("tech1")
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .build());

            incidentRepository.save(Incident.builder()
                    .title("Lost Keys")
                    .description("Found a set of keys near the library.")
                    .location("Library")
                    .category(IncidentCategory.SECURITY)
                    .priority(IncidentPriority.LOW)
                    .status(IncidentStatus.RESOLVED)
                    .reportedBy("user3")
                    .assignedTo("guard1")
                    .createdAt(LocalDateTime.now().minusDays(3))
                    .resolvedAt(LocalDateTime.now().minusDays(1))
                    .build());

            incidentRepository.save(Incident.builder()
                    .title("Spill in Cafeteria")
                    .description("Someone spilled coffee near the entrance.")
                    .location("Cafeteria")
                    .category(IncidentCategory.CLEANING)
                    .priority(IncidentPriority.MEDIUM)
                    .status(IncidentStatus.CLOSED)
                    .reportedBy("user4")
                    .assignedTo("janitor1")
                    .createdAt(LocalDateTime.now().minusHours(5))
                    .resolvedAt(LocalDateTime.now().minusHours(1))
                    .build());

            incidentRepository.save(Incident.builder()
                    .title("Suspicious Person")
                    .description("Unidentified person loitering in the parking lot.")
                    .location("Parking Lot B")
                    .category(IncidentCategory.SECURITY)
                    .priority(IncidentPriority.URGENT)
                    .status(IncidentStatus.OPEN)
                    .reportedBy("user5")
                    .createdAt(LocalDateTime.now().minusMinutes(30))
                    .build());

            incidentRepository.save(Incident.builder()
                    .title("AC not working")
                    .description("Room is too hot, AC is blowing warm air.")
                    .location("Room 205")
                    .category(IncidentCategory.MAINTENANCE)
                    .priority(IncidentPriority.MEDIUM)
                    .status(IncidentStatus.OPEN)
                    .reportedBy("user6")
                    .createdAt(LocalDateTime.now().minusHours(2))
                    .build());

            incidentRepository.save(Incident.builder()
                    .title("Trash cans full")
                    .description("Trash cans overflowing in the courtyard.")
                    .location("Courtyard")
                    .category(IncidentCategory.CLEANING)
                    .priority(IncidentPriority.LOW)
                    .status(IncidentStatus.IN_PROGRESS)
                    .reportedBy("user7")
                    .assignedTo("janitor2")
                    .createdAt(LocalDateTime.now().minusHours(4))
                    .build());

            incidentRepository.save(Incident.builder()
                    .title("Network Outage")
                    .description("Wi-Fi is down in the entire library.")
                    .location("Library")
                    .category(IncidentCategory.OTHER)
                    .priority(IncidentPriority.HIGH)
                    .status(IncidentStatus.RESOLVED)
                    .reportedBy("user8")
                    .assignedTo("it_support")
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .resolvedAt(LocalDateTime.now().minusHours(12))
                    .build());

            incidentRepository.save(Incident.builder()
                    .title("Elevator stuck")
                    .description("Elevator is stuck on the 3rd floor.")
                    .location("Building B Elevator")
                    .category(IncidentCategory.MAINTENANCE)
                    .priority(IncidentPriority.URGENT)
                    .status(IncidentStatus.CLOSED)
                    .reportedBy("user9")
                    .assignedTo("maint_team")
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .resolvedAt(LocalDateTime.now().minusDays(1))
                    .build());

            incidentRepository.save(Incident.builder()
                    .title("Flickering Lights")
                    .description("Lights are flickering in the hallway.")
                    .location("2nd Floor Hallway")
                    .category(IncidentCategory.MAINTENANCE)
                    .priority(IncidentPriority.LOW)
                    .status(IncidentStatus.OPEN)
                    .reportedBy("user10")
                    .createdAt(LocalDateTime.now().minusDays(4))
                    .build());
        }
    }
}
