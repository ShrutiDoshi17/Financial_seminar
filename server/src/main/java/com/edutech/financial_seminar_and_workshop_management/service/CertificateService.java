@Service
public class CertificateService {

    public byte[] generateCertificate(User participant, Event event) 
            throws Exception {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();

        Font title = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22);
        Font body = FontFactory.getFont(FontFactory.HELVETICA, 14);

        Paragraph p1 = new Paragraph("CERTIFICATE OF COMPLETION", title);
        p1.setAlignment(Element.ALIGN_CENTER);
        document.add(p1);

        document.add(new Paragraph("\n"));

        document.add(new Paragraph(
            "This is to certify that", body));
        document.add(new Paragraph(
            participant.getName(), 
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));

        document.add(new Paragraph(
            "has successfully completed the seminar:", body));
        document.add(new Paragraph(
            event.getTitle(),
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));

        document.add(new Paragraph(
            "\nIssued on: " + LocalDate.now(), body));

        document.close();
        return out.toByteArray();
    }
}