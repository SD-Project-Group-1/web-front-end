import { useContext } from "react";

import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import UserProfile from "./components/userProfile";
import AdminProfile from "./components/adminProfile";

function Profile() {
  const { user, setUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  if (loading) {
    return <h1>Please wait...</h1>;
  }

  if (user === null) {
    navigate("/");
    return;
  }

  if (user.role && user.role !== "user") {
    return <UserProfile user={user} />;
  } else {
    return <AdminProfile admin={user} />;
  }
}

export default Profile;
