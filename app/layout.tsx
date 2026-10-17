import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import { getOrganizationSchema, JsonLd } from '@/lib/schema'
import { AppProviders } from '@/components/providers'
import { GeometricBackground } from '@/components/geometric-background'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://helloschool.edu.et'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ | Hello TVET',
    template: '%s | Hello TVET',
  },
  description:
    'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET - Hello Technical and Vocational Training) — Hands-on accredited technical training in smartphone repair, computer maintenance, electrical installation, TV repair, coding, video editing, and industrial equipment in Bahir Dar, Ethiopia.',
  keywords: [
    'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ',
    'Hello TVET',
    'Hello Technical and Vocational Training',
    'electronics repair school Ethiopia',
    'mobile phone repair training Bahir Dar',
    'computer maintenance course',
    'micro-soldering training',
    'electronics troubleshooting',
    'Bahir Dar technical vocational training',
  ],
  authors: [{ name: 'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET)', url: SITE_URL }],
  creator: 'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET)',
  publisher: 'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET)',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'am_ET',
    url: '/',
    title: 'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ | Hello TVET',
    description:
      'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET - Hello Technical and Vocational Training) — Hands-on accredited technical training in smartphone repair, computer maintenance, and electronics diagnostics in Bahir Dar, Ethiopia.',
    siteName: 'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET)',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ | Hello TVET',
    description:
      'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET - Hello Technical and Vocational Training) — Hands-on accredited technical training in smartphone repair, computer maintenance, and electronics diagnostics in Bahir Dar, Ethiopia.',
    creator: '@helloschool_et',
    site: '@helloschool_et',
  },
  icons: {
    icon: [
      {
        url: '/images/helloschool.jpg',
        type: 'image/jpeg',
      },
    ],
    apple: '/images/helloschool.jpg',
    shortcut: '/images/helloschool.jpg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const orgSchema = getOrganizationSchema()

  return (
    <html lang="am" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var storedTheme = localStorage.getItem('hellotvet_theme') || localStorage.getItem('theme');
                var isDark = storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
                var storedLang = localStorage.getItem('hellotvet_lang');
                if (storedLang) {
                  document.documentElement.lang = storedLang;
                }
              } catch(e) {}
            })();`,
          }}
        />
        <JsonLd data={orgSchema} />
      </head>
      <body className="antialiased min-h-screen bg-background relative selection:bg-blue-600 selection:text-white">
        <AppProviders>
          <GeometricBackground />
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AppProviders>
      </body>
    </html>
  )
}
