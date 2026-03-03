package ajay.dev.FYP2.auth.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;
import jakarta.persistence.*;
import ajay.dev.FYP2.exam.entity.*;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private String email;
    private String password;
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
    @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Exams> exams = new ArrayList<>();
}
