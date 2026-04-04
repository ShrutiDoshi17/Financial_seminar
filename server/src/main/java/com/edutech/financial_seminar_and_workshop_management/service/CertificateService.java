package com.edutech.financial_seminar_and_workshop_management.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

@Service
public class CertificateService {

    public byte[] generateCertificate(String username, String eventTitle)
            throws Exception {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont =
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22);
        Font textFont =
                FontFactory.getFont(FontFactory.HELVETICA, 14);

        Paragraph title =
                new Paragraph("CERTIFICATE OF COMPLETION\n\n", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph("This is to certify that\n", textFont));

        Paragraph name =
                new Paragraph(username,
                        FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD, 18));
        name.setAlignment(Element.ALIGN_CENTER);
        document.add(name);

        document.add(new Paragraph(
                "\nhas successfully completed the seminar:\n", textFont));

        Paragraph event =
                new Paragraph(eventTitle,
                        FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD, 16));
        event.setAlignment(Element.ALIGN_CENTER);
        document.add(event);

        document.add(new Paragraph(
                "\nIssued on : " + LocalDate.now(), textFont));

        document.close();
        return out.toByteArray();
    }
} 