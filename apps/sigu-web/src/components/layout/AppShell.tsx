import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../ui/Button";

const nav = [
  { to: "/", label: "Tableau de bord", end: true },
  { to: "/persons", label: "Personnes" },
  { to: "/users", label: "Comptes" },
  { to: "/roles", label: "Rôles" },
  { to: "/institution", label: "Institution" },
];

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-0 md:flex-row md:gap-0">
      <aside className="border-b border-[var(--sigu-line)] bg-[var(--sigu-ink)] text-white md:w-64 md:border-b-0 md:border-r">
        <div className="px-5 py-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            Université William Booth
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">SIGU</h1>
          <p className="mt-1 text-sm text-white/70">Espace administrateur</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col" aria-label="Principal">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm whitespace-nowrap transition ${
                  isActive
                    ? "bg-white/15 font-medium text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--sigu-line)] bg-white/80 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-sm font-medium text-[var(--sigu-ink)]">
              {user?.full_name || user?.email}
            </p>
            <p className="text-xs text-[var(--sigu-muted)]">
              {user?.email} · {(user?.roles || []).join(", ") || "sans rôle"}
            </p>
          </div>
          <Button variant="secondary" onClick={() => void logout()}>
            Déconnexion
          </Button>
        </header>
        <main className="flex-1 px-5 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
