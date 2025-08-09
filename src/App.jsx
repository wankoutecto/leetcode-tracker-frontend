import { Navigate, Route, Routes} from "react-router-dom";
import { useAuth } from './AuthContext'
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FakeHomepage from "./pages/FakeHomepage";


export default function App(){
  const {token} = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={token ? <Homepage /> : <FakeHomepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}