import { site } from '../data/site'
import { GitHubIcon, LinkedInIcon } from './Icons'
import './Footer.css'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {year} {site.name}
          <span className="footer-dim"> · Built with React &amp; Three.js</span>
        </p>
        <div className="footer-links">
          <a className="icon-btn" href={site.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub profile (opens in a new tab)">
            <GitHubIcon />
          </a>
          <a className="icon-btn" href={site.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile (opens in a new tab)">
            <LinkedInIcon />
          </a>
          <a className="footer-top" href="#home">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
