package com.gym.repository;

import com.gym.entity.Payment;
import com.gym.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByUser(User user);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByType(Payment.PaymentType type);
    
    List<Payment> findByMethod(Payment.PaymentMethod method);
    
    @Query("SELECT p FROM Payment p WHERE p.user = :user AND p.status = 'COMPLETED'")
    List<Payment> findCompletedPaymentsByUser(@Param("user") User user);
    
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findPaymentsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.user = :user AND p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findPaymentsByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.user = :user AND p.status = 'COMPLETED'")
    BigDecimal getTotalPaymentsByUser(@Param("user") User user);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'COMPLETED'")
    Long countCompletedPayments();
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'PENDING'")
    Long countPendingPayments();
    
    @Query("SELECT p FROM Payment p WHERE p.dueDate <= :dueDate AND p.status = 'PENDING'")
    List<Payment> findOverduePayments(@Param("dueDate") LocalDateTime dueDate);
    
    @Query("SELECT p FROM Payment p WHERE p.amount >= :minAmount AND p.status = 'COMPLETED'")
    List<Payment> findHighValuePayments(@Param("minAmount") BigDecimal minAmount);
} 