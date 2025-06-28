import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./requests.scss";
import { Link } from "react-router-dom";

function Requests() {
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const requests = [
    {
      first: "Larry",
      last: "Hinderson",
      date: "06/30/2025",
      location: "Winter Park",
      device: "Tablet",
      serial: "001",
    },
    {
      first: "John",
      last: "Smith",
      date: "06/30/2025",
      location: "Winter Spring",
      device: "Laptop",
      serial: "-",
    },
    {
      first: "Cid",
      last: "Kagenou",
      date: "06/30/2025",
      location: "Oviedo",
      device: "Tablet",
      serial: "099",
    },
    {
      first: "Joe",
      last: "Shmoe",
      date: "06/30/2025",
      location: "Winter Park",
      device: "Laptop",
      serial: "055",
    },
    {
      first: "Nileson",
      last: "Velez",
      date: "06/30/2025",
      location: "Winter Spring",
      device: "Tablet",
      serial: "102",
    },
  ];

  const filtered = requests.filter((req) =>
    Object.values(req).some((val) =>
      val.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleRowClick = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="container-fluid requests-container">
      <h2 className="requests-title">Requests</h2>

      <div className="requests-search mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search requests"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table-custom">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Device Type</th>
              <th>Serial #</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req, i) => (
              <tr
                key={i}
                onClick={() => handleRowClick(req)}
                style={{ backgroundColor: "#012840", color: "white" }}
              >
                <td>{req.first}</td>
                <td>{req.last}</td>
                <td>{req.date}</td>
                <td>{req.location}</td>
                <td>{req.device}</td>
                <td>{req.serial}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        contentClassName="custom-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            Device Approval
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="modal-body-custom">
          {selectedRequest && (
            <>
              <p>
                <strong>Name:</strong> {selectedRequest.first}{" "}
                {selectedRequest.last}
              </p>
              <p>
                <strong>Pickup Date:</strong> {selectedRequest.date}
              </p>
              <p>
                <strong>Pickup Location:</strong> {selectedRequest.location}
              </p>
              <p>
                <strong>Device Type:</strong> {selectedRequest.device}
              </p>
              <p>
                <strong>Serial #:</strong> {selectedRequest.serial}
              </p>

              <input
                type="text"
                className="form-control my-3 search-input"
                placeholder="Search Device"
              />
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button className="modal-btn">Approve</Button>
          <Button className="modal-btn">Deny</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Requests;
