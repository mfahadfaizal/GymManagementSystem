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

    // --- General Methods ---
    public List<TrainingSession> getAllTrainingSessions() {
        return trainingSessionRepository.findAll();
    }

    public Optional<TrainingSession> getTrainingSessionById(Long id) {
        return trainingSessionRepository.findById(id);
    }

    // --- Create Session ---
    public TrainingSession createTrainingSession(
            Long trainerId,
            Long memberId,
            TrainingSession.SessionType type,
            LocalDateTime scheduledDate,
            Integer duration,
            BigDecimal price,
            String notes,
            String location) {

        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // Conflict check
        List<TrainingSession> conflicts = trainingSessionRepository.findSessionsByTrainerAndDateRange(
                trainer,
                scheduledDate,
                scheduledDate.plusMinutes(duration));

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Trainer is not available at the scheduled time");
        }

        TrainingSession session = new TrainingSession(trainer, member, type, scheduledDate, duration);
        session.setPrice(price);
        session.setNotes(notes);
        session.setLocation(location);

        return trainingSessionRepository.save(session);
    }

    // --- Update Session ---
    public TrainingSession updateTrainingSession(
            Long id,
            TrainingSession.SessionType type,
            LocalDateTime scheduledDate,
            Integer duration,
            BigDecimal price,
            String notes,
            String location) {

        TrainingSession session = trainingSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training session not found"));

        session.setType(type);
        session.setScheduledDate(scheduledDate);
        session.setDuration(duration);
        session.setPrice(price);
        session.setNotes(notes);
        session.setLocation(location);

        return trainingSessionRepository.save(session);
    }

    // --- Delete Session ---
    public void deleteTrainingSession(Long id) {
        TrainingSession session = trainingSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training session not found"));

        trainingSessionRepository.delete(session);
    }

    // --- Update Session Status ---
    public TrainingSession updateSessionStatus(Long id, TrainingSession.SessionStatus status) {
        TrainingSession session = trainingSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training session not found"));

        session.setStatus(status);

        if (status == TrainingSession.SessionStatus.IN_PROGRESS) {
            session.setStartTime(LocalDateTime.now());
        } else if (status == TrainingSession.SessionStatus.COMPLETED) {
            session.setEndTime(LocalDateTime.now());
        }

        return trainingSessionRepository.save(session);
    }

    // --- Reschedule ---
    public TrainingSession rescheduleSession(Long id, LocalDateTime newScheduledDate) {
        TrainingSession session = trainingSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training session not found"));

        session.setScheduledDate(newScheduledDate);
        session.setStatus(TrainingSession.SessionStatus.SCHEDULED);

        return trainingSessionRepository.save(session);
    }

    // --- By Trainer ---
    public List<TrainingSession> getSessionsByTrainer(Long trainerId) {
        return userRepository.findById(trainerId)
                .map(trainingSessionRepository::findByTrainer)
                .orElse(List.of());
    }

    public List<TrainingSession> getUpcomingSessionsByTrainer(Long trainerId) {
        return userRepository.findById(trainerId)
                .map(trainer -> trainingSessionRepository.findUpcomingSessionsByTrainer(trainer, LocalDateTime.now()))
                .orElse(List.of());
    }

    public List<TrainingSession> getSessionsByTrainerAndDateRange(Long trainerId, LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.findById(trainerId)
                .map(trainer -> trainingSessionRepository.findSessionsByTrainerAndDateRange(trainer, startDate, endDate))
                .orElse(List.of());
    }

    public Long getCompletedSessionsByTrainer(Long trainerId) {
        return userRepository.findById(trainerId)
                .map(trainingSessionRepository::countCompletedSessionsByTrainer)
                .orElse(0L);
    }

    // --- By Member ---
    public List<TrainingSession> getSessionsByMember(Long memberId) {
        return userRepository.findById(memberId)
                .map(trainingSessionRepository::findByMember)
                .orElse(List.of());
    }

    public List<TrainingSession> getUpcomingSessionsByMember(Long memberId) {
        return userRepository.findById(memberId)
                .map(member -> trainingSessionRepository.findUpcomingSessionsByMember(member, LocalDateTime.now()))
                .orElse(List.of());
    }

    public List<TrainingSession> getSessionsByMemberAndDateRange(Long memberId, LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.findById(memberId)
                .map(member -> trainingSessionRepository.findSessionsByMemberAndDateRange(member, startDate, endDate))
                .orElse(List.of());
    }

    public Long getCompletedSessionsByMember(Long memberId) {
        return userRepository.findById(memberId)
                .map(trainingSessionRepository::countCompletedSessionsByMember)
                .orElse(0L);
    }

    // --- Date Range ---
    public List<TrainingSession> getSessionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return trainingSessionRepository.findByScheduledDateBetween(startDate, endDate);
    }

    // --- Status / Type ---
    public List<TrainingSession> getSessionsByStatus(TrainingSession.SessionStatus status) {
        return trainingSessionRepository.findByStatus(status);
    }

    public List<TrainingSession> getScheduledSessionsByType(TrainingSession.SessionType type) {
        return trainingSessionRepository.findScheduledSessionsByType(type);
    }

    // --- Upcoming All ---
    public List<TrainingSession> getUpcomingSessions() {
        return trainingSessionRepository.findUpcomingSessions(LocalDateTime.now());
    }
}
