import { projects } from '../data/projects'
import { ProjectCard } from '../components/ProjectCard'
import { Reveal } from '../components/Reveal'
import './Projects.css'

export function Projects() {
  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <div className="container">
        <Reveal className="projects-head">
          <div>
            <p className="eyebrow">01 — Engineering</p>
            <h2 id="projects-title" className="section-title">
              Engineering projects
            </h2>
          </div>
          <p className="section-lead">
            Digital design, embedded software and electronics — from coursework
            to personal builds. Detailed write-ups are on the way.
          </p>
        </Reveal>

        <ul className="projects-grid">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.08}>
              <ProjectCard project={p} index={i} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
