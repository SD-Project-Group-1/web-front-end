import React from "react";

import styles from "./profile.module.scss";
import { Button } from "react-bootstrap";

function Profile() {
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles["user-card"]}`}>
        <h1>Real Name</h1>
        <p>UserID: 44345</p>
        <p>(000) 000-0000</p>
        <p>joeshmoe@gmail.com</p>
        <p>Age: 22</p>
        <address>
          1111 Generic st,<br />Winter Park,<br />424242
        </address>
      </div>
      <div className={`${styles["user-fields"]}`}>
        <h1>Profile Information</h1>
        <div className={`${styles["data-fields-container"]}`}>
          <div className={`${styles["data-fields"]}`}>
            <div className={`${styles["field"]}`}>
              <label>First name</label>
              <input name="firstName" />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Last name</label>
              <input name="lastName" />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Number</label>
              <input name="number" type="number" />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Email</label>
              <input name="email" type="email" />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Date of Birth</label>
              <input name="dob" type="date" />
            </div>
            <div className={`${styles["field"]}`}>
              <label>Address</label>
              <input name="address" />
            </div>
          </div>
          <Button>Update info</Button>
        </div>
        <div className={`${styles.actions}`}>
          <h1>Account Actions</h1>
          <Button>Reset Password</Button>
          <Button>Logout</Button>
          <Button>Delete Account</Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
