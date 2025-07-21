import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Request({ request }) {
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [areYouSureModal, setAreYouSureModal] = useState(false);

  const date = new Date(request.borrow_date);

  const [reschedulTo, setRescheduleTo] = useState(date);
  const navigate = useNavigate();

  const handleUpdate = async (cancel = false) => {
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

    const payload = {
      borrow_status: cancel === true ? "Cancelled" : request.borrow_status,
      borrow_date: reschedulTo
    };

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

  const showReturn = request.return_date && ["Checked_out", "Late"].includes(request.borrow_status);

  return (
    <div className="">
      <h2>Tablet Request Status</h2>
      <p className="w-100 text-center text-success">Your device is ready! Come pick it up soon!</p>
      <p className="w-100 text-center text-warning">Your late for your pick up. Don't wait!</p>
      <p className="w-100 text-center">Don't forget to return your device by the due date!</p>
      <p className="w-100 text-center text-danger">Your device is past due! Please return it!</p>
      <div className="d-flex flex-wrap justify-content-center">
        <div className="col-lg-6 text-center pb-4 px-2">
          <p><strong>Pickup Time</strong></p>
          <p>
            {date.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            <br />
            {date.toLocaleString("en-US", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
        <div className="col-lg-6 text-center pb-4 px-2">
          <p><strong>Pickup Location</strong></p>
          <p>
            {request.device?.location?.street_address ?? "Unset"}
          </p>
        </div>
        <div className="col-lg-6 text-center pb-4 px-2">
          <p><strong>Device</strong></p>
          <p>
            {request.device ? `${request.device.make} ${request.device.model} (${request.device.type})` : "Not set"}
          </p>
        </div>
        <div className="col-lg-6 text-center pb-4 px-2">
          <p><strong>Status</strong></p>
          <p>
            {request.borrow_status}
          </p>
        </div>
      </div>
      <div className="w-100 d-flex justify-content-center gap-5">
        <Button onClick={() => setRescheduleModal(true)} className="fs-3">Reschedule</Button>
        <Button onClick={() => setAreYouSureModal(true)} className="fs-3">Cancel Request</Button>
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
