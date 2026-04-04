package com.edutech.financial_seminar_and_workshop_management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.financial_seminar_and_workshop_management.entity.Event;
import com.edutech.financial_seminar_and_workshop_management.entity.User;
import com.edutech.financial_seminar_and_workshop_management.repository.EventRepository;
import com.edutech.financial_seminar_and_workshop_management.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    // Create Event
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    // Update Event
    public Event updateEvent(Long id, Event eventDetails) {
        Optional<Event> optionalEvent = eventRepository.findById(id);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            event.setTitle(eventDetails.getTitle());
            event.setDescription(eventDetails.getDescription());
            event.setSchedule(eventDetails.getSchedule());
            event.setLocation(eventDetails.getLocation());
            event.setStatus(eventDetails.getStatus());
            return eventRepository.save(event);
        } else {
            throw new RuntimeException("Event not found with id " + id);
        }
    }

    // Get Events by InstitutionId
    public List<Event> getEventsByInstitutionId(Long institutionId) {
        return eventRepository.findByInstitutionId(institutionId);
    }

    // Delete Event by ID
    public Long deleteEventById(Long eventId) {
        if(eventRepository.existsById(eventId)) {
            eventRepository.deleteById(eventId);
            return eventId;
        }
        return null;
    }

    // Assign Professional to Event
    public User assignUserToEventAsProfessional(Long eventId, Long userId) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalEvent.isPresent() && optionalUser.isPresent()) {
            Event event = optionalEvent.get();
            User user = optionalUser.get();

            event.getProfessionals().add(user);
            user.getEvents().add(event);

            eventRepository.save(event); 
            return userRepository.save(user); 
        } else {
            throw new RuntimeException("Event or User not found with provided IDs.");
        }
    }

    public List<Event> getAssignedEvents(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getEvents();
    }

    public Event updateEventStatus(Long id, String status) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(status);
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }

}
