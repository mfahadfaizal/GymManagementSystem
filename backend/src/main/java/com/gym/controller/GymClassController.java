package com.gym.controller;

import com.gym.entity.GymClass;
import com.gym.payload.request.GymClassRequest;
import com.gym.payload.response.MessageResponse;
import com.gym.service.GymClassService;
import com.gym.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/gym-classes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GymClassController {
    
    @Autowired
    private GymClassService gymClassService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<GymClass>> getAllGymClasses() {
        List<GymClass> classes = gymClassService.getAllGymClasses();
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<GymClass> getGymClassById(@PathVariable Long id) {
        return gymClassService.getGymClassById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<GymClass>> getClassesByType(@PathVariable String type) {
        try {
            GymClass.ClassType classType = GymClass.ClassType.valueOf(type.toUpperCase());
            List<GymClass> classes = gymClassService.getClassesByType(classType);
            return ResponseEntity.ok(classes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<GymClass>> getClassesByStatus(@PathVariable String status) {
        try {
            GymClass.ClassStatus classStatus = GymClass.ClassStatus.valueOf(status.toUpperCase());
            List<GymClass> classes = gymClassService.getClassesByStatus(classStatus);
            return ResponseEntity.ok(classes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/trainer/{trainerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#trainerId)")
    public ResponseEntity<List<GymClass>> getClassesByTrainer(@PathVariable Long trainerId) {
        List<GymClass> classes = gymClassService.getClassesByTrainer(trainerId);
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/location/{location}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<GymClass>> getClassesByLocation(@PathVariable String location) {
        List<GymClass> classes = gymClassService.getClassesByLocation(location);
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<GymClass>> getAvailableClasses() {
        List<GymClass> classes = gymClassService.getAvailableClasses();
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/full")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<GymClass>> getFullClasses() {
        List<GymClass> classes = gymClassService.getFullClasses();
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/trainer/{trainerId}/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#trainerId)")
    public ResponseEntity<List<GymClass>> getActiveClassesByTrainer(@PathVariable Long trainerId) {
        List<GymClass> classes = gymClassService.getActiveClassesByTrainer(trainerId);
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/type/{type}/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<GymClass>> getActiveClassesByType(@PathVariable String type) {
        try {
            GymClass.ClassType classType = GymClass.ClassType.valueOf(type.toUpperCase());
            List<GymClass> classes = gymClassService.getActiveClassesByType(classType);
            return ResponseEntity.ok(classes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> createGymClass(@Valid @RequestBody GymClassRequest request) {
        try {
            GymClass gymClass = gymClassService.createGymClass(
                request.getName(),
                request.getType(),
                request.getTrainerId(),
                request.getStartTime(),
                request.getEndTime(),
                request.getMaxCapacity(),
                request.getPrice(),
                request.getDescription(),
                request.getLocation(),
                request.getScheduleDays()
            );
            return ResponseEntity.ok(gymClass);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> updateGymClass(@PathVariable Long id, @Valid @RequestBody GymClassRequest request) {
        try {
            GymClass gymClass = gymClassService.updateGymClass(
                id,
                request.getName(),
                request.getType(),
                request.getTrainerId(),
                request.getStartTime(),
                request.getEndTime(),
                request.getMaxCapacity(),
                request.getPrice(),
                request.getDescription(),
                request.getLocation(),
                request.getScheduleDays()
            );
            return ResponseEntity.ok(gymClass);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> updateClassStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            GymClass.ClassStatus classStatus = GymClass.ClassStatus.valueOf(status.toUpperCase());
            GymClass gymClass = gymClassService.updateClassStatus(id, classStatus);
            return ResponseEntity.ok(gymClass);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid status"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteGymClass(@PathVariable Long id) {
        try {
            gymClassService.deleteGymClass(id);
            return ResponseEntity.ok(new MessageResponse("Gym class deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/time-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<GymClass>> getClassesByTimeRange(
            @RequestParam LocalTime startTime,
            @RequestParam LocalTime endTime) {
        List<GymClass> classes = gymClassService.getClassesByTimeRange(startTime, endTime);
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/day/{day}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<GymClass>> getClassesByDay(@PathVariable String day) {
        List<GymClass> classes = gymClassService.getClassesByDay(day);
        return ResponseEntity.ok(classes);
    }
    
    @GetMapping("/stats/active-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<Long> getActiveClassesCount() {
        Long count = gymClassService.getActiveClassesCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<GymClass>> searchClasses(@RequestParam String searchTerm) {
        List<GymClass> classes = gymClassService.searchClasses(searchTerm);
        return ResponseEntity.ok(classes);
    }
    
    @PutMapping("/{id}/enrollment")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> updateEnrollment(@PathVariable Long id, @RequestParam Integer currentEnrollment) {
        try {
            GymClass gymClass = gymClassService.updateEnrollment(id, currentEnrollment);
            return ResponseEntity.ok(gymClass);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/enrollment/increment")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> incrementEnrollment(@PathVariable Long id) {
        try {
            GymClass gymClass = gymClassService.incrementEnrollment(id);
            return ResponseEntity.ok(gymClass);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/enrollment/decrement")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> decrementEnrollment(@PathVariable Long id) {
        try {
            GymClass gymClass = gymClassService.decrementEnrollment(id);
            return ResponseEntity.ok(gymClass);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
} 