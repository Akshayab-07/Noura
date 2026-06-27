import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Noura — AI Nutrition Planner for Your Deficiencies',
  description: 'Fix Vitamin D, B12, Iron and more with personalized Indian meal plans powered by AI. Built around YOUR deficiencies.',
  keywords: 'nutrition app, Indian meal plans, vitamin deficiency, AI nutrition, B12, Iron, Vitamin D',
  openGraph: {
    title: 'Noura — AI Nutrition Planner',
    description: 'Personalized Indian meal plans to fix your vitamin deficiencies',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Work+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff8f7',
              color: '#231919',
              border: '1px solid #ddc0c0',
              borderRadius: '12px',
              fontFamily: 'Work Sans, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#a43947',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
