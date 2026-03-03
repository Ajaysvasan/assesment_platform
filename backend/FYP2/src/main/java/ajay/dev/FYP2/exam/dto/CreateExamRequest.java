package ajay.dev.FYP2.exam.dto;

import ajay.dev.FYP2.exam.models.ExamType;

public record CreateExamRequest(
        String name,
        ExamType type,
        String scheduledDate,
        String scheduledTime) {
}
