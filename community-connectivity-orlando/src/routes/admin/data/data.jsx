import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import styles from "../../home/home.module.scss";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import "chart.js/auto";

export default function AdminData() {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZip, setSelectedZip] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userRes, deviceRes, locationRes, borrowRes] = await Promise.all([
          fetch("/api/user/getall", { credentials: "include" }),
          fetch("/api/devices/getall", { credentials: "include" }),
          fetch("/api/locations/getall?includeDevices=true", { credentials: "include" }),
          fetch("/api/borrow/getall", { credentials: "include" }),
        ]);

        const [userData, deviceData, locationData, borrowData] = await Promise.all([
          userRes.json(),
          deviceRes.json(),
          locationRes.json(),
          borrowRes.json(),
        ]);

        setUsers(userData.data || []);
        setDevices(deviceData.data || []);
        setLocations(locationData.data || []);
        setBorrows(borrowData.data || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportCSV = (label, data) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const rows = data.map((d) => headers.map((h) => `"${d[h] || ""}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${label}.csv`;
    link.click();
  };

  const exportZipSummary = () => {
    const zipMap = {};
    users.forEach((u) => {
      const key = `${u.zip_code || "N/A"} - ${u.role || "unknown"}`;
      zipMap[key] = (zipMap[key] || 0) + 1;
    });
    const rows = Object.entries(zipMap).map(([key, value]) => `${key},${value}`);
    const csv = ["ZIP+Role,Count", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zip_role_summary.csv";
    link.click();
  };

  const zipOptions = [...new Set(users.map((u) => u.zip_code).filter(Boolean))];
  const filteredUsers = selectedZip === "All" ? users : users.filter((u) => u.zip_code === selectedZip);

  const zipRoleCounts = filteredUsers.reduce((acc, u) => {
    const key = `${u.zip_code || "N/A"} - ${u.role || "user"}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const filteredBorrows = selectedZip === "All" ? borrows : borrows.filter(x => x.user.zip_code === selectedZip);

  const pieData = {
    labels: Object.keys(zipRoleCounts),
    datasets: [
      {
        data: Object.values(zipRoleCounts),
        backgroundColor: Object.keys(zipRoleCounts).map(
          (_, i) => `hsl(${(i * 360) / Object.keys(zipRoleCounts).length}, 70%, 60%)`
        ),
      },
    ],
  };

  const checkedInCounts = filteredBorrows
    .filter((b) => b.borrow_status === "Checked_in" && b.device?.brand)
    .reduce((acc, b) => {
      const key = b.device.brand;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const checkedOutCounts = filteredBorrows
    .filter((b) => b.borrow_status === "Checked_out" && b.device?.brand)
    .reduce((acc, b) => {
      const key = b.device.brand;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const conditionCounts = filteredBorrows
    .reduce((acc, b) => {
      const cond = b.device_return_condition || "Unknown";
      acc[cond] = (acc[cond] || 0) + 1;
      return acc;
    }, {});

  const lateReturns = filteredBorrows
    .filter((b) => b.borrow_status === "Late")
    .reduce((acc, b) => {
      const date = new Date(b.borrow_date).toLocaleDateString("en-US", {
        timeZone: "America/New_York",
      });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const trends = filteredBorrows.reduce((acc, b) => {
    const date = new Date(b.borrow_date).toLocaleDateString("en-US", {
      timeZone: "America/New_York",
    });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const defaultChartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true }, title: { display: true, text: title } },
    scales: { y: { beginAtZero: true } },
  });

  return (
    <div className={styles["admin-page"]}>
      <Container className="my-4">
        <h2 className={styles["page-title"]}>Data Dashboard</h2>

        {isLoading ? (
          <div className="text-center text-light my-4">
            <span className="spinner-border text-warning"></span>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <Row className="g-3">
              <Col md={4}>
                <Form.Select
                  value={selectedZip}
                  onChange={(e) => setSelectedZip(e.target.value)}
                >
                  <option value="All">All ZIPs</option>
                  {zipOptions.map((zip) => (
                    <option key={zip}>{zip}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className="d-flex gap-2 justify-content-md-end mt-2 mt-md-0 overflow-scroll">
                <Button variant="secondary" onClick={() => exportCSV("users", users)}>Export Users</Button>
                <Button variant="secondary" onClick={() => exportCSV("devices", devices)}>Export Devices</Button>
                <Button variant="secondary" onClick={() => exportCSV("locations", locations)}>Export Locations</Button>
                <Button variant="secondary" onClick={exportZipSummary}>Export ZIP Summary</Button>
              </Col>
              <Col md={6} style={{ height: "400px" }}>
                <Card className="bg-dark text-white mb-4 h-100">
                  <Card.Body>
                    <Pie data={pieData} options={defaultChartOptions("User ZIP+Role Distribution")} />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} style={{ height: "400px" }}>
                <Card className="bg-dark text-white mb-4 h-100">
                  <Card.Body>
                    <Pie
                      data={{
                        labels: Object.keys(conditionCounts),
                        datasets: [
                          {
                            data: Object.values(conditionCounts),
                            backgroundColor: ["#27ae60", "#f39c12", "#c0392b", "#7f8c8d"],
                          },
                        ],
                      }}
                      options={defaultChartOptions("Device Condition Summary")}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} style={{ height: "400px" }}>
                <Card className="bg-dark text-white mb-4 h-100">
                  <Card.Body>
                    <Line
                      data={{
                        labels: Object.keys(trends),
                        datasets: [
                          {
                            label: "Borrows",
                            data: Object.values(trends),
                            fill: false,
                            borderColor: "#2980b9",
                          },
                        ],
                      }}
                      options={defaultChartOptions("Borrow Trend (Daily)")}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} style={{ height: "400px" }}>
                <Card className="bg-dark text-white mb-4 h-100">
                  <Card.Body>
                    <Bar
                      data={{
                        labels: Object.keys(lateReturns),
                        datasets: [
                          {
                            label: "Late",
                            data: Object.values(lateReturns),
                            backgroundColor: "#e74c3c",
                          },
                        ],
                      }}
                      options={defaultChartOptions("Late Returns")}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} style={{ height: "400px" }}>
                <Card className="bg-dark text-white mb-4 h-100">
                  <Card.Body>
                    <Bar
                      data={{
                        labels: Object.keys(checkedInCounts),
                        datasets: [
                          {
                            label: "Checked In",
                            data: Object.values(checkedInCounts),
                            backgroundColor: "#27ae60",
                          },
                        ],
                      }}
                      options={defaultChartOptions("Checked In Devices by Brand")}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} style={{ height: "400px" }}>
                <Card className="bg-dark text-white mb-4 h-100">
                  <Card.Body>
                    <Bar
                      data={{
                        labels: Object.keys(checkedOutCounts),
                        datasets: [
                          {
                            label: "Checked Out",
                            data: Object.values(checkedOutCounts),
                            backgroundColor: "#e67e22",
                          },
                        ],
                      }}
                      options={defaultChartOptions("Checked Out Devices by Brand")}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}
