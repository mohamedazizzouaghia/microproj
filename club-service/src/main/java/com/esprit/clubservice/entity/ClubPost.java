package com.esprit.clubservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "club_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    @JsonIgnore
    private Club club;

    private Long authorId;
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
