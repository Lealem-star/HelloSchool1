import type { Metadata } from 'next'
import { ProfileDashboardClient } from '@/components/profile-dashboard-client'

export const metadata: Metadata = {
  title: 'User Dashboard & Profile | Donkey Academy',
  description: 'Manage your enrolled courses, certificates, account details, and security.',
  alternates: {
    canonical: '/profile/dashboard',
  },
}

export default function ProfileDashboardPage() {
  return <ProfileDashboardClient initialTab="dashboard" />
}
