import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Table,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import UserNavbar from "../../home/components/userNavbar";
import styles from "../../home/home.module.scss";

export default function Profile() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newRole, setNewRole] = useState("Manager");
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Manager",
  });

  useEffect(() => {
    const fetchData = async () => {
      const adminRes = await fetch("/api/admin", { credentials: "include" });
      const userRes = await fetch("/api/user", { credentials: "include" });
      setAdmins(await adminRes.json());
      setUsers(await userRes.json());
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    await fetch(`/api/user/${selectedUser.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setShowDeleteModal(false);
  };

  const handleReassign = async () => {
    await fetch(`/api/admin/${selectedAdmin.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role: newRole }),
    });
    setShowReassignModal(false);
  };

  const handleAddAdmin = async () => {
    await fetch("/api/admin/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newAdmin),
    });
    setShowAddModal(false);
  };

  return (
    <div className={styles["admin-page"]}>
      <UserNavbar signedIn />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className={styles["page-title"]}>Profiles</h2>
          <Button onClick={() => setShowAddModal(true)} variant="warning">
            Add Admin
          </Button>
        </div>

        <h4 className="text-light">Admins</h4>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Store</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.firstName}</td>
                <td>{admin.lastName}</td>
                <td>{admin.store || "N/A"}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setShowReassignModal(true);
                    }}
                  >
                    Reassign
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h4 className="text-light mt-4">Users</h4>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>User ID</th>
              <th>First</th>
              <th>Last</th>
              <th>Zip</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.zip || "N/A"}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>
            {selectedUser?.firstName} {selectedUser?.lastName}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleDelete}>
            Yes
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reassign Modal */}
      <Modal show={showReassignModal} onHide={() => setShowReassignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reassign Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            What role will you assign to{" "}
            <strong>
              {selectedAdmin?.firstName} {selectedAdmin?.lastName}
            </strong>
            ?
          </p>
          <Form.Select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Admin">Admin</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleReassign}>
            Assign
          </Button>
          <Button variant="secondary" onClick={() => setShowReassignModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Admin Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please provide the credentials for this admin.</p>
          <Form>
            <Row className="mb-2">
              <Col>
                <Form.Control
                  placeholder="First Name"
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, firstName: e.target.value })
                  }
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Last Name"
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, lastName: e.target.value })
                  }
                />
              </Col>
            </Row>
            <Form.Control
              placeholder="Email"
              type="email"
              className="mb-2"
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
            />
            <Form.Select
              className="mb-2"
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, role: e.target.value })
              }
              value={newAdmin.role}
            >
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleAddAdmin}>
            Assign
          </Button>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
