package com.codebangers.backend.user.service;

import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserBootstrap {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserBootstrap(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void createDefaultUser() {
        if (userRepository.findByEmail("test@codebangers.com").isPresent()) {
            return;
        }

        User user = new User(
                "testuser",
                "Test",
                "User",
                "test@codebangers.com",
                passwordEncoder.encode("778195Cedric"),
                Role.ADMIN
        );

        userRepository.save(user);
    }
}
