import React from 'react'
import { FirstTimeUserWelcome } from './FirstTimeUserWelcome'
import { ReturningUserWelcome } from './ReturningUserWelcome'
import { WelcomeLogo } from './WelcomeLogo'

interface WelcomePageProps {
  user: {
    id: string
    email: string
    firstName?: string
    onboarding?: {
      hasSeenWelcome?: boolean
    }
  } | null
  siteConfig?: {
    siteName?: string
    logo?: {
      url?: string
    }
    welcome?: {
      headline?: string
      subheadline?: string
      showOnboardingSteps?: boolean
    }
  } | null
  adminRoute: string
}

export function WelcomePage({ user, siteConfig, adminRoute }: WelcomePageProps) {
  const isFirstVisit = user && !user.onboarding?.hasSeenWelcome
  const logoUrl = siteConfig?.logo?.url

  return (
    <div className="welcome">
      {/* Animated background pattern */}
      <div className="welcome__bg-pattern" aria-hidden="true" />

      <div className="welcome__content">
        <WelcomeLogo
          src={logoUrl}
          alt={siteConfig?.siteName || 'Logo'}
          siteName={siteConfig?.siteName}
        />

        {!user ? (
          <div className="welcome__guest">
            <h1 className="welcome__title">
              Welcome to{' '}
              <span className="welcome__title-gradient">
                {siteConfig?.siteName || 'the Platform'}
              </span>
            </h1>
            <p className="welcome__subtitle">
              Sign in to access your dashboard and manage your content with ease.
            </p>
            <a
              className="welcome__button welcome__button--primary"
              href={adminRoute}
            >
              <span>Sign In</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        ) : isFirstVisit ? (
          <FirstTimeUserWelcome
            user={user}
            siteConfig={siteConfig}
            adminRoute={adminRoute}
          />
        ) : (
          <ReturningUserWelcome
            user={user}
            adminRoute={adminRoute}
          />
        )}
      </div>

      <footer className="welcome__footer">
        <p>
          Powered by <a href="https://payloadcms.com" target="_blank" rel="noopener noreferrer">Payload CMS</a>
        </p>
      </footer>
    </div>
  )
}
