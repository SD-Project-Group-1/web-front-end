import { useEffect, useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import "./requests.scss";
import CustomTable from "../../../components/table/customTable";
import { Link } from "react-router-dom";

function Requests() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showSure, setSure] = useState(false);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [inputQuery, setInputQuery] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);

  const [sortField, setSortField] = useState("borrow_status");
  const [sortDir, setSortDir] = useState("asc");

  const paging = { page, pageSize, setPage, setPageSize, count };
  const sorting = { sortField, sortDir, setSortField, setSortDir }

  const columns = [
    {
      text: "User", dataField: "name", formatter: row => (
        row.user_id === "DELETED" ? "DELETED" : <Link to={`/profile/${row.user_id}`} className="text-white text-decoration-none link-primary">{row.name}</Link>
      )
    },
    { text: "Status", dataField: "borrow_status" },
    { text: "Check Out", dataField: "borrow_date" },
    { text: "Check In", dataField: "return_date" },
    { text: "Device", dataField: "device" },
    { text: "Serial #", dataField: "device_serial_number" },
    {
      noSort: true, text: "Actions", formatter: (row) => (
        <>
          <Button onClick={() => handleRowClick(row)} className="border-0 fw-bold">EDIT</Button>
          <Button onClick={() => { setSelectedRequest(row); setSure(true) }} className="bg-danger border-0 fw-bold">DELETE</Button>
        </>
      )
    }
  ];

  const deleteRequest = async () => {
    try {
      const response = await fetch(`/api/borrow/delete/${selectedRequest.borrow_id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        console.error("Could not get request.\n", response, '\n', await response.text());
        alert("Could not delete!");
      }
      setQuery(" ");
      setQuery("");
    } catch (error) {
      console.error("Could not get request.\n", error);
      alert("Could not delete!");
    } finally {
      setSure(false);
    }
  }

  const approveRequest = async () => {
    const id = selectedRequest.borrow_id;

    if (!id || typeof id !== "number") {
      alert("Something went wrong! Alert a dev!");
      console.error("Something is wrong with the request object.", selectedRequest);
      return;
    }

    const payload = {
      borrow_status: "Scheduled",
      return_date: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)),
      device_return_condition: null
    }

    const response = await fetch(`/api/borrow/update/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: [["Content-Type", "application/json"]]
    });

    if (!response.ok) {
      alert("Something went wrong!");
      console.error(response, await response.text());
      return;
    }

    alert("Approved!");
  }

  const denyRequest = async () => {
    const id = selectedRequest.borrow_id;

    if (!id || typeof id !== "number") {
      alert("Something went wrong! Alert a dev!");
      console.error("Something is wrong with the request object.", selectedRequest);
      return;
    }

    const payload = {
      borrow_status: "Cancelled",
      return_date: null,
      device_return_condition: null
    }

    const response = await fetch(`/api/borrow/update/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: [["Content-Type", "application/json"]],
    });

    if (!response.ok) {
      alert("Something went wrong!");
      console.error(response, await response.text());
      return;
    }

    alert("Cancelled!");
  }

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams();

      urlParams.append("page", page);
      urlParams.append("pageSize", pageSize);
      urlParams.append("sortBy", sortField);
      urlParams.append("sortDir", sortDir);

      if (query && query !== "") {
        urlParams.append("q", query);
      }

      const response = await fetch(`/api/borrow/getall?${urlParams}`);

      if (!response.ok) {
        alert("Could not get requests!");
        console.error(response);
        return;
      }

      const { data, count } = await response.json();
      setCount(count);

      const mapped = data.map(x => ({
        borrow_id: x.borrow_id,
        user_id: x.user?.user_id ?? "DELETED",
        borrow_status: x.borrow_status?.replace("_", " ") ?? "",
        name: x.user ? x.user.first_name + " " + x.user.last_name : "DELETED",
        borrow_date: new Date(x.borrow_date).toDateString(),
        return_date: x.return_date ? "" : new Date(x.return_date).toDateString(),
        location_nickname: x.device.location.location_nickname,
        device: `${x.device.brand} ${x.device.make} ${x.device.model} (${x.device.type})`,
        device_serial_number: x.device.serial_number
      }));

      setRequests(mapped);
      setLoading(false);
    })();
  }, [page, pageSize, query, sortField, sortDir]);

  const handleRowClick = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSure(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="text-center text-light my-4">
        <span className="spinner-border text-warning"></span>
        <p>Loading requests data...</p>
      </div>);
  }

  return (
    <div className="container-fluid requests-container">
      <Container>
        <h2 className="requests-title">Requests</h2>
        <div className="requests-search mb-3">
          <input
            type="search"
            className="form-control search-bar"
            placeholder="Search requests"
            value={inputQuery}
            onKeyDown={x => x.key === "Enter" ? setQuery(inputQuery) : undefined}
            onChange={x => setInputQuery(x.target.value)}
          />
        </div>

        <CustomTable data={requests} columns={columns} paging={paging} sorting={sorting} />
      </Container>

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

              <label>Set Device</label>
              <input
                type="text"
                className="form-control my-3 search-input"
                placeholder="Search Device"
              />
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button className="modal-btn" onClick={approveRequest}>Approve</Button>
          <Button className="modal-btn" onClick={denyRequest}>Deny</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSure}
        onHide={handleClose}
        centered
      >
        <Modal.Header>
          <Modal.Title className="fw-bold">Are you sure you want to delete this request?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button className="bg-danger fw-bold border-danger" onClick={deleteRequest}>Yes</Button>
          <Button className="fw-bold" onClick={() => setSure(false)}>No</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Requests;
