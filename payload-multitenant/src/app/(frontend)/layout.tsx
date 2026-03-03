import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Alinhadamente - Portal de Propostas',
  title: 'Alinhadamente | CMS',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="pt">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
