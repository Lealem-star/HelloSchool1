import type { Metadata } from 'next'
import { ProfileDashboardClient } from '@/components/profile-dashboard-client'

export const metadata: Metadata = {
  title: 'Your Profile & Account | Donkey Academy',
  description: 'Manage your profile details, contact information, and avatar.',
  alternates: {
    canonical: '/profile/account',
  },
}

export default function ProfileAccountPage() {
  return <ProfileDashboardClient initialTab="account" />
}
