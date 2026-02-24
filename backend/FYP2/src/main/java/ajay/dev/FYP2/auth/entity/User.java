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
    String name;
    String email;
    String password;
    // To prevent the confirm password entering into the DB
    @jakarta.persistence.Transient
    String confirmPassword;

    String role;

    String candidateType;
    String conductorType;

    String institutionName;
    String institutionId;

    String phoneNumber;
    String yearOfPassing;
    String registerNumber;

    String companyName;
    String designation;
    Boolean isWorking;

    String purpose;
    String dob;
}
