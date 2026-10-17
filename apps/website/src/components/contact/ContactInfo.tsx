import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
} from 'lucide-react'
import { contactChannels, contactCopy } from '../../data/contact'
import type { ContactChannel } from '../../types/contact'
import { Reveal } from '../motion/Reveal'

const icons = {
  address: MapPin,
  phone: Phone,
  email: Mail,
  website: Globe,
} as const

function ChannelCard({ channel, delay }: { channel: ContactChannel; delay: number }) {
  const Icon =
    channel.id === 'name'
      ? Building2
      : icons[channel.kind] ?? MapPin

  const isExternal =
    channel.href.startsWith('http') ||
    channel.href.startsWith('tel:') ||
    channel.href.startsWith('mailto:')

  return (
    <Reveal delay={delay}>
      <article className="group flex h-full flex-col border border-black/8 bg-white p-6 transition hover:border-uwb-red/30">
        <Icon
          className="h-6 w-6 text-uwb-red transition group-hover:scale-105"
          aria-hidden
          strokeWidth={1.5}
        />
        <p className="mt-4 text-[11px] font-semibold tracking-[0.2em] text-uwb-muted uppercase">
          {channel.label}
        </p>
        <p className="mt-2 font-display text-xl font-semibold text-uwb-navy break-words">
          {channel.value}
        </p>
        {channel.note ? (
          <p className="mt-2 text-xs text-uwb-muted">{channel.note}</p>
        ) : null}
        {channel.id !== 'name' ? (
          <a
            href={channel.href}
            {...(channel.href.startsWith('http')
              ? { target: '_blank', rel: 'noreferrer' }
              : {})}
            className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-uwb-red outline-none transition hover:underline focus-visible:ring-2 focus-visible:ring-uwb-red/40"
          >
            {channel.actionLabel}
            {isExternal && channel.href.startsWith('http') ? (
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            ) : null}
          </a>
        ) : null}
      </article>
    </Reveal>
  )
}

export function ContactInfo() {
  const { info } = contactCopy
  const cards = contactChannels.filter((c) => c.id !== 'name')

  return (
    <section
      id="coordonnees"
      className="scroll-mt-28 bg-uwb-surface py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {info.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {info.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {info.intro}
          </p>
          <p className="mt-4 font-display text-2xl font-semibold text-uwb-navy">
            {contactChannels.find((c) => c.id === 'name')?.value}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((channel, i) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              delay={Math.min(i * 0.05, 0.3)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
