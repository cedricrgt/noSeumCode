package com.codebangers.backend.workshop.repository;

import com.codebangers.backend.workshop.model.UserWorkshop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserWorkshopRepository extends JpaRepository<UserWorkshop, UUID> {

    @Query("SELECT uw FROM UserWorkshop uw WHERE uw.user.id = :userId AND uw.workshop.id = :workshopId")
    Optional<UserWorkshop> findByUserIdAndWorkshopId(@Param("userId") UUID userId, @Param("workshopId") UUID workshopId);

    @Query("SELECT uw FROM UserWorkshop uw WHERE uw.workshop.id = :workshopId")
    List<UserWorkshop> findByWorkshopId(@Param("workshopId") UUID workshopId);

    @Query("SELECT uw FROM UserWorkshop uw WHERE uw.user.id = :userId")
    List<UserWorkshop> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT uw FROM UserWorkshop uw JOIN FETCH uw.workshop w WHERE uw.user.id = :userId AND w.isDeleted = false ORDER BY w.startDate ASC")
    List<UserWorkshop> findByUserIdWithWorkshop(@Param("userId") UUID userId);

    @Query("SELECT COUNT(uw) FROM UserWorkshop uw WHERE uw.workshop.id = :workshopId")
    int countByWorkshopId(@Param("workshopId") UUID workshopId);

    @Query("SELECT COUNT(uw) FROM UserWorkshop uw WHERE uw.workshop.id = :workshopId AND uw.attended = true")
    int countAttendanceByWorkshopId(@Param("workshopId") UUID workshopId);

    @Modifying
    @Query("DELETE FROM UserWorkshop uw WHERE uw.user.id = :userId AND uw.workshop.id = :workshopId")
    void deleteByUserIdAndWorkshopId(@Param("userId") UUID userId, @Param("workshopId") UUID workshopId);
}
