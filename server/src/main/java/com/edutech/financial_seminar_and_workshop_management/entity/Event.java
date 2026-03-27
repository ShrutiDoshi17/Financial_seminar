package com.edutech.financial_seminar_and_workshop_management.entity;

import javax.persistence.*;


import java.util.ArrayList;
import java.util.List;

@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long institutionId;
    private String title;
    private String schedule;
    private String location;
    private String status;
    public Event(long institutionId, String title, String schedule, String location, String status) {
        this.institutionId = institutionId;
        this.title = title;
        this.schedule = schedule;
        this.location = location;
        this.status = status;
    }
    public long getId() {
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
