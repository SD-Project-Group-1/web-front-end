import React, { useState, useEffect } from 'react';
import styles from "./home.module.scss";
import SignedOut from "./components/signedOut";
import UserNavbar from "./components/userNavbar";
import SignedIn from "./components/signedIn";
import Request from "./components/request";

function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [request, setRequest] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Request submitted:\nPickup: ${pickupDate}\nDevice: ${deviceType}\nReason: ${reason}`);
  };

  useEffect(() => {
    //Set signed in from cookies / API
    setSignedIn(false);
    //Set request from API
    setRequest(null);
  }, []);

  let afterEl;

  if (signedIn && request) {
    afterEl = <Request />;
  } else if (signedIn) {
    afterEl = <SignedIn />;
  } else {
    afterEl = <SignedOut />;
  }

  return (
    <div className="container-fluid home-page text-white py-5" style={{ backgroundColor: '#0d1b2a', minHeight: '100vh' }}>
      <div className="d-flex justify-content-end">
        <button className="btn btn-warning fw-bold">Logout</button>
      </div>

      <h1 className="mt-3 text-info">Orlando City Connectivity Portal</h1>
      <p className="mt-3">
        If you have low internet coverage in your area and need a WiFi-ready device, then you’re in the right place!
        If you are in an eligible area, Orlando City will provide you with a free-to-rent device to offset the low
        internet coverage in your area. Simply create an account, complete a form, and come pick up your device on your
        scheduled date!
      </p>

      <h3 className="text-info mt-5">Request Your Tablet</h3>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="pickup" className="form-label">Pickup Date/Time</label>
            <input
              type="datetime-local"
              id="pickup"
              className="form-control"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="deviceType" className="form-label">Device Type</label>
            <input
              type="text"
              id="deviceType"
              className="form-control"
              placeholder="e.g. Tablet"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="reason" className="form-label">Reason for Request</label>
            <select
              id="reason"
              className="form-select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select Reason</option>
              <option value="Job Search">Job Search</option>
              <option value="School">School</option>
              <option value="Training">Training</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-warning fw-bold px-5">Request</button>
      </form>
    </div>
  );
}

export default Home;
