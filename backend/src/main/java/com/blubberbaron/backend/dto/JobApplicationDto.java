package com.blubberbaron.backend.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class JobApplicationDto {

    private String id;

    @NotBlank(message = "Job id is required")
    private String jobId;

    private String jobTitle;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @Email(message = "Applicant email must be valid")
    @NotBlank(message = "Applicant email is required")
    private String applicantEmail;

    @NotBlank(message = "Message is required")
    private String message;

    private String resumeData;
    private String status;
    private String createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }
    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getResumeData() { return resumeData; }
    public void setResumeData(String resumeData) { this.resumeData = resumeData; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
