package com.blubberbaron.backend.controller;

import com.blubberbaron.backend.dto.OrderDto;
import com.blubberbaron.backend.dto.UserProfileDto;
import com.blubberbaron.backend.service.StorefrontService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    private final StorefrontService storefrontService;

    public UserController(StorefrontService storefrontService) {
        this.storefrontService = storefrontService;
    }

    @GetMapping("/users/{id}")
    public UserProfileDto getUser(@PathVariable String id) {
        return storefrontService.getUserProfile(id);
    }

    @PutMapping("/users/{id}")
    public UserProfileDto updateUser(@PathVariable String id, @Valid @RequestBody UserProfileDto userProfileDto) {
        return storefrontService.updateUserProfile(id, userProfileDto);
    }

    @GetMapping("/users/{id}/orders")
    public List<OrderDto> getOrders(@PathVariable String id) {
        return storefrontService.getOrdersForUser(id);
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderDto orderDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storefrontService.saveOrder(orderDto));
    }
}
