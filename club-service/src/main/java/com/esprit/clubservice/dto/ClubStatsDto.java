package com.esprit.clubservice.dto;

import com.esprit.clubservice.entity.Club;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class ClubStatsDto {
    private long total;
    private List<Map<String, Object>> byCategory;
    private List<Club> topClubsByMembers;
}
