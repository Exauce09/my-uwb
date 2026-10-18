import { PortalHomeContent } from '../components/portal/PortalHomeContent'
import { PortalShell } from '../components/portal/PortalShell'

export function TeacherPortalPage() {
  return (
    <PortalShell role="teacher" title="Espace enseignant">
      <PortalHomeContent role="teacher" />
    </PortalShell>
  )
}
