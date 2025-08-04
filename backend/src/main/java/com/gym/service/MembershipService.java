package com.gym.service;

import com.gym.entity.Membership;
import com.gym.entity.User;
import com.gym.repository.MembershipRepository;
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
public class MembershipService {
    
    @Autowired
    private MembershipRepository membershipRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }
    
    public Optional<Membership> getMembershipById(Long id) {
        return membershipRepository.findById(id);
    }
    
    public List<Membership> getMembershipsByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(membershipRepository::findByUser).orElse(List.of());
    }
    
    public List<Membership> getActiveMembershipsByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return membershipRepository.findActiveMembershipsByUser(user.get(), LocalDateTime.now());
        }
        return List.of();
    }
    
    public List<Membership> getMembershipsByStatus(Membership.MembershipStatus status) {
        return membershipRepository.findByStatus(status);
    }
    
    public Membership createMembership(Long userId, Membership.MembershipType type, BigDecimal price, 
                                    LocalDateTime startDate, LocalDateTime endDate, String description) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        // Check if user already has an active membership
        List<Membership> activeMemberships = membershipRepository.findActiveMembershipsByUser(user.get(), LocalDateTime.now());
        if (!activeMemberships.isEmpty()) {
            throw new RuntimeException("User already has an active membership");
        }
        
        Membership membership = new Membership(user.get(), type, price, startDate, endDate);
        membership.setDescription(description);
        return membershipRepository.save(membership);
    }
    
    public Membership updateMembership(Long id, Membership.MembershipType type, BigDecimal price,
                                    LocalDateTime startDate, LocalDateTime endDate, String description) {
        Optional<Membership> existingMembership = membershipRepository.findById(id);
        if (existingMembership.isEmpty()) {
            throw new RuntimeException("Membership not found");
        }
        
        Membership membership = existingMembership.get();
        membership.setType(type);
        membership.setPrice(price);
        membership.setStartDate(startDate);
        membership.setEndDate(endDate);
        membership.setDescription(description);
        
        return membershipRepository.save(membership);
    }
    
    public Membership updateMembershipStatus(Long id, Membership.MembershipStatus status) {
        Optional<Membership> existingMembership = membershipRepository.findById(id);
        if (existingMembership.isEmpty()) {
            throw new RuntimeException("Membership not found");
        }
        
        Membership membership = existingMembership.get();
        membership.setStatus(status);
        
        return membershipRepository.save(membership);
    }
    
    public void deleteMembership(Long id) {
        Optional<Membership> membership = membershipRepository.findById(id);
        if (membership.isPresent()) {
            membershipRepository.delete(membership.get());
        }
    }
    
    public List<Membership> getExpiringMemberships(LocalDateTime startDate, LocalDateTime endDate) {
        return membershipRepository.findMembershipsExpiringBetween(startDate, endDate);
    }
    
    public List<Membership> getExpiredMemberships() {
        return membershipRepository.findExpiredMemberships(LocalDateTime.now());
    }
    
    public Long getActiveMembershipsCount() {
        return membershipRepository.countActiveMemberships();
    }
    
    public boolean hasActiveMembership(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            List<Membership> activeMemberships = membershipRepository.findActiveMembershipsByUser(user.get(), LocalDateTime.now());
            return !activeMemberships.isEmpty();
        }
        return false;
    }
    
    public Membership renewMembership(Long membershipId, LocalDateTime newEndDate) {
        Optional<Membership> existingMembership = membershipRepository.findById(membershipId);
        if (existingMembership.isEmpty()) {
            throw new RuntimeException("Membership not found");
        }
        
        Membership membership = existingMembership.get();
        membership.setEndDate(newEndDate);
        membership.setStatus(Membership.MembershipStatus.ACTIVE);
        
        return membershipRepository.save(membership);
    }
} 