import { site } from '../data/site'
import { Reveal } from '../components/Reveal'
import { GitHubIcon, LinkedInIcon } from '../components/Icons'
import './About.css'

// Tools from my projects, university labs and work experience, in small groups.
const toolbox = [
  { group: 'Digital & FPGA', tools: ['VHDL', 'RTL simulation', 'Intel DE10-Lite'] },
  { group: 'Embedded', tools: ['C / C++', 'STM32', 'PIC24', 'FreeRTOS'] },
  { group: 'Hardware', tools: ['PCB design', 'KiCad'] },
  { group: 'Software', tools: ['Qt / C++', 'Python'] },
]

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <Reveal className="about-copy">
          <p className="eyebrow">03 — About</p>
          <h2 id="about-title" className="section-title">
            Curious about how things work — and how to build them.
          </h2>
          <div className="about-text">
            <p>
              I&rsquo;m {site.firstName}, an engineering student at {site.school}, specializing in
              embedded systems, digital electronics and FPGA design.
            </p>
            <p>
              What I enjoy most is the moment a design leaves the screen and becomes something
              real: a signal showing up on a display, a board that responds, a small object
              assembled piece by piece. I like understanding a system from the hardware up,
              and I learn best by building, testing and trying again.
            </p>
            <p>
              Outside of engineering I keep making things with my hands — kits, mechanisms,
              sketches and experiments. This site is where I collect both sides, and it will
              keep evolving as I do.
            </p>
          </div>
        </Reveal>

        <Reveal className="about-side" delay={0.1}>
          <div className="about-card">
            <p className="about-card-label">Currently</p>
            <dl className="about-facts">
              <div>
                <dt>Studying</dt>
                <dd>Engineering at {site.school}, France</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Embedded systems · Digital electronics · FPGA</dd>
              </div>
              <div>
                <dt>Looking for</dt>
                <dd>An international engineering internship</dd>
              </div>
            </dl>
          </div>

          <div className="about-card">
            <p className="about-card-label">Toolbox</p>
            <dl className="about-tools">
              {toolbox.map(({ group, tools }) => (
                <div key={group}>
                  <dt>{group}</dt>
                  <dd>
                    <ul className="tag-list">
                      {tools.map((t) => (
                        <li key={t} className="tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="about-links">
            <a className="btn btn-ghost" href={site.socials.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon width={18} height={18} /> LinkedIn
            </a>
            <a className="btn btn-ghost" href={site.socials.github} target="_blank" rel="noreferrer">
              <GitHubIcon width={18} height={18} /> GitHub
            </a>
          </div>
          <p className="about-note hand" aria-hidden="true">
            always learning, always tinkering ✎
          </p>
        </Reveal>
      </div>
    </section>
  )
}
