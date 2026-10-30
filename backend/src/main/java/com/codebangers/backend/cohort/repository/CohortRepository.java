package com.codebangers.backend.cohort.repository;

import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.cohort.model.CohortStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CohortRepository extends JpaRepository<Cohort, UUID> {

    Optional<Cohort> findBySlug(String slug);

    List<Cohort> findByStatus(CohortStatus status);

    List<Cohort> findByStatusInOrderByStartDateAsc(List<CohortStatus> statuses);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.cohort.id = :cohortId AND e.paymentStatus = 'PAID'")
    long countPaidEnrollments(@Param("cohortId") UUID cohortId);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.cohort.id = :cohortId")
    long countTotalEnrollments(@Param("cohortId") UUID cohortId);
}
