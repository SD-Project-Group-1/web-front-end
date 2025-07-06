import styles from "../home.module.scss";
import { Button, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import { UserContext } from "../../../context/userContext";

export default function SignedIn() {
  const { user } = useContext(UserContext);

  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDateTime, setPickupDateTime] = useState("");
  const [reason, setReason] = useState("Job Search");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRequest = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!pickupLocation || !pickupDateTime || !reason) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/borrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          borrow_date: pickupDateTime,
          user_location: pickupLocation,
          reason_for_borrow: reason,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Request submitted successfully!");
        console.log("Borrow record:", data);
      } else {
        const errorText = await response.text();
        setErrorMessage(`Error: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error or server not responding.");
    }
  };

  return (
    <div className={styles["signed-in"]}>
      <h2>Request Your Device</h2>

      <div className={styles["request-form"]}>
        <input
          placeholder="Pickup Location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="Pickup Date/Time"
          value={pickupDateTime}
          onChange={(e) => setPickupDateTime(e.target.value)}
        />
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option>Job Search</option>
          <option>School</option>
          <option>Training</option>
          <option>Other</option>
        </select>
      </div>

      <Button className="mt-3" onClick={handleRequest}>
        Request
      </Button>

      {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
    </div>
  );
}
