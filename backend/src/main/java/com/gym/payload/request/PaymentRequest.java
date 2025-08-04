package com.gym.payload.request;

import com.gym.entity.Payment;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentRequest {
    
    @NotNull
    private Long userId;
    
    @NotNull
    private Payment.PaymentType type;
    
    @NotNull
    private Payment.PaymentMethod method;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal amount;
    
    private String description;
    
    private LocalDateTime dueDate;
    
    private String notes;
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Payment.PaymentType getType() {
        return type;
    }
    
    public void setType(Payment.PaymentType type) {
        this.type = type;
    }
    
    public Payment.PaymentMethod getMethod() {
        return method;
    }
    
    public void setMethod(Payment.PaymentMethod method) {
        this.method = method;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
} 