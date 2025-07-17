import styles from "../profile.module.scss";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function UserProfile({ user }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

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
          {user.city},<br />
          {user.zip_code}
        </address>
      </div>
      <div className={`${styles["user-fields"]}`}>
        <h1>Profile Information</h1>
        <div className={`${styles["data-fields-container"]}`}>
          <div className={`${styles["data-fields"]}`}>
            <div className={`${styles["field"]}`}>
              <label>First name</label>
              <input name="firstName" defaultValue={user.first_name} />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Last name</label>
              <input name="lastName" defaultValue={user.last_name} />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Number</label>
              <input name="number" type="number" defaultValue={user.phone} />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Email</label>
              <input name="email" type="email" defaultValue={user.email} />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Date of Birth</label>
              <input name="dob" type="date" defaultValue={new Date(user.dob)} />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Address</label>
              <input name="address" defaultValue={user.street_address} />
            </div>
          </div>
          <Button>Update info</Button>
        </div>
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
