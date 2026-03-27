package com.edutech.financial_seminar_and_workshop_management.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Event event;
    private User user;
    private String content;
    private Date timestamp;
    public Feedback(Event event, User user, String content, Date timestamp) {
        this.event = event;
        this.user = user;
        this.content = content;
        this.timestamp = timestamp;
    }
    public Feedback(Long id, Event event, User user, String content, Date timestamp) {
        this.id = id;
        this.event = event;
        this.user = user;
        this.content = content;
        this.timestamp = timestamp;
    }

    
    

}
