import { useState, type FormEvent } from 'react'
import {
  admissionCommunes,
  admissionEtatCivil,
  admissionFaculties,
  admissionGenres,
  admissionNationalites,
  admissionPromotions,
  type AdmissionFormValues,
} from '../../data/admissions'

const empty: AdmissionFormValues = {
  nom: '',
  postnom: '',
  prenom: '',
  genre: '',
  etatCivil: '',
  nationalite: 'Congo DR',
  lieuNaissance: '',
  dateNaissance: '',
  pere: '',
  mere: '',
  province: '',
  commune: '',
  adresse: '',
  telephone: '',
  email: '',
  numDiplome: '',
  pourcentExetat: '',
  faculte1: '',
  faculte2: '',
  promotion: '',
  confirmation: false,
}

const fieldClass =
  'w-full border border-black/10 bg-white px-4 py-3 text-sm text-uwb-blue outline-none transition focus:border-uwb-red'
const labelClass =
  'mb-1.5 block text-[11px] font-semibold tracking-[0.12em] text-uwb-muted uppercase'

type Props = {
  onSuccess: (reference: string) => void
}

export function AdmissionForm({ onSuccess }: Props) {
  const [values, setValues] = useState<AdmissionFormValues>(empty)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof AdmissionFormValues>(
    key: K,
    value: AdmissionFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!values.confirmation) {
      setError('Veuillez confirmer l’exactitude des informations.')
      return
    }
    if (!values.faculte1 || !values.promotion) {
      setError('Choisissez au minimum la faculté 1 et la promotion.')
      return
    }

    setSubmitting(true)
    const reference = `UWB-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    const payload = {
      reference,
      submittedAt: new Date().toISOString(),
      ...values,
    }

    try {
      const key = 'uwb-admissions-drafts'
      const prev = JSON.parse(localStorage.getItem(key) || '[]') as unknown[]
      localStorage.setItem(key, JSON.stringify([payload, ...prev].slice(0, 20)))
    } catch {
      /* stockage optionnel */
    }

    window.setTimeout(() => {
      setSubmitting(false)
      onSuccess(reference)
    }, 600)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      <fieldset>
        <legend className="font-display text-2xl font-semibold text-uwb-blue">
          Identité
        </legend>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="nom">
              Nom *
            </label>
            <input
              id="nom"
              required
              className={fieldClass}
              value={values.nom}
              onChange={(e) => set('nom', e.target.value)}
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="postnom">
              Postnom *
            </label>
            <input
              id="postnom"
              required
              className={fieldClass}
              value={values.postnom}
              onChange={(e) => set('postnom', e.target.value)}
              placeholder="Votre postnom"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="prenom">
              Prénom *
            </label>
            <input
              id="prenom"
              required
              className={fieldClass}
              value={values.prenom}
              onChange={(e) => set('prenom', e.target.value)}
              placeholder="Votre prénom"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="genre">
              Genre *
            </label>
            <select
              id="genre"
              required
              className={fieldClass}
              value={values.genre}
              onChange={(e) => set('genre', e.target.value)}
            >
              <option value="">Sélectionnez</option>
              {admissionGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="etat">
              État civil *
            </label>
            <select
              id="etat"
              required
              className={fieldClass}
              value={values.etatCivil}
              onChange={(e) => set('etatCivil', e.target.value)}
            >
              <option value="">Sélectionnez</option>
              {admissionEtatCivil.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="nat">
              Nationalité *
            </label>
            <select
              id="nat"
              required
              className={fieldClass}
              value={values.nationalite}
              onChange={(e) => set('nationalite', e.target.value)}
            >
              {admissionNationalites.map((g) => (
                <option key={g} value={g}>
                  {g.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="lieu">
              Lieu de naissance *
            </label>
            <input
              id="lieu"
              required
              className={fieldClass}
              value={values.lieuNaissance}
              onChange={(e) => set('lieuNaissance', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="date_naiss">
              Date de naissance *
            </label>
            <input
              id="date_naiss"
              type="date"
              required
              className={fieldClass}
              value={values.dateNaissance}
              onChange={(e) => set('dateNaissance', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="province">
              Province d’origine *
            </label>
            <input
              id="province"
              required
              className={fieldClass}
              value={values.province}
              onChange={(e) => set('province', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="pere">
              Nom du père *
            </label>
            <input
              id="pere"
              required
              className={fieldClass}
              value={values.pere}
              onChange={(e) => set('pere', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="mere">
              Nom de la mère *
            </label>
            <input
              id="mere"
              required
              className={fieldClass}
              value={values.mere}
              onChange={(e) => set('mere', e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-2xl font-semibold text-uwb-blue">
          Coordonnées
        </legend>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="commune">
              Commune *
            </label>
            <select
              id="commune"
              required
              className={fieldClass}
              value={values.commune}
              onChange={(e) => set('commune', e.target.value)}
            >
              <option value="">Sélectionnez</option>
              {admissionCommunes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="tel">
              Téléphone *
            </label>
            <input
              id="tel"
              type="tel"
              required
              className={fieldClass}
              value={values.telephone}
              onChange={(e) => set('telephone', e.target.value)}
              placeholder="+243 …"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="adresse">
              Adresse (n°, avenue, quartier) *
            </label>
            <input
              id="adresse"
              required
              className={fieldClass}
              value={values.adresse}
              onChange={(e) => set('adresse', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="email">
              Adresse e-mail *
            </label>
            <input
              id="email"
              type="email"
              required
              className={fieldClass}
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-2xl font-semibold text-uwb-blue">
          Parcours scolaire
        </legend>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="num_dip">
              N° diplôme (facultatif)
            </label>
            <input
              id="num_dip"
              className={fieldClass}
              value={values.numDiplome}
              onChange={(e) => set('numDiplome', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="pourc">
              % EXETAT (facultatif)
            </label>
            <input
              id="pourc"
              type="number"
              min={0}
              max={100}
              className={fieldClass}
              value={values.pourcentExetat}
              onChange={(e) => set('pourcentExetat', e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-2xl font-semibold text-uwb-blue">
          Choix de formation
        </legend>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="fac1">
              Faculté / institut — choix 1 *
            </label>
            <select
              id="fac1"
              required
              className={fieldClass}
              value={values.faculte1}
              onChange={(e) => set('faculte1', e.target.value)}
            >
              <option value="">Sélectionnez</option>
              {admissionFaculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="fac2">
              Faculté / institut — choix 2
            </label>
            <select
              id="fac2"
              className={fieldClass}
              value={values.faculte2}
              onChange={(e) => set('faculte2', e.target.value)}
            >
              <option value="">Sélectionnez</option>
              {admissionFaculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="promotion">
              Promotion *
            </label>
            <select
              id="promotion"
              required
              className={fieldClass}
              value={values.promotion}
              onChange={(e) => set('promotion', e.target.value)}
            >
              <option value="">Choix de promotion</option>
              {admissionPromotions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <div className="border border-black/8 bg-uwb-surface p-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-uwb-blue">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-uwb-red"
            checked={values.confirmation}
            onChange={(e) => set('confirmation', e.target.checked)}
            required
          />
          <span>
            Je confirme l’exactitude des informations fournies et j’accepte
            d’être contacté(e) par l’Université William Booth au sujet de mon
            dossier d’inscription.
          </span>
        </label>
      </div>

      {error ? (
        <p className="text-sm font-medium text-uwb-red" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-uwb-muted">
        Démonstration : l’enregistrement est local dans votre navigateur. Aucune
        transmission vers l’université n’a lieu tant que le backend SIGU n’est pas
        branché.
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center bg-uwb-red px-8 py-4 text-sm font-semibold tracking-wide text-white transition hover:bg-uwb-red-dark disabled:opacity-60 sm:w-auto"
      >
        {submitting ? 'Enregistrement…' : 'Enregistrer le brouillon (démo)'}
      </button>
    </form>
  )
}
