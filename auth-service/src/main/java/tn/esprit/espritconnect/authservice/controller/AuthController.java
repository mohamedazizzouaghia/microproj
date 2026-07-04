package tn.esprit.espritconnect.authservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.espritconnect.authservice.dto.AuthResponse;
import tn.esprit.espritconnect.authservice.dto.LoginRequest;
import tn.esprit.espritconnect.authservice.dto.RegisterRequest;
import tn.esprit.espritconnect.authservice.entity.User;
import tn.esprit.espritconnect.authservice.repository.UserRepository;
import tn.esprit.espritconnect.authservice.util.JwtUtil;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("STUDENT")
                .build();

        userRepository.save(user);
        String token = jwtUtil.generateToken(user);
        
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(user);

        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String email = jwtUtil.extractUsername(token);
            User user = userRepository.findByEmail(email).orElseThrow();
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).build();
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMe(@RequestHeader("Authorization") String token, @RequestBody User updatedUser) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String email = jwtUtil.extractUsername(token);
            User user = userRepository.findByEmail(email).orElseThrow();
            if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
            if (updatedUser.getLastName() != null) user.setLastName(updatedUser.getLastName());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).build();
    }
}
