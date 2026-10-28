"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header
      style={{
        background: "var(--card-bg)",
        borderBottom: "1px solid var(--border)",
        padding: "1rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          onClick={() => router.push("/")}
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "var(--primary)",
          }}
        >
          SQA Social Media
        </h1>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Button
                variant="secondary"
                onClick={() => router.push("/auth/liked")}
                style={{ padding: "0.5rem 1rem" }}
              >
                Posts Curtidos
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                style={{ padding: "0.5rem 1rem" }}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => router.push("/signin")}
                style={{ padding: "0.5rem 1rem" }}
              >
                Entrar
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                style={{ padding: "0.5rem 1rem" }}
              >
                Criar Conta
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
