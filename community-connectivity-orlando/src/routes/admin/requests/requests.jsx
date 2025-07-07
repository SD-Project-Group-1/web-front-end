import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./requests.scss";
import CustomTable from "../../../components/table/table";

function Requests() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");

  const paging = {
    enabled: true,
    page, pageSize, setPage, setPageSize
  };

  const columns = [
    { text: "First Name", dataField: "first" },
    { text: "Last Name", dataField: "last" },
    { text: "Check Out", dataField: "borrowDate" },
    { text: "Check In", dataField: "returnDate" },
    { text: "Device", dataField: "deviceType" },
    { text: "Device Serial", dataField: "deviceSerial" }
  ];

  const getRequests = async () => {
    console.log("running", query);
    const urlParams = new URLSearchParams([["page", page], ["pageSize", pageSize]]);

    if (query && query !== "") {
      urlParams.append("q", query);
    }

    const response = await fetch(`/api/borrow/getall?${urlParams}`);

    console.log(response.url);

    if (!response.ok) {
      alert("Could not get requests!");
      console.error(response);
      return;
    }

    const data = await response.json();

    const mapped = data.map(x => ({
      first: x.user.first_name,
      last: x.user.last_name,
      borrowDate: new Date(x.borrow_date).toDateString(),
      returnDate: x.return_date ? "" : new Date(x.return_date).toDateString(),
      location: x.device.location.location_nickname,
      deviceType: `${x.device.brand} ${x.device.make} ${x.device.model} (${x.device.type})`,
      deviceSerial: x.device.serial_number
    }));

    setRequests(mapped);
    setLoading(false);
  };

  useEffect(() => {
    getRequests();
  }, [page, pageSize, query]);

  const handleRowClick = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
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
      <h2 className="requests-title">Requests</h2>

      <div className="requests-search mb-3">
        <input
          type="search"
          className="form-control search-bar"
          placeholder="Search requests"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <CustomTable data={requests} columns={columns} paging={paging} />

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
