import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { schoolConfig } from '@/lib/data'
import { getPublishedCourses } from '@/lib/content'

export const dynamic = 'force-dynamic'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Active Gemini model candidates in priority order
const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.7-flash',
  'gemini-3.1-flash-lite',
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages }: { messages: ChatMessage[] } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const latestUserMessage = messages[messages.length - 1].content

    // 1. Fetch live system context from database
    const [courses, openBatches] = await Promise.all([
      getPublishedCourses().catch(() => []),
      ((prisma as any).batch
        ? (prisma as any).batch.findMany({
            where: { status: { in: ['Open', 'Active', 'Upcoming'] } },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            take: 3,
          })
        : prisma.$queryRaw<any[]>`
            SELECT * FROM Batch WHERE status IN ('Open', 'Active', 'Upcoming') ORDER BY sortOrder ASC, createdAt DESC LIMIT 3
          `.catch(() => [])
      ).catch(() => []),
    ])

    // Format course knowledge
    const coursesSummary = courses
      .map(
        (c) =>
          `• ${c.title} (Slug: ${c.slug}, Category: ${c.category}, Duration: ${c.duration || 'Flexible'}, Price: ${c.price || 'Contact for fee'} ETB). Description: ${c.description}. Prerequisites: ${c.prerequisites || 'None'}. Shift options: Morning, Afternoon, Evening, Weekend.`
      )
      .join('\n')

    // Format active batches
    const batchesSummary = (openBatches || [])
      .map(
        (b: any) =>
          `• ${b.batchNumber}: ${b.title} (Status: ${b.status}, Start Date: ${b.startDate || 'Announced soon'}, Registration Deadline: ${b.registrationDeadline || 'Ongoing'}, Capacity: ${b.capacity} seats, Campus: ${b.campus || 'Main Campus'}).`
      )
      .join('\n')

    // 2. Lead auto-capture: check if user provided a phone number and name in conversation
    try {
      const phoneMatch = latestUserMessage.match(/(?:09|\+2519|2519|07|\+2517|2517)\d{8}/)
      if (phoneMatch) {
        const detectedPhone = phoneMatch[0]
        const nameMatch = latestUserMessage.match(/(?:my name is|ስሜ|name:?)\s+([A-Za-z\u1200-\u137F\s]{2,30})/i)
        const leadName = nameMatch ? nameMatch[1].trim() : 'Chatbot Visitor'

        await (prisma as any).inquiry.create({
          data: {
            studentName: leadName,
            phone: detectedPhone,
            course: 'Chatbot Inquiry',
            message: `Lead captured via AI Chatbot: "${latestUserMessage.slice(0, 300)}"`,
            status: 'New',
            consent: true,
          },
        })
      }
    } catch (e) {
      // Ignore background lead capture errors
    }

    // 3. Build comprehensive bilingual System Prompt
    const systemPrompt = `You are "Hello Technology Assistant" (የሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል ብልህ ረዳት), an enthusiastic, knowledgeable, and helpful official AI educational advisor for Hello Technology Training Center (ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል) in Bahir Dar, Ethiopia.

ABOUT THE CENTER:
- Institution Name: ${schoolConfig.name} (${schoolConfig.englishName} - ${schoolConfig.brandSubtitle})
- Motto / Tagline: ${schoolConfig.tagline} ("Build Practical Skills. Repair with Confidence.")
- Mission & Goal: To empower youth, students, and technicians with high-demand practical vocational skills (90%+ hands-on practical lab training) so they can become confident technicians, secure good employment, or start their own successful businesses in electronics and tech.
- City & Address: ${schoolConfig.address} (በተለይ: ባሕር ዳር፣ ፓፒረስ ሆቴል ፊት ለፊት፣ ሲግናል ሞል ህንፃ 4ኛ ፎቅ ቢሮ ቁ.409)
- Phone Numbers: ${schoolConfig.phone} or ${schoolConfig.alternatePhone}
- Official Email: ${schoolConfig.email}
- Telegram Channel: ${schoolConfig.telegram} (Handle: ${schoolConfig.telegramHandle})
- WhatsApp: +${schoolConfig.whatsappPhone}
- Shifts Available: Morning (8:30 AM - 12:30 PM), Afternoon (2:00 PM - 5:30 PM), Evening (6:00 PM - 8:30 PM), Weekend (Saturday & Sunday Full Day)

ACTIVE INTAKE BATCHES (የቅርብ ጊዜ ዙሮች):
${batchesSummary || '• Current intake is actively open for new applicants. Next batch orientation starting soon.'}

OFFICIAL ACCREDITED COURSES:
${coursesSummary}

REGISTRATION INSTRUCTIONS:
- Online Registration: Students can register 24/7 on the website at /register.
- Registration creates an official student portal account (@hellotechnology.edu.et) with login password (default: Hello@2026).
- In-person Registration: Visit our office at Signal Mall 4th Floor, Office 409, Bahir Dar.
- Required documents: Copy of Kebele ID / Passport, 2 passport size photos, and minimum 10th grade completion (or equivalent practical interest).

BEHAVIOR & GUIDELINES:
1. Always respond in the language the user speaks: if they write in Amharic (አማርኛ), respond fluently in polite, natural Amharic. If they write in English, respond in professional English.
2. Be warm, encouraging, respectful, and concise. Format responses with neat bullet points, bold highlights, and readable structure.
3. If asked "Who is Hello Technology Training Center?" or "What is the goal of Hello Technology?", give an inspiring, comprehensive overview of our institution, our practical hands-on mission, and the key fields we train in.
4. If recommending courses, mention relevant shift options, hands-on lab equipment, and invite them to register at the link: /register.
5. If asked about prices or discounts, provide the figures from the catalog and note that payment plans (half / full) and cash or telebirr payments are supported.
6. If user asks for direct contact or calls, provide: ${schoolConfig.phone} and Telegram: ${schoolConfig.telegram}.`

    // 4. Check for LLM API keys: Gemini first, then OpenAI
    const geminiKey = process.env.GEMINI_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    // ── CASE A: GOOGLE GEMINI API ──
    if (geminiKey) {
      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      for (const model of GEMINI_MODELS) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 8000)

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents,
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 1000,
                },
              }),
            }
          )

          clearTimeout(timeoutId)

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json()
            const replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
            if (replyText) {
              return NextResponse.json({
                role: 'assistant',
                content: replyText,
                provider: `gemini (${model})`,
              })
            }
          }
        } catch (geminiErr) {
          console.warn(`Gemini model ${model} attempt failed:`, geminiErr)
        }
      }
    }

    // ── CASE B: OPENAI API ──
    if (openaiKey) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        })

        if (openaiRes.ok) {
          const openaiData = await openaiRes.json()
          const replyText = openaiData?.choices?.[0]?.message?.content
          if (replyText) {
            return NextResponse.json({
              role: 'assistant',
              content: replyText,
              provider: 'openai',
            })
          }
        }
      } catch (openaiErr) {
        console.warn('OpenAI API call failed, falling back:', openaiErr)
      }
    }

    // ── CASE C: ADVANCED LOCAL KNOWLEDGE ENGINE FALLBACK ──
    const fallbackReply = generateFallbackResponse(latestUserMessage, courses, openBatches)

    return NextResponse.json({
      role: 'assistant',
      content: fallbackReply,
      provider: 'knowledge-engine',
    })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        details: error?.message,
      },
      { status: 500 }
    )
  }
}

