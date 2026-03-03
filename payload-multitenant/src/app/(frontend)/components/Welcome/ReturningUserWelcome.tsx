import React from 'react'
import { WelcomeActions } from './WelcomeActions'

interface ReturningUserWelcomeProps {
  user: {
    email: string
    firstName?: string
  }
  adminRoute: string
}

export function ReturningUserWelcome({ user, adminRoute }: ReturningUserWelcomeProps) {
  const displayName = user.firstName || user.email.split('@')[0]

  return (
    <div className="welcome__returning">
      <h1 className="welcome__title">
        Welcome back,{' '}
        <span className="welcome__title-gradient">{displayName}</span>!
      </h1>
      <p className="welcome__subtitle">
        Ready to continue? Access your admin panel to manage your content and make updates.
      </p>
      <WelcomeActions adminRoute={adminRoute} showDocs={false} />
    </div>
  )
}
