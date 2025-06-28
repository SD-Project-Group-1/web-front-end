import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/home/home";
import Login from "./routes/login/login";
import Profile from "./routes/profile/profile";
import Request from "./routes/request/request";
import Signup from "./routes/signup/signup";
import Data from "./routes/admin/data/data";
import Manage from "./routes/admin/manage/manage";
import AdminProfile from "./routes/admin/profile/profile";
import Profiles from "./routes/admin/profiles/profiles";
import Requests from "./routes/admin/requests/requests";
import Panel from "./routes/admin/panel/panel";
import AdminLogin from "./routes/admin/login/login";
import AdminNavbar from "./shared/adminNavbar/adminNavbar";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/request" element={<Request />} />
      <Route path="/profile" element={<Profile />} />

      {/* Admin Routes */}
      <Route path="admin" element={<AdminNavbar />}>
        {/* TODO: Add layout for navbar */}
        <Route index element={<Panel />} />
        <Route path="data" element={<Data />} />
        <Route path="manage" element={<Manage />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="profiles" element={<Profiles />} />
        <Route path="requests" element={<Requests />} />
        <Route path="login" element={<AdminLogin />} />
      </Route>
    </Routes>
  );
}

export default App;
