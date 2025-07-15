// src/routes/admin/profiles/profiles.jsx
import React, { useCallback, useEffect, useState } from "react";
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Profiles() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newZip, setNewZip] = useState("");
  const [newCity, setNewCity] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);

  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState("user_id");
  const [sortDir, setSortDir] = useState("desc");

  const paging = { page, pageSize, setPage, setPageSize, count };
  const sorting = { sortField, sortDir, setSortField, setSortDir };

  const columns = [
    { text: "User ID", dataField: "user_id" },
    { text: "First Name", dataField: "first_name" },
    { text: "Last Name", dataField: "last_name" },
    { text: "Email", dataField: "email" },
    { text: "ZIP", dataField: "zip_code" },
    {
      noSort: true,
      text: "Actions",
      formatter: (user) => (
        <>
          <Button
            size="sm"
            variant="outline-warning"
            onClick={() => {
              setSelectedUser(user);
              setNewZip(user.zip_code || "");
              setNewCity(user.city || "");
              setShowReassignModal(true);
            }}
          >
            Reassign
          </Button>{" "}
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => {
              setSelectedUser(user);
              setShowDeleteModal(true);
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const fetchUsers = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.append("page", page);
      urlParams.append("pageSize", pageSize);
      urlParams.append("sortBy", sortField);
      urlParams.append("sortDir", sortDir);
      if (query) urlParams.append("q", query);

      setIsLoading(true);
      const res = await fetch(`/api/user/getall?${urlParams}`, {
        credentials: "include",
      });
      const { data, count } = await res.json();
      setUsers(data);
      setCount(count);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, sortField, sortDir, query]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
    const rows = users.map((u) =>
      headers.map((field) => `"${u[field] || ""}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.csv";
    link.click();
  };

  const exportZipSummary = () => {
    const rows = Object.entries(zipCounts).map(
      ([zip, count]) => `${zip},${count}`
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

  const handleReassign = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === selectedUser.user_id
          ? { ...u, zip_code: newZip, city: newCity }
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
        backgroundColor: "#f39c12",
      },
    ],
  };

  return (
    <div className={styles["admin-page"]}>
      <Container className="mt-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
          <h2 className={styles["page-title"]}>Admin Profile Management</h2>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={exportCSV}>
              Export Users CSV
            </Button>
            <Button variant="secondary" onClick={exportZipSummary}>
              Export ZIP Summary
            </Button>
          </div>
        </div>

        <Form className="d-flex flex-column flex-md-row mb-3 gap-2" onSubmit={(e) => e.preventDefault()}>
          <Form.Control
            placeholder="Search..."
            className="w-75"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQuery(searchTerm)}
          />
          <Form.Select
            className="w-25"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="table">Table View</option>
            <option value="group">ZIP Summary</option>
            <option value="chart">ZIP Chart</option>
          </Form.Select>
        </Form>

        {isLoading ? (
          <div className="text-center text-light">
            <span className="spinner-border text-warning"></span>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            {viewMode === "group" && (
              <ul className="text-light">
                {Object.entries(zipCounts).map(([zip, count]) => (
                  <li key={zip}><strong>{zip}</strong>: {count}</li>
                ))}
              </ul>
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
              <CustomTable
                data={users}
                columns={columns}
                sorting={sorting}
                paging={paging}
              />
            )}
          </>
        )}
      </Container>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Reassign Modal */}
      <Modal show={showReassignModal} onHide={() => setShowReassignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reassign ZIP & City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>New ZIP</Form.Label>
            <Form.Control
              value={newZip}
              onChange={(e) => setNewZip(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>New City</Form.Label>
            <Form.Control
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleReassign}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => setShowReassignModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
