import type { Project } from '../data/projects'
import { projectHref } from '../hooks/useHashRoute'
import { ArrowUpRightIcon } from './Icons'
import { ProjectVisual } from './ProjectVisual'

/** Cards show the first few technologies; the full list is on the project page. */
const MAX_CARD_TAGS = 5

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const shownTags = project.tags.slice(0, MAX_CARD_TAGS)
  const hiddenCount = project.tags.length - shownTags.length
  return (
    <article className="project-card">
      <ProjectVisual image={project.images[0]} motif={project.motif} title={project.title} />
      <div className="project-body">
        <p className="project-meta">
          <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
          {project.category}
          {project.meta && <span className="project-meta-extra"> · {project.meta}</span>}
        </p>
        <h3 className="project-title">
          {/* The stretched link makes the whole card clickable while keeping one tab stop. */}
          <a href={projectHref(project.slug)} className="project-link">
            {project.title}
          </a>
        </h3>
        {project.summary ? (
          <p className="project-summary">{project.summary}</p>
        ) : (
          <p className="project-summary is-pending">Description coming soon.</p>
        )}
        {project.tags.length > 0 && (
          <ul className="tag-list project-tags" aria-label="Technologies">
            {shownTags.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
            {hiddenCount > 0 && (
              <li className="tag tag-more" aria-label={`and ${hiddenCount} more on the project page`}>
                +{hiddenCount}
              </li>
            )}
          </ul>
        )}
        <span className="project-cta" aria-hidden="true">
          View project <ArrowUpRightIcon width={16} height={16} />
        </span>
      </div>
    </article>
  )
}
