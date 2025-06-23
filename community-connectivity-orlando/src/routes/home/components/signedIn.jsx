import styles from "../home.module.scss";
import { Button } from "react-bootstrap";

export default function SignedIn() {
  return (
    <div className={`${styles["signed-in"]}`}>
      <h2>Request Your Device</h2>
      <div className={`${styles["request-form"]}`}>
        <input placeholder="Pickup Location" />
        <input placeholder="Pickup Date/Time" />
        <input placeholder="Device Type" />
        <select>
          <option>Job Search</option>
          <option>School</option>
          <option>Training</option>
          <option>Other</option>
        </select>
      </div>
      <Button>Request</Button>
    </div>
  );
}
