import { schoolConfig } from './data'
import type { PublicCourse } from './content'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://helloschool.edu.et'

/**
 * Global School Organization Schema (EducationalOrganization + LocalBusiness)
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: schoolConfig.name,
    alternateName: `${schoolConfig.name} ${schoolConfig.brandSubtitle}`,
    url: SITE_URL,
    logo: `${SITE_URL}/images/helloschool.jpg`,
    image: `${SITE_URL}/images/helloschool.jpg`,
    description: schoolConfig.description,
    telephone: `${schoolConfig.phone}, ${schoolConfig.alternatePhone}`,
    email: schoolConfig.email,
    priceRange: 'ETB 3,500 - 8,000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'In front of Papyrus Hotel, Signal Mall Building, 4th Floor, Office No. 409',
      addressLocality: 'Bahir Dar',
      addressRegion: 'Amhara',
      addressCountry: 'ET',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 11.5936,
      longitude: 37.3908,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:30',
        closes: '17:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '13:00',
      },
    ],
    sameAs: [
      schoolConfig.telegram,
      `https://wa.me/${schoolConfig.whatsappPhone}`,
      schoolConfig.facebook,
    ],
  }
}

/**
 * Course Schema (Google Search Rich Snippet compliant)
 */
export function getCourseSchema(course: PublicCourse) {
  // Parse numeric price if available
  const rawPrice = course.price ? course.price.replace(/[^0-9]/g, '') : null

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${SITE_URL}/courses/${course.slug}#course`,
    name: course.title,
    description: course.description,
    url: `${SITE_URL}/courses/${course.slug}`,
    courseCode: course.slug.toUpperCase(),
    educationalLevel: course.level || 'Beginner to Advanced',
    about: course.skills,
    teaches: course.skills,
    inLanguage: 'en',
    provider: {
      '@type': 'EducationalOrganization',
      name: schoolConfig.name,
      url: SITE_URL,
      sameAs: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      category: 'Technical Vocational Training',
      price: rawPrice || '4500',
      priceCurrency: 'ETB',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-01-01',
      url: `${SITE_URL}/courses/${course.slug}`,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite / Practical Workshop',
      courseWorkload: course.duration || '4 to 6 Weeks',
      duration: course.duration || 'P6W',
      location: {
        '@type': 'Place',
        name: `${schoolConfig.name} Technical Training Labs`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Signal Mall Building, 4th Floor, Office No. 409 (In front of Papyrus Hotel)',
          addressLocality: 'Bahir Dar',
          addressRegion: 'Amhara',
          addressCountry: 'ET',
        },
      },
    },
    syllabusSections: (course.syllabus || []).map((mod, index) => ({
      '@type': 'Syllabus',
      position: index + 1,
      name: mod.title,
      description: mod.description || '',
      timeRequired: mod.duration || '',
      hasCourseWork: mod.labMilestone ? [mod.labMilestone] : undefined,
    })),
  }
}

/**
 * Course Catalog ItemList Schema
 */
export function getCourseListSchema(courses: PublicCourse[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${schoolConfig.englishName} Technical Training Courses`,
    description: 'Certified hands-on electronics maintenance and hardware repair courses.',
    url: `${SITE_URL}/courses`,
    numberOfItems: courses.length,
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: course.title,
      url: `${SITE_URL}/courses/${course.slug}`,
      item: {
        '@type': 'Course',
        name: course.title,
        description: course.description,
        url: `${SITE_URL}/courses/${course.slug}`,
        provider: {
          '@type': 'EducationalOrganization',
          name: schoolConfig.name,
        },
      },
    })),
  }
}

/**
 * Helper React Component to inject JSON-LD cleanly
 */
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
