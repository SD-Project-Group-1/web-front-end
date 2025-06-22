import { Button, Navbar } from "react-bootstrap";
import styles from "../home.module.scss";

export default function UserNavbar({ signedIn }) {
  if (signedIn) {
    return (
      <Navbar className={`${styles["navbar"]}`}>
        <div>User Icon</div>
        <div>
          <Button>Logout</Button>
        </div>
      </Navbar>
    );
  }
  return (
    <Navbar className={`${styles["navbar"]}`}>
      <div></div>
      <div>
        <Button>Login</Button>
        <Button>Sign up</Button>
      </div>
    </Navbar>
  );
}
