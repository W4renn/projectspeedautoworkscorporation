import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

type UserRole = "admin" | "staff" | "user";

export default function ProtectedRoute({ children, adminOnly = false, allowedRoles }: { children: React.ReactNode; adminOnly?: boolean; allowedRoles?: UserRole[] }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) return <Navigate to="/" />;

  return children;
}
