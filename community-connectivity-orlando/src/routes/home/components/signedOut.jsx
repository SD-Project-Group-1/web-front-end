import { Button, Form } from "react-bootstrap";
import styles from "../home.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SignedOut() {
  const [zip, setZip] = useState("");

  const [text, setText] = useState("");
  const [within, setWithin] = useState(null);

  const checkZipCode = async () => {
    const payLoad = {
      zip_code: zip
    };
    const response = await fetch("/api/zipcode/check", {
      method: "POST",
      body: JSON.stringify(payLoad),
      headers: [["Content-Type", "application/json"]]
    });

    if (!response.ok) {
      console.error(response, await response.text());
      alert("request failed!");
      return;
    }

    const { withinRange } = await response.json();

    if (withinRange) {
      setWithin(true);
      setText("You are within range!");
    } else {
      setWithin(false);
      setText("You are not within range.");
    }

    setTimeout(() => {
      setWithin(null);
      setText("");
    }, 3000);
  }

  return (
    <div>
      <h2>Check Eligible Area</h2>
      {text === "" ? (

        <Form className={`${styles.zipCheckContainer}`} onSubmit={ev => ev.preventDefault() || checkZipCode()}>
          <input placeholder="ZIP Code" name="zip" value={zip} onChange={x => setZip(x.target.value)} />
          <Button onClick={checkZipCode}>Check</Button>
        </Form>
      ) : (
        <p className={`${within ? "text-success" : "text-danger"} w-100 text-center fs-2 fw-bold`}>{text}</p>
      )}
      <h2>Make an account</h2>
      <div className="">
        <p>
          All you need to get started is to make an account and provide some
          basic information.
        </p>
        <Link to={"/signup"}>
          <div className="w-100 d-flex justify-content-center">
            <Button className="fs-1 fw-bold">Sign Up</Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
