package tn.esprit.espritconnect.userservice.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.espritconnect.userservice.entity.UserProfile;
import java.util.List;
import java.util.Map;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    @Query("SELECT u.department as department, COUNT(u) as count FROM UserProfile u GROUP BY u.department")
    List<Map<String, Object>> countUsersByDepartment();

    @Query("SELECT u.academicYear as year, COUNT(u) as count FROM UserProfile u GROUP BY u.academicYear")
    List<Map<String, Object>> countUsersByAcademicYear();
}
