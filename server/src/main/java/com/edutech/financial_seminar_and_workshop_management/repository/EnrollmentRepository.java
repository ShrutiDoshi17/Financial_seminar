package com.edutech.financial_seminar_and_workshop_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edutech.financial_seminar_and_workshop_management.entity.Enrollment;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    @Query("SELECT * FROM Enrollment WHERE user.id = :userId")
    List<Enrollment>findByUserId(@Param("userId") Long userId);

    @Query("SELECT * FROM Enrollment WHERE event.id = :eventId")
    List<Enrollment>findByEventId(@Param("eventId") Long eventId);
    
}
