import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "./manage.scss";

function Manage() {
  const [showModal, setShowModal] = useState(false);
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [serial, setSerial] = useState("");
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [make, setMake] = useState("");

  useEffect(() => {
    requestData();
    requestLocations();
  }, []);

  const requestData = async () => {
    try {
      const responce = await fetch(
        `/api/devices/getall`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!responce.ok) {
        console.log("An error has occured");
      }

      const json = await responce.json();
      let deviceData = [];
      for (let i = 0; i < json.length; i++) {
        const borrowInfo = json[i].borrow && json[i].borrow.length > 0
          ? json[i].borrow[0]
          : null;

        deviceData[i] = {
          serial: json[i].serial_number,
          type: json[i].type,
          brand: json[i].brand,
          model: `${json[i].make} ${json[i].model}`,
          location: json[i].location.street_address,
          status: borrowInfo?.borrow_status || "N/A",
          condition: borrowInfo?.device_return_condition || "N/A",
        };
      }
      setDevices(deviceData);
    } catch (err) {
      console.log(err);
    }
  };

  const requestLocations = async () => {
    try {
      const response = await fetch("/api/locations/getall", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.log("Error fetching locations");
        return;
      }

      const json = await response.json();
      setLocations(json);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/devices/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serial_number: serial,
          type,
          brand,
          model,
          location_id: parseInt(selectedLocation),
          make,
        }),
      });
      if (!response.ok) {
        console.log(response.json);
        alert("Failed to add device.");
        return;
      }
    } catch (err) {
      console.log(err);
    }
    requestData();
    setShowModal(false);
    setSerial("");
    setType("");
    setBrand("");
    setModel("");
    setMake("");
    setSelectedLocation("");
  };

  return (
    <div
      className="container-fluid p-4 text-white"
      style={{ backgroundColor: "#102133", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="manage-title mt-4">Device Management</h2>
        <button className="add-device-btn" onClick={() => setShowModal(true)}>
          Add Device
        </button>
      </div>

      <div className="table-container">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Serial #</th>
              <th>Type</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Location</th>
              <th>Status</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d, i) => (
              <tr key={i}>
                <td>{d.serial}</td>
                <td>{d.type}</td>
                <td>{d.brand}</td>
                <td>{d.model}</td>
                <td>{d.location}</td>
                <td>{d.status}</td>
                <td>{d.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        contentClassName="simple-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title text-info">
            Device Approval
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Control
                className="form-control"
                type="text"
                placeholder="Serial #"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                className="form-control"
                type="text"
                placeholder="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                className="form-control"
                type="text"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                className="form-control"
                type="text"
                placeholder="Make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                className="form-control"
                type="text"
                placeholder="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Select
                className="form-control"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.location_id} value={loc.location_id}>
                    {loc.location_nickname || loc.street_address}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="add-device-submit-btn"
            onClick={handleSubmit}
          >
            Add Device
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Manage;
