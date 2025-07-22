import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Modal,
} from "react-bootstrap";
import styles from "../../home/home.module.scss";
import CustomTable from "../../../components/table/customTable";
import { useTableState } from "../../../hooks/useTableState";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/userContext";

export default function Profile() {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const { user } = useContext(UserContext);

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
    if (user.role !== "staff")
      adminFetch("/api/admin/getall")
        .then(data => setAdmins(data))
        .catch(() => alert("Failed to fetch admin data!"));

    userFetch("/api/user/getall")
      .then(data => setUsers(data))
      .catch(() => alert("Failed to fetch user data!"));
  }, [adminFetch, userFetch, newAdmin, user.role]);

  return (
    <div className={styles["admin-page"]}>
      <Container className="mt-4">
        <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-start align-items-md-center mb-3">
          <h2 className={styles["page-title"]}>Profiles</h2>
        </div>

        <Form className="mb-3 d-flex flex-column flex-md-row gap-2" onSubmit={ev => ev.preventDefault()}>
          <Form.Control
            type="text"
            placeholder="Search..."
            className="w-75 text-black bg-white ph"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") userTableState.setQuery(searchTerm); adminTableState.setQuery(searchTerm) }}
          />
          <Button
            className="w-25 fw-bold"
            disabled={user.role === "staff"}
            onClick={() => setAdminModal(true)}
          >
            Add Admin
          </Button>
        </Form>

        <div className="table-responsive">
          {user.role !== "staff" && (
            <CustomTable data={admins} columns={adminColumns} sorting={adminTableState.sorting} paging={adminTableState.paging} />
          )}
          <CustomTable data={users} columns={columns} sorting={userTableState.sorting} paging={userTableState.paging} />
        </div>
      </Container>

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
