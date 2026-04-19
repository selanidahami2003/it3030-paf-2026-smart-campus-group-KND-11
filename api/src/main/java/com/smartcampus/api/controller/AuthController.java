package com.smartcampus.api.controller;

import com.smartcampus.api.dto.AuthResponse;
import com.smartcampus.api.dto.LoginRequest;
import com.smartcampus.api.dto.SignupRequest;
import com.smartcampus.api.model.Role;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.security.JwtTokenProvider;
import com.smartcampus.api.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new AuthResponse(jwt, userPrincipal.getId(), userPrincipal.getName(), userPrincipal.getEmail(), roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email Address already in use!");
        }

        User user = new User(signUpRequest.getName(), signUpRequest.getEmail(), signUpRequest.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Collections.singleton(Role.ROLE_USER));

        User result = userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@org.springframework.security.core.annotation.AuthenticationPrincipal UserPrincipal currentUser) {
        List<String> roles = currentUser.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        return ResponseEntity.ok(new AuthResponse("", currentUser.getId(), currentUser.getName(), currentUser.getEmail(), roles));
    }
}
