package ajay.dev.FYP2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.UUID;

@SpringBootApplication
public class Fyp2Application {

    public static void main(String[] args) {
        UUID uuid = UUID.randomUUID();
        String uuidToString = uuid.toString();
        System.out.print(uuidToString);
        SpringApplication.run(Fyp2Application.class, args);
    }
}
