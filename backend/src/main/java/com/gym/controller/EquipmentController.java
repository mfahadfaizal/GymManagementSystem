package com.gym.controller;

import com.gym.entity.Equipment;
import com.gym.payload.request.EquipmentRequest;
import com.gym.payload.response.MessageResponse;
import com.gym.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EquipmentController {
    
    @Autowired
    private EquipmentService equipmentService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Equipment>> getAllEquipment() {
        List<Equipment> equipment = equipmentService.getAllEquipment();
        return ResponseEntity.ok(equipment);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable Long id) {
        return equipmentService.getEquipmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Equipment>> getEquipmentByType(@PathVariable String type) {
        try {
            Equipment.EquipmentType equipmentType = Equipment.EquipmentType.valueOf(type.toUpperCase());
            List<Equipment> equipment = equipmentService.getEquipmentByType(equipmentType);
            return ResponseEntity.ok(equipment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Equipment>> getEquipmentByStatus(@PathVariable String status) {
        try {
            Equipment.EquipmentStatus equipmentStatus = Equipment.EquipmentStatus.valueOf(status.toUpperCase());
            List<Equipment> equipment = equipmentService.getEquipmentByStatus(equipmentStatus);
            return ResponseEntity.ok(equipment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/location/{location}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Equipment>> getEquipmentByLocation(@PathVariable String location) {
        List<Equipment> equipment = equipmentService.getEquipmentByLocation(location);
        return ResponseEntity.ok(equipment);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> createEquipment(@Valid @RequestBody EquipmentRequest request) {
        try {
            Equipment equipment = equipmentService.createEquipment(
                request.getName(),
                request.getType(),
                request.getPurchasePrice(),
                request.getDescription(),
                request.getLocation(),
                request.getSerialNumber()
            );
            return ResponseEntity.ok(equipment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> updateEquipment(@PathVariable Long id, @Valid @RequestBody EquipmentRequest request) {
        try {
            Equipment equipment = equipmentService.updateEquipment(
                id,
                request.getName(),
                request.getType(),
                request.getPurchasePrice(),
                request.getDescription(),
                request.getLocation(),
                request.getSerialNumber()
            );
            return ResponseEntity.ok(equipment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> updateEquipmentStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Equipment.EquipmentStatus equipmentStatus = Equipment.EquipmentStatus.valueOf(status.toUpperCase());
            Equipment equipment = equipmentService.updateEquipmentStatus(id, equipmentStatus);
            return ResponseEntity.ok(equipment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid status"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/maintenance/schedule")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> scheduleMaintenance(@PathVariable Long id, @RequestParam LocalDateTime nextMaintenanceDate) {
        try {
            Equipment equipment = equipmentService.scheduleMaintenance(id, nextMaintenanceDate);
            return ResponseEntity.ok(equipment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/maintenance/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> completeMaintenance(@PathVariable Long id) {
        try {
            Equipment equipment = equipmentService.completeMaintenance(id);
            return ResponseEntity.ok(equipment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEquipment(@PathVariable Long id) {
        try {
            equipmentService.deleteEquipment(id);
            return ResponseEntity.ok(new MessageResponse("Equipment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/maintenance/needing")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Equipment>> getEquipmentNeedingMaintenance() {
        List<Equipment> equipment = equipmentService.getEquipmentNeedingMaintenance();
        return ResponseEntity.ok(equipment);
    }
    
    @GetMapping("/warranty/expiring")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Equipment>> getEquipmentWithExpiringWarranty(@RequestParam LocalDateTime expiryDate) {
        List<Equipment> equipment = equipmentService.getEquipmentWithExpiringWarranty(expiryDate);
        return ResponseEntity.ok(equipment);
    }
    
    @GetMapping("/stats/available-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Long> getAvailableEquipmentCount() {
        Long count = equipmentService.getAvailableEquipmentCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/maintenance-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Long> getEquipmentInMaintenanceCount() {
        Long count = equipmentService.getEquipmentInMaintenanceCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Equipment>> searchEquipment(@RequestParam String searchTerm) {
        List<Equipment> equipment = equipmentService.searchEquipment(searchTerm);
        return ResponseEntity.ok(equipment);
    }
    
    @GetMapping("/purchased")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Equipment>> getEquipmentPurchasedBetween(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<Equipment> equipment = equipmentService.getEquipmentPurchasedBetween(startDate, endDate);
        return ResponseEntity.ok(equipment);
    }
    
    @PutMapping("/{id}/warranty")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setWarrantyExpiry(@PathVariable Long id, @RequestParam LocalDateTime warrantyExpiry) {
        try {
            Equipment equipment = equipmentService.setWarrantyExpiry(id, warrantyExpiry);
            return ResponseEntity.ok(equipment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
} 