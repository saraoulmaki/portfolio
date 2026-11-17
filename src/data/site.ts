/**
 * Global site content: identity, navigation, social links.
 * Edit this file to update personal info without touching components.
 */

export const site = {
  name: 'Sara Oulmaki',
  firstName: 'Sara',
  school: 'Polytech Tours',
  tagline:
    'I’m an engineering student who enjoys exploring how electronics, code, and creativity come together — from embedded systems and digital hardware to hands-on projects.',
  email: 'sarah.oulmaki@gmail.com',
  resumeUrl: 'https://github.com/saraoulmaki/saraoulmaki/blob/main/Resume_Sara_OULMAKI.pdf',

  socials: {
    github: 'https://github.com/saraoulmaki',
    linkedin: 'https://www.linkedin.com/in/sara-oulmaki',
  },
} as const

export type SectionId = 'home' | 'projects' | 'playground' | 'about'

export const navItems: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'playground', label: 'Playground' },
  { id: 'about', label: 'About' },
]

/** Internship search shown in the hero. */
export const internship = {
  title: 'Open to International Internships',
  when: 'Summer 2027',
  details:
    'Seeking a 10-week engineering internship, ideally from late June to early September 2027.',
  areas: ['Embedded Systems', 'Electronics', 'FPGA Design & Verification', 'Software Engineering'],
}
