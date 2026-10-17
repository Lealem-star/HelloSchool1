import { ImageResponse } from 'next/og'
import { getPublishedCourseBySlug } from '@/lib/content'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const course = await getPublishedCourseBySlug(slug)

  const title = course?.title || 'Technical Repair Course'
  const category = course?.category || 'Electronics Repair'
  const level = course?.level || 'Beginner to Advanced'
  const duration = course?.duration || 'Hands-On Training'
  const description =
    course?.description ||
    'Certified hands-on training in diagnosis, schematic analysis, and hardware maintenance in Bahir Dar.'
  const skills = (course?.skills || []).slice(0, 4)
  const labMilestone = course?.syllabus?.[0]?.labMilestone || 'Practical Lab Hardware Diagnostic'

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
          backgroundColor: '#1048ca',
          backgroundImage:
            'linear-gradient(135deg, #1048ca 0%, #155DFC 55%, #0c3694 100%)',
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
                width: '46px',
                height: '46px',
                borderRadius: '13px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#155DFC',
                fontWeight: 900,
                fontSize: '26px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              }}
            >
              H
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  color: '#ffffff',
                }}
              >
                HELLO TVET
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#dbeafe',
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
              padding: '9px 20px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <span>{category}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>•</span>
            <span style={{ color: '#ffffff' }}>{level}</span>
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
              color: '#eff6ff',
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
                    padding: '7px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.28)',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  <span style={{ color: '#ffffff' }}>✓</span>
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
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
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
                  color: '#fef08a',
                }}
              >
                Practical Lab Milestone
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#ffffff',
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
              <span style={{ fontSize: '12px', color: '#dbeafe', fontWeight: 600 }}>
                Course Duration
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
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
              <span style={{ fontSize: '12px', color: '#dbeafe', fontWeight: 600 }}>
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
      width: 1200,
      height: 630,
    }
  )
}
