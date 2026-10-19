import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createAcademicYear,
  createProgram,
  createProgramLevel,
  deleteProgram,
  listAcademicUnits,
  listAcademicYears,
  listProgramLevels,
  listPrograms,
  updateAcademicYear,
  updateProgram,
  updateProgramLevel,
} from "../api/academic";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { ApiError } from "../lib/api";
import type {
  AcademicUnitRef,
  AcademicYearPublic,
  ProgramLevelPublic,
  ProgramPublic,
} from "../lib/types";

/** Nomenclature D-021 intérimaire (docs/13 §7). */
const D021_LEVEL_PRESETS: { code: string; label: string; sort_order: number }[] =
  [
    { code: "L1_LMD", label: "L1 LMD", sort_order: 1 },
    { code: "L2_LMD", label: "L2 LMD", sort_order: 2 },
    { code: "L3_LMD", label: "L3 LMD", sort_order: 3 },
    { code: "L1_ANC", label: "L1 ANCIEN SYSTEME", sort_order: 4 },
    { code: "L2_ANC", label: "L2 ANCIEN SYSTEME", sort_order: 5 },
    { code: "MASTER_COMP", label: "MASTER COMPLÉMENTAIRE", sort_order: 6 },
    { code: "MASTER_1", label: "MASTER 1", sort_order: 7 },
    { code: "MASTER_2", label: "MASTER 2", sort_order: 8 },
  ];

