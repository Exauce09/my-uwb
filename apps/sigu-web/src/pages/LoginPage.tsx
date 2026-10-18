import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { ApiError } from "../lib/api";
import { API_BASE_URL } from "../lib/config";

export function LoginPage() {
  const { user, loading, login, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user && isAdmin) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: typeof fieldErrors = {};
    if (!email.trim()) nextErrors.email = "L’e-mail est obligatoire.";
    if (password.length < 8) {
      nextErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères.";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setError(null);
    try {
      const me = await login(email.trim(), password);
      if (!me.roles.includes("admin")) {
        await logout();
        setError(
          "Ce compte n’a pas le rôle admin. Utilisez le compte administrateur ici ; étudiants/enseignants → site public (/connexion).",
        );
        return;
      }
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Connexion impossible.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md border border-[var(--sigu-line)] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(26,26,26,0.35)]">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-black/10">
            <img
              src="/brand/logo-uwb.webp"
              alt="Logo Université William Booth"
              className="h-[84%] w-[84%] object-contain"
            />
          </span>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-[var(--sigu-muted)] uppercase">
              Université William Booth
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--sigu-ink)]">
              SIGU
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[var(--sigu-muted)]">
          Connexion administrateur. Étudiants et enseignants : portail du site
          UWB.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
          <Field
            label="E-mail"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            disabled={submitting}
            required
          />
          <Field
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            disabled={submitting}
            required
            minLength={8}
          />

          {error ? <Alert tone="error">{error}</Alert> : null}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>

        <p className="mt-8 text-center text-[10px] font-semibold tracking-[0.18em] text-[var(--sigu-muted)] uppercase">
          Dignité · Honneur · Excellence
        </p>
        <p className="mt-3 text-center text-[11px] text-[var(--sigu-muted)]/80">
          API : <code>{API_BASE_URL}</code>
        </p>
      </div>
    </div>
  );
}
