package com.edutech.financial_seminar_and_workshop_management.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edutech.financial_seminar_and_workshop_management.entity.Feedback;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("SELECT f FROM Feedback f WHERE event.id = :eventId")
    List<Feedback>findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT f FROM Feedback f WHERE user.id = :userId")
    List<Feedback>findByUserId(@Param("userId") Long userId);
   
}
