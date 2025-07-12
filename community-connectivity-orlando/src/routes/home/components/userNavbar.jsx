import { Button, Navbar } from "react-bootstrap";
import styles from "../home.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";

export default function UserNavbar({ signedIn }) {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    await fetch("/api/signout", { method: "POST" });
    setUser(null);
    navigate("");
  };

  if (signedIn) {
    return (
      <Navbar className={`${styles["navbar"]}`}>
        <Link to="/profile" className={`${styles.pfp}`}>
          <div className="bi bi-person-circle"></div>
        </Link>
        <div>
          <Button onClick={logout}>Logout</Button>
        </div>
      </Navbar>
    );
  }
  return (
    <Navbar className={`${styles["navbar"]}`}>
<div className={styles.navButtons}>
  <Link to="/login"><Button>Login</Button></Link>
  <Link to="/signup"><Button>Sign Up</Button></Link>
</div>
    </Navbar>
  );
}
