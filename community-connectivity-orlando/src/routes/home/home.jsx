import styles from "./home.module.scss";
import SignedOut from "./components/signedOut";
import { useState } from "react";
import { useEffect } from "react";
import UserNavbar from "./components/userNavbar";
import SignedIn from "./components/signedIn";
import Request from "./components/request";

function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    //Set signed in from cookies / API
    setSignedIn(false);
    //Set request from API
    setRequest(null);
  }, []);

  let afterEl;

  if (signedIn && request) {
    afterEl = <Request />;
  } else if (signedIn) {
    afterEl = <SignedIn />;
  } else {
    afterEl = <SignedOut />;
  }

  return (
    <div className={`${styles.container}`}>
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
    </div>
  );
}

export default Home;
