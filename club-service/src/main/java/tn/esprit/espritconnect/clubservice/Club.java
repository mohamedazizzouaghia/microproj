package tn.esprit.espritconnect.clubservice;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Club {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String category;
    private Long presidentId;
    private Integer memberCount;
    private String logoUrl;
    private LocalDateTime createdAt;
}
