// School configuration and data
export const schoolConfig = {
  name: 'Electronics Maintenance School',
  tagline: 'Build Practical Skills. Repair with Confidence.',
  phone: '+251-XX-XXX-XXXX',
  email: 'info@emschool.edu.et',
  whatsappPhone: '251-XX-XXX-XXXX',
  address: '[School Address - Edit in settings]',
  businessHours: 'Monday - Friday: 8:00 AM - 5:00 PM',
  description:
    'A premier technical training institution in Ethiopia specializing in mobile phone repair, computer maintenance, electronics troubleshooting, and practical hands-on learning.',
  mission: 'To equip students with practical electronics repair skills and professional expertise.',
  vision:
    'To be the leading provider of technical training and digital learning resources in East Africa.',
}

export const courses = [
  {
    id: 'mobile-repair',
    title: 'Mobile Phone Repair & Maintenance',
    category: 'Mobile Repair',
    level: 'Beginner to Advanced',
    description:
      'Learn to diagnose and repair smartphones, tablets, and mobile devices. Master screen replacement, battery issues, charging problems, and software troubleshooting.',
    icon: 'Smartphone',
    skills: [
      'Screen and display repair',
      'Battery replacement and testing',
      'Charging port troubleshooting',
      'Software diagnostics',
      'Component-level repairs',
    ],
    audience: 'Students interested in mobile device repair careers',
    prerequisites: 'None',
    duration: '[Contact for details]',
    price: '[Contact for details]',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'computer-repair',
    title: 'Computer & Laptop Maintenance',
    category: 'Computer and Laptop Repair',
    level: 'Beginner to Intermediate',
    description:
      'Master computer hardware troubleshooting, repair, and upgrades. Learn diagnostics, component replacement, and system optimization.',
    icon: 'Laptop',
    skills: [
      'Hardware diagnostics',
      'Component replacement',
      'Hard drive and SSD issues',
      'RAM and memory upgrades',
      'Thermal management and cooling',
    ],
    audience: 'Tech enthusiasts and aspiring IT technicians',
    prerequisites: 'Basic computer knowledge recommended',
    duration: '[Contact for details]',
    price: '[Contact for details]',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'electronics-troubleshooting',
    title: 'Electronics Troubleshooting & Diagnostics',
    category: 'Electronics',
    level: 'Intermediate to Advanced',
    description:
      'Deep dive into circuit analysis, component testing, power supply issues, and systematic troubleshooting of consumer electronics.',
    icon: 'Zap',
    skills: [
      'Multimeter and oscilloscope usage',
      'Circuit board analysis',
      'Component identification and testing',
      'Power supply troubleshooting',
      'Signal tracing techniques',
    ],
    audience: 'Electronics enthusiasts and advanced learners',
    prerequisites: 'Basic electronics knowledge helpful',
    duration: '[Contact for details]',
    price: '[Contact for details]',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'tv-repair',
    title: 'TV & Electronic Device Repair',
    category: 'TV and Other Devices',
    level: 'Intermediate',
    description:
      'Learn to repair televisions, audio equipment, microwave ovens, and other household electronics using systematic diagnostic methods.',
    icon: 'Monitor',
    skills: [
      'Display panel diagnostics',
      'Power board troubleshooting',
      'Audio system repair',
      'Remote and sensor issues',
      'Microwave and appliance repair',
    ],
    audience: 'Technicians and electronics repair professionals',
    prerequisites: 'Basic electronics knowledge',
    duration: '[Contact for details]',
    price: '[Contact for details]',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=85',
  },
]

export const trainingHighlights = [
  {
    title: 'Practical, Hands-On Learning',
    description:
      'Work with real electronic components, circuit boards, and equipment in our fully-equipped workshops.',
    icon: 'GraduationCap',
  },
  {
    title: 'Technical Troubleshooting Skills',
    description: 'Learn systematic diagnostic methods using industry-standard tools and equipment.',
    icon: 'Wrench',
  },
  {
    title: 'Real Electronic Components',
    description:
      'Repair actual mobile phones, computers, and electronics as part of your training curriculum.',
    icon: 'Cpu',
  },
  {
    title: 'Career-Oriented Education',
    description:
      'Build skills that lead to employment opportunities in the growing electronics repair industry.',
    icon: 'Briefcase',
  },
]

