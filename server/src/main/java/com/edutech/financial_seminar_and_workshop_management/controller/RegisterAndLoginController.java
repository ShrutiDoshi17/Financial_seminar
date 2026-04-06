package com.edutech.financial_seminar_and_workshop_management.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.edutech.financial_seminar_and_workshop_management.dto.LoginRequest;
import com.edutech.financial_seminar_and_workshop_management.dto.LoginResponse;
import com.edutech.financial_seminar_and_workshop_management.entity.User;
import com.edutech.financial_seminar_and_workshop_management.jwt.JwtUtil;
import com.edutech.financial_seminar_and_workshop_management.service.UserService;

@RestController
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/api/user/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @GetMapping("/api/user/check-username")
    public ResponseEntity<?> existsByUsername(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }

    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password", e);
        }

        final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
        final String token = jwtUtil.generateToken(userDetails.getUsername());

        User user = userService.getUserByUsername(loginRequest.getUsername());

        return ResponseEntity.ok(new LoginResponse(user.getId(),token, user.getUsername(), user.getEmail(), user.getRole()));
    }

    @PostMapping("/api/user/send-otp")
        public ResponseEntity<?> sendRegistrationOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        userService.generateAndSendRegistrationOtp(email);
        return ResponseEntity.ok(Map.of("message", "OTP sent"));
    }

@PostMapping("/api/user/verify-registration-otp")
public ResponseEntity<?> verifyRegistrationOtp(@RequestBody Map<String, String> body) {
    String email = body.get("email");
    String otp = body.get("otp");
    boolean valid = userService.verifyRegistrationOtp(email, otp);
    if (!valid) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Map.of("error", "Invalid or expired OTP"));
    }
    return ResponseEntity.ok(Map.of("verified", true));
}
}
