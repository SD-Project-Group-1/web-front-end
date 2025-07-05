import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import "./signup.scss";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

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

  const handleSubmitFirst = async (e) => {
    e.preventDefault();
    console.log("page submitted");
    setNextFormFlag(true);
  };

  const handleSubmitSecond = async (e) => {
    e.preventDefault();
    console.log("page submitted");
    const formObject = {
      firstName: formFName,
      lastName: formLName,
      email: formEmail,
      password: formPassword,
      dob: formDOB,
      phone: formPhoneNum,
      address1: formAddress1,
      address2: formAddress2,
      city: formCity,
      state: formState,
      zip: formZip,
    };

    const payload = {
      email: formObject.email,
      password: formObject.password,
      first_name: formObject.firstName,
      last_name: formObject.lastName,
      phone: formObject.phone,
      street_address: formObject.address1,
      city: formObject.city,
      state: formObject.state,
      zip_code: formObject.zip,
      dob: formObject.dob,
    };

    console.log(payload);

    const response = await fetch(
      `api/user/create`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: [["Content-Type", "application/json"]],
      },
    );

    if (response.ok) {
      console.log("Yippeeeee");
      navigate("/login");
    }
  };

  return (
    <div>
      <div className={`signup-wrapper ${nextFormFlag ? `hidden` : ``}`}>
        <Card className="signup-card">
          <Card.Body className="color">
            <div className="text-cener mb-2">
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
                      placeholder="First Name"
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
                      placeholder="Email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-4" controlId="formLName">
                    <Form.Label className="white">Last Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Last Name"
                      value={formLName}
                      onChange={(e) => setFormLName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label className="white">Password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Password"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-4" controlId="formDOB">
                    <Form.Label className="white">DOB</Form.Label>
                    <Form.Control
                      required
                      type="date"
                      placeholder="Date of Birth"
                      value={formDOB}
                      onChange={(e) => setFormDOB(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4" controlId="formPhoneNum">
                    <Form.Label className="white">Phone Number</Form.Label>
                    <Form.Control
                      required
                      type="tel"
                      placeholder="Phone Number"
                      value={formPhoneNum}
                      onChange={(e) => setFormPhoneNum(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                {/* I'm lazy */}
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col>
                  <Button type="submit" className="w-100 btn-color">
                    <strong>Next</strong>
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
      <div className={`signup-wrapper ${!nextFormFlag ? `hidden` : ``}`}>
        <Card className="signup-card">
          <Card.Body className="color">
            <div className="text-cener mb-2">
              <Card.Title>Orlando City Table Rentals</Card.Title>
              <Card.Subtitle className="mb-2">
                Step 2: Additional Info
              </Card.Subtitle>
            </div>
            <Form onSubmit={handleSubmitSecond}>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="white">Street Address 1</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Street Address 1"
                      value={formAddress1}
                      onChange={(e) => setFormAddress1(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="white">Street Address 2</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Street Address 2"
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
                      type="text"
                      placeholder="City"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="white">State</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="State"
                      value={formState}
                      onChange={(e) => setFormState(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="white">Zip Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Zip Code"
                      value={formZip}
                      onChange={(e) => setFormZip(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col></Col>
              </Row>
              <Row>
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col>
                  <Button type="submit" className="w-100 btn-color">
                    <strong>Finish</strong>
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Signup;
