import { Link } from "react-router-dom";
import { Alert } from "../components/ui/Alert";

export function InstitutionPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-[var(--sigu-ink)]">
        Paramètres institutionnels
      </h2>
      <Alert tone="info">
        Les facultés, programmes, années et niveaux se gèrent dans le{" "}
        <Link
          to="/academic-referential"
          className="font-medium text-[var(--sigu-accent)] underline"
        >
          référentiel académique
        </Link>
        . L’établissement (identité légale, campus) reste hors de ce module pour
        l’instant.
      </Alert>
    </div>
  );
}
