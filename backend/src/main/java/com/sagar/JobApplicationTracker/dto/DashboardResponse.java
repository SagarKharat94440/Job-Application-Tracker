package com.sagar.JobApplicationTracker.dto;
import lombok.Data;
import java.util.List;

@Data
public class DashboardResponse {
    private DashboardStatsDTO stats;
    private List<ChartData> statusChart;
    private List<ChartData> monthlyChart;
    private List<ChartData> interviewChart;
}