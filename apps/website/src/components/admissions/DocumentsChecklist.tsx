import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import {
  admissionDocuments,
  admissionsCopy,
  CHECKLIST_STORAGE_KEY,
} from '../../data/admissions'
import { Reveal } from '../motion/Reveal'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'

function loadChecked(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, boolean>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function DocumentsChecklist() {
  const { documents } = admissionsCopy
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setChecked(loadChecked())
  }, [])

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const done = admissionDocuments.filter((d) => checked[d.id]).length

  return (
    <section
      id="documents-admission"
      className="scroll-mt-28 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {documents.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {documents.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {documents.intro}
          </p>
          <p className="mt-2 text-xs text-uwb-muted/80">
            {documents.storageNote} {documents.noUploadNote}
          </p>
          <p className="mt-4 text-sm font-medium text-uwb-navy" aria-live="polite">
            {done} / {admissionDocuments.length} éléments préparés
          </p>
        </Reveal>

        <ul className="mt-10 space-y-3" role="list">
          {admissionDocuments.map((doc, i) => {
            const isOn = Boolean(checked[doc.id])
            return (
              <Reveal key={doc.id} delay={Math.min(i * 0.04, 0.28)}>
                <li>
                  <label
                    className={`flex cursor-pointer gap-4 border p-5 transition focus-within:ring-2 focus-within:ring-uwb-red/40 ${
                      isOn
                        ? 'border-uwb-red/30 bg-uwb-red/[0.03]'
                        : 'border-black/8 bg-uwb-surface/40 hover:border-black/15'
                    }`}
                  >
                    <span className="relative mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={isOn}
                        onChange={() => toggle(doc.id)}
                      />
                      <span
                        className={`flex h-5 w-5 items-center justify-center border transition peer-focus-visible:ring-2 peer-focus-visible:ring-uwb-red/50 ${
                          isOn
                            ? 'border-uwb-red bg-uwb-red text-white'
                            : 'border-black/25 bg-white'
                        }`}
                        aria-hidden
                      >
                        {isOn ? <Check className="h-3.5 w-3.5" /> : null}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-lg font-semibold text-uwb-navy">
                          {doc.name}
                        </span>
                        {doc.required === true ? (
                          <span className="text-[10px] font-semibold tracking-wider text-uwb-red uppercase">
                            Requis (formulaire)
                          </span>
                        ) : null}
                        {doc.required === false ? (
                          <span className="text-[10px] font-semibold tracking-wider text-uwb-muted uppercase">
                            Facultatif (formulaire)
                          </span>
                        ) : null}
                        {!doc.verified ? <ProvisionalBadge /> : null}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-uwb-muted">
                        {doc.explanation}
                      </span>
                    </span>
                  </label>
                </li>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
