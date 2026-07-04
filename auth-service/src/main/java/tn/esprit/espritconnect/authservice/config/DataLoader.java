package tn.esprit.espritconnect.authservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import tn.esprit.espritconnect.authservice.entity.User;
import tn.esprit.espritconnect.authservice.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Admin
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@esprit.tn")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);

            // Students
            for (int i = 1; i <= 5; i++) {
                User student = User.builder()
                        .firstName("Student" + i)
                        .lastName("Esprit")
                        .email("student" + i + "@esprit.tn")
                        .password(passwordEncoder.encode("student123"))
                        .role("STUDENT")
                        .build();
                userRepository.save(student);
            }
        }
    }
}
