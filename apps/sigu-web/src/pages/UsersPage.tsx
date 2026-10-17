import { useCallback, useEffect, useState, type FormEvent } from "react";
import { listPersons } from "../api/persons";
import {
  assignRole,
  createUser,
  linkPerson,
  listUsers,
  removeRole,
  setUserStatus,
  unlinkPerson,
} from "../api/users";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { ApiError } from "../lib/api";
import type { PersonPublic, UserPublic } from "../lib/types";

const ROLE_OPTIONS = ["student", "teacher", "finance", "admin"] as const;

export function UsersPage() {
  const [items, setItems] = useState<UserPublic[]>([]);
  const [persons, setPersons] = useState<PersonPublic[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "student",
  });
  const [creating, setCreating] = useState(false);
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, personsData] = await Promise.all([
        listUsers({ page, pageSize, q }),
        listPersons({ page: 1, pageSize: 100 }),
      ]);
      setItems(usersData.items);
      setTotal(usersData.total);
      setPersons(personsData.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Chargement impossible.");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(userId: string, action: () => Promise<unknown>, okMsg: string) {
    setBusyId(userId);
    setError(null);
    setSuccess(null);
    try {
      await action();
      setSuccess(okMsg);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action impossible.");
    } finally {
      setBusyId(null);
    }
  }

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    if (creating) return;
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      await createUser({
        email: createForm.email.trim(),
        password: createForm.password,
        full_name: createForm.full_name.trim() || null,
        roles: [createForm.role],
      });
      setSuccess("Compte créé.");
      setCreateForm({ email: "", password: "", full_name: "", role: "student" });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Création impossible.");
    } finally {
      setCreating(false);
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--sigu-ink)]">Comptes</h2>
        <p className="mt-1 text-sm text-[var(--sigu-muted)]">
          Administration des utilisateurs — JWT inchangé (<code>users.id</code>).
        </p>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}

      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setQ(qInput);
        }}
      >
        <input
          className="flex-1 rounded-md border border-[var(--sigu-line)] bg-white px-3 py-2 text-sm"
          placeholder="Rechercher (e-mail, nom affiché)"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          aria-label="Recherche comptes"
        />
        <Button type="submit" variant="secondary">
          Rechercher
        </Button>
      </form>

      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-xl border border-[var(--sigu-line)] bg-white p-4 sm:grid-cols-2"
      >
        <h3 className="sm:col-span-2 text-sm font-semibold">Nouveau compte</h3>
        <Field
          label="E-mail de connexion"
          type="email"
          required
          value={createForm.email}
          onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
          disabled={creating}
        />
        <Field
          label="Mot de passe"
          type="password"
          required
          minLength={8}
          value={createForm.password}
          onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
          disabled={creating}
        />
        <Field
          label="Nom affiché"
          value={createForm.full_name}
          onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
          disabled={creating}
        />
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Rôle initial</span>
          <select
            className="w-full rounded-md border border-[var(--sigu-line)] bg-white px-3 py-2"
            value={createForm.role}
            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
            disabled={creating}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={creating}>
            {creating ? "Création…" : "Créer le compte"}
          </Button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[var(--sigu-line)] bg-white">
        {loading ? (
          <p className="p-4 text-sm text-[var(--sigu-muted)]">Chargement…</p>
        ) : items.length === 0 ? (
          <p className="p-4 text-sm text-[var(--sigu-muted)]">Aucun compte.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--sigu-line)] bg-[#f8fafc] text-[var(--sigu-muted)]">
              <tr>
                <th className="px-3 py-2 font-medium">Compte</th>
                <th className="px-3 py-2 font-medium">Rôles</th>
                <th className="px-3 py-2 font-medium">Personne</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => {
                const busy = busyId === user.id;
                return (
                  <tr key={user.id} className="border-b border-[var(--sigu-line)] last:border-0 align-top">
                    <td className="px-3 py-3">
                      <div className="font-medium">{user.email}</div>
                      <div className="text-xs text-[var(--sigu-muted)]">
                        {user.full_name || "—"} ·{" "}
                        {user.is_active ? "actif" : "inactif"}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <button
                            key={role}
                            type="button"
                            disabled={busy}
                            className="rounded-full border border-[var(--sigu-line)] px-2 py-0.5 text-xs hover:border-[var(--sigu-danger)]"
                            title="Retirer le rôle"
                            onClick={() =>
                              void runAction(
                                user.id,
                                () => removeRole(user.id, role),
                                `Rôle ${role} retiré.`,
                              )
                            }
                          >
                            {role} ×
                          </button>
                        ))}
                      </div>
                      <select
                        className="mt-2 rounded-md border border-[var(--sigu-line)] px-2 py-1 text-xs"
                        defaultValue=""
                        disabled={busy}
                        aria-label={`Ajouter un rôle à ${user.email}`}
                        onChange={(e) => {
                          const role = e.target.value;
                          e.target.value = "";
                          if (!role) return;
                          void runAction(
                            user.id,
                            () => assignRole(user.id, role),
                            `Rôle ${role} attribué.`,
                          );
                        }}
                      >
                        <option value="">Ajouter un rôle…</option>
                        {ROLE_OPTIONS.filter((r) => !user.roles.includes(r)).map(
                          (role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ),
                        )}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      {user.person_id ? (
                        <div className="space-y-2">
                          <code className="text-xs">{user.person_id.slice(0, 8)}…</code>
                          <Button
                            variant="secondary"
                            disabled={busy}
                            onClick={() =>
                              void runAction(
                                user.id,
                                () => unlinkPerson(user.id),
                                "Personne dissociée.",
                              )
                            }
                          >
                            Dissocier
                          </Button>
                        </div>
                      ) : (
                        <select
                          className="max-w-[12rem] rounded-md border border-[var(--sigu-line)] px-2 py-1 text-xs"
                          defaultValue=""
                          disabled={busy || persons.length === 0}
                          aria-label={`Lier une personne à ${user.email}`}
                          onChange={(e) => {
                            const personId = e.target.value;
                            e.target.value = "";
                            if (!personId) return;
                            void runAction(
                              user.id,
                              () => linkPerson(user.id, personId),
                              "Personne liée.",
                            );
                          }}
                        >
                          <option value="">
                            {persons.length ? "Lier une personne…" : "Aucune fiche"}
                          </option>
                          {persons.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.last_name} {p.first_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Button
                        variant={user.is_active ? "danger" : "primary"}
                        disabled={busy}
                        onClick={() =>
                          void runAction(
                            user.id,
                            () => setUserStatus(user.id, !user.is_active),
                            user.is_active ? "Compte désactivé." : "Compte activé.",
                          )
                        }
                      >
                        {user.is_active ? "Désactiver" : "Activer"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-[var(--sigu-muted)]">
          {total} compte{total === 1 ? "" : "s"} · page {page}/{pageCount}
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Précédent
          </Button>
          <Button
            variant="secondary"
            disabled={page >= pageCount || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
