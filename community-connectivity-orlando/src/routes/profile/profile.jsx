import { useContext } from "react";

import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import UserProfile from "./components/userProfile";
import AdminProfile from "./components/adminProfile";

function Profile() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  if (loading) {
    return <></>;
  }

  if (user === null) {
    navigate("/");
    return;
  }

  if (user?.role && user.role !== "user") {
    return <AdminProfile admin={user} />;
  } else {
    return <UserProfile user={user} />;
  }
}

export default Profile;
