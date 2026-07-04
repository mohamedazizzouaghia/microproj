package tn.esprit.espritconnect.clubservice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
interface ClubRepository extends JpaRepository<Club, Long> {}

@Repository
interface ClubMembershipRepository extends JpaRepository<ClubMembership, Long> {
    List<ClubMembership> findByClubId(Long clubId);
    void deleteByClubIdAndUserId(Long clubId, Long userId);
}

@Repository
interface ClubPostRepository extends JpaRepository<ClubPost, Long> {
    List<ClubPost> findByClubId(Long clubId);
}
