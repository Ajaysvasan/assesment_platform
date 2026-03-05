package ajay.dev.FYP2.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import ajay.dev.FYP2.exam.dto.CreateExamRequest;
import ajay.dev.FYP2.exam.entity.Exams;
import ajay.dev.FYP2.exam.service.CreateExamService;
import io.jsonwebtoken.Jwt;
import ajay.dev.FYP2.auth.entity.User;
import ajay.dev.FYP2.auth.security.JwtService;
import java.util.UUID;
import ajay.dev.FYP2.auth.repository.UserRepository;

@RestController
@RequestMapping("/api/instructor")
public class ExamController {
    @Autowired
    private CreateExamService createExamService;
    private JwtService jwtService;
    private UserRepository userRepository;

    public ExamController(CreateExamService createExamService, JwtService jwtService, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.createExamService = createExamService;
        this.jwtService = jwtService;
    }

    @PostMapping("/exam")
    public ResponseEntity<?> createExam(@RequestBody CreateExamRequest createExamRequest) {
        String email = jwtService.extractEmail(createExamRequest.token());
        User instructor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
        Exams exam = new Exams();
        exam.setInstructor(instructor);
        exam.setExamName(createExamRequest.name());
        exam.setExamType(createExamRequest.type());

        exam.setScheduledDate(createExamRequest.scheduledDate());
        exam.setScheduledTime(createExamRequest.scheduledTime());
        Exams savedExam = createExamService.saveExam(exam);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedExam);
    }
}
