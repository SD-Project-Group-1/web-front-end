import styles from "../profile.module.scss";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";

export default function UserProfile({ user }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  user.id = user.id ?? user.user_id;

  const [userUpdate, setUserUpdate] = useState({
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    street_address: user.street_address,
    city: user.city,
    state: user.state,
    zip_code: user.zip_code,
    dob: user.dob,
    is_verified: user.is_verified
  });

  const logout = async () => {
    await fetch("/api/signout", { method: "POST" });
    setUser(null);
    navigate("/");
  };

  const startReset = async () => {
    const response = await fetch("/api/auth/request-reset", {
      method: "POST",
      body: JSON.stringify({ email: user.email }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error(response);
      alert("Could not make reset request!");
      return;
    }

    alert("Reset sent. Please check your email: " + user.email);
  }

  const updateUser = async () => {
    const response = await fetch(`/api/user/update/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify(userUpdate),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.error(response, await response.text());
      alert("Could not update user!");
      return;
    }

    alert("User updated!");
  }

  const deleteAccount = async () => {
    try {
      const hasRequest = await fetch(`api/borrow/requested/${user.id}`, {
        method: "GET",
      });

      if (hasRequest == null) {
        alert("Cannot delete account with active request");
        return;
      }

      const responce = await fetch(`api/user/delete/${user.id}`, {
        method: "DELETE",
      });

      if (!responce.ok) {
        alert("An error has occured while trying to delete account.");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  console.log(user);

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles["user-card"]}`}>
        <h1>{user.first_name} {user.last_name}</h1>
        <p>UserID: {user.id}</p>
        <p>{user.phone}</p>
        <p>{user.email}</p>
        <p>
          Age: {new Date(Date.now()).getFullYear() -
            new Date(user.dob).getFullYear()}
        </p>
        <address>
          {user.street_address},<br />
          {user.city}, {user.state}<br />
          {user.zip_code}
        </address>
      </div>
      <div className={`${styles["user-fields"]}`}>
        <h1>Profile Information</h1>
        <Form>
          <Row className="g-5">
            <Col md={6}>
              <Form.Label>First name</Form.Label>
              <Form.Control type="text" name="firstName" value={userUpdate.first_name} className="bg-white text-black"
                onChange={x => setUserUpdate({ ...userUpdate, first_name: x.target.value })} />
            </Col>

            <Col md={6}>
              <Form.Label>Last name</Form.Label>
              <Form.Control type="text" name="lastName" value={userUpdate.last_name} className="bg-white text-black"
                onChange={x => setUserUpdate({ ...userUpdate, last_name: x.target.value })} />
            </Col>

            <Col md={6}>
              <Form.Label>Number</Form.Label>
              <Form.Control name="number" type="text" value={userUpdate.phone} className="bg-white text-black"
                onChange={x => setUserUpdate({ ...userUpdate, phone: x.target.value })} />
            </Col>

            <Col md={6}>
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" value={userUpdate.email} className="bg-white text-black"
                onChange={x => setUserUpdate({ ...userUpdate, email: x.target.value })} />
            </Col>

            <Col md={6}>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control name="dob" type="date" value={new Date(userUpdate.dob).toISOString().split('T')[0]} className="bg-white text-black"
                onChange={x => setUserUpdate({ ...userUpdate, dob: new Date(x.target.value).toISOString().split('T')[0] })} />
            </Col>

            <Col md={6}>
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={userUpdate.street_address} className="bg-white text-black"
                onChange={x => setUserUpdate({ ...userUpdate, street_address: x.target.value })} />
            </Col>

            <Col md={12} className="d-flex gap-3">
              <Form.Label>Is Verified: </Form.Label>
              <input type="checkbox" name="is_verified" value={userUpdate.is_verified} className="cb"
                onChange={x => setUserUpdate({ ...userUpdate, is_verified: x.target.value })} />
            </Col>


            <Col md={6} className="d-flex gap-3">
              <Button onClick={updateUser}>Update info</Button>
            </Col>
          </Row>
        </Form>
        <div className={`${styles.actions}`}>
          <h1>Account Actions</h1>
          <Button onClick={startReset}>Reset Password</Button>
          <Button onClick={logout}>Logout</Button>
          <Button onClick={deleteAccount}>Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
