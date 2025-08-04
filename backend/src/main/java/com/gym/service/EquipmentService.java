package com.gym.service;

import com.gym.entity.Equipment;
import com.gym.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EquipmentService {
    
    @Autowired
    private EquipmentRepository equipmentRepository;
    
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }
    
    public Optional<Equipment> getEquipmentById(Long id) {
        return equipmentRepository.findById(id);
    }
    
    public List<Equipment> getEquipmentByType(Equipment.EquipmentType type) {
        return equipmentRepository.findByType(type);
    }
    
    public List<Equipment> getEquipmentByStatus(Equipment.EquipmentStatus status) {
        return equipmentRepository.findByStatus(status);
    }
    
    public List<Equipment> getEquipmentByLocation(String location) {
        return equipmentRepository.findByLocation(location);
    }
    
    public Equipment createEquipment(String name, Equipment.EquipmentType type, BigDecimal purchasePrice,
                                  String description, String location, String serialNumber) {
        Equipment equipment = new Equipment(name, type, purchasePrice);
        equipment.setDescription(description);
        equipment.setLocation(location);
        equipment.setSerialNumber(serialNumber);
        
        return equipmentRepository.save(equipment);
    }
    
    public Equipment updateEquipment(Long id, String name, Equipment.EquipmentType type, BigDecimal purchasePrice,
                                  String description, String location, String serialNumber) {
        Optional<Equipment> existingEquipment = equipmentRepository.findById(id);
        if (existingEquipment.isEmpty()) {
            throw new RuntimeException("Equipment not found");
        }
        
        Equipment equipment = existingEquipment.get();
        equipment.setName(name);
        equipment.setType(type);
        equipment.setPurchasePrice(purchasePrice);
        equipment.setDescription(description);
        equipment.setLocation(location);
        equipment.setSerialNumber(serialNumber);
        
        return equipmentRepository.save(equipment);
    }
    
    public Equipment updateEquipmentStatus(Long id, Equipment.EquipmentStatus status) {
        Optional<Equipment> existingEquipment = equipmentRepository.findById(id);
        if (existingEquipment.isEmpty()) {
            throw new RuntimeException("Equipment not found");
        }
        
        Equipment equipment = existingEquipment.get();
        equipment.setStatus(status);
        
        return equipmentRepository.save(equipment);
    }
    
    public Equipment scheduleMaintenance(Long id, LocalDateTime nextMaintenanceDate) {
        Optional<Equipment> existingEquipment = equipmentRepository.findById(id);
        if (existingEquipment.isEmpty()) {
            throw new RuntimeException("Equipment not found");
        }
        
        Equipment equipment = existingEquipment.get();
        equipment.setLastMaintenanceDate(LocalDateTime.now());
        equipment.setNextMaintenanceDate(nextMaintenanceDate);
        equipment.setStatus(Equipment.EquipmentStatus.MAINTENANCE);
        
        return equipmentRepository.save(equipment);
    }
    
    public Equipment completeMaintenance(Long id) {
        Optional<Equipment> existingEquipment = equipmentRepository.findById(id);
        if (existingEquipment.isEmpty()) {
            throw new RuntimeException("Equipment not found");
        }
        
        Equipment equipment = existingEquipment.get();
        equipment.setLastMaintenanceDate(LocalDateTime.now());
        equipment.setStatus(Equipment.EquipmentStatus.AVAILABLE);
        
        return equipmentRepository.save(equipment);
    }
    
    public void deleteEquipment(Long id) {
        Optional<Equipment> equipment = equipmentRepository.findById(id);
        if (equipment.isPresent()) {
            equipmentRepository.delete(equipment.get());
        }
    }
    
    public List<Equipment> getEquipmentNeedingMaintenance() {
        return equipmentRepository.findEquipmentNeedingMaintenance(LocalDateTime.now());
    }
    
    public List<Equipment> getEquipmentWithExpiringWarranty(LocalDateTime expiryDate) {
        return equipmentRepository.findEquipmentWithExpiringWarranty(expiryDate);
    }
    
    public Long getAvailableEquipmentCount() {
        return equipmentRepository.countAvailableEquipment();
    }
    
    public Long getEquipmentInMaintenanceCount() {
        return equipmentRepository.countEquipmentInMaintenance();
    }
    
    public List<Equipment> searchEquipment(String searchTerm) {
        return equipmentRepository.searchEquipmentByNameOrDescription(searchTerm, searchTerm);
    }
    
    public List<Equipment> getEquipmentPurchasedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return equipmentRepository.findEquipmentPurchasedBetween(startDate, endDate);
    }
    
    public Equipment setWarrantyExpiry(Long id, LocalDateTime warrantyExpiry) {
        Optional<Equipment> existingEquipment = equipmentRepository.findById(id);
        if (existingEquipment.isEmpty()) {
            throw new RuntimeException("Equipment not found");
        }
        
        Equipment equipment = existingEquipment.get();
        equipment.setWarrantyExpiry(warrantyExpiry);
        
        return equipmentRepository.save(equipment);
    }
} 