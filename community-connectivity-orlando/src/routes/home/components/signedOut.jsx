import { Button } from "react-bootstrap";
import styles from "../home.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SignedOut() {
  const [zip, setZip] = useState("");

  const checkZipCode = async () => {
    // const payLoad = {
    //   zip_code: zip
    // };
    // const response = await fetch("/api/zipcode/check", {
    //   method: "POST",
    //   body: JSON.stringify(payLoad),
    //   headers: [["Content-Type", "application/json"]]
    // });


    alert("This route is a work in progess!");
  }

  return (
    <div>
      <h2>Check Eligible Area</h2>
      <div className={`${styles.eligable}`} >
        <input placeholder="ZIP Code" name="zip" value={zip} onChange={x => setZip(x.target.value)} />
        <Button onClick={checkZipCode}>Check</Button>
      </div>
      <h2>Make an account</h2>
      <div className={`${styles["make-account-box"]}`}>
        <p>
          All you need to get started is to make an account and provide some
          basic information.
        </p>
        <Link to={"/login"}>
          <Button>Sign Up</Button>
        </Link>
      </div>
    </div>
  );
}
