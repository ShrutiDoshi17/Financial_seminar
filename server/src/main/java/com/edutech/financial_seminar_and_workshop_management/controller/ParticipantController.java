package com.edutech.financial_seminar_and_workshop_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.financial_seminar_and_workshop_management.entity.Enrollment;
import com.edutech.financial_seminar_and_workshop_management.entity.Event;
import com.edutech.financial_seminar_and_workshop_management.entity.Feedback;
import com.edutech.financial_seminar_and_workshop_management.service.EnrollmentService;
import com.edutech.financial_seminar_and_workshop_management.service.EventService;
import com.edutech.financial_seminar_and_workshop_management.service.FeedbackService;

import java.util.List;

@RestController
@RequestMapping("/api/participant")
public class ParticipantController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getEvents() {
        return new ResponseEntity<>(eventService.getAllEvents(),HttpStatus.OK);
    }

    @PostMapping("/event/{eventId}/enroll")
    public ResponseEntity<Enrollment> enrollInEvent(@RequestParam Long userId,@PathVariable Long eventId) {
        return new ResponseEntity<>(enrollmentService.enrollInEvent(userId, eventId),HttpStatus.OK);
    }

    @GetMapping("/event/{id}/status")
    public ResponseEntity<Event> viewEventStatus(@PathVariable Long id) {
        return new ResponseEntity<>(eventService.getEventById(id),HttpStatus.OK);
    }

    @PostMapping("/event/{eventId}/feedback")
    public ResponseEntity<Feedback> provideFeedback(@RequestParam Long userId,@PathVariable Long eventId,@RequestBody Feedback feedback) {
        return new ResponseEntity<>(feedbackService.createFeedback(eventId, userId, feedback),HttpStatus.OK);
    }
}