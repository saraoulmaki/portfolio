import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
import { CheckIcon, CopyIcon, LinkedInIcon, MailIcon } from './Icons'

/** Copies text to the clipboard, with a fallback for browsers without the async API. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}

export function ContactCard() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onCopy = async () => {
    if (!(await copyText(site.email))) return
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="connect" aria-labelledby="connect-title">
      <span className="connect-icon" aria-hidden="true">
        <MailIcon width={26} height={26} />
      </span>
      <div className="connect-body">
        <h3 id="connect-title" className="connect-title">
          Let&rsquo;s Connect!
        </h3>
        <p className="connect-text">
          Have a question, an opportunity, or just want to say hi? I&rsquo;d love to hear from you.
        </p>

        <div className="connect-actions">
          <button
            type="button"
            className={`btn btn-primary connect-copy${copied ? ' is-copied' : ''}`}
            onClick={onCopy}
            aria-label={copied ? 'Email address copied' : `Copy email address ${site.email}`}
          >
            {copied ? <CheckIcon width={18} height={18} /> : <CopyIcon width={18} height={18} />}
            {copied ? 'Copied!' : 'Copy email'}
          </button>
          <a
            className="btn btn-ghost"
            href={site.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile (opens in a new tab)"
          >
            <LinkedInIcon width={18} height={18} /> LinkedIn
          </a>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </div>

        <p className="connect-note">
          <span className="connect-dot" aria-hidden="true" />
          Open to International Internships · Summer 2027
        </p>
      </div>
    </section>
  )
}
