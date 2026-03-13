import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export const ProtectedRoute = ({ roles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && (!user || !roles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

