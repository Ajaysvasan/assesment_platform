package ajay.dev.FYP2.exam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import ajay.dev.FYP2.exam.entity.Exams;

public interface ExamRepository extends JpaRepository<Exams, UUID> {
    List<Exams> findByInstructor_Id(UUID instructor_id);

    Optional<Exams> findByExamId(UUID examId);
}
