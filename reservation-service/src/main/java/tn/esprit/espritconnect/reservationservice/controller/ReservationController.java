package tn.esprit.espritconnect.reservationservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.espritconnect.reservationservice.dto.ReservationWithEventDTO;
import tn.esprit.espritconnect.reservationservice.entity.Reservation;
import tn.esprit.espritconnect.reservationservice.entity.Room;
import tn.esprit.espritconnect.reservationservice.service.ReservationService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        Reservation created = reservationService.createReservation(reservation);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}/with-event")
    public ResponseEntity<ReservationWithEventDTO> getReservationWithEvent(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationWithEvent(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Reservation> approveReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.approveReservation(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Reservation> rejectReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.rejectReservation(id));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(reservationService.getAllRooms());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReservationStats() {
        return ResponseEntity.ok(reservationService.getReservationStats());
    }
}
