package tn.esprit.espritconnect.clubservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;

@Component
public class DataLoader {

    @Autowired private ClubRepository clubRepository;

    @PostConstruct
    public void loadData() {
        if(clubRepository.count() == 0) {
            Club c1 = Club.builder().name("Esprit AI").description("AI and Machine Learning").category("ACADEMIC").presidentId(1L).memberCount(45).createdAt(LocalDateTime.now()).logoUrl("logo1.png").build();
            Club c2 = Club.builder().name("Esprit Music").description("Music lovers").category("CULTURAL").presidentId(2L).memberCount(120).createdAt(LocalDateTime.now()).logoUrl("logo2.png").build();
            Club c3 = Club.builder().name("Esprit Robotics").description("Build robots").category("ACADEMIC").presidentId(3L).memberCount(30).createdAt(LocalDateTime.now()).logoUrl("logo3.png").build();
            Club c4 = Club.builder().name("Esprit Football").description("Football team").category("SPORT").presidentId(4L).memberCount(60).createdAt(LocalDateTime.now()).logoUrl("logo4.png").build();
            Club c5 = Club.builder().name("Esprit Theatre").description("Drama and acting").category("CULTURAL").presidentId(5L).memberCount(25).createdAt(LocalDateTime.now()).logoUrl("logo5.png").build();
            Club c6 = Club.builder().name("Esprit E-Sports").description("Gaming").category("OTHER").presidentId(6L).memberCount(200).createdAt(LocalDateTime.now()).logoUrl("logo6.png").build();
            
            clubRepository.save(c1);
            clubRepository.save(c2);
            clubRepository.save(c3);
            clubRepository.save(c4);
            clubRepository.save(c5);
            clubRepository.save(c6);
        }
    }
}
