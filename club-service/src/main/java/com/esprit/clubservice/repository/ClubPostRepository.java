package com.esprit.clubservice.repository;

import com.esprit.clubservice.entity.ClubPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubPostRepository extends JpaRepository<ClubPost, Long> {
    List<ClubPost> findByClubIdOrderByCreatedAtDesc(Long clubId);
}
