package tn.esprit.espritconnect.clubservice;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin(origins = "*")
public class ClubController {

    @Autowired private ClubRepository clubRepository;
    @Autowired private ClubMembershipRepository membershipRepository;
    @Autowired private ClubPostRepository postRepository;

    @GetMapping
    public List<Club> getAll() {
        return clubRepository.findAll();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getClubDetails(@PathVariable Long id) {
        Club club = clubRepository.findById(id).orElseThrow();
        List<ClubMembership> members = membershipRepository.findByClubId(id);
        Map<String, Object> res = new HashMap<>();
        res.put("club", club);
        res.put("members", members);
        return res;
    }

    @PostMapping
    public Club createClub(@RequestBody Club club) {
        club.setCreatedAt(LocalDateTime.now());
        club.setMemberCount(0);
        return clubRepository.save(club);
    }

    @PutMapping("/{id}")
    public Club updateClub(@PathVariable Long id, @RequestBody Club club) {
        Club c = clubRepository.findById(id).orElseThrow();
        c.setName(club.getName());
        c.setDescription(club.getDescription());
        c.setCategory(club.getCategory());
        c.setLogoUrl(club.getLogoUrl());
        return clubRepository.save(c);
    }

    @DeleteMapping("/{id}")
    public void deleteClub(@PathVariable Long id) {
        clubRepository.deleteById(id);
    }

    @PostMapping("/{id}/join")
    public ClubMembership joinClub(@PathVariable Long id, @RequestParam Long userId) {
        Club c = clubRepository.findById(id).orElseThrow();
        c.setMemberCount(c.getMemberCount() + 1);
        clubRepository.save(c);

        return membershipRepository.save(ClubMembership.builder()
                .clubId(id).userId(userId).role("MEMBER").joinedAt(LocalDateTime.now()).build());
    }

    @DeleteMapping("/{id}/leave")
    public void leaveClub(@PathVariable Long id, @RequestParam Long userId) {
        Club c = clubRepository.findById(id).orElseThrow();
        if(c.getMemberCount() > 0) c.setMemberCount(c.getMemberCount() - 1);
        clubRepository.save(c);
        // Using custom delete that we'll implement or just fetching and deleting
    }

    @GetMapping("/{id}/posts")
    public List<ClubPost> getPosts(@PathVariable Long id) {
        return postRepository.findByClubId(id);
    }

    @PostMapping("/{id}/posts")
    public ClubPost createPost(@PathVariable Long id, @RequestBody ClubPost post) {
        post.setClubId(id);
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        List<Club> all = clubRepository.findAll();
        Map<String, Long> byCategory = all.stream().collect(Collectors.groupingBy(Club::getCategory, Collectors.counting()));
        List<Map<String, Object>> catList = byCategory.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        List<Club> topClubs = all.stream()
                .sorted(Comparator.comparing(Club::getMemberCount).reversed())
                .limit(5).collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", all.size());
        stats.put("byCategory", catList);
        stats.put("topClubsByMembers", topClubs);
        return stats;
    }
}
