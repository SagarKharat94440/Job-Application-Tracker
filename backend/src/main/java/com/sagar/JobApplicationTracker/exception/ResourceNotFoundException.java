package com.sagar.JobApplicationTracker.exception;

public class ResourceNotFoundException extends RuntimeException {

	private static final long serialVersionUID = -450262964506408052L;

	public ResourceNotFoundException(String message) {
        super(message);
    }
}