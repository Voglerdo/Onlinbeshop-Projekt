package com.blubberbaron.backend.repository;

import com.blubberbaron.backend.model.JobOfferEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobOfferRepository extends JpaRepository<JobOfferEntity, Long> {
}