// Deep, comprehensive rule-based knowledge engine
function generateFallbackResponse(query: string, courses: any[], batches: any[]): string {
  const q = query.toLowerCase()
  const isAmharic = /[\u1200-\u137F]/.test(query)

  // 1. Who is Hello Technology / What is the goal / What does Hello Technology do?
  if (
    q.includes('who is') ||
    q.includes('what is the goal') ||
    q.includes('goal of hello') ||
    q.includes('what does hello') ||
    q.includes('totally what') ||
    q.includes('about hello') ||
    q.includes('ማን ነው') ||
    q.includes('ዓላማ') ||
    q.includes('ምን ይሰራል') ||
    q.includes('ስለ ሄሎ') ||
    q.includes('ስለ ተቋሙ')
  ) {
    return isAmharic
      ? `🏛️ **ስለ ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል (Hello Technology Training Center):**\n\n**ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል** በባሕር ዳር ከተማ የሚገኝ፣ ወጣቶችና ሰልጣኞች በገበያው ውስጥ ተፈላጊ በሆኑ የቴክኖሎጂና ጥገና ሙያዎች ላይ የላቀ ተግባራዊ ክህሎት እንዲጨብጡ የተቋቋመ ግንባር ቀደም የስልጠና ማዕከል ነው።\n\n🎯 **የተቋማችን ዋና ዓላማ:**\nመሪ ቃላችን **"ተግባራዊ ክህሎት ይገንቡ፤ በእርግጠኝነት ይጠግኑ!" (Build Practical Skills. Repair with Confidence.)** እንደሚለው፤ ዋና ግባችን ሰልጣኞችን በ 90%+ ተግባራዊ የላቦራቶሪ ስልጠና አብቅተን በራሳቸው ስራ ፈጣሪ ወይም በተለያዩ ድርጅቶች ውስጥ ተወዳዳሪ ባለሙያ ማድረግ ነው።\n\n🛠️ **ተቋሙ በዋናነት ምን ይሰራል?**\n1. **የሞባይል ስልክ ጥገና ስልጠና** (Hardware, Software, Micro-soldering)\n2. **የኮምፒውተርና ላፕቶፕ ጥገና** (Motherboard, OS, Hardware troubleshooting)\n3. **የኤሌክትሮኒክስና ቴሌቪዥን ጥገና** (Smart TV, LED/LCD, Refrigeration)\n4. **የሶፍትዌር ኮዲንግና ፕሮግራሚንግ**\n5. **የቪዲዮ ኤዲቲንግና ግራፊክስ ዲዛይን**\n\n📍 **አድራሻ:** ባሕር ዳር፣ ፓፒረስ ሆቴል ፊት ለፊት፣ ሲግናል ሞል 4ኛ ፎቅ ቢሮ ቁ.409\n📞 **ስልክ:** ${schoolConfig.phone} | 💬 **ቴሌግራም:** [${schoolConfig.telegramHandle}](${schoolConfig.telegram})\n\n👉 [ስልጠና ለመጀመር አሁኑኑ ይመዝገቡ](/register)!`
      : `🏛️ **About Hello Technology Training Center & Our Mission:**\n\n**Hello Technology Training Center** is a premier accredited practical skills institute located in **Bahir Dar, Ethiopia**.\n\n🎯 **Our Goal & Mission:**\nOur motto is **"Build Practical Skills. Repair with Confidence."** Our core goal is to empower youth and professionals with hands-on, market-ready technical skills (90%+ practical workshop training) so they can start their own profitable repair businesses or secure high-paying technical jobs.\n\n🛠️ **What Does Hello Technology Training Center Do?**\nWe specialize in intensive, practical vocational training across two major branches:\n1. **Hardware & Electronics Repair:**\n   • Smartphone Repair (Hardware, Software, Micro-soldering)\n   • Computer & Laptop Maintenance\n   • Television & Electronics Diagnostics\n   • Refrigerator & Cooling System Repair\n2. **Digital Technologies:**\n   • Coding & Software Programming\n   • Video Editing & Digital Content Production\n\n📍 **Campus Location:** Signal Mall 4th Floor (In front of Papyrus Hotel), Bahir Dar\n📞 **Phone:** ${schoolConfig.phone} | 💬 **Telegram:** [${schoolConfig.telegramHandle}](${schoolConfig.telegram})\n\n👉 [Click here to enroll online today](/register)!`
  }

  // 2. Batch / Intake Questions
  if (
    q.includes('batch') ||
    q.includes('intake') ||
    q.includes('ዙር') ||
    q.includes('ቀጣይ') ||
    q.includes('መቼ') ||
    q.includes('start') ||
    q.includes('deadline')
  ) {
    const b = batches[0]
    return isAmharic
      ? `📅 **የቀጣይ ዙር (Batch) ምዝገባ መረጃ:**\n\nበአሁኑ ወቅት **${b ? `${b.batchNumber} (${b.title})` : 'አዲስ ዙር'}** ምዝገባ በይፋ ክፍት ነው!\n\n• **የምዝገባ ሁኔታ:** ${b?.status || 'ክፍት ነው'}\n• **የመመዝገቢያ ማብቂያ:** ${b?.registrationDeadline || 'ይህ ሳምንት'}\n• **የስልጠና ፈረቃዎች:**\n  - ጠዋት (2:30 - 6:30)\n  - ከሰዓት (8:00 - 11:30)\n  - ማታ (12:00 - 2:30)\n  - ቅዳሜና እሁድ (ሙሉ ቀን)\n\n👉 [በኦንላይን ለመመዝገብ እዚህ ይጫኑ](/register) ወይም በ **${schoolConfig.phone}** ይደውሉልን!`
      : `📅 **Upcoming Intake Batch Information:**\n\nAdmissions for **${b ? `${b.batchNumber} (${b.title})` : 'the next batch intake'}** are officially active and welcoming applicants!\n\n• **Status:** ${b?.status || 'Open'}\n• **Deadline:** ${b?.registrationDeadline || 'Ongoing this week'}\n• **Class Shifts Available:**\n  - Morning (8:30 AM - 12:30 PM)\n  - Afternoon (2:00 PM - 5:30 PM)\n  - Evening (6:00 PM - 8:30 PM)\n  - Weekend (Saturday & Sunday Full Day)\n\n👉 [Enroll online here](/register) or call us at **${schoolConfig.phone}**!`
  }

  // 3. Mobile Repair Course
  if (q.includes('mobile') || q.includes('phone') || q.includes('ሞባይል') || q.includes('ስልክ')) {
    const mobileCourse = courses.find((c) => c.slug.includes('mobile') || c.title.includes('ሞባይል'))
    return isAmharic
      ? `📱 **የሞባይል ስልክ ጥገና ስልጠና (Smartphone Repair Training):**\n\nይህ ስልጠና ከጀማሪ እስከ ከፍተኛ ደረጃ የሃርድዌርና የሶፍትዌር ጥገናን፣ ማይክሮ-ሶልደሪንግን (Micro-soldering) እና የስክሪን ቅየራን በተሟላ ተግባራዊ ላብ ያካትታል።\n\n• **የሚሸፈኑ ርዕሶች:** የቦርድ ዲያግኖስቲክስ፣ አይሲ (IC) ማንሳትና መትከል፣ ፍላሽ ማድረግ፣ ኔትወርክና ባትሪ ጥገና\n• **ቆይታ:** ${mobileCourse?.duration || '2 - 3 ወራት'}\n• **ፈረቃዎች:** ጠዋት፣ ከሰዓት፣ ማታ እና ቅዳሜ/እሁድ\n• **ክፍያ:** ${mobileCourse?.price || 'ተመጣጣኝ (በግማሽ ከፍለው መጀመር ይችላሉ)'} ETB\n\n👉 [ስልጠናውን ለመጀመር አሁን ይመዝገቡ](/register)!`
      : `📱 **Mobile Phone Repair Training Track:**\n\nComprehensive practical training covering hardware diagnostics, software troubleshooting, micro-soldering, and screen replacement in our dedicated hardware lab.\n\n• **Topics:** Board-level troubleshooting, IC rework, flashing, unlocking, power circuits\n• **Duration:** ${mobileCourse?.duration || '2 - 3 Months'}\n• **Shifts:** Morning, Afternoon, Evening, Weekend\n• **Tuition:** ${mobileCourse?.price || 'Affordable with installment plans'} ETB\n\n👉 [Register online now](/register)!`
  }

  // 4. Computer / Laptop Course
  if (q.includes('computer') || q.includes('laptop') || q.includes('ኮምፒውተር') || q.includes('ላፕቶፕ')) {
    const pcCourse = courses.find((c) => c.slug.includes('computer') || c.title.includes('ኮምፒውተር'))
    return isAmharic
      ? `💻 **የኮምፒውተርና ላፕቶፕ ጥገና ስልጠና:**\n\nስለ ዴስክቶፕና ላፕቶፕ ኮምፒውተሮች ሃርድዌርና ሶፍትዌር ጥገና፣ ዊንዶውስ መጫን፣ የማዘርቦርድ ጥገናና የኔትወርክ መስመር ዝርጋታ በጥልቀት የሚያስተምር ተግባራዊ ስልጠና ነው።\n\n• **ቆይታ:** ${pcCourse?.duration || '2 ወራት'}\n• **ፈረቃዎች:** ጠዋት፣ ከሰዓት፣ ማታ፣ የሳምንት መጨረሻ\n\n👉 [ለመመዝገብ እዚህ ይጫኑ](/register)!`
      : `💻 **Computer & Laptop Maintenance Training Track:**\n\nFull hands-on training covering PC & laptop hardware repair, motherboard diagnostics, operating system installation, virus removal, and network cable configuration.\n\n• **Duration:** ${pcCourse?.duration || '2 Months'}\n• **Shifts:** Morning, Afternoon, Evening, Weekend\n\n👉 [Click here to enroll](/register)!`
  }

  // 5. Location / Address / Directions
  if (
    q.includes('where') ||
    q.includes('location') ||
    q.includes('address') ||
    q.includes('አድራሻ') ||
    q.includes('ቦታ') ||
    q.includes('የት')
  ) {
    return isAmharic
      ? `📍 **የሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል አድራሻ:**\n\nባሕር ዳር ከተማ፣ **ፓፒረስ ሆቴል ፊት ለፊት**፣ **ሲግናል ሞል ህንፃ 4ኛ ፎቅ** ቢሮ ቁጥር **409**።\n\n📞 **ስልክ ቁጥሮች:**\n• ${schoolConfig.phone}\n• ${schoolConfig.alternatePhone}\n\n💬 **ቴሌግራም:** [${schoolConfig.telegramHandle}](${schoolConfig.telegram})\n\nየቢሮ የስራ ሰዓት፡ ከሰኞ እስከ ቅዳሜ ከ 2:30 እስከ 12:00። በደስታ እንቀበልዎታለን!`
      : `📍 **Hello Technology Training Center Campus Location & Contact:**\n\nBahir Dar city, **opposite Papyrus Hotel**, **Signal Mall 4th Floor**, Office **#409**.\n\n📞 **Phone:**\n• ${schoolConfig.phone}\n• ${schoolConfig.alternatePhone}\n\n💬 **Telegram:** [${schoolConfig.telegramHandle}](${schoolConfig.telegram})\n\nOffice Hours: Monday - Saturday, 8:30 AM - 6:00 PM. You are warmly welcome to visit us!`
  }

  // 6. Registration & Requirements
  if (
    q.includes('register') ||
    q.includes('enroll') ||
    q.includes('sign up') ||
    q.includes('how can i register') ||
    q.includes('how to register') ||
    q.includes('ምዝገባ') ||
    q.includes('መመዝገብ') ||
    q.includes('መስፈርት')
  ) {
    return isAmharic
      ? `📝 **እንዴት መመዝገብ ይቻላል? (How to Register):**\n\n1. **በድረ-ገፃችን (Online 24/7):** በ [የምዝገባ ገጽ](/register) ላይ በመግባት ስምዎንና ስልክዎን ሞልተው በ 2 ደቂቃ ውስጥ ይመዝገቡ። ወዲያውኑ የተማሪ ፖርታል አካውንት ይፈጠርልዎታል።\n2. **በአካል (In-Person):** ባሕር ዳር ፓፒረስ ሆቴል ፊት ለፊት ሲግናል ሞል 4ኛ ፎቅ ቢሮ ቁ.409 በመምጣት።\n\n📋 **አስፈላጊ መስፈርቶች:**\n• የቀበሌ መታወቂያ / ፓስፖርት ኮፒ\n• 2 ጉርድ ፎቶግራፍ\n• ለመማርና ተግባራዊ ክህሎት ለመቅሰም ፍላጎት\n\n👉 [አሁኑኑ በኦንላይን ለመመዝገብ እዚህ ይጫኑ](/register)!`
      : `📝 **How to Register for Courses:**\n\n1. **Online (24/7):** Visit our [Online Registration Portal](/register) to secure your seat. An official student portal account is generated immediately!\n2. **In Person:** Visit our admissions office at Signal Mall 4th Floor, Office 409, Bahir Dar.\n\n📋 **Requirements:**\n• Kebele ID / Passport copy\n• 2 Passport photos\n• Passion to build practical technical skills\n\n👉 [Click here to register online](/register)!`
  }

  // 7. General Course Catalog Question
  if (q.includes('course') || q.includes('ስልጠና') || q.includes('ትምህርት') || q.includes('ምን ምን')) {
    const list = courses.map((c) => `• **${c.title}** (${c.duration || '2-3 ወራት'})`).join('\n')
    return isAmharic
      ? `📚 **በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል የሚሰጡ ዋና ዋና የስልጠና ዘርፎች:**\n\n${list || '• የሞባይል ስልክ ጥገና\n• የኮምፒውተርና ላፕቶፕ ጥገና\n• የቴሌቪዥንና ኤሌክትሮኒክስ ጥገና\n• የኮዲንግና ሶፍትዌር ፕሮግራሚንግ\n• የቪዲዮ ኤዲቲንግ'}\n\nስለ የትኛው ስልጠና በዝርዝር ማወቅ ይፈልጋሉ?`
      : `📚 **Official Courses Offered at Hello Technology Training Center:**\n\n${list || '• Smartphone Repair & Maintenance\n• Computer & Laptop Maintenance\n• Television & Electronics Diagnostics\n• Coding & Software Programming\n• Video Editing'}\n\nWhich course would you like to learn more about?`
  }

  // 8. Default fallback
  return isAmharic
    ? `ሰላም! እንኳን ወደ **ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል** (Hello Technology Training Center) በደህና መጡ! 👋\n\nእኔ የእርስዎ ብልህ የትምህርት ረዳት ነኝ። የሚከተሉትን ጥያቄዎች በደስታ እመልስልዎታለሁ፡\n\n• 📱 **ስለ ስልጠና ዓይነቶችና ክፍያ** (የሞባይል ጥገና፣ ኮምፒውተር፣ ኤሌክትሮኒክስ፣ ኮዲንግ...)\n• 📅 **የቀጣይ ዙር (Batch) መጀመሪያ ቀናት**\n• ⏰ **የስልጠና ፈረቃዎች** (ጠዋት፣ ከሰዓት፣ ማታ፣ ቅዳሜና እሁድ)\n• 📍 **አድራሻና ስልክ**\n\nስለምን ማወቅ ይፈልጋሉ? ከታች መጻፍ ይችላሉ፣ ወይም በቀጥታ በ **${schoolConfig.phone}** ይደውሉልን!`
    : `Hello and welcome to **Hello Technology Training Center**! 👋\n\nI am your virtual educational advisor. I can help you with:\n\n• 📱 **Courses & Tuition Fees** (Mobile Repair, Computer Maintenance, Electronics, Coding, Video Editing...)\n• 📅 **Upcoming Batch Intakes & Start Dates**\n• ⏰ **Class Shifts** (Morning, Afternoon, Evening, Weekend)\n• 📍 **Campus Location & Directions**\n• 📝 **Admissions & Online Registration**\n\nHow can I help you today? You can type your question below or call us at **${schoolConfig.phone}**!`
}
