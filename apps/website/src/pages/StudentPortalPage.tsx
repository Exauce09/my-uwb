import { PortalHomeContent } from '../components/portal/PortalHomeContent'
import { PortalShell } from '../components/portal/PortalShell'

export function StudentPortalPage() {
  return (
    <PortalShell role="student" title="Espace étudiant">
      <PortalHomeContent role="student" />
    </PortalShell>
  )
}
