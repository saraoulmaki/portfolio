/**
 * Detail page for a project (#/projects/<slug>).
 * Renders `sections` from the data file, or a planned outline until they exist.
 */
import { motion } from 'motion/react'
import { getProject, plannedSections, projects } from '../data/projects'
import { projectHref } from '../hooks/useHashRoute'
import { ProjectVisual } from '../components/ProjectVisual'
import { ProjectGallery } from '../components/ProjectGallery'
import { ProjectVideo } from '../components/ProjectVideo'
import { CaseStudy } from '../components/CaseStudy'
import { ArrowLeftIcon, ArrowRightIcon } from '../components/Icons'
import './ProjectPage.css'

export function ProjectPage({ slug }: { slug: string }) {
  const project = getProject(slug)

  if (!project) {
    return (
      <main id="main" className="project-page container">
        <a className="back-link" href="#projects">
          <ArrowLeftIcon width={18} height={18} /> All projects
        </a>
        <h1 className="pp-title">Project not found</h1>
        <p className="pp-summary">This project doesn&rsquo;t exist (yet).</p>
      </main>
    )
  }

  const idx = projects.indexOf(project)
  const next = projects[(idx + 1) % projects.length]
  const hasContent = project.sections && project.sections.length > 0
  const study = project.caseStudy

  return (
    <main id="main" className="project-page" tabIndex={-1} style={{ outline: 'none' }}>
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <a className="back-link" href="#projects">
          <ArrowLeftIcon width={18} height={18} /> All projects
        </a>

        <header className="pp-header">
          <p className="eyebrow">{project.category}</p>
          <h1 className="pp-title">{project.title}</h1>
          {project.meta && <p className="pp-meta">{project.meta}</p>}
          {project.status && project.status.length > 0 && (
            <ul className="pp-status" aria-label="Project status">
              {project.status.map((st) => (
                <li key={st.label} className={`cs-pill is-${st.tone}`}>
                  {st.label}
                </li>
              ))}
            </ul>
          )}
          {study ? null : project.summary ? (
            <p className="pp-summary">{project.summary}</p>
          ) : (
            <p className="pp-summary is-pending">Project description coming soon.</p>
          )}
          {project.tags.length > 0 ? (
            <ul className="tag-list" aria-label="Technologies">
              {project.tags.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <p className="pp-pending-note">Technologies to be added.</p>
          )}
          {project.links && project.links.length > 0 && (
            <div className="pp-links">
              {project.links.map((l) => (
                <a key={l.href} className="btn btn-ghost" href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </header>

        {study ? (
          <CaseStudy project={project} study={study} />
        ) : (
          <>
            <div className="pp-media">
              {project.images.length > 0 ? (
                <ProjectGallery key={project.slug} images={project.images} title={project.title} />
              ) : (
                <div className="pp-visual">
                  <ProjectVisual motif={project.motif} title={project.title} />
                </div>
              )}
            </div>

            {project.video && <ProjectVideo video={project.video} title={project.title} />}

            {hasContent ? (
              <div className="pp-content">
                {project.sections!.map((s) => (
                  <section key={s.heading}>
                    <h2>{s.heading}</h2>
                    <p>{s.body}</p>
                  </section>
                ))}
              </div>
            ) : (
              <div className="pp-wip">
                <p className="pp-wip-title">
                  <span className="hand">Write-up in progress</span>
                </p>
                <p className="pp-wip-text">
                  This page is a placeholder. The full project story is coming soon and will cover:
                </p>
                <ol className="pp-outline">
                  {plannedSections.map((s, i) => (
                    <li key={s}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}

        {next !== project && (
          <a className="pp-next" href={projectHref(next.slug)}>
            <span className="pp-next-label">Next project</span>
            <span className="pp-next-title">
              {next.title} <ArrowRightIcon width={20} height={20} />
            </span>
          </a>
        )}
      </motion.div>
    </main>
  )
}
