# Financial_seminar
Gladiator Project

Capstone Project - Financial Seminar and Workshop Management Platform

03:00

Hard

Overview
A comprehensive platform specifically designed to streamline the organization and execution of financial seminars, workshops, investment conferences, and educational sessions. This platform serves as a central hub for finance
professionals, institutions, and enthusiasts to plan, manage resources, and foster interactions, aiming to ensure the seamless conduct of finance-related educational events.

Users of the System
Financial Institutions: Plan and schedule finance seminars, manage resources, and communicate with participants.
Finance Professionals: Oversee workshop agendas, access financial tools, and engage with attendees.
Participants: Enroll in seminars, submit prerequisites for workshops, and receive updates.

Functional Requirements
User Registration & Profile Management
Secure registration and profile management with strong data validation and privacy protocols.
Event Scheduling & Management
Enable financial institutions to organize and manage seminars and workshops, including permissions for changes.
Resource Allocation
Allocate financial modeling tools, venue spaces, and educational content to specific workshops or sessions.
Professional and Participant Interaction Interface
A portal for participants to monitor their schedules and for professionals to provide and gather feedback.

User Role-Based Authentication
Assign user roles to deliver customized interfaces and functionalities for financial institutions, professionals, and participants.
JWT Authorization
Secure user sessions and API interactions with JWT tokens for enhanced security.

RESTful API & Angular Service Layer
Ensure seamless communication between the Angular front end and backend RESTful services for dynamic data exchange and UI updates.

Technology Stack
Backend: Spring Boot, JPA, MySQL
Frontend: Angular
Security: Spring Security, JWT

Key Points to Note
Security
Safeguard sensitive financial data and secure API access against unauthorized use.
Scalability
Design the system to accommodate an increasing number of users and large-scale finance events.
User Interface Consistency
Ensure a consistent and intuitive interface for all user roles.
Best Practices
Adhere to coding best practices for robust and maintainable software development.

Backend Functionalities to be Built
User Management
Secure endpoints for user registration, login, and profile management.
Event Management
CRUD operations for event details with data integrity and authorization.
Resource Management
Track and allocate financial resources efficiently to events.
Role-Based Authentication
Define access levels for financial institutions, professionals, and participants.
JWT Token Management
Manage token generation, validation, and lifecycle efficiently.

Entities:

1. User
- Long id (auto-generated)
- String username
- String password
- String email
- String role; // Possible values: "INSTITUTION", "PROFESSIONAL", "PARTICIPANT"
- Set<Enrollment> enrollments
- Set<Feedback> feedbacks
- List<Event> events

2. Event
- Long id (auto-generated)
- Long institutionld
- String title
- String description
- String schedule
- String location
- String status; // Possible values: "PENDING", "IN_PROGRESS", "COMPLETED"
- List<Resource> resources
- List<User> professionals
- List<Enrollment> enrollments
- List<Feedback> feedbacks

3. Resource
- Long id (auto-generated)
- String type
- String description
- String availabilityStatus
- Event event

4. Enrollment
- Long id (auto-generated)
- User user
- Event event
- String status; // Possible values: "PENDING", "APPROVED", "REJECTED"

5. Feedback
- Long id (auto-generated)
- Event event
- User user
- String content
- Date timestamp // format should be "yyyy-MM-dd HH:mm:ss"

Note:
-> generate constructors, getters, and setters for the Property class as per standard Java conventions.
-> Manage the relationships between entities using appropriate annotations.
-> For example: getld(), setld(Long id) etc.
-> initialize the collections to avoid NullPointerExceptions.

API Endpoints:

For Registration and Login
Register User: POST /api/user/register
Login User: POST /api/user/login

For Institutions
Create Event: POST /api/institution/event
Update Event: PUT /api/institution/event/{id}
Get Institution Events: GET /api/institution/events
Add Resource To Event: POST /api/institution/event/{eventld}/resource
Get List of Professionals: GET /api/institution/event/professionals
Assign Professional: POST /api/institution/event/{eventld}/professional

For Finance Professionals
View Assigned Events: GET /api/professional/events
Update Event Status: PUT /api/professional/event/{id}/status
Provide Feedback: POST /api/professional/event/{eventld}/feedback

