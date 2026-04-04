package com.edutech.financial_seminar_and_workshop_management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.financial_seminar_and_workshop_management.entity.Event;
import com.edutech.financial_seminar_and_workshop_management.entity.Resource;
import com.edutech.financial_seminar_and_workshop_management.repository.EventRepository;
import com.edutech.financial_seminar_and_workshop_management.repository.ResourceRepository;

import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private EventRepository eventRepository;

    // Add Resource to Event
    public Resource addResourceToEvent(Long eventId, Resource resource) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            resource.setEvent(event); // Set the event for this resource
            return resourceRepository.save(resource);
        } else {
            throw new RuntimeException("Event not found with id " + eventId);
        }
    }

    public List<Resource> viewResourcesByEventId(Long eventId) {
        return resourceRepository.findByEventId(eventId);
    }
}
