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

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Optional<Event> event = eventRepository.findById(id);
        if(event.isEmpty()) {
            return null;
        }
        Event e = event.get();
        e.setTitle(eventDetails.getTitle());
        e.setStatus(eventDetails.getStatus());
        e.setSchedule(eventDetails.getSchedule());
        e.setLocation(eventDetails.getLocation());
        e.setDescription(eventDetails.getDescription());
        // e.setInstitutionId(eventDetails.getInstitutionId());
        return eventRepository.save(e);
    }

    public List<Event> getEventsByInstitutionId(Long institutionId) {
        return eventRepository.findByInstitutionId(institutionId);
    }

    public User assignUserToEventAsProfessional(Long eventId, Long userId) {
        User user = userRepository.findById(userId).get();
        Event event = eventRepository.findById(eventId).get();

        List<User> professionals = event.getProfessionals();
        professionals.add(user);
        event.setProfessionals(professionals);
        eventRepository.save(event);
        return user;
    }

    public List<Event> getAssignedEvents(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty()) {
            return null;
        }
        return user.get().getEvents();
    }

    public Event updateEventStatus(Long id, String status) {
        Event event = eventRepository.findById(id).get();
        event.setStatus(status);
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).get();
    }
}
