package com.gym.service;

import com.gym.entity.Payment;
import com.gym.entity.User;
import com.gym.repository.PaymentRepository;
import com.gym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }
    
    public List<Payment> getPaymentsByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(paymentRepository::findByUser).orElse(List.of());
    }
    
    public List<Payment> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }
    
    public List<Payment> getPaymentsByType(Payment.PaymentType type) {
        return paymentRepository.findByType(type);
    }
    
    public List<Payment> getPaymentsByMethod(Payment.PaymentMethod method) {
        return paymentRepository.findByMethod(method);
    }
    
    public List<Payment> getCompletedPaymentsByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(paymentRepository::findCompletedPaymentsByUser).orElse(List.of());
    }
    
    public List<Payment> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findPaymentsByDateRange(startDate, endDate);
    }
    
    public List<Payment> getPaymentsByUserAndDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return paymentRepository.findPaymentsByUserAndDateRange(user.get(), startDate, endDate);
        }
        return List.of();
    }
    
    public Payment createPayment(Long userId, Payment.PaymentType type, Payment.PaymentMethod method,
                               BigDecimal amount, String description, LocalDateTime dueDate) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        Payment payment = new Payment(user.get(), type, method, amount);
        payment.setDescription(description);
        payment.setDueDate(dueDate);
        payment.setTransactionId(generateTransactionId());
        
        return paymentRepository.save(payment);
    }
    
    public Payment updatePayment(Long id, Payment.PaymentType type, Payment.PaymentMethod method,
                               BigDecimal amount, String description, LocalDateTime dueDate) {
        Optional<Payment> existingPayment = paymentRepository.findById(id);
        if (existingPayment.isEmpty()) {
            throw new RuntimeException("Payment not found");
        }
        
        Payment payment = existingPayment.get();
        payment.setType(type);
        payment.setMethod(method);
        payment.setAmount(amount);
        payment.setDescription(description);
        payment.setDueDate(dueDate);
        
        return paymentRepository.save(payment);
    }
    
    public Payment updatePaymentStatus(Long id, Payment.PaymentStatus status) {
        Optional<Payment> existingPayment = paymentRepository.findById(id);
        if (existingPayment.isEmpty()) {
            throw new RuntimeException("Payment not found");
        }
        
        Payment payment = existingPayment.get();
        payment.setStatus(status);
        
        if (status == Payment.PaymentStatus.COMPLETED) {
            payment.setPaymentDate(LocalDateTime.now());
        }
        
        return paymentRepository.save(payment);
    }
    
    public void deletePayment(Long id) {
        Optional<Payment> payment = paymentRepository.findById(id);
        if (payment.isPresent()) {
            paymentRepository.delete(payment.get());
        }
    }
    
    public BigDecimal getTotalPaymentsByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(paymentRepository::getTotalPaymentsByUser).orElse(BigDecimal.ZERO);
    }
    
    public BigDecimal getTotalRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.getTotalRevenueByDateRange(startDate, endDate);
    }
    
    public Long getCompletedPaymentsCount() {
        return paymentRepository.countCompletedPayments();
    }
    
    public Long getPendingPaymentsCount() {
        return paymentRepository.countPendingPayments();
    }
    
    public List<Payment> getOverduePayments(LocalDateTime dueDate) {
        return paymentRepository.findOverduePayments(dueDate);
    }
    
    public List<Payment> getHighValuePayments(BigDecimal minAmount) {
        return paymentRepository.findHighValuePayments(minAmount);
    }
    
    public Payment processPayment(Long id) {
        Optional<Payment> existingPayment = paymentRepository.findById(id);
        if (existingPayment.isEmpty()) {
            throw new RuntimeException("Payment not found");
        }
        
        Payment payment = existingPayment.get();
        
        // Simulate payment processing
        if (payment.getStatus() == Payment.PaymentStatus.PENDING) {
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setPaymentDate(LocalDateTime.now());
            return paymentRepository.save(payment);
        } else {
            throw new RuntimeException("Payment cannot be processed in current status");
        }
    }
    
    public Payment refundPayment(Long id, String notes) {
        Optional<Payment> existingPayment = paymentRepository.findById(id);
        if (existingPayment.isEmpty()) {
            throw new RuntimeException("Payment not found");
        }
        
        Payment payment = existingPayment.get();
        
        if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            payment.setNotes(notes);
            return paymentRepository.save(payment);
        } else {
            throw new RuntimeException("Payment cannot be refunded in current status");
        }
    }
    
    public Payment cancelPayment(Long id) {
        Optional<Payment> existingPayment = paymentRepository.findById(id);
        if (existingPayment.isEmpty()) {
            throw new RuntimeException("Payment not found");
        }
        
        Payment payment = existingPayment.get();
        
        if (payment.getStatus() == Payment.PaymentStatus.PENDING) {
            payment.setStatus(Payment.PaymentStatus.CANCELLED);
            return paymentRepository.save(payment);
        } else {
            throw new RuntimeException("Payment cannot be cancelled in current status");
        }
    }
    
    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    public Payment createMembershipPayment(Long userId, BigDecimal amount, Payment.PaymentMethod method) {
        return createPayment(userId, Payment.PaymentType.MEMBERSHIP_FEE, method, amount, 
                          "Membership fee payment", LocalDateTime.now().plusDays(30));
    }
    
    public Payment createClassPayment(Long userId, BigDecimal amount, Payment.PaymentMethod method) {
        return createPayment(userId, Payment.PaymentType.CLASS_FEE, method, amount, 
                          "Class fee payment", LocalDateTime.now().plusDays(7));
    }
    
    public Payment createTrainingSessionPayment(Long userId, BigDecimal amount, Payment.PaymentMethod method) {
        return createPayment(userId, Payment.PaymentType.TRAINING_SESSION, method, amount, 
                          "Training session payment", LocalDateTime.now().plusDays(7));
    }
} 