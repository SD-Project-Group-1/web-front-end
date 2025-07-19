import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import "./manage.scss";
import CustomTable from "../../../components/table/customTable";

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

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);

  const [sortField, setSortField] = useState("serial");
  const [sortDir, setSortDir] = useState("asc");

  const paging = { page, pageSize, setPage, setPageSize, count };
  const sorting = { sortField, sortDir, setSortField, setSortDir }

  const columns = [
    { text: "Serial #", dataField: "serial", sortName: "serial_number" },
    { text: "Brand", dataField: "brand" },
    { text: "Model", dataField: "model" },
    { text: "Location", dataField: "location" },
    { text: "Status", dataField: "status", noSort: true },
    { text: "Condition", dataField: "condition", noSort: true },
    {
      text: "Actions", noSort: true, formatter: dev => (
        <>
          <Button className="bg-danger border-danger fw-bold" onClick={() => deleteDevice(dev.id)}>Delete</Button>
        </>
      )
    }
  ];

  const deleteDevice = async (id) => {
    const response = await fetch(`/api/devices/delete/${id}`, { method: "DELETE" });

    if (!response.ok) {
      console.error(response, await response.text());
      alert("Failed to delete!");
      return;
    }

    setDevices(devices.filter(x => x.id !== id));
  }

  const requestData = useCallback(async () => {
    const urlParams = new URLSearchParams();

    urlParams.append("page", page);
    urlParams.append("pageSize", pageSize);
    urlParams.append("sortBy", sortField);
    urlParams.append("sortDir", sortDir);

    try {
      const response = await fetch(
        `/api/devices/getall?${urlParams}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        console.erro("An error has occured");
        console.error(response);
        alert("Something went wrong.");
      }

      const { data, count } = await response.json();
      let deviceData = [];
      for (let i = 0; i < data.length; i++) {
        const borrowInfo = data[i].borrow && data[i].borrow.length > 0
          ? data[i].borrow.at(-1)
          : null;
        deviceData[i] = {
          id: data[i].device_id,
          serial: data[i].serial_number,
          type: data[i].type,
          brand: data[i].brand,
          model: `${data[i].make} ${data[i].model}`,
          location: data[i].location.location_nickname,
          status: borrowInfo?.borrow_status?.replace('_', ' ') || "N/A",
          condition: borrowInfo?.device_return_condition || "N/A",
        };
      }

      setDevices(deviceData);
      setCount(count);
    } catch (err) {
      console.error(err);
    }
  }, [page, pageSize, sortField, sortDir]);

  const requestLocations = useCallback(async () => {
    try {
      const response = await fetch("/api/locations/getall", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error("Error fetching locations");
        console.error(response);
        return;
      }

      const { data } = await response.json();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

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
        console.erro(await response.text());
        alert("Failed to add device.");
        return;
      }
    } catch (err) {
      console.error(err);
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

  useEffect(() => {
    requestData();
    requestLocations();
  }, [page, pageSize, sortField, sortDir, requestData, requestLocations]);

  return (
    <div
      className="container-fluid p-4 text-white"
      style={{ backgroundColor: "#102133", minHeight: "100vh" }}
    >
      <Container className="table-container">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap flex-md-nowrap">
          <h2 className="manage-title mt-4">Device Management</h2>
          <button className="add-device-btn" onClick={() => setShowModal(true)}>
            Add Device
          </button>
        </div>

        <CustomTable data={devices} columns={columns} paging={paging} sorting={sorting} />
      </Container>
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
