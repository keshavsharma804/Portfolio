import { Marquee, MarqueeItem } from '@/components/effects/marquee'
import { skillGroups } from '@/content/profile'

const items = skillGroups.flatMap((group) => group.items)

/**
 * Marquee already renders its children twice for a seamless loop, so the item
 * list is passed once. Reusing the primitive gets the reduced-motion pause and
 * hover-to-pause behaviour instead of a hand-rolled keyframe loop.
 */
export function TechMarquee({ className }: { className?: string }) {
  return (
    <div className={`border-y border-line py-3 ${className ?? ''}`} aria-hidden="true">
      <Marquee speed={46}>
        {items.map((item) => (
          <MarqueeItem key={item} className="gap-8">
            <span className="font-mono text-2xs tracking-label whitespace-nowrap text-fg-subtle uppercase">
              {item}
            </span>
            <span className="size-1 shrink-0 rotate-45 bg-accent/50" />
          </MarqueeItem>
        ))}
      </Marquee>
    </div>
  )
}
