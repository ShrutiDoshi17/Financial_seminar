package com.edutech.financial_seminar_and_workshop_management.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus; 

import com.edutech.financial_seminar_and_workshop_management.entity.Event;
import com.edutech.financial_seminar_and_workshop_management.entity.Resource;
import com.edutech.financial_seminar_and_workshop_management.entity.User;
import com.edutech.financial_seminar_and_workshop_management.service.EventService;
import com.edutech.financial_seminar_and_workshop_management.service.ResourceService;
import com.edutech.financial_seminar_and_workshop_management.service.UserService;

import java.util.List;

@RestController
public class InstitutionController {

    @Autowired
    private EventService eventService;

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private UserService userService;

    // Create Event
    @PostMapping("/api/institution/event")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event createdEvent = eventService.createEvent(event);
        return ResponseEntity.ok(createdEvent);
    }

    // Update Event
    @PutMapping("/api/institution/event/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        return ResponseEntity.ok(updatedEvent);
    }

    // Delete Event
    @DeleteMapping("/api/institution/event/{id}")
    public ResponseEntity<Long> deleteEvent(@PathVariable Long id) {
        try {
            return new ResponseEntity<Long>(eventService.deleteEventById(id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Long>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Events
    @GetMapping("/api/institution/events")
    public ResponseEntity<List<Event>> getInstitutionsEvents(@RequestParam Long institutionId) {
        List<Event> events = eventService.getEventsByInstitutionId(institutionId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/api/institution/event/{eventId}/resource")
    public ResponseEntity<Resource> addResourceToEvent(@PathVariable Long eventId, @RequestBody Resource resource) {
        Resource addedResource = resourceService.addResourceToEvent(eventId, resource);
        return ResponseEntity.ok(addedResource);
    }

    @GetMapping("/api/institution/event/{eventId}/resources")
    public ResponseEntity<List<Resource>> addResourceToEvent(@PathVariable Long eventId) {
        List<Resource> resources = resourceService.viewResourcesByEventId(eventId);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/api/institution/event/professionals")
    public ResponseEntity<List<User>> getProfessionalsList() {
        List<User> professionals = userService.getProfessionalsList();
        return ResponseEntity.ok(professionals);
    }

    @PostMapping("/api/institution/event/{eventId}/professional")
    public ResponseEntity<?> assignProfessionalToEvent(@PathVariable Long eventId, @RequestParam Long userId) {
        eventService.assignUserToEventAsProfessional(eventId, userId);
        return ResponseEntity.ok().build();
    }
}
