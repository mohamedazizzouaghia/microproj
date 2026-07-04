package tn.esprit.espritconnect.userservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private String academicYear;
    private String phone;
    private String avatarUrl;
    private String bio;
}
