package com.gym.payload.request;

import com.gym.entity.TrainingSession;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TrainingSessionRequest {
    
    @NotNull
    private Long trainerId;
    
    @NotNull
    private Long memberId;
    
    @NotNull
    private TrainingSession.SessionType type;
    
    @NotNull
    private LocalDateTime scheduledDate;
    
    @NotNull
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    private Integer duration;
    
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal price;
    
    private String notes;
    
    private String location;
    
    // Getters and Setters
    public Long getTrainerId() {
        return trainerId;
    }
    
    public void setTrainerId(Long trainerId) {
        this.trainerId = trainerId;
    }
    
    public Long getMemberId() {
        return memberId;
    }
    
    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }
    
    public TrainingSession.SessionType getType() {
        return type;
    }
    
    public void setType(TrainingSession.SessionType type) {
        this.type = type;
    }
    
    public LocalDateTime getScheduledDate() {
        return scheduledDate;
    }
    
    public void setScheduledDate(LocalDateTime scheduledDate) {
        this.scheduledDate = scheduledDate;
    }
    
    public Integer getDuration() {
        return duration;
    }
    
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
} 