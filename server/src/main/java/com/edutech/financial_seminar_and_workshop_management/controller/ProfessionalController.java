package com.edutech.financial_seminar_and_workshop_management.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.financial_seminar_and_workshop_management.entity.Event;
import com.edutech.financial_seminar_and_workshop_management.entity.Feedback;
import com.edutech.financial_seminar_and_workshop_management.service.EventService;
import com.edutech.financial_seminar_and_workshop_management.service.FeedbackService;

import java.util.List;



@RestController
@RequestMapping("/api/professional")
public class ProfessionalController {

    @Autowired
    private EventService eventService;

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/events")
    public ResponseEntity<List<Event>> viewAssignedEvents(@RequestParam Long userId) {
        return new ResponseEntity<>(eventService.getAssignedEvents(userId),HttpStatus.OK);
    }

    @PutMapping("/event/{id}/status")
    public ResponseEntity<Event> updateEventStatus(@PathVariable Long id,@RequestParam String status) {
        return new ResponseEntity<>(eventService.updateEventStatus(id, status),HttpStatus.OK);
    }

    @PostMapping("/event/{eventId}/feedback")
    public ResponseEntity<Feedback> provideFeedback(@PathVariable Long eventId,@RequestParam Long userId,@RequestBody Feedback feedback) {
        return new ResponseEntity<>(feedbackService.createFeedback(eventId, userId, feedback),HttpStatus.OK);
    }
}


