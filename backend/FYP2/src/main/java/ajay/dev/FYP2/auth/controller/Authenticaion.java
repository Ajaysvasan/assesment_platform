package ajay.dev.FYP2.auth.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ajay.dev.FYP2.auth.dto.*;

@RestController
@RequestMapping("/api/auth")
class Authentication {
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest login_req) {
        return "success";
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest register_req) {
        return "success";
    }
}
