package com.edutech.financial_seminar_and_workshop_management.config;

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
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public SecurityConfig(UserDetailsService userDetailsService,
                          JwtRequestFilter jwtRequestFilter,
                          PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/api/user/register").permitAll()
                .antMatchers(HttpMethod.POST, "/api/user/login").permitAll()
                .antMatchers(HttpMethod.GET, "/api/user/check-username").permitAll()
                .antMatchers(HttpMethod.POST, "/api/institution/event").hasAuthority("INSTITUTION")
                .antMatchers(HttpMethod.PUT, "/api/institution/event/{id}").hasAuthority("INSTITUTION")
                .antMatchers(HttpMethod.DELETE, "/api/institution/event/{id}").hasAuthority("INSTITUTION")
                .antMatchers(HttpMethod.GET, "/api/institution/events").hasAuthority("INSTITUTION")
                .antMatchers(HttpMethod.POST, "/api/institution/event/{eventId}/resource").hasAuthority("INSTITUTION")
                .antMatchers(HttpMethod.GET, "/api/institution/event/{eventId}/resources").hasAuthority("INSTITUTION")
                .antMatchers(HttpMethod.GET, "/api/institution/event/professionals").hasAuthority("INSTITUTION")
                .antMatchers(HttpMethod.POST, "/api/institution/event/{eventId}/professional").hasAuthority("INSTITUTION")
                .antMatchers(HttpMethod.GET, "/api/professional/events").hasAuthority("PROFESSIONAL")
                .antMatchers(HttpMethod.PUT, "/api/professional/event/{id}/status").hasAuthority("PROFESSIONAL")
                .antMatchers(HttpMethod.POST, "/api/professional/event/{eventId}/feedback").hasAuthority("PROFESSIONAL")
                .antMatchers(HttpMethod.GET, "/api/participant/events").hasAuthority("PARTICIPANT")
                .antMatchers(HttpMethod.POST, "/api/participant/event/{eventId}/enroll").hasAuthority("PARTICIPANT")
                .antMatchers(HttpMethod.GET, "/api/participant/event/{eventId}/check-enroll").hasAuthority("PARTICIPANT")
                .antMatchers(HttpMethod.GET, "/api/participant/event/{id}/status").hasAuthority("PARTICIPANT")
                .antMatchers(HttpMethod.POST, "/api/participant/event/{eventId}/feedback").hasAuthority("PARTICIPANT")
                .anyRequest().authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}