package com.gym.repository;

import com.gym.entity.ClassRegistration;
import com.gym.entity.GymClass;
import com.gym.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRegistrationRepository extends JpaRepository<ClassRegistration, Long> {
    
    List<ClassRegistration> findByMember(User member);
    
    List<ClassRegistration> findByGymClass(GymClass gymClass);
    
    List<ClassRegistration> findByMemberAndStatus(User member, ClassRegistration.RegistrationStatus status);
    
    List<ClassRegistration> findByGymClassAndStatus(GymClass gymClass, ClassRegistration.RegistrationStatus status);
    
    @Query("SELECT cr FROM ClassRegistration cr WHERE cr.member = :member AND cr.gymClass = :gymClass")
    Optional<ClassRegistration> findByMemberAndGymClass(@Param("member") User member, @Param("gymClass") GymClass gymClass);
    
    @Query("SELECT COUNT(cr) FROM ClassRegistration cr WHERE cr.gymClass = :gymClass AND cr.status = 'REGISTERED'")
    Long countRegistrationsByGymClass(@Param("gymClass") GymClass gymClass);
    
    @Query("SELECT COUNT(cr) FROM ClassRegistration cr WHERE cr.member = :member AND cr.status = 'ATTENDED'")
    Long countAttendedClassesByMember(@Param("member") User member);
    
    @Query("SELECT cr FROM ClassRegistration cr WHERE cr.member = :member AND cr.registrationDate BETWEEN :startDate AND :endDate")
    List<ClassRegistration> findRegistrationsByMemberAndDateRange(@Param("member") User member, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT cr FROM ClassRegistration cr WHERE cr.gymClass = :gymClass AND cr.registrationDate BETWEEN :startDate AND :endDate")
    List<ClassRegistration> findRegistrationsByGymClassAndDateRange(@Param("gymClass") GymClass gymClass, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT cr FROM ClassRegistration cr WHERE cr.status = 'REGISTERED' AND cr.gymClass.startTime > :now ORDER BY cr.gymClass.startTime")
    List<ClassRegistration> findUpcomingRegistrations(@Param("now") LocalDateTime now);
    
    @Query("SELECT cr FROM ClassRegistration cr WHERE cr.member = :member AND cr.status = 'REGISTERED' AND cr.gymClass.startTime > :now ORDER BY cr.gymClass.startTime")
    List<ClassRegistration> findUpcomingRegistrationsByMember(@Param("member") User member, @Param("now") LocalDateTime now);
    
    boolean existsByMemberAndGymClass(User member, GymClass gymClass);
} 