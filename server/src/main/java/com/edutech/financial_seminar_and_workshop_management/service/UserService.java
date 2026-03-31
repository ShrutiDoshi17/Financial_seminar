package com.edutech.financial_seminar_and_workshop_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edutech.financial_seminar_and_workshop_management.entity.User;
import com.edutech.financial_seminar_and_workshop_management.repository.UserRepository;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
// import java.util.Coorg.springframework.security.core.userdetailections;
import java.util.List;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode((user.getPassword())));
        return userRepository.save(user);
    }

    public List<User> getProfessionalsList(){
        return userRepository.findByRole("PROFESSIONAL");
    }

    public User getUserByUsername(String username){
        return userRepository.findByUsername(username).orElseThrow(()->
        new UsernameNotFoundException("User not found: " + username)
    );
    }

    public UserDetails loadUserByUsername(String username)throws UserPrincipalNotFoundException{
        User user = getUserByUsername(username);
        return new 
        org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
           Collections.singleton(()->
            user.getRole())
        );

    }

    
}
