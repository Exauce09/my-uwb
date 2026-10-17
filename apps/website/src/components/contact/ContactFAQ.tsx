import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { contactCopy, contactFaq } from '../../data/contact'
import { Reveal } from '../motion/Reveal'

export function ContactFAQ() {
  const { faq } = contactCopy
  const baseId = useId()
  const reduced = useReducedMotion()
  const [openId, setOpenId] = useState<string | null>(contactFaq[0]?.id ?? null)

  return (
    <section
      id="faq-contact"
      className="scroll-mt-28 border-y border-black/5 bg-uwb-surface py-16 lg:py-20"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {faq.kicker}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {faq.title}
          </h2>
          <p className="mt-3 text-sm text-uwb-muted md:text-base">{faq.intro}</p>
        </Reveal>

        <div className="mt-10 divide-y divide-black/8 border border-black/8 bg-white">
          {contactFaq.map((item) => {
            const isOpen = openId === item.id
            const panelId = `${baseId}-${item.id}-panel`
            const buttonId = `${baseId}-${item.id}-button`

            return (
              <div key={item.id}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none transition hover:bg-uwb-surface/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-uwb-red/40"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    <span className="font-display text-lg font-semibold text-uwb-navy">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-uwb-red transition duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-uwb-muted">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
