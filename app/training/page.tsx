import { getPublishedFacilities, getPublishedGallery, getPublishedStudentProjects } from '@/lib/content'
import { TrainingPageClient } from '@/components/training-page-client'

export const revalidate = 60

export default async function TrainingPage() {
  const [trainingGallery, workshopFacilities, studentProjects] = await Promise.all([
    getPublishedGallery(),
    getPublishedFacilities(),
    getPublishedStudentProjects(),
  ])

  return (
    <TrainingPageClient
      trainingGallery={trainingGallery}
      workshopFacilities={workshopFacilities}
      studentProjects={studentProjects}
    />
  )
}