export const trainingGallery = [
  {
    id: 'workshop-1',
    title: 'Soldering Station Workshop',
    description:
      'Students practice precision soldering and component-level repairs using professional-grade equipment.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'workshop-2',
    title: 'Mobile Repair Workbench',
    description:
      'Specialized workstations equipped with microscopes and precision tools for smartphone repairs.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'workshop-3',
    title: 'Electronics Laboratory',
    description: 'Equipped with oscilloscopes, multimeters, and diagnostic equipment for advanced troubleshooting.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'workshop-4',
    title: 'Laptop Repair Station',
    description:
      'Complete setup for laptop hardware diagnostics, upgrades, and component-level repairs.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'workshop-5',
    title: 'Testing & Diagnostics Area',
    description: 'Validation and testing equipment to ensure repairs meet quality standards.',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'workshop-6',
    title: 'Parts & Components Library',
    description:
      'Organized inventory of replacement parts, components, and repair supplies used in training.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85',
  },
]

export const digitalLibraryResources = [
  {
    id: 'manual-1',
    title: 'Complete Mobile Phone Repair Manual',
    category: 'Mobile Phone Repair Guides',
    description: 'Comprehensive guide covering common mobile phone issues and repair procedures.',
    format: 'PDF Guide',
    level: 'Beginner to Intermediate',
    status: 'Coming Soon',
    price: '[Contact for pricing]',
    pages: '250+',
  },
  {
    id: 'manual-2',
    title: 'Laptop Hardware Troubleshooting Guide',
    category: 'Computer and Laptop Maintenance',
    description: 'Systematic approaches to diagnosing and fixing common laptop hardware problems.',
    format: 'PDF Guide',
    level: 'Intermediate',
    status: 'Coming Soon',
    price: '[Contact for pricing]',
    pages: '180+',
  },
  {
    id: 'manual-3',
    title: 'Electronics Circuit Board Analysis',
    category: 'Electronics Troubleshooting',
    description: 'Learn to read schematics, identify components, and analyze circuit board failures.',
    format: 'PDF Guide',
    level: 'Advanced',
    status: 'Coming Soon',
    price: '[Contact for pricing]',
    pages: '320+',
  },
  {
    id: 'manual-4',
    title: 'TV & Display Repair Procedures',
    category: 'TV Repair',
    description: 'Step-by-step procedures for repairing television displays and power systems.',
    format: 'PDF Guide',
    level: 'Intermediate',
    status: 'Coming Soon',
    price: '[Contact for pricing]',
    pages: '200+',
  },
  {
    id: 'manual-5',
    title: 'Diagnostic Tools & Equipment Guide',
    category: 'Tools and Diagnostic Methods',
    description:
      'Complete reference for using multimeters, oscilloscopes, and other diagnostic equipment.',
    format: 'PDF Guide',
    level: 'Beginner to Advanced',
    status: 'Coming Soon',
    price: '[Contact for pricing]',
    pages: '150+',
  },
  {
    id: 'course-1',
    title: 'Online Mobile Repair Basics Course',
    category: 'Mobile Phone Repair Guides',
    description: 'Recorded video course introducing mobile phone repair fundamentals.',
    format: 'Video Course',
    level: 'Beginner',
    status: 'Coming Soon',
    price: '[Contact for pricing]',
    pages: '12 modules',
  },
]

export const adminMockData = {
  inquiries: [
    {
      id: 'INQ-001',
      studentName: 'Abebe Wolde',
      email: 'abebe@example.com',
      phone: '+251-91-123-4567',
      course: 'Mobile Phone Repair & Maintenance',
      preferredContact: 'Phone',
      experience: 'Beginner',
      status: 'New',
      submittedAt: '2024-01-15',
    },
    {
      id: 'INQ-002',
      studentName: 'Selamawit Tadesse',
      email: 'selamawit@example.com',
      phone: '+251-92-234-5678',
      course: 'Computer & Laptop Maintenance',
      preferredContact: 'WhatsApp',
      experience: 'Intermediate',
      status: 'Contacted',
      submittedAt: '2024-01-14',
    },
    {
      id: 'INQ-003',
      studentName: 'Yohannes Kebede',
      email: 'yohannes@example.com',
      phone: '+251-93-345-6789',
      course: 'Electronics Troubleshooting & Diagnostics',
      preferredContact: 'Email',
      experience: 'Intermediate',
      status: 'Converted',
      submittedAt: '2024-01-13',
    },
  ],
  overview: {
    totalInquiries: 47,
    newInquiries: 12,
    registeredStudents: 34,
    libraryInterest: 18,
  },
}

export const categories = [
  'Mobile Repair',
  'Computer and Laptop Repair',
  'Electronics',
  'TV and Other Devices',
]

export const libraryCategories = [
  'Mobile Phone Repair Guides',
  'Computer and Laptop Maintenance',
  'Electronics Troubleshooting',
  'TV Repair',
  'Tools and Diagnostic Methods',
]
