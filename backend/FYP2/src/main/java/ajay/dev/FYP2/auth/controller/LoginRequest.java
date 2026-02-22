package ajay.dev.FYP2.auth.controller;

public class LoginRequest {
    private String email; // Changed to private (best practice)
    private String password;

    // Use standard camelCase names
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
