import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./signup.scss";

function Signup() {
  const navigate = useNavigate();

  // Form state
  const [nextFormFlag, setNextFormFlag] = useState(false);
  const [formFName, setFormFName] = useState("");
  const [formLName, setFormLName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formDOB, setFormDOB] = useState("");
  const [formPhoneNum, setFormPhoneNum] = useState("");
  const [formAddress1, setFormAddress1] = useState("");
  const [formAddress2, setFormAddress2] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formState, setFormState] = useState("");
  const [formZip, setFormZip] = useState("");

  const handleSubmitFirst = (e) => {
    e.preventDefault();
    setNextFormFlag(true);
  };

  const handleSubmitSecond = async (e) => {
    e.preventDefault();

    if (!/^\d{5}(-\d{4})?$/.test(formZip)) {
      alert("Please enter a valid U.S. ZIP code.");
      return;
    }

    const payload = {
      email: formEmail,
      password: formPassword,
      first_name: formFName,
      last_name: formLName,
      phone: formPhoneNum,
      street_address: formAddress1,
      city: formCity,
      state: formState,
      zip_code: formZip,
      dob: new Date(formDOB),
    };
    console.log(payload);

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Signup failed:",
          errorData.message || response.statusText,
        );
        alert("Signup failed: " + (errorData.message || "Unexpected error"));
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("Network or server error:", err);
      alert(`An error has occured: ${err}`);
    }
  };

  return (
    <div>
      {/* Step 1 */}
      {!nextFormFlag && (
        <div className="signup-wrapper">
          <Card className="signup-card">
            <Card.Body className="color">
              <div className="text-center mb-2">
                <Card.Title>Orlando City Table Rentals</Card.Title>
                <Card.Subtitle className="mb-2">Register</Card.Subtitle>
              </div>
              <Form onSubmit={handleSubmitFirst}>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formFName">
                      <Form.Label className="white">First Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={formFName}
                        onChange={(e) => setFormFName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label className="white">Email</Form.Label>
                      <Form.Control
                        required
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formLName">
                      <Form.Label className="white">Last Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={formLName}
                        onChange={(e) => setFormLName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label className="white">Password</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formDOB">
                      <Form.Label className="white">DOB</Form.Label>
                      <Form.Control
                        required
                        type="date"
                        value={formDOB}
                        onChange={(e) => setFormDOB(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formPhoneNum">
                      <Form.Label className="white">Phone Number</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        value={formPhoneNum}
                        pattern="[0-9]{10}"
                        onChange={(e) => setFormPhoneNum(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="justify-content-end">
                  <Col xs="auto">
                    <Button type="submit" className="btn-color">
                      Next
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Step 2 */}
      {nextFormFlag && (
        <div className="signup-wrapper">
          <Card className="signup-card">
            <Card.Body className="color">
              <div className="text-center mb-2">
                <Card.Title>Orlando City Table Rentals</Card.Title>
                <Card.Subtitle className="mb-2">
                  Step 2: Additional Info
                </Card.Subtitle>
              </div>
              <Form onSubmit={handleSubmitSecond}>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="white">
                        Street Address 1
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={formAddress1}
                        onChange={(e) => setFormAddress1(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="white">
                        Street Address 2
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formAddress2}
                        onChange={(e) => setFormAddress2(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="white">City</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="white">State</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={formState}
                        onChange={(e) => {
                          if (e.target.value.length <= 2) {
                            setFormState(e.target.value);
                          }
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="white">Zip Code</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={formZip}
                        onChange={(e) => setFormZip(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="justify-content-end">
                  <Col xs="auto">
                    <Button type="submit" className="btn-color">
                      Finish
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Signup;
