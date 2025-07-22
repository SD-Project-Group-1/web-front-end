import { useContext, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import "./login.scss";
import { UserContext } from "../../../context/userContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    try {
      const response = await fetch("/api/admin/signin", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: [["Content-Type", "application/json"]],
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Admin login failed:", errorData.message || response.statusText);
        alert("Login failed: " + (errorData.message || "Invalid credentials"));
        return;
      }

      const data = await response.json();
      setUser(data.admin);
      navigate("/admin");
    } catch (err) {
      console.error("Network or server error:", err);
      alert("Server error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-wrapper">
      <Card className="login-card">
        <Card.Body>
          <div className="text-center mb-4 color">
            <Card.Title as="h2">Orlando City Table Rentals</Card.Title>
            <Card.Subtitle className="mb-2">Admin Log in</Card.Subtitle>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="white">Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="white">Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="w-100 btn-color">
              <strong>Log in</strong>
            </Button>
          </Form>
          <div className="links-row">
            <Link to="/login" className="color">
              User Login
            </Link>
            <Link to="/reset/request-reset?isAdmin=true" className="color">
              Password Reset
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
