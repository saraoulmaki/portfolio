/**
 * Long-form "engineering case study" body for a project page.
 * Order: overview → photos → architecture → achievements → video →
 * challenges → results. All content comes from `project.caseStudy`.
 */
import { Fragment } from 'react'
import type { CaseStudy as CaseStudyData, Project } from '../data/projects'
import { ProjectGallery } from './ProjectGallery'
import { ProjectVideo } from './ProjectVideo'
import { Reveal } from './Reveal'
import './CaseStudy.css'

function SectionHead({ num, id, children }: { num: string; id: string; children: string }) {
  return (
    <h2 id={id} className="cs-title">
      <span className="cs-num" aria-hidden="true">
        {num}
      </span>
      {children}
    </h2>
  )
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="m5 12.5 4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="M5 12h13m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function CaseStudy({ project, study }: { project: Project; study: CaseStudyData }) {
  const { architecture: arch } = study
  const order = [
    'overview',
    ...(project.images.length > 0 ? ['photos'] : []),
    'arch',
    'achievements',
    ...(project.video ? ['video'] : []),
    'challenges',
    'results',
  ]
  const num = (key: string) => String(order.indexOf(key) + 1).padStart(2, '0')

  return (
    <div className="cs">
      {/* Overview */}
      <Reveal className="cs-section">
        <section aria-labelledby="cs-overview">
          <SectionHead num={num('overview')} id="cs-overview">
            Project overview
          </SectionHead>
          <div className="cs-overview">
            {study.overview.map((p, i) => (
              <p key={i} className={i === 0 ? 'cs-lead' : undefined}>
                {p}
              </p>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Photos */}
      {project.images.length > 0 && (
        <Reveal className="cs-section">
          <section aria-labelledby="cs-photos">
            <SectionHead num={num('photos')} id="cs-photos">
              Photos
            </SectionHead>
            <ProjectGallery key={project.slug} images={project.images} title={project.title} />
          </section>
        </Reveal>
      )}

      {/* Architecture */}
      <Reveal className="cs-section">
        <section aria-labelledby="cs-arch">
          <SectionHead num={num('arch')} id="cs-arch">
            System concept &amp; architecture
          </SectionHead>
          <p className="cs-text">{arch.intro}</p>

          <div className="cs-diagram">
            <p className="cs-diagram-label">{arch.diagramLabel ?? 'Planned system'}</p>
            <ol className="cs-flow">
              {arch.blocks.map((b, i) => (
                <Fragment key={b.title}>
                  <li className="cs-block">
                    <h3>{b.title}</h3>
                    <ul>
                      {b.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </li>
                  {arch.links[i] && (
                    <li className={`cs-link${arch.links[i].planned ? ' is-planned' : ''}`} aria-label={`Link: ${arch.links[i].label}${arch.links[i].planned ? ' (planned)' : ''}`}>
                      <span className="cs-link-line" aria-hidden="true" />
                      <span className="cs-link-label" aria-hidden="true">
                        {arch.links[i].label}
                        {arch.links[i].planned && <em>planned</em>}
                      </span>
                    </li>
                  )}
                </Fragment>
              ))}
            </ol>
          </div>

          <div className="cs-tested">
            <p className="cs-diagram-label">
              <span className="cs-pill is-ok">
                <CheckIcon /> Tested
              </span>
              {arch.tested.title}
            </p>
            <ol className="cs-chain">
              {arch.tested.steps.map((s, i) => (
                <li key={s}>
                  <span className="cs-step">{s}</span>
                  {i < arch.tested.steps.length - 1 && (
                    <span className="cs-chev">
                      <ArrowIcon />
                    </span>
                  )}
                </li>
              ))}
            </ol>
            {arch.tested.note && <p className="cs-note">{arch.tested.note}</p>}
          </div>
        </section>
      </Reveal>

      {/* Achievements */}
      <section className="cs-section" aria-labelledby="cs-achievements">
        <Reveal>
          <SectionHead num={num('achievements')} id="cs-achievements">
            {study.achievementsTitle ?? 'Prototype achievements'}
          </SectionHead>
        </Reveal>
        <ul className="cs-achievements">
          {study.achievements.map((a, i) => (
            <Reveal as="li" key={a.title} className="cs-ach" delay={(i % 3) * 0.07}>
              <span className="cs-ach-icon">
                <CheckIcon />
              </span>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Video */}
      {project.video && (
        <Reveal className="cs-section">
          <ProjectVideo video={project.video} title={project.title} num={num('video')} />
        </Reveal>
      )}

      {/* Challenges */}
      <section className="cs-section" aria-labelledby="cs-challenges">
        <Reveal>
          <SectionHead num={num('challenges')} id="cs-challenges">
            Challenges &amp; Limitations
          </SectionHead>
        </Reveal>
        <div className="cs-challenges">
          {study.challenges.map((c, i) => (
            <Reveal as="article" key={c.title} className="cs-challenge" delay={i * 0.08}>
              <span className={`cs-pill ${c.planned ? 'is-planned' : 'is-partial'}`}>
                {c.pill ?? (c.planned ? 'Planned · not yet integrated' : 'Not completed in time')}
              </span>
              <h3>{c.title}</h3>
              {c.body.slice(0, 1).map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {c.considered && (
                <>
                  <p className="cs-considered-label">Options we considered</p>
                  <ul className="cs-considered">
                    {c.considered.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </>
              )}
              {c.body.slice(1).map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Results */}
      <Reveal className="cs-section">
        <section aria-labelledby="cs-results" className="cs-results">
          <SectionHead num={num('results')} id="cs-results">
            Results &amp; What I Learned
          </SectionHead>
          {study.results.body.map((p, i) => (
            <p key={i} className="cs-text">
              {p}
            </p>
          ))}
          <ul className="cs-learned" aria-label="Skills developed">
            {study.results.learned.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      </Reveal>
    </div>
  )
}
