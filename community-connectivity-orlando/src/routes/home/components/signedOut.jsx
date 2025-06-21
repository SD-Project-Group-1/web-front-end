import { Button } from "react-bootstrap";
import styles from "../home.module.scss";

export default function SignedOut() {
  return (
    <div>
      <h2>Check Eligible Area</h2>
      <div className={`${styles.eligable}`}>
        <input placeholder="ZIP Code" />
        <Button>Check</Button>
      </div>
      <h2>Make an account</h2>
      <div className={`${styles["make-account-box"]}`}>
        <p>
          All you need to get started is to make an account and provide some
          basic information.
        </p>
        <Button>Sign Up</Button>
      </div>
    </div>
  );
}
