import { useEffect, useLayoutEffect, useRef, type MouseEvent } from 'react'
import { MotionConfig } from 'motion/react'
import { navItems } from './data/site'
import { getProject } from './data/projects'
import { useActiveSection } from './hooks/useActiveSection'
import { useHashRoute } from './hooks/useHashRoute'
import { useTheme } from './hooks/useTheme'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Playground } from './sections/Playground'
import { About } from './sections/About'
import { ProjectPage } from './pages/ProjectPage'

const sectionIds = navItems.map((n) => n.id)

function skipToMain(e: MouseEvent<HTMLAnchorElement>) {
  // Handled manually so it doesn't change the hash route.
  e.preventDefault()
  const main = document.getElementById('main')
  main?.focus()
  main?.scrollIntoView()
}

export default function App() {
  const route = useHashRoute()
  const { theme, toggle } = useTheme()
  const isHome = route.name === 'home'
  const active = useActiveSection(sectionIds, isHome)
  const prevRoute = useRef(route.name)

  // Scroll handling when switching between home and a project page.
  useLayoutEffect(() => {
    const cameFromProject = prevRoute.current === 'project'
    prevRoute.current = route.name
    if (route.name === 'project') {
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else if (cameFromProject) {
      const el = route.anchor ? document.getElementById(route.anchor) : null
      if (el) el.scrollIntoView({ behavior: 'instant' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [route])

  useEffect(() => {
    const project = route.name === 'project' ? getProject(route.slug) : undefined
    document.title = project ? `${project.title} — Sara Oulmaki` : 'Sara Oulmaki — Engineering & Making'
  }, [route])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link" onClick={skipToMain}>
        Skip to content
      </a>
      <Navbar active={isHome ? active : 'projects'} theme={theme} onToggleTheme={toggle} />

      {route.name === 'project' ? (
        <ProjectPage slug={route.slug} />
      ) : (
        <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
          <Hero theme={theme} />
          <Projects />
          <Playground />
          <About />
        </main>
      )}

      <Footer />
    </MotionConfig>
  )
}
