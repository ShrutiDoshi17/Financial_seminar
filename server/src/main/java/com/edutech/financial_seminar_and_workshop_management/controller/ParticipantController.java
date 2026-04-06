package com.edutech.financial_seminar_and_workshop_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.financial_seminar_and_workshop_management.entity.Enrollment;
import com.edutech.financial_seminar_and_workshop_management.entity.Event;
import com.edutech.financial_seminar_and_workshop_management.entity.Feedback;
import com.edutech.financial_seminar_and_workshop_management.service.EnrollmentService;
import com.edutech.financial_seminar_and_workshop_management.service.EventService;
import com.edutech.financial_seminar_and_workshop_management.service.FeedbackService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ParticipantController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private EventService eventService;

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/api/participant/events")
    public ResponseEntity<List<Event>> getEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @PostMapping("/api/participant/event/{eventId}/enroll")
    public ResponseEntity<Enrollment> enrollInEvent(@RequestParam Long userId, @PathVariable Long eventId) {
        Enrollment enrollment = enrollmentService.enrollInEvent(userId, eventId);
        return ResponseEntity.ok(enrollment);
    }

    @GetMapping("/api/participant/event/{eventId}/check-enroll")
    public ResponseEntity<Enrollment> getEnrollment(@RequestParam Long userId, @PathVariable Long eventId) {
        Enrollment enrollment = enrollmentService.getEnrollmentByUserIdAndEventId(userId, eventId);
        return ResponseEntity.ok(enrollment);
    }

    @GetMapping("/api/participant/event/{id}/status")
    public ResponseEntity<Event> viewEventStatus(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping("/api/participant/event/{eventId}/feedback")
    public ResponseEntity<Feedback> provideFeedback(@RequestParam Long userId, @PathVariable Long eventId, @RequestBody Feedback feedback) {
        Feedback providedFeedback = feedbackService.createFeedback(eventId, userId, feedback);
        return ResponseEntity.ok(providedFeedback);
    }

    // ✅ NEW ENDPOINT — returns list of event IDs the user is enrolled in
    // Used by frontend to show "Enrolled" badge directly in the event table
    @GetMapping("/api/participant/my-enrolled-event-ids")
    public ResponseEntity<List<Long>> getMyEnrolledEventIds(@RequestParam Long userId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByUserId(userId);
        List<Long> eventIds = enrollments.stream()
                .map(e -> e.getEvent().getId())
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventIds);
    }
}