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

export default function Profile() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newZip, setNewZip] = useState("");
  const [newLocation, setNewLocation] = useState("");
  // const [newAdmin, setNewAdmin] = useState({
  //   first_name: "",
  //   last_name: "",
  //   email: "",
  //   password: "",
  //   role: "staff",
  // });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);

  const [query, setQuery] = useState("");

  const [sortField, setSortField] = useState("user_id");
  const [sortDir, setSortDir] = useState("desc");

  const paging = { page, pageSize, setPage, setPageSize, count };
  const sorting = { sortField, sortDir, setSortField, setSortDir }

  const columns = [
    { text: "User ID", dataField: "user_id" },
    { text: "First Name", dataField: "first_name" },
    { text: "Last Name", dataField: "last_name" },
    { text: "Email", dataField: "email" },
    { text: "Zip", dataField: "zip_code" },
    {
      noSort: true, text: "Actions", formatter: (user) => (
        <>
          <Button
            size="sm"
            variant="outline-warning"
            onClick={() => {
              setSelectedUser(user);
              setNewZip(user.zip_code || "");
              setNewLocation(user.city || "");
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
      )
    },
  ]

  const fetchUsers = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams();

      urlParams.append("page", page);
      urlParams.append("pageSize", pageSize);
      urlParams.append("sortBy", sortField);
      urlParams.append("sortDir", sortDir);

      if (query && query !== "") {
        urlParams.append("q", query);
      }

      setIsLoading(true);
      const res = await fetch(`/api/user/getall?${urlParams}`);
      const { data, count } = await res.json();
      for (const user of data) {
        user.role = "user";
      }
      setUsers(data);
      setCount(count)
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, sortField, sortDir, query]);

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, sortField, sortDir, count, query, fetchUsers]);

  const zipCounts = users.reduce((acc, user) => {
    const zip = user.zip_code || "N/A";
    acc[zip] = (acc[zip] || 0) + 1;
    return acc;
  }, {});

  // const incompleteUsers = users.filter(
  //   (u) => !u.first_name || !u.last_name || !u.zip_code || !u.email || !u.city,
  // );
  //
  // const duplicates = {
  //   emails: users
  //     .map((u) => u.email)
  //     .filter((email, i, arr) => arr.indexOf(email) !== i),
  //   zips: users
  //     .map((u) => u.zip_code)
  //     .filter((z, i, arr) => arr.indexOf(z) !== i && z),
  // };
  //
  // const recentUsers = users.filter((u) => {
  //   const dob = new Date(u.dob);
  //   const now = new Date();
  //   const diff = now - dob;
  //   return diff < 7 * 24 * 60 * 60 * 1000;
  // });

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
          <div className="d-flex flex-column flex-md-row gap-2">
            <Button variant="secondary" onClick={exportCSV}>
              Export Users CSV
            </Button>
            <Button variant="secondary" onClick={exportZipSummary}>
              Export ZIP Summary
            </Button>
          </div>
        </div>

        <Form className="mb-3 d-flex flex-column flex-md-row gap-2" onSubmit={ev => ev.preventDefault()}>
          <Form.Control
            type="text"
            placeholder="Search ..."
            className="w-75"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === "Enter" ? setQuery(searchTerm) : undefined}
          />
          <Form.Select
            value={viewMode}
            className="w-25"
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="table">Table View</option>
            <option value="group">ZIP Summary</option>
            <option value="chart">ZIP Chart</option>
          </Form.Select>
        </Form>

        {isLoading
          ? (
            <div className="text-light text-center my-4">
              <span className="spinner-border text-warning"></span>
              <p>Loading users...</p>
            </div>
          )
          : (
            <>
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
                  <CustomTable data={users} columns={columns} sorting={sorting} paging={paging} />
                </div>
              )}
            </>
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
    </div>
  );
}
