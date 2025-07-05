import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import styles from "./panel.module.scss";
import { Link } from "react-router-dom";

function Panel() {
  const [hideVid, setHideVid] = useState(false);
  const [devRequests, setDevRequests] = useState([]);
  const [devStatus, setDevStatus] = useState([]);

  useEffect(() => {
    setHideVid(sessionStorage.getItem("hideVid") === "true");
    populateFakeData();
    populateData();
  }, []);

  const populateData = async () => {
    try {
      const responce = await fetch("/api/devices/getall", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!responce.ok) {
        console.log("An error has occured");
      }

      const json = await responce.json();
      console.log(json);
      let statusData = [];
      for (let i = 0; i < json.length; i++) {
        statusData[i] = {
          id: json[i].serial_number,
          name: json[i].brand,
          status: "N/A",
          lastCondition: "N/A",
        };
      }
      setDevStatus(statusData);
    } catch (err) {
      console.log(err);
    }
  };

  const populateFakeData = () => {
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
  };

  const hideVideo = () => {
    setHideVid(true);
    sessionStorage.setItem("hideVid", "true");
  };

  return (
    <Container>
      <div className={`${styles.container}`}>
        <h1>Admin Panel</h1>
        {!hideVid &&
          (
            <div>
              <h3>Tutorial Video</h3>
              <div className={`${styles["video-box"]}`}>
                <video src="https://files.theneil.zone/bsof.mp4" />
                <Button onClick={hideVideo}>Hide?</Button>
              </div>
            </div>
          )}
        <div>
          <h3>Dashboard</h3>
          <h4>
            <Link to="/admin/requests">Device Requests</Link>
          </h4>
          <div className={`${styles["table-container"]}`}>
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
          </div>
          <h4>
            <Link to="/admin/manage">Device Status</Link>
          </h4>
          <div className={`${styles["table-container"]}`}>
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
      </div>
    </Container>
  );
}

export default Panel;
