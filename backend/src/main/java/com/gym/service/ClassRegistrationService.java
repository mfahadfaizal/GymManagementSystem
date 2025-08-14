package com.gym.service;

import com.gym.entity.ClassRegistration;
import com.gym.entity.GymClass;
import com.gym.entity.User;
import com.gym.repository.ClassRegistrationRepository;
import com.gym.repository.GymClassRepository;
import com.gym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ClassRegistrationService {
    
    @Autowired
    private ClassRegistrationRepository classRegistrationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GymClassRepository gymClassRepository;
    
    @Autowired
    private GymClassService gymClassService;
    
    public List<ClassRegistration> getAllRegistrations() {
        return classRegistrationRepository.findAll();
    }
    
    public Optional<ClassRegistration> getRegistrationById(Long id) {
        return classRegistrationRepository.findById(id);
    }
    
    public List<ClassRegistration> getRegistrationsByMember(Long memberId) {
        Optional<User> member = userRepository.findById(memberId);
        return member.map(classRegistrationRepository::findByMember).orElse(List.of());
    }
    
    public List<ClassRegistration> getRegistrationsByGymClass(Long classId) {
        Optional<GymClass> gymClass = gymClassRepository.findById(classId);
        return gymClass.map(classRegistrationRepository::findByGymClass).orElse(List.of());
    }
    
    public List<ClassRegistration> getRegistrationsByMemberAndStatus(Long memberId, ClassRegistration.RegistrationStatus status) {
        Optional<User> member = userRepository.findById(memberId);
        if (member.isPresent()) {
            return classRegistrationRepository.findByMemberAndStatus(member.get(), status);
        }
        return List.of();
    }
    
    public List<ClassRegistration> getRegistrationsByGymClassAndStatus(Long classId, ClassRegistration.RegistrationStatus status) {
        Optional<GymClass> gymClass = gymClassRepository.findById(classId);
        if (gymClass.isPresent()) {
            return classRegistrationRepository.findByGymClassAndStatus(gymClass.get(), status);
        }
        return List.of();
    }
    
    public ClassRegistration registerForClass(Long memberId, Long classId) {
        Optional<User> member = userRepository.findById(memberId);
        Optional<GymClass> gymClass = gymClassRepository.findById(classId);
        
        if (member.isEmpty() || gymClass.isEmpty()) {
            throw new RuntimeException("Member or gym class not found");
        }
        
        // Check if member is already registered for this class
        Optional<ClassRegistration> existingRegistration = classRegistrationRepository.findByMemberAndGymClass(member.get(), gymClass.get());
        if (existingRegistration.isPresent()) {
            throw new RuntimeException("Member is already registered for this class");
        }
        
        // Check if class is available and has capacity
        GymClass classToRegister = gymClass.get();
        if (classToRegister.getStatus() != GymClass.ClassStatus.ACTIVE) {
            throw new RuntimeException("Class is not available for registration");
        }
        
        if (classToRegister.getCurrentEnrollment() >= classToRegister.getMaxCapacity()) {
            throw new RuntimeException("Class is already full");
        }
        
        // Create registration
        ClassRegistration registration = new ClassRegistration(member.get(), classToRegister);
        
        // Increment class enrollment
        gymClassService.incrementEnrollment(classId);
        
        return classRegistrationRepository.save(registration);
    }
    
    public ClassRegistration updateRegistrationStatus(Long id, ClassRegistration.RegistrationStatus status) {
        Optional<ClassRegistration> existingRegistration = classRegistrationRepository.findById(id);
        if (existingRegistration.isEmpty()) {
            throw new RuntimeException("Registration not found");
        }
        
        ClassRegistration registration = existingRegistration.get();
        registration.setStatus(status);
        
        if (status == ClassRegistration.RegistrationStatus.ATTENDED) {
            registration.setAttendanceDate(LocalDateTime.now());
        }
        
        return classRegistrationRepository.save(registration);
    }
    
    public void cancelRegistration(Long id) {
        Optional<ClassRegistration> existingRegistration = classRegistrationRepository.findById(id);
        if (existingRegistration.isPresent()) {
            ClassRegistration registration = existingRegistration.get();
            
            // Decrement class enrollment
            gymClassService.decrementEnrollment(registration.getGymClass().getId());
            
            // Update registration status
            registration.setStatus(ClassRegistration.RegistrationStatus.CANCELLED);
            classRegistrationRepository.save(registration);
        }
    }
    
    public void deleteRegistration(Long id) {
        Optional<ClassRegistration> registration = classRegistrationRepository.findById(id);
        if (registration.isPresent()) {
            classRegistrationRepository.delete(registration.get());
        }
    }
    
    public List<ClassRegistration> getUpcomingRegistrations() {
        return classRegistrationRepository.findUpcomingRegistrations(LocalDateTime.now());
    }
    
    public List<ClassRegistration> getUpcomingRegistrationsByMember(Long memberId) {
        Optional<User> member = userRepository.findById(memberId);
        if (member.isPresent()) {
            return classRegistrationRepository.findUpcomingRegistrationsByMember(member.get(), LocalDateTime.now());
        }
        return List.of();
    }
    
    public List<ClassRegistration> getRegistrationsByDateRange(Long memberId, LocalDateTime startDate, LocalDateTime endDate) {
        Optional<User> member = userRepository.findById(memberId);
        if (member.isPresent()) {
            return classRegistrationRepository.findRegistrationsByMemberAndDateRange(member.get(), startDate, endDate);
        }
        return List.of();
    }
    
    public List<ClassRegistration> getRegistrationsByGymClassAndDateRange(Long classId, LocalDateTime startDate, LocalDateTime endDate) {
        Optional<GymClass> gymClass = gymClassRepository.findById(classId);
        if (gymClass.isPresent()) {
            return classRegistrationRepository.findRegistrationsByGymClassAndDateRange(gymClass.get(), startDate, endDate);
        }
        return List.of();
    }
    
    public Long getRegistrationCountByGymClass(Long classId) {
        Optional<GymClass> gymClass = gymClassRepository.findById(classId);
        return gymClass.map(classRegistrationRepository::countRegistrationsByGymClass).orElse(0L);
    }
    
    public Long getAttendedClassesCountByMember(Long memberId) {
        Optional<User> member = userRepository.findById(memberId);
        return member.map(m -> classRegistrationRepository.countAttendedClassesByMember(m)).orElse(0L);
    }
    
    public boolean isMemberRegisteredForClass(Long memberId, Long classId) {
        Optional<User> member = userRepository.findById(memberId);
        Optional<GymClass> gymClass = gymClassRepository.findById(classId);
        
        if (member.isPresent() && gymClass.isPresent()) {
            return classRegistrationRepository.existsByMemberAndGymClass(member.get(), gymClass.get());
        }
        return false;
    }
    
    public ClassRegistration markAttendance(Long id) {
        return updateRegistrationStatus(id, ClassRegistration.RegistrationStatus.ATTENDED);
    }
    
    public ClassRegistration markNoShow(Long id) {
        return updateRegistrationStatus(id, ClassRegistration.RegistrationStatus.NO_SHOW);
    }

    public ClassRegistration save(ClassRegistration registration) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }
} 