import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFallbackCourseImage(slug?: string | null, category?: string | null): string {
  const s = (slug || '').toLowerCase()
  const c = (category || '').toLowerCase()
  if (s.includes('mobile') || c.includes('mobile')) return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85'
  if (s.includes('tv') || c.includes('tv')) return 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=85'
  if (s.includes('computer') || s.includes('laptop') || c.includes('computer') || c.includes('laptop')) return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=85'
  if (s.includes('refrigerator') || s.includes('fridge') || c.includes('appliance')) return 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=85'
  if (s.includes('electric') || c.includes('electric')) return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=85'
  if (s.includes('network') || c.includes('network')) return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=85'
  if (s.includes('dish') || c.includes('dish')) return 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=85'
  if (s.includes('video') || c.includes('video')) return 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=85'
  if (s.includes('animation') || c.includes('animation')) return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=85'
  if (s.includes('coding') || s.includes('program') || c.includes('software')) return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=85'
  if (s.includes('industrial') || c.includes('industrial')) return 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=85'
  return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85'
}

