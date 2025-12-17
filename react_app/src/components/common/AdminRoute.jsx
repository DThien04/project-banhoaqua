import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "~/features/auth/authStorage";

export default function AdminRoute() {
  const token = authStorage.get();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) return <Navigate to="/login" replace />;

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}


