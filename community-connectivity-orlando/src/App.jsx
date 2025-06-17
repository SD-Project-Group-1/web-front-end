import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from "./routes/home/home"
import Login from './routes/login/login';
import Profile from './routes/profile/profile';
import Request from './routes/request/request';
import Signup from './routes/signup/signup';
import Data from "./routes/admin/data/data";
import Manage from "./routes/admin/manage/manage";
import Profile from './routes/admin/profile/profile';
import Profiles from './routes/admin/profiles/profiles';
import Requests from './routes/admin/requests/requests';
import Panel from "./routes/admin/panel/panel";
import AdminLogin from "./routes/admin/login/login";

function App() {
  return (
    <Routes>
      <Route path="/">
      <Route index element={<Home/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/request" element={<Request/>}/>
      <Route path="/profile" element={<Profile/>}/>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <Route index element={<Panel/>}/>
        <Route path="/data" element={<Data/>}/>
        <Route path="/manage" element={<Manage/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/profiles" element={<Requests/>}/>
        <Route path="/login" element={<AdminLogin/>}/>
      </Route>
    </Routes>
  );
}

export default App;
