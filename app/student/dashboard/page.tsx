import type { Metadata } from 'next'
import { ProfileDashboardClient, TabType } from '@/components/profile-dashboard-client'

export const metadata: Metadata = {
  title: 'Student Dashboard | Hello Technology Training Center',
  description: 'Manage your enrolled courses, certificates, account details, and security.',
  alternates: {
    canonical: '/student/dashboard',
  },
}

export default async function StudentDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>
}) {
  const resolved = await searchParams
  const tab = resolved?.tab as TabType | undefined
  const initialTab: TabType =
    tab === 'account' || tab === 'purchase' || tab === 'security' ? tab : 'dashboard'

  return <ProfileDashboardClient initialTab={initialTab} />
}
