package com.edutech.financial_seminar_and_workshop_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority; 
import com.edutech.financial_seminar_and_workshop_management.entity.User;
import com.edutech.financial_seminar_and_workshop_management.repository.UserRepository;

import java.util.Collections;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
private JavaMailSender mailSender;

    // Temporary OTP store — key: username, value: OTP
    private Map<String, String> otpStore = new HashMap<>();

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getProfessionalsList() {
        return userRepository.findByRole("PROFESSIONAL");
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(
                    new SimpleGrantedAuthority(user.getRole())
                )
        );
    }

    public void generateAndSendRegistrationOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        otpStore.put(email, otp); // key is email this time

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("FinSeminar — Verify Your Email");
        message.setText("Your OTP to complete registration is: " + otp +
        "\n\nThis OTP expires in 5 minutes. Do not share it.");
        mailSender.send(message);

        new Thread(() -> {
            try {
                Thread.sleep(5 * 60 * 1000);
                otpStore.remove(email);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }

public boolean verifyRegistrationOtp(String email, String otp) {
    String stored = otpStore.get(email);
    if (stored != null && stored.equals(otp)) {
        otpStore.remove(email);
        return true;
    }
    return false;
    }
}
