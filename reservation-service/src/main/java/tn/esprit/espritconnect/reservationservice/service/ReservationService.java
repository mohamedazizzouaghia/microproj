package tn.esprit.espritconnect.reservationservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.espritconnect.reservationservice.client.EventClient;
import tn.esprit.espritconnect.reservationservice.dto.EventDTO;
import tn.esprit.espritconnect.reservationservice.dto.ReservationWithEventDTO;
import tn.esprit.espritconnect.reservationservice.entity.Reservation;
import tn.esprit.espritconnect.reservationservice.entity.ReservationStatus;
import tn.esprit.espritconnect.reservationservice.entity.Room;
import tn.esprit.espritconnect.reservationservice.repository.ReservationRepository;
import tn.esprit.espritconnect.reservationservice.repository.RoomRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final EventClient eventClient;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation createReservation(Reservation reservation) {
        if (reservation.getStatus() == null) reservation.setStatus(ReservationStatus.PENDING);
        return reservationRepository.save(reservation);
    }

    public ReservationWithEventDTO getReservationWithEvent(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        EventDTO event = eventClient.getEventById(reservation.getEventId());

        ReservationWithEventDTO dto = new ReservationWithEventDTO();
        dto.setReservation(reservation);
        dto.setEvent(event);

        return dto;
    }

    @Transactional
    public Reservation approveReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
        reservation.setStatus(ReservationStatus.APPROVED);
        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation rejectReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
        reservation.setStatus(ReservationStatus.REJECTED);
        return reservationRepository.save(reservation);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Map<String, Object> getReservationStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", reservationRepository.count());
        stats.put("pending", reservationRepository.countByStatus(ReservationStatus.PENDING));
        stats.put("approved", reservationRepository.countByStatus(ReservationStatus.APPROVED));
        stats.put("byRoom", reservationRepository.countReservationsByRoom());
        return stats;
    }
}
