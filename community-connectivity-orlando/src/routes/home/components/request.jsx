import { Button, Modal } from "react-bootstrap";
import styles from "../home.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Request({ request }) {
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [areYouSureModal, setAreYouSureModal] = useState(false);

  const date = new Date(request.borrow_date);

  const [reschedulTo, setRescheduleTo] = useState(date);
  const navigate = useNavigate();

  const handleUpdate = async (cancel = false) => {
    const payload = {
      borrow_status: cancel === true ? "Cancelled" : request.borrow_status,
      borrow_date: reschedulTo
    };

    if (!cancel) {
      const date = reschedulTo;

      if (!date || date.getHours() > 17 || date.getHours() < 10 || date.valueOf() < Date.now()) {
        alert("Please pick a valid pickup time!");
        return;
      }

      if (date.valueOf() > Date.now() + (30 * 24 * 60 * 60 * 1000)) {
        alert("Cannot schedule further than 30 days ahead!");
        return;
      }
    }

    const response = await fetch(`/api/borrow/update/${request.borrow_id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: [["Content-Type", "application/json"]]
    });

    if (!response.ok) {
      console.error(response, await response.text());
      alert("Something went wrong!");
      return;
    }

    navigate(0);
  }

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
            {request.device?.location?.street_address ?? "Unset"}
          </p>
        </div>
        <div>
          <p><strong>Device</strong></p>
          <p>
            {request.device ? `${request.device.make} ${request.device.model} (${request.device.type})` : "Not set"}
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
        <Button onClick={() => setRescheduleModal(true)}>Reschedule</Button>
        <Button onClick={() => setAreYouSureModal(true)}>Cancel Request</Button>
      </div>
      <Modal show={areYouSureModal} centered>
        <Modal.Header>
          <h3 className="fw-bold">Are you sure you want to cancel your device request?</h3>
        </Modal.Header>
        <Modal.Footer>
          <Button className="bg-danger border-danger" onClick={() => handleUpdate(true)}>Yes</Button>
          <Button className="" onClick={() => setAreYouSureModal(false)}>No</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={rescheduleModal} centered>
        <Modal.Header>
          <h3 className="fw-bold">To what time would you like to reschedule?</h3>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <input type="datetime-local" value={reschedulTo} onChange={x => setRescheduleTo(x.target.value)}
            className="fs-4 rounded-3" />
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-danger border-danger" onClick={handleUpdate}>Yes</Button>
          <Button className="" onClick={() => setRescheduleModal(false)}>No</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
