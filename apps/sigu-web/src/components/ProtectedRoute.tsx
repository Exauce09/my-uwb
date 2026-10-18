import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Button } from "./ui/Button";

export function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { user, loading, isAdmin, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--sigu-muted)]">
        Chargement de la session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ring-1 ring-black/10">
          <img
            src="/brand/logo-uwb.webp"
            alt=""
            className="h-[82%] w-[82%] object-contain"
          />
        </span>
        <h1 className="font-display text-3xl font-semibold text-[var(--sigu-ink)]">
          Accès refusé
        </h1>
        <p className="mt-3 text-sm text-[var(--sigu-muted)]">
          Cette interface exige le rôle <strong>admin</strong>. Session :{" "}
          <code>{user.email}</code> ({user.roles.join(", ") || "aucun rôle"}).
        </p>
        <Button
          className="mt-8"
          onClick={() => {
            void logout().then(() => {
              window.location.assign("/login");
            });
          }}
        >
          Se déconnecter
        </Button>
      </div>
    );
  }

  return <Outlet />;
}
