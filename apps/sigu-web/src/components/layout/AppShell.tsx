import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../ui/Button";

const nav = [
  { to: "/", label: "Tableau de bord", end: true },
  { to: "/persons", label: "Personnes" },
  { to: "/student-dossiers", label: "Dossiers étudiants" },
  { to: "/academic-referential", label: "Référentiel académique" },
  { to: "/users", label: "Comptes" },
  { to: "/roles", label: "Rôles" },
  { to: "/institution", label: "Institution" },
];

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
      <aside className="border-b border-black/10 bg-[var(--sigu-navy)] text-white md:w-64 md:border-b-0 md:border-r md:border-black/20">
        <div className="flex items-center gap-3 px-5 py-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/30">
            <img
              src="/brand/logo-uwb.webp"
              alt=""
              className="h-[82%] w-[82%] object-contain"
            />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-white/55 uppercase">
              UWB · Kinshasa
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              SIGU
            </h1>
            <p className="text-xs text-white/65">Administration</p>
          </div>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col"
          aria-label="Principal"
        >
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-sm px-3 py-2.5 text-sm whitespace-nowrap transition ${
                  isActive
                    ? "bg-[var(--sigu-accent)] font-semibold text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto hidden px-5 pb-5 text-[10px] tracking-[0.14em] text-white/40 uppercase md:block">
          Dignité · Honneur · Excellence
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--sigu-line)] bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="hidden h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-black/10 sm:flex">
              <img
                src="/brand/logo-uwb.webp"
                alt=""
                className="h-[80%] w-[80%] object-contain"
              />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--sigu-ink)]">
                {user?.full_name || user?.email}
              </p>
              <p className="text-xs text-[var(--sigu-muted)]">
                {user?.email} · {(user?.roles || []).join(", ") || "sans rôle"}
              </p>
            </div>
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
