import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Modal,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import styles from "../../home/home.module.scss";
import CustomTable from "../../../components/table/customTable";
import { useTableState } from "../../../hooks/useTableState";
import { Link } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Profile() {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newZip, setNewZip] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const [adminModal, setAdminModal] = useState(false);
  const [adminMessage, setAdminMessage] = useState(null);
  const [adminErr, setAdminErr] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const createAdmin = async () => {
    const response = await fetch(`/api/admin/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAdmin)
    });

    if (!response.ok) {
      console.error("Could not create admin.");
      console.error(response);
      console.error(await response.text());
      setAdminErr(true);
      setAdminMessage("Could not create admin!");

      return;
    }
    setAdminMessage("Admin created!");
    setAdminErr(false);

    setTimeout(() => {
      setAdminModal(false);
      setAdminMessage(null);
      adminFetch()
    }, 3000);
  }

  const adminTableState = useTableState("admin_id", "desc");
  const userTableState = useTableState("user_id", "desc");

  const adminColumns = [
    { text: "Admin ID", dataField: "admin_id" },
    { text: "First Name", dataField: "first_name" },
    { text: "Last Name", dataField: "last_name" },
    { text: "Email", dataField: "email" },
    { text: "Role", dataField: "role" },
    {
      text: "Profile", noSort: true, formatter: (row) => (
        <>
          <Link to={`/admin/profile/${row.admin_id}`}><Button>View</Button></Link>
        </>
      )
    }
  ]

  const columns = [
    {
      text: "User ID", dataField: "user_id", formatter: user => (
        <div className={`${user.is_verified ? "text-success" : ""}`}>{user.user_id}</div>
      )
    },
    { text: "First Name", dataField: "first_name" },
    { text: "Last Name", dataField: "last_name" },
    { text: "Email", dataField: "email" },
    { text: "Zip", dataField: "zip_code" },
    {
      noSort: true, text: "Profile", formatter: (user) => (
        <>
          <Link to={`/profile/${user.user_id}`}><Button>View</Button></Link>
        </>
      )
    },
  ];

  const adminFetch = adminTableState.fetchTable;
  const userFetch = userTableState.fetchTable;

  useEffect(() => {
    adminFetch("/api/admin/getall")
      .then(data => setAdmins(data))
      .catch(() => alert("Failed to fetch admin data!"));

    userFetch("/api/user/getall")
      .then(data => setUsers(data))
      .catch(() => alert("Failed to fetch user data!"));
  }, [adminFetch, userFetch, newAdmin]);

  const zipCounts = users.reduce((acc, user) => {
    const zip = user.zip_code || "N/A";
    acc[zip] = (acc[zip] || 0) + 1;
    return acc;
  }, {});

  const exportCSV = () => {
    const headers = [
      "user_id",
      "first_name",
      "last_name",
      "email",
      "zip_code",
      "phone",
      "dob",
      "city",
      "state",
    ];
    const rows = users.map((user) =>
      headers.map((field) => `"${user[field] || ""}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_users.csv";
    link.click();
  };

  const exportZipSummary = () => {
    const rows = Object.entries(zipCounts).map(
      ([zip, count]) => `"${zip}","${count}"`,
    );
    const csv = ["ZIP,Count", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zip_summary.csv";
    link.click();
  };

  const handleDelete = async () => {
    await fetch(`/api/user/delete/${selectedUser.user_id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setUsers(users.filter((u) => u.user_id !== selectedUser.user_id));
    setShowDeleteModal(false);
  };

  const handleReassign = async () => {
    // Simulated update
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === selectedUser.user_id
          ? { ...u, zip_code: newZip, location: newLocation }
          : u
      )
    );
    setShowReassignModal(false);
  };

  const zipBarData = {
    labels: Object.keys(zipCounts),
    datasets: [
      {
        label: "Users per ZIP",
        data: Object.values(zipCounts),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "#f39c12",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles["admin-page"]}>
      <Container className="mt-4">
        <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-start align-items-md-center mb-3">
          <h2 className={styles["page-title"]}>Profiles</h2>
        </div>

        <Form className="mb-3 d-flex flex-column flex-md-row gap-2" onSubmit={ev => ev.preventDefault()}>
          <Form.Control
            type="text"
            placeholder="Search ..."
            className="w-75"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") userTableState.setQuery(searchTerm); adminTableState.setQuery(searchTerm) }}
          />
          <Button
            className="w-25 fw-bold"
            onClick={() => setAdminModal(true)}
          >
            Add Admin
          </Button>
          {/* <Form.Select */}
          {/*   value={viewMode} */}
          {/*   className="w-25" */}
          {/*   onChange={(e) => setViewMode(e.target.value)} */}
          {/* > */}
          {/*   <option value="table">Table View</option> */}
          {/*   <option value="group">ZIP Summary</option> */}
          {/*   <option value="chart">ZIP Chart</option> */}
          {/* </Form.Select> */}
        </Form>

        {viewMode === "group" && (
          <div className="mb-4">
            <h5 className="text-light">Users by ZIP</h5>
            <ul className="text-light">
              {Object.entries(zipCounts).map(([zip, count]) => (
                <li key={zip}>
                  <strong>{zip}</strong>: {count}
                </li>
              ))}
            </ul>
          </div>
        )}

        {viewMode === "chart" && (
          <Card className="bg-dark text-white mb-4">
            <Card.Body>
              <h5>ZIP Code Distribution</h5>
              <Bar data={zipBarData} />
            </Card.Body>
          </Card>
        )}

        {viewMode === "table" && (
          <div className="table-responsive">
            <CustomTable data={admins} columns={adminColumns} sorting={adminTableState.sorting} paging={adminTableState.paging} />
            <div className="d-flex flex-column flex-md-row gap-2 w-100 justify-content-end mb-2">
              <Button variant="secondary" onClick={exportCSV}>
                Export Users CSV
              </Button>
              <Button variant="secondary" onClick={exportZipSummary}>
                Export ZIP Summary
              </Button>
            </div>
            <CustomTable data={users} columns={columns} sorting={userTableState.sorting} paging={userTableState.paging} />
          </div>
        )}
      </Container>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>
            {selectedUser?.first_name} {selectedUser?.last_name}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reassign Modal */}
      <Modal
        show={showReassignModal}
        onHide={() => setShowReassignModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reassign ZIP & Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ZIP Code</Form.Label>
              <Form.Control
                value={newZip}
                onChange={(e) => setNewZip(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location (City)</Form.Label>
              <Form.Control
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleReassign}>
            Save Changes
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowReassignModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={adminModal} centered>
        <Modal.Header>
          <h3 className="fw-bold w-100 text-center">
            Add an Admin
          </h3>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex flex-column gap-2">
            {adminMessage && (
              <p className={`w-100 text-center fs-4 text-${(adminErr ? "danger" : "success")}`}>
                {adminMessage}
              </p>
            )}
            <Form.Control
              type="text"
              onChange={x => setNewAdmin({ ...newAdmin, first_name: x.target.value })}
              placeholder="First Name"
            />
            <Form.Control
              type="text"
              onChange={x => setNewAdmin({ ...newAdmin, last_name: x.target.value })}
              placeholder="Last Name"
            />
            <Form.Control
              type="text"
              onChange={x => setNewAdmin({ ...newAdmin, email: x.target.value })}
              placeholder="Email"
            />
            <Form.Control
              type="text"
              onChange={x => setNewAdmin({ ...newAdmin, password: x.target.value })}
              placeholder="Password"
            />
            <Form.Select
              type="text"
              onChange={x => setNewAdmin({ ...newAdmin, role: x.target.value })}
              defaultValue={""}
            >
              <option value={""} disabled>Select Role</option>
              <option value={"staff"}>Staff</option>
              <option value={"management"}>Management</option>
            </Form.Select>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="fw-bold" onClick={createAdmin}>Add</Button>
          <Button className="fw-bold" onClick={() => setAdminModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
