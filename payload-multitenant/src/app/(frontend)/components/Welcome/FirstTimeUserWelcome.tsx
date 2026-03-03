'use client'

import React, { useEffect } from 'react'
import { WelcomeActions } from './WelcomeActions'

interface FirstTimeUserWelcomeProps {
  user: {
    id: string
    email: string
    firstName?: string
  }
  siteConfig?: {
    siteName?: string
    welcome?: {
      headline?: string
      subheadline?: string
      showOnboardingSteps?: boolean
    }
  } | null
  adminRoute: string
}

const steps = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
    title: 'Explore the Admin Panel',
    description: 'Navigate to the admin panel to manage your content, media, and settings.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Create Your First Content',
    description: 'Start by creating pages or posts to build out your website.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    title: 'Customize Your Site',
    description: 'Update site settings, upload your logo, and configure your preferences.',
  },
]

export function FirstTimeUserWelcome({ user, siteConfig, adminRoute }: FirstTimeUserWelcomeProps) {
  const displayName = user.firstName || user.email.split('@')[0]
  const headline = siteConfig?.welcome?.headline || `Welcome, ${displayName}!`
  const subheadline = siteConfig?.welcome?.subheadline || "You're all set up and ready to go. Here's how to get started:"
  const showSteps = siteConfig?.welcome?.showOnboardingSteps !== false

  // Track that the user has seen the welcome page
  useEffect(() => {
    fetch('/api/track-welcome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id }),
    }).catch(console.error)
  }, [user.id])

  return (
    <div className="welcome__first-time">
      <h1 className="welcome__title">
        {headline}
      </h1>
      <p className="welcome__subtitle">{subheadline}</p>

      {showSteps && (
        <div className="welcome__onboarding">
          <h2 className="welcome__onboarding-title">Getting Started</h2>
          <ul className="welcome__steps">
            {steps.map((step, index) => (
              <li key={index} className="welcome__step">
                <span className="welcome__step-icon">
                  {step.icon}
                </span>
                <div className="welcome__step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <WelcomeActions adminRoute={adminRoute} />
    </div>
  )
}
