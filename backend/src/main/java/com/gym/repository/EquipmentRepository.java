package com.gym.repository;

import com.gym.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    
    List<Equipment> findByType(Equipment.EquipmentType type);
    
    List<Equipment> findByStatus(Equipment.EquipmentStatus status);
    
    List<Equipment> findByLocation(String location);
    
    @Query("SELECT e FROM Equipment e WHERE e.status = 'MAINTENANCE' AND e.nextMaintenanceDate <= :now")
    List<Equipment> findEquipmentNeedingMaintenance(@Param("now") LocalDateTime now);
    
    @Query("SELECT e FROM Equipment e WHERE e.warrantyExpiry <= :expiryDate")
    List<Equipment> findEquipmentWithExpiringWarranty(@Param("expiryDate") LocalDateTime expiryDate);
    
    @Query("SELECT COUNT(e) FROM Equipment e WHERE e.status = 'AVAILABLE'")
    Long countAvailableEquipment();
    
    @Query("SELECT COUNT(e) FROM Equipment e WHERE e.status = 'MAINTENANCE'")
    Long countEquipmentInMaintenance();
    
    @Query("SELECT e FROM Equipment e WHERE e.name LIKE %:name% OR e.description LIKE %:description%")
    List<Equipment> searchEquipmentByNameOrDescription(@Param("name") String name, @Param("description") String description);
    
    @Query("SELECT e FROM Equipment e WHERE e.purchaseDate BETWEEN :startDate AND :endDate")
    List<Equipment> findEquipmentPurchasedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
} 