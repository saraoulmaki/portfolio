/**
 * Creative playground — work beyond engineering.
 *
 * Every item must declare its `origin`:
 *   - 'kit'      → assembled from an existing kit (credit the kit's maker)
 *   - 'original' → designed by me
 * The UI shows a distinct badge for each so the difference is always clear.
 *
 * Shelves without items show a "coming soon" placeholder. A shelf that has
 * items spans the full width of the grid.
 *
 * Photos: public/images/playground/<slug>/<NN>-<short-description>.jpg,
 * referenced without "public/" (same convention as projects).
 */

import type { ProjectImage } from './projects'

export type Origin = 'kit' | 'original'

export type ShelfId = 'kits' | 'mechanical' | 'sketches' | 'experiments'

export interface Shelf {
  id: ShelfId
  title: string
  blurb: string
  icon: 'box' | 'gear' | 'pencil' | 'flask'
}

export interface PlaygroundItem {
  slug: string
  title: string
  shelf: ShelfId
  origin: Origin
  /** Short line under the title, e.g. "Rolife DIY Miniature Kits · Personal Projects". */
  subtitle?: string
  /** One string per paragraph. */
  description: string[]
  /** Optional closing thought, shown in the handwritten font. */
  note?: string
  /** Required in spirit for kits: who designed / sells the kit. */
  kitCredit?: string
  /** Photos; the first one is shown first in the gallery. */
  images?: ProjectImage[]
  date?: string
}

export const originLabels: Record<Origin, { label: string; explain: string }> = {
  kit: {
    label: 'Kit build',
    explain: 'Assembled from an existing kit — the design credit goes to its maker.',
  },
  original: {
    label: 'Original',
    explain: 'Designed by me, from idea to finished object.',
  },
}

export const shelves: Shelf[] = [
  {
    id: 'kits',
    title: 'Miniature kit builds',
    blurb: 'Small-scale models assembled piece by piece.',
    icon: 'box',
  },
  {
    id: 'mechanical',
    title: 'Mechanical constructions',
    blurb: 'Gears, linkages and things that move.',
    icon: 'gear',
  },
  {
    id: 'sketches',
    title: 'Sketches',
    blurb: 'Drawings, ideas and early concepts on paper.',
    icon: 'pencil',
  },
  {
    id: 'experiments',
    title: 'Creative experiments',
    blurb: 'Small tests and side-quests across materials and media.',
    icon: 'flask',
  },
]

const img = (slug: string, file: string, alt: string, width: number, height: number): ProjectImage => ({
  src: `images/playground/${slug}/${file}`,
  alt,
  width,
  height,
})

export const items: PlaygroundItem[] = [
  {
    slug: 'miniature-builds',
    title: 'Miniature Builds',
    subtitle: 'Rolife DIY Miniature Kits · Personal Projects',
    shelf: 'kits',
    origin: 'kit',
    kitCredit: 'Rolife',
    description: [
      'A collection of miniature scenes I’ve assembled in my free time. I enjoy the hands-on process of putting together tiny furniture, working with intricate details, and bringing each scene to life through lighting and decoration.',
      'These are commercially designed DIY kits by Rolife, assembled by me rather than original designs.',
    ],
    note: 'For me, making things isn’t always about designing something from scratch — sometimes it’s simply about enjoying the process of building.',
    images: [
      {
        ...img(
          'miniature-builds',
          '01-coffee-shop-front.jpg',
          'Miniature coffee shop with a glass roof, a lit pendant lamp over the counter, two bar stools and an outdoor table',
          1200,
          1600,
        ),
        caption: 'Miniature Coffee Shop — front view, lit by its pendant lamp',
      },
      {
        ...img(
          'miniature-builds',
          '02-coffee-shop-angle.jpg',
          'The miniature coffee shop from an angle, showing the coffee machine, pastry display case and shelves of tiny cups',
          1200,
          1600,
        ),
        caption: 'Miniature Coffee Shop — the counter, coffee machine and pastry display',
      },
      {
        ...img(
          'miniature-builds',
          '03-living-room-lit.jpg',
          'Miniature living room lit by its tiny chandelier: a red leather sofa, a chess table, a fireplace and a wall of bookshelves',
          1200,
          1600,
        ),
        caption: 'Miniature Living Room — lit by its tiny chandelier',
      },
      {
        ...img(
          'miniature-builds',
          '04-living-room-top-view.jpg',
          'The same miniature living room seen from above, showing the parquet floor, rug, chess set, fireplace and the “Living room” sign on the base',
          1200,
          1600,
        ),
        caption: 'Miniature Living Room — seen from above',
      },
    ],
  },
]
