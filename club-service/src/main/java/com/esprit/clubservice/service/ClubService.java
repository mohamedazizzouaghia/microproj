package com.esprit.clubservice.service;

import com.esprit.clubservice.dto.ClubStatsDto;
import com.esprit.clubservice.entity.Club;
import com.esprit.clubservice.entity.ClubMembership;
import com.esprit.clubservice.entity.ClubPost;
import com.esprit.clubservice.repository.ClubMembershipRepository;
import com.esprit.clubservice.repository.ClubPostRepository;
import com.esprit.clubservice.repository.ClubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;
    private final ClubMembershipRepository clubMembershipRepository;
    private final ClubPostRepository clubPostRepository;

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public Club getClubById(Long id) {
        return clubRepository.findById(id).orElseThrow(() -> new RuntimeException("Club not found"));
    }

    @Transactional
    public Club createClub(Club club) {
        club.setMemberCount(0);
        return clubRepository.save(club);
    }

    @Transactional
    public Club updateClub(Long id, Club updatedClub) {
        Club existing = getClubById(id);
        existing.setName(updatedClub.getName());
        existing.setDescription(updatedClub.getDescription());
        existing.setCategory(updatedClub.getCategory());
        existing.setLogoUrl(updatedClub.getLogoUrl());
        return clubRepository.save(existing);
    }

    @Transactional
    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }

    @Transactional
    public ClubMembership joinClub(Long id, Long userId, String role) {
        Club club = getClubById(id);
        
        // Check if already a member
        if (clubMembershipRepository.findByClubIdAndUserId(id, userId).isPresent()) {
            throw new RuntimeException("User is already a member of this club");
        }

        ClubMembership membership = ClubMembership.builder()
                .club(club)
                .userId(userId)
                .role(role != null ? role : "MEMBER")
                .build();
        
        club.setMemberCount(club.getMemberCount() + 1);
        clubRepository.save(club);
        
        return clubMembershipRepository.save(membership);
    }

    @Transactional
    public void leaveClub(Long id, Long userId) {
        Club club = getClubById(id);
        
        ClubMembership membership = clubMembershipRepository.findByClubIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));
                
        clubMembershipRepository.delete(membership);
        
        club.setMemberCount(Math.max(0, club.getMemberCount() - 1));
        clubRepository.save(club);
    }

    public List<ClubPost> getClubPosts(Long id) {
        return clubPostRepository.findByClubIdOrderByCreatedAtDesc(id);
    }

    @Transactional
    public ClubPost createClubPost(Long id, ClubPost post) {
        Club club = getClubById(id);
        post.setClub(club);
        return clubPostRepository.save(post);
    }

    public ClubStatsDto getStats() {
        List<Club> allClubs = clubRepository.findAll();
        
        Map<String, Long> categoryCounts = allClubs.stream()
                .filter(c -> c.getCategory() != null)
                .collect(Collectors.groupingBy(Club::getCategory, Collectors.counting()));
                
        List<Map<String, Object>> byCategory = categoryCounts.entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category", e.getKey());
                    map.put("count", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());
                
        List<Club> topClubs = allClubs.stream()
                .sorted((c1, c2) -> Integer.compare(c2.getMemberCount(), c1.getMemberCount()))
                .limit(5)
                .collect(Collectors.toList());

        return ClubStatsDto.builder()
                .total(allClubs.size())
                .byCategory(byCategory)
                .topClubsByMembers(topClubs)
                .build();
    }
}
