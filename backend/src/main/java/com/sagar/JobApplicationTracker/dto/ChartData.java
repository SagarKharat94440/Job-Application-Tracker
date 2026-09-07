package com.sagar.JobApplicationTracker.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChartData {
    private String name;
    private long value;
}