package ajay.dev.FYP2.auth.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import ajay.dev.FYP2.auth.dto.*;
import ajay.dev.FYP2.auth.entity.User;
import ajay.dev.FYP2.auth.service.AuthService;

@RestController
@RequestMapping("/api/auth")
class Authentication {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest login_req) {
        String token = authService.login(login_req.getEmail(), login_req.getPassword());
        if (!"Login failed".equals(token)) {
            return ResponseEntity.ok(token);
        } else {
            System.out.println("The user is not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest register_req) {
        User user = new User();
        user.setName(register_req.name());
        user.setEmail(register_req.email());
        user.setPassword(register_req.password());
        user.setRole(register_req.role() != null ? register_req.role().name() : null);

        user.setCandidateType(register_req.candidateType() != null ? register_req.candidateType().name() : null);
        user.setConductorType(register_req.conductorType() != null ? register_req.conductorType().name() : null);

        user.setInstitutionName(register_req.institutionName());
        user.setInstitutionId(register_req.institutionId());

        user.setPhoneNumber(register_req.phoneNumber());
        user.setYearOfPassing(register_req.yearOfPassing());
        user.setRegisterNumber(register_req.registerNumber());

        user.setCompanyName(register_req.companyName());
        user.setDesignation(register_req.designation());
        user.setIsWorking(register_req.isWorking());

        user.setPurpose(register_req.purpose());
        user.setDob(register_req.dob());

        int status = authService.register(user);
        if (status == 0) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }
    }
}
