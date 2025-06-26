// src/routes/admin/data/data.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import UserNavbar from "../../home/components/userNavbar";
import styles from "../../home/home.module.scss";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AdminData() {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [userRes, deviceRes, locationRes] = await Promise.all([
        fetch("/api/user", { credentials: "include" }),
        fetch("/api/devices", { credentials: "include" }),
        fetch("/api/locations", { credentials: "include" }),
      ]);

      const [userData, deviceData, locationData] = await Promise.all([
        userRes.json(),
        deviceRes.json(),
        locationRes.json(),
      ]);

      setUsers(userData);
      setDevices(deviceData);
      setLocations(locationData);
    };

    fetchData();
  }, []);

  const pieData = {
    labels: ["Admins", "Regular Users"],
    datasets: [
      {
        data: [
          users.filter((u) => u.role === "ADMIN").length,
          users.filter((u) => u.role !== "ADMIN").length,
        ],
        backgroundColor: ["#f39c12", "#3498db"],
      },
    ],
  };

  const lineData = {
    labels: ["Users", "Devices", "Locations"],
    datasets: [
      {
        label: "Counts",
        data: [users.length, devices.length, locations.length],
        borderColor: "#2ecc71",
        backgroundColor: "#27ae60",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className={styles["admin-page"]}>
      <UserNavbar signedIn />
      <Container className="mt-4">
        <h2 className={styles["page-title"]}>Data Dashboard</h2>
        <Row className="mt-4">
          <Col md={6}>
            <Card body className="bg-dark text-white">
              <h4>User Distribution</h4>
              <Pie data={pieData} />
            </Card>
          </Col>
          <Col md={6}>
            <Card body className="bg-dark text-white">
              <h4>Entities Overview</h4>
              <Line data={lineData} />
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
