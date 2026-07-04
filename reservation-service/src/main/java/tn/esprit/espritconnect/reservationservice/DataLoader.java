package tn.esprit.espritconnect.reservationservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import tn.esprit.espritconnect.reservationservice.entity.Reservation;
import tn.esprit.espritconnect.reservationservice.entity.ReservationStatus;
import tn.esprit.espritconnect.reservationservice.entity.Room;
import tn.esprit.espritconnect.reservationservice.repository.ReservationRepository;
import tn.esprit.espritconnect.reservationservice.repository.RoomRepository;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public DataLoader(ReservationRepository reservationRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roomRepository.count() == 0) {
            Room r1 = new Room(null, "Room A", 50, "Projector", true);
            Room r2 = new Room(null, "Room B", 30, "Whiteboard", true);
            roomRepository.saveAll(List.of(r1, r2));
            System.out.println("Sample rooms loaded.");
        }

        if (reservationRepository.count() == 0) {
            Reservation res1 = new Reservation(null, "Room A", 1L, LocalDate.now().plusDays(2), 1L, "Club Meeting", ReservationStatus.PENDING);
            Reservation res2 = new Reservation(null, "Room B", 2L, LocalDate.now().plusDays(3), null, "Study Group", ReservationStatus.APPROVED);
            reservationRepository.saveAll(List.of(res1, res2));
            System.out.println("Sample reservations loaded.");
        }
    }
}
