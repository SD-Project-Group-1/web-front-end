import styles from "../home.module.scss";
import { Button, Alert, Container } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../context/userContext";

export default function SignedIn() {
  const { user } = useContext(UserContext);

  const [pickupLocation, setPickupLocation] = useState(-1);
  const [pickupDateTime, setPickupDateTime] = useState("");
  const [reason, setReason] = useState("Job Search");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  const getLocations = async () => {
    const response = await fetch("/api/locations/getall");

    if (!response.ok) {
      console.error(response, await response.text());
      alert("Something went wrong. The request form cannot be loaded!");
    }

    const { data } = await response.json();

    setLocations(data);
    setLoading(false);
  }

  const handleRequest = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!pickupLocation || !pickupDateTime || !reason) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!locations.some(x => x.location_id === parseInt(pickupLocation))) {
      setErrorMessage("Please pick a valid location!");
      return;
    }

    const date = new Date(pickupDateTime);

    if (!date || date.getHours() > 17 || date.getHours() < 10 || date.valueOf() < Date.now()) {
      setErrorMessage("Please pick a valid pickup time!");
      return;
    }

    try {
      const response = await fetch("/api/borrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          borrow_date: pickupDateTime,
          location_id: pickupLocation,
          reason_for_borrow: reason,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Request submitted successfully!");
      } else {
        const errorText = await response.text();
        console.error(response);
        setErrorMessage(`Error: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error or server not responding.");
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-light my-4">
        <span className="spinner-border text-warning"></span>
        <p>Loading request form...</p>
      </div>
    );
  }

  return (
    <div className={styles["signed-in"]}>
      <h2>Request Your Device</h2>
      <p>
        Please choose a time within these business hours:
        <br />
        Monday-Friday: 10 am to 5 pm
      </p>
      <Container className={styles["request-form"]}>
        <div>
          <select
            list="location-options"
            placeholder="Pickup Location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          >
            {locations.map((loc, i) => (
              <option key={i} value={loc.location_id}>
                {loc.location_nickname}
              </ option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="datetime-local"
            placeholder="Pickup Date/Time"
            value={pickupDateTime}
            onChange={(e) => setPickupDateTime(e.target.value)}
          />
        </div>
        <div className={`${styles.reason}`}>
          <label>Reason for Request</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option>Job Search</option>
            <option>School</option>
            <option>Training</option>
            <option>Other</option>
          </select>
        </div>
      </Container>

      <Button className="mt-3" onClick={handleRequest}>
        Request
      </Button>

      {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
    </div>
  );
}
