'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  Play,
  BookOpen,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Volume2,
  Clock,
  ListChecks,
  Smartphone,
  Users,
  Award,
  Lock,
  Sparkles,
  ShoppingBag,
  Check,
  Video,
  FileText,
  Loader2,
  HelpCircle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteShell } from '@/components/site'
import { useLanguage } from '@/components/language-provider'
import type { PublicLibraryItem } from '@/lib/content'
import { DIGITAL_CATALOG, type DigitalResourceMeta } from '@/lib/digital-catalog'

interface LibraryDetailClientProps {
  resource: PublicLibraryItem
}

export function LibraryDetailClient({ resource }: LibraryDetailClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const isAm = language === 'am'

  const catalogMeta: DigitalResourceMeta | undefined = DIGITAL_CATALOG[resource.id]
  const isVideo =
    resource.format.toLowerCase().includes('video') ||
    (resource.pages && resource.pages.toLowerCase().includes('hour')) ||
    (resource.pages && resource.pages.toLowerCase().includes('lesson'))

  // State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
  const [selectedActivityId, setSelectedActivityId] = useState<string>('act-3')
  const [quizModalActivity, setQuizModalActivity] = useState<any | null>(null)
  const [copiedShare, setCopiedShare] = useState(false)
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-2': true,
    'custom-mod-1': true,
    'custom-ch-1': true,
  })
  const [student, setStudent] = useState<any>(null)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const videoContainerRef = React.useRef<HTMLDivElement>(null)

  // Check student auth state and existing purchase
  useEffect(() => {
    let isMounted = true
    fetch('/api/student/me')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data.student) {
          setStudent(data.student)
          const enrolled = data.digitalPurchases?.some(
            (p: any) => p.resourceId === resource.id && p.status === 'Active'
          )
          setHasPurchased(Boolean(enrolled))
        } else {
          setStudent(null)
          setHasPurchased(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setStudent(null)
          setHasPurchased(false)
        }
      })
      .finally(() => {
        if (isMounted) setCheckingAuth(false)
      })

    return () => {
      isMounted = false
    }
  }, [resource.id])

  const isFree =
    resource.priceETB === 0 ||
    resource.price === 'Free' ||
    resource.price === '0 ETB' ||
    Boolean(resource.price && resource.price.toLowerCase().includes('free')) ||
    Boolean(resource.priceDisplay && resource.priceDisplay.toLowerCase().includes('free')) ||
    Boolean(resource.isFreeForTVET)

  // Automatically navigate to cart or auto-enroll free course when returning from login
  useEffect(() => {
    if (searchParams.get('checkout') === '1') {
      router.push(`/cart?course=${resource.id}`)
    } else if (searchParams.get('enroll') === 'free' && student && !hasPurchased) {
      fetch('/api/chapa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: resource.id, amount: 0 }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success || d.isFree) {
            try {
              const newPurchase = d.purchase || {
                id: `DP-${Date.now()}`,
                studentId: student?.id,
                resourceId: resource.id,
                resourceType: isVideo ? 'video_course' : 'manual',
                title: resource.title,
                amount: 0,
                paymentMethod: 'Free Enrollment',
                status: 'Active',
                progress: 0,
                thumbnailUrl: resource.thumbnailUrl,
                createdAt: new Date().toISOString(),
              }
              const existing = JSON.parse(localStorage.getItem('hellotvet_student_purchases') || '[]')
              const filtered = existing.filter((p: any) => p.resourceId !== resource.id)
              filtered.unshift(newPurchase)
              localStorage.setItem('hellotvet_student_purchases', JSON.stringify(filtered))
            } catch {}
            setHasPurchased(true)
            router.push(`/student/dashboard?enrolled=${resource.id}`)
          }
        })
        .catch(() => {})
    }
  }, [searchParams, resource.id, router, student, hasPurchased, isVideo, resource.title, resource.thumbnailUrl])

  // Handle Get Started button click
  const handleGetStarted = async () => {
    if (hasPurchased) {
      router.push(`/student/dashboard?enrolled=${resource.id}`)
      return
    }

    if (isFree) {
      if (student) {
        // Direct free unlock without Chapa
        try {
          const res = await fetch('/api/chapa/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resourceId: resource.id, amount: 0 }),
          })
          const data = await res.json()
          if (data.success || data.isFree) {
            try {
              const newPurchase = data.purchase || {
                id: `DP-${Date.now()}`,
                studentId: student?.id,
                resourceId: resource.id,
                resourceType: isVideo ? 'video_course' : 'manual',
                title: resource.title,
                amount: 0,
                paymentMethod: 'Free Enrollment',
                status: 'Active',
                progress: 0,
                thumbnailUrl: resource.thumbnailUrl,
                createdAt: new Date().toISOString(),
              }
              const existing = JSON.parse(localStorage.getItem('hellotvet_student_purchases') || '[]')
              const filtered = existing.filter((p: any) => p.resourceId !== resource.id)
              filtered.unshift(newPurchase)
              localStorage.setItem('hellotvet_student_purchases', JSON.stringify(filtered))
            } catch {}
            setHasPurchased(true)
            router.push(`/student/dashboard?enrolled=${resource.id}`)
            return
          }
        } catch {
          router.push(`/student/dashboard?enrolled=${resource.id}`)
          return
        }
      } else {
        // Not logged in: save course and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.setItem('hellotvet_cart_course', resource.id)
          localStorage.setItem('hellotvet_pending_redirect', `/library/${resource.id}?enroll=free`)
        }
        router.push(
          `/student/login?redirect=${encodeURIComponent(`/library/${resource.id}?enroll=free`)}&course=${encodeURIComponent(resource.id)}`
        )
        return
      }
    }

    // Paid course
    if (student) {
      router.push(`/cart?course=${resource.id}`)
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hellotvet_cart_course', resource.id)
        localStorage.setItem('hellotvet_pending_redirect', `/cart?course=${resource.id}`)
      }
      router.push(
        `/student/login?redirect=${encodeURIComponent(`/cart?course=${resource.id}`)}&course=${encodeURIComponent(resource.id)}`
      )
    }
  }

  // Dynamic curriculum parsing from database if configured by admin
  const dynamicCurriculum = React.useMemo(() => {
    try {
      if (isVideo && resource.lessons) {
        const raw = typeof resource.lessons === 'string' ? JSON.parse(resource.lessons) : resource.lessons
        if (Array.isArray(raw) && raw.length > 0) {
          // Check if raw contains multi-module structure
          const isModuleArray = raw.some(
            (item: any) =>
              item &&
              (Array.isArray(item.lessons) ||
                Array.isArray(item.activities) ||
                (typeof item.title === 'string' &&
                  (item.title.toLowerCase().includes('module') ||
                    item.title.toLowerCase().includes('chapter') ||
                    item.title.toLowerCase().includes('ምዕራፍ'))))
          )

          if (isModuleArray) {
            return raw.map((mod: any, mIdx: number) => {
              const items = Array.isArray(mod.lessons)
                ? mod.lessons
                : Array.isArray(mod.activities)
                ? mod.activities
                : []
              return {
                id: mod.id || `mod-${mIdx + 1}`,
                title: mod.title || `Module ${mIdx + 1}`,
                activities: items.map((act: any, aIdx: number) => {
                  if (typeof act === 'string') {
                    const isQ =
                      act.toLowerCase().includes('quiz') ||
                      act.toLowerCase().includes('test') ||
                      act.toLowerCase().includes('exam')
                    return {
                      id: `act-${mIdx}-${aIdx}`,
                      title: act,
                      type: isQ ? 'quiz' : 'video',
                      duration: isQ ? '15 min' : '30 min',
                    }
                  }
                  return {
                    id: act.id || `act-${mIdx}-${aIdx}`,
                    title: act.title || `Activity ${aIdx + 1}`,
                    type: act.type === 'quiz' ? 'quiz' : 'video',
                    duration: act.duration || (act.type === 'quiz' ? '15 min' : '30 min'),
                    videoUrl: act.videoUrl || '',
                    labExercise: act.labExercise || '',
                    quizNotes: act.quizNotes || '',
                  }
                }),
              }
            })
          }

          // Flat list of lessons: wrap in Module 1
          return [
            {
              id: 'custom-mod-1',
              title: isAm
                ? 'ምዕራፍ 1፡ የላብራቶሪ የቪዲዮ ትምህርቶች (Practical Video Lessons)'
                : 'Module 1: Structured Hands-On Workbench Lessons',
              activities: raw.map((les: any, i: number) => {
                if (typeof les === 'string') {
                  const isQ = les.toLowerCase().includes('quiz')
                  return {
                    id: `les-${i}`,
                    title: les,
                    type: isQ ? 'quiz' : 'video',
                    duration: '30 min',
                  }
                }
                const isQ = les.type === 'quiz'
                return {
                  id: les.id || `les-${i}`,
                  title: les.title || `Lesson ${i + 1}`,
                  type: isQ ? 'quiz' : 'video',
                  duration: les.duration || '30 min',
                  videoUrl: les.videoUrl || '',
                  labExercise: les.labExercise || '',
                  quizNotes: les.quizNotes || '',
                }
              }),
            },
          ]
        }
      } else if (!isVideo && resource.chapters) {
        const raw = typeof resource.chapters === 'string' ? JSON.parse(resource.chapters) : resource.chapters
        if (Array.isArray(raw) && raw.length > 0) {
          return [
            {
              id: 'custom-ch-1',
              title: isAm
                ? 'ምዕራፍ 1፡ የመጽሐፉ ይዘቶችና የሰርኪዩት ማውጫ'
                : 'Chapter 1: Diagnostic Reading Sections & Schematics',
              activities: raw.map((ch: any, i: number) => {
                if (typeof ch === 'string') {
                  return {
                    id: `ch-${i}`,
                    title: ch,
                    type: 'activity',
                    duration: '',
                  }
                }
                return {
                  id: ch.id || `ch-${i}`,
                  title: ch.title || `Chapter ${i + 1}`,
                  type: 'activity',
                  duration: ch.pageRange || '',
                  labExercise: ch.summary || '',
                }
              }),
            },
          ]
        }
      }
    } catch (e) {
      console.error('Failed to parse dynamic curriculum:', e)
    }
    return null
  }, [isVideo, resource.lessons, resource.chapters, isAm])

  // Standard 6-Module Curriculum with 20 Activities matching Screenshot
  const defaultModules = isVideo
    ? [
        {
          id: 'mod-1',
          title: isAm
            ? 'ምዕራፍ 1፡ የላብራቶሪ መሣሪያዎች አጠቃቀምና የደህንነት መርሆዎች'
            : 'Module 1: Professional Bench Safety & Diagnostic Setup',
          activities: [
            {
              id: 'act-1',
              title: isAm ? 'ክፍል 1፡ የስቴሪዮ ማይክሮስኮፕ አቀማመጥ እና የብርሃን ማስተካከያ' : 'Activity 1: Stereo Microscope Focal Alignment & Optical Calibration',
              type: 'video',
              duration: '25 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-2',
              title: isAm ? 'ክፍል 2፡ የዲጂታል መልቲሜትር የዳዮድ ሞድ መለኪያ መርሆዎች' : 'Activity 2: Multimeter Diode Mode Voltage Drop Fundamentals',
              type: 'video',
              duration: '30 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-3',
              title: isAm ? 'ክፍል 3፡ የዲሲ ፓወር ሰፕላይ እና የሾርት መለያ ቴክኒኮች' : 'Activity 3: DC Bench Power Supply Current Profiling & Short Isolation',
              type: 'video',
              duration: '40 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-4',
              title: isAm ? 'ክፍል 4፡ የESD ፀረ-ስታቲክ እና የጭስ መሳቢያ ደህንነት ፈተና' : 'Activity 4: ESD Static Protection & Fume Extraction Protocols',
              type: 'quiz',
              duration: '15 min',
              quizNotes: 'Workbench ESD safety, ground integrity and fume extraction safety test.',
            },
          ],
        },
        {
          id: 'mod-2',
          title: isAm
            ? 'ምዕራፍ 2፡ የሰርኪዩት ንድፍ (Schematics) ንባብና የቦርድ ቪው ዳሰሳ'
            : 'Module 2: Boardview Navigation & Power Rail Schematics',
          activities: [
            {
              id: 'act-5',
              title: isAm ? 'ክፍል 5፡ የዋናው ፓወር መስመር (VDD_MAIN / VBAT) ፍተሻ' : 'Activity 5: Primary Power Rail Tracing (VDD_MAIN / VPH_PWR)',
              type: 'video',
              duration: '35 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-6',
              title: isAm ? 'ክፍል 6፡ የሰከንዳሪ BUCK ኢንደክተሮችና LDO ሬጉሌተሮች' : 'Activity 6: Secondary Buck Converters & LDO Voltage Drops',
              type: 'video',
              duration: '30 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-7',
              title: isAm ? 'ክፍል 7፡ የሲግናል ክፍተቶችና የኦፕን መስመሮች መለያ' : 'Activity 7: High-Z Line Testing & Open Circuit Detection',
              type: 'video',
              duration: '25 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-8',
              title: isAm ? 'ክፍል 8፡ የI2C እና SPI ኮሙኒኬሽን መስመሮች ፍተሻ ፈተና' : 'Activity 8: I2C & SPI Protocol Bus Resistance Diagnostics',
              type: 'quiz',
              duration: '20 min',
              quizNotes: 'Serial data/clock bus pull-up resistors and short-circuit diagnosis quiz.',
            },
          ],
        },
        {
          id: 'mod-3',
          title: isAm
            ? 'ምዕራፍ 3፡ የቻርጅ ሰርኪዩት እና የባትሪ አያያዝ'
            : 'Module 3: Fast Charging Architecture & Handshake Protocols',
          activities: [
            {
              id: 'act-9',
              title: isAm ? 'ክፍል 9፡ የVBUS 5.0V እና OVP ፕሮቴክሽን ቺፕ ፍተሻ' : 'Activity 9: VBUS 5V Ingestion & OVP MOSFET Bypass Analysis',
              type: 'video',
              duration: '30 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-10',
              title: isAm ? 'ክፍል 10፡ የType-C CC መስመሮች እና የቻርጅ ቺፕ አሰራር' : 'Activity 10: Type-C CC Orientation & PMIC Handshake Testing',
              type: 'video',
              duration: '25 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-11',
              title: isAm ? 'ክፍል 11፡ የባትሪ ቴርሚስተር (NTC) የሙቀት ስህተት አፈታት ፈተና' : 'Activity 11: Battery NTC Thermistor & Fake-Charging Resolution',
              type: 'quiz',
              duration: '15 min',
              quizNotes: 'NTC thermistor resistance curves and temperature warning troubleshooting quiz.',
            },
          ],
        },
        {
          id: 'mod-4',
          title: isAm
            ? 'ምዕራፍ 4፡ ንዑስ ብየዳ (Micro-Soldering) እና ጃምፐር ሽቦ ዝርጋታ'
            : 'Module 4: Precision Micro-Soldering & 0.01mm Jumper Routing',
          activities: [
            {
              id: 'act-12',
              title: isAm ? 'ክፍል 12፡ የተበላሹ የሰርኪዩት መስመሮችን በ0.01mm ጃምፐር ማገናኘት' : 'Activity 12: Micro-Jumper Bridging across Torn Motherboard Vias',
              type: 'video',
              duration: '45 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-13',
              title: isAm ? 'ክፍል 13፡ የUV ግሪን ማስክ ማድረቅና የፓድ መጠገን' : 'Activity 13: UV Solder Mask Curing & SMT Pad Reconstruction',
              type: 'video',
              duration: '30 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-14',
              title: isAm ? 'ክፍል 14፡ BGA ቺፖችን በስቴንስል ዳግም ማዘጋጀት ተግባራዊ ፈተና' : 'Activity 14: BGA Stencil Reballing & Low-Temp Alloy Melting',
              type: 'quiz',
              duration: '20 min',
              quizNotes: 'Thermal profiles, stencil alignment and BGA reballing quality inspection assessment.',
            },
          ],
        },
        {
          id: 'mod-5',
          title: isAm
            ? 'ምዕራፍ 5፡ የዲስፕሌይ እና የጀርባ ብርሃን (Backlight) ጥገና'
            : 'Module 5: Display Backlight Boost Circuit Reconstruction',
          activities: [
            {
              id: 'act-15',
              title: isAm ? 'ክፍል 15፡ የከፍተኛ ቮልቴጅ ቡስት ኢንደክተር እና ዳዮድ ፍተሻ' : 'Activity 15: High-Voltage Boost Diode & Inductor Testing',
              type: 'video',
              duration: '35 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-16',
              title: isAm ? 'ክፍል 16፡ የOLED እና LCD ስክሪን ኬብል ግንኙነት ጥገና' : 'Activity 16: OLED Display Power Rail Diagnostics & FPC Rework',
              type: 'video',
              duration: '40 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-17',
              title: isAm ? 'ክፍል 17፡ የጀርባ ብርሃን ቺፕ እና የPWM ማደብዘዣ መስመሮች ፈተና' : 'Activity 17: Backlight Driver PWM Dimming & Anode Rail Assessment',
              type: 'quiz',
              duration: '15 min',
              quizNotes: 'OLED / LCD backlight circuit troubleshooting and driver IC diagnostics quiz.',
            },
          ],
        },
        {
          id: 'mod-6',
          title: isAm
            ? 'ምዕራፍ 6፡ የመጨረሻ የጥራት ፍተሻ (QA) እና የCOC ፈተና ዝግጅት'
            : 'Module 6: Bench QA Verification & National COC Readiness',
          activities: [
            {
              id: 'act-18',
              title: isAm ? 'ክፍል 18፡ የተጠገኑ መሳሪያዎች የሙሉ ተግባር ማረጋገጫ ቼክሊስት' : 'Activity 18: Multi-Point Diagnostic QA Checklist',
              type: 'video',
              duration: '30 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-19',
              title: isAm ? 'ክፍል 19፡ የሙቀት ካሜራ ፍተሻ እና የአጭር ሰርኪውት መለያ' : 'Activity 19: Thermal Camera Secondary Diagnostics & Current Leak Detection',
              type: 'video',
              duration: '35 min',
              videoUrl: resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
              id: 'act-20',
              title: isAm ? 'ክፍል 20፡ የብሔራዊ የሙያ ብቃት (COC) ተግባራዊ ፈተና ዝግጅት' : 'Activity 20: National TVET Practical COC Simulation Drills',
              type: 'quiz',
              duration: '45 min',
              quizNotes: 'Comprehensive TVET Level IV Hardware COC practical exam simulation.',
            },
          ],
        },
      ]
    : [
        {
          id: 'mod-1',
          title: isAm
            ? 'ምዕራፍ 1፡ የሃርድዌር ሰርኪዩት ንድፍ እና የመለኪያ መመሪያዎች'
            : 'Chapter 1: Power Sequencing & Voltage Test Points',
          activities: [
            { id: 'ch-1', title: isAm ? 'ክፍል 1፡ የዋናው ሰሌዳ ቮልቴጅ ሰንጠረዥ እና የመቋቋም አቅም' : 'Topic 1: Motherboard Diode Drop Reading Reference Chart', type: 'activity', duration: 'pp. 1-25' },
            { id: 'ch-2', title: isAm ? 'ክፍል 2፡ የባትሪ እና የቻርጅ ሰርኪዩት ፍሰት ዲያግራም' : 'Topic 2: Battery & VBUS Step-by-Step Circuit Flowchart', type: 'activity', duration: 'pp. 26-50' },
            { id: 'ch-3', title: isAm ? 'ክፍል 3፡ የሾርት ሰርኪውት መለያ ቼክሊስት' : 'Topic 3: Systematic Dead-Short Elimination Matrix', type: 'quiz', duration: 'Assessment Quiz' },
          ],
        },
        {
          id: 'mod-2',
          title: isAm
            ? 'ምዕራፍ 2፡ የላፕቶፕ እና የስማርትፎን ቺፖች ማውጫ'
            : 'Chapter 2: Component Identification & Pinout Handbooks',
          activities: [
            { id: 'ch-4', title: isAm ? 'ክፍል 4፡ የSMD ኮዶችና የቺፕ ማርኪንግ ዲኮደር' : 'Topic 4: SMD Package Codes & Capacitor Marking Lookups', type: 'activity', duration: 'pp. 51-85' },
            { id: 'ch-5', title: isAm ? 'ክፍል 5፡ የPower Management IC (PMIC) ፒንአውቶች' : 'Topic 5: Power Management IC Pin Function Diagnostic Maps', type: 'activity', duration: 'pp. 86-130' },
            { id: 'ch-6', title: isAm ? 'ክፍል 6፡ የኢንዱስትሪ ደረጃ የሙያ COC ሰነዶች' : 'Topic 6: National Occupational Skill Standards (NOSS) Blueprint', type: 'quiz', duration: 'Assessment Quiz' },
          ],
        },
      ]

  const activeModules = dynamicCurriculum || defaultModules

  // Duration & total activities sum across all modules
  const totalActivities = activeModules.reduce((sum, mod) => sum + (mod.activities?.length || 0), 0)
  let durationOrPages = resource.pages || (isVideo ? '7:15:00' : '250 Pages')
  let activityCount = `${totalActivities || (isVideo ? 20 : 18)}`

  if (resource.pages && resource.pages.includes('·')) {
    const parts = resource.pages.split('·')
    durationOrPages = parts[0].trim().replace(/Hours?/i, '').trim()
    const parsedActivities = parts[1].trim().replace(/[^0-9]/g, '')
    if (parsedActivities) activityCount = parsedActivities
  }

  const toggleModule = (id: string) => {
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleActivityClick = (act: any) => {
    setSelectedActivityId(act.id)
    if (act.type === 'quiz') {
      setQuizModalActivity(act)
    } else {
      if (act.videoUrl) {
        setCurrentVideoUrl(act.videoUrl)
      }
      setIsPlayingVideo(true)
      videoContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href)
        setCopiedShare(true)
        setTimeout(() => setCopiedShare(false), 2500)
      }
    } catch {
      // Fallback
    }
  }

  const thumbImage =
    resource.thumbnailUrl ||
    (isVideo ? '/images/course-preview-hero.jpg' : '/images/manual-book-cover.jpg')

  const videoSrc =
    resource.fileUrl ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

  return (
    <SiteShell>
      <main className="container mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* ── BREADCRUMB / BACK LINK ── */}
        <div className="mb-6">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>{isAm ? 'ወደ ኦንላይን ኮርሶች ተመለስ' : 'Back to Online Courses'}</span>
          </Link>
        </div>

        {/* ── COURSE HEADER (EXACT SCREENSHOT STYLE) ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {resource.title}
          </h1>
          {resource.subtitle && (
            <p className="mt-2.5 text-base md:text-lg text-muted-foreground font-medium max-w-3xl leading-relaxed">
              {resource.subtitle}
            </p>
          )}

          {/* Instructor Line with Avatar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="relative size-11 overflow-hidden rounded-full border-2 border-primary/20 bg-muted shrink-0 shadow-sm">
              <img
                src="/images/logo.jpg"
                alt={resource.instructor || 'Hello Technology Academy'}
                className="size-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {isVideo
                  ? isAm
                    ? 'ስልጠናው የተዘጋጀው በ'
                    : 'A course by'
                  : isAm
                  ? 'መጽሐፉ የተዘጋጀው በ'
                  : 'A book by'}
              </p>
              <p className="text-sm font-bold text-foreground">
                {resource.instructor ||
                  (isAm ? 'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል' : 'Hello Technology Academy')}
              </p>
              {resource.instructorRole && (
                <p className="text-[11px] text-muted-foreground font-medium">
                  {resource.instructorRole}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── TWO-COLUMN LAYOUT: CONTENT + SIDEBAR ── */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* ──── LEFT MAIN COLUMN (8 cols) ──── */}
          <div className="space-y-10 lg:col-span-8">
            {/* 1. Featured Media Container */}
            <div ref={videoContainerRef} className="overflow-hidden rounded-3xl border border-border/80 bg-slate-950 shadow-xl relative group">
              {isPlayingVideo ? (
                <div className="relative aspect-video w-full bg-black">
                  <video
                    key={videoSrc}
                    src={videoSrc}
                    controls
                    autoPlay
                    className="size-full object-cover"
                  />
                </div>
              ) : (
                <div
                  onClick={() => isVideo && setIsPlayingVideo(true)}
                  className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={thumbImage}
                    alt={resource.title}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Centered Circular Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-16 md:size-20 items-center justify-center rounded-full bg-sky-500/90 text-white shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-400">
                      {isVideo ? (
                        <Play className="size-8 fill-white ml-1" />
                      ) : (
                        <BookOpen className="size-8 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Top-Right Format Pill */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/20">
                      {isVideo ? <Video className="size-3" /> : <BookOpen className="size-3" />}
                      {isVideo
                        ? isAm
                          ? 'የቪዲዮ ኮርስ'
                          : 'Video Course'
                        : isAm
                        ? 'ቴክኒካል መጽሐፍ'
                        : 'Book / Manual'}
                    </span>
                  </div>

                  {/* Bottom Highlight */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-semibold text-slate-300">
                      {isVideo
                        ? isAm
                          ? 'ቀጥታ የላብራቶሪ ማሳያ ለመመልከት ይጫኑ'
                          : 'Click to watch preview demonstration'
                        : isAm
                        ? 'የመጽሐፉን ይዘትና ምዕራፎች ከታች ይመልከቱ'
                        : 'Review book curriculum and chapters below'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. About the Course Section with Share Button */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {isVideo
                    ? isAm
                      ? 'ስለ ስልጠናው (About the Course)'
                      : 'About the Course'
                    : isAm
                    ? 'ስለ መመሪያው (About the Resource)'
                    : 'About the Resource'}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="rounded-xl gap-2 text-xs font-semibold hover:border-primary/50"
                >
                  {copiedShare ? (
                    <>
                      <Check className="size-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {isAm ? 'ተቀድቷል!' : 'Copied!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 className="size-3.5 text-primary" />
                      <span>{isAm ? 'አጋራ' : 'Share'}</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-sm md:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                {resource.description}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {isAm
                  ? 'ይህ የስልጠና ማቴሪያል በባህር ዳር ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል መምህራን የተዘጋጀ ሲሆን፣ በእውነተኛ የወርክሾፕ የጥገና ሰሌዳዎች፣ ማይክሮስኮፖች፣ መልቲሜትሮች እና የዲሲ ፓወር ሰፕላይ መለኪያዎች ላይ የተመሰረተ ነው። ሰልጣኞች የቲዮሪ እውቀት ብቻ ሳይሆን በገበያው ላይ የሚፈለጉ እውነተኛ የዲያግኖስቲክስ ክህሎቶችን እንዲያዳብሩ ያግዛል።'
                  : 'Filmed and compiled in our dedicated hardware diagnostic laboratories in Bahir Dar, Ethiopia. Designed for practical workbench competence: from fundamental schematic reading and power sequencing to component-level troubleshooting, BGA reballing, and national TVET COC preparation.'}
              </p>

              {/* 3. Requirements Section */}
              <div className="mt-8 border-t border-border/60 pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  {isAm ? 'ቅድመ ሁኔታዎች (Requirements)' : 'Requirements'}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    <span>
                      {isAm
                        ? 'ስማርት ስልክ፣ ታብሌት ወይም ኮምፒውተር ከኢንተርኔት ግንኙነት ጋር'
                        : 'Smartphone, tablet, or desktop computer with internet access'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    <span>
                      {isAm
                        ? 'የሰርኪዩት ንድፎችንና የቮልቴጅ መለኪያዎችን ለመመዝገብ ማስታወሻ ደብተር'
                        : 'Technical notebook for schematic annotations and voltage drop charts'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    <span>
                      {isAm
                        ? 'መሰረታዊ የኤሌክትሮኒክስ ፍላጎት (ቀደም ሲል የነበረ ልምድ አይጠይቅም)'
                        : 'Passion for practical repair & diagnostics (no prior hardware experience required)'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* 4. Who is this course for? Section */}
              <div className="mt-8 border-t border-border/60 pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  {isAm ? 'ይህ ስልጠና ለማን ነው? (Who is this course for?)' : 'Who is this course for?'}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    <span>
                      {isAm
                        ? 'የ12ኛ ክፍል ተፈታኞችና ተመራቂዎች ተግባራዊ የገበያ ሙያ መያዝ ለሚፈልጉ'
                        : 'High school graduates and students seeking job-ready vocational engineering skills'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    <span>
                      {isAm
                        ? 'የግል የኤሌክትሮኒክስ ጥገና ንግድ (Repair Shop) ለመክፈት ያቀዱ ባለሙያዎች'
                        : 'Technicians and entrepreneurs planning to launch an independent device repair shop'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    <span>
                      {isAm
                        ? 'ለብሔራዊ የCOC ብቃት ምዘና ፈተና ዝግጅት የሚያደርጉ የቲቪቲ ተማሪዎች'
                        : 'Vocational students preparing for national TVET / COC competence assessment exams'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Skills Learned Badges */}
              {resource.skillsLearned && (
                <div className="mt-8 border-t border-border/60 pt-6">
                  <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <span>{isAm ? 'የሚማሯቸው ዋና ዋና ክህሎቶች' : 'Skills You Will Master'}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.skillsLearned.split(',').map((s: string, idx: number) => {
                      const trimmed = s.trim()
                      if (!trimmed) return null
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                        >
                          <CheckCircle2 className="size-3.5 text-primary" />
                          {trimmed}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 5. What you will learn Section (Accordion Modules) */}
              <div className="mt-8 border-t border-border/60 pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  {isAm ? 'የሚማሩት ይዘቶች (What you will learn)' : 'What you will learn'}
                </h3>

                <div className="space-y-3">
                  {activeModules.map((mod) => {
                    const isOpen = Boolean(openModules[mod.id])
                    return (
                      <div
                        key={mod.id}
                        className="overflow-hidden rounded-xl border border-border/70 bg-muted/20 transition-all duration-200"
                      >
                        <button
                          onClick={() => toggleModule(mod.id)}
                          className="flex w-full items-center justify-between p-4 text-left font-bold text-foreground hover:bg-muted/40 transition-colors"
                        >
                          <span className="text-sm font-semibold">{mod.title}</span>
                          {isOpen ? (
                            <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="border-t border-border/60 bg-card p-3 sm:p-4 space-y-1.5">
                            {mod.activities.map((act: any, aIdx: number) => {
                              const actObj = typeof act === 'string'
                                ? {
                                    id: `act-${mod.id}-${aIdx}`,
                                    title: act,
                                    type: act.toLowerCase().includes('quiz') ? 'quiz' : 'video',
                                    duration: '',
                                  }
                                : act
                              const isActSelected = selectedActivityId === actObj.id
                              const isQuiz = actObj.type === 'quiz'

                              return (
                                <button
                                  type="button"
                                  key={actObj.id || aIdx}
                                  onClick={() => handleActivityClick(actObj)}
                                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                                    isActSelected
                                      ? 'bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-200 font-semibold shadow-sm'
                                      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    {isQuiz ? (
                                      <div className="flex size-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                                        <HelpCircle className="size-3.5" />
                                      </div>
                                    ) : isVideo ? (
                                      <div
                                        className={`flex size-6 items-center justify-center rounded-lg shrink-0 ${
                                          isActSelected
                                            ? 'bg-sky-500 text-white'
                                            : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                                        }`}
                                      >
                                        <Play className="size-3 fill-current ml-0.5" />
                                      </div>
                                    ) : (
                                      <div className="flex size-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                                        <FileText className="size-3.5" />
                                      </div>
                                    )}
                                    <div className="truncate">
                                      <span className="truncate">{actObj.title}</span>
                                      {actObj.labExercise && (
                                        <span className="block text-[11px] text-muted-foreground/80 font-normal truncate mt-0.5">
                                          {actObj.labExercise}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    {isQuiz && (
                                      <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                        {isAm ? 'ፈተና (Quiz)' : 'Quiz / Activity'}
                                      </span>
                                    )}
                                    {actObj.duration && (
                                      <span className="text-[11px] text-muted-foreground font-medium">
                                        {actObj.duration}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ──── RIGHT SIDEBAR (STICKY CARD - 4 cols) ──── */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl space-y-6">
              {/* Primary Action Button matching Screenshot */}
              <div>
                <Button
                  onClick={handleGetStarted}
                  className={`w-full h-12 rounded-2xl font-bold text-sm shadow-lg transition-all duration-200 ${
                    hasPurchased
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
                  }`}
                >
                  {hasPurchased
                    ? isAm
                      ? 'ወደ ስልጠናው ይቀጥሉ (Continue Learning)'
                      : 'Continue Learning'
                    : resource.priceETB === 0
                    ? isAm
                      ? 'አሁኑኑ በነፃ ይጀምሩ (Get Started Free)'
                      : 'Get Started Free'
                    : isAm
                    ? `አሁኑኑ ይመዝገቡ · ${resource.priceETB} ብር`
                    : `Get Started · ${resource.priceETB} ETB`}
                </Button>
              </div>

              {/* Course Meta Attributes List (Matching Screenshots 1, 2, 3, 4) */}
              <div className="space-y-4 pt-2 border-t border-border/60 text-xs">
                {/* Level */}
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2.5">
                    <BarChart3 className="size-4 text-sky-500" />
                    <span>{isAm ? 'ደረጃ (Level)' : 'Level'}</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {resource.level || (isAm ? 'ለሁሉም' : 'Everyone')}
                  </span>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2.5">
                    <Volume2 className="size-4 text-blue-500" />
                    <span>{isAm ? 'ቋንቋ (Language)' : 'Language'}</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {isAm ? 'አማርኛ / Amharic' : 'Amharic & English'}
                  </span>
                </div>

                {/* Duration / Pages */}
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2.5">
                    <Clock className="size-4 text-amber-500" />
                    <span>
                      {isVideo
                        ? isAm
                          ? 'የኮርስ ቆይታ (Duration)'
                          : 'Course Completion Duration'
                        : isAm
                        ? 'የገጽ ብዛት (Pages)'
                        : 'Book Length'}
                    </span>
                  </span>
                  <span className="font-semibold text-foreground">{durationOrPages}</span>
                </div>

                {/* Number of Activity */}
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2.5">
                    <ListChecks className="size-4 text-emerald-500" />
                    <span>
                      {isAm ? 'የክፍሎች ብዛት (Activities)' : 'Number of Activity'}
                    </span>
                  </span>
                  <span className="font-semibold text-foreground">{activityCount}</span>
                </div>

                {/* Multi-Device Access */}
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2.5">
                    <Smartphone className="size-4 text-purple-500" />
                    <span>
                      {isAm
                        ? 'በሞባይል፣ ኮምፒውተርና ቲቪ መዳረሻ'
                        : 'Access on mobile, desktop, and tv'}
                    </span>
                  </span>
                  <Check className="size-4 text-emerald-500 font-bold" />
                </div>

                {/* Telegram Community */}
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2.5">
                    <Users className="size-4 text-sky-500" />
                    <span>
                      {isAm ? 'የቴሌግራም ማህበረሰብ መዳረሻ' : 'Telegram Community Access'}
                    </span>
                  </span>
                  <Check className="size-4 text-emerald-500 font-bold" />
                </div>

                {/* Certificate */}
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2.5">
                    <Award className="size-4 text-amber-500" />
                    <span>
                      {isAm ? 'የብቃት ማረጋገጫ ሰርተፊኬት' : 'Certificate of completion'}
                    </span>
                  </span>
                  <Check className="size-4 text-emerald-500 font-bold" />
                </div>
              </div>

              {/* Trust Box */}
              <div className="rounded-2xl bg-muted/40 p-4 text-[11px] text-muted-foreground space-y-1.5 border border-border/50">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  {isAm ? '100% የተግባር ላብራቶሪ ዋስትና' : 'Hello Technology Academy Standard'}
                </p>
                <p>
                  {isAm
                    ? 'በኢትዮጵያ ውስጥ የተረጋገጠ የቲቪቲ እና የCOC ደረጃዎችን የጠበቀ የቴክኒክ ትምህርት።'
                    : 'Accredited technical excellence aligned with national Ethiopian occupational qualifications.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Interactive Quiz & Practical Assessment Modal ── */}
      {quizModalActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-2xl">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setQuizModalActivity(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <HelpCircle className="size-3.5" />
                {isAm ? 'ተግባራዊ የፈተና ክፍል' : 'Interactive Assessment Activity'}
              </span>
              {quizModalActivity.duration && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                  <Clock className="size-3.5" />
                  {quizModalActivity.duration}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">
              {quizModalActivity.title}
            </h3>

            {/* Details & Instructions */}
            <div className="rounded-2xl bg-muted/40 p-4 border border-border/60 text-xs text-muted-foreground leading-relaxed space-y-2 mb-6">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-500" />
                {isAm ? 'የፈተናው ይዘትና መመሪያዎች' : 'Assessment Overview & Objectives'}
              </p>
              <p>
                {quizModalActivity.quizNotes ||
                  (isAm
                    ? 'ይህ የተግባር ፈተና በዚህ ክፍል የተማሩትን የደህንነት፣ የመሳሪያ አጠቃቀምና የሰርኪዩት መለያ እውቀትዎን ይፈትናል።'
                    : 'This hands-on quiz assesses your mastery of bench diagnostics, safety protocols, and multimeter circuit verification.')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setQuizModalActivity(null)}
                className="rounded-xl text-xs font-semibold"
              >
                {isAm ? 'ዝጋ' : 'Close'}
              </Button>
              <Button
                onClick={() => {
                  setQuizModalActivity(null)
                  handleGetStarted()
                }}
                className="rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20"
              >
                {hasPurchased
                  ? isAm
                    ? 'ፈተናውን አሁኑኑ ጀምር'
                    : 'Start Assessment Now'
                  : isAm
                  ? 'ተመዝግበው ፈተናውን ይውሰዱ'
                  : 'Enroll to Access Assessment'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </SiteShell>
  )
}
