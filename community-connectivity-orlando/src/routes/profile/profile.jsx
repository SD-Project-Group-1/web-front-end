import { useContext } from "react";

import styles from "./profile.module.scss";
import { Button } from "react-bootstrap";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, setUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    await fetch("/api/signout", { method: "POST" });
    setUser(null);
    navigate("/");
  };

  if (loading) {
    return <h1>Please wait...</h1>;
  }

  if (user === null) {
    navigate("/");
    return;
  }

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles["user-card"]}`}>
        <h1>{user.first_name} {user.last_name}</h1>
        <p>UserID: {user.id}</p>
        <p>{user.phone}</p>
        <p>{user.email}</p>
        <p>Age: {user.dob}</p>
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
          <Button>Reset Password</Button>
          <Button onClick={logout}>Logout</Button>
          <Button>Delete Account</Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
