package ajay.dev.FYP2.auth.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
class Authentication {
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest login_req) {
        System.out.println(login_req.getEmail() + "\n" + login_req.getPassword());
        return "success";
    }
}
