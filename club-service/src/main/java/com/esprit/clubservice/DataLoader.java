package com.esprit.clubservice;

import com.esprit.clubservice.entity.Club;
import com.esprit.clubservice.entity.ClubPost;
import com.esprit.clubservice.service.ClubService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader {

    private final ClubService clubService;

    @PostConstruct
    public void loadData() {
        if (clubService.getAllClubs().isEmpty()) {
            for (int i = 1; i <= 6; i++) {
                Club club = Club.builder()
                        .name("Club " + i)
                        .description("Description for club " + i)
                        .category(i % 2 == 0 ? "Tech" : "Sports")
                        .presidentId((long) i)
                        .logoUrl("https://example.com/logo" + i + ".png")
                        .build();

                club = clubService.createClub(club);

                // Add 3 members to each club
                for (int j = 1; j <= 3; j++) {
                    clubService.joinClub(club.getId(), (long) (i * 10 + j), "MEMBER");
                }

                // Add 2 posts to each club
                for (int j = 1; j <= 2; j++) {
                    ClubPost post = ClubPost.builder()
                            .authorId((long) (i * 10 + j))
                            .title("Post " + j + " in " + club.getName())
                            .content("This is the content for post " + j + " in club " + i)
                            .build();
                    clubService.createClubPost(club.getId(), post);
                }
            }
            System.out.println("DataLoader: 6 clubs created with memberships and posts.");
        }
    }
}
