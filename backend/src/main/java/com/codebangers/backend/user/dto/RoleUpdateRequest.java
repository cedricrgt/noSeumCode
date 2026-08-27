package com.codebangers.backend.user.dto;

import com.codebangers.backend.user.model.Role;

public class RoleUpdateRequest {

    private Role role;

    public RoleUpdateRequest() {
    }

    public RoleUpdateRequest(Role role) {
        this.role = role;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
