package tn.esprit.espritconnect.reservationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.espritconnect.reservationservice.entity.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
}
