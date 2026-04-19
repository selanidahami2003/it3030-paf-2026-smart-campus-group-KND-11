package com.smartcampus.api.config;

import com.smartcampus.api.model.Role;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@smartcampus.com")) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@smartcampus.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            
            Set<Role> roles = new HashSet<>();
            roles.add(Role.ROLE_ADMIN);
            roles.add(Role.ROLE_USER);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("Default admin user created: admin@smartcampus.com / admin123");
        }
    }
}
