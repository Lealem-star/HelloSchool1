import type { Metadata } from 'next'
import { ProfileDashboardClient } from '@/components/profile-dashboard-client'

export const metadata: Metadata = {
  title: 'Security Settings',
  description: 'Manage your password, phone number, email address, and security.',
  alternates: {
    canonical: '/profile/security',
  },
}

export default function ProfileSecurityPage() {
  return <ProfileDashboardClient initialTab="security" />
}
