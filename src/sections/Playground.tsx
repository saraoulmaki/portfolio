import type { ComponentType, SVGProps } from 'react'
import { items, originLabels, shelves, type Origin, type PlaygroundItem, type Shelf } from '../data/playground'
import { BoxIcon, FlaskIcon, GearIcon, PencilIcon } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { ProjectGallery } from '../components/ProjectGallery'
import './Playground.css'

const shelfIcons: Record<Shelf['icon'], ComponentType<SVGProps<SVGSVGElement>>> = {
  box: BoxIcon,
  gear: GearIcon,
  pencil: PencilIcon,
  flask: FlaskIcon,
}

export function OriginBadge({ origin }: { origin: Origin }) {
  return <span className={`origin-badge origin-${origin}`}>{originLabels[origin].label}</span>
}

function ItemCard({ item }: { item: PlaygroundItem }) {
  return (
    <li className="pg-item">
      <div className="pg-item-body">
        <OriginBadge origin={item.origin} />
        <h4>{item.title}</h4>
        {item.subtitle && <p className="pg-item-sub">{item.subtitle}</p>}
        {item.description.map((para) => (
          <p key={para}>{para}</p>
        ))}
        {item.note && <p className="pg-item-note hand">{item.note}</p>}
        {item.origin === 'kit' && item.kitCredit && <p className="pg-credit">Kit design: {item.kitCredit}</p>}
      </div>
      {item.images && item.images.length > 0 && (
        <div className="pg-item-media">
          <ProjectGallery images={item.images} title={item.title} />
        </div>
      )}
    </li>
  )
}

// Only shelves that have entries are shown, so the section never displays
// empty placeholders. Adding an item to another shelf makes it appear.
const visibleShelves = shelves.filter((shelf) => items.some((it) => it.shelf === shelf.id))

export function Playground() {
  return (
    <section id="playground" className="playground" aria-labelledby="playground-title">
      <div className="container">
        <Reveal className="pg-head">
          <p className="eyebrow">02 — Beyond engineering</p>
          <h2 id="playground-title" className="section-title">
            Creative playground
          </h2>
          <p className="section-lead">
            A corner for things I make outside of engineering: miniature kits, mechanical
            constructions, sketches and small experiments.
          </p>
        </Reveal>

        <Reveal className="pg-legend" delay={0.05}>
          <p className="pg-legend-title">How to read this section</p>
          <dl>
            {(Object.keys(originLabels) as Origin[]).map((o) => (
              <div key={o} className="pg-legend-row">
                <dt>
                  <OriginBadge origin={o} />
                </dt>
                <dd>{originLabels[o].explain}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <ul className="pg-shelves">
          {visibleShelves.map((shelf, i) => {
            const Icon = shelfIcons[shelf.icon]
            const shelfItems = items.filter((it) => it.shelf === shelf.id)
            return (
              <Reveal as="li" key={shelf.id} className="pg-shelf" delay={i * 0.06}>
                <div className="pg-shelf-head">
                  <span className="pg-shelf-icon">
                    <Icon width={22} height={22} />
                  </span>
                  <div>
                    <h3>{shelf.title}</h3>
                    <p>{shelf.blurb}</p>
                  </div>
                </div>
                <ul className="pg-items">
                  {shelfItems.map((it) => (
                    <ItemCard key={it.slug} item={it} />
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
