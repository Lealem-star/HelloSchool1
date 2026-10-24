// School configuration and static promotional data
// Note: Courses, Categories, Training Gallery, and Digital Library items are now 
// synchronized to the real database and managed dynamically via Prisma / Admin portal.

export const schoolConfig = {
  name: 'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል',
  englishName: 'Hello Technology Training Center',
  brandSubtitle: 'Hello Technology Training Center',
  tagline: 'Build Practical Skills. Repair with Confidence.',
  phone: '09 47 74 70 70',
  alternatePhone: '09 82 48 43 28',
  email: 'info@hellotechnology.edu.et',
  whatsappPhone: '251947747070',
  telegram: 'https://t.me/Hellotechn',
  telegramHandle: '@HHaileHaile',
  facebook: 'https://web.facebook.com/people/Hello-Technology-of-Institute-%E1%88%84%E1%88%8E-%E1%8B%A8%E1%88%99%E1%8B%AB-%E1%88%9B%E1%88%B0%E1%88%8D%E1%8C%A0%E1%8A%9B-%E1%89%B0%E1%89%8B%E1%88%9D/100063821901962/?locale=af_ZA',
  address: 'ባ/ዳር ፓፒረስ ሆቴል ፊት ለፊት ሲግናል ሞል ህንፃ 4ኛ ፎቅ ቢሮ ቁ.409, Bahir Dar, Ethiopia',
  englishAddress: 'Signal Mall Building, 4th Floor, Office No. 409 (In front of Papyrus Hotel), Bahir Dar, Ethiopia',
  googleMapsUrl: 'https://maps.google.com/?q=Papyrus+Hotel+Bahir+Dar+Ethiopia',
  businessHours: 'Monday – Friday: 8:30 AM – 5:30 PM | Saturday: 9:00 AM – 1:00 PM',
  specialPromotion: 'በነፃ፦ ከሁለት በላይ ት/ት ለሚመዘገብ አንድ በነፃ (Register for more than two courses, get one free!)',
  accreditation: 'ሙሉ ዕውቅና ያለው በሁሉም የትምህርት ዓይነት ደረጃ (Fully accredited for all educational levels)',
  cocCertifications: [
    'Basic Electrical Electronics Equipment Level',
    'Industrial Electrical Machines & Drives Servicing Level',
  ],
  description:
    'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል (Hello Technology Training Center) — Leading accredited technical trade and vocational training institute in Bahir Dar providing hands-on workshops in electronics, computing, electrical installations, digital media, coding, and industrial equipment maintenance.',
  mission: 'To equip Ethiopian youth and professionals with accredited, job-ready technical trade skills, practical diagnostic problem-solving abilities, and hands-on lab excellence.',
  vision: 'To be the most trusted center for accredited technical vocational education and hardware trade competence in East Africa.',
  brandColor: '#155DFC',
  brandColorName: 'Electric Royal Blue',
  theme: {
    primary: '#155DFC',
    primaryHover: '#0D4ECC',
    white: '#FFFFFF',
    themeName: 'Blue & White',
  },
}

export const trainingHighlights = [
  {
    title: 'የግል የተሟላ የላብራቶሪ ወንበር (Dedicated 1:1 Workstation)',
    description:
      'Zero station sharing. Every student is assigned their own dedicated workbench equipped with SMD hot-air rework, digital multimeter, stereo microscope, and live motherboards.',
    icon: 'Wrench',
  },
  {
    title: 'የኮምፖነንት ደረጃ እና ማይክሮ-ሶልደሪንግ (Micro-Soldering & Schematics)',
    description:
      'Master multi-layer PCB schematics, boardview signal tracing, short-circuit injection, IC chip reballing, and jumper wire micro-routing beyond basic part swaps.',
    icon: 'Cpu',
  },
  {
    title: 'መንግስታዊ እውቅና እና የCOC ብቃት (Accredited TVET & COC Exam)',
    description:
      'Fully accredited across all educational levels with intensive practical mock drills tailored to national Basic Electronics & Industrial Electrical COC exams.',
    icon: 'ShieldCheck',
  },
  {
    title: 'በእውነተኛ እቃዎች ላይ የሚደረግ ልምምድ (Real Consumer & Industrial Gear)',
    description:
      'Troubleshoot actual non-working smartphones, laptops, refrigeration cooling units, and industrial motor control panels from week one.',
    icon: 'Laptop',
  },
  {
    title: 'የዕድሜ ልክ ዲጂታል ላይብረሪ (Lifetime Schematics & Digital Studio)',
    description:
      '24/7 access to our digital learning studio featuring 4K video lessons, high-resolution motherboard schematics, boardview software, and repair manuals.',
    icon: 'BookOpen',
  },
  {
    title: 'የጥገና ሱቅ መክፈቻና የስራ ፈጠራ (Shop Launch & Sourcing Mentorship)',
    description:
      'Direct guidance on wholesale spare parts supply channels in Addis Ababa & Bahir Dar, choosing shop tooling, customer pricing, and launching a profitable repair business.',
    icon: 'Briefcase',
  },
]


export const faqs = [
  {
    q: 'Do I need previous electronics background to enroll?',
    a: 'No prior experience is necessary. Our foundation modules start with core electrical concepts, meter measurements, and workshop safety before advancing to diagnosis and soldering.',
  },
  {
    q: 'ሙሉ ዕውቅና እና የCOC ስልጠና ይሰጣል? (Are courses accredited & COC aligned?)',
    a: 'አዎ! ስልጠናዎቻችን ሙሉ ዕውቅና ያላቸው ሲሆን ለBasic Electrical Electronics እና Industrial Electrical Machines & Drives የCOC ፈተና ሙሉ ዝግጅት ይሰጣሉ። Yes, our institute is fully accredited for all educational levels and prepares students for national COC examinations.',
  },
  {
    q: 'ልዩ ቅናሽ ወይም ማበረታቻ አለ? (Is there a special promotion?)',
    a: 'አዎ! በነፃ፦ ከሁለት በላይ ትምህርት ለሚመዘገብ አንድ ተጨማሪ ስልጠና በነፃ ይሰጣል (Register for more than two courses, get one free!). እንዲሁም ለሙሉ ክፍያ 10% ቅናሽ አለ።',
  },
  {
    q: 'Are tools and practice boards provided during the workshop?',
    a: 'Yes! Every enrolled student is assigned a dedicated practical training station with professional soldering gear, diagnostic meters, microscopes, and practice motherboards.',
  },
  {
    q: 'Can this program help me start my own repair shop in Ethiopia?',
    a: 'Absolutely. Many alumni launch independent device repair shops or work as specialized hardware technicians. We include practical guidance on sourcing parts, shop tooling, and customer quotation.',
  },
  {
    q: 'How does self-paced learning work? (ትምህርቱ እንዴት ይሰጣል?)',
    a: 'All courses are 100% self-paced online education. Once enrolled, you receive 24/7 lifetime access to watch video masterclasses, study repair manuals, and complete practical lessons at your own pace anytime, anywhere.',
  },
]
