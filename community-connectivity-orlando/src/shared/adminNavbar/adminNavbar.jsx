import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import styles from "./adminNavbar.module.scss";

export default function AdminNavbar() {
  return (
    <div className={`${styles.navbar}`}>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/admin">Home-Icon</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/admin/requests">Requests</Nav.Link>
              <Nav.Link href="/admin/profiles">Profiles</Nav.Link>
              <Nav.Link href="/admin/manage">Manage</Nav.Link>
              <Nav.Link href="/admin/data">Data</Nav.Link>
              {/* TODO: Small Screens */}
              <NavDropdown title="Pages" id="basic-nav-dropdown">
                <NavDropdown.Item href="/admin/requests">
                  Requests
                </NavDropdown.Item>
                <NavDropdown.Item href="/admin/profiles">
                  Profiles
                </NavDropdown.Item>
                <NavDropdown.Item href="/admin/manage">Manage</NavDropdown.Item>
                <NavDropdown.Item href="/admin/data">Data</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}
