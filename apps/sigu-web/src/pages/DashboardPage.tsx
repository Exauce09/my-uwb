import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Alert } from "../components/ui/Alert";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-semibold text-[var(--sigu-ink)]">
          Tableau de bord
        </h2>
        <p className="mt-1 text-sm text-[var(--sigu-muted)]">
          Bienvenue{user?.full_name ? `, ${user.full_name}` : ""}. Les indicateurs
          agrégés ne sont pas encore fournis par l’API.
        </p>
      </div>

      <Alert tone="info">
        Aucune statistique métier n’est inventée ici. Utilisez la navigation pour
        gérer les personnes et les comptes réellement exposés par le backend.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/persons"
          className="rounded-xl border border-[var(--sigu-line)] bg-white p-5 transition hover:border-[var(--sigu-navy)]"
        >
          <h3 className="font-semibold text-[var(--sigu-ink)]">Personnes</h3>
          <p className="mt-1 text-sm text-[var(--sigu-muted)]">
            Fiches d’identité (création, recherche, soft-delete, liaison compte).
          </p>
        </Link>
        <Link
          to="/users"
          className="rounded-xl border border-[var(--sigu-line)] bg-white p-5 transition hover:border-[var(--sigu-navy)]"
        >
          <h3 className="font-semibold text-[var(--sigu-ink)]">Comptes</h3>
          <p className="mt-1 text-sm text-[var(--sigu-muted)]">
            Utilisateurs, activation, rôles et association Person.
          </p>
        </Link>
      </div>
    </div>
  );
}
