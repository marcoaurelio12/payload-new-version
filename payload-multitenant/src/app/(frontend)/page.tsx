import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { WelcomePage } from './components/Welcome/WelcomePage'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Fetch full user data including onboarding fields
  let fullUser = null
  if (user) {
    try {
      fullUser = await payload.findByID({
        collection: 'users',
        id: user.id,
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Fetch site config for branding
  let siteConfig = null
  try {
    const siteConfigResult = await payload.find({
      collection: 'site-config',
      limit: 1,
    })
    siteConfig = siteConfigResult.docs[0] || null
  } catch (error) {
    console.error('Error fetching site config:', error)
  }

  return (
    <WelcomePage
      user={fullUser}
      siteConfig={siteConfig}
      adminRoute={payloadConfig.routes.admin}
    />
  )
}
