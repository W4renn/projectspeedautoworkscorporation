import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" />;

  return children;
}
