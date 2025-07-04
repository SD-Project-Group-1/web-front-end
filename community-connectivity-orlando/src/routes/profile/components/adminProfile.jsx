import { Button } from "react-bootstrap";
import styles from "../profile.module.scss";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";

export default function AdminProfile({ admin }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const logout = async () => {
    await fetch("/api/signout", { method: "POST" });
    setUser(null);
    navigate("/");
  };

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles["user-card"]}`}>
        <h1>{admin.first_name} {admin.last_name}</h1>
        <p>AdminID: {admin.admin_id}</p>
        <p>{admin.email}</p>
      </div>
      <div className={`${styles["user-fields"]}`}>
        <h1>Profile Information</h1>
        <div className={`${styles["data-fields-container"]}`}>
          <div className={`${styles["data-fields"]}`}>
            <div className={`${styles["field"]}`}>
              <label>First name</label>
              <input name="firstName" defaultValue={admin.first_name} />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Last name</label>
              <input name="lastName" defaultValue={admin.last_name} />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Email</label>
              <input name="email" type="email" defaultValue={admin.email} />
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
