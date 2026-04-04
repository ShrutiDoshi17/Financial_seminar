package com.edutech.financial_seminar_and_workshop_management.controller;

import com.edutech.financial_seminar_and_workshop_management.entity.Enrollment;
import com.edutech.financial_seminar_and_workshop_management.entity.User;
import com.edutech.financial_seminar_and_workshop_management.repository.EnrollmentRepository;
import com.edutech.financial_seminar_and_workshop_management.service.CertificateService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @GetMapping("/download/{eventId}")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Long eventId,
            Authentication authentication) throws Exception {

        User participant = (User) authentication.getPrincipal();

        Enrollment enrollment =
                enrollmentRepository
                        .findByUserIdAndEventId(
                                participant.getId(), eventId)
                        .orElseThrow(() ->
                                new RuntimeException("Not enrolled"));

        // accept both COMPLETE / COMPLETED
        if (!enrollment.getStatus().equalsIgnoreCase("complete")
         && !enrollment.getStatus().equalsIgnoreCase("completed")) {
            throw new RuntimeException("Seminar not completed");
        }

        byte[] pdf =
                certificateService.generateCertificate(
                        participant.getUsername(),
                        enrollment.getEvent().getTitle());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
} 