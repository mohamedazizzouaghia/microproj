package com.esprit.clubservice.repository;

import com.esprit.clubservice.entity.ClubMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClubMembershipRepository extends JpaRepository<ClubMembership, Long> {
    Optional<ClubMembership> findByClubIdAndUserId(Long clubId, Long userId);
    void deleteByClubIdAndUserId(Long clubId, Long userId);
}
