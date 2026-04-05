package com.edutech.financial_seminar_and_workshop_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.edutech.financial_seminar_and_workshop_management.entity.Enrollment;
import java.util.Optional; 

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    List<Enrollment> findByEventId(Long eventId);
    // boolean existsByEventIdAndUserId(Long eventId, Long userId);
    Optional<Enrollment> findByUserIdAndEventId(Long userId, Long eventId); 
}
