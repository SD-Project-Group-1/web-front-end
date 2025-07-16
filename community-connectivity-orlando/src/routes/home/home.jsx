import styles from "./home.module.scss";
import SignedOut from "./components/signedOut";
import { useContext, useState } from "react";
import { useEffect } from "react";
import UserNavbar from "./components/userNavbar";
import SignedIn from "./components/signedIn";
import Request from "./components/request";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [request, setRequest] = useState(null);
  const [afterEl, setAfterEl] = useState(<SignedOut />);

  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role && user.role !== "user") {
      navigate("/admin");
      return;
    }

    const getRequest = async () => {
      if (loading || !user) return;

      const response = await fetch(`/api/borrow/requested/${user.id}`);

      if (!response.ok) {
        console.error(response, await response.text());
        alert("Failed to get the request");
        return;
      }

      setRequest(await response.json());
    }

    setSignedIn(user !== null);

    if (user && request) {
      setAfterEl(<Request request={request} />);
    } else if (user) {
      getRequest();
      setAfterEl(<SignedIn />);
    } else {
      setAfterEl(<SignedOut />);
    }
  }, [loading, user, request, navigate]);

  if (loading || user?.role !== undefined) {
    return <></>;
  }

  return (
    <Container className={`${styles.container}`}>
      <UserNavbar signedIn={signedIn} />
      <h1>Orlando City Connectivity Portal</h1>
      <p>
        If you have low internet coverage in your area and need a WiFi ready
        device, then you’re in the right place! If you are in an eligible area,
        Orlando City will provide you with a free-to-rent device to offset the
        low internet coverage in your area. Simply create an account, complete a
        form, and come pick up your device on your scheduled date!
      </p>
      {afterEl}
    </Container>
  );
}

export default Home;
