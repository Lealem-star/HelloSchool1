'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  Circle,
  BookOpen,
  Video,
  FileText,
  ShieldCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Eye,
  Sliders,
  Award,
  Terminal,
} from 'lucide-react'
import { DigitalResourceMeta, LessonItem, ManualChapter } from '@/lib/digital-catalog'
import { Button } from '@/components/ui/button'

type StudentContext = {
  fullName: string
  studentId: string
  institutionalEmail: string
}

type SecureLearningStudioProps = {
  resource: DigitalResourceMeta
  student: StudentContext
  isOpen: boolean
  onClose: () => void
  completedLessonIds?: string[]
  onToggleLessonCompletion?: (lessonId: string) => void
}

export function SecureLearningStudio({
  resource,
  student,
  isOpen,
  onClose,
  completedLessonIds = [],
  onToggleLessonCompletion,
}: SecureLearningStudioProps) {
  // Video player states
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeTab, setActiveTab] = useState<'notes' | 'exercise' | 'schematic'>('notes')

  // Manual reader states
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100) // percentage
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Floating Watermark coordinates (smoothly drifts to prevent screenshot cropping)
  const [watermarkPos, setWatermarkPos] = useState({ x: 0, y: 0 })
  const [drmWarning, setDrmWarning] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Drift watermark position every 6 seconds
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      const offsetX = Math.floor(Math.random() * 80) - 40
      const offsetY = Math.floor(Math.random() * 60) - 30
      setWatermarkPos({ x: offsetX, y: offsetY })
    }, 6000)
    return () => clearInterval(interval)
  }, [isOpen])

  // Anti-piracy keyboard event interceptor
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent PrintScreen
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault()
        triggerDrmWarning('Screen capture attempted: Course material is protected by Hello Technology Training Center copyright.')
        return false
      }

      // Prevent Ctrl+S, Ctrl+P, Ctrl+U
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P' || e.key === 'u' || e.key === 'U') {
          e.preventDefault()
          triggerDrmWarning('Saving or printing protected course materials is strictly prohibited.')
          return false
        }
      }

      // Prevent F12 / DevTools shortcut
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))) {
        e.preventDefault()
        triggerDrmWarning('Developer inspection is disabled inside the protected study studio.')
        return false
      }

      // Escape to close
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const triggerDrmWarning = (msg: string) => {
    setDrmWarning(msg)
    setTimeout(() => setDrmWarning(null), 4000)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    triggerDrmWarning('Right-click is disabled to protect Hello Technology proprietary course materials.')
  }

  // Playback control helpers
  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration || 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  const isVideoCourse = resource.format === 'Video Masterclass'
  const lessons = resource.lessons || []
  const currentLesson = lessons[currentLessonIndex]

  const chapters = resource.chapters || []
  const currentChapter = chapters[currentChapterIndex]

  return (
    <div
      onContextMenu={handleContextMenu}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* ─── Top Studio App Bar ─── */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-[#155DFC] dark:text-sky-400 border border-blue-500/30">
            {isVideoCourse ? <Video className="size-5" /> : <BookOpen className="size-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-sky-400 uppercase border border-blue-500/30">
                {resource.format}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <ShieldCheck className="size-3.5" /> DRM Protected Stream
              </span>
            </div>
            <h1 className="truncate text-sm sm:text-base font-bold text-white mt-0.5">
              {resource.title}
            </h1>
          </div>
        </div>

        {/* Student Session & Watermark Tag */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-200">
              {student.fullName}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {student.studentId} · {student.institutionalEmail}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs gap-1.5"
          >
            <X className="size-4" /> Close Studio
          </Button>
        </div>
      </header>

      {/* ─── Dynamic Warning Alert Overlay (if user tries screen capture) ─── */}
      {drmWarning && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl border border-amber-500/50 bg-amber-950/90 text-amber-200 px-5 py-3 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-300">
          <AlertTriangle className="size-5 text-amber-400 shrink-0" />
          <span>{drmWarning}</span>
        </div>
      )}

      {/* ─── Main Content Studio Body ─── */}
      <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Floating Moving Watermark Overlay (Anti-Piracy) */}
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center overflow-hidden">
          <div
            className="transform select-none text-center font-mono font-bold uppercase tracking-widest text-white/10 dark:text-white/15 transition-all duration-1000 rotate-[-25deg]"
            style={{
              transform: `translate(${watermarkPos.x}px, ${watermarkPos.y}px) rotate(-25deg)`,
            }}
          >
            <p className="text-sm sm:text-lg opacity-80">
              {student.fullName} • {student.studentId}
            </p>
            <p className="text-xs sm:text-sm opacity-60">
              {student.institutionalEmail} • LICENSED STUDENT COPY
            </p>
            <p className="text-[10px] text-sky-400/30 tracking-widest">
              HELLO TECHNOLOGY TRAINING CENTER • DIGITAL ACADEMY • NON-DOWNLOADABLE MATERIAL
            </p>
          </div>
        </div>

        {/* ─── LEFT: MEDIA VIEWER (VIDEO OR MANUAL READER) ─── */}
        <div className="flex-1 flex flex-col bg-black overflow-y-auto relative">
          {isVideoCourse && currentLesson ? (
            /* ── VIDEO PLAYER VIEW ── */
            <div className="flex flex-col flex-1">
              {/* Video Player Box */}
              <div className="relative aspect-video w-full max-h-[65vh] bg-slate-950 flex items-center justify-center overflow-hidden group">
                <video
                  ref={videoRef}
                  src={currentLesson.videoUrl}
                  className="w-full h-full object-contain"
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => {
                    setIsPlaying(false)
                    if (onToggleLessonCompletion) onToggleLessonCompletion(currentLesson.id)
                  }}
                  onClick={togglePlay}
                />

                {/* Big Center Play Overlay (when paused) */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    type="button"
                    aria-label="Play Lesson"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-all cursor-pointer"
                  >
                    <div className="flex size-16 sm:size-20 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-2xl shadow-blue-500/40 hover:scale-110 transition-transform">
                      <Play className="size-8 ml-1" />
                    </div>
                  </button>
                )}

                {/* Custom Video Control Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
                  {/* Progress Seek Bar */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-700 accent-blue-500 rounded-lg cursor-pointer transition-all"
                  />

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                      </button>

                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = 0
                            setCurrentTime(0)
                          }
                        }}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Restart Lesson"
                      >
                        <RotateCcw className="size-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        <span className="text-white">{formatSeconds(currentTime)}</span>
                        <span>/</span>
                        <span>{formatSeconds(duration)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Playback speed selector */}
                      <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/60 text-[11px]">
                        {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => handleSpeedChange(spd)}
                            className={`px-1.5 py-0.5 rounded ${playbackSpeed === spd
                                ? 'bg-blue-600 text-white font-bold'
                                : 'text-slate-400 hover:text-white'
                              }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.muted = !isMuted
                            setIsMuted(!isMuted)
                          }
                        }}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Details & Interactive Tabs */}
              <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-sky-400">
                      Lesson {currentLessonIndex + 1} of {lessons.length}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                      {currentLesson.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Duration: {currentLesson.duration} · Instructor: {resource.instructor}
                    </p>
                  </div>

                  {onToggleLessonCompletion && (
                    <Button
                      onClick={() => onToggleLessonCompletion(currentLesson.id)}
                      variant={completedLessonIds.includes(currentLesson.id) ? 'default' : 'outline'}
                      size="sm"
                      className={`rounded-xl text-xs gap-1.5 font-bold ${completedLessonIds.includes(currentLesson.id)
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                    >
                      <CheckCircle2 className="size-4" />
                      {completedLessonIds.includes(currentLesson.id)
                        ? 'Completed ✓'
                        : 'Mark as Completed'}
                    </Button>
                  )}
                </div>

                {/* Sub-tabs: Notes, Lab Exercise, Schematics */}
                <div className="flex items-center gap-2 mt-4 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-3 py-1.5 rounded-xl border transition-colors ${activeTab === 'notes'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                  >
                    Lab Takeaways & Theory
                  </button>
                  <button
                    onClick={() => setActiveTab('exercise')}
                    className={`px-3 py-1.5 rounded-xl border transition-colors ${activeTab === 'exercise'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                  >
                    Practical Workbench Exercise
                  </button>
                </div>

                {/* Tab Content */}
                <div className="mt-4 text-sm leading-relaxed text-slate-300">
                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      <p>{currentLesson.summary}</p>
                      {Array.isArray(currentLesson.keyTakeaways) && currentLesson.keyTakeaways.length > 0 && (
                        <div className="rounded-2xl border border-blue-500/20 bg-blue-950/30 p-4">
                          <h4 className="font-bold text-sky-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Sparkles className="size-3.5" /> Key Technician Rules
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                            {currentLesson.keyTakeaways.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'exercise' && (
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 text-xs leading-relaxed text-slate-200">
                      <h4 className="font-bold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                        <Award className="size-4" /> Hands-on Laboratory Assignment
                      </h4>
                      <p>{currentLesson.labExercise}</p>
                      <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                        <Terminal className="size-3.5" />
                        <span>Bring your test board to Hello Technology Bahir Dar Campus for mentor verification.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ── DIGITAL MANUAL & BOOK READER VIEW ── */
            <div className="flex flex-col flex-1 p-4 sm:p-8 bg-slate-950 overflow-y-auto">
              {/* Reader Action Controls */}
              <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800 bg-slate-900/60 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-400">
                    Chapter {currentChapterIndex + 1} of {chapters.length}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentChapter?.pageRange}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Zoom controls */}
                  <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl text-xs text-slate-300">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                      className="p-1 hover:text-white"
                      title="Zoom Out"
                    >
                      <ZoomOut className="size-3.5" />
                    </button>
                    <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                      className="p-1 hover:text-white"
                      title="Zoom In"
                    >
                      <ZoomIn className="size-3.5" />
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentChapterIndex === 0}
                    onClick={() => setCurrentChapterIndex((i) => Math.max(0, i - 1))}
                    className="rounded-xl border-slate-700 bg-slate-800 text-xs gap-1"
                  >
                    <ChevronLeft className="size-3.5" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentChapterIndex === chapters.length - 1}
                    onClick={() => setCurrentChapterIndex((i) => Math.min(chapters.length - 1, i + 1))}
                    className="rounded-xl border-slate-700 bg-slate-800 text-xs gap-1"
                  >
                    Next <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Document Pages Container */}
              {currentChapter ? (
                <div
                  className="mx-auto max-w-4xl w-full rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-10 shadow-2xl space-y-8"
                  style={{ fontSize: `${zoomLevel}%` }}
                >
                  <div className="border-b border-slate-800 pb-5">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-sky-400 border border-blue-500/20">
                      {currentChapter.pageRange}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                      {currentChapter.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      {currentChapter.summary}
                    </p>
                  </div>

                  {/* Chapter Sections */}
                  {Array.isArray(currentChapter.sections) && currentChapter.sections.length > 0 ? (
                    currentChapter.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-4">
                        <h3 className="text-lg font-bold text-sky-300">
                          {sec.heading}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-300">
                          {sec.body}
                        </p>

                        {Array.isArray(sec.checkpoints) && sec.checkpoints.length > 0 && (
                          <div className="rounded-2xl border border-blue-500/20 bg-blue-950/30 p-4 space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
                              Laboratory Checklist & Verification:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                              {sec.checkpoints.map((cp, cIdx) => (
                                <li key={cIdx}>{cp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Diagnostic Benchmark Table */}
                        {Array.isArray(sec.diagnosticTable) && sec.diagnosticTable.length > 0 && (
                          <div className="overflow-x-auto rounded-2xl border border-slate-800 mt-4">
                            <table className="w-full text-left text-xs text-slate-300">
                              <thead className="bg-slate-800 text-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                                <tr>
                                  <th className="p-3">Fault State</th>
                                  <th className="p-3">Symptom</th>
                                  <th className="p-3">Multimeter Test</th>
                                  <th className="p-3">Recommended Fix</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800">
                                {sec.diagnosticTable.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-850">
                                    <td className="p-3 font-semibold text-white">{row.fault}</td>
                                    <td className="p-3 text-slate-400">{row.symptom}</td>
                                    <td className="p-3 font-mono text-sky-300 bg-slate-950/40">{row.multimeterReading}</td>
                                    <td className="p-3 text-emerald-400 font-medium">{row.fix}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
                      <h3 className="text-lg font-bold text-sky-300">
                        {currentChapter.title || 'Technical Chapter Overview'}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-300">
                        {currentChapter.summary || 'Detailed circuit flowcharts, diagnostic procedures, and multimeter test points are provided in this section.'}
                      </p>
                    </div>
                  )}

                  {currentChapter.circuitNote && (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4 text-xs text-amber-200">
                      <strong>Schematic Note:</strong> {currentChapter.circuitNote}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mx-auto max-w-xl text-center py-16 text-slate-400">
                  <p className="text-sm">Technical diagnostic material is ready to review. Select a chapter from the curriculum sidebar.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── RIGHT: CURRICULUM & LESSONS SIDEBAR ─── */}
        <aside className="w-full lg:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/95 flex flex-col h-72 lg:h-auto overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">
                {isVideoCourse ? 'Course Curriculum' : 'Table of Contents'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isVideoCourse ? `${lessons.length} Recorded Lessons` : `${chapters.length} Diagnostic Chapters`}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-400">
              {isVideoCourse
                ? `${Math.round((completedLessonIds.length / Math.max(1, lessons.length)) * 100)}% Done`
                : 'Full Access'}
            </span>
          </div>

          {/* List of Lessons or Chapters */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
            {isVideoCourse
              ? lessons.map((lesson, idx) => {
                const isSelected = idx === currentLessonIndex
                const isCompleted = completedLessonIds.includes(lesson.id)

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setCurrentLessonIndex(idx)
                      setIsPlaying(true)
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${isSelected
                        ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="size-4 text-emerald-400" />
                      ) : (
                        <Circle className="size-4 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {lesson.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Duration: {lesson.duration}
                      </span>
                    </div>
                  </button>
                )
              })
              : chapters.map((chap, idx) => {
                const isSelected = idx === currentChapterIndex
                return (
                  <button
                    key={chap.id}
                    onClick={() => setCurrentChapterIndex(idx)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${isSelected
                        ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-slate-800 font-mono text-[11px] font-bold text-sky-400">
                      0{idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {chap.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        {chap.pageRange}
                      </span>
                    </div>
                  </button>
                )
              })}
          </div>

          {/* Anti-Piracy Footer Badge */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Lock className="size-3 text-emerald-400" /> Non-Downloadable DRM
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              STU: {student.studentId}
            </span>
          </div>
        </aside>
      </div>
    </div>
  )
}
