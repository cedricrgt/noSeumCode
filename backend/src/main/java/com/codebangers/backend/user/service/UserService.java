package com.codebangers.backend.user.service;

import com.codebangers.backend.config.exception.AccountStatusException;
import com.codebangers.backend.config.exception.DuplicateResourceException;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.dto.UserRequest;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(u -> !u.isDeleted())
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserByUserName(String userName) {
        return userRepository.findByUserName(userName);
    }

    public User createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateResourceException("User with this email already exists");
        }
        if (userRepository.findByUserName(user.getUserName()).isPresent()) {
            throw new DuplicateResourceException("User with this username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (user.isBlocked()) {
            throw new AccountStatusException("User account is blocked");
        }

        if (user.isDeleted()) {
            throw new AccountStatusException("User account has been deleted");
        }

        return user;
    }

    public User updateUser(UUID userId, UserRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            Optional<User> existing = userRepository.findByEmail(request.getEmail());
            if (existing.isPresent() && !existing.get().getId().equals(userId)) {
                throw new DuplicateResourceException("User with this email already exists");
            }
            user.setEmail(request.getEmail());
        }

        return userRepository.save(user);
    }

    public void softDeleteUser(UUID userId, User actor) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        user.setDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        user.setDeletedBy(actor);
        userRepository.save(user);
    }

    public void blockUser(UUID userId, User actor) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        user.setBlocked(true);
        user.setBlockedAt(LocalDateTime.now());
        user.setBlockedBy(actor);
        userRepository.save(user);
    }

    public void unblockUser(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        user.setBlocked(false);
        user.setBlockedAt(null);
        user.setBlockedBy(null);
        userRepository.save(user);
    }
}
