package com.esprit.clubservice.controller;

import com.esprit.clubservice.dto.ClubStatsDto;
import com.esprit.clubservice.entity.Club;
import com.esprit.clubservice.entity.ClubMembership;
import com.esprit.clubservice.entity.ClubPost;
import com.esprit.clubservice.service.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<List<Club>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @GetMapping("/stats")
    public ResponseEntity<ClubStatsDto> getStats() {
        return ResponseEntity.ok(clubService.getStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Club> getClubById(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    @PostMapping
    public ResponseEntity<Club> createClub(@RequestBody Club club) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clubService.createClub(club));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Club> updateClub(@PathVariable Long id, @RequestBody Club club) {
        return ResponseEntity.ok(clubService.updateClub(id, club));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ClubMembership> joinClub(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String role = payload.containsKey("role") ? payload.get("role").toString() : "MEMBER";
        return ResponseEntity.ok(clubService.joinClub(id, userId, role));
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<Void> leaveClub(@PathVariable Long id, @RequestParam Long userId) {
        clubService.leaveClub(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<List<ClubPost>> getClubPosts(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.getClubPosts(id));
    }

    @PostMapping("/{id}/posts")
    public ResponseEntity<ClubPost> createClubPost(@PathVariable Long id, @RequestBody ClubPost post) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clubService.createClubPost(id, post));
    }
}
