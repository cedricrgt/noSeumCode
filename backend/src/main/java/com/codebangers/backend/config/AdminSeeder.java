package com.codebangers.backend.config;

import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public AdminSeeder(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       @org.springframework.beans.factory.annotation.Value("${app.admin.email:#{null}}") String adminEmail,
                       @org.springframework.beans.factory.annotation.Value("${app.admin.password:#{null}}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (adminPassword == null || adminPassword.isBlank()) {
            log.warn("⚠️ Aucun mot de passe admin configuré dans ADMIN_PASSWORD. Seeding ignoré.");
            return;
        }

        Optional<User> byEmail = userRepository.findByEmail(adminEmail);
        Optional<User> byUserName = userRepository.findByUserName("admin");

        if (byEmail.isPresent()) {
            User admin = byEmail.get();
            admin.setRole(Role.ADMIN);
            admin.setUserName("admin");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            userRepository.save(admin);
            log.info("✅ Compte Administrateur mis à jour : {}", adminEmail);
        } else if (byUserName.isPresent()) {
            User admin = byUserName.get();
            admin.setEmail(adminEmail);
            admin.setRole(Role.ADMIN);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            userRepository.save(admin);
            log.info("✅ Compte 'admin' mis à jour avec email : {}", adminEmail);
        } else {
            User admin = new User(
                    "admin",
                    "Admin",
                    "CodeBangers",
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    Role.ADMIN
            );
            admin.setProvider("LOCAL");
            userRepository.save(admin);
            log.info("✅ Compte Administrateur créé avec succès : {}", adminEmail);
        }
    }
}

