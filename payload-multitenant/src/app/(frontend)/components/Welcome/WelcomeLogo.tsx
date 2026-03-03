import Image from 'next/image'
import React from 'react'

interface WelcomeLogoProps {
  src?: string | null
  alt: string
  siteName?: string
}

export function WelcomeLogo({ src, alt, siteName }: WelcomeLogoProps) {
  const defaultLogo = 'https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg'

  return (
    <div className="welcome__logo">
      <div className="welcome__logo-image-wrapper">
        <picture>
          <source srcSet={src || defaultLogo} />
          <Image
            alt={alt}
            height={80}
            src={src || defaultLogo}
            width={80}
            unoptimized={!!src}
          />
        </picture>
      </div>
      {siteName && <span className="welcome__logo-text">{siteName}</span>}
    </div>
  )
}
