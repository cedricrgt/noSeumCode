package com.codebangers.backend.workshop.repository;

import com.codebangers.backend.workshop.model.Workshop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, UUID> {

    @Query("SELECT w FROM Workshop w WHERE w.isDeleted = false ORDER BY w.startDate DESC")
    List<Workshop> findAllActive();

    @Query("SELECT w FROM Workshop w WHERE w.isDeleted = false AND w.startDate > :now ORDER BY w.startDate ASC")
    List<Workshop> findUpcomingWorkshops(@Param("now") LocalDateTime now);

    @Query("SELECT w FROM Workshop w WHERE w.isDeleted = false AND w.startDate <= :now AND w.endDate >= :now")
    List<Workshop> findOngoingWorkshops(@Param("now") LocalDateTime now);
}
