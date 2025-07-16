import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import styles from "./panel.module.scss";
import { Link } from "react-router-dom";
import CustomTable from "../../../components/table/customTable";

function Panel() {
  const [hideVid, setHideVid] = useState(false);
  const [devRequests, setDevRequests] = useState([]);
  const [devStatus, setDevStatus] = useState([]);

  useEffect(() => {
    setHideVid(sessionStorage.getItem("hideVid") === "true");
    // populateFakeData();
    populateDevices();
    populateRequests();
  }, []);

  const devColumns = [
    { text: "Device ID", dataField: "id" },
    { text: "Device Name", dataField: "name" },
    { text: "Status", dataField: "status" },
    { text: "Last Condition", dataField: "lastCondition" },
  ];

  const populateDevices = async () => {
    try {
      const urlParams = new URLSearchParams();

      urlParams.append("page", 1);
      urlParams.append("pageSize", 5);
      urlParams.append("sortBy", "created");
      urlParams.append("sortDir", "desc");

      const response = await fetch(`/api/devices/getall?${urlParams}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("An error has occured");
        console.error(response, await response.text());
        alert("Could not get data.");
      }

      const { data } = await response.json();
      let statusData = [];
      // Add logic to make the status more readable EG remove the underscores
      for (let i = 0; i < data.length; i++) {
        statusData[i] = {
          id: data[i].serial_number,
          name: `${data[i].brand} ${data[i].make} ${data[i].model}`,
          status: data[i].borrow.at(0)?.borrow_status?.replace("_", " ") ?? " ",
          lastCondition:
            data[i].borrow.at(0)?.device_return_condition?.replace("_", " ") ??
              " ",
        };
      }
      setDevStatus(statusData);
    } catch (err) {
      console.error(err);
    }
  };

  const reqColumns = [
    { text: "First Name", dataField: "first" },
    { text: "Last Name", dataField: "last" },
    { text: "Device", dataField: "device" },
  ];

  const populateRequests = async () => {
    try {
      const urlParams = new URLSearchParams();

      urlParams.append("page", 1);
      urlParams.append("pageSize", 5);
      urlParams.append("sortBy", "created");
      urlParams.append("sortDir", "desc");

      const response = await fetch(`/api/borrow/getall?${urlParams}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("An error has occured");
        console.error(response, await response.text());
        alert("Could not get data.");
      }

      const { data } = await response.json();
      let requestData = [];

      for (let i = 0; i < data.length; i++) {
        requestData[i] = {
          first: data[i].user?.first_name,
          last: data[i].user?.last_name,
          device: data[i].device ? `${data[i].device.brand} ${data[i].device.make} ${data[i].device.model}` : "Not Set",
        };
      }
      setDevRequests(requestData);
    } catch (err) {
      console.error(err);
    }
  };

  const hideVideo = () => {
    setHideVid(true);
    sessionStorage.setItem("hideVid", "true");
  };

  const showVideo = () => {
    setHideVid(false);
    sessionStorage.setItem("hideVid", "false");
  };

  return (
    <Container>
      <div className={`${styles.container} `}>
        <h1>Admin Panel</h1>
        {!hideVid &&
          (
            <div>
              <h3>Tutorial Video</h3>
              <div className={`${styles["video-box"]} `}>
                <video src="https://files.theneil.zone/bsof.mp4" />
                <Button onClick={hideVideo}>Hide?</Button>
              </div>
            </div>
          )}
        {hideVid &&
          (
            <div>
              <Button onClick={showVideo}>Show?</Button>
            </div>
          )}
        <div>
          <h3>Dashboard</h3>
          <h4>
            <Link to="/admin/requests">Requests</Link>
          </h4>
          <div className={`${styles["table-container"]} `}>
            <CustomTable
              data={devRequests}
              columns={reqColumns}
              ellipsis={true}
            />
          </div>
          <h4>
            <Link to="/admin/manage">Device Status</Link>
          </h4>
          <div className={`${styles["table-container"]} `}>
            <CustomTable
              data={devStatus}
              columns={devColumns}
              ellipsis={true}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Panel;
