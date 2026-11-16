import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { navItems, site } from '../data/site'
import type { Theme } from '../hooks/useTheme'
import { CloseIcon, GitHubIcon, LinkedInIcon, MenuIcon, MoonIcon, SunIcon } from './Icons'
import './Navbar.css'

interface Props {
  active: string
  theme: Theme
  onToggleTheme: () => void
}

export function Navbar({ active, theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu with Escape or when resizing to desktop.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const mq = window.matchMedia('(min-width: 861px)')
    const onMq = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  const links = navItems.map((item) => (
    <li key={item.id}>
      <a
        href={`#${item.id}`}
        className={`nav-link${active === item.id ? ' is-active' : ''}`}
        aria-current={active === item.id ? 'location' : undefined}
        onClick={() => setOpen(false)}
      >
        {item.label}
      </a>
    </li>
  ))

  const isDark = theme === 'dark'

  return (
    <header className={`navbar${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <nav className="navbar-inner container" aria-label="Main">
        <a href="#home" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <path d="M16 3 28 9.5v13L16 29 4 22.5v-13Z" fill="var(--blue)" />
              <path d="M16 3 28 9.5 16 16 4 9.5Z" fill="#fff" fillOpacity="0.3" />
              <circle cx="21.5" cy="19.5" r="2.4" fill="var(--orange)" />
            </svg>
          </span>
          <span className="brand-name">
            Sara<span className="brand-dim"> Oulmaki</span>
          </span>
        </a>

        <ul className="nav-links">{links}</ul>

        <div className="nav-actions">
          <a className="icon-btn" href={site.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub profile (opens in a new tab)">
            <GitHubIcon />
          </a>
          <a className="icon-btn" href={site.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile (opens in a new tab)">
            <LinkedInIcon />
          </a>
          <button
            type="button"
            className="icon-btn theme-toggle"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'grid' }}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="container">{links}</ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
