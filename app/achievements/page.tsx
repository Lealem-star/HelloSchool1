import type { Metadata } from 'next'
import { AchievementsPageClient } from '@/components/achievements-page-client'

export const metadata: Metadata = {
  title: 'Achievements & Certified Competencies',
  description: 'View your verified course completions, accredited TVET certifications, and achievements.',
  alternates: {
    canonical: '/achievements',
  },
}

export default function AchievementsPage() {
  return <AchievementsPageClient />
}
