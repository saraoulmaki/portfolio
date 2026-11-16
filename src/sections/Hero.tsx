import { motion } from 'motion/react'
import { internship, site } from '../data/site'
import type { Theme } from '../hooks/useTheme'
import { HeroVisual } from '../components/HeroVisual'
import { ArrowRightIcon, ArrowUpRightIcon } from '../components/Icons'
import './Hero.css'

const ease = [0.22, 1, 0.36, 1] as const

const item = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
})

export function Hero({ theme }: { theme: Theme }) {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-grid container">
        <div className="hero-copy">
          <motion.p className="hero-kicker" {...item(0)}>
            <span className="hero-kicker-dot" aria-hidden="true" />
            Engineering student · {site.school}
          </motion.p>

          <motion.h1 id="hero-title" className="hero-title" {...item(0.08)}>
            Hi, I&rsquo;m{' '}
            <span className="hero-underline">
              {site.firstName}
              <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  d="M3 13 C 40 5, 90 4, 120 9 S 180 15, 197 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.7, ease: 'easeInOut' }}
                />
              </svg>
            </span>
            .
          </motion.h1>

          <motion.p className="hero-text" {...item(0.16)}>
            {site.tagline}
          </motion.p>

          <motion.section className="hero-internship" aria-labelledby="internship-title" {...item(0.24)}>
            <h2 id="internship-title" className="hi-title">
              <span className="hi-status" aria-hidden="true" />
              <span>
                {internship.title} — <span className="hi-when">{internship.when}</span>
              </span>
            </h2>
            <p className="hi-details">{internship.details}</p>
            <p className="hi-label">Areas of interest</p>
            <ul className="hi-areas" aria-label="Areas of interest">
              {internship.areas.map((a) => (
                <li key={a} className="skill-chip">
                  {a}
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.div className="hero-cta" {...item(0.32)}>
            <a href={site.resumeUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
              View my resume (PDF)
              <ArrowUpRightIcon width={18} height={18} />
            </a>
            <a href="#projects" className="btn btn-ghost">
              Explore my projects
              <ArrowRightIcon width={18} height={18} />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual-wrap"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
        >
          <HeroVisual theme={theme} />
        </motion.div>
      </div>
    </section>
  )
}
