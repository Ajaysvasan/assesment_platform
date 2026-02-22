package ajay.dev.FYP2.auth.controller;

public class LoginRequest {
    String email;
    String password;

    public String get_user_email() {
        return email;
    }

    public String get_password() {
        return password;
    }

    public void set_email(String email) {
        this.email = email;
    }

    public void set_password(String password) {
        this.password = password;
    }
}
