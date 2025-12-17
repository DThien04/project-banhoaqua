import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "~/features/auth/authStorage";

export default function PrivateRoute() {
  console.log("Vào đến đây")
  const token = authStorage.get();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}




