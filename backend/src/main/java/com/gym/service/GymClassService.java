package com.gym.service;

import com.gym.entity.GymClass;
import com.gym.entity.User;
import com.gym.repository.GymClassRepository;
import com.gym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GymClassService {
    
    @Autowired
    private GymClassRepository gymClassRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<GymClass> getAllGymClasses() {
        return gymClassRepository.findAll();
    }
    
    public Optional<GymClass> getGymClassById(Long id) {
        return gymClassRepository.findById(id);
    }
    
    public List<GymClass> getClassesByType(GymClass.ClassType type) {
        return gymClassRepository.findByType(type);
    }
    
    public List<GymClass> getClassesByStatus(GymClass.ClassStatus status) {
        return gymClassRepository.findByStatus(status);
    }
    
    public List<GymClass> getClassesByTrainer(Long trainerId) {
        Optional<User> trainer = userRepository.findById(trainerId);
        return trainer.map(gymClassRepository::findByTrainer).orElse(List.of());
    }
    
    public List<GymClass> getClassesByLocation(String location) {
        return gymClassRepository.findByLocation(location);
    }
    
    public List<GymClass> getAvailableClasses() {
        return gymClassRepository.findAvailableClasses();
    }
    
    public List<GymClass> getFullClasses() {
        return gymClassRepository.findFullClasses();
    }
    
    public List<GymClass> getActiveClassesByTrainer(Long trainerId) {
        Optional<User> trainer = userRepository.findById(trainerId);
        if (trainer.isPresent()) {
            return gymClassRepository.findActiveClassesByTrainer(trainer.get());
        }
        return List.of();
    }
    
    public List<GymClass> getActiveClassesByType(GymClass.ClassType type) {
        return gymClassRepository.findActiveClassesByType(type);
    }
    
    public GymClass createGymClass(String name, GymClass.ClassType type, Long trainerId, LocalTime startTime,
                                 LocalTime endTime, Integer maxCapacity, BigDecimal price, String description,
                                 String location, String scheduleDays) {
        Optional<User> trainer = userRepository.findById(trainerId);
        if (trainer.isEmpty()) {
            throw new RuntimeException("Trainer not found");
        }
        
        GymClass gymClass = new GymClass(name, type, trainer.get(), startTime, endTime, maxCapacity);
        gymClass.setPrice(price);
        gymClass.setDescription(description);
        gymClass.setLocation(location);
        gymClass.setScheduleDays(scheduleDays);
        gymClass.setDuration((int) java.time.Duration.between(startTime, endTime).toMinutes());
        
        return gymClassRepository.save(gymClass);
    }
    
    public GymClass updateGymClass(Long id, String name, GymClass.ClassType type, Long trainerId, LocalTime startTime,
                                 LocalTime endTime, Integer maxCapacity, BigDecimal price, String description,
                                 String location, String scheduleDays) {
        Optional<GymClass> existingClass = gymClassRepository.findById(id);
        if (existingClass.isEmpty()) {
            throw new RuntimeException("Gym class not found");
        }
        
        Optional<User> trainer = userRepository.findById(trainerId);
        if (trainer.isEmpty()) {
            throw new RuntimeException("Trainer not found");
        }
        
        GymClass gymClass = existingClass.get();
        gymClass.setName(name);
        gymClass.setType(type);
        gymClass.setTrainer(trainer.get());
        gymClass.setStartTime(startTime);
        gymClass.setEndTime(endTime);
        gymClass.setMaxCapacity(maxCapacity);
        gymClass.setPrice(price);
        gymClass.setDescription(description);
        gymClass.setLocation(location);
        gymClass.setScheduleDays(scheduleDays);
        gymClass.setDuration((int) java.time.Duration.between(startTime, endTime).toMinutes());
        
        return gymClassRepository.save(gymClass);
    }
    
    public GymClass updateClassStatus(Long id, GymClass.ClassStatus status) {
        Optional<GymClass> existingClass = gymClassRepository.findById(id);
        if (existingClass.isEmpty()) {
            throw new RuntimeException("Gym class not found");
        }
        
        GymClass gymClass = existingClass.get();
        gymClass.setStatus(status);
        
        return gymClassRepository.save(gymClass);
    }
    
    public void deleteGymClass(Long id) {
        Optional<GymClass> gymClass = gymClassRepository.findById(id);
        if (gymClass.isPresent()) {
            gymClassRepository.delete(gymClass.get());
        }
    }
    
    public List<GymClass> getClassesByTimeRange(LocalTime startTime, LocalTime endTime) {
        return gymClassRepository.findClassesByTimeRange(startTime, endTime);
    }
    
    public List<GymClass> getClassesByDay(String day) {
        return gymClassRepository.findClassesByDay(day);
    }
    
    public Long getActiveClassesCount() {
        return gymClassRepository.countActiveClasses();
    }
    
    public List<GymClass> searchClasses(String searchTerm) {
        return gymClassRepository.searchClassesByNameOrDescription(searchTerm, searchTerm);
    }
    
    public GymClass updateEnrollment(Long id, Integer currentEnrollment) {
        Optional<GymClass> existingClass = gymClassRepository.findById(id);
        if (existingClass.isEmpty()) {
            throw new RuntimeException("Gym class not found");
        }
        
        GymClass gymClass = existingClass.get();
        gymClass.setCurrentEnrollment(currentEnrollment);
        
        // Update status if class is full
        if (currentEnrollment >= gymClass.getMaxCapacity()) {
            gymClass.setStatus(GymClass.ClassStatus.FULL);
        } else if (gymClass.getStatus() == GymClass.ClassStatus.FULL) {
            gymClass.setStatus(GymClass.ClassStatus.ACTIVE);
        }
        
        return gymClassRepository.save(gymClass);
    }
    
    public GymClass incrementEnrollment(Long id) {
        Optional<GymClass> existingClass = gymClassRepository.findById(id);
        if (existingClass.isEmpty()) {
            throw new RuntimeException("Gym class not found");
        }
        
        GymClass gymClass = existingClass.get();
        int newEnrollment = gymClass.getCurrentEnrollment() + 1;
        
        if (newEnrollment > gymClass.getMaxCapacity()) {
            throw new RuntimeException("Class is already full");
        }
        
        return updateEnrollment(id, newEnrollment);
    }
    
    public GymClass decrementEnrollment(Long id) {
        Optional<GymClass> existingClass = gymClassRepository.findById(id);
        if (existingClass.isEmpty()) {
            throw new RuntimeException("Gym class not found");
        }
        
        GymClass gymClass = existingClass.get();
        int newEnrollment = Math.max(0, gymClass.getCurrentEnrollment() - 1);
        
        return updateEnrollment(id, newEnrollment);
    }
} 