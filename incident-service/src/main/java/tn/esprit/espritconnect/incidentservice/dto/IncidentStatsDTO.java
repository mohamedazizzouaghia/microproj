package tn.esprit.espritconnect.incidentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentStatsDTO {
    private long total;
    private long open;
    private long resolved;
    private Map<String, Long> byCategory;
    private Map<String, Long> byPriority;
    private double resolutionTime; // Average resolution time in hours, or whatever unit
}
