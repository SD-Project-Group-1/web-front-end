import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import "./login.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("page submitted");
    console.log(`Email: ${email} Password: ${password}`);
  };

  return (
    <div className="login-wrapper">
      <Card className="login-card">
        <Card.Body>
          <div className="text-center mb-4 color">
            <Card.Title as="h2">Orlando City Table Rentals</Card.Title>
            <Card.Subtitle className="mb-2">Log in</Card.Subtitle>
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
          <a href="/admin/login" className="color">
            Admin Log in
          </a>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
