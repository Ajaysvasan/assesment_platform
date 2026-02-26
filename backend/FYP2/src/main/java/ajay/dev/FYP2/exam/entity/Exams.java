package ajay.dev.FYP2.exam.entity;

import java.util.UUID;

import ajay.dev.FYP2.exam.models.*;

class Exams {
    private UUID instructorId;
    private UUID examId;
    private String examName;
    private ExamType examType;// MCQ , Written , coding
    private String scheduledDate;
    private String scheduledTime;
    private ExamStatus examStatus;
}
