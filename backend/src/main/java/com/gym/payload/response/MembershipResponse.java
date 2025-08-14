package com.gym.payload.response;

import com.gym.entity.Membership;
import com.gym.entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MembershipResponse {
    private Long id;
    private String type;
    private String status;
    private BigDecimal price;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
    private UserSummary user;

    public MembershipResponse(Membership membership) {
        this.id = membership.getId();
        this.type = membership.getType().name();
        this.status = membership.getStatus().name();
        this.price = membership.getPrice();
        this.startDate = membership.getStartDate();
        this.endDate = membership.getEndDate();
        this.description = membership.getDescription();
        this.user = new UserSummary(membership.getUser());
    }

    public static class UserSummary {
        private Long id;
        private String firstName;
        private String lastName;
        private String username;

        public UserSummary(User user) {
            this.id = user.getId();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.username = user.getUsername();
        }

        public Long getId() { return id; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getUsername() { return username; }
    }

    // Getters
    public Long getId() { return id; }
    public String getType() { return type; }
    public String getStatus() { return status; }
    public BigDecimal getPrice() { return price; }
    public LocalDateTime getStartDate() { return startDate; }
    public LocalDateTime getEndDate() { return endDate; }
    public String getDescription() { return description; }
    public UserSummary getUser() { return user; }
}
