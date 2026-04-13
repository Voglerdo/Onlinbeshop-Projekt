package com.blubberbaron.backend.controller;

import com.blubberbaron.backend.dto.JobApplicationDto;
import com.blubberbaron.backend.dto.JobOfferDto;
import com.blubberbaron.backend.service.StorefrontService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class JobsController {

    private final StorefrontService storefrontService;

    public JobsController(StorefrontService storefrontService) {
        this.storefrontService = storefrontService;
    }

    @GetMapping("/jobs")
    public List<JobOfferDto> getJobs() {
        return storefrontService.getJobs();
    }

    @GetMapping("/jobs/{id}")
    public JobOfferDto getJob(@PathVariable String id) {
        return storefrontService.getJob(id);
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobOfferDto> createJob(@Valid @RequestBody JobOfferDto jobOfferDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storefrontService.saveJob(jobOfferDto));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable String id) {
        storefrontService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/applications")
    public ResponseEntity<JobApplicationDto> createApplication(@Valid @RequestBody JobApplicationDto jobApplicationDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storefrontService.saveApplication(jobApplicationDto));
    }
}
