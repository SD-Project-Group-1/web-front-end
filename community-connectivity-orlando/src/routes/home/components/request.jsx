import { Button, Container } from "react-bootstrap";
import styles from "../home.module.scss";

export default function Request() {
  return (
    <div className={`${styles.request}`}>
      <h2>Tablet Request Status</h2>
      <Container>
        <table>
          <thead>
            <tr>
              <th>Pickup Time</th>
              <th>Pickup Location</th>
              <th>Device</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10:15 am</td>
              <td>2323 Ale St</td>
              <td>iPad 3</td>
              <td>Approved!</td>
            </tr>
          </tbody>
        </table>
      </Container>
      <div className={`${styles["button-container"]}`}>
        <Button>Reschedule</Button>
        <Button>Cancel Request</Button>
      </div>
    </div>
  );
}
