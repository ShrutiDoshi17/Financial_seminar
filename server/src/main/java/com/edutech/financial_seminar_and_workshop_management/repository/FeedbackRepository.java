package com.edutech.financial_seminar_and_workshop_management.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edutech.financial_seminar_and_workshop_management.entity.Feedback;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("SELECT * FROM Feedback WHERE event.id = :eventId")
    List<Feedback>findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT * FROM Feedback WHERE user.id = :userId")
    List<Feedback>findByUserId(@Param("userId") Long userId);
   
}
