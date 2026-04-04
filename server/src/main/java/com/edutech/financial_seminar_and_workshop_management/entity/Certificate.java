package com.edutech.financial_seminar_and_workshop_management.entity;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String certificateNumber;
    private LocalDate issuedDate;

    @ManyToOne
    private User participant;

    @ManyToOne
    private Event event;

    public Certificate() {
    }
} 