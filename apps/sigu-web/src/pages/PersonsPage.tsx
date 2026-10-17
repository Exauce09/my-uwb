import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createPerson,
  listPersons,
  softDeletePerson,
  updatePerson,
} from "../api/persons";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { ApiError } from "../lib/api";
import type { PersonPublic } from "../lib/types";

const emptyForm = {
  last_name: "",
  first_name: "",
  other_names: "",
  email: "",
  phone: "",
  birth_date: "",
};

export function PersonsPage() {
  const [items, setItems] = useState<PersonPublic[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPersons({ page, pageSize, q });
      setItems(data.items);
      setTotal(data.total);
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

  function startEdit(person: PersonPublic) {
    setEditingId(person.id);
    setForm({
      last_name: person.last_name,
      first_name: person.first_name,
      other_names: person.other_names || "",
      email: person.email || "",
      phone: person.phone || "",
      birth_date: person.birth_date || "",
    });
    setSuccess(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    if (!form.last_name.trim() || !form.first_name.trim()) {
      setError("Le nom et le prénom sont obligatoires.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    const payload = {
      last_name: form.last_name.trim(),
      first_name: form.first_name.trim(),
      other_names: form.other_names.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      birth_date: form.birth_date || null,
    };
    try {
      if (editingId) {
        await updatePerson(editingId, payload);
        setSuccess("Fiche mise à jour.");
      } else {
        await createPerson(payload);
        setSuccess("Personne créée.");
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(person: PersonPublic) {
    const ok = window.confirm(
      `Supprimer logiquement ${person.first_name} ${person.last_name} ? La fiche disparaîtra des listes.`,
    );
    if (!ok) return;
    setError(null);
    setSuccess(null);
    try {
      await softDeletePerson(person.id);
      setSuccess("Personne archivée (soft-delete).");
      if (editingId === person.id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Suppression impossible.");
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--sigu-ink)]">Personnes</h2>
        <p className="mt-1 text-sm text-[var(--sigu-muted)]">
          Source d’identité — e-mail de contact distinct du login compte.
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
          placeholder="Rechercher (nom, prénom, e-mail, téléphone)"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          aria-label="Recherche personnes"
        />
        <Button type="submit" variant="secondary">
          Rechercher
        </Button>
      </form>

      <form
        onSubmit={onSave}
        className="grid gap-3 rounded-xl border border-[var(--sigu-line)] bg-white p-4 sm:grid-cols-2"
      >
        <h3 className="sm:col-span-2 text-sm font-semibold text-[var(--sigu-ink)]">
          {editingId ? "Modifier la fiche" : "Nouvelle personne"}
        </h3>
        <Field
          label="Nom"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
          disabled={saving}
        />
        <Field
          label="Prénom"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
          disabled={saving}
        />
        <Field
          label="Autres noms"
          value={form.other_names}
          onChange={(e) => setForm({ ...form, other_names: e.target.value })}
          disabled={saving}
        />
        <Field
          label="E-mail de contact"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled={saving}
        />
        <Field
          label="Téléphone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          disabled={saving}
        />
        <Field
          label="Date de naissance"
          type="date"
          value={form.birth_date}
          onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
          disabled={saving}
        />
        <div className="sm:col-span-2 flex flex-wrap gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Enregistrement…" : editingId ? "Enregistrer" : "Créer"}
          </Button>
          {editingId ? (
            <Button type="button" variant="ghost" onClick={resetForm} disabled={saving}>
              Annuler
            </Button>
          ) : null}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[var(--sigu-line)] bg-white">
        {loading ? (
          <p className="p-4 text-sm text-[var(--sigu-muted)]">Chargement…</p>
        ) : items.length === 0 ? (
          <p className="p-4 text-sm text-[var(--sigu-muted)]">Aucune personne.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--sigu-line)] bg-[#f8fafc] text-[var(--sigu-muted)]">
              <tr>
                <th className="px-3 py-2 font-medium">Nom</th>
                <th className="px-3 py-2 font-medium">Contact</th>
                <th className="px-3 py-2 font-medium">Identifiant</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((person) => (
                <tr key={person.id} className="border-b border-[var(--sigu-line)] last:border-0">
                  <td className="px-3 py-2">
                    {person.last_name} {person.first_name}
                  </td>
                  <td className="px-3 py-2 text-[var(--sigu-muted)]">
                    {person.email || "—"}
                    {person.phone ? ` · ${person.phone}` : ""}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-[var(--sigu-muted)]">
                    {person.id.slice(0, 8)}…
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" onClick={() => startEdit(person)}>
                        Modifier
                      </Button>
                      <Button variant="danger" onClick={() => void onDelete(person)}>
                        Archiver
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-[var(--sigu-muted)]">
          {total} résultat{total === 1 ? "" : "s"} · page {page}/{pageCount}
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
