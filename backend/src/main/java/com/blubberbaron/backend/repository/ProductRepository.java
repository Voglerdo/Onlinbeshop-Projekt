package com.blubberbaron.backend.repository;

import com.blubberbaron.backend.model.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
}
