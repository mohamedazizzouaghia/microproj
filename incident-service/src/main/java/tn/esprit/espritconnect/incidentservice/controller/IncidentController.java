package tn.esprit.espritconnect.incidentservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.espritconnect.incidentservice.dto.IncidentStatsDTO;
import tn.esprit.espritconnect.incidentservice.entity.Incident;
import tn.esprit.espritconnect.incidentservice.entity.IncidentStatus;
import tn.esprit.espritconnect.incidentservice.service.IncidentService;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping
    public ResponseEntity<List<Incident>> getIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Incident>> getAllIncidentsAdmin() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @PostMapping
    public ResponseEntity<Incident> createIncident(@RequestBody Incident incident) {
        return ResponseEntity.ok(incidentService.createIncident(incident));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Incident> updateStatus(@PathVariable Long id, @RequestParam IncidentStatus status) {
        return ResponseEntity.ok(incidentService.updateStatus(id, status));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Incident> assignIncident(@PathVariable Long id, @RequestParam String assignedTo) {
        return ResponseEntity.ok(incidentService.assignIncident(id, assignedTo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<IncidentStatsDTO> getStats() {
        return ResponseEntity.ok(incidentService.getStats());
    }
}
