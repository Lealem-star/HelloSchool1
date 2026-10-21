'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Zap,
  Sparkles,
  BookOpen,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'

type Question = {
  id: number
  category: { en: string; am: string }
  question: { en: string; am: string }
  options: {
    text: { en: string; am: string }
    isCorrect: boolean
  }[]
  explanation: { en: string; am: string }
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: { en: 'Diode Mode & Short Isolation', am: 'ዳዮድ ሞድ እና የሾርት መለያ' },
    question: {
      en: 'When testing a main power rail (VCC_MAIN / BATT_VCC) in multimeter Diode Mode, a reading of 0.002V (continuous beep) indicates:',
      am: 'በመልቲሜትር ዲዮድ ሞድ (Diode Mode) የVCC_MAIN ወይም የባትሪ መስመርን ስንለካ 0.002V (ወይም የማያቋርጥ ቢፕ ድምፅ) ቢያሳይ ምን ያመለክታል?',
    },
    options: [
      {
        text: {
          en: 'The rail is operating at optimal normal resistance',
          am: 'መስመሩ በጥሩ እና ጤነኛ የመቋቋም አቅም ላይ ነው',
        },
        isCorrect: false,
      },
      {
        text: {
          en: 'A direct low-impedance short circuit to ground on the rail',
          am: 'በመስመሩ ላይ ቀጥታ ወደ ግራውንድ አጭር ሰርኪዩት (Short Circuit to Ground) አለ',
        },
        isCorrect: true,
      },
      {
        text: {
          en: 'The multimeter test probes need calibration',
          am: 'የመልቲሜትሩ መመርመሪያ ገመዶች መስተካከል አለባቸው',
        },
        isCorrect: false,
      },
      {
        text: {
          en: 'The circuit is in high-resistance standby state',
          am: 'ሰርኪዩቱ በከፍተኛ የመቋቋም ስታንድባይ ሁኔታ ላይ ነው',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'A reading of 0.000V–0.003V in diode mode reveals zero forward voltage drop to ground, confirming a shorted capacitor, filter diode, or punctured IC on that power rail.',
      am: 'በዳዮድ ሞድ ከ 0.000V–0.003V መካከል ማንበብ ወደ ግራውንድ ቀጥተኛ ግንኙነት (Short) መኖሩን ያረጋግጣል። ይህም የተበላሸ ካፓሲተር፣ ዳዮድ ወይም አይሲ መኖሩን ያሳያል።',
    },
  },
  {
    id: 2,
    category: { en: 'Workshop Safety & SMPS', am: 'የወርክሾፕ ደህንነት እና SMPS' },
    question: {
      en: 'Before troubleshooting any Switched-Mode Power Supply (SMPS) or inverter board, what is the mandatory first safety step?',
      am: 'የSMPS ፓወር ሰፕላይ ወይም የኢንቨርተር ቦርድ ከመመርመርዎ በፊት የመጀመሪያው ወሳኝ የደህንነት እርምጃ ምንድን ነው?',
    },
    options: [
      {
        text: {
          en: 'Safely discharge the primary high-voltage electrolytic filter capacitor',
          am: 'ዋናውን ከፍተኛ ቮልቴጅ ፊልተር ካፓሲተር በደህንነት ማፍሰስ (Safely Discharge ማድረግ)',
        },
        isCorrect: true,
      },
      {
        text: {
          en: 'Increase the soldering station temperature to 480°C',
          am: 'የካውያውን ሙቀት ወደ 480°C ማሳደግ',
        },
        isCorrect: false,
      },
      {
        text: {
          en: 'Submerge the circuit board in tap water to clean flux',
          am: 'ቦርዱን በቧንቧ ውሃ ውስጥ ማጠብ',
        },
        isCorrect: false,
      },
      {
        text: {
          en: 'Connect the oscilloscope ground directly to AC live wire',
          am: 'የኦስሎስኮፕ ግራውንድን በቀጥታ ከ220V AC ገመድ ጋር ማገናኘት',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Primary filter capacitors retain hazardous DC potentials (300V–400V DC) long after power is disconnected. Discharging safely prevents severe shock and equipment damage.',
      am: 'ዋናው ፊልተር ካፓሲተር መብራት ከተቋረጠ በኋላም እስከ 300V-400V DC ድረስ የሚደርስ ገዳይ ቮልቴጅ ይይዛል። በደህንነት ማፍሰስ ከኤሌክትሪክ አደጋ ይጠብቃል።',
    },
  },
  {
    id: 3,
    category: { en: 'Micro-soldering & BGA Repair', am: 'ማይክሮ-ሶልደሪንግ እና BGA ቺፕ ጥገና' },
    question: {
      en: 'When removing a delicate BGA chip from a multi-layer motherboard, what technique prevents board blister and torn solder pads?',
      am: 'የስልክ ወይም የላፕቶፕ ማዘርቦርድ ላይ BGA ቺፕ በሚነሳበት ጊዜ ቦርዱ እንዳይጎዳ እና ፓዶች እንዳይቀደዱ የሚረዳው ዘዴ የትኛው ነው?',
    },
    options: [
      {
        text: {
          en: 'Uniform underside board preheating combined with quality tacky flux',
          am: 'የቦርዱን የታችኛውን ክፍል አስቀድሞ በፕሪሂተር ማሞቅ እና ጥራት ያለው ፍላክስ መጠቀም',
        },
        isCorrect: true,
      },
      {
        text: {
          en: 'Prying the chip with high force while solder is still solid',
          am: 'ሊዱ ሳይቀልጥ ቺፑን በሃይል ጎትቶ ማንሳት',
        },
        isCorrect: false,
      },
      {
        text: {
          en: 'Applying maximum concentrated hot air with zero flux',
          am: 'ያለ ፍላክስ ከፍተኛ ንፋስ በአንድ ነጥብ ላይ ብቻ ማሳረፍ',
        },
        isCorrect: false,
      },
      {
        text: {
          en: 'Scraping the surrounding traces with a metal knife',
          am: 'በዙሪያው ያሉትን መስመሮች በስለት መጫር',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Underside preheating expands multi-layer copper planes evenly, preventing localized thermal shock and allowing BGA solder spheres to liquefy simultaneously at lower top temperatures.',
      am: 'የታችኛው ፕሪሂተር ቦርዱ እኩል እንዲሞቅ በማድረግ የሙቀት መዛባትን ይከላከላል፤ እንዲሁም የBGA ኳሶች ያለ ጫና በአንድ ጊዜ እንዲቀልጡ ይረዳል።',
    },
  },
  {
    id: 4,
    category: { en: "Fundamental Ohm's Law", am: 'መሰረታዊ የኦም ሕግ' },
    question: {
      en: "According to Ohm’s Law (I = V ÷ R), if a circuit is powered by a 12V DC rail and has a load resistance of 4 Ohms, what is the current?",
      am: 'በኦም ሕግ (I = V ÷ R) መሠረት፣ በ12V DC ሰርኪዩት ውስጥ ያለው ሎድ 4 Ohms መቋቋም (Resistance) ቢኖረው፣ የሚፈሰው የኤሌክትሪክ ፍሰት (Current) ስንት ነው?',
    },
    options: [
      {
        text: { en: '48 Amperes', am: '48 አምፔር' },
        isCorrect: false,
      },
      {
        text: { en: '3 Amperes (12V ÷ 4Ω = 3A)', am: '3 አምፔር (12V ÷ 4Ω = 3A)' },
        isCorrect: true,
      },
      {
        text: { en: '0.33 Amperes', am: '0.33 አምፔር' },
        isCorrect: false,
      },
      {
        text: { en: '8 Amperes', am: '8 አምፔር' },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Using I = V / R: 12 Volts divided by 4 Ohms produces exactly 3 Amperes of current.',
      am: 'I = V ÷ R ቀመርን በመጠቀም፡ 12 ቮልት ለ 4 ኦህም ሲካፈል ውጤቱ 3 አምፔር ይሆናል።',
    },
  },
  {
    id: 5,
    category: { en: 'National TVET COC Standard', am: 'የብሄራዊ ቴክኒክና ሙያ የCOC መስፈርት' },
    question: {
      en: 'What is the primary factor evaluated during an Ethiopian TVET Occupational Competence (COC) practical exam?',
      am: 'በኢትዮጵያ የቴክኒክና ሙያ ብቃት ምዘና (COC Assessment) የተግባር ፈተና ላይ በዋናነት ምን ይለካል?',
    },
    options: [
      {
        text: {
          en: 'Memorization of textbook paragraph definitions',
          am: 'የመጽሐፍ ንድፈ-ሀሳቦችን እና ትርጓሜዎችን በቃል መሸምደድ',
        },
        isCorrect: false,
      },
      {
        text: {
          en: 'Demonstrated hands-on diagnostic competence, safety adherence, and repair precision',
          am: 'የተግባር የብልሽት መለያ ብቃት፣ የላብራቶሪ ደህንነት ጥንቃቄ እና ትክክለኛ የጥገና አሰራር',
        },
        isCorrect: true,
      },
      {
        text: {
          en: 'Speed of typing on a computer keyboard',
          am: 'የኮምፒውተር የፅሁፍ ፍጥነት',
        },
        isCorrect: false,
      },
      {
        text: {
          en: 'Freehand sketching without measuring tools',
          am: 'ያለ መለኪያ መሳሪያ በእጅ ንድፍ መሳል',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'National occupational standards verify real bench performance: fault diagnosis, schematic reading, measurement accuracy, tool mastery, and workplace safety compliance.',
      am: 'የብሄራዊ ብቃት ምዘናው በተግባር የሚታይን የስራ ብቃት፣ የመለኪያ መሳሪያዎች አጠቃቀም፣ የሰርኪዩት ንባብ እና የደህንነት ደንቦች ተገዢነትን ያረጋግጣል።',
    },
  },
]

export function CocReadinessQuiz() {
  const { language } = useLanguage()
  const isAm = language === 'am'

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)

  const currentQ = QUESTIONS[currentStep]
  const isSelected = selectedAnswers[currentQ.id] !== undefined
  const selectedIndex = selectedAnswers[currentQ.id]

  // Calculate score
  const totalScore = Object.entries(selectedAnswers).reduce((acc, [qId, optIdx]) => {
    const q = QUESTIONS.find((item) => item.id === Number(qId))
    if (q && q.options[optIdx]?.isCorrect) {
      return acc + 1
    }
    return acc
  }, 0)

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: idx }))
    setShowExplanation(true)
  }

  const handleNext = () => {
    setShowExplanation(false)
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setQuizFinished(true)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setSelectedAnswers({})
    setShowExplanation(false)
    setQuizFinished(false)
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-500/25 bg-gradient-to-br from-card via-card to-blue-500/5 p-6 md:p-10 shadow-lg">
      <div className="absolute -right-24 -top-24 size-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 text-white px-3 py-1 text-xs font-bold tracking-wide shadow-sm">
              <Zap className="size-3.5 fill-current" />
              {isAm ? 'የCOC ብቃት ፈተና ዝግጅት' : 'COC Diagnostic Readiness Test'}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {isAm ? '5 ተግባራዊ ጥያቄዎች' : '5 Practical Bench Questions'}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            {isAm
              ? 'ተግባራዊ የኤሌክትሮኒክስና የጥገና ዝግጁነትዎን ይፈትሹ'
              : 'Assess Your Technical & Hardware Diagnostics Readiness'}
          </h2>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground max-w-2xl">
            {isAm
              ? 'በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል የላብራቶሪ መመዘኛ እና የብሄራዊ የCOC ደረጃዎች መሰረት የተዘጋጀ አጭር የሙከራ ፈተና።'
              : 'Test your grasp of multimeter diode diagnostics, power supplies, component isolation, and Ethiopian TVET COC benchmarks.'}
          </p>
        </div>

        {!quizFinished && (
          <div className="flex items-center gap-3 self-start md:self-auto bg-muted/40 p-3 rounded-2xl border">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {isAm ? 'ሂደት' : 'Progress'}
              </p>
              <p className="text-sm font-extrabold text-foreground">
                {currentStep + 1} / {QUESTIONS.length}
              </p>
            </div>
            <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {!quizFinished ? (
        <div className="space-y-6">
          {/* Question Card */}
          <div className="rounded-2xl border bg-muted/20 p-5 md:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-2">
              <BookOpen className="size-3.5" />
              <span>{isAm ? currentQ.category.am : currentQ.category.en}</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground leading-snug">
              {isAm ? currentQ.question.am : currentQ.question.en}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid gap-3">
            {currentQ.options.map((opt, idx) => {
              const isPicked = selectedIndex === idx
              const showResult = showExplanation
              let buttonStyle = 'border-border bg-card hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-blue-950/20'

              if (showResult) {
                if (opt.isCorrect) {
                  buttonStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                } else if (isPicked && !opt.isCorrect) {
                  buttonStyle = 'border-rose-500 bg-rose-500/10 text-rose-950 dark:text-rose-200 ring-2 ring-rose-500/30'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 text-sm ${buttonStyle} disabled:cursor-default`}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold mt-0.5 ${
                      showResult && opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : showResult && isPicked && !opt.isCorrect
                        ? 'border-rose-500 bg-rose-500 text-white'
                        : isPicked
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-muted-foreground/30 bg-muted/50 text-foreground'
                    }`}
                  >
                    {showResult && opt.isCorrect ? (
                      <Check className="size-3.5" />
                    ) : showResult && isPicked && !opt.isCorrect ? (
                      <XCircle className="size-3.5" />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </span>
                  <div className="flex-1 font-medium leading-relaxed">
                    {isAm ? opt.text.am : opt.text.en}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 text-xs md:text-sm animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-sky-300 mb-1">
                <Sparkles className="size-4" />
                <span>{isAm ? 'የሙያ ማብራሪያ (Technical Insight)' : 'Technical Insight & Practical Rule:'}</span>
              </div>
              <p className="leading-relaxed text-foreground/90">
                {isAm ? currentQ.explanation.am : currentQ.explanation.en}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="rounded-xl gap-1.5 text-xs text-muted-foreground"
            >
              <RotateCcw className="size-3.5" />
              {isAm ? 'እንደገና ጀምር' : 'Restart Quiz'}
            </Button>

            {showExplanation && (
              <Button
                onClick={handleNext}
                className="rounded-xl gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                <span>
                  {currentStep < QUESTIONS.length - 1
                    ? isAm
                      ? 'ቀጣይ ጥያቄ'
                      : 'Next Question'
                    : isAm
                    ? 'ውጤቱን እይ'
                    : 'View Final Score'}
                </span>
                <ArrowRight className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="text-center py-6 animate-scale-in">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-blue-600/10 text-blue-600 dark:text-sky-400 mb-4 border border-blue-600/20 shadow-inner">
            <Award className="size-8" />
          </div>

          <h3 className="text-2xl font-black text-foreground">
            {isAm ? 'የፈተና ውጤትዎ' : 'Your Diagnostic Assessment Score'}
          </h3>
          <p className="mt-2 text-4xl font-extrabold text-blue-600 dark:text-sky-400">
            {totalScore} / {QUESTIONS.length}
          </p>

          <div className="mx-auto mt-4 max-w-xl rounded-2xl border bg-muted/30 p-5 text-sm">
            {totalScore >= 4 ? (
              <div className="space-y-1">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  🌟 {isAm ? 'የላቀ ደረጃ · ለከፍተኛ ስልጠና ዝግጁ' : 'Advanced Readiness · High Aptitude'}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {isAm
                    ? 'የኤሌክትሮኒክስ መሰረታዊ መርሆዎችን ጠንቅቀው ተረድተዋል። በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል የላፕቶፕ እና ስማርትፎን ማይክሮ-ሶልደሪንግ እንዲሁም የCOC Level 3/4 ስልጠናን በቀላሉ ለመጨረስ ዝግጁ ነዎት።'
                    : 'You have a solid foundation in electronics principles. You are ready to accelerate into component-level micro-soldering, laptop schematic diagnostics, and TVET COC Level 3/4 alignment.'}
                </p>
              </div>
            ) : totalScore >= 2 ? (
              <div className="space-y-1">
                <p className="font-bold text-blue-600 dark:text-sky-400">
                  ⚡ {isAm ? 'ጥሩ ዝንባሌ · የተግባር ስልጠና ያስፈልግዎታል' : 'Intermediate Aptitude · Practical Hands-on Recommended'}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {isAm
                    ? 'አስተሳሰብዎ ለጥገና ሙያ እጅግ አመቺ ነው። የእኛ የባህር ዳር ተግባራዊ ላብራቶሪ በመልቲሜትር፣ በስኬማቲክስ ንባብ እና በካውያ ስራ ሙሉ በሙሉ ብቁ ያደርግዎታል።'
                    : 'You grasp core concepts well. Joining our hands-on cohort in Bahir Dar will bridge theory to confident bench diagnosis, schematic reading, and live customer repairs.'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-bold text-amber-600 dark:text-amber-400">
                  🌱 {isAm ? 'ጀማሪ · ከመሰረቱ ለመማር ምርጥ ጊዜ' : 'Foundational Explorer · Perfect Timing to Start'}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {isAm
                    ? 'ተስፋ አይቁረጡ! በሄሎ ቴክኖሎጂ ስልጠና ከዜሮ ጀምሮ በደረጃ በደረጃ ተግባራዊ ልምምድ፣ የደህንነት ደንብ እና የሙያ ብቃት እናስተምርዎታለን።'
                    : 'Do not worry! Our foundation courses start from the ground up: measuring safe voltages, using tools correctly, and building systematic diagnostic habits.'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-xl gap-2 font-semibold text-xs"
            >
              <RotateCcw className="size-3.5" />
              {isAm ? 'ፈተናውን በድጋሚ ይውሰዱ' : 'Retake Diagnostic Test'}
            </Button>

            <Link href="/register">
              <Button className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 px-6">
                <span>{isAm ? 'አሁኑኑ ለስልጠና ይመዝገቡ' : 'Enroll in Next Practical Cohort'}</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
