package com.smartcampus.api.config;

import com.smartcampus.api.model.Role;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.CommentRepository;
import com.smartcampus.api.repository.TicketRepository;
import com.smartcampus.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private TicketRepository ticketRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Ensure Admin user exists with fixed ID "1"
        userRepository.findByEmail("admin@smartcampus.edu").ifPresent(user -> {
            if (!"1".equals(user.getId())) userRepository.delete(user);
        });
        if (userRepository.findById("1").isEmpty()) {
            userRepository.save(new User("1", "admin@smartcampus.edu", "Admin Demo", passwordEncoder.encode("admin123"), Role.ADMIN, null));
            System.out.println("✅ Admin demo account created with ID 1.");
        }

        // Ensure Normal user exists with fixed ID "2"
        userRepository.findByEmail("user@smartcampus.edu").ifPresent(user -> {
            if (!"2".equals(user.getId())) userRepository.delete(user);
        });
        if (userRepository.findById("2").isEmpty()) {
            userRepository.save(new User("2", "user@smartcampus.edu", "Normal User", passwordEncoder.encode("user123"), Role.USER, null));
            System.out.println("✅ Normal user account created with ID 2.");
        }
        
        if (userRepository.findByEmail("tech@smartcampus.edu").isEmpty()) {
            userRepository.save(new User(null, "tech@smartcampus.edu", "Technician", passwordEncoder.encode("tech123"), Role.TECHNICIAN, null));
        }

    }
}
