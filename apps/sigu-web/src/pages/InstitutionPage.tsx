import { Alert } from "../components/ui/Alert";

export function InstitutionPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-[var(--sigu-ink)]">
        Paramètres institutionnels
      </h2>
      <Alert tone="info">
        Module à venir (établissement, facultés, années académiques). Aucune
        route backend n’existe encore pour cette section.
      </Alert>
    </div>
  );
}
