package com.edutech.financial_seminar_and_workshop_management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.financial_seminar_and_workshop_management.entity.Enrollment;
import com.edutech.financial_seminar_and_workshop_management.entity.Event;
import com.edutech.financial_seminar_and_workshop_management.entity.User;
import com.edutech.financial_seminar_and_workshop_management.repository.EnrollmentRepository;
import com.edutech.financial_seminar_and_workshop_management.repository.EventRepository;
import com.edutech.financial_seminar_and_workshop_management.repository.UserRepository;

import java.util.List;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    
    public Enrollment enrollInEvent(Long userId, Long eventId) {
        if(enrollmentRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new IllegalStateException("User already enrolled!");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setEvent(event);
        enrollment.setStatus("ENROLLED");

        return enrollmentRepository.save(enrollment);
    }
}
