package ajay.dev.FYP2.auth.service;

import org.springframework.stereotype.Service;
import ajay.dev.FYP2.auth.entity.User;
import ajay.dev.FYP2.auth.repository.UserRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {
    @Autowired
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public int register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return -1; // User already exists
        }
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
        return 0; // Registration successful
    }

    public int login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                // There should be JWT logic that I have to do here
                return 200; // Success
            }
        }
        return 404; // Not found or wrong password
    }

}
