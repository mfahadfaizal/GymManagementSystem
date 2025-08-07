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
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<TrainingSession>> getAllTrainingSessions() {
        List<TrainingSession> sessions = trainingSessionService.getAllTrainingSessions();
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#id)")
    public ResponseEntity<TrainingSession> getTrainingSessionById(@PathVariable Long id) {
        return trainingSessionService.getTrainingSessionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/book")
@PreAuthorize("hasRole('MEMBER')")
public ResponseEntity<?> bookTrainingSession(@Valid @RequestBody TrainingSessionRequest request) {
    Long currentMemberId = userService.getCurrentUserId();  // Get authenticated member ID

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

    
    @GetMapping("/trainer/{trainerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#trainerId)")
    public ResponseEntity<List<TrainingSession>> getSessionsByTrainer(@PathVariable Long trainerId) {
        List<TrainingSession> sessions = trainingSessionService.getSessionsByTrainer(trainerId);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<List<TrainingSession>> getSessionsByMember(@PathVariable Long memberId) {
        List<TrainingSession> sessions = trainingSessionService.getSessionsByMember(memberId);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<TrainingSession>> getSessionsByStatus(@PathVariable String status) {
        try {
            TrainingSession.SessionStatus sessionStatus = TrainingSession.SessionStatus.valueOf(status.toUpperCase());
            List<TrainingSession> sessions = trainingSessionService.getSessionsByStatus(sessionStatus);
            return ResponseEntity.ok(sessions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<TrainingSession>> getUpcomingSessions() {
        List<TrainingSession> sessions = trainingSessionService.getUpcomingSessions();
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/trainer/{trainerId}/upcoming")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#trainerId)")
    public ResponseEntity<List<TrainingSession>> getUpcomingSessionsByTrainer(@PathVariable Long trainerId) {
        List<TrainingSession> sessions = trainingSessionService.getUpcomingSessionsByTrainer(trainerId);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/member/{memberId}/upcoming")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<List<TrainingSession>> getUpcomingSessionsByMember(@PathVariable Long memberId) {
        List<TrainingSession> sessions = trainingSessionService.getUpcomingSessionsByMember(memberId);
        return ResponseEntity.ok(sessions);
    }
    
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
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTrainingSession(@PathVariable Long id) {
        try {
            trainingSessionService.deleteTrainingSession(id);
            return ResponseEntity.ok(new MessageResponse("Training session deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<TrainingSession>> getSessionsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<TrainingSession> sessions = trainingSessionService.getSessionsByDateRange(startDate, endDate);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/trainer/{trainerId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#trainerId)")
    public ResponseEntity<List<TrainingSession>> getSessionsByTrainerAndDateRange(
            @PathVariable Long trainerId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<TrainingSession> sessions = trainingSessionService.getSessionsByTrainerAndDateRange(trainerId, startDate, endDate);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/member/{memberId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<List<TrainingSession>> getSessionsByMemberAndDateRange(
            @PathVariable Long memberId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<TrainingSession> sessions = trainingSessionService.getSessionsByMemberAndDateRange(memberId, startDate, endDate);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/stats/trainer/{trainerId}/completed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#trainerId)")
    public ResponseEntity<Long> getCompletedSessionsByTrainer(@PathVariable Long trainerId) {
        Long count = trainingSessionService.getCompletedSessionsByTrainer(trainerId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/member/{memberId}/completed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER') or @userService.isCurrentUser(#memberId)")
    public ResponseEntity<Long> getCompletedSessionsByMember(@PathVariable Long memberId) {
        Long count = trainingSessionService.getCompletedSessionsByMember(memberId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<TrainingSession>> getScheduledSessionsByType(@PathVariable String type) {
        try {
            TrainingSession.SessionType sessionType = TrainingSession.SessionType.valueOf(type.toUpperCase());
            List<TrainingSession> sessions = trainingSessionService.getScheduledSessionsByType(sessionType);
            return ResponseEntity.ok(sessions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
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
} 