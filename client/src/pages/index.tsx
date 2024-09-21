import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Books from "@/pages/books";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated && storedAuth !== "true") {
      router.push("/signup");
    }
  }, [isAuthenticated, router]);

  return <Books />;
}
