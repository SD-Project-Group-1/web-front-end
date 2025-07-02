import { useContext, useEffect } from "react";

import { UserContext } from "../../context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import UserProfile from "./components/userProfile";
import AdminProfile from "./components/adminProfile";
import { useState } from "react";

function Profile() {
  const { userId, adminId } = useParams();
  const { user, loading } = useContext(UserContext);
  const [profileOf, setProfileOf] = useState(null);

  console.log(setProfileOf);

  const navigate = useNavigate();

  const setToAdminProfile = async (id) => {
    const response = await fetch(`/api/admin/get/${id}`);

    if (!response.ok) {
      alert("Could not get that profile!");
      setInterval(() => navigate("/"), 3000);
    }

    const data = response.json();
    setProfileOf(data);
  };

  const setToUserProfile = async (id) => {
    const response = await fetch(`/api/user/get/${id}`);

    if (!response.ok) {
      alert("Could not get that profile!");
      setInterval(() => navigate("/"), 3000);
    }

    const data = await response.json();

    setProfileOf(data);
  };

  useEffect(() => {
    if (!user) return;

    if (adminId) {
      if (user?.role !== "management") {
        navigate("/");
        return;
      }

      setToAdminProfile(adminId);
    } else if (userId) {
      if (!user?.role || user.role === "user") {
        navigate(`/`);
        return;
      }

      alert("AGGG");

      setToUserProfile(userId);
    } else {
      setProfileOf(user);
    }
  }, [user]);

  if (loading) {
    return <></>;
  }

  if (user === null) {
    navigate("/");
    return;
  }

  if (!profileOf) {
    return <></>;
  }

  if (profileOf?.role && profileOf.role !== "user") {
    return <AdminProfile admin={profileOf} />;
  } else {
    return <UserProfile user={profileOf} />;
  }
}

export default Profile;
