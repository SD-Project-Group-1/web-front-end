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

export default function AdminProfiles() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
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
    { text: "Verified", dataField: "is_verified", formatter: (user) => user.is_verified ? "✅" : "❌" },
    {
      noSort: true,
      text: "Actions",
      formatter: (user) => (
        <>
          <Button
            size="sm"
            variant="outline-success"
            disabled={user.is_verified}
            onClick={() => handleVerify(user.user_id)}
          >
            Verify
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
      if (query && query !== "") urlParams.append("q", query);

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
  }, [page, pageSize, sortField, sortDir, query, fetchUsers]);

  const handleDelete = async () => {
    await fetch(`/api/user/delete/${selectedUser.user_id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setUsers(users.filter((u) => u.user_id !== selectedUser.user_id));
    setShowDeleteModal(false);
  };

  const handleVerify = async (userId) => {
    try {
      await fetch(`/api/user/update/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_verified: true }),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, is_verified: true } : u
        )
      );
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  const zipCounts = users.reduce((acc, user) => {
    const zip = user.zip_code || "N/A";
    acc[zip] = (acc[zip] || 0) + 1;
    return acc;
  }, {});

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

  const exportCSV = () => {
    const headers = [
      "user_id",
      "first_name",
      "last_name",
      "email",
      "zip_code",
      "is_verified",
    ];
    const rows = users.map((u) =>
      headers.map((f) => `"${u[f] ?? ""}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "verified_users.csv";
    link.click();
  };

  return (
    <div className={styles["admin-page"]}>
      <Container className="mt-4">
        <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
          <h2 className={styles["page-title"]}>User Verification</h2>
          <Button variant="secondary" onClick={exportCSV}>
            Export CSV
          </Button>
        </div>

        <Form
          className="mb-3 d-flex gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <Form.Control
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQuery(searchTerm)}
          />
          <Form.Select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="table">Table View</option>
            <option value="chart">ZIP Chart</option>
          </Form.Select>
        </Form>

        {isLoading ? (
          <p className="text-light">Loading...</p>
        ) : viewMode === "table" ? (
          <CustomTable
            data={users}
            columns={columns}
            sorting={sorting}
            paging={paging}
          />
        ) : (
          <Card className="bg-dark text-white">
            <Card.Body>
              <h5>ZIP Distribution</h5>
              <Bar data={zipBarData} />
            </Card.Body>
          </Card>
        )}
      </Container>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {" "}
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
    </div>
  );
}
