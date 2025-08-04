package com.gym.repository;

import com.gym.entity.GymClass;
import com.gym.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface GymClassRepository extends JpaRepository<GymClass, Long> {
    
    List<GymClass> findByType(GymClass.ClassType type);
    
    List<GymClass> findByStatus(GymClass.ClassStatus status);
    
    List<GymClass> findByTrainer(User trainer);
    
    List<GymClass> findByLocation(String location);
    
    @Query("SELECT gc FROM GymClass gc WHERE gc.status = 'ACTIVE' AND gc.currentEnrollment < gc.maxCapacity")
    List<GymClass> findAvailableClasses();
    
    @Query("SELECT gc FROM GymClass gc WHERE gc.status = 'ACTIVE' AND gc.currentEnrollment >= gc.maxCapacity")
    List<GymClass> findFullClasses();
    
    @Query("SELECT gc FROM GymClass gc WHERE gc.trainer = :trainer AND gc.status = 'ACTIVE'")
    List<GymClass> findActiveClassesByTrainer(@Param("trainer") User trainer);
    
    @Query("SELECT gc FROM GymClass gc WHERE gc.type = :type AND gc.status = 'ACTIVE'")
    List<GymClass> findActiveClassesByType(@Param("type") GymClass.ClassType type);
    
    @Query("SELECT gc FROM GymClass gc WHERE gc.startTime BETWEEN :startTime AND :endTime AND gc.status = 'ACTIVE'")
    List<GymClass> findClassesByTimeRange(@Param("startTime") LocalTime startTime, @Param("endTime") LocalTime endTime);
    
    @Query("SELECT COUNT(gc) FROM GymClass gc WHERE gc.status = 'ACTIVE'")
    Long countActiveClasses();
    
    @Query("SELECT gc FROM GymClass gc WHERE gc.name LIKE %:name% OR gc.description LIKE %:description%")
    List<GymClass> searchClassesByNameOrDescription(@Param("name") String name, @Param("description") String description);
    
    @Query("SELECT gc FROM GymClass gc WHERE gc.scheduleDays LIKE %:day% AND gc.status = 'ACTIVE'")
    List<GymClass> findClassesByDay(@Param("day") String day);
} 