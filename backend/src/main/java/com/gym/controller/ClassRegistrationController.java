package com.gym.controller;

import com.gym.entity.ClassRegistration;
import com.gym.payload.response.MessageResponse;
import com.gym.service.ClassRegistrationService;
import com.gym.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/class-registrations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClassRegistrationController {
    
    @Autowired
    private ClassRegistrationService classRegistrationService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<ClassRegistration>> getAllRegistrations() {
        List<ClassRegistration> registrations = classRegistrationService.getAllRegistrations();
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<ClassRegistration> getRegistrationById(@PathVariable Long id) {
        return classRegistrationService.getRegistrationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<List<ClassRegistration>> getRegistrationsByMember(@PathVariable Long memberId) {
        List<ClassRegistration> registrations = classRegistrationService.getRegistrationsByMember(memberId);
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/class/{classId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<ClassRegistration>> getRegistrationsByGymClass(@PathVariable Long classId) {
        List<ClassRegistration> registrations = classRegistrationService.getRegistrationsByGymClass(classId);
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/member/{memberId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<List<ClassRegistration>> getRegistrationsByMemberAndStatus(
            @PathVariable Long memberId, @PathVariable String status) {
        try {
            ClassRegistration.RegistrationStatus registrationStatus = ClassRegistration.RegistrationStatus.valueOf(status.toUpperCase());
            List<ClassRegistration> registrations = classRegistrationService.getRegistrationsByMemberAndStatus(memberId, registrationStatus);
            return ResponseEntity.ok(registrations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/class/{classId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<ClassRegistration>> getRegistrationsByGymClassAndStatus(
            @PathVariable Long classId, @PathVariable String status) {
        try {
            ClassRegistration.RegistrationStatus registrationStatus = ClassRegistration.RegistrationStatus.valueOf(status.toUpperCase());
            List<ClassRegistration> registrations = classRegistrationService.getRegistrationsByGymClassAndStatus(classId, registrationStatus);
            return ResponseEntity.ok(registrations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or hasRole('MEMBER')")
    public ResponseEntity<?> registerForClass(@RequestParam Long memberId, @RequestParam Long classId) {
        try {
            ClassRegistration registration = classRegistrationService.registerForClass(memberId, classId);
            return ResponseEntity.ok(registration);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> updateRegistrationStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            ClassRegistration.RegistrationStatus registrationStatus = ClassRegistration.RegistrationStatus.valueOf(status.toUpperCase());
            ClassRegistration registration = classRegistrationService.updateRegistrationStatus(id, registrationStatus);
            return ResponseEntity.ok(registration);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid status"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or hasRole('MEMBER')")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long id) {
        try {
            classRegistrationService.cancelRegistration(id);
            return ResponseEntity.ok(new MessageResponse("Registration cancelled successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRegistration(@PathVariable Long id) {
        try {
            classRegistrationService.deleteRegistration(id);
            return ResponseEntity.ok(new MessageResponse("Registration deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<ClassRegistration>> getUpcomingRegistrations() {
        List<ClassRegistration> registrations = classRegistrationService.getUpcomingRegistrations();
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/member/{memberId}/upcoming")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<List<ClassRegistration>> getUpcomingRegistrationsByMember(@PathVariable Long memberId) {
        List<ClassRegistration> registrations = classRegistrationService.getUpcomingRegistrationsByMember(memberId);
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/member/{memberId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<List<ClassRegistration>> getRegistrationsByMemberAndDateRange(
            @PathVariable Long memberId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<ClassRegistration> registrations = classRegistrationService.getRegistrationsByDateRange(memberId, startDate, endDate);
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/class/{classId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<ClassRegistration>> getRegistrationsByGymClassAndDateRange(
            @PathVariable Long classId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<ClassRegistration> registrations = classRegistrationService.getRegistrationsByGymClassAndDateRange(classId, startDate, endDate);
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/class/{classId}/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<Long> getRegistrationCountByGymClass(@PathVariable Long classId) {
        Long count = classRegistrationService.getRegistrationCountByGymClass(classId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/member/{memberId}/attended-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<Long> getAttendedClassesCountByMember(@PathVariable Long memberId) {
        Long count = classRegistrationService.getAttendedClassesCountByMember(memberId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/check/{memberId}/{classId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<Boolean> isMemberRegisteredForClass(@PathVariable Long memberId, @PathVariable Long classId) {
        boolean isRegistered = classRegistrationService.isMemberRegisteredForClass(memberId, classId);
        return ResponseEntity.ok(isRegistered);
    }
    
    @PutMapping("/{id}/attendance")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> markAttendance(@PathVariable Long id) {
        try {
            ClassRegistration registration = classRegistrationService.markAttendance(id);
            return ResponseEntity.ok(registration);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/no-show")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> markNoShow(@PathVariable Long id) {
        try {
            ClassRegistration registration = classRegistrationService.markNoShow(id);
            return ResponseEntity.ok(registration);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
} 