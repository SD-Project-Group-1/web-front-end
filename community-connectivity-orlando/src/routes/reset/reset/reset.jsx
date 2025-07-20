import { useState, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import "./reset.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Reset() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = searchParams.get('token');

    if (getToken) {
      setToken(getToken);
    } else {
      alert("Invalid or expired reset link. Please request password reset again.");
      return;
    }
  }, [searchParams]);

  const handleSubmit = async (error) => {
    error.preventDefault();

    if (!token) {
      alert("Invalid or expired reset link. Please request password reset again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    setIsLoading(true);

    const payload = {
      token: token,
      newPassword: newPassword,
    };

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: [["Content-Type", "application/json"]],
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Password reset failed:", errorData.message || response.statusText);
        alert("Password reset failed: " + (errorData.message || "Invalid token"));
        return;
      }

      await response.json();
      alert("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Network or server error:", err);
      alert("Server error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-wrapper">
      <Card className="reset-card">
        <Card.Body>

          <div className="text-center mb-4 color reset-card-title">
            <Card.Subtitle className="mb-2">Reset Password</Card.Subtitle>
          </div>

          <div className="text-center mb-3">
            <p className="white">Please enter your new password below.</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label className="white">New Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formConfirmPassword">
              <Form.Label className="white">Confirm New Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
              />
            </Form.Group>
            <Button type="submit" className="w-100 btn-color" disabled={isLoading}>
              <strong>{isLoading ? "Resetting..." : "Reset Password"}</strong>
            </Button>
          </Form>
          <Link to="/login" className="color">
            Back to Login
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Reset; 
