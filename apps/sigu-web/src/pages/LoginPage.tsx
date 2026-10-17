import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { ApiError } from "../lib/api";
import { API_BASE_URL } from "../lib/config";

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: typeof fieldErrors = {};
    if (!email.trim()) nextErrors.email = "L’e-mail est obligatoire.";
    if (password.length < 8) {
      nextErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setError(null);
    try {
      await login(email.trim(), password);
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
      <div className="w-full max-w-md rounded-2xl border border-[var(--sigu-line)] bg-white/90 p-8 shadow-[0_20px_60px_-30px_rgba(15,39,68,0.45)]">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--sigu-muted)]">
          Université William Booth
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--sigu-ink)]">
          SIGU
        </h1>
        <p className="mt-2 text-sm text-[var(--sigu-muted)]">
          Connexion administrateur — e-mail et mot de passe du compte API.
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

        <p className="mt-6 text-xs text-[var(--sigu-muted)]">
          API : <code>{API_BASE_URL}</code>
        </p>
      </div>
    </div>
  );
}
