import type { Metadata } from 'next'
import { AchievementsPageClient } from '@/components/achievements-page-client'

export const metadata: Metadata = {
  title: 'Certificates & Credentials',
  description: 'View and download official accredited TVET certificates and achievements.',
  alternates: {
    canonical: '/certificates',
  },
}

export default function CertificatesPage() {
  return <AchievementsPageClient />
}
