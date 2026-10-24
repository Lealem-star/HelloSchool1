'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Phone,
  ExternalLink,
  ChevronDown,
  Loader2,
  Copy,
  Check,
  GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { schoolConfig } from '@/lib/data'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const QUICK_PROMPTS = [
  { labelAm: '📅 የቀጣይ ዙር ምዝገባ', labelEn: 'Next Batch Dates', query: 'የቀጣይ ዙር (Batch) ምዝገባ መቼ ነው?' },
  { labelAm: '📱 የሞባይል ጥገና', labelEn: 'Mobile Repair', query: 'ስለ ሞባይል ጥገና ስልጠና እና ዋጋ ንገረኝ' },
  { labelAm: '💻 የኮምፒውተር ጥገና', labelEn: 'Computer Course', query: 'ስለ ኮምፒውተርና ላፕቶፕ ጥገና ስልጠና ማወቅ እፈልጋለሁ' },
  { labelAm: '📍 አድራሻና ስልክ', labelEn: 'Location & Phone', query: 'የትምህርት ቤቱ አድራሻ እና ስልክ ቁጥር የት ነው?' },
  { labelAm: '📝 እንዴት መመዝገብ እችላለሁ?', labelEn: 'How to Register', query: 'እንዴት በኦንላይን መመዝገብ እችላለሁ? መስፈርቱ ምንድን ነው?' },
]

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Initialize with welcoming greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content:
            'ሰላም! እንኳን ወደ **ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል** (Hello Technology Training Center) በደህና መጡ! 👋\n\nእኔ የእርስዎ ብልህ የትምህርት አማካሪ ነኝ። ስለ ስልጠና ዓይነቶች፣ የቀጣይ ዙር (Batch) ምዝገባ፣ ክፍያ፣ የስልጠና ፈረቃዎች እና አድራሻ በደስታ እመልስልዎታለሁ።\n\nHow can I help you today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }
  }, [messages.length])

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, loading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setHasUnreadNotification(false)
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [isOpen])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || loading) return

    const userMessage: Message = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response')
      }

      const botMessage: Message = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: data.content || 'ይቅርታ፣ ምላሽ መስጠት አልቻልኩም። እባክዎ በ 0947747070 ይደውሉልን።',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err: any) {
      const errorMessage: Message = {
        id: 'bot_err_' + Date.now(),
        role: 'assistant',
        content:
          'ይቅርታ፣ ጊዜያዊ የግንኙነት መቋረጥ አጋጥሟል። እባክዎ በቀጥታ በ **09 47 74 70 70** ይደውሉልን ወይም በቴሌግራም [@HHaileHaile](https://t.me/Hellotechn) ያግኙን።',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          'ሰላም! ውይይቱ እንደ አዲስ ተጀምሯል። ስለ ምን ስልጠና ወይም የቀጣይ ዙር ምዝገባ ማወቅ ይፈልጋሉ?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Parse simple markdown: bold, bullet points, and links
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n')
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-[13px]">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />

          // Parse markdown link [text](url) and **bold**
          const parts = line.split(/(\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*)/g)

          return (
            <p key={idx} className="whitespace-pre-wrap">
              {parts.map((part, pIdx) => {
                if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
                  const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/)
                  if (match) {
                    const [, label, url] = match
                    const isInternal = url.startsWith('/')
                    return isInternal ? (
                      <Link
                        key={pIdx}
                        href={url}
                        onClick={() => setIsOpen(false)}
                        className="font-bold text-[#155DFC] dark:text-sky-400 underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-0.5"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        key={pIdx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#155DFC] dark:text-sky-400 underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-0.5"
                      >
                        {label} <ExternalLink className="size-2.5 inline" />
                      </a>
                    )
                  }
                }
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="font-bold text-foreground">
                      {part.slice(2, -2)}
                    </strong>
                  )
                }
                return <span key={pIdx}>{part}</span>
              })}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* ── FLOATING LAUNCHER BUTTON ── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Floating Greeting Pill (Only visible when chat is closed) */}
        {!isOpen && hasUnreadNotification && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-2xl border border-blue-500/30 bg-card/95 px-3.5 py-2 text-xs font-semibold text-foreground shadow-xl backdrop-blur-md cursor-pointer animate-bounce hover:border-[#155DFC] transition-all"
          >
            <span className="flex size-2 rounded-full bg-emerald-500 animate-ping" />
            <span>👋 ጥያቄ አለዎት? / Ask AI</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Chatbot' : 'Open Hello Technology AI Chatbot'}
          className={`group relative flex size-14 items-center justify-center rounded-2xl shadow-2xl transition-all duration-300 active:scale-95 ${
            isOpen
              ? 'bg-muted text-foreground border border-border rotate-90'
              : 'bg-gradient-to-br from-[#1048ca] via-[#155DFC] to-[#0c3694] text-white shadow-blue-500/30 hover:scale-105 hover:shadow-blue-500/50'
          }`}
        >
          {isOpen ? (
            <X className="size-6 transition-transform" />
          ) : (
            <>
              <MessageCircle className="size-6 transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
                <span className="size-1.5 rounded-full bg-white" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* ── CHAT MODAL WINDOW ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Hello Technology AI Assistant"
          className="fixed bottom-24 right-4 sm:right-6 z-50 flex w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[82vh] flex-col overflow-hidden rounded-3xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-2xl animate-fade-in-up"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-blue-600 via-[#155DFC] to-blue-700 px-5 py-3.5 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-inner">
                <Bot className="size-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-blue-700" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight leading-none text-white">
                    Hello Technology Advisor
                  </h3>
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] font-bold text-blue-100">
                    AI
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-blue-100 font-medium leading-none">
                  Online · Bilingual (አማርኛ & English)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="rounded-lg p-1.5 text-blue-100 hover:bg-white/15 hover:text-white transition"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-blue-100 hover:bg-white/15 hover:text-white transition"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="border-b border-border/50 bg-muted/30 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                type="button"
                disabled={loading}
                onClick={() => handleSend(p.query)}
                className="shrink-0 rounded-xl border border-blue-500/20 bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-foreground transition-all hover:border-[#155DFC] hover:bg-[#155DFC]/10 hover:text-[#155DFC] active:scale-95 disabled:opacity-50"
              >
                {p.labelAm}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant'
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-[#155DFC]/10 text-[#155DFC] dark:text-sky-400 border border-blue-500/20 mt-0.5">
                      <Sparkles className="size-3.5" />
                    </div>
                  )}

                  <div
                    className={`group relative max-w-[85%] rounded-2xl p-3 shadow-sm ${
                      isAssistant
                        ? 'border border-border/70 bg-card text-card-foreground'
                        : 'bg-[#155DFC] text-white font-medium rounded-tr-xs shadow-blue-500/20'
                    }`}
                  >
                    {renderFormattedContent(m.content)}

                    <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] opacity-60">
                      <span>{m.timestamp}</span>
                      {isAssistant && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(m.content, m.id)}
                          className="opacity-0 group-hover:opacity-100 transition hover:text-foreground"
                          title="Copy response"
                        >
                          {copiedId === m.id ? (
                            <Check className="size-3 text-emerald-500" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground border mt-0.5">
                      <User className="size-3.5" />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 animate-spin">
                  <Loader2 className="size-3.5" />
                </div>
                <span className="italic text-[11px] animate-pulse">
                  Hello Technology AI is typing...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Action Shortcuts Strip */}
          <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-4 py-1.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <a
                href={`tel:${schoolConfig.phone}`}
                className="flex items-center gap-1 hover:text-[#155DFC] transition font-medium"
              >
                <Phone className="size-3" /> {schoolConfig.phone}
              </a>
              <a
                href={schoolConfig.telegram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[#155DFC] transition font-medium"
              >
                <ExternalLink className="size-3" /> Telegram
              </a>
            </div>
            <Link
              href="/library"
              onClick={() => setIsOpen(false)}
              className="font-bold text-[#155DFC] dark:text-sky-400 hover:underline inline-flex items-center gap-1"
            >
              <GraduationCap className="size-3" /> Digital Academy
            </Link>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="border-t border-border/70 p-3 bg-card flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything in አማርኛ or English..."
              disabled={loading}
              className="h-10 flex-1 rounded-xl border border-input bg-background px-3.5 text-xs text-foreground outline-none transition focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC]/20"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || loading}
              className="size-10 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white shrink-0 shadow-md shadow-blue-500/25 disabled:opacity-40 p-0"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
