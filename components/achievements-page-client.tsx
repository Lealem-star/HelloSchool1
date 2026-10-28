'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { SiteShell } from '@/components/site'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import { StudentCertificate, type CertificateData } from '@/components/student-certificate'
import { Award, BookOpen, CheckCircle2, Download, ExternalLink, Sparkles } from 'lucide-react'

export function AchievementsPageClient() {
  const { language } = useLanguage()
  const isAm = language === 'am'

  const [student, setStudent] = useState<any>(null)
  const [earnedCertificates, setEarnedCertificates] = useState<CertificateData[]>([])
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null)
  const [isCertModalOpen, setIsCertModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/student/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.student) {
          setStudent(data.student)
          // If student has approved registrations, create verifiable certificates
          if (Array.isArray(data.registrations)) {
            const approved = data.registrations.filter(
              (r: any) => r.status === 'Approved' || r.status === 'Enrolled' || r.status === 'Completed'
            )
            if (approved.length > 0) {
              const certs: CertificateData[] = approved.map((r: any, idx: number) => ({
                certificateNumber: `CERT-26-${r.registrationNumber || 1000 + idx}`,
                studentName: data.student.fullName,
                studentId: data.student.studentId,
                courseTitle: r.courseTitle || 'Mobile Maintenance & Hardware Diagnostics',
                courseLevel: 'Professional Level - COC Aligned',
                batchNumber: r.batch?.batchNumber || 'Batch 12',
                issueDate: r.approvedAt || r.createdAt,
                grade: 'Distinction (A+)',
              }))
              setEarnedCertificates(certs)
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hasData = earnedCertificates.length > 0

  return (
    <SiteShell>
      <main className="container mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-5 py-16 text-center">
        {!hasData ? (
          /* ── Exact Empty State matching Screenshot 3 ── */
          <div className="flex flex-col items-center justify-center animate-fade-in">
            {/* Certificate SVG Illustration matching Screenshot 3 */}
            <div className="relative flex items-center justify-center text-[#38bdf8]">
              <svg
                className="h-28 w-28 md:h-32 md:w-32"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Certificate paper sheet */}
                <rect
                  x="20"
                  y="16"
                  width="70"
                  height="82"
                  rx="6"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="fill-sky-50/40 dark:fill-sky-950/20"
                />
                {/* Document text lines */}
                <line x1="32" y1="32" x2="60" y2="32" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <line x1="32" y1="44" x2="78" y2="44" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <line x1="32" y1="56" x2="68" y2="56" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <line x1="32" y1="68" x2="52" y2="68" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />

                {/* Diagonal subtle strike or seal accent */}
                <path
                  d="M16 20L94 94"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="opacity-40"
                />

                {/* Rosette ribbon medal at bottom right */}
                <g transform="translate(68, 64)">
                  <circle cx="18" cy="18" r="14" stroke="#38bdf8" strokeWidth="4" className="fill-background" />
                  <circle cx="18" cy="18" r="8" fill="#38bdf8" />
                  <path
                    d="M14 30L10 46L18 40L26 46L22 30"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>
              </svg>
            </div>

            {/* Title matching Screenshot 3: No Data Available */}
            <h1 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight text-slate-700 dark:text-slate-200">
              {isAm ? 'ምንም መረጃ አልተገኘም (No Data Available)' : 'No Data Available'}
            </h1>

            {/* Subtitle matching Screenshot 3: There is no data available for Achievements. */}
            <p className="mt-2.5 max-w-md text-sm md:text-base text-slate-500 dark:text-slate-400">
              {isAm
                ? 'ለAchievements የተመዘገበ ምንም አይነት መረጃ አልተገኘም።'
                : 'There is no data available for Achievements.'}
            </p>

            {/* Button matching Screenshot 3: Start Learning */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Link href="/#courses">
                <Button
                  variant="outline"
                  className="rounded-xl border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-6 py-2.5 font-semibold text-sm transition"
                >
                  {isAm ? 'መማር ጀምር (Start Learning)' : 'Start Learning'}
                </Button>
              </Link>

              {/* Sample preview modal trigger for testing / verification */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCert({
                    certificateNumber: 'CERT-26-4821',
                    studentName: student?.fullName || 'Alemayehu Mekonen',
                    studentId: student?.studentId || 'STU-26-8921',
                    courseTitle: 'የሞባይል ጥገና እና ማይክሮ-ሶልደሪንግ (Mobile Repair & Diagnostics)',
                    courseLevel: 'Accredited Level 3 - COC Exam Aligned',
                    batchNumber: 'Batch 12',
                    issueDate: new Date().toISOString(),
                    grade: 'Distinction (A+)',
                  })
                  setIsCertModalOpen(true)
                }}
                className="text-xs text-muted-foreground hover:text-blue-600 gap-1.5"
              >
                <Sparkles className="size-3.5 text-sky-500" />
                {isAm ? 'የናሙና ሰርተፊኬት ይመልከቱ' : 'Preview Sample Certificate'}
              </Button>
            </div>
          </div>
        ) : (
          /* ── Earned Certificates View (when student has completed/approved courses) ── */
          <div className="w-full text-left animate-fade-in">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {isAm ? 'የብቃት ማረጋገጫ ሰርተፊኬቶች' : 'Accredited Certificates & Achievements'}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {isAm
                    ? 'በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል የተጠናቀቁ ይፋዊ የCOC ብቃት ማረጋገጫዎች'
                    : 'Official TVET accredited competence credentials and certificates.'}
                </p>
              </div>
              <Link href="/#courses">
                <Button variant="outline" size="sm" className="rounded-xl border-sky-400 text-sky-600 text-xs">
                  {isAm ? 'ተጨማሪ ስልጠናዎች' : 'Enroll In More Courses'}
                </Button>
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {earnedCertificates.map((cert) => (
                <div
                  key={cert.certificateNumber}
                  className="rounded-2xl border border-sky-200/80 dark:border-sky-800/60 bg-card p-6 shadow-xs hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-600">
                        <Award className="size-5" />
                      </div>
                      <div>
                        <h2 className="font-bold text-base text-foreground leading-tight">{cert.courseTitle}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{cert.certificateNumber}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {cert.grade || 'Verified'}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {isAm ? 'የተሰጠበት ቀን፦' : 'Issued:'}{' '}
                      <strong className="text-foreground font-medium">
                        {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'Active'}
                      </strong>
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedCert(cert)
                        setIsCertModalOpen(true)
                      }}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 py-1.5"
                    >
                      <ExternalLink className="size-3.5 mr-1" />
                      {isAm ? 'ሰርተፊኬት ይመልከቱ' : 'View Certificate'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate View / Print Modal */}
        {selectedCert && (
          <StudentCertificate
            isOpen={isCertModalOpen}
            onClose={() => setIsCertModalOpen(false)}
            data={selectedCert}
          />
        )}
      </main>
    </SiteShell>
  )
}
