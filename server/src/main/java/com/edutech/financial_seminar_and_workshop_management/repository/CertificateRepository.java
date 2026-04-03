public interface CertificateRepository
        extends JpaRepository<Certificate, Long> {

    Optional<Certificate> 
        findByParticipantIdAndEventId(Long participantId, Long eventId);
}
