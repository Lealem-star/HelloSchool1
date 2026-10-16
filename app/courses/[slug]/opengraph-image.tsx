import { ImageResponse } from 'next/og'
import { getPublishedCourseBySlug } from '@/lib/content'

export const runtime = 'nodejs'
export const alt = 'Hello TVET Course Curriculum & Practical Bench Training'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await getPublishedCourseBySlug(slug)

  const title = course?.title || 'Electronics Maintenance Course'
  const category = course?.category || 'Technical Repair'
  const level = course?.level || 'Beginner to Advanced'
  const duration = course?.duration || 'Practical Training'
  const description =
    course?.description ||
    'Certified workbench training in diagnosis, schematic analysis, and hardware maintenance in Bahir Dar.'
  const skills = (course?.skills || []).slice(0, 4)
  const labMilestone =
    course?.syllabus?.[0]?.labMilestone || 'Practical Bench Hardware Diagnostic'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '50px 60px',
          backgroundColor: '#030712',
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 45%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#030712',
                fontWeight: 900,
                fontSize: '24px',
              }}
            >
              H
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: '#ffffff',
                }}
              >
                HELLO TVET
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: '#94a3b8',
                }}
              >
                TECHNICAL & VOCATIONAL TRAINING · BAHIR DAR
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '999px',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              color: '#67e8f9',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <span>{category}</span>
            <span style={{ color: '#06b6d4' }}>•</span>
            <span style={{ color: '#e2e8f0' }}>{level}</span>
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '52px',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
              maxWidth: '1000px',
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: '22px',
              lineHeight: 1.4,
              color: '#94a3b8',
              margin: 0,
              maxWidth: '960px',
            }}
          >
            {description.length > 140 ? description.slice(0, 140) + '...' : description}
          </p>

          {/* Key Skill Badges */}
          {skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#e2e8f0',
                  }}
                >
                  <span style={{ color: '#22d3ee' }}>✓</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar: Lab Milestone & Details */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              padding: '10px 18px',
              borderRadius: '12px',
              maxWidth: '680px',
            }}
          >
            <span style={{ fontSize: '18px' }}>⚡</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#fbbf24',
                }}
              >
                Practical Workbench Milestone
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#fef3c7',
                  lineHeight: 1.3,
                }}
              >
                {labMilestone.length > 75 ? labMilestone.slice(0, 75) + '...' : labMilestone}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                Course Duration
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>
                {duration}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                Location
              </span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
                Bahir Dar, ET
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
