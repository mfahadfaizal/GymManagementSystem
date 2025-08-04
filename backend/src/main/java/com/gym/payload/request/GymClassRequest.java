package com.gym.payload.request;

import com.gym.entity.GymClass;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalTime;

public class GymClassRequest {
    
    @NotBlank
    private String name;
    
    private String description;
    
    @NotNull
    private GymClass.ClassType type;
    
    @NotNull
    private Long trainerId;
    
    @NotNull
    private LocalTime startTime;
    
    @NotNull
    private LocalTime endTime;
    
    @NotNull
    @Min(value = 1, message = "Max capacity must be at least 1")
    private Integer maxCapacity;
    
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal price;
    
    private String location;
    
    private String scheduleDays;
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public GymClass.ClassType getType() {
        return type;
    }
    
    public void setType(GymClass.ClassType type) {
        this.type = type;
    }
    
    public Long getTrainerId() {
        return trainerId;
    }
    
    public void setTrainerId(Long trainerId) {
        this.trainerId = trainerId;
    }
    
    public LocalTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
    
    public Integer getMaxCapacity() {
        return maxCapacity;
    }
    
    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getScheduleDays() {
        return scheduleDays;
    }
    
    public void setScheduleDays(String scheduleDays) {
        this.scheduleDays = scheduleDays;
    }
} 