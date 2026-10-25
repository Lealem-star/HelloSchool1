import type { Metadata } from 'next'
import { ProfileDashboardClient } from '@/components/profile-dashboard-client'

export const metadata: Metadata = {
  title: 'Purchase History | Donkey Academy',
  description: 'View your purchased courses, receipts, and digital resources.',
  alternates: {
    canonical: '/profile/purchase',
  },
}

export default function ProfilePurchasePage() {
  return <ProfileDashboardClient initialTab="purchase" />
}
