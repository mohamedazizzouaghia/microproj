package tn.esprit.espritconnect.incidentservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.espritconnect.incidentservice.dto.IncidentStatsDTO;
import tn.esprit.espritconnect.incidentservice.entity.Incident;
import tn.esprit.espritconnect.incidentservice.entity.IncidentStatus;
import tn.esprit.espritconnect.incidentservice.repository.IncidentRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final RabbitTemplate rabbitTemplate;

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident createIncident(Incident incident) {
        Incident saved = incidentRepository.save(incident);
        try {
            rabbitTemplate.convertAndSend("incidentQueue", 
                "Nouvel incident cree: " + saved.getTitle() + " (Priorite: " + saved.getPriority() + ")");
        } catch (Exception e) {
            System.err.println("RabbitMQ error: " + e.getMessage());
        }
        return saved;
    }

    public Incident updateStatus(Long id, IncidentStatus status) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        incident.setStatus(status);
        if (status == IncidentStatus.RESOLVED || status == IncidentStatus.CLOSED) {
            incident.setResolvedAt(LocalDateTime.now());
        }
        return incidentRepository.save(incident);
    }

    public Incident assignIncident(Long id, String assignedTo) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        incident.setAssignedTo(assignedTo);
        return incidentRepository.save(incident);
    }

    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }

    public IncidentStatsDTO getStats() {
        List<Incident> all = incidentRepository.findAll();

        long total = all.size();
        long open = all.stream().filter(i -> i.getStatus() == IncidentStatus.OPEN).count();
        long resolved = all.stream().filter(i -> i.getStatus() == IncidentStatus.RESOLVED || i.getStatus() == IncidentStatus.CLOSED).count();

        Map<String, Long> byCategory = all.stream()
                .collect(Collectors.groupingBy(i -> i.getCategory().name(), Collectors.counting()));

        Map<String, Long> byPriority = all.stream()
                .collect(Collectors.groupingBy(i -> i.getPriority().name(), Collectors.counting()));

        List<Incident> resolvedIncidents = all.stream()
                .filter(i -> i.getResolvedAt() != null && i.getCreatedAt() != null)
                .toList();

        double avgResolutionTime = 0;
        if (!resolvedIncidents.isEmpty()) {
            double totalHours = resolvedIncidents.stream()
                    .mapToDouble(i -> Duration.between(i.getCreatedAt(), i.getResolvedAt()).toHours())
                    .sum();
            avgResolutionTime = totalHours / resolvedIncidents.size();
        }

        return IncidentStatsDTO.builder()
                .total(total)
                .open(open)
                .resolved(resolved)
                .byCategory(byCategory)
                .byPriority(byPriority)
                .resolutionTime(avgResolutionTime)
                .build();
    }
}
