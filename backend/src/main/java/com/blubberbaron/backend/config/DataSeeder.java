package com.blubberbaron.backend.config;

import com.blubberbaron.backend.model.JobOfferEntity;
import com.blubberbaron.backend.model.ProductEntity;
import com.blubberbaron.backend.repository.JobOfferRepository;
import com.blubberbaron.backend.repository.ProductRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedCatalog(ProductRepository productRepository, JobOfferRepository jobOfferRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                productRepository.save(createProduct(
                    "Crimson Premium Hookah",
                    "A masterpiece of design and performance, featuring high-grade stainless steel and a crimson-tinted crystal base.",
                    new BigDecimal("249.99"),
                    "hookah",
                    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
                    "premium hookah",
                    Arrays.asList(
                        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
                        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80"
                    ),
                    Arrays.asList("Stainless Steel Construction", "Crystal Base", "Quiet Diffuser"),
                    12
                ));
                productRepository.save(createProduct(
                    "Golden Ember Coal",
                    "Long-lasting, low-ash coconut charcoal for the purest smoking experience.",
                    new BigDecimal("19.99"),
                    "coal",
                    "https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=900&q=80",
                    "shisha charcoal",
                    Arrays.asList("https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=900&q=80"),
                    Arrays.asList("100% Coconut", "90 Min Burn Time", "Low Ash Content"),
                    64
                ));
                productRepository.save(createProduct(
                    "Ruby Mist Tobacco",
                    "A sophisticated blend of dark berries and a hint of cooling menthol.",
                    new BigDecimal("24.50"),
                    "flavor",
                    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80",
                    "shisha flavor",
                    Arrays.asList("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80"),
                    Arrays.asList("Premium Virginia Leaf", "Natural Flavoring", "Dense Smoke"),
                    48
                ));
                productRepository.save(createProduct(
                    "Obsidian Glass Base",
                    "A stunning replacement base crafted from thick obsidian-style glass with gold accents.",
                    new BigDecimal("85.00"),
                    "accessory",
                    "https://images.unsplash.com/photo-1507915135761-41a0a222c709?auto=format&fit=crop&w=900&q=80",
                    "hookah glass",
                    Arrays.asList("https://images.unsplash.com/photo-1507915135761-41a0a222c709?auto=format&fit=crop&w=900&q=80"),
                    Arrays.asList("Hand-blown", "Heavy Base", "Gold Rim Detail"),
                    20
                ));
            }

            if (jobOfferRepository.count() == 0) {
                JobOfferEntity firstJob = new JobOfferEntity();
                firstJob.setTitle("Luxury Brand Manager");
                firstJob.setDepartment("Brand");
                firstJob.setLocation("Berlin");
                firstJob.setType("Full-time");
                firstJob.setDescription("Lead premium campaigns, partnerships, and launch narratives for the Blubber Baron portfolio.");
                firstJob.setRequirements(Arrays.asList("3+ years in luxury marketing", "Strong campaign storytelling", "Experience with ecommerce merchandising"));
                firstJob.setCreatedAt(LocalDateTime.now().minusDays(4));
                jobOfferRepository.save(firstJob);

                JobOfferEntity secondJob = new JobOfferEntity();
                secondJob.setTitle("Customer Experience Curator");
                secondJob.setDepartment("Operations");
                secondJob.setLocation("Remote");
                secondJob.setType("Part-time");
                secondJob.setDescription("Shape the tone, retention, and service rituals for our premium customer journeys.");
                secondJob.setRequirements(Arrays.asList("Support or CX background", "Excellent written communication", "German and English preferred"));
                secondJob.setCreatedAt(LocalDateTime.now().minusDays(1));
                jobOfferRepository.save(secondJob);
            }
        };
    }

    private ProductEntity createProduct(
        String name,
        String description,
        BigDecimal price,
        String category,
        String imageUrl,
        String imageHint,
        java.util.List<String> imageUrls,
        java.util.List<String> features,
        Integer stockQuantity
    ) {
        ProductEntity product = new ProductEntity();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        product.setImageHint(imageHint);
        product.setImageUrls(imageUrls);
        product.setFeatures(features);
        product.setBrand("Blubber Baron");
        product.setStockQuantity(stockQuantity);
        product.setCreatedAt(LocalDateTime.now().minusDays(10));
        product.setUpdatedAt(LocalDateTime.now().minusDays(1));
        return product;
    }
}
