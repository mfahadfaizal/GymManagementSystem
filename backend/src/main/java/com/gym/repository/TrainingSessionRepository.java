package com.gym.repository;

import com.gym.entity.TrainingSession;
import com.gym.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {

    // --- Basic Queries ---
    List<TrainingSession> findByTrainer(User trainer);
    List<TrainingSession> findByMember(User member);
    List<TrainingSession> findByStatus(TrainingSession.SessionStatus status);

    // --- Trainer + Status / Member + Status (optional use) ---
    List<TrainingSession> findByTrainerAndStatus(User trainer, TrainingSession.SessionStatus status);
    List<TrainingSession> findByMemberAndStatus(User member, TrainingSession.SessionStatus status);

    // --- Date Range Filters ---
    @Query("SELECT ts FROM TrainingSession ts WHERE ts.trainer = :trainer AND ts.scheduledDate BETWEEN :startDate AND :endDate")
    List<TrainingSession> findSessionsByTrainerAndDateRange(@Param("trainer") User trainer,
                                                             @Param("startDate") LocalDateTime startDate,
                                                             @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ts FROM TrainingSession ts WHERE ts.member = :member AND ts.scheduledDate BETWEEN :startDate AND :endDate")
    List<TrainingSession> findSessionsByMemberAndDateRange(@Param("member") User member,
                                                            @Param("startDate") LocalDateTime startDate,
                                                            @Param("endDate") LocalDateTime endDate);

    List<TrainingSession> findByScheduledDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    // --- Upcoming Sessions ---
    @Query("SELECT ts FROM TrainingSession ts WHERE ts.scheduledDate >= :now AND ts.status = 'SCHEDULED' ORDER BY ts.scheduledDate")
    List<TrainingSession> findUpcomingSessions(@Param("now") LocalDateTime now);

    @Query("SELECT ts FROM TrainingSession ts WHERE ts.trainer = :trainer AND ts.scheduledDate >= :now AND ts.status = 'SCHEDULED' ORDER BY ts.scheduledDate")
    List<TrainingSession> findUpcomingSessionsByTrainer(@Param("trainer") User trainer, @Param("now") LocalDateTime now);

    @Query("SELECT ts FROM TrainingSession ts WHERE ts.member = :member AND ts.scheduledDate >= :now AND ts.status = 'SCHEDULED' ORDER BY ts.scheduledDate")
    List<TrainingSession> findUpcomingSessionsByMember(@Param("member") User member, @Param("now") LocalDateTime now);

    // --- Completed Sessions Count ---
    @Query("SELECT COUNT(ts) FROM TrainingSession ts WHERE ts.trainer = :trainer AND ts.status = 'COMPLETED'")
    Long countCompletedSessionsByTrainer(@Param("trainer") User trainer);

    @Query("SELECT COUNT(ts) FROM TrainingSession ts WHERE ts.member = :member AND ts.status = 'COMPLETED'")
    Long countCompletedSessionsByMember(@Param("member") User member);

    // --- By Type ---
    @Query("SELECT ts FROM TrainingSession ts WHERE ts.type = :type AND ts.status = 'SCHEDULED'")
    List<TrainingSession> findScheduledSessionsByType(@Param("type") TrainingSession.SessionType type);
}
