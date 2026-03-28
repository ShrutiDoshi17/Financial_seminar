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

    public Resource addResourceToEvent(Long eventId, Resource resource) {
        Event event = eventRepository.findById(eventId).get();
        resource.setEvent(event);
        return resourceRepository.save(resource);
    }
    
}
