export type LessonItem = {
  id: string
  title: string
  duration: string
  videoUrl?: string
  summary: string
  keyTakeaways: string[]
  labExercise: string
  diagramUrl?: string
}

export type ManualChapter = {
  id: string
  title: string
  pageRange: string
  summary: string
  sections: {
    heading: string
    body: string
    checkpoints?: string[]
    diagnosticTable?: { fault: string; symptom: string; multimeterReading: string; fix: string }[]
  }[]
  circuitNote?: string
}

export type DigitalResourceMeta = {
  id: string
  title: string
  subtitle: string
  category: string
  format: 'Video Masterclass' | 'Technical Repair Manual' | 'Schematic & Circuit Handbook' | 'Quick Reference Guide'
  priceETB: number
  priceDisplay: string
  isFreeForTVET: boolean
  level: string
  rating: number
  reviewCount: number
  instructor: string
  instructorRole: string
  language: string
  badgeText?: string
  description: string
  prerequisites: string[]
  skillsLearned: string[]
  lessons?: LessonItem[]
  chapters?: ManualChapter[]
}

export const DIGITAL_CATALOG: Record<string, DigitalResourceMeta> = {
  'course-1': {
    id: 'course-1',
    title: 'Recorded Mobile Micro-Soldering Fundamentals',
    subtitle: '18 Step-by-Step Practical HD Video Lessons with Bench Demonstrations',
    category: 'Smartphone Hardware',
    format: 'Video Masterclass',
    priceETB: 850,
    priceDisplay: '850 ETB',
    isFreeForTVET: true,
    level: 'Intermediate to Advanced',
    rating: 4.9,
    reviewCount: 312,
    instructor: 'Master Tech Haile',
    instructorRole: 'Lead Hardware Diagnostic Instructor',
    language: 'Amharic with English Technical Terminology',
    badgeText: 'Bestseller Video Masterclass',
    description:
      'A comprehensive recorded self-learning course filmed in Hello Technology workshop laboratories in Bahir Dar. Covers stereo microscope inspection, hot air SMD reflow, jumper wire bridging for torn motherboard traces, and 0.01mm micro-soldering under 40x magnification.',
    prerequisites: ['Basic Multimeter Handling', 'Fundamental Electronics Components'],
    skillsLearned: [
      'Hot air nozzle calibration and thermal profile management',
      'BGA IC removal, cleaning, and stencil reballing',
      'Micro-jumper wiring across broken circuit traces (0.02mm enameled copper)',
      'Under-fill and black epoxy resin clearing without pad tearing',
      'Short-killer and DC power supply current draw analysis',
    ],
    lessons: [
      {
        id: 'l1',
        title: 'Lesson 1: Stereo Microscope Alignment & Soldering Tip Profiling',
        duration: '14:35',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        summary:
          'Learn how to properly set interpupillary distance, optical focal length, and ring light temperature to prevent eye strain during 4-hour micro-soldering sessions. Proper tinning and chemical conditioning of C210 / C245 cartridge tips.',
        keyTakeaways: [
          'Set optical zoom to 0.7x for board inspection; switch to 3.5x - 4.5x for micro-soldering.',
          'Never use abrasive sandpaper on nano soldering tips; use copper brass wool with tip activator paste.',
          'Always clamp the board in a heavy-duty PCB holder to absorb mechanical hand vibration.',
        ],
        labExercise:
          'Set up your workbench PCB clamp. Practice holding tweezers with a relaxed three-finger grip under 20x magnification for 10 minutes without hand tremor.',
      },
      {
        id: 'l2',
        title: 'Lesson 2: Multimeter Diode Mode: Voltage Drop Tracing on Power Rails',
        duration: '19:40',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        summary:
          'Master diode mode voltage drop diagnostics. Connect the RED probe to GND and use the BLACK probe to probe component lines. Understand why normal silicon junction drops range from 0.250V to 0.650V and how to isolate 0.000V dead shorts.',
        keyTakeaways: [
          'Red probe to Ground (Reverse bias injection). Black probe to test point.',
          'Normal battery rail (VBAT/VDD_MAIN): 0.380V - 0.480V.',
          'OL (Open Loop) = broken line or missing series component.',
          '0.000V = dead short to GND (usually a ceramic filtering capacitor).',
        ],
        labExercise:
          'Select 8 bypass capacitors on a donor board. Record the diode mode drop for each. Locate the battery connector positive pin and verify the ground junction reading.',
      },
      {
        id: 'l3',
        title: 'Lesson 3: Thermal Camera & Rosin Flux Smoke Method for Short Localization',
        duration: '22:15',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        summary:
          'When a motherboard has a dead short on VDD_MAIN, powering it with 3.8V causes high amperage draw. In this video, we demonstrate thermal imaging versus the economical rosin flux vapor method to pinpoint the exact overheating capacitor within 3 seconds.',
        keyTakeaways: [
          'Limit your DC bench power supply to 3.7V and 2.0A maximum before injection.',
          'Coat the suspect board area with an atomized rosin smoke layer.',
          'The defective capacitor melts first because heat concentrates at the breakdown dielectric point.',
        ],
        labExercise:
          'Apply rosin smoke to a practice board. Inject low voltage (1.5V) into a simulated short and observe how the vapor turns transparent over the faulty node.',
      },
      {
        id: 'l4',
        title: 'Lesson 4: Micro-Jumper Bridging Under 40x Magnification',
        duration: '26:50',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        summary:
          'How to rescue torn motherboard solder pads. Routing 0.02mm insulated copper wire, making circular anchor coils, curing with UV green mask solder resist, and testing electrical continuity before IC replacement.',
        keyTakeaways: [
          'Scrape the underlying copper via gently with an X-Acto #11 blade until shiny copper is exposed.',
          'Tin the exposed copper dot with 138°C low-melt bismuth solder paste.',
          'Wind a micro-loop to simulate a new BGA pad and cure under 365nm UV LED for 60 seconds.',
        ],
        labExercise:
          'Simulate a torn display connector pad on a scrap board. Successfully anchor a jumper wire from the trace via to the connector pin and verify 0.1 ohm continuity.',
      },
      {
        id: 'l5',
        title: 'Lesson 5: BGA Chip Desoldering & Stencil Reballing Masterclass',
        duration: '31:10',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        summary:
          'Step-by-step removal of Audio Codec and Power Management ICs (PMIC). Safe temperature ranges: 340°C - 360°C at 50% airflow. High-temp magnetic stencil alignment and solder sphere formation using 183°C Sn63/Pb37 solder paste.',
        keyTakeaways: [
          'Warm the surrounding board for 30 seconds before focusing directly on the chip body.',
          'Slightly nudge the chip with tweezers; if it bounces smoothly, surface tension is liquid and you can lift.',
          'Spread reballing paste evenly across the stencil with a razor spatula; wipe clean with lint-free cloth before heating.',
        ],
        labExercise:
          'Desolder an Audio Codec IC, clean the motherboard pads with wick and flux, reball the chip on a magnetic stencil, and inspect solder sphere uniformity under the microscope.',
      },
    ],
  },

  'manual-1': {
    id: 'manual-1',
    title: 'Complete Mobile Phone Hardware Diagnostic Manual',
    subtitle: '142 Pages of Circuit Flowcharts, Voltage Test Points & Fault Matrices',
    category: 'Smartphone Hardware',
    format: 'Technical Repair Manual',
    priceETB: 450,
    priceDisplay: '450 ETB',
    isFreeForTVET: true,
    level: 'All Skill Levels',
    rating: 4.95,
    reviewCount: 489,
    instructor: 'Hello Technology Engineering Team',
    instructorRole: 'Technical Faculty Authors',
    language: 'English & Amharic Diagnostic Flowcharts',
    badgeText: 'Official Training Textbook',
    description:
      'The definitive handbook compiled by Hello Technology instructors. Contains detailed step-by-step diagnostic workflows for no-power, no-charge, fake-charge, touch failure, display backlight failure, audio codec failure, and baseband/no-service issues across Android and iPhone boards.',
    prerequisites: ['Basic understanding of voltage, current, and resistance'],
    skillsLearned: [
      'Reading schematic diagrams and boardview layouts with speed',
      'Systematic fault elimination in no-power states (PMIC, CPU, Clock, Reset)',
      'Charging circuit troubleshooting (VBUS 5V, OVP MOSFET, CC Handshake, Battery thermistor)',
      'Backlight boost circuits (Anode line, Diode, Inductor, Feedback Cathode)',
      'Network RF receiver and transmitter troubleshooting',
    ],
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: Systematic Power-On Sequence & No-Power Fault Tree',
        pageRange: 'Pages 5 - 34',
        summary:
          'Every modern smartphone requires a sequential handshake between the Battery, Primary Buck Converters, Power Management Unit (PMU), 32.768 kHz Sleep Clock, 24MHz System Crystal, and Application Processor.',
        sections: [
          {
            heading: '1.1 The Primary Power Rail Architecture',
            body:
              'When battery voltage (VBAT = 3.7V - 4.2V) enters the board, it passes through the Battery Protection Circuit (Fuel Gauge IC) and feeds the main switching regulator (often named VDD_MAIN or VPH_PWR). Without a stable VDD_MAIN, no secondary buck converters can switch on.',
            checkpoints: [
              'Check VBAT connector pins for physical corrosion or pin spread.',
              'Measure VDD_MAIN at the main inductor: must equal battery voltage ±0.05V.',
              'Check Diode Mode on VDD_MAIN: minimum 0.350V with red probe to GND.',
            ],
            diagnosticTable: [
              {
                fault: 'Dead Board, 0.00mA on DC Supply when pressing Power Button',
                symptom: 'No response, screen remains black, zero current draw',
                multimeterReading: 'Power Button test point has 0.0V instead of 1.8V pull-up',
                fix: 'Trace 1.8V_ALWAYS rail from PMIC; check power switch flex cable and pull-up resistor.',
              },
              {
                fault: 'Instant High Current Draw (1.5A - 2.5A) upon plugging DC cable',
                symptom: 'Power supply voltage sags, board gets warm immediately',
                multimeterReading: 'VDD_MAIN diode mode is 0.002V (Hard Short)',
                fix: 'Apply rosin smoke or freeze spray. Find cracked ceramic bypass capacitor on VDD_MAIN rail.',
              },
              {
                fault: 'Board draws 80mA - 120mA and hangs permanently (Boot-Loop / Stuck)',
                symptom: 'Does not advance to boot animation, stays at low current',
                multimeterReading: 'CPU core voltage present, but 24MHz crystal clock shows no sine wave',
                fix: 'Replace 24MHz crystal resonator or check I2C communication pull-up resistors.',
              },
            ],
          },
          {
            heading: '1.2 Secondary Regulators: LDOs vs. BUCK Inductors',
            body:
              'The PMIC steps down VDD_MAIN into low-voltage rails for the processor: VDD_CPU (0.8V), VDD_GPU (0.85V), VDD_RAM (1.1V), and I/O rails (1.8V). High-current rails use heavy ferrite-core BUCK inductors. Low-noise analog circuits (cameras, sensors) use Low-Dropout (LDO) linear regulators.',
            checkpoints: [
              'Buck inductor resistance to ground is naturally low (10Ω - 80Ω) due to CPU core impedance. Do not confuse low resistance with a short circuit!',
              'Always use Diode Mode with 4-wire milliohm setting when testing processor rails.',
            ],
          },
        ],
        circuitNote: 'Reference Diagram: PMIC-PM8953 Multi-Rail Architecture (Schematic Plate 04).',
      },
      {
        id: 'c2',
        title: 'Chapter 2: USB Charging & Fast Charging Handshake Protocols',
        pageRange: 'Pages 35 - 68',
        summary:
          'Modern smartphones use USB Type-C CC (Configuration Channel) lines for orientation and power negotiation. Understanding OVP (Over-Voltage Protection) chips, Charging ICs, and Battery NTC thermistor temperature sensing.',
        sections: [
          {
            heading: '2.1 The VBUS 5.0V Ingestion Path',
            body:
              'USB 5V enters via pin A4/B4 and passes through an Over-Voltage Protection (OVP) MOSFET. If input exceeds 5.8V, the OVP instantly cuts conduction to protect the charger IC. In 70% of "dead charging" cases, the OVP MOSFET is open or its Gate charge pump capacitor has failed.',
            checkpoints: [
              'Measure 5.0V at test point VBUS_IN (before OVP).',
              'Measure 5.0V at test point VBUS_OUT (after OVP). If missing, bridge source to drain for emergency testing.',
            ],
            diagnosticTable: [
              {
                fault: 'Fake Charging (Shows lightning bolt, but battery percentage drops)',
                symptom: 'Screen displays charging icon, but DC meter shows 0.04A draw',
                multimeterReading: 'Battery sense resistor shows no differential voltage drop',
                fix: 'Inspect current sense resistor (10mΩ) and replace Charging PMIC (SMB1351 / BQ25890).',
              },
              {
                fault: '"Charging paused: Battery temperature too high/low"',
                symptom: 'Warning dialog pops up, yellow triangle icon',
                multimeterReading: 'NTC pin voltage is 0.0V or 1.8V (Normal is 0.8V at 25°C room temp)',
                fix: 'Replace 10kΩ NTC thermistor on battery flex or sub-board charging circuit.',
              },
            ],
          },
        ],
      },
      {
        id: 'c3',
        title: 'Chapter 3: Display & LED Backlight Boost Circuitry',
        pageRange: 'Pages 69 - 104',
        summary:
          'LCD panels require a boost regulator converting 3.7V battery voltage into 20V - 35V DC to illuminate series LED strips. OLED displays require dual ±4.6V and 7.6V analog rails.',
        sections: [
          {
            heading: '3.1 The Backlight Boost Loop (Inductor, Diode, Driver IC)',
            body:
              'The boost circuit consists of three critical components: (1) 4.7µH or 10µH Power Inductor, (2) High-speed Schottky Rectifier Diode, and (3) Backlight Driver IC with internal switching FET. If the diode shorts, the inductor burns out; if the backlight line shorts to ground, the series fuse blows instantly.',
            checkpoints: [
              'Measure Anode (LED+) line diode mode: minimum 0.550V.',
              'When screen is ON, LED+ must rise from 3.8V to 18V - 28V.',
              'Always inspect the backlight fuse near the FPC display connector.',
            ],
          },
        ],
      },
    ],
  },

  'manual-2': {
    id: 'manual-2',
    title: 'Laptop Motherboard Power Sequencing & Schematics',
    subtitle: '88 Pages of Standby Rails, EC Handshake, and Power Rail Schematics',
    category: 'Computer Maintenance',
    format: 'Technical Repair Manual',
    priceETB: 550,
    priceDisplay: '550 ETB',
    isFreeForTVET: true,
    level: 'Advanced',
    rating: 4.92,
    reviewCount: 228,
    instructor: 'Eng. Dawit & Hello Technology Lab Faculty',
    instructorRole: 'Motherboard Architecture Specialist',
    language: 'English & Amharic Technical Notes',
    badgeText: 'Motherboard Diagnostic Master Guide',
    description:
      'Step-by-step schematics and power rails for modern Intel & AMD laptop motherboards. Covers 19V VIN distribution, 3.3V/5V Always Standby buck converters, Embedded Controller (EC/Super I/O) handshake, BIOS chip SPI protocol, and CPU VCORE phase regulation.',
    prerequisites: ['Laptop disassembly skills', 'Multimeter voltage & resistance testing'],
    skillsLearned: [
      'Tracing 19V DC-IN through dual N-channel input MOSFETs and Current Sense Resistor',
      'Diagnosing 3.3V/5V Standby PWM controller failure (TPS51125 / RT8205)',
      'EC / KBC chip power sequencing (VCC, WRST#, ACIN, LID_SW#, EC_ON, RSMRST#)',
      'BIOS EEPROM SPI bus waveform analysis with oscilloscope',
      'VCORE multiphase PWM regulator diagnostics',
    ],
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: The 19V VIN Distribution & Input Protection MOSFETs',
        pageRange: 'Pages 4 - 28',
        summary:
          'When 19V adapter is plugged in, it does not immediately enter the motherboard. It must pass through the First Protection MOSFET, Second Protection MOSFET, and Current Sense Resistor (R010 / 10mΩ).',
        sections: [
          {
            heading: '1.1 Gate Voltage Generation by Charging IC (BQ24725 / BQ24780)',
            body:
              'For N-channel MOSFETs to conduct 19V from Drain to Source, their Gate must receive approximately 24V - 25V (19V + 6V overdrive). This 25V is generated by the charge-pump pin (ACDRV) of the charging IC. If the charging IC detects a short downstream or missing ACOK signal, ACDRV remains at 0V and the laptop stays completely dead.',
            checkpoints: [
              'Measure 19V at Drain of PQ1 (First MOSFET).',
              'Measure 25V at Gate of PQ1 & PQ2 (ACDRV pin).',
              'Measure 19V at Current Sense Resistor (CLPR / B+).',
            ],
            diagnosticTable: [
              {
                fault: '19V present at DC jack, but 0V after first MOSFET',
                symptom: 'Laptop completely dead, no charging light',
                multimeterReading: 'Gate voltage is 0.0V instead of 25.0V',
                fix: 'Check VCC (19V) on BQ charging IC, check ACDET voltage divider (must be 2.6V), and check REGN 6V LDO.',
              },
            ],
          },
        ],
      },
      {
        id: 'c2',
        title: 'Chapter 2: Always-On 3.3V and 5.0V Standby Regulators',
        pageRange: 'Pages 29 - 56',
        summary:
          'Before the laptop power button is pressed, the motherboard must produce continuous 3.3V_ALW (to power the EC and BIOS) and 5V_ALW (for USB and auxiliary standby).',
        sections: [
          {
            heading: '2.1 PWM Switching vs. LDO Outputs',
            body:
              'The dual buck controller (e.g. TPS51225) generates: (1) VREG3 (3.3V LDO for EC standby), (2) VREG5 (5.0V LDO for gate drivers), and (3) High-power 3.3V/5.0V main rails through dual inductors.',
            checkpoints: [
              'If 3.3V LDO is missing, check if the EC chip (ITE / ENE) is hot to touch.',
              'Short on 3.3V LDO almost always means a blown EC chip or burned PCH bridge.',
            ],
          },
        ],
      },
    ],
  },

  'manual-3': {
    id: 'manual-3',
    title: 'SMD Component Identification & Marking Code Handbook',
    subtitle: '98 Pages of SMD Codes, Transistor Packages & SOT/QFN Pinouts',
    category: 'Electronics Components',
    format: 'Quick Reference Guide',
    priceETB: 350,
    priceDisplay: '350 ETB',
    isFreeForTVET: true,
    level: 'All Technicians',
    rating: 4.88,
    reviewCount: 195,
    instructor: 'Hello Technology Lab Mentors',
    instructorRole: 'Component Engineering Specialists',
    language: 'English & Amharic Technical Notes',
    badgeText: 'Essential Bench Reference',
    description:
      'Quickly decode cryptic SMD 2-character and 3-character top markings on microscopic diodes, transistors, MOSFETs, and voltage regulators. Look up package dimensions (SOT-23, SOT-89, SOD-123, QFN-16) and direct modern cross-references available in Ethiopian electronics markets.',
    prerequisites: ['Basic soldering and component recognition'],
    skillsLearned: [
      'Decoding SMD codes to full JEDEC part numbers',
      'Distinguishing NPN from PNP and N-channel from P-channel MOSFETs with a multimeter',
      'Finding equivalent substitute components from donor scrap boards',
    ],
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: SOT-23 Transistors & Dual Diodes Decoding Directory',
        pageRange: 'Pages 1 - 42',
        summary:
          'Alphabetical lookups for SMD top codes (e.g., "1A" = BC846A NPN, "2A" = BC849A NPN, "702" = 2N7002 N-Channel MOSFET, "A7" = BAV99 Dual Diode).',
        sections: [
          {
            heading: '1.1 Decoding Principles & Orientation Notches',
            body:
              'SMD markings often use 2 or 3 letters/numbers, plus a laser dot indicating pin 1 or manufacturing lot. This directory lists the most common SMD codes found in consumer electronics, mobile phones, and TV power supplies.',
          },
        ],
      },
    ],
  },

  'manual-4': {
    id: 'manual-4',
    title: 'Digital Multimeter & Oscilloscope Diagnostic Cheat Sheet',
    subtitle: '48 Pages of Voltage Drop Benchmarks, Waveform Signatures & Rules',
    category: 'Diagnostic Tools',
    format: 'Quick Reference Guide',
    priceETB: 0,
    priceDisplay: 'Free for All Students',
    isFreeForTVET: true,
    level: 'Beginner to Intermediate',
    rating: 5.0,
    reviewCount: 640,
    instructor: 'Hello Technology Bench Instructors',
    instructorRole: 'Instrumentation Engineers',
    language: 'Bilingual English & Amharic',
    badgeText: 'Complimentary Student Gift',
    description:
      'The essential laminated workbench cheat sheet. Multimeter diode mode values for common smartphone power rails, oscilloscope timebase/voltage scale presets for I2C, SPI, and Clock waveforms, and safety guidelines for mains TV power supplies.',
    prerequisites: ['None'],
    skillsLearned: [
      'Proper probe handling and lead resistance calibration',
      'Reading PWM duty cycles and ripple voltage on filter capacitors',
      'Oscilloscope trigger setup for capturing single-shot power-on resets',
    ],
    chapters: [
      {
        id: 'c1',
        title: 'Workbench Cheat Sheet & Multimeter Quick Reference',
        pageRange: 'Pages 1 - 48',
        summary:
          'Universal reference tables for voltage drops, color codes, probe techniques, and oscilloscope setup configurations.',
        sections: [
          {
            heading: '1.1 Standard Silicon Diode Mode Benchmark Table',
            body:
              'Measurements taken with Fluke 15B+ / Sunshine DT-17N in Diode Mode at 24°C room temperature with Red Probe on Ground:',
            diagnosticTable: [
              {
                fault: 'VBAT / VDD_MAIN Power Rail',
                symptom: 'Primary supply from battery or charger',
                multimeterReading: '0.380V - 0.480V',
                fix: 'Below 0.200V indicates leaky component. 0.000V indicates dead short.',
              },
              {
                fault: '1.8V Always-On Standby Rail',
                symptom: 'Powers sensor hub and power button pullup',
                multimeterReading: '0.450V - 0.550V',
                fix: 'If 0.0V, power button cannot trigger PMIC turn-on.',
              },
              {
                fault: 'CPU Core Power Rail (VDD_CPU)',
                symptom: 'High-current core processor line',
                multimeterReading: '0.012V - 0.055V (Very low resistance is normal!)',
                fix: 'Do not replace CPU unless reading is absolute 0.0000V.',
              },
              {
                fault: 'USB D+ / D- Data Lines',
                symptom: 'High-speed differential USB handshake',
                multimeterReading: '0.580V - 0.680V (Must match within ±0.015V of each other)',
                fix: 'If one line is OL, USB communication/charging will fail.',
              },
            ],
          },
        ],
      },
    ],
  },
}

