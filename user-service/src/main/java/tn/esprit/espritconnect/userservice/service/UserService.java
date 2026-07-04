package tn.esprit.espritconnect.userservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.espritconnect.userservice.entity.UserProfile;
import tn.esprit.espritconnect.userservice.repository.UserProfileRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userRepository;

    public List<UserProfile> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserProfile> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public UserProfile createUser(UserProfile user) {
        return userRepository.save(user);
    }

    public Map<String, Object> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("byDepartment", userRepository.countUsersByDepartment());
        stats.put("byYear", userRepository.countUsersByAcademicYear());
        return stats;
    }
}
