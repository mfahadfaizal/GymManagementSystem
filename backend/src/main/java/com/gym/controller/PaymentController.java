package com.gym.controller;

import com.gym.entity.Payment;
import com.gym.payload.request.PaymentRequest;
import com.gym.payload.response.MessageResponse;
import com.gym.service.PaymentService;
import com.gym.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userService.isCurrentUser(#id)")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<List<Payment>> getPaymentsByUser(@PathVariable Long userId) {
        List<Payment> payments = paymentService.getPaymentsByUser(userId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable String status) {
        try {
            Payment.PaymentStatus paymentStatus = Payment.PaymentStatus.valueOf(status.toUpperCase());
            List<Payment> payments = paymentService.getPaymentsByStatus(paymentStatus);
            return ResponseEntity.ok(payments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Payment>> getPaymentsByType(@PathVariable String type) {
        try {
            Payment.PaymentType paymentType = Payment.PaymentType.valueOf(type.toUpperCase());
            List<Payment> payments = paymentService.getPaymentsByType(paymentType);
            return ResponseEntity.ok(payments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/method/{method}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Payment>> getPaymentsByMethod(@PathVariable String method) {
        try {
            Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.valueOf(method.toUpperCase());
            List<Payment> payments = paymentService.getPaymentsByMethod(paymentMethod);
            return ResponseEntity.ok(payments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/user/{userId}/completed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<List<Payment>> getCompletedPaymentsByUser(@PathVariable Long userId) {
        List<Payment> payments = paymentService.getCompletedPaymentsByUser(userId);
        return ResponseEntity.ok(payments);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> createPayment(@Valid @RequestBody PaymentRequest request) {
        try {
            Payment payment = paymentService.createPayment(
                request.getUserId(),
                request.getType(),
                request.getMethod(),
                request.getAmount(),
                request.getDescription(),
                request.getDueDate()
            );
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> updatePayment(@PathVariable Long id, @Valid @RequestBody PaymentRequest request) {
        try {
            Payment payment = paymentService.updatePayment(
                id,
                request.getType(),
                request.getMethod(),
                request.getAmount(),
                request.getDescription(),
                request.getDueDate()
            );
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Payment.PaymentStatus paymentStatus = Payment.PaymentStatus.valueOf(status.toUpperCase());
            Payment payment = paymentService.updatePaymentStatus(id, paymentStatus);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid status"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.ok(new MessageResponse("Payment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Payment>> getPaymentsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<Payment> payments = paymentService.getPaymentsByDateRange(startDate, endDate);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/user/{userId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<List<Payment>> getPaymentsByUserAndDateRange(
            @PathVariable Long userId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<Payment> payments = paymentService.getPaymentsByUserAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/user/{userId}/total")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<BigDecimal> getTotalPaymentsByUser(@PathVariable Long userId) {
        BigDecimal total = paymentService.getTotalPaymentsByUser(userId);
        return ResponseEntity.ok(total);
    }
    
    @GetMapping("/revenue/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<BigDecimal> getTotalRevenueByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        BigDecimal revenue = paymentService.getTotalRevenueByDateRange(startDate, endDate);
        return ResponseEntity.ok(revenue);
    }
    
    @GetMapping("/stats/completed-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Long> getCompletedPaymentsCount() {
        Long count = paymentService.getCompletedPaymentsCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/pending-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Long> getPendingPaymentsCount() {
        Long count = paymentService.getPendingPaymentsCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Payment>> getOverduePayments(@RequestParam LocalDateTime dueDate) {
        List<Payment> payments = paymentService.getOverduePayments(dueDate);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/high-value")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Payment>> getHighValuePayments(@RequestParam BigDecimal minAmount) {
        List<Payment> payments = paymentService.getHighValuePayments(minAmount);
        return ResponseEntity.ok(payments);
    }
    
    @PutMapping("/{id}/process")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> processPayment(@PathVariable Long id) {
        try {
            Payment payment = paymentService.processPayment(id);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/refund")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> refundPayment(@PathVariable Long id, @RequestParam String notes) {
        try {
            Payment payment = paymentService.refundPayment(id, notes);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> cancelPayment(@PathVariable Long id) {
        try {
            Payment payment = paymentService.cancelPayment(id);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/membership")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> createMembershipPayment(@RequestParam Long userId, @RequestParam BigDecimal amount, @RequestParam String method) {
        try {
            Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.valueOf(method.toUpperCase());
            Payment payment = paymentService.createMembershipPayment(userId, amount, paymentMethod);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid payment method"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/class")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> createClassPayment(@RequestParam Long userId, @RequestParam BigDecimal amount, @RequestParam String method) {
        try {
            Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.valueOf(method.toUpperCase());
            Payment payment = paymentService.createClassPayment(userId, amount, paymentMethod);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid payment method"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/training-session")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> createTrainingSessionPayment(@RequestParam Long userId, @RequestParam BigDecimal amount, @RequestParam String method) {
        try {
            Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.valueOf(method.toUpperCase());
            Payment payment = paymentService.createTrainingSessionPayment(userId, amount, paymentMethod);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid payment method"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
} 