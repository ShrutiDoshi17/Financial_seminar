package com.edutech.financial_seminar_and_workshop_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.financial_seminar_and_workshop_management.entity.Event;
import com.edutech.financial_seminar_and_workshop_management.entity.Resource;
// import com.edutech.financial_seminar_and_workshop_management.entity.Resource;
import com.edutech.financial_seminar_and_workshop_management.entity.User;
import com.edutech.financial_seminar_and_workshop_management.service.EventService;
import com.edutech.financial_seminar_and_workshop_management.service.ResourceService;
import com.edutech.financial_seminar_and_workshop_management.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/institution")
public class InstitutionController {

    @Autowired
    private EventService eventService;

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private UserService userService;

    @PostMapping("/event")
    public ResponseEntity<Event> createEvent(@RequestBody Event event){
        return new ResponseEntity<Event>(eventService.createEvent(event), HttpStatus.OK);
    }

    @PutMapping("/event/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails){
        return new ResponseEntity<Event>(eventService.updateEvent(id,eventDetails), HttpStatus.OK);
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getInstitutionsEvents(@RequestParam Long institutionId){
        return new ResponseEntity<List<Event>>(eventService.getEventsByInstitutionId(institutionId), HttpStatus.OK);
    }

    @PostMapping("/event/proffesionals")
    public ResponseEntity<Resource> addResourceToEvent(@PathVariable Long eventId, @RequestBody Resource resource){
        return new ResponseEntity<Resource> (resourceService.addResourceToEvent(eventId, resource), HttpStatus.OK);
    }

    
// @GetMapping("/event/professionals")
//     public ResponseEntity<List<User>> getProfessionalsList() {
//         return ResponseEntity.ok(userService.getProfessionalsList());
//     }

    @PostMapping("/event/{eventId}/professional")
    public ResponseEntity<?> assignProfessionalToEvent(
            @PathVariable Long eventId,
            @RequestParam Long userId) {
        return new ResponseEntity<>(eventService.assignUserToEventAsProfessional(eventId, userId),HttpStatus.OK);
    }


    



}
