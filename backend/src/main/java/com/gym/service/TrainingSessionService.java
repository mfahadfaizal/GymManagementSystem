package com.gym.service;

import com.gym.entity.TrainingSession;
import com.gym.entity.User;
import com.gym.repository.TrainingSessionRepository;
import com.gym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TrainingSessionService {
    
    @Autowired
    private TrainingSessionRepository trainingSessionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<TrainingSession> getAllTrainingSessions() {
        return trainingSessionRepository.findAll();
    }
    
    public Optional<TrainingSession> getTrainingSessionById(Long id) {
        return trainingSessionRepository.findById(id);
    }
    
    public List<TrainingSession> getSessionsByTrainer(Long trainerId) {
        Optional<User> trainer = userRepository.findById(trainerId);
        return trainer.map(trainingSessionRepository::findByTrainer).orElse(List.of());
    }
    
    public List<TrainingSession> getSessionsByMember(Long memberId) {
        Optional<User> member = userRepository.findById(memberId);
        return member.map(trainingSessionRepository::findByMember).orElse(List.of());
    }
    
    public List<TrainingSession> getSessionsByStatus(TrainingSession.SessionStatus status) {
        return trainingSessionRepository.findByStatus(status);
    }
    
    public List<TrainingSession> getUpcomingSessions() {
        return trainingSessionRepository.findUpcomingSessions(LocalDateTime.now());
    }
    
    public List<TrainingSession> getUpcomingSessionsByTrainer(Long trainerId) {
        Optional<User> trainer = userRepository.findById(trainerId);
        if (trainer.isPresent()) {
            return trainingSessionRepository.findUpcomingSessionsByTrainer(trainer.get(), LocalDateTime.now());
        }
        return List.of();
    }
    
    public List<TrainingSession> getUpcomingSessionsByMember(Long memberId) {
        Optional<User> member = userRepository.findById(memberId);
        if (member.isPresent()) {
            return trainingSessionRepository.findUpcomingSessionsByMember(member.get(), LocalDateTime.now());
        }
        return List.of();
    }
    
    public TrainingSession createTrainingSession(Long trainerId, Long memberId, TrainingSession.SessionType type,
                                             LocalDateTime scheduledDate, Integer duration, BigDecimal price,
                                             String notes, String location) {
        Optional<User> trainer = userRepository.findById(trainerId);
        Optional<User> member = userRepository.findById(memberId);
        
        if (trainer.isEmpty() || member.isEmpty()) {
            throw new RuntimeException("Trainer or member not found");
        }
        
        // Check if trainer is available at the scheduled time
        List<TrainingSession> conflictingSessions = trainingSessionRepository.findSessionsByTrainerAndDateRange(
            trainer.get(), scheduledDate, scheduledDate.plusMinutes(duration));
        
        if (!conflictingSessions.isEmpty()) {
            throw new RuntimeException("Trainer is not available at the scheduled time");
        }
        
        TrainingSession session = new TrainingSession(trainer.get(), member.get(), type, scheduledDate, duration);
        session.setPrice(price);
        session.setNotes(notes);
        session.setLocation(location);
        
        return trainingSessionRepository.save(session);
    }
    
    public TrainingSession updateTrainingSession(Long id, TrainingSession.SessionType type, LocalDateTime scheduledDate,
                                             Integer duration, BigDecimal price, String notes, String location) {
        Optional<TrainingSession> existingSession = trainingSessionRepository.findById(id);
        if (existingSession.isEmpty()) {
            throw new RuntimeException("Training session not found");
        }
        
        TrainingSession session = existingSession.get();
        session.setType(type);
        session.setScheduledDate(scheduledDate);
        session.setDuration(duration);
        session.setPrice(price);
        session.setNotes(notes);
        session.setLocation(location);
        
        return trainingSessionRepository.save(session);
    }
    
    public TrainingSession updateSessionStatus(Long id, TrainingSession.SessionStatus status) {
        Optional<TrainingSession> existingSession = trainingSessionRepository.findById(id);
        if (existingSession.isEmpty()) {
            throw new RuntimeException("Training session not found");
        }
        
        TrainingSession session = existingSession.get();
        session.setStatus(status);
        
        if (status == TrainingSession.SessionStatus.IN_PROGRESS) {
            session.setStartTime(LocalDateTime.now());
        } else if (status == TrainingSession.SessionStatus.COMPLETED) {
            session.setEndTime(LocalDateTime.now());
        }
        
        return trainingSessionRepository.save(session);
    }
    
    public void deleteTrainingSession(Long id) {
        Optional<TrainingSession> session = trainingSessionRepository.findById(id);
        if (session.isPresent()) {
            trainingSessionRepository.delete(session.get());
        }
    }
    
    public List<TrainingSession> getSessionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return trainingSessionRepository.findUpcomingSessions(startDate).stream()
                .filter(session -> session.getScheduledDate().isAfter(startDate) && 
                                 session.getScheduledDate().isBefore(endDate))
                .toList();
    }
    
    public List<TrainingSession> getSessionsByTrainerAndDateRange(Long trainerId, LocalDateTime startDate, LocalDateTime endDate) {
        Optional<User> trainer = userRepository.findById(trainerId);
        if (trainer.isPresent()) {
            return trainingSessionRepository.findSessionsByTrainerAndDateRange(trainer.get(), startDate, endDate);
        }
        return List.of();
    }
    
    public List<TrainingSession> getSessionsByMemberAndDateRange(Long memberId, LocalDateTime startDate, LocalDateTime endDate) {
        Optional<User> member = userRepository.findById(memberId);
        if (member.isPresent()) {
            return trainingSessionRepository.findSessionsByMemberAndDateRange(member.get(), startDate, endDate);
        }
        return List.of();
    }
    
    public Long getCompletedSessionsByTrainer(Long trainerId) {
        Optional<User> trainer = userRepository.findById(trainerId);
        return trainer.map(t -> trainingSessionRepository.countCompletedSessionsByTrainer(t)).orElse(0L);
    }
    
    public Long getCompletedSessionsByMember(Long memberId) {
        Optional<User> member = userRepository.findById(memberId);
        return member.map(m -> trainingSessionRepository.countCompletedSessionsByMember(m)).orElse(0L);
    }
    
    public List<TrainingSession> getScheduledSessionsByType(TrainingSession.SessionType type) {
        return trainingSessionRepository.findScheduledSessionsByType(type);
    }
    
    public TrainingSession rescheduleSession(Long id, LocalDateTime newScheduledDate) {
        Optional<TrainingSession> existingSession = trainingSessionRepository.findById(id);
        if (existingSession.isEmpty()) {
            throw new RuntimeException("Training session not found");
        }
        
        TrainingSession session = existingSession.get();
        session.setScheduledDate(newScheduledDate);
        session.setStatus(TrainingSession.SessionStatus.SCHEDULED);
        
        return trainingSessionRepository.save(session);
    }
} 