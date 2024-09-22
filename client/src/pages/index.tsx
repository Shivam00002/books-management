import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Books from "@/pages/books";
import ProtectedRoute from "@/components/ ProtectedRoute";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const storedAuth = localStorage.getItem("token");
    if (storedAuth === "true" && !isAuthenticated) {
    
    }
  }, [isAuthenticated]);

  return (
    <ProtectedRoute>
      <Books />
    </ProtectedRoute>
  );
}