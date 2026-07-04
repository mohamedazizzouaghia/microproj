package tn.esprit.espritconnect.reservationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.esprit.espritconnect.reservationservice.entity.Reservation;
import tn.esprit.espritconnect.reservationservice.entity.ReservationStatus;

import java.util.List;
import java.util.Map;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    long countByStatus(ReservationStatus status);

    @Query("SELECT r.roomName as roomName, COUNT(r) as count FROM Reservation r GROUP BY r.roomName")
    List<Map<String, Object>> countReservationsByRoom();
}
