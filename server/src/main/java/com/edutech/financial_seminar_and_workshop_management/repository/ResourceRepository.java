package com.edutech.financial_seminar_and_workshop_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edutech.financial_seminar_and_workshop_management.entity.Resource;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    @Query("SELECT * FROM Resource WHERE event.id = :eventId")
    List<Resource>findByEventId(@Param("eventId") Long eventId);
    
}
