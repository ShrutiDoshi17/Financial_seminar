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

    public Certificate() {}

    public Certificate(String certificateNumber, LocalDate issuedDate,
                       User participant, Event event) {
        this.certificateNumber = certificateNumber;
        this.issuedDate = issuedDate;
        this.participant = participant;
        this.event = event;
    }

    

    
}
