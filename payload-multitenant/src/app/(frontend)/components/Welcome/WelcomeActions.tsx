import React from 'react'

interface WelcomeActionsProps {
  adminRoute: string
  showDocs?: boolean
}

export function WelcomeActions({ adminRoute, showDocs = true }: WelcomeActionsProps) {
  return (
    <div className="welcome__actions">
      <a
        className="welcome__button welcome__button--primary"
        href={adminRoute}
        rel="noopener noreferrer"
      >
        <span>Go to Admin Panel</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
      {showDocs && (
        <a
          className="welcome__button welcome__button--secondary"
          href="https://payloadcms.com/docs"
          rel="noopener noreferrer"
          target="_blank"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>Documentation</span>
        </a>
      )}
    </div>
  )
}
