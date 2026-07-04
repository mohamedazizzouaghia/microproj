package tn.esprit.espritconnect.userservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import tn.esprit.espritconnect.userservice.entity.UserProfile;
import tn.esprit.espritconnect.userservice.repository.UserProfileRepository;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserProfileRepository userRepository;

    public DataLoader(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            UserProfile u1 = new UserProfile(null, "u1", "Alice", "Smith", "alice@example.com", "Computer Science", "2024", "12345678", "http://example.com/alice.png", "Bio of Alice");
            UserProfile u2 = new UserProfile(null, "u2", "Bob", "Johnson", "bob@example.com", "Mathematics", "2023", "87654321", "http://example.com/bob.png", "Bio of Bob");
            UserProfile u3 = new UserProfile(null, "u3", "Charlie", "Brown", "charlie@example.com", "Computer Science", "2025", "11223344", "http://example.com/charlie.png", "Bio of Charlie");
            
            userRepository.saveAll(List.of(u1, u2, u3));
            System.out.println("Sample user profiles loaded.");
        }
    }
}
