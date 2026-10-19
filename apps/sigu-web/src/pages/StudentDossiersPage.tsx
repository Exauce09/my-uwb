import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createEnrollment,
  createStudentProfile,
  fetchAcademicCatalog,
  getStudentProfile,
  listStudentProfiles,
  updateEnrollment,
} from "../api/academic";
import { listPersons } from "../api/persons";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { ApiError } from "../lib/api";
import type {
  AcademicCatalog,
  PersonPublic,
  StudentProfileListItem,
  StudentProfilePublic,
} from "../lib/types";

const ENROLLMENT_STATUSES = [
  "draft",
  "active",
  "completed",
  "withdrawn",
  "cancelled",
  "deferred",
] as const;

export function StudentDossiersPage() {
  const [items, setItems] = useState<StudentProfileListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selected, setSelected] = useState<StudentProfilePublic | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [catalog, setCatalog] = useState<AcademicCatalog | null>(null);
  const [persons, setPersons] = useState<PersonPublic[]>([]);

  const [profileForm, setProfileForm] = useState({
    person_id: "",
    student_number: "",
    status: "active",
    entry_date: "",
  });
  const [enrollmentForm, setEnrollmentForm] = useState({
    program_id: "",
    academic_year_id: "",
    program_level_id: "",
    status: "active",
    kind: "initial",
  });
  const [saving, setSaving] = useState(false);
  const pageSize = 10;

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listStudentProfiles({ page, pageSize, q });
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

  const loadRefs = useCallback(async () => {
    try {
      const [cat, people] = await Promise.all([
        fetchAcademicCatalog(),
        listPersons({ page: 1, pageSize: 100 }),
      ]);
      setCatalog(cat);
      setPersons(people.items);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Référentiel académique indisponible.",
      );
    }
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    void loadRefs();
  }, [loadRefs]);

  async function openDetail(id: string) {
    setDetailLoading(true);
    setError(null);
    try {
      const profile = await getStudentProfile(id);
      setSelected(profile);
      setEnrollmentForm((prev) => ({
        ...prev,
        program_id: catalog?.programs[0]?.id || "",
        academic_year_id:
          catalog?.academic_years.find((y) => y.is_current)?.id ||
          catalog?.academic_years[0]?.id ||
          "",
        program_level_id: catalog?.program_levels[0]?.id || "",
      }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Détail impossible.");
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  }

  async function onCreateProfile(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    if (!profileForm.person_id || !profileForm.student_number.trim()) {
      setError("Personne et matricule sont obligatoires.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await createStudentProfile({
        person_id: profileForm.person_id,
        student_number: profileForm.student_number.trim(),
        status: profileForm.status,
        entry_date: profileForm.entry_date || null,
      });
      setSuccess(`Profil créé — matricule ${created.student_number}.`);
      setProfileForm({
        person_id: "",
        student_number: "",
        status: "active",
        entry_date: "",
      });
      await loadList();
      await openDetail(created.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Création impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function onAddEnrollment(event: FormEvent) {
    event.preventDefault();
    if (!selected || saving) return;
    if (!enrollmentForm.program_id || !enrollmentForm.academic_year_id) {
      setError("Programme et année académique sont obligatoires.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await createEnrollment({
        student_profile_id: selected.id,
        program_id: enrollmentForm.program_id,
        academic_year_id: enrollmentForm.academic_year_id,
        program_level_id: enrollmentForm.program_level_id || null,
        status: enrollmentForm.status,
        kind: enrollmentForm.kind.trim() || null,
      });
      setSuccess("Inscription ajoutée.");
      await openDetail(selected.id);
      await loadList();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Inscription impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function onChangeEnrollmentStatus(id: string, statusValue: string) {
    if (!selected) return;
    setError(null);
    setSuccess(null);
    try {
      await updateEnrollment(id, { status: statusValue });
      setSuccess("Statut d’inscription mis à jour.");
      await openDetail(selected.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Mise à jour impossible.");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-semibold text-[var(--sigu-ink)]">
          Dossiers étudiants
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--sigu-muted)]">
          Gestion administrative des profils (matricule) et inscriptions annuelles
          E3. Les notes et délibérations restent hors périmètre (D-015). Les
          décisions académiques V1 sont encore marquées intérimaires dans la
          documentation.
        </p>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}

      <section className="rounded-xl border border-[var(--sigu-line)] bg-white p-5">
        <h3 className="font-semibold text-[var(--sigu-ink)]">
          Nouveau profil étudiant
        </h3>
        <form
          onSubmit={onCreateProfile}
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium text-[var(--sigu-ink)]">Personne</span>
            <select
              className="w-full rounded-sm border border-[var(--sigu-line)] bg-white px-3 py-2 text-sm"
              value={profileForm.person_id}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, person_id: e.target.value }))
              }
              required
            >
              <option value="">Sélectionner…</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.last_name} {p.first_name}
                  {p.email ? ` — ${p.email}` : ""}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Matricule"
            value={profileForm.student_number}
            onChange={(e) =>
              setProfileForm((f) => ({
                ...f,
                student_number: e.target.value,
              }))
            }
            required
            maxLength={64}
          />
          <Field
            label="Statut profil"
            value={profileForm.status}
            onChange={(e) =>
              setProfileForm((f) => ({ ...f, status: e.target.value }))
            }
          />
          <Field
            label="Date d’entrée"
            type="date"
            value={profileForm.entry_date}
            onChange={(e) =>
              setProfileForm((f) => ({ ...f, entry_date: e.target.value }))
            }
          />
          <div className="sm:col-span-2 lg:col-span-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement…" : "Créer le profil"}
            </Button>
          </div>
        </form>
        {!persons.length ? (
          <p className="mt-3 text-sm text-[var(--sigu-muted)]">
            Aucune personne disponible — créez d’abord une fiche dans Personnes.
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-[var(--sigu-line)] bg-white p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[16rem] flex-1">
            <Field
              label="Recherche"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Matricule, nom, e-mail…"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setPage(1);
              setQ(qInput);
            }}
          >
            Filtrer
          </Button>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-[var(--sigu-muted)]">Chargement…</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--sigu-muted)]">
            Aucun profil étudiant.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[var(--sigu-line)] text-xs tracking-wide text-[var(--sigu-muted)] uppercase">
                <tr>
                  <th className="py-2 pr-3 font-medium">Matricule</th>
                  <th className="py-2 pr-3 font-medium">Nom</th>
                  <th className="py-2 pr-3 font-medium">Statut</th>
                  <th className="py-2 pr-3 font-medium">Inscriptions</th>
                  <th className="py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--sigu-line)]/70"
                  >
                    <td className="py-2.5 pr-3 font-medium text-[var(--sigu-ink)]">
                      {row.student_number}
                    </td>
                    <td className="py-2.5 pr-3 text-[var(--sigu-ink)]">
                      {row.person_last_name} {row.person_first_name}
                      {row.person_email ? (
                        <span className="block text-xs text-[var(--sigu-muted)]">
                          {row.person_email}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2.5 pr-3">{row.status}</td>
                    <td className="py-2.5 pr-3">{row.enrollment_count}</td>
                    <td className="py-2.5 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void openDetail(row.id)}
                      >
                        Ouvrir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[var(--sigu-muted)]">
          <span>
            {total} profil{total === 1 ? "" : "s"} · page {page}/{totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Précédent
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </section>

      {detailLoading ? (
        <p className="text-sm text-[var(--sigu-muted)]">Chargement du dossier…</p>
      ) : null}

      {selected ? (
        <section className="space-y-4 rounded-xl border border-[var(--sigu-line)] bg-white p-5">
          <div>
            <h3 className="font-semibold text-[var(--sigu-ink)]">
              {selected.person.last_name} {selected.person.first_name}
            </h3>
            <p className="text-sm text-[var(--sigu-muted)]">
              Matricule {selected.student_number} · profil {selected.status}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--sigu-ink)]">
              Inscriptions
            </h4>
            {selected.enrollments.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--sigu-muted)]">
                Aucune inscription.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-[var(--sigu-line)]">
                {selected.enrollments.map((enr) => (
                  <li
                    key={enr.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--sigu-ink)]">
                        {enr.program.title}
                      </p>
                      <p className="text-xs text-[var(--sigu-muted)]">
                        {enr.program.academic_unit_name} ·{" "}
                        {enr.academic_year.label}
                        {enr.program_level
                          ? ` · ${enr.program_level.label}`
                          : ""}
                      </p>
                    </div>
                    <select
                      className="rounded-sm border border-[var(--sigu-line)] bg-white px-2 py-1.5 text-sm"
                      value={enr.status}
                      onChange={(e) =>
                        void onChangeEnrollmentStatus(enr.id, e.target.value)
                      }
                    >
                      {ENROLLMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={onAddEnrollment}
            className="grid gap-3 border-t border-[var(--sigu-line)] pt-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <h4 className="sm:col-span-2 lg:col-span-3 text-sm font-semibold text-[var(--sigu-ink)]">
              Ajouter une inscription
            </h4>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-[var(--sigu-ink)]">Programme</span>
              <select
                className="w-full rounded-sm border border-[var(--sigu-line)] bg-white px-3 py-2 text-sm"
                value={enrollmentForm.program_id}
                onChange={(e) =>
                  setEnrollmentForm((f) => ({
                    ...f,
                    program_id: e.target.value,
                  }))
                }
                required
              >
                <option value="">Sélectionner…</option>
                {(catalog?.programs || []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-[var(--sigu-ink)]">
                Année académique
              </span>
              <select
                className="w-full rounded-sm border border-[var(--sigu-line)] bg-white px-3 py-2 text-sm"
                value={enrollmentForm.academic_year_id}
                onChange={(e) =>
                  setEnrollmentForm((f) => ({
                    ...f,
                    academic_year_id: e.target.value,
                  }))
                }
                required
              >
                <option value="">Sélectionner…</option>
                {(catalog?.academic_years || []).map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.label}
                    {y.is_current ? " (courante)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-[var(--sigu-ink)]">Niveau</span>
              <select
                className="w-full rounded-sm border border-[var(--sigu-line)] bg-white px-3 py-2 text-sm"
                value={enrollmentForm.program_level_id}
                onChange={(e) =>
                  setEnrollmentForm((f) => ({
                    ...f,
                    program_level_id: e.target.value,
                  }))
                }
              >
                <option value="">—</option>
                {(catalog?.program_levels || []).map((lv) => (
                  <option key={lv.id} value={lv.id}>
                    {lv.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-[var(--sigu-ink)]">Statut</span>
              <select
                className="w-full rounded-sm border border-[var(--sigu-line)] bg-white px-3 py-2 text-sm"
                value={enrollmentForm.status}
                onChange={(e) =>
                  setEnrollmentForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                {ENROLLMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Type"
              value={enrollmentForm.kind}
              onChange={(e) =>
                setEnrollmentForm((f) => ({ ...f, kind: e.target.value }))
              }
            />
            <div className="flex items-end">
              <Button type="submit" disabled={saving || !catalog?.programs.length}>
                Ajouter l’inscription
              </Button>
            </div>
            {!catalog?.programs.length ? (
              <p className="sm:col-span-2 lg:col-span-3 text-sm text-[var(--sigu-muted)]">
                Référentiel programmes vide — exécutez le seed E3 sur la base de
                test.
              </p>
            ) : null}
          </form>
        </section>
      ) : null}
    </div>
  );
}
