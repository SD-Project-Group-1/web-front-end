import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import "./requestReset.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function RequestReset() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [params] = useSearchParams();

  let resetUrl = "/api/auth/request-reset";

  const isAdmin = params.get("isAdmin") === "true";

  if (isAdmin)
    resetUrl = "/api/auth/admin-request-reset";

  console.log(resetUrl);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);


    const payload = { email };

    try {
      const response = await fetch(resetUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: [["Content-Type", "application/json"]],
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Reset email not sent: " + errorData.message || response.statusText);
        alert("Reset request failed: " + (errorData.message || "Error sending reset email"));
        return;
      }

      alert("Password reset email sent successfully! Please check your email.");
      navigate(`${isAdmin ? "/admin" : ""}/login`);
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
            <p className="white">Please enter your email below.</p>
          </div>
          <div className="text-center mb-3">
            <p className="white reset-text">You will receive an email with a link to reset your password.</p>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="white">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                isInvalid={!!emailError}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="w-100 btn-color" disabled={isLoading}>
              <strong>{isLoading ? "Sending..." : "Send Reset Email"}</strong>
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

export default RequestReset;
