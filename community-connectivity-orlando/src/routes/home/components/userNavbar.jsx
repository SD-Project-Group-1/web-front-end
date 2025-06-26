import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "../home.module.scss";

export default function UserNavbar({ signedIn }) {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className={`mb-4 ${styles.navbar}`}>
      <Container>
        <Navbar.Brand className="fw-bold text-warning" onClick={() => navigate("/")}>
          🧑 Community Admin
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          {signedIn && (
            <>
              <Nav className="me-auto">
                <Nav.Link onClick={() => navigate("/admin/requests")}>Requests</Nav.Link>
                <Nav.Link onClick={() => navigate("/admin/profile")}>Profiles</Nav.Link>
                <Nav.Link onClick={() => navigate("/admin/manage")}>Manage</Nav.Link>
                <Nav.Link onClick={() => navigate("/admin/data")}>Data</Nav.Link>
              </Nav>
              <div className="d-flex align-items-center gap-3">
                <span className="text-white">👤 Admin</span>
                <Button variant="outline-warning" onClick={() => navigate("/logout")}>
                  Logout
                </Button>
              </div>
            </>
          )}
          {!signedIn && (
            <Nav className="ms-auto">
              <Button variant="outline-light" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button variant="warning" className="ms-2" onClick={() => navigate("/signup")}>
                Sign up
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
