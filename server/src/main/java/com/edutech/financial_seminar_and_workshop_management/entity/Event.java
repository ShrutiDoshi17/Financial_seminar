package com.edutech.financial_seminar_and_workshop_management.entity;

import javax.persistence.*;


import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long institutionId;
    private String title;
    private String schedule;
    private String location;
    private String status;

    public Event() {
    }

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Resource> resorces = new ArrayList<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Enrollment> enrollments = new ArrayList<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Feedback> feedbacks = new ArrayList<>();

    @ManyToMany
    @JoinColumn(
        name = "event_professionals"
        //joinColumns = @JoinColumn(name = "event_id"),
        //inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> professionals = new ArrayList<>();

    public Event(long institutionId, String title, String schedule, String location, String status) {
        this.institutionId = institutionId;
        this.title = title;
        this.schedule = schedule;
        this.location = location;
        this.status = status;
    }
    public Long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public long getInstitutionId() {
        return institutionId;
    }
    public void setInstitutionId(long institutionId) {
        this.institutionId = institutionId;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getSchedule() {
        return schedule;
    }
    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    

}
