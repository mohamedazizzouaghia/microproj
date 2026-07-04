package tn.esprit.espritconnect.clubservice;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ClubMembership {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long clubId;
    private Long userId;
    private String role; // PRESIDENT / MEMBER
    private LocalDateTime joinedAt;
}
