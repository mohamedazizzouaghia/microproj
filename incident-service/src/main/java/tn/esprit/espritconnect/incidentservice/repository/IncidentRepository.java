package tn.esprit.espritconnect.incidentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.espritconnect.incidentservice.entity.Incident;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
}
