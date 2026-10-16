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
          backgroundColor: '#030712',
          backgroundImage:
            'radial-gradient(circle at 20% 25%, rgba(6, 182, 212, 0.2) 0%, transparent 45%), radial-gradient(circle at 80% 75%, rgba(59, 130, 246, 0.15) 0%, transparent 45%)',
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
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#030712',
                fontWeight: 900,
                fontSize: '28px',
              }}
            >
              H
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '26px',
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
              padding: '8px 20px',
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
            Build Practical Skills. <span style={{ color: '#22d3ee' }}>Repair with Confidence.</span>
          </h1>

          <p
            style={{
              fontSize: '22px',
              lineHeight: 1.45,
              color: '#94a3b8',
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
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e2e8f0',
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
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#38bdf8', fontSize: '16px' }}>📍</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#cbd5e1' }}>
              Signal Mall Building, 4th Floor (In front of Papyrus Hotel), Bahir Dar
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22d3ee',
              }}
            />
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#22d3ee' }}>
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
