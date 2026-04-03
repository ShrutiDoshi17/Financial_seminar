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
              .findByParticipantIdAndEventId(
                    participant.getId(), eventId)
              .orElseThrow(() -> 
                    new RuntimeException("Not enrolled"));

        if (!"COMPLETED".equals(enrollment.getStatus())) {
            throw new RuntimeException(
                "Seminar not completed");
        }

        byte[] pdf =
            certificateService.generateCertificate(
                participant, enrollment.getEvent());

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=certificate.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }
}
