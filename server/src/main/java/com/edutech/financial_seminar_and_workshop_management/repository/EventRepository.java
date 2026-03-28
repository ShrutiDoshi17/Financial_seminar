package com.edutech.financial_seminar_and_workshop_management.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.edutech.financial_seminar_and_workshop_management.entity.Event;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // @Query("SELECT * FROM Event WHERE institutionId = :institutionId")
    List<Event>findByInstitutionId(Long institutionId);
}
