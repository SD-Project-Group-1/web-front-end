import { Link, Outlet, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";

import styles from "./adminNavbar.module.scss";

export default function AdminNavbar() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !user.role || user.role === "user")) {
      navigate("/");
      return;
    }
  }, [user, loading, navigate])

  if (loading) {
    return <></>;
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
          <div className="d-flex gap-3">
            <div className={`${styles["pfp-md"]}`}>
              <Link to="/profile">
                <div className="bi bi-person-circle"></div>
              </Link>
            </div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </div>
          <Navbar.Collapse>
            <Nav className={`${styles["navbar-nav"]}`}>
              <Link to="/admin/requests">Requests</Link>
              <Link to="/admin/profiles">Profiles</Link>
              <Link to="/admin/manage">Devices</Link>
              {user.role !== "staff" && (
                <Link to="/admin/data">Data</Link>
              )}
            </Nav>
            <Nav.Item className={`${styles.pfp}`}>
              <Link to="/profile">
                <div className="bi bi-person-circle"></div>
              </Link>
            </Nav.Item>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}
