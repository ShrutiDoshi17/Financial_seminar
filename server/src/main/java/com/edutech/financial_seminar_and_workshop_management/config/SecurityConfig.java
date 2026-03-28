package com.edutech.financial_seminar_and_workshop_management.config;

import javax.servlet.Filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.edutech.financial_seminar_and_workshop_management.jwt.JwtRequestFilter;




@Configuration
@EnableWebSecurity
public class SecurityConfig  {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    
   

    
    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.csrf().disable()
            .cors().and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()

            
            .antMatchers("/api/user/register").permitAll()
            .antMatchers("/api/user/login").permitAll()

            
            .antMatchers("POST", "/api/institution/event").hasAuthority("INSTITUTION")
            .antMatchers("PUT", "/api/institution/event/*").hasAuthority("INSTITUTION")
            .antMatchers("GET", "/api/institution/events").hasAuthority("INSTITUTION")
            .antMatchers("POST", "/api/institution/event/*/resource").hasAuthority("INSTITUTION")
            .antMatchers("GET", "/api/institution/event/professionals").hasAuthority("INSTITUTION")
            .antMatchers("POST", "/api/institution/event/*/professional").hasAuthority("INSTITUTION")

            
            .antMatchers("GET", "/api/professional/events").hasAuthority("PROFESSIONAL")
            .antMatchers("PUT", "/api/professional/event/*/status").hasAuthority("PROFESSIONAL")
            .antMatchers("POST", "/api/professional/event/*/feedback").hasAuthority("PROFESSIONAL")

            
            .antMatchers("GET", "/api/participant/events").hasAuthority("PARTICIPANT")
            .antMatchers("POST", "/api/participant/event/*/enroll").hasAuthority("PARTICIPANT")
            .antMatchers("GET", "/api/participant/event/*/status").hasAuthority("PARTICIPANT")
            .antMatchers("POST", "/api/participant/event/*/feedback").hasAuthority("PARTICIPANT")

            .anyRequest().authenticated();

        
        http.addFilterBefore((Filter) jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}