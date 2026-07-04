package tn.esprit.espritconnect.eventservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDate date;

    private Long organizerId;
    
    private Integer capacity;
    
    private Integer registeredCount;
    
    @Enumerated(EnumType.STRING)
    private EventCategory category;
    
    @Enumerated(EnumType.STRING)
    private EventStatus status;
}
