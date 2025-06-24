import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Table } from "react-bootstrap";
import styles from "./panel.module.scss";

function Panel() {
  const [hideVid, setHideVid] = useState(false);
  const [devRequests, setDevRequests] = useState([]);
  const [devStatus, setDevStatus] = useState([]);

  useEffect(() => {
    populateFakeData();
  }, []);

  function populateFakeData() {
    const fakeRequests = [
      { first: "Alice", last: "Johnson", device: "Laptop A123" },
      { first: "Bob", last: "Smith", device: "Tablet T456" },
      { first: "Carol", last: "Lee", device: "Phone P789" },
      { first: "David", last: "Kim", device: "Laptop X234" },
      { first: "Eve", last: "Nguyen", device: "Tablet Z987" },
    ];

    const fakeStatuses = [
      {
        id: "A123",
        name: "Laptop A123",
        status: "Online",
        lastCondition: "Normal",
      },
      {
        id: "T456",
        name: "Tablet T456",
        status: "Offline",
        lastCondition: "Battery Low",
      },
      {
        id: "P789",
        name: "Phone P789",
        status: "Online",
        lastCondition: "Normal",
      },
      {
        id: "X234",
        name: "Laptop X234",
        status: "Maintenance",
        lastCondition: "Overheated",
      },
      {
        id: "Z987",
        name: "Tablet Z987",
        status: "Online",
        lastCondition: "Normal",
      },
    ];

    setDevRequests(fakeRequests);
    setDevStatus(fakeStatuses);
  }

  return (
    <Container>
      <div className={`${styles.container}`}>
        <h1>Admin Panel</h1>
        {!hideVid &&
          (
            <div>
              <h3>Tutorial Video</h3>
              <video src="https://files.theneil.zone/bsof.mp4" />
            </div>
          )}
        <div>
          <h3>Dashboard</h3>
          <h4>Device Requests</h4>
          <Table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Device</th>
              </tr>
            </thead>
            <tbody>
              {devRequests.map((req, k) => (
                <tr key={k}>
                  <td>{req.first}</td>
                  <td>{req.last}</td>
                  <td>{req.device}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h4>Device Status</h4>
          <Table>
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Device Name</th>
                <th>Status</th>
                <th>Last Condition</th>
              </tr>
            </thead>
            <tbody>
              {devStatus.map((stat, k) => (
                <tr key={k}>
                  <td>{stat.id}</td>
                  <td>{stat.name}</td>
                  <td>{stat.status}</td>
                  <td>{stat.lastCondition}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
}

export default Panel;

