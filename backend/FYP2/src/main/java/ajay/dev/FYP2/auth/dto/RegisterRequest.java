
package ajay.dev.FYP2.auth.dto;

import ajay.dev.FYP2.auth.models.*;

public record RegisterRequest(
        String name,
        String email,
        String password,
        String confirmPassword,
        Role role,

        CandidateType candidateType,
        ConductorType conductorType,

        String institutionName,
        String institutionId,

        String phoneNumber,
        String yearOfPassing,
        String registerNumber,

        String companyName,
        String designation,
        Boolean isWorking,

        String purpose,
        String dob) {
}
