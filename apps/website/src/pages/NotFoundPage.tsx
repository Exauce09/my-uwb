import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold tracking-[0.2em] text-uwb-red uppercase">
        Erreur 404
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-uwb-blue">
        Page introuvable
      </h1>
      <p className="mt-4 text-uwb-muted">
        La page demandée n’existe pas ou a été déplacée. Revenez à l’accueil ou
        explorez les facultés et actualités.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button to="/">Accueil</Button>
        <Button to="/facultes" variant="ghost">
          Facultés
        </Button>
      </div>
    </div>
  )
}
