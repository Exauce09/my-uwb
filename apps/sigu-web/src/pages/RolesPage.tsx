import { useEffect, useState } from "react";
import { listUsers } from "../api/users";
import { Alert } from "../components/ui/Alert";
import { ApiError } from "../lib/api";
import type { UserPublic } from "../lib/types";

const KNOWN_ROLES = ["admin", "student", "teacher", "finance"] as const;

export function RolesPage() {
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await listUsers({ page: 1, pageSize: 100 });
        if (!cancelled) {
          setUsers(data.items);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Chargement impossible.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = Object.fromEntries(
    KNOWN_ROLES.map((role) => [
      role,
      users.filter((u) => u.roles.includes(role) && u.is_active).length,
    ]),
  ) as Record<(typeof KNOWN_ROLES)[number], number>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--sigu-ink)]">Rôles</h2>
        <p className="mt-1 text-sm text-[var(--sigu-muted)]">
          Synthèse dérivée de <code>GET /api/v1/users</code>. L’attribution se fait
          depuis la page Comptes (pas de CRUD dédié des rôles côté API).
        </p>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}
      {loading ? (
        <p className="text-sm text-[var(--sigu-muted)]">Chargement…</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KNOWN_ROLES.map((role) => (
            <div
              key={role}
              className="rounded-xl border border-[var(--sigu-line)] bg-white p-4"
            >
              <p className="text-xs uppercase tracking-wide text-[var(--sigu-muted)]">
                {role}
              </p>
              <p className="mt-2 text-3xl font-semibold text-[var(--sigu-ink)]">
                {counts[role]}
              </p>
              <p className="text-xs text-[var(--sigu-muted)]">comptes actifs</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
