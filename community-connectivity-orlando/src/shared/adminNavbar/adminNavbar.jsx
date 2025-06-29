import { Link, Outlet, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

import styles from "./adminNavbar.module.scss";

export default function AdminNavbar() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return;
  }

  return (
    <div>
      <Navbar expand="lg" className={`${styles.navbar}`}>
        <Container>
          <Navbar.Brand>
            <Link to="/admin" className={`${styles["home-icon"]}`}>
              <div className="bi bi-house-fill me-2"></div>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav>
              <Link to="/admin/requests">Requests</Link>
              <Link to="/admin/profiles">Profiles</Link>
              <Link to="/admin/manage">Manage</Link>
              <Link to="/admin/data">Data</Link>
            </Nav>
            <Nav.Item className={`${styles.pfp}`}>
              <Link to="/profile">
                <div className="bi bi-person-circle"></div>
              </Link>
            </Nav.Item>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>{JSON.stringify(user)}</div>
      <Outlet />
    </div>
  );
}
