package com.codebangers.backend.payment.repository;

import com.codebangers.backend.payment.model.StripeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StripeEventRepository extends JpaRepository<StripeEvent, Long> {
    Optional<StripeEvent> findByStripeEventId(String stripeEventId);
    boolean existsByStripeEventId(String stripeEventId);
}
