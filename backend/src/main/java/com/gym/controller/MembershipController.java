package com.gym.controller;

import com.gym.entity.Membership;
import com.gym.payload.request.MembershipRequest;
import com.gym.payload.response.MembershipResponse;
import com.gym.payload.response.MessageResponse;
import com.gym.service.MembershipService;
import com.gym.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/memberships")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MembershipController {
    
    @Autowired
    private MembershipService membershipService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
    public ResponseEntity<List<MembershipResponse>> getAllMemberships() {
        List<Membership> memberships = membershipService.getAllMemberships();
        List<MembershipResponse> response = memberships.stream()
            .map(MembershipResponse::new)
            .toList();
        return ResponseEntity.ok(response);
    }

    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userService.isCurrentUser(#id)")
    public ResponseEntity<Membership> getMembershipById(@PathVariable Long id) {
        return membershipService.getMembershipById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<List<Membership>> getMembershipsByUser(@PathVariable Long userId) {
        List<Membership> memberships = membershipService.getMembershipsByUser(userId);
        return ResponseEntity.ok(memberships);
    }
    
    @GetMapping("/user/{userId}/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<List<Membership>> getActiveMembershipsByUser(@PathVariable Long userId) {
        List<Membership> memberships = membershipService.getActiveMembershipsByUser(userId);
        return ResponseEntity.ok(memberships);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Membership>> getMembershipsByStatus(@PathVariable String status) {
        try {
            Membership.MembershipStatus membershipStatus = Membership.MembershipStatus.valueOf(status.toUpperCase());
            List<Membership> memberships = membershipService.getMembershipsByStatus(membershipStatus);
            return ResponseEntity.ok(memberships);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> createMembership(@Valid @RequestBody MembershipRequest request) {
        try {
            Membership membership = membershipService.createMembership(
                request.getUserId(),
                request.getType(),
                request.getPrice(),
                request.getStartDate(),
                request.getEndDate(),
                request.getDescription()
            );
            return ResponseEntity.ok(membership);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> updateMembership(@PathVariable Long id, @Valid @RequestBody MembershipRequest request) {
        try {
            Membership membership = membershipService.updateMembership(
                id,
                request.getType(),
                request.getPrice(),
                request.getStartDate(),
                request.getEndDate(),
                request.getDescription()
            );
            return ResponseEntity.ok(membership);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> updateMembershipStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Membership.MembershipStatus membershipStatus = Membership.MembershipStatus.valueOf(status.toUpperCase());
            Membership membership = membershipService.updateMembershipStatus(id, membershipStatus);
            return ResponseEntity.ok(membership);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid status"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> deleteMembership(@PathVariable Long id) {
        try {
            membershipService.deleteMembership(id);
            return ResponseEntity.ok(new MessageResponse("Membership deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/expiring")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Membership>> getExpiringMemberships(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<Membership> memberships = membershipService.getExpiringMemberships(startDate, endDate);
        return ResponseEntity.ok(memberships);
    }
    
    @GetMapping("/expired")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<Membership>> getExpiredMemberships() {
        List<Membership> memberships = membershipService.getExpiredMemberships();
        return ResponseEntity.ok(memberships);
    }
    
    @GetMapping("/stats/active-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Long> getActiveMembershipsCount() {
        Long count = membershipService.getActiveMembershipsCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/check/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<Boolean> hasActiveMembership(@PathVariable Long userId) {
        boolean hasActive = membershipService.hasActiveMembership(userId);
        return ResponseEntity.ok(hasActive);
    }
    
    @PutMapping("/{id}/renew")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> renewMembership(@PathVariable Long id, @RequestParam LocalDateTime newEndDate) {
        try {
            Membership membership = membershipService.renewMembership(id, newEndDate);
            return ResponseEntity.ok(membership);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
} 