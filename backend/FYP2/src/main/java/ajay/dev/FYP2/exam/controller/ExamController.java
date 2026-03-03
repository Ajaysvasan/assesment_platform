package ajay.dev.FYP2.exam.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ajay.dev.FYP2.exam.dto.CreateExamRequest;

@RestController
@RequestMapping("/api/instructor")
public class ExamController {
    @PostMapping("/exam")
    public int createExam(@RequestBody CreateExamRequest createExamRequest) {
        return 0;
    }
}
