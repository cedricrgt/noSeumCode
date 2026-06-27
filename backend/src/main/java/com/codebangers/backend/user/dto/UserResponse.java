package com.codebangers.backend.user.dto;

import java.util.UUID;

import com.codebangers.backend.user.model.Role;

public class UserResponse {

    private UUID id;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;

    public UserResponse(UUID id, String userName, String firstName,
            String lastName, String email, Role role) {
        this.id = id;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }

    // Getters

    public UUID getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}