export function AcademicReferentialPage() {
  const [units, setUnits] = useState<AcademicUnitRef[]>([]);
  const [programs, setPrograms] = useState<ProgramPublic[]>([]);
  const [years, setYears] = useState<AcademicYearPublic[]>([]);
  const [levels, setLevels] = useState<ProgramLevelPublic[]>([]);
  const [programTotal, setProgramTotal] = useState(0);
  const [programPage, setProgramPage] = useState(1);
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramPublic | null>(
    null,
  );
  const [editingLevel, setEditingLevel] = useState<ProgramLevelPublic | null>(
    null,
  );

  const [programForm, setProgramForm] = useState({
    academic_unit_id: "",
    code: "",
    title: "",
    cycle: "",
  });
  const [yearForm, setYearForm] = useState({
    label: "",
    starts_on: "",
    ends_on: "",
    is_current: false,
  });
  const [levelForm, setLevelForm] = useState({
    code: "",
    label: "",
    sort_order: "1",
  });
  const [editingYear, setEditingYear] = useState<AcademicYearPublic | null>(
    null,
  );
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [unitRows, prog, yr, lv] = await Promise.all([
        listAcademicUnits(),
        listPrograms({ page: programPage, pageSize, q }),
        listAcademicYears({ page: 1, pageSize: 50 }),
        listProgramLevels(),
      ]);
      setUnits(unitRows);
      setPrograms(prog.items);
      setProgramTotal(prog.total);
      setYears(yr.items);
      setLevels(lv.items);
      setProgramForm((f) =>
        f.academic_unit_id || !unitRows[0]
          ? f
          : { ...f, academic_unit_id: unitRows[0].id },
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Chargement impossible.");
      setPrograms([]);
      setYears([]);
      setLevels([]);
    } finally {
      setLoading(false);
    }
  }, [programPage, q]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreateProgram(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    if (
      !programForm.academic_unit_id ||
      !programForm.code.trim() ||
      !programForm.title.trim()
    ) {
      setError("Unité, code et intitulé sont obligatoires.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await createProgram({
        academic_unit_id: programForm.academic_unit_id,
        code: programForm.code.trim(),
        title: programForm.title.trim(),
        cycle: programForm.cycle.trim() || null,
      });
      setSuccess(`Programme ${created.code} créé.`);
      setProgramForm((f) => ({ ...f, code: "", title: "", cycle: "" }));
      await load();
      setSelectedProgram(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Création impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function onSaveProgramTitle(event: FormEvent) {
    event.preventDefault();
    if (!selectedProgram || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateProgram(selectedProgram.id, {
        title: selectedProgram.title.trim(),
        cycle: selectedProgram.cycle,
        code: selectedProgram.code.trim(),
        academic_unit_id: selectedProgram.academic_unit_id,
      });
      setSelectedProgram(updated);
      setSuccess("Programme mis à jour.");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Mise à jour impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function onArchiveProgram() {
    if (!selectedProgram || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteProgram(selectedProgram.id);
      setSuccess(
        `Programme ${selectedProgram.code} archivé (hors catalogue d’inscription).`,
      );
      setSelectedProgram(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Archivage impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function onCreateYear(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    if (!yearForm.label.trim()) {
      setError("Le libellé d’année est obligatoire.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await createAcademicYear({
        label: yearForm.label.trim(),
        starts_on: yearForm.starts_on || null,
        ends_on: yearForm.ends_on || null,
        is_current: yearForm.is_current,
      });
      setSuccess(`Année ${created.label} créée.`);
      setYearForm({
        label: "",
        starts_on: "",
        ends_on: "",
        is_current: false,
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Création impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function onSetCurrentYear(year: AcademicYearPublic) {
    setError(null);
    setSuccess(null);
    try {
      await updateAcademicYear(year.id, { is_current: true });
      setSuccess(`${year.label} définie comme année courante.`);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Mise à jour impossible.");
    }
  }

  async function onCreateLevel(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    const preset = D021_LEVEL_PRESETS.find((p) => p.code === levelForm.code);
    if (!preset) {
      setError("Sélectionnez un code D-021.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await createProgramLevel({
        code: preset.code,
        label: levelForm.label.trim() || preset.label,
        sort_order: Number.parseInt(levelForm.sort_order, 10) || preset.sort_order,
      });
      setSuccess(`Niveau ${created.code} créé.`);
      setLevelForm({ code: "", label: "", sort_order: "1" });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Création impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function onSaveYear(event: FormEvent) {
    event.preventDefault();
    if (!editingYear || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateAcademicYear(editingYear.id, {
        label: editingYear.label.trim(),
        starts_on: editingYear.starts_on,
        ends_on: editingYear.ends_on,
        is_current: editingYear.is_current,
      });
      setSuccess("Année mise à jour.");
      setEditingYear(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Mise à jour impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function onSaveLevel(event: FormEvent) {
    event.preventDefault();
    if (!editingLevel || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateProgramLevel(editingLevel.id, {
        code: editingLevel.code.trim(),
        label: editingLevel.label.trim(),
        sort_order: editingLevel.sort_order,
      });
      setEditingLevel(updated);
      setSuccess("Niveau mis à jour.");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Mise à jour impossible.");
    } finally {
      setSaving(false);
    }
  }

  const programPages = Math.max(1, Math.ceil(programTotal / pageSize));
  const existingLevelCodes = new Set(levels.map((lv) => lv.code));
  const missingLevelPresets = D021_LEVEL_PRESETS.filter(
    (p) => !existingLevelCodes.has(p.code),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-semibold text-[var(--sigu-ink)]">
          Référentiel académique
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--sigu-muted)]">
          Programmes, années et niveaux (D-021 / fiche 13 §7) pour les
          inscriptions. Catalogue initial (7 unités){" "}
          <strong className="font-semibold text-[var(--sigu-ink)]">
            provisoire / seed
          </strong>{" "}
          — visa UWB formel encore attendu. Pas de cohortes (Q33=non), pas de
          notes (D-015).
        </p>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}

      <section className="rounded-xl border border-[var(--sigu-line)] bg-white p-5">
        <h3 className="font-semibold text-[var(--sigu-ink)]">
          Unités académiques (D-016)
        </h3>
        <p className="mt-1 text-sm text-[var(--sigu-muted)]">
          Lecture seule — 7 unités verified ; IFMP / EHEC / SCF exclus. Pas de
          création ici.
        </p>
        {units.length === 0 && !loading ? (
          <p className="mt-4 text-sm text-[var(--sigu-muted)]">
            Aucune unité — exécutez le seed E3 sur la base de test.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--sigu-line)]">
            {units.map((u) => (
              <li key={u.id} className="py-2 text-sm">
                <span className="font-medium text-[var(--sigu-ink)]">
                  {u.code}
                </span>
                <span className="text-[var(--sigu-muted)]">
                  {" "}
                  — {u.name} ({u.kind})
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-[var(--sigu-line)] bg-white p-5">
        <h3 className="font-semibold text-[var(--sigu-ink)]">Programmes</h3>
        <form
          onSubmit={onCreateProgram}
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium text-[var(--sigu-ink)]">Unité</span>
            <select
              className="w-full rounded-sm border border-[var(--sigu-line)] bg-white px-3 py-2 text-sm"
              value={programForm.academic_unit_id}
              onChange={(e) =>
                setProgramForm((f) => ({
                  ...f,
                  academic_unit_id: e.target.value,
                }))
              }
              required
            >
              <option value="">Sélectionner…</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.code} — {u.name}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Code"
            value={programForm.code}
            onChange={(e) =>
              setProgramForm((f) => ({ ...f, code: e.target.value }))
            }
            required
          />
          <Field
            label="Intitulé"
            value={programForm.title}
            onChange={(e) =>
              setProgramForm((f) => ({ ...f, title: e.target.value }))
            }
            required
          />
          <Field
            label="Cycle (optionnel)"
            value={programForm.cycle}
            onChange={(e) =>
              setProgramForm((f) => ({ ...f, cycle: e.target.value }))
            }
          />
          <div className="sm:col-span-2 lg:col-span-4">
            <Button type="submit" disabled={saving || !units.length}>
              Créer le programme
            </Button>
          </div>
        </form>
        {!units.length && !loading ? (
          <p className="mt-3 text-sm text-[var(--sigu-muted)]">
            Aucune unité académique — exécutez le seed E3 sur la base de test.
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-end gap-3">
          <div className="min-w-[14rem] flex-1">
            <Field
              label="Recherche programme"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Code ou intitulé…"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setProgramPage(1);
              setQ(qInput);
            }}
          >
            Filtrer
          </Button>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-[var(--sigu-muted)]">Chargement…</p>
        ) : programs.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--sigu-muted)]">
            Aucun programme.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[var(--sigu-line)] text-xs tracking-wide text-[var(--sigu-muted)] uppercase">
                <tr>
                  <th className="py-2 pr-3 font-medium">Code</th>
                  <th className="py-2 pr-3 font-medium">Intitulé</th>
                  <th className="py-2 pr-3 font-medium">Unité</th>
                  <th className="py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--sigu-line)]/70">
                    <td className="py-2.5 pr-3 font-medium">{p.code}</td>
                    <td className="py-2.5 pr-3">{p.title}</td>
                    <td className="py-2.5 pr-3 text-[var(--sigu-muted)]">
                      {p.academic_unit_name}
                    </td>
                    <td className="py-2.5 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setSelectedProgram(p)}
                      >
                        Détail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-3 flex justify-between text-sm text-[var(--sigu-muted)]">
          <span>
            {programTotal} programme{programTotal === 1 ? "" : "s"} · page{" "}
            {programPage}/{programPages}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={programPage <= 1}
              onClick={() => setProgramPage((p) => Math.max(1, p - 1))}
            >
              Précédent
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={programPage >= programPages}
              onClick={() => setProgramPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </section>

      {selectedProgram ? (
        <section className="rounded-xl border border-[var(--sigu-line)] bg-white p-5">
          <h3 className="font-semibold text-[var(--sigu-ink)]">
            Détail programme
          </h3>
          <form
            onSubmit={onSaveProgramTitle}
            className="mt-4 grid gap-3 sm:grid-cols-2"
          >
            <Field
              label="Code"
              value={selectedProgram.code}
              onChange={(e) =>
                setSelectedProgram({ ...selectedProgram, code: e.target.value })
              }
            />
            <Field
              label="Intitulé"
              value={selectedProgram.title}
              onChange={(e) =>
                setSelectedProgram({ ...selectedProgram, title: e.target.value })
              }
            />
            <Field
              label="Cycle"
              value={selectedProgram.cycle || ""}
              onChange={(e) =>
                setSelectedProgram({
                  ...selectedProgram,
                  cycle: e.target.value || null,
                })
              }
            />
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-[var(--sigu-ink)]">Unité</span>
              <select
                className="w-full rounded-sm border border-[var(--sigu-line)] bg-white px-3 py-2 text-sm"
                value={selectedProgram.academic_unit_id}
                onChange={(e) =>
                  setSelectedProgram({
                    ...selectedProgram,
                    academic_unit_id: e.target.value,
                  })
                }
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.code} — {u.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button type="submit" disabled={saving}>
                Enregistrer
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={saving}
                onClick={() => void onArchiveProgram()}
              >
                Archiver le programme
              </Button>
            </div>
            <p className="text-xs text-[var(--sigu-muted)] sm:col-span-2">
              L’archivage est refusé s’il reste des inscriptions actives. Le
              programme disparaît alors du catalogue de création.
            </p>
          </form>
        </section>
      ) : null}

      <section className="rounded-xl border border-[var(--sigu-line)] bg-white p-5">
        <h3 className="font-semibold text-[var(--sigu-ink)]">
          Années académiques
        </h3>
        <p className="mt-1 text-sm text-[var(--sigu-muted)]">
          Dates optionnelles (calendrier officiel UWB non annexé — Q7
          intérimaire).
        </p>
        <form
          onSubmit={onCreateYear}
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Field
            label="Libellé"
            value={yearForm.label}
            onChange={(e) =>
              setYearForm((f) => ({ ...f, label: e.target.value }))
            }
            placeholder="ex. 2027-2028"
            required
          />
          <Field
            label="Début (optionnel)"
            type="date"
            value={yearForm.starts_on}
            onChange={(e) =>
              setYearForm((f) => ({ ...f, starts_on: e.target.value }))
            }
          />
          <Field
            label="Fin (optionnel)"
            type="date"
            value={yearForm.ends_on}
            onChange={(e) =>
              setYearForm((f) => ({ ...f, ends_on: e.target.value }))
            }
          />
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={yearForm.is_current}
              onChange={(e) =>
                setYearForm((f) => ({ ...f, is_current: e.target.checked }))
              }
            />
            <span>Année courante</span>
          </label>
          <div className="sm:col-span-2 lg:col-span-4">
            <Button type="submit" disabled={saving}>
              Créer l’année
            </Button>
          </div>
        </form>

        {years.length === 0 && !loading ? (
          <p className="mt-4 text-sm text-[var(--sigu-muted)]">
            Aucune année enregistrée.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--sigu-line)]">
            {years.map((y) => (
              <li
                key={y.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--sigu-ink)]">
                    {y.label}
                    {y.is_current ? (
                      <span className="ml-2 text-xs font-semibold text-[var(--sigu-accent)]">
                        courante
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-[var(--sigu-muted)]">
                    {y.starts_on || "—"} → {y.ends_on || "—"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditingYear(y)}
                  >
                    Modifier
                  </Button>
                  {!y.is_current ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => void onSetCurrentYear(y)}
                    >
                      Définir courante
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}

        {editingYear ? (
          <form
            onSubmit={onSaveYear}
            className="mt-4 grid gap-3 border-t border-[var(--sigu-line)] pt-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Field
              label="Libellé"
              value={editingYear.label}
              onChange={(e) =>
                setEditingYear({ ...editingYear, label: e.target.value })
              }
              required
            />
            <Field
              label="Début"
              type="date"
              value={editingYear.starts_on || ""}
              onChange={(e) =>
                setEditingYear({
                  ...editingYear,
                  starts_on: e.target.value || null,
                })
              }
            />
            <Field
              label="Fin"
              type="date"
              value={editingYear.ends_on || ""}
              onChange={(e) =>
                setEditingYear({
                  ...editingYear,
                  ends_on: e.target.value || null,
                })
              }
            />
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={editingYear.is_current}
                onChange={(e) =>
                  setEditingYear({
                    ...editingYear,
                    is_current: e.target.checked,
                  })
                }
              />
              <span>Année courante</span>
            </label>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
              <Button type="submit" disabled={saving}>
                Enregistrer l’année
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingYear(null)}
              >
                Fermer
              </Button>
            </div>
          </form>
        ) : null}
      </section>

      <section className="rounded-xl border border-[var(--sigu-line)] bg-white p-5">
        <h3 className="font-semibold text-[var(--sigu-ink)]">
          Niveaux d’études
        </h3>
        <p className="mt-1 text-sm text-[var(--sigu-muted)]">
          Nomenclature D-021 uniquement (8 codes). Pas de table cohortes.
        </p>
        {missingLevelPresets.length > 0 ? (
          <form
            onSubmit={onCreateLevel}
            className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-[var(--sigu-ink)]">Code D-021</span>
              <select
                className="w-full rounded-sm border border-[var(--sigu-line)] bg-white px-3 py-2 text-sm"
                value={levelForm.code}
                onChange={(e) => {
                  const preset = D021_LEVEL_PRESETS.find(
                    (p) => p.code === e.target.value,
                  );
                  setLevelForm({
                    code: e.target.value,
                    label: preset?.label || "",
                    sort_order: String(preset?.sort_order ?? 1),
                  });
                }}
                required
              >
                <option value="">Sélectionner…</option>
                {missingLevelPresets.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.label}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Libellé"
              value={levelForm.label}
              onChange={(e) =>
                setLevelForm((f) => ({ ...f, label: e.target.value }))
              }
              required
            />
            <Field
              label="Ordre"
              type="number"
              value={levelForm.sort_order}
              onChange={(e) =>
                setLevelForm((f) => ({ ...f, sort_order: e.target.value }))
              }
              required
            />
            <div className="flex items-end">
              <Button type="submit" disabled={saving}>
                Créer le niveau
              </Button>
            </div>
          </form>
        ) : (
          <p className="mt-4 text-sm text-[var(--sigu-muted)]">
            Les 8 niveaux D-021 sont déjà enregistrés.
          </p>
        )}

        {levels.length === 0 && !loading ? (
          <p className="mt-4 text-sm text-[var(--sigu-muted)]">
            Aucun niveau enregistré.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--sigu-line)]">
            {levels.map((lv) => (
              <li
                key={lv.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <button
                  type="button"
                  className="text-left"
                  onClick={() => setEditingLevel(lv)}
                >
                  <p className="text-sm font-medium text-[var(--sigu-ink)]">
                    {lv.code} — {lv.label}
                  </p>
                  <p className="text-xs text-[var(--sigu-muted)]">
                    ordre {lv.sort_order}
                  </p>
                </button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingLevel(lv)}
                >
                  Modifier
                </Button>
              </li>
            ))}
          </ul>
        )}

        {editingLevel ? (
          <form
            onSubmit={onSaveLevel}
            className="mt-4 grid gap-3 border-t border-[var(--sigu-line)] pt-4 sm:grid-cols-3"
          >
            <Field
              label="Code"
              value={editingLevel.code}
              onChange={(e) =>
                setEditingLevel({ ...editingLevel, code: e.target.value })
              }
            />
            <Field
              label="Libellé"
              value={editingLevel.label}
              onChange={(e) =>
                setEditingLevel({ ...editingLevel, label: e.target.value })
              }
            />
            <Field
              label="Ordre"
              type="number"
              value={String(editingLevel.sort_order)}
              onChange={(e) =>
                setEditingLevel({
                  ...editingLevel,
                  sort_order: Number.parseInt(e.target.value, 10) || 0,
                })
              }
            />
            <div className="flex gap-2 sm:col-span-3">
              <Button type="submit" disabled={saving}>
                Enregistrer le niveau
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingLevel(null)}
              >
                Fermer
              </Button>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}
