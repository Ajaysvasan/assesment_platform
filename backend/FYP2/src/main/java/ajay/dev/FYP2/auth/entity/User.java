package ajay.dev.FYP2.auth.entity;

import java.util.UUID;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "User")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private String email;
    private String password;
    // To prevent the confirm password entering into the DB
    @jakarta.persistence.Transient
    private String confirmPassword;

    private String role;

    private String candidateType;
    private String conductorType;

    private String institutionName;
    private String institutionId;

    private String phoneNumber;
    private String yearOfPassing;
    private String registerNumber;

    private String companyName;
    private String designation;
    private Boolean isWorking;

    private String purpose;
    private String dob;
    private boolean isBanned;
}
