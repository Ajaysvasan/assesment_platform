package ajay.dev.FYP2.exam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ajay.dev.FYP2.exam.entity.Exams;
import ajay.dev.FYP2.exam.models.ExamStatus;
import ajay.dev.FYP2.exam.repository.ExamRepository;

@Service
public class CreateExamService {
    private final ExamRepository examRepository;

    public CreateExamService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    public Exams saveExam(Exams exam) {
        if (exam.getExamStatus() == null) {
            exam.setExamStatus(ExamStatus.YET_TO_START);
        }
        return examRepository.save(exam);
    }
}