export function formatResourceToMeta(res: any): DigitalResourceMeta {
  const fallback = DIGITAL_CATALOG[res.id] || ({} as Partial<DigitalResourceMeta>)

  let lessons: LessonItem[] = []
  if (res.lessons) {
    try {
      lessons = typeof res.lessons === 'string' ? JSON.parse(res.lessons) : res.lessons
    } catch {
      lessons = fallback.lessons || []
    }
  } else if (fallback.lessons) {
    lessons = fallback.lessons
  } else if (res.format && res.format.toLowerCase().includes('video')) {
    lessons = [
      {
        id: `${res.id}-les-1`,
        title: `Introduction & Bench Setup for ${res.title}`,
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'Comprehensive overview of practical methodologies, bench safety protocols, and essential tools.',
        keyTakeaways: ['ESD protection standard', 'Multimeter calibration', 'Inspection protocols'],
        labExercise: 'Set up your diagnostic workstation and verify grounding.',
      },
    ]
  }

  let chapters: ManualChapter[] = []
  if (res.chapters) {
    try {
      chapters = typeof res.chapters === 'string' ? JSON.parse(res.chapters) : res.chapters
    } catch {
      chapters = fallback.chapters || []
    }
  } else if (fallback.chapters) {
    chapters = fallback.chapters
  } else if (!res.format || !res.format.toLowerCase().includes('video')) {
    chapters = [
      {
        id: `${res.id}-ch-1`,
        title: `Fundamental Architecture & Troubleshooting Protocol`,
        pageRange: 'pp. 1-28',
        summary: `Detailed schematic breakdown, multimeter test points, and component diagnostic procedures.`,
        sections: [
          {
            heading: 'Power Rail Sequencing and Voltages',
            body: `Before replacing any IC, verify that primary input rails meet tolerance specification. Probe test points with an oscilloscope or high-accuracy multimeter.`,
            checkpoints: [
              'Check VPH_PWR rail (3.7V - 4.2V)',
              'Inspect buck converter inductors for micro-cracks',
              'Verify crystal oscillator clock frequency (38.4 MHz)',
            ],
            diagnosticTable: [
              {
                fault: 'Dead Board / No Current Draw',
                symptom: 'Amperage meter shows 0.000A at 4.2V',
                multimeterReading: 'OL on battery VBUS test pin',
                fix: 'Replace input protection fuse / OVP MOSFET',
              },
              {
                fault: 'Short to Ground',
                symptom: 'DC power supply trips to 0V at 2A max',
                multimeterReading: '0.01 ohms in diode mode on main rail',
                fix: 'Thermal camera localization and remove shorted filter capacitor',
              },
            ],
          },
        ],
        circuitNote: 'Always discharge filter capacitors before measuring resistance to ground.',
      },
    ]
  }

  // Normalize lessons to guarantee keyTakeaways is always an array
  lessons = (Array.isArray(lessons) ? lessons : []).map((l: any, lIdx: number) => ({
    ...l,
    id: l.id || `${res.id}-les-${lIdx + 1}`,
    title: l.title || `Lesson ${lIdx + 1}`,
    duration: l.duration || '20 min',
    videoUrl: l.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: l.summary || l.description || 'Hands-on practical training tutorial.',
    keyTakeaways: Array.isArray(l.keyTakeaways) ? l.keyTakeaways : ['ESD protection standard', 'Multimeter calibration', 'Inspection protocols'],
    labExercise: l.labExercise || 'Follow the diagnostic procedures step by step.',
  }))

  // Normalize chapters to guarantee sections is always an array
  chapters = (Array.isArray(chapters) ? chapters : []).map((c: any, cIdx: number) => ({
    ...c,
    id: c.id || `${res.id}-ch-${cIdx + 1}`,
    title: c.title || `Chapter ${cIdx + 1}`,
    pageRange: c.pageRange || `pp. ${(cIdx * 15) + 1}-${(cIdx + 1) * 15}`,
    summary: c.summary || c.description || 'Technical diagnostic chapter and workbench schematics.',
    sections: Array.isArray(c.sections) && c.sections.length > 0
      ? c.sections
      : [
          {
            heading: c.title || 'Diagnostic Inspection & Schematic Breakdown',
            body: c.summary || c.description || 'Comprehensive step-by-step diagnostic workflows, test points, and verification procedures.',
            checkpoints: Array.isArray(c.checkpoints) ? c.checkpoints : ['Inspect input voltage rails', 'Verify ground continuity', 'Check IC pin soldering'],
          },
        ],
  }))

  const priceETB =
    typeof res.priceETB === 'number'
      ? res.priceETB
      : parseInt(String(res.price || '').replace(/[^0-9]/g, ''), 10) || (fallback.priceETB ?? 0)

  const priceDisplay = res.price
    ? res.price
    : priceETB === 0
    ? 'Free'
    : `${priceETB} ETB`

  return {
    id: res.id,
    title: res.title,
    subtitle: res.subtitle || fallback.subtitle || 'Official Hello Technology Workshop Curriculum & Diagnostic Guide',
    category: res.category || fallback.category || 'Technical Hardware',
    format: (res.format || fallback.format || 'Technical Repair Manual') as any,
    priceETB,
    priceDisplay,
    isFreeForTVET: priceETB === 0,
    level: res.level || fallback.level || 'All Skill Levels',
    rating: typeof res.rating === 'number' ? res.rating : fallback.rating || 4.9,
    reviewCount: typeof res.reviewCount === 'number' ? res.reviewCount : fallback.reviewCount || 100,
    instructor: res.instructor || fallback.instructor || 'Hello Technology Faculty',
    instructorRole: res.instructorRole || fallback.instructorRole || 'Technical Instructor',
    language: fallback.language || 'English & Amharic Bilingual (በአማርኛና በእንግሊዝኛ)',
    badgeText: res.badgeText || (priceETB === 0 ? 'Free Gift' : fallback.badgeText || 'Popular'),
    description: res.description || fallback.description || '',
    prerequisites: fallback.prerequisites || ['Basic multimeter operation', 'Bench safety awareness'],
    skillsLearned: res.skillsLearned
      ? (typeof res.skillsLearned === 'string'
          ? res.skillsLearned.split(',').map((s: string) => s.trim())
          : res.skillsLearned)
      : (fallback.skillsLearned || ['Schematic tracing', 'Component level repair', 'Board diagnosis']),
    lessons,
    chapters,
  }
}

