package com.edutech.financial_seminar_and_workshop_management.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.financial_seminar_and_workshop_management.entity.Enrollment;
import com.edutech.financial_seminar_and_workshop_management.service.EnrollmentService;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/participant/payment")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final EnrollmentService enrollmentService;

    public PaymentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // Create Razorpay Order
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
        try {
            int amount = (int) request.get("amount"); // in paise (e.g. 50000 = ₹500)

            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = client.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", amount);
            response.put("currency", "INR");
            response.put("keyId", keyId);

            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Verify Payment + Enroll
    @PostMapping("/verify-and-enroll")
    public ResponseEntity<?> verifyAndEnroll(@RequestBody Map<String, Object> request) {
        String razorpayOrderId   = (String) request.get("razorpayOrderId");
        String razorpayPaymentId = (String) request.get("razorpayPaymentId");
        String razorpaySignature = (String) request.get("razorpaySignature");
        Long userId  = Long.valueOf(request.get("userId").toString());
        Long eventId = Long.valueOf(request.get("eventId").toString());

        try {
            // Verify signature
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            String generatedSignature = hexString.toString();

            if (!generatedSignature.equals(razorpaySignature)) {
                return ResponseEntity.status(400).body(Map.of("error", "Payment verification failed!"));
            }

            // Signature valid, now enroll
            Enrollment enrollment = enrollmentService.enrollInEvent(userId, eventId);
            return ResponseEntity.ok(enrollment);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
} 