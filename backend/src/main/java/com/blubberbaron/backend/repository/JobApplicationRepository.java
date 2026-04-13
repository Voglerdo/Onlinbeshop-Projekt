package com.blubberbaron.backend.repository;

import com.blubberbaron.backend.model.JobApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplicationEntity, Long> {
}
