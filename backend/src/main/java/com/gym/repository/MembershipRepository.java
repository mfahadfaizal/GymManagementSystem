package com.gym.repository;

import com.gym.entity.Membership;
import com.gym.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    
    List<Membership> findByUser(User user);
    
    List<Membership> findByUserAndStatus(User user, Membership.MembershipStatus status);
    
    List<Membership> findByStatus(Membership.MembershipStatus status);
    
    @Query("SELECT m FROM Membership m WHERE m.user = :user AND m.status = 'ACTIVE' AND m.endDate > :now")
    List<Membership> findActiveMembershipsByUser(@Param("user") User user, @Param("now") LocalDateTime now);
    
    @Query("SELECT m FROM Membership m WHERE m.endDate BETWEEN :startDate AND :endDate")
    List<Membership> findMembershipsExpiringBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT m FROM Membership m WHERE m.status = 'ACTIVE' AND m.endDate < :now")
    List<Membership> findExpiredMemberships(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(m) FROM Membership m WHERE m.status = 'ACTIVE'")
    Long countActiveMemberships();
    
    @Query("SELECT m FROM Membership m WHERE m.user.id = :userId ORDER BY m.createdAt DESC")
    List<Membership> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
} 