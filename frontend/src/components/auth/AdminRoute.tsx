import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log('AdminRoute check:', { isAuthenticated, userRole: user?.role });

  // Check if user is authenticated and has admin role
  // The role might be 'admin' or 'ADMIN' depending on the backend
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  if (!isAuthenticated || !isAdmin) {
    console.log('Access denied, redirecting to login');
    console.log('User role:', user?.role);
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  console.log('Access granted to admin route');

  return <>{children}</>;
};

export default AdminRoute;
