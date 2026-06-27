package com.codebangers.backend.user.repository;

import com.codebangers.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUserName(String userName);

    Optional<User> findByEmail(String email);

    Optional<User> findById(UUID id);

}
