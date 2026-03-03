package ajay.dev.FYP2.exam.entity;

import java.util.UUID;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import ajay.dev.FYP2.exam.models.*;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import ajay.dev.FYP2.auth.entity.User;

@Entity
@Table(name = "\"exams\"")
@Data
public class Exams {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID examId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User instructor;
    private String examName;
    @Enumerated(EnumType.STRING)
    private ExamType examType;// MCQ , Written , coding
    private String scheduledDate;
    private String scheduledTime;
    @Enumerated(EnumType.STRING)
    private ExamStatus examStatus;
}
