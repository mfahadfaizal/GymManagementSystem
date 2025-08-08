package com.gym.service;

import com.gym.entity.User;
import com.gym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }
    
    public User createUser(String username, String email, String password, String firstName, String lastName, User.Role role) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username is already taken");
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role != null ? role : User.Role.MEMBER);
        user.setEnabled(true);
        
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, String username, String email, String firstName, String lastName, User.Role role) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = existingUser.get();
        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
        }
    }
    
    public boolean isCurrentUser(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        String currentUsername = authentication.getName();
        Optional<User> currentUser = userRepository.findByUsername(currentUsername);
        
        if (currentUser.isPresent()) {
            return currentUser.get().getId().equals(userId);
        }
        
        return false;
    }
    
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        String currentUsername = authentication.getName();
        return userRepository.findByUsername(currentUsername).orElse(null);
    }
    
    public Long getCurrentUserId() {
        User currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getId() : null;
    }
    
    public List<User> getMembers() {
        return userRepository.findByRole(User.Role.MEMBER);
    }
    
    public List<User> getTrainers() {
        return userRepository.findByRole(User.Role.TRAINER);
    }
    
    public List<User> getStaff() {
        return userRepository.findByRole(User.Role.STAFF);
    }
    
    public List<User> getAdmins() {
        return userRepository.findByRole(User.Role.ADMIN);
    }
    
    public boolean isAdmin(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.isPresent() && user.get().getRole() == User.Role.ADMIN;
    }
    
    public boolean isTrainer(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.isPresent() && user.get().getRole() == User.Role.TRAINER;
    }
    
    public boolean isStaff(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.isPresent() && user.get().getRole() == User.Role.STAFF;
    }
    
    public boolean isMember(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.isPresent() && user.get().getRole() == User.Role.MEMBER;
    }

    // Fully implemented createUser method accepting a User object
    public User createUser(User userRequest) {
        if (userRequest == null) {
            throw new IllegalArgumentException("User data must not be null");
        }
        
        // Validate mandatory fields
        if (userRequest.getUsername() == null || userRequest.getUsername().isBlank()) {
            throw new RuntimeException("Username is required");
        }
        if (userRequest.getPassword() == null || userRequest.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }
        if (userRequest.getEmail() == null || userRequest.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (userRequest.getFirstName() == null || userRequest.getFirstName().isBlank()) {
            throw new RuntimeException("First name is required");
        }
        if (userRequest.getLastName() == null || userRequest.getLastName().isBlank()) {
            throw new RuntimeException("Last name is required");
        }
        
        // Check for duplicates
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        
        // Encode password
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        
        // Set enabled flag
        userRequest.setEnabled(true);
        
        // Default role to MEMBER if null
        if (userRequest.getRole() == null) {
            userRequest.setRole(User.Role.MEMBER);
        }
        
        return userRepository.save(userRequest);
    }
}
