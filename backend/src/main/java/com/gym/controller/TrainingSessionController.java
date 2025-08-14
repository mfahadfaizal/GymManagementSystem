package com.gym.controller;

import com.gym.entity.TrainingSession;
import com.gym.payload.request.TrainingSessionRequest;
import com.gym.payload.response.MessageResponse;
import com.gym.service.TrainingSessionService;
import com.gym.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/training-sessions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TrainingSessionController {

    @Autowired
    private TrainingSessionService trainingSessionService;

    @Autowired
    private UserService userService;

    // --- Get All ---
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<TrainingSession>> getAllTrainingSessions() {
        return ResponseEntity.ok(trainingSessionService.getAllTrainingSessions());
    }

    // --- Get By ID ---
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#id)")
    public ResponseEntity<TrainingSession> getTrainingSessionById(@PathVariable Long id) {
        return trainingSessionService.getTrainingSessionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Member Booking ---
    @PostMapping("/book")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<?> bookTrainingSession(@Valid @RequestBody TrainingSessionRequest request) {
        Long currentMemberId = userService.getCurrentUserId();

        if (!currentMemberId.equals(request.getMemberId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("You can only book sessions for yourself"));
        }

        try {
            TrainingSession session = trainingSessionService.createTrainingSession(
                    request.getTrainerId(),
                    currentMemberId,
                    request.getType(),
                    request.getScheduledDate(),
                    request.getDuration(),
                    request.getPrice(),
                    request.getNotes(),
                    request.getLocation()
            );
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // --- Admin/Trainer Creates Session ---
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> createTrainingSession(@Valid @RequestBody TrainingSessionRequest request) {
        try {
            TrainingSession session = trainingSessionService.createTrainingSession(
                    request.getTrainerId(),
                    request.getMemberId(),
                    request.getType(),
                    request.getScheduledDate(),
                    request.getDuration(),
                    request.getPrice(),
                    request.getNotes(),
                    request.getLocation()
            );
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // --- Update Session ---
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> updateTrainingSession(@PathVariable Long id, @Valid @RequestBody TrainingSessionRequest request) {
        try {
            TrainingSession session = trainingSessionService.updateTrainingSession(
                    id,
                    request.getType(),
                    request.getScheduledDate(),
                    request.getDuration(),
                    request.getPrice(),
                    request.getNotes(),
                    request.getLocation()
            );
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // --- Delete Session ---
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> deleteTrainingSession(@PathVariable Long id) {
        try {
            trainingSessionService.deleteTrainingSession(id);
            return ResponseEntity.ok(new MessageResponse("Training session deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // --- Update Status ---
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> updateSessionStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            TrainingSession.SessionStatus sessionStatus = TrainingSession.SessionStatus.valueOf(status.toUpperCase());
            TrainingSession session = trainingSessionService.updateSessionStatus(id, sessionStatus);
            return ResponseEntity.ok(session);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid status"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // --- Reschedule ---
    @PutMapping("/{id}/reschedule")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<?> rescheduleSession(@PathVariable Long id, @RequestParam LocalDateTime newScheduledDate) {
        try {
            TrainingSession session = trainingSessionService.rescheduleSession(id, newScheduledDate);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // --- Filters ---

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<TrainingSession>> getSessionsByStatus(@PathVariable String status) {
        try {
            TrainingSession.SessionStatus sessionStatus = TrainingSession.SessionStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(trainingSessionService.getSessionsByStatus(sessionStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<TrainingSession>> getScheduledSessionsByType(@PathVariable String type) {
        try {
            TrainingSession.SessionType sessionType = TrainingSession.SessionType.valueOf(type.toUpperCase());
            return ResponseEntity.ok(trainingSessionService.getScheduledSessionsByType(sessionType));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<TrainingSession>> getUpcomingSessions() {
        return ResponseEntity.ok(trainingSessionService.getUpcomingSessions());
    }

    // --- By Trainer ---
    @GetMapping("/trainer/{trainerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#trainerId)")
    public ResponseEntity<List<TrainingSession>> getSessionsByTrainer(@PathVariable Long trainerId) {
        return ResponseEntity.ok(trainingSessionService.getSessionsByTrainer(trainerId));
    }

    @GetMapping("/trainer/{trainerId}/upcoming")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#trainerId)")
    public ResponseEntity<List<TrainingSession>> getUpcomingSessionsByTrainer(@PathVariable Long trainerId) {
        return ResponseEntity.ok(trainingSessionService.getUpcomingSessionsByTrainer(trainerId));
    }

    @GetMapping("/trainer/{trainerId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#trainerId)")
    public ResponseEntity<List<TrainingSession>> getSessionsByTrainerAndDateRange(
            @PathVariable Long trainerId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        return ResponseEntity.ok(trainingSessionService.getSessionsByTrainerAndDateRange(trainerId, startDate, endDate));
    }

    @GetMapping("/stats/trainer/{trainerId}/completed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#trainerId)")
    public ResponseEntity<Long> getCompletedSessionsByTrainer(@PathVariable Long trainerId) {
        return ResponseEntity.ok(trainingSessionService.getCompletedSessionsByTrainer(trainerId));
    }

    // --- By Member ---
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<List<TrainingSession>> getSessionsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(trainingSessionService.getSessionsByMember(memberId));
    }

    @GetMapping("/member/{memberId}/upcoming")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<List<TrainingSession>> getUpcomingSessionsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(trainingSessionService.getUpcomingSessionsByMember(memberId));
    }

    @GetMapping("/member/{memberId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<List<TrainingSession>> getSessionsByMemberAndDateRange(
            @PathVariable Long memberId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        return ResponseEntity.ok(trainingSessionService.getSessionsByMemberAndDateRange(memberId, startDate, endDate));
    }

    @GetMapping("/stats/member/{memberId}/completed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<Long> getCompletedSessionsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(trainingSessionService.getCompletedSessionsByMember(memberId));
    }

    // --- By Date Range ---
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<TrainingSession>> getSessionsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        return ResponseEntity.ok(trainingSessionService.getSessionsByDateRange(startDate, endDate));
    }
}
