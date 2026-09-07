package com.sagar.JobApplicationTracker.interfaces;

import java.util.List;

import com.sagar.JobApplicationTracker.dto.EmailBatchItem;
import com.sagar.JobApplicationTracker.dto.JobDTO;

public interface GeminiService {
	
	JobDTO extractJobFromEmail(String from, String subject, String body);
	
	List<JobDTO> extractJobsFromBatch(List<EmailBatchItem> items);

}
