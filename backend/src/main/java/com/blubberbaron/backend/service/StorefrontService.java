package com.blubberbaron.backend.service;

import com.blubberbaron.backend.dto.JobApplicationDto;
import com.blubberbaron.backend.dto.JobOfferDto;
import com.blubberbaron.backend.dto.OrderDto;
import com.blubberbaron.backend.dto.OrderItemDto;
import com.blubberbaron.backend.dto.ProductDto;
import com.blubberbaron.backend.dto.ReviewDto;
import com.blubberbaron.backend.dto.UserProfileDto;
import com.blubberbaron.backend.model.JobApplicationEntity;
import com.blubberbaron.backend.model.JobOfferEntity;
import com.blubberbaron.backend.model.OrderEntity;
import com.blubberbaron.backend.model.OrderItemEntity;
import com.blubberbaron.backend.model.ProductEntity;
import com.blubberbaron.backend.model.ReviewEntity;
import com.blubberbaron.backend.model.UserProfileEntity;
import com.blubberbaron.backend.repository.JobApplicationRepository;
import com.blubberbaron.backend.repository.JobOfferRepository;
import com.blubberbaron.backend.repository.OrderRepository;
import com.blubberbaron.backend.repository.ProductRepository;
import com.blubberbaron.backend.repository.ReviewRepository;
import com.blubberbaron.backend.repository.UserProfileRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StorefrontService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserProfileRepository userProfileRepository;
    private final OrderRepository orderRepository;

    public StorefrontService(
        ProductRepository productRepository,
        ReviewRepository reviewRepository,
        JobOfferRepository jobOfferRepository,
        JobApplicationRepository jobApplicationRepository,
        UserProfileRepository userProfileRepository,
        OrderRepository orderRepository
    ) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userProfileRepository = userProfileRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getProducts() {
        List<ProductDto> products = new ArrayList<ProductDto>();
        for (ProductEntity entity : productRepository.findAll()) {
            products.add(toProductDto(entity));
        }
        return products;
    }

    @Transactional(readOnly = true)
    public ProductDto getProduct(String id) {
        return toProductDto(findProduct(id));
    }

    public ProductDto saveProduct(ProductDto dto) {
        ProductEntity entity = dto.getId() == null || dto.getId().trim().isEmpty()
            ? new ProductEntity()
            : findProduct(dto.getId());

        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setCategory(dto.getCategory());
        entity.setImageUrl(firstNonBlank(dto.getImageUrl(), firstFromList(dto.getImageUrls())));
        entity.setImageHint(firstNonBlank(dto.getImageHint(), "product image"));
        entity.setImageUrls(dto.getImageUrls() == null ? new ArrayList<String>() : dto.getImageUrls());
        entity.setFeatures(dto.getFeatures() == null ? new ArrayList<String>() : dto.getFeatures());
        entity.setBrand(firstNonBlank(dto.getBrand(), "Blubber Baron"));
        entity.setStockQuantity(dto.getStockQuantity() == null ? 0 : dto.getStockQuantity());
        entity.setCreatedAt(entity.getCreatedAt() == null ? parseDate(dto.getCreatedAt(), LocalDateTime.now()) : entity.getCreatedAt());
        entity.setUpdatedAt(LocalDateTime.now());

        return toProductDto(productRepository.save(entity));
    }

    public void deleteProduct(String id) {
        productRepository.delete(findProduct(id));
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsForProduct(String productId) {
        Long parsedId = parseLongId(productId, "product");
        List<ReviewDto> reviews = new ArrayList<ReviewDto>();
        for (ReviewEntity entity : reviewRepository.findByProductIdOrderByCreatedAtDesc(parsedId)) {
            reviews.add(toReviewDto(entity));
        }
        return reviews;
    }

    public ReviewDto saveReview(ReviewDto dto) {
        ReviewEntity entity = new ReviewEntity();
        entity.setProductId(parseLongId(dto.getProductId(), "product"));
        entity.setUserId(dto.getUserId());
        entity.setUserName(dto.getUserName());
        entity.setRating(dto.getRating());
        entity.setComment(dto.getComment());
        entity.setCreatedAt(parseDate(dto.getCreatedAt(), LocalDateTime.now()));
        return toReviewDto(reviewRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<JobOfferDto> getJobs() {
        List<JobOfferDto> jobs = new ArrayList<JobOfferDto>();
        for (JobOfferEntity entity : jobOfferRepository.findAll()) {
            jobs.add(toJobDto(entity));
        }
        return jobs;
    }

    @Transactional(readOnly = true)
    public JobOfferDto getJob(String id) {
        return toJobDto(findJob(id));
    }

    public JobOfferDto saveJob(JobOfferDto dto) {
        JobOfferEntity entity = dto.getId() == null || dto.getId().trim().isEmpty()
            ? new JobOfferEntity()
            : findJob(dto.getId());
        entity.setTitle(dto.getTitle());
        entity.setDepartment(dto.getDepartment());
        entity.setLocation(dto.getLocation());
        entity.setType(dto.getType());
        entity.setDescription(dto.getDescription());
        entity.setRequirements(dto.getRequirements() == null ? new ArrayList<String>() : dto.getRequirements());
        entity.setCreatedAt(entity.getCreatedAt() == null ? parseDate(dto.getCreatedAt(), LocalDateTime.now()) : entity.getCreatedAt());
        return toJobDto(jobOfferRepository.save(entity));
    }

    public void deleteJob(String id) {
        jobOfferRepository.delete(findJob(id));
    }

    public JobApplicationDto saveApplication(JobApplicationDto dto) {
        JobApplicationEntity entity = new JobApplicationEntity();
        entity.setJobId(parseLongId(dto.getJobId(), "job"));
        entity.setJobTitle(dto.getJobTitle());
        entity.setApplicantName(dto.getApplicantName());
        entity.setApplicantEmail(dto.getApplicantEmail());
        entity.setMessage(dto.getMessage());
        entity.setResumeData(dto.getResumeData());
        entity.setStatus(firstNonBlank(dto.getStatus(), "Pending"));
        entity.setCreatedAt(parseDate(dto.getCreatedAt(), LocalDateTime.now()));
        return toJobApplicationDto(jobApplicationRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(String userId) {
        UserProfileEntity entity = userProfileRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return toUserDto(entity);
    }

    public UserProfileDto updateUserProfile(String userId, UserProfileDto dto) {
        UserProfileEntity entity = userProfileRepository.findById(userId).orElseGet(UserProfileEntity::new);
        entity.setId(userId);
        entity.setFirstName(firstNonBlank(dto.getFirstName(), entity.getFirstName()));
        entity.setLastName(firstNonBlank(dto.getLastName(), entity.getLastName()));
        entity.setEmail(firstNonBlank(dto.getEmail(), entity.getEmail()));
        entity.setIsAdmin(dto.getIsAdmin() != null ? dto.getIsAdmin() : (entity.getIsAdmin() == null ? Boolean.FALSE : entity.getIsAdmin()));
        entity.setCreatedAt(entity.getCreatedAt() == null ? LocalDateTime.now() : entity.getCreatedAt());
        entity.setUpdatedAt(LocalDateTime.now());
        return toUserDto(userProfileRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersForUser(String userId) {
        List<OrderDto> orders = new ArrayList<OrderDto>();
        for (OrderEntity entity : orderRepository.findByUserIdOrderByCreatedAtDesc(userId)) {
            orders.add(toOrderDto(entity));
        }
        return orders;
    }

    public OrderDto saveOrder(OrderDto dto) {
        OrderEntity entity = new OrderEntity();
        entity.setUserId(dto.getUserId());
        entity.setTotalAmount(dto.getTotalAmount());
        entity.setStatus(dto.getStatus());
        entity.setShippingAddress(dto.getShippingAddress());
        entity.setCreatedAt(parseDate(dto.getCreatedAt(), LocalDateTime.now()));

        List<OrderItemEntity> items = new ArrayList<OrderItemEntity>();
        if (dto.getItems() != null) {
            for (OrderItemDto itemDto : dto.getItems()) {
                OrderItemEntity item = new OrderItemEntity();
                item.setProductId(parseOptionalLong(itemDto.getProductId()));
                item.setProductName(itemDto.getName());
                item.setQuantity(itemDto.getQuantity());
                item.setPrice(itemDto.getPrice());
                item.setOrder(entity);
                items.add(item);
            }
        }
        entity.setItems(items);

        if (!userProfileRepository.existsById(dto.getUserId())) {
            UserProfileEntity user = new UserProfileEntity();
            user.setId(dto.getUserId());
            user.setFirstName("Baron");
            user.setLastName("Customer");
            user.setEmail(dto.getUserId() + "@local.session");
            user.setIsAdmin(Boolean.FALSE);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            userProfileRepository.save(user);
        }

        return toOrderDto(orderRepository.save(entity));
    }

    private ProductEntity findProduct(String id) {
        return productRepository.findById(parseLongId(id, "product"))
            .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    private JobOfferEntity findJob(String id) {
        return jobOfferRepository.findById(parseLongId(id, "job"))
            .orElseThrow(() -> new EntityNotFoundException("Job not found"));
    }

    private ProductDto toProductDto(ProductEntity entity) {
        ProductDto dto = new ProductDto();
        dto.setId(String.valueOf(entity.getId()));
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setCategory(entity.getCategory());
        dto.setImageUrl(entity.getImageUrl());
        dto.setImageUrls(entity.getImageUrls());
        dto.setImageHint(entity.getImageHint());
        dto.setBrand(entity.getBrand());
        dto.setStockQuantity(entity.getStockQuantity());
        dto.setFeatures(entity.getFeatures());
        dto.setCreatedAt(entity.getCreatedAt() == null ? null : entity.getCreatedAt().toString());
        dto.setUpdatedAt(entity.getUpdatedAt() == null ? null : entity.getUpdatedAt().toString());
        return dto;
    }

    private ReviewDto toReviewDto(ReviewEntity entity) {
        ReviewDto dto = new ReviewDto();
        dto.setId(String.valueOf(entity.getId()));
        dto.setProductId(String.valueOf(entity.getProductId()));
        dto.setUserId(entity.getUserId());
        dto.setUserName(entity.getUserName());
        dto.setRating(entity.getRating());
        dto.setComment(entity.getComment());
        dto.setCreatedAt(entity.getCreatedAt() == null ? null : entity.getCreatedAt().toString());
        return dto;
    }

    private JobOfferDto toJobDto(JobOfferEntity entity) {
        JobOfferDto dto = new JobOfferDto();
        dto.setId(String.valueOf(entity.getId()));
        dto.setTitle(entity.getTitle());
        dto.setDepartment(entity.getDepartment());
        dto.setLocation(entity.getLocation());
        dto.setType(entity.getType());
        dto.setDescription(entity.getDescription());
        dto.setRequirements(entity.getRequirements());
        dto.setCreatedAt(entity.getCreatedAt() == null ? null : entity.getCreatedAt().toString());
        return dto;
    }

    private JobApplicationDto toJobApplicationDto(JobApplicationEntity entity) {
        JobApplicationDto dto = new JobApplicationDto();
        dto.setId(String.valueOf(entity.getId()));
        dto.setJobId(entity.getJobId() == null ? null : String.valueOf(entity.getJobId()));
        dto.setJobTitle(entity.getJobTitle());
        dto.setApplicantName(entity.getApplicantName());
        dto.setApplicantEmail(entity.getApplicantEmail());
        dto.setMessage(entity.getMessage());
        dto.setResumeData(entity.getResumeData());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt() == null ? null : entity.getCreatedAt().toString());
        return dto;
    }

    private UserProfileDto toUserDto(UserProfileEntity entity) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setIsAdmin(entity.getIsAdmin());
        dto.setCreatedAt(entity.getCreatedAt() == null ? null : entity.getCreatedAt().toString());
        dto.setUpdatedAt(entity.getUpdatedAt() == null ? null : entity.getUpdatedAt().toString());
        return dto;
    }

    private OrderDto toOrderDto(OrderEntity entity) {
        OrderDto dto = new OrderDto();
        dto.setId(String.valueOf(entity.getId()));
        dto.setUserId(entity.getUserId());
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setStatus(entity.getStatus());
        dto.setShippingAddress(entity.getShippingAddress());
        dto.setCreatedAt(entity.getCreatedAt() == null ? null : entity.getCreatedAt().toString());

        List<OrderItemDto> items = new ArrayList<OrderItemDto>();
        for (OrderItemEntity itemEntity : entity.getItems()) {
            OrderItemDto item = new OrderItemDto();
            item.setId(String.valueOf(itemEntity.getId()));
            item.setProductId(itemEntity.getProductId() == null ? null : String.valueOf(itemEntity.getProductId()));
            item.setName(itemEntity.getProductName());
            item.setQuantity(itemEntity.getQuantity());
            item.setPrice(itemEntity.getPrice());
            items.add(item);
        }
        dto.setItems(items);
        return dto;
    }

    private Long parseLongId(String value, String label) {
        try {
            return Long.valueOf(value);
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("Invalid " + label + " id: " + value);
        }
    }

    private Long parseOptionalLong(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Long.valueOf(value);
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private LocalDateTime parseDate(String value, LocalDateTime fallback) {
        if (value == null || value.trim().isEmpty()) {
            return fallback;
        }
        return LocalDateTime.parse(value.replace("Z", ""));
    }

    private String firstNonBlank(String primary, String fallback) {
        return primary != null && !primary.trim().isEmpty() ? primary : fallback;
    }

    private String firstFromList(List<String> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        return values.get(0);
    }
}