For Participants
View All Events: GET /api/participant/events
Enroll in Event: POST /api/participant/event/{eventld}/enroll
View Event Status: GET /api/participant/event/{id}/status
Provide Feedback: POST /api/participant/event/{eventld}/feedback

Security Configuration for api:

Configure the security to use JWT for authentication and authorization.
Implement security configuration here
/api/user/register and /api/user/login should be permitted to all
/api/institution/event should be permitted to INSTITUTION
/api/institution/event/{id} should be permitted to INSTITUTION
/api/institution/events should be permitted to INSTITUTION
/api/institution/event/{eventld}/resource should be permitted to INSTITUTION
/api/institution/event/professionals should be permitted to INSTITUTION
/api/institution/event/{eventld}/professional should be permitted to INSTITUTION
/api/professional/events should be permitted to PROFESSIONAL
/api/professional/event/{id}/status should be permitted to PROFESSIONAL
/api/professional/event/{eventld}/feedback should be permitted to PROFESSIONAL
/api/participant/events should be permitted to PARTICIPANT
/api/participant/event/{eventld}/enroll should be permitted to PARTICIPANT
/api/participant/event/{id}/status should be permitted to PARTICIPANT
/api/participant/event/{eventld}/feedback should be permitted to PARTICIPANT

Note: Use hasAuthority method to check the role of the user
for example, hasAuthority("INSTITUTION")

Api and Payloads:

1. Register User -> method = POST, url = /api/user/register
payload: {
"username": "username",
"password": "password",
"email": "email",
"role": "role" // Possible values: "INSTITUTION", "PROFESSIONAL", "PARTICIPANT"

2. Login User -> method = POST, url = /api/user/login
payload: {
"username": "username",
"password": "password"

3. Create Event -> method = POST, url = /api/institution/event
payload: {
"institutionld": 0,
"title": "title_7f1a5d392689",
"description": "description_acf838f973cd",
"schedule": "schedule_a352c00f7b6a",
"location": "location_07a05cca695b",
"status": "status_2f958b20a8c3",

4. Update Event -> method = PUT, url = /api/institution/event/{id}
payload: {
"institutionld": 0,
"title": "title_7f1a5d392689",
"description": "description_acf838f973cd",
"schedule": "schedule_a352c00f7b6a",
"location": "location_07a05cca695b",
"status": "status_2f958b20a8c3",

}

}

}

5. Get event of an institution -> method = GET, url = /api/institution/events?institutionld=1
6. Add resource to event -> method = POST, url = /api/institution/event/{eventld}/resource
payload: {
"type": "type_8991222114af",
"description": "description_f3a226c148b5",
"availabilityStatus": "availabilityStatus_d239ac39c3b5"

7. Get list of professionals -> method = GET, url = /api/institution/event/professionals
8. Assign professional to event -> method = POST, url = /api/institution/event/{eventld}/professional?userld=1

}

9. Professional view assigned events -> method = GET, url = /api/professional/events?userld=1
10. Professional Update event status -> method = PUT, url = /api/professional/event/{id}/status?status=COMPLETED
11. Professional provide feedback -> method = POST, url = /api/professional/event/{eventld}/feedback?userld=1
payload:{
"content": "content_fa3c6b45c51e",
"timestamp": "2024-08-09 17:55:28"

}

12. Participant view all events -> method = GET, url = /api/participant/events
13. Participant enroll in event -> method = POST, url = /api/participant/event/{eventld}/enroll?userld=1
14. Participant view event status -> method = GET, url = /api/participant/event/{id}/status
15. Participant provide feedback -> method = POST, url = /api/participant/event/{eventld}/feedback?userld=1
payload:{
"content": "content_fa3c6b45c51e",
"timestamp": "2024-08-09 17:55:28"

}

Angular:
- Use Reactive form and declare form with name itemForm and add validations
- Create a service with name HttpService and these functions getEventByProfessional,getEventByInstitutionld,GetAlIProfessionals,GetAllevents,viewAllEvents,viewEventStatus,
EnrollParticipant(eventld:any,userld:any),createEvent,updateEvent(eventld:any,
details:any),addResource(details:any),assignProfessionals(eventld:any,userld:any),UpdateEventStatus(eventld:any,status:any),AddFeedback(eventld:any,userld:any,details:any),AddFeedbackByParticipants(eventld:any,userld:any,detail
s:any.


