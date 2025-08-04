package com.gym.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {
  @GetMapping("/all")
  public String allAccess() {
    return "Public Content.";
  }

  @GetMapping("/member")
  @PreAuthorize("hasRole('MEMBER')")
  public String memberAccess() {
    return "Member Content.";
  }

  @GetMapping("/trainer")
  @PreAuthorize("hasRole('TRAINER')")
  public String trainerAccess() {
    return "Trainer Content.";
  }

  @GetMapping("/staff")
  @PreAuthorize("hasRole('STAFF')")
  public String staffAccess() {
    return "Staff Content.";
  }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public String adminAccess() {
    return "Admin Content.";
  }

  @GetMapping("/auth")
  public String authTest() {
    return "Authentication test endpoint - if you see this, you're authenticated!";
  }
} 