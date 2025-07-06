import React, { useEffect, useState } from "react";
import "./manage.scss";

function Manage() {
  const [showModal, setShowModal] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    requestData();
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
      // Add logic to make the status more readable EG remove the underscores
      for (let i = 0; i < json.length; i++) {
        deviceData[i] = {
          serial: json[i].serial_number,
          type: json[i].type,
          brand: json[i].brand,
          model: `${json[i].make} ${json[i].model}`,
          location: json[i].location.street_address,
          status: json[i].borrow[0].borrow_status,
          condition: json[i].borrow[0].device_return_condition,
        };
      }
      setDevices(deviceData);
    } catch (err) {
      console.log(err);
    }
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
      {/* Modal */}
      {showModal && (
        <div className="simple-modal-backdrop">
          <div className="simple-modal">
            <h5 className="modal-title text-info">Device Approval</h5>
            <input
              type="text"
              placeholder="Serial #"
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Type"
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Brand"
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Model"
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Location"
              className="form-control mb-3"
            />
            <button
              className="add-device-submit-btn"
              onClick={() => setShowModal(false)}
            >
              Add Device
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Manage;
