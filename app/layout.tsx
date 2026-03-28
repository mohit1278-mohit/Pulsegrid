import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'PulseGrid Mobile',
  description: 'Find hospitals with available medical resources and emergency services',
  generator: 'v0.app',
  manifest: '/manifest.json',
  applicationName: 'PulseGrid Mobile',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PulseGrid',
  },
  formatDetection: {
    telephone: true,
    email: false,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e3a8a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
