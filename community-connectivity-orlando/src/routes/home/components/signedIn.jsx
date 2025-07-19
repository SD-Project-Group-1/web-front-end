import { Button, Alert, Form } from "react-bootstrap";
import { useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";

export default function SignedIn() {
  const { user } = useContext(UserContext);

  const [pickupLocation, setPickupLocation] = useState(-1);
  const [pickupDateTime, setPickupDateTime] = useState("");
  const [reason, setReason] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  const [deviceTypes, setDeviceTypes] = useState([]);
  const [deviceType, setDeviceType] = useState("");

  const navigate = useNavigate();

  const getLocations = useCallback(async () => {
    const response = await fetch("/api/locations/getall");

    if (!response.ok) {
      console.error(response, await response.text());
      alert("Something went wrong. The request form cannot be loaded!");
    }

    const { data } = await response.json();

    setLocations(data);
    setLoading(false);
  }, [])

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

    if (date.valueOf() > Date.now() + (30 * 24 * 60 * 60 * 1000)) {
      setErrorMessage("Cannot schedule further than 30 days ahead!");
      return;
    }

    try {
      const payload = {
        user_id: user.id,
        preferred_type: deviceType === "" ? undefined : deviceType,
        borrow_date: pickupDateTime,
        location_id: pickupLocation,
        reason_for_borrow: reason,
      };

      const response = await fetch("/api/borrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccessMessage("Request submitted successfully!");
        setTimeout(() => navigate(0), 3000);
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

  const getDeviceTypes = useCallback(async () => {
    try {
      if (pickupLocation === -1) return;

      const params = new URLSearchParams();

      params.append("locationId", pickupLocation);

      const response = await fetch(`/api/devices/available?${params}`);

      if (!response.ok) {
        console.error("Failed to get avaialbe devices.", response, await response.text());
        alert("Could not load form properly!");
        return;
      }

      const { data } = await response.json();

      setDeviceTypes(data.filter(x => x.available).map(x => x.deviceType));
    } catch (error) {
      console.error("Failed to get avaialbe devices.", error);
      alert("Could not load form properly!");
    }
  }, [pickupLocation]);

  useEffect(() => {
    getLocations();
    getDeviceTypes();
  }, [pickupLocation, getLocations, getDeviceTypes]);

  if (loading) {
    return (
      <div className="text-center text-light my-4">
        <span className="spinner-border text-warning"></span>
        <p>Loading request form...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Request Your Device</h2>
      <p>
        Please choose a time within these business hours:
        <br />
        Monday-Friday: 10 am to 5 pm
      </p>
      <Form className="row g-3 align-items-center">
        {pickupLocation !== -1 && deviceTypes.length === 0 && (
          <p class="text-danger col-12 text-center">No devices are available at this locations!</p>
        )}

        <div className="col-md-6">
          <Form.Select
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="form-select form-select-lg bg-white text-black fs-2"
          >
            <option value={-1} disabled>Pick a Location</option>
            {locations.map((loc, i) => (
              <option key={i} value={loc.location_id}>
                {loc.location_nickname}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-6">
          <Form.Select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="form-select form-select-lg bg-white text-black fs-2"
          >
            <option value={""} disabled>Device Preference</option>
            {deviceTypes.map((t, k) => (
              <option key={k} value={t}>{t}</option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-6">
          <Form.Control
            type="datetime-local"
            value={pickupDateTime}
            onChange={(e) => setPickupDateTime(e.target.value)}
            className="form-select form-select-lg bg-white text-black fs-2"
          />
        </div>

        <div className="col-md-6">
          <Form.Select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="form-select form-select-lg bg-white text-black fs-2"
          >
            <option value={""} disabled>Request Reason</option>
            <option>Job Search</option>
            <option>School</option>
            <option>Training</option>
            <option>Other</option>
          </Form.Select>
        </div>

        <Button className="mt-3 fs-2 w-auto" onClick={handleRequest}>
          Request
        </Button>

      </Form>

      {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
    </div>
  );
}
