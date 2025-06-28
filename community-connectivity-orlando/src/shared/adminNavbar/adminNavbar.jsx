import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import styles from "./adminNavbar.module.scss";

export default function AdminNavbar() {
  return (
    <div>
      <Navbar expand="lg" className={`${styles.navbar}`}>
        <Container>
          <Navbar.Brand href="/admin">ICON</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav>
              <Nav.Link href="/admin/requests">Requests</Nav.Link>
              <Nav.Link href="/admin/profiles">Profiles</Nav.Link>
              <Nav.Link href="/admin/manage">Manage</Nav.Link>
              <Nav.Link href="/admin/data">Data</Nav.Link>
            </Nav>
            <Nav.Item>
              PFP
            </Nav.Item>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}
