package com.sagar.JobApplicationTracker;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableCaching
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
@EnableScheduling
@EnableAsync
public class JobApplicationTrackerApplication {

	public static void main(String[] args) {
		
		System.setProperty("user.timezone", "UTC");
	    TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        
		SpringApplication.run(JobApplicationTrackerApplication.class, args);
	}

}
