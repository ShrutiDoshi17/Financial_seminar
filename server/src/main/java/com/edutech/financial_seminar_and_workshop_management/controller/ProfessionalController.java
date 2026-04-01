package com.edutech.financial_seminar_and_workshop_management.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.financial_seminar_and_workshop_management.entity.Event;
import com.edutech.financial_seminar_and_workshop_management.entity.Feedback;
import com.edutech.financial_seminar_and_workshop_management.service.EventService;
import com.edutech.financial_seminar_and_workshop_management.service.FeedbackService;

import java.util.List;

@RestController
public class ProfessionalController {

    @Autowired
    private EventService eventService;

    @Autowired
    private FeedbackService feedbackService;

    // View Assigned Events
    @GetMapping("/api/professional/events")
    public ResponseEntity<List<Event>> viewAssignedEvents(@RequestParam Long userId) {
        List<Event> events = eventService.getAssignedEvents(userId);
        return ResponseEntity.ok(events);
    }

    // Update Event Status
    @PutMapping("/api/professional/event/{id}/status")
    public ResponseEntity<Event> updateEventStatus(@PathVariable Long id, @RequestParam String status) {
        Event updatedEvent = eventService.updateEventStatus(id, status);
        return ResponseEntity.ok(updatedEvent);
    }

    // Provide Feedback
    @PostMapping("/api/professional/event/{eventId}/feedback")
    public ResponseEntity<Feedback> provideFeedback(@PathVariable Long eventId, @RequestParam Long userId, @RequestBody Feedback feedback) {
        Feedback providedFeedback = feedbackService.createFeedback(eventId, userId, feedback);
        return ResponseEntity.ok(providedFeedback);
    }
}

