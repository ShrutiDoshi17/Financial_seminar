package com.edutech.financial_seminar_and_workshop_management.repository;

import com.edutech.financial_seminar_and_workshop_management.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository
        extends JpaRepository<Certificate, Long> {
}