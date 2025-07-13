import { Button } from "react-bootstrap";
import styles from "../home.module.scss";

export default function Request({ request }) {
  const date = new Date(request.borrow_date);

  return (
    <div className={`${styles.request}`}>
      <h2>Tablet Request Status</h2>
      <div className={`${styles.report}`}>
        <div>
          <p><strong>Pickup Time</strong></p>
          <p>
            {date.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            <br />
            {date.toLocaleString("en-US", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
        <div>
          <p><strong>Pickup Location</strong></p>
          <p>
            {request.device.location.street_address}
          </p>
        </div>
        <div>
          <p><strong>Device</strong></p>
          <p>
            {request.device.make} {request.device.model} ({request.device.type})
          </p>
        </div>
        <div>
          <p><strong>Status</strong></p>
          <p>
            {request.borrow_status}
          </p>
        </div>
      </div>
      <div className={`${styles["button-container"]}`}>
        <Button>Reschedule</Button>
        <Button>Cancel Request</Button>
      </div>
    </div>
  );
}
