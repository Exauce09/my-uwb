import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { user, loading, isAdmin } = useAuth();

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
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-[var(--sigu-ink)]">Accès refusé</h1>
        <p className="mt-2 text-sm text-[var(--sigu-muted)]">
          Cette interface administrateur exige le rôle <strong>admin</strong>.
          Les contrôles restent appliqués côté serveur.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
