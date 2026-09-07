package com.sagar.JobApplicationTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalApplications;
    private long activePipeline;
    private long interviews;
    private long activeInterviews;
    private long offers;
}