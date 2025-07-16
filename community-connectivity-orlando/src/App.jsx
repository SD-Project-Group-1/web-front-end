import "./App.css";
import { Route, Routes } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

import Home from "./routes/home/home";
import Login from "./routes/login/login";
import Profile from "./routes/profile/profile";
import RequestReset from "./routes/reset/requestReset/requestReset";
import Reset from "./routes/reset/reset/reset";
import Signup from "./routes/signup/signup";
import Data from "./routes/admin/data/data";
import Manage from "./routes/admin/manage/manage";
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
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/profile/:adminId" element={<Profile />} />
      <Route path="/reset/request-reset" element={<RequestReset />} />
      <Route path="/reset-password" element={<Reset />} />
      {/* <Route path="/admin/reset-password" element={<AdminReset />} /> */}
      <Route path="/profile/:userId" element={<Profile />} />

      {/* Admin Routes */}
      <Route path="admin/login" element={<AdminLogin />} />
      {/* Adming login can't have the admin navbar lol */}
      <Route path="admin" element={<AdminNavbar />}>
        <Route index element={<Panel />} />
        <Route path="data" element={<Data />} />
        <Route path="manage" element={<Manage />} />
        <Route path="profiles" element={<Profiles />} />
        <Route path="requests" element={<Requests />} />
      </Route>
    </Routes>
  );
}

export default App;
