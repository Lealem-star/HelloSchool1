import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Hello TVET - Technical & Vocational Training (ሄሎ የቴክኒክና ሙያ ማሰልጠኛ)'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#155DFC',
                fontWeight: 900,
                fontSize: '30px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              }}
            >
              H
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                }}
              >
                HELLO TVET
              </span>
              <span
                style={{
                  fontSize: '12px',
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
              padding: '10px 22px',
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
            <span>PRACTICAL TRADE EDUCATION</span>
          </div>
        </div>

        {/* Center Hero */}
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
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.12,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
              maxWidth: '1060px',
            }}
          >
            Build Practical Skills. <span style={{ color: '#ffffff', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.45)' }}>Repair with Confidence.</span>
          </h1>

          <p
            style={{
              fontSize: '22px',
              lineHeight: 1.45,
              color: '#eff6ff',
              margin: 0,
              maxWidth: '980px',
            }}
          >
            Premier hands-on training in smartphone repair, computer hardware servicing,
            component-level soldering, and circuit diagnostics in Bahir Dar, Ethiopia.
          </p>

          {/* 4 Pillars Grid */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            {[
              { icon: '📱', label: 'Smartphone Repair' },
              { icon: '💻', label: 'Computer & Laptop' },
              { icon: '🔬', label: 'Board Diagnostics' },
              { icon: '📺', label: 'Display & TV' },
            ].map((pillar, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                <span>{pillar.icon}</span>
                <span>{pillar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📍</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
              Signal Mall Building, 4th Floor (In front of Papyrus Hotel), Bahir Dar
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
              }}
            />
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
              helloschool.edu.et
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
