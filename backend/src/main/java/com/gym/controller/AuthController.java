package com.gym.controller;

import com.gym.entity.User;
import com.gym.payload.request.LoginRequest;
import com.gym.payload.request.SignupRequest;
import com.gym.payload.response.JwtResponse;
import com.gym.payload.response.MessageResponse;
import com.gym.repository.UserRepository;
import com.gym.security.JwtUtils;
import com.gym.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                userDetails.getRole().name(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getEmail(),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                User.Role.MEMBER); // Default role is MEMBER

        Set<String> strRoles = signUpRequest.getRole();
        User.Role selectedRole = User.Role.MEMBER; // Default role

        if (strRoles != null && !strRoles.isEmpty()) {
            String role = strRoles.iterator().next().toLowerCase(); // Take the first role, lowercase
            switch (role) {
                case "admin":
                    selectedRole = User.Role.ADMIN;
                    break;
                case "trainer":
                    selectedRole = User.Role.TRAINER;
                    break;
                case "staff":
                    selectedRole = User.Role.STAFF;
                    break;
                default:
                    selectedRole = User.Role.MEMBER;
            }
        }

        user.setRole(selectedRole);
        User savedUser = userRepository.save(user);

        // Hide password before returning the user
        savedUser.setPassword(null);

        return ResponseEntity.ok(savedUser);
    }
}
