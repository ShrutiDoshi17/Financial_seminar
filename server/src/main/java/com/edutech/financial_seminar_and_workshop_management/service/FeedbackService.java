package com.edutech.financial_seminar_and_workshop_management.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.financial_seminar_and_workshop_management.entity.Event;
import com.edutech.financial_seminar_and_workshop_management.entity.Feedback;
import com.edutech.financial_seminar_and_workshop_management.entity.User;
import com.edutech.financial_seminar_and_workshop_management.repository.EventRepository;
import com.edutech.financial_seminar_and_workshop_management.repository.FeedbackRepository;
import com.edutech.financial_seminar_and_workshop_management.repository.UserRepository;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public Feedback createFeedback(Long eventId, Long userId, Feedback feedback) {
        Event event = eventRepository.findById(eventId).get();
        User user = userRepository.findById(userId).get();
        feedback.setEvent(event);
        feedback.setUser(user);
        return feedbackRepository.save(feedback);
    }
  
}
