package com.sagar.JobApplicationTracker.service;

import com.sagar.JobApplicationTracker.dto.JobDTO;
import com.sagar.JobApplicationTracker.entity.User;
import com.sagar.JobApplicationTracker.interfaces.GeminiService;
import com.sagar.JobApplicationTracker.repo.UserRepository;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class IngestionService {

    private final GeminiService geminiService;
    private final JobService jobService;
    private final UserRepository userRepository;

    public IngestionService(GeminiService geminiService, JobService jobService, UserRepository userRepository) {
        this.geminiService = geminiService;
        this.jobService = jobService;
        this.userRepository = userRepository;
    }

    @Transactional
    public void handleManualForward(String from, String subject, String body, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) return;

        if (Boolean.TRUE.equals(user.getGmailConnected())) {
            log.warn("Discarding forwarded email for {}: Direct Sync is active.", userEmail);
            return;
        }

        log.info("Forwarding email to Gemini AI for user: {}", userEmail);
        JobDTO job = geminiService.extractJobFromEmail(from, subject, body);

        if (job != null) {
            jobService.createOrUpdateJob(job, userEmail);
        }
    }
}