import type { Metadata } from 'next'
import { ProfileDashboardClient } from '@/components/profile-dashboard-client'

export const metadata: Metadata = {
  title: 'Account Settings | Donkey Academy',
  description: 'Manage your student account settings and credentials.',
  alternates: {
    canonical: '/account',
  },
}

export default function AccountPage() {
  return <ProfileDashboardClient initialTab="account" />
}
