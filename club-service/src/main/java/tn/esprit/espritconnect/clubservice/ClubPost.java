package tn.esprit.espritconnect.clubservice;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ClubPost {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long clubId;
    private Long authorId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
}
