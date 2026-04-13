package com.blubberbaron.backend.controller;

import com.blubberbaron.backend.dto.ProductDto;
import com.blubberbaron.backend.dto.ReviewDto;
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
public class ProductController {

    private final StorefrontService storefrontService;

    public ProductController(StorefrontService storefrontService) {
        this.storefrontService = storefrontService;
    }

    @GetMapping("/products")
    public List<ProductDto> getProducts() {
        return storefrontService.getProducts();
    }

    @GetMapping("/products/{id}")
    public ProductDto getProduct(@PathVariable String id) {
        return storefrontService.getProduct(id);
    }

    @PostMapping("/products")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto productDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storefrontService.saveProduct(productDto));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        storefrontService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products/{id}/reviews")
    public List<ReviewDto> getReviews(@PathVariable String id) {
        return storefrontService.getReviewsForProduct(id);
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody ReviewDto reviewDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storefrontService.saveReview(reviewDto));
    }
}
