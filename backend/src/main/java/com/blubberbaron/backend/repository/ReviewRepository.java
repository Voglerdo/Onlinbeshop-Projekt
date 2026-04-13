package com.blubberbaron.backend.repository;

import com.blubberbaron.backend.model.ReviewEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    List<ReviewEntity> findByProductIdOrderByCreatedAtDesc(Long productId);
}
