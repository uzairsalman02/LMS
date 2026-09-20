import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding TopicLearnContent with Easy Explanations and Graphical Diagrams...");

  // 1. Topic 1.1: Software Engineering Basics & Types
  await prisma.topicLearnContent.upsert({
    where: { topicId: "top-11-01-01" },
    update: {
      definitionEnglish:
        "Software Engineering is the systematic, disciplined, and quantifiable approach to the development, operation, and maintenance of software. It applies engineering principles to produce reliable, efficient, and cost-effective software that satisfies user specifications.",
      definitionUrdu:
        "سافٹ ویئر انجینئرنگ (Software Engineering) سافٹ ویئر کی تیاری، دیکھ بھال اور تجزیے کے لیے ایک باقاعدہ، سائنسی اور انجینئرنگ اصولوں پر مبنی طریقہ کار ہے۔ اس کا بنیادی مقصد ایسے معیاری اور قابلِ اعتماد سافٹ ویئر تیار کرنا ہے جو صارفین کی تمام ضروریات کو پورا کریں۔",
      rubricKeywords: [
        "Systematic Approach",
        "Cost-Effective",
        "System Software vs Application Software",
        "Maintenance",
        "PCTB Punjab Board Focus",
      ],
      easyExplanationEnglish:
        "In simple words: Programming is just typing code, but Software Engineering is the complete science of planning, designing, testing, and maintaining software so it never crashes when thousands of students, banks, or hospitals rely on it daily.",
      easyExplanationUrdu:
        "سادہ الفاظ میں: پروگرامنگ صرف کوڈ لکھنا ہے، جبکہ سافٹ ویئر انجینئرنگ اس بات کی باقاعدہ منصوبہ بندی، ڈیزائن اور ٹیسٹنگ ہے کہ سافٹ ویئر برسوں تک بغیر کسی خرابی کے چلے اور ہزاروں صارفین کے بیک وقت استعمال پر بھی کریش نہ ہو۔",
      realWorldEnglish:
        "Think of writing a small hobby script like building a basic mud hut in your backyard—anyone can do it with a shovel. But Software Engineering is like constructing a 50-story commercial skyscraper: you need soil testing (feasibility), detailed blueprints (architecture), building codes (quality standards), and continuous elevator maintenance.",
      realWorldUrdu:
        "روزمرہ کی مثال: ایک عام چھوٹا پروگرام بنانا ایسا ہے جیسے مٹی کا کچا کمرہ بنانا۔ لیکن سافٹ ویئر انجینئرنگ 50 منزلہ شاندار پلازہ تعمیر کرنے کے مترادف ہے، جس کے لیے مٹی کے ٹیسٹ، باقاعدہ نقشہ (بلیو پرنٹ)، مضبوط بنیادیں، اور مسلسل دیکھ بھال کی ضرورت ہوتی ہے۔",
      realWorldDiagramTitle: "Skyscraper Construction vs. Professional Software Engineering",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Engineering rigor ensures structural integrity and zero crashes",
        steps: [
          { stage: "1. Soil Test & Blueprints", analogy: "Feasibility & Requirements (SRS)", icon: "fa-compass-drafting", tag: "Planning" },
          { stage: "2. Steel Foundation", analogy: "System Architecture & Database", icon: "fa-layer-group", tag: "Structure" },
          { stage: "3. Construction Work", analogy: "Modular Code Implementation", icon: "fa-code", tag: "Building" },
          { stage: "4. Safety Inspection", analogy: "QA Testing & Bug Verification", icon: "fa-shield-halved", tag: "Testing" },
          { stage: "5. Ongoing Maintenance", analogy: "System Updates & Patches", icon: "fa-wrench", tag: "Support" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "Computer Software Classification & Architecture",
      diagramCaption:
        "Software is broadly divided into System Software (Operating Systems, Device Drivers, Utility Programs) which directly manages hardware, and Application Software (Word Processors, Spreadsheets, Custom ERPs) designed for end-user tasks.",
      hasInteractive: false,
      examQuestion:
        "Differentiate between System Software and Application Software. Give two practical examples of each category. (5 Marks) — BISE Lahore Annual Examination",
      boardReference: "BISE Lahore / Gujranwala Board (5 Marks Long Question)",
      markingScheme: [
        { criteria: "Clear formal definition of System Software", marks: 1 },
        { criteria: "Clear formal definition of Application Software", marks: 1 },
        { criteria: "Key technical differences (Hardware interaction, user focus, necessity)", marks: 2 },
        { criteria: "Two valid real-world examples for each category", marks: 1 },
      ],
      solutionGuidance:
        "To score full 5/5 marks in Punjab Board papers:\n1. Draw a neat comparative table with columns: Feature | System Software | Application Software.\n2. Compare them on 4 key axes: Purpose, Hardware Dependency, Execution Mode, and User Interaction.\n3. Mention examples: System Software (Windows 11, Linux kernel, Printer Driver), Application Software (MS Word, Adobe Photoshop, InPage Urdu).",
    },
    create: {
      id: "tlc-11-01-01",
      topicId: "top-11-01-01",
      definitionEnglish:
        "Software Engineering is the systematic, disciplined, and quantifiable approach to the development, operation, and maintenance of software. It applies engineering principles to produce reliable, efficient, and cost-effective software that satisfies user specifications.",
      definitionUrdu:
        "سافٹ ویئر انجینئرنگ (Software Engineering) سافٹ ویئر کی تیاری، دیکھ بھال اور تجزیے کے لیے ایک باقاعدہ، سائنسی اور انجینئرنگ اصولوں پر مبنی طریقہ کار ہے۔ اس کا بنیادی مقصد ایسے معیاری اور قابلِ اعتماد سافٹ ویئر تیار کرنا ہے جو صارفین کی تمام ضروریات کو پورا کریں۔",
      rubricKeywords: [
        "Systematic Approach",
        "Cost-Effective",
        "System Software vs Application Software",
        "Maintenance",
        "PCTB Punjab Board Focus",
      ],
      easyExplanationEnglish:
        "In simple words: Programming is just typing code, but Software Engineering is the complete science of planning, designing, testing, and maintaining software so it never crashes when thousands of students, banks, or hospitals rely on it daily.",
      easyExplanationUrdu:
        "سادہ الفاظ میں: پروگرامنگ صرف کوڈ لکھنا ہے، جبکہ سافٹ ویئر انجینئرنگ اس بات کی باقاعدہ منصوبہ بندی، ڈیزائن اور ٹیسٹنگ ہے کہ سافٹ ویئر برسوں تک بغیر کسی خرابی کے چلے اور ہزاروں صارفین کے بیک وقت استعمال پر بھی کریش نہ ہو۔",
      realWorldEnglish:
        "Think of writing a small hobby script like building a basic mud hut in your backyard—anyone can do it with a shovel. But Software Engineering is like constructing a 50-story commercial skyscraper: you need soil testing (feasibility), detailed blueprints (architecture), building codes (quality standards), and continuous elevator maintenance.",
      realWorldUrdu:
        "روزمرہ کی مثال: ایک عام چھوٹا پروگرام بنانا ایسا ہے جیسے مٹی کا کچا کمرہ بنانا۔ لیکن سافٹ ویئر انجینئرنگ 50 منزلہ شاندار پلازہ تعمیر کرنے کے مترادف ہے، جس کے لیے مٹی کے ٹیسٹ، باقاعدہ نقشہ (بلیو پرنٹ)، مضبوط بنیادیں، اور مسلسل دیکھ بھال کی ضرورت ہوتی ہے۔",
      realWorldDiagramTitle: "Skyscraper Construction vs. Professional Software Engineering",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Engineering rigor ensures structural integrity and zero crashes",
        steps: [
          { stage: "1. Soil Test & Blueprints", analogy: "Feasibility & Requirements (SRS)", icon: "fa-compass-drafting", tag: "Planning" },
          { stage: "2. Steel Foundation", analogy: "System Architecture & Database", icon: "fa-layer-group", tag: "Structure" },
          { stage: "3. Construction Work", analogy: "Modular Code Implementation", icon: "fa-code", tag: "Building" },
          { stage: "4. Safety Inspection", analogy: "QA Testing & Bug Verification", icon: "fa-shield-halved", tag: "Testing" },
          { stage: "5. Ongoing Maintenance", analogy: "System Updates & Patches", icon: "fa-wrench", tag: "Support" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "Computer Software Classification & Architecture",
      diagramCaption:
        "Software is broadly divided into System Software (Operating Systems, Device Drivers, Utility Programs) which directly manages hardware, and Application Software (Word Processors, Spreadsheets, Custom ERPs) designed for end-user tasks.",
      hasInteractive: false,
      examQuestion:
        "Differentiate between System Software and Application Software. Give two practical examples of each category. (5 Marks) — BISE Lahore Annual Examination",
      boardReference: "BISE Lahore / Gujranwala Board (5 Marks Long Question)",
      markingScheme: [
        { criteria: "Clear formal definition of System Software", marks: 1 },
        { criteria: "Clear formal definition of Application Software", marks: 1 },
        { criteria: "Key technical differences (Hardware interaction, user focus, necessity)", marks: 2 },
        { criteria: "Two valid real-world examples for each category", marks: 1 },
      ],
      solutionGuidance:
        "To score full 5/5 marks in Punjab Board papers:\n1. Draw a neat comparative table with columns: Feature | System Software | Application Software.\n2. Compare them on 4 key axes: Purpose, Hardware Dependency, Execution Mode, and User Interaction.\n3. Mention examples: System Software (Windows 11, Linux kernel, Printer Driver), Application Software (MS Word, Adobe Photoshop, InPage Urdu).",
    },
  });

  // 2. Topic 2.3: OSI Reference Model Layers
  await prisma.topicLearnContent.upsert({
    where: { topicId: "top-11-02-03" },
    update: {
      definitionEnglish:
        "The Open Systems Interconnection (OSI) Reference Model is a conceptual framework created by ISO (International Organization for Standardization) comprising seven distinct abstraction layers to standardize computer network telecommunications regardless of underlying internal structure.",
      definitionUrdu:
        "او ایس آئی (OSI) ریفرنس ماڈل کمپیوٹر نیٹ ورکس کا ایک معیاری فریم ورک ہے جسے آئی ایس او نے وضع کیا ہے۔ یہ کمپیوٹر نیٹ ورکنگ کے پورے عمل کو 7 واضح تہوں (Layers) میں تقسیم کرتا ہے تاکہ مختلف کمپنیوں کے کمپیوٹرز اور آلات آپس میں باآسانی رابطہ قائم کر سکیں۔",
      rubricKeywords: [
        "7 Abstraction Layers",
        "ISO Standard",
        "Data Encapsulation",
        "Peer-to-Peer Communication",
        "PDU (Protocol Data Unit)",
      ],
      easyExplanationEnglish:
        "In simple words: The OSI Model is like an assembly line for Internet messages. Just like an international letter is packed into an envelope, stamped with a city address, loaded onto a mail truck, and delivered through highways, your computer handles network transmission in 7 structured steps.",
      easyExplanationUrdu:
        "سادہ الفاظ میں: او ایس آئی ماڈل انٹرنیٹ پر پیغامات بھیجنے کا مرحلہ وار نظام ہے۔ جس طرح ڈاک کا خط لفافے میں بند کر کے، اس پر ڈاک کا پتہ لکھ کر اور گاڑی کے ذریعے منزل تک پہنچایا جاتا ہے، بالکل اسی طرح کمپیوٹر آپ کے ڈیٹا کو 7 معیاری تہوں کے ذریعے بحفاظت آگے بھیجتا ہے۔",
      realWorldEnglish:
        "Sending data across the Internet is exactly like sending an international courier parcel. You write the letter (Application/Presentation), put it in an envelope (Transport segment), write recipient's country and city address (Network packet with IP), hand it to a delivery van taking a specific highway route (Data Link frame / Physical wires), and the recipient opens it step-by-step in reverse.",
      realWorldUrdu:
        "روزمرہ کی مثال: انٹرنیٹ پر ڈیٹا بھیجنا بالکل ایسا ہی ہے جیسے آپ پاکستان پوسٹ کے ذریعے خط بیرون ملک بھیجیں۔ آپ پیغام لکھتے ہیں، لفافے پر ڈاک کا پتہ (IP ایڈریس) لکھتے ہیں، گاڑی اسے مخصوص سڑک (کیبلز) کے ذریعے لے جاتی ہے، اور وصول کنندہ الٹے مرحلوں میں کھول کر پیغام پڑھتا ہے۔",
      realWorldDiagramTitle: "International Courier Service Workflow vs. OSI 7-Layer Encapsulation",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Mapping real-life parcel delivery steps directly to OSI protocol layers",
        steps: [
          { stage: "1. Letter Content", analogy: "Application (HTTP / Email)", icon: "fa-file-lines", tag: "Layers 7-5" },
          { stage: "2. Sealed Envelope", analogy: "Transport (TCP Segment / Port)", icon: "fa-envelope", tag: "Layer 4" },
          { stage: "3. Address Label", analogy: "Network (IP Address Packet)", icon: "fa-map-location-dot", tag: "Layer 3" },
          { stage: "4. Courier Van", analogy: "Data Link (MAC Frame)", icon: "fa-truck-fast", tag: "Layer 2" },
          { stage: "5. Highway Route", analogy: "Physical (Cables & Voltages)", icon: "fa-road", tag: "Layer 1" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "The 7 Layers of OSI (Mnemonic: All People Seem To Need Data Processing)",
      diagramCaption:
        "Layer 7: Application (User interface, HTTP/FTP)\nLayer 6: Presentation (Encryption, Compression, ASCII)\nLayer 5: Session (Dialog control, Token management)\nLayer 4: Transport (End-to-end reliability, TCP/UDP)\nLayer 3: Network (Logical routing, IP addressing)\nLayer 2: Data Link (Node-to-node framing, MAC addressing)\nLayer 1: Physical (Bit transmission, cables, voltages)",
      hasInteractive: true,
      interactiveTitle: "Live Data Encapsulation Simulator",
      interactiveType: "SIMULATION",
      interactiveConfig: {
        simulationType: "OSI_PACKET_ENROUTE",
        layers: ["Application", "Presentation", "Session", "Transport", "Network", "Data Link", "Physical"],
      },
      examQuestion:
        "State any four layers of the OSI Model and write down the primary function of each. (4 Marks) — BISE Multan & Faisalabad",
      boardReference: "Punjab Board Annual Exam (4 Marks Subjective Question)",
      markingScheme: [
        { criteria: "Correct layer names in sequential order", marks: 1 },
        { criteria: "Accurate primary responsibility of each stated layer", marks: 2 },
        { criteria: "Associated protocols or PDU units (e.g. Segments, Packets)", marks: 1 },
      ],
      solutionGuidance:
        "Exam Winning Strategy:\n1. State the mnemonic: 'All People Seem To Need Data Processing' to ensure zero ordering mistakes.\n2. Pick the four easiest layers to describe: Physical Layer (transmits raw bits), Network Layer (IP addressing & routing), Transport Layer (segmentation & flow control), and Application Layer (network access for end applications).\n3. Mention the PDU at each layer: Frame (Layer 2), Packet (Layer 3), Segment (Layer 4).",
    },
    create: {
      id: "tlc-11-02-03",
      topicId: "top-11-02-03",
      definitionEnglish:
        "The Open Systems Interconnection (OSI) Reference Model is a conceptual framework created by ISO (International Organization for Standardization) comprising seven distinct abstraction layers to standardize computer network telecommunications regardless of underlying internal structure.",
      definitionUrdu:
        "او ایس آئی (OSI) ریفرنس ماڈل کمپیوٹر نیٹ ورکس کا ایک معیاری فریم ورک ہے جسے آئی ایس او نے وضع کیا ہے۔ یہ کمپیوٹر نیٹ ورکنگ کے پورے عمل کو 7 واضح تہوں (Layers) میں تقسیم کرتا ہے تاکہ مختلف کمپنیوں کے کمپیوٹرز اور آلات آپس میں باآسانی رابطہ قائم کر سکیں۔",
      rubricKeywords: [
        "7 Abstraction Layers",
        "ISO Standard",
        "Data Encapsulation",
        "Peer-to-Peer Communication",
        "PDU (Protocol Data Unit)",
      ],
      easyExplanationEnglish:
        "In simple words: The OSI Model is like an assembly line for Internet messages. Just like an international letter is packed into an envelope, stamped with a city address, loaded onto a mail truck, and delivered through highways, your computer handles network transmission in 7 structured steps.",
      easyExplanationUrdu:
        "سادہ الفاظ میں: او ایس آئی ماڈل انٹرنیٹ پر پیغامات بھیجنے کا مرحلہ وار نظام ہے۔ جس طرح ڈاک کا خط لفافے میں بند کر کے، اس پر ڈاک کا پتہ لکھ کر اور گاڑی کے ذریعے منزل تک پہنچایا جاتا ہے، بالکل اسی طرح کمپیوٹر آپ کے ڈیٹا کو 7 معیاری تہوں کے ذریعے بحفاظت آگے بھیجتا ہے۔",
      realWorldEnglish:
        "Sending data across the Internet is exactly like sending an international courier parcel. You write the letter (Application/Presentation), put it in an envelope (Transport segment), write recipient's country and city address (Network packet with IP), hand it to a delivery van taking a specific highway route (Data Link frame / Physical wires), and the recipient opens it step-by-step in reverse.",
      realWorldUrdu:
        "روزمرہ کی مثال: انٹرنیٹ پر ڈیٹا بھیجنا بالکل ایسا ہی ہے جیسے آپ پاکستان پوسٹ کے ذریعے خط بیرون ملک بھیجیں۔ آپ پیغام لکھتے ہیں، لفافے پر ڈاک کا پتہ (IP ایڈریس) لکھتے ہیں، گاڑی اسے مخصوص سڑک (کیبلز) کے ذریعے لے جاتی ہے، اور وصول کنندہ الٹے مرحلوں میں کھول کر پیغام پڑھتا ہے۔",
      realWorldDiagramTitle: "International Courier Service Workflow vs. OSI 7-Layer Encapsulation",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Mapping real-life parcel delivery steps directly to OSI protocol layers",
        steps: [
          { stage: "1. Letter Content", analogy: "Application (HTTP / Email)", icon: "fa-file-lines", tag: "Layers 7-5" },
          { stage: "2. Sealed Envelope", analogy: "Transport (TCP Segment / Port)", icon: "fa-envelope", tag: "Layer 4" },
          { stage: "3. Address Label", analogy: "Network (IP Address Packet)", icon: "fa-map-location-dot", tag: "Layer 3" },
          { stage: "4. Courier Van", analogy: "Data Link (MAC Frame)", icon: "fa-truck-fast", tag: "Layer 2" },
          { stage: "5. Highway Route", analogy: "Physical (Cables & Voltages)", icon: "fa-road", tag: "Layer 1" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "The 7 Layers of OSI (Mnemonic: All People Seem To Need Data Processing)",
      diagramCaption:
        "Layer 7: Application (User interface, HTTP/FTP)\nLayer 6: Presentation (Encryption, Compression, ASCII)\nLayer 5: Session (Dialog control, Token management)\nLayer 4: Transport (End-to-end reliability, TCP/UDP)\nLayer 3: Network (Logical routing, IP addressing)\nLayer 2: Data Link (Node-to-node framing, MAC addressing)\nLayer 1: Physical (Bit transmission, cables, voltages)",
      hasInteractive: true,
      interactiveTitle: "Live Data Encapsulation Simulator",
      interactiveType: "SIMULATION",
      interactiveConfig: {
        simulationType: "OSI_PACKET_ENROUTE",
        layers: ["Application", "Presentation", "Session", "Transport", "Network", "Data Link", "Physical"],
      },
      examQuestion:
        "State any four layers of the OSI Model and write down the primary function of each. (4 Marks) — BISE Multan & Faisalabad",
      boardReference: "Punjab Board Annual Exam (4 Marks Subjective Question)",
      markingScheme: [
        { criteria: "Correct layer names in sequential order", marks: 1 },
        { criteria: "Accurate primary responsibility of each stated layer", marks: 2 },
        { criteria: "Associated protocols or PDU units (e.g. Segments, Packets)", marks: 1 },
      ],
      solutionGuidance:
        "Exam Winning Strategy:\n1. State the mnemonic: 'All People Seem To Need Data Processing' to ensure zero ordering mistakes.\n2. Pick the four easiest layers to describe: Physical Layer (transmits raw bits), Network Layer (IP addressing & routing), Transport Layer (segmentation & flow control), and Application Layer (network access for end applications).\n3. Mention the PDU at each layer: Frame (Layer 2), Packet (Layer 3), Segment (Layer 4).",
    },
  });

  // 3. Topic 1.2: Software Development Life Cycle (SDLC)
  await prisma.topicLearnContent.upsert({
    where: { topicId: "top-11-01-02" },
    update: {
      definitionEnglish:
        "Software Development Life Cycle (SDLC) is an organized step-by-step framework used by software engineering teams to plan, analyze, design, build, test, deploy, and maintain high-quality software systems within budgeted time and resources.",
      definitionUrdu:
        "سافٹ ویئر ڈویلپمنٹ لائف سائیکل (SDLC) مرحلہ وار عمل کا ایک منظم ڈھانچہ ہے جو سافٹ ویئر بنانے والی کمپنیاں استعمال کرتی ہیں۔ اس کا مقصد مقررہ وقت اور بجٹ کے اندر منصوبہ بندی، تجزیہ، ڈیزائننگ، کوڈنگ اور ٹیسٹنگ کے ذریعے معیاری سافٹ ویئر تیار کرنا ہے۔",
      rubricKeywords: [
        "Phased Process",
        "Feasibility Study",
        "Requirements Analysis (SRS)",
        "System Architecture",
        "QA Testing & Maintenance",
      ],
      easyExplanationEnglish:
        "In simple words: SDLC is the complete roadmap from a client's initial idea to a working app on their phone. Without this roadmap, 70% of software projects fail due to misunderstandings or missed deadlines.",
      easyExplanationUrdu:
        "سادہ الفاظ میں: ایس ڈی ایل سی (SDLC) کلائنٹ کے خیال سے لے کر مکمل ورکنگ ایپ بننے تک کا مکمل روڈ میپ ہے۔ اس باقاعدہ فریم ورک کے بغیر زیادہ تر سافٹ ویئر پراجیکٹس وقت اور بجٹ کے ضیاع کی وجہ سے ناکام ہو جاتے ہیں۔",
      realWorldEnglish:
        "Imagine ordering a tailor-made suit for a wedding. First, the tailor asks what you need and checks fabric availability (Requirements & Feasibility). Then measures you and draws the cut pattern (Design). Then cuts and stitches the cloth (Coding). Next, you do a fitting trial to check for loose stitching (Testing). Finally, you wear it to the event (Deployment), and alter it later if your size changes (Maintenance).",
      realWorldUrdu:
        "روزمرہ کی مثال: شادی کا سوٹ سلوانا: درزی پہلے آپ کی پسند اور کپڑا چیک کرتا ہے (تجزیہ)، پھر ناپ لے کر کٹنگ کا خاکہ بناتا ہے (ڈیزائن)، سلائی کرتا ہے (کوڈنگ)، ٹرائل کر کے فٹنگ دیکھتا ہے (ٹیسٹنگ)، اور بعد میں ڈھیلا یا تنگ ہونے پر درست کرتا ہے (مینٹیننس)۔",
      realWorldDiagramTitle: "Custom Tailoring Workflow vs. The 6 SDLC Phases",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Step-by-step alignment between garment crafting and software engineering",
        steps: [
          { stage: "1. Fabric & Budget", analogy: "Preliminary Feasibility Study", icon: "fa-money-bill-wave", tag: "Phase 1" },
          { stage: "2. Body Measurements", analogy: "Requirements Analysis (SRS)", icon: "fa-ruler-combined", tag: "Phase 2" },
          { stage: "3. Cutting Pattern", analogy: "System Architectural Design", icon: "fa-pen-ruler", tag: "Phase 3" },
          { stage: "4. Stitching Work", analogy: "Coding & Implementation", icon: "fa-scissors", tag: "Phase 4" },
          { stage: "5. Trial Fitting", analogy: "QA Verification & Testing", icon: "fa-check-double", tag: "Phase 5" },
          { stage: "6. Event & Alterations", analogy: "Deployment & Maintenance", icon: "fa-shirt", tag: "Phase 6" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "Standard 6 Phases of SDLC (Sequential Flow)",
      diagramCaption:
        "1. Preliminary Investigation / Feasibility\n2. Systems Analysis & Requirements Engineering (SRS)\n3. System Architectural Design\n4. Coding & Program Implementation\n5. Quality Assurance & System Testing\n6. Deployment, User Training & Maintenance",
      hasInteractive: true,
      interactiveTitle: "Interactive SDLC Phase Explorer",
      interactiveType: "STEPPER",
      interactiveConfig: {
        simulationType: "SDLC_PHASE_STEPPER",
        steps: [
          { phase: "1. Feasibility", duration: "10%", risk: "High", focus: "Cost/Benefit check" },
          { phase: "2. Analysis", duration: "20%", risk: "Very High", focus: "SRS Document" },
          { phase: "3. Design", duration: "15%", risk: "Medium", focus: "UML & Database schemas" },
          { phase: "4. Coding", duration: "20%", risk: "Low", focus: "Clean algorithms" },
          { phase: "5. Testing", duration: "20%", risk: "Medium", focus: "Unit & Integration test" },
          { phase: "6. Maintenance", duration: "60% lifetime", risk: "Ongoing", focus: "Patches & upgrades" },
        ],
      },
      examQuestion:
        "List the main stages of the Software Development Life Cycle (SDLC). Explain the Analysis stage in detail. (6 Marks) — BISE Rawalpindi & Lahore",
      boardReference: "BISE Punjab Boards (6 Marks Subjective)",
      markingScheme: [
        { criteria: "Correct list of all major SDLC phases in order", marks: 2 },
        { criteria: "Detailed explanation of the Systems Analysis phase", marks: 3 },
        { criteria: "Mention of the SRS (Software Requirements Specification) document", marks: 1 },
      ],
      solutionGuidance:
        "How to secure maximum marks:\n1. Draw a clean circular or waterfall diagram showing the phases linked with arrows.\n2. For the Analysis Phase, highlight: Fact-finding techniques (Interviews, Questionnaires, Observation), Data Flow Diagrams (DFDs), and the delivery of the Software Requirements Specification (SRS) document.\n3. State why skipping Analysis causes 80% of project failures.",
    },
    create: {
      id: "tlc-11-01-02",
      topicId: "top-11-01-02",
      definitionEnglish:
        "Software Development Life Cycle (SDLC) is an organized step-by-step framework used by software engineering teams to plan, analyze, design, build, test, deploy, and maintain high-quality software systems within budgeted time and resources.",
      definitionUrdu:
        "سافٹ ویئر ڈویلپمنٹ لائف سائیکل (SDLC) مرحلہ وار عمل کا ایک منظم ڈھانچہ ہے جو سافٹ ویئر بنانے والی کمپنیاں استعمال کرتی ہیں۔ اس کا مقصد مقررہ وقت اور بجٹ کے اندر منصوبہ بندی، تجزیہ، ڈیزائننگ، کوڈنگ اور ٹیسٹنگ کے ذریعے معیاری سافٹ ویئر تیار کرنا ہے۔",
      rubricKeywords: [
        "Phased Process",
        "Feasibility Study",
        "Requirements Analysis (SRS)",
        "System Architecture",
        "QA Testing & Maintenance",
      ],
      easyExplanationEnglish:
        "In simple words: SDLC is the complete roadmap from a client's initial idea to a working app on their phone. Without this roadmap, 70% of software projects fail due to misunderstandings or missed deadlines.",
      easyExplanationUrdu:
        "سادہ الفاظ میں: ایس ڈی ایل سی (SDLC) کلائنٹ کے خیال سے لے کر مکمل ورکنگ ایپ بننے تک کا مکمل روڈ میپ ہے۔ اس باقاعدہ فریم ورک کے بغیر زیادہ تر سافٹ ویئر پراجیکٹس وقت اور بجٹ کے ضیاع کی وجہ سے ناکام ہو جاتے ہیں۔",
      realWorldEnglish:
        "Imagine ordering a tailor-made suit for a wedding. First, the tailor asks what you need and checks fabric availability (Requirements & Feasibility). Then measures you and draws the cut pattern (Design). Then cuts and stitches the cloth (Coding). Next, you do a fitting trial to check for loose stitching (Testing). Finally, you wear it to the event (Deployment), and alter it later if your size changes (Maintenance).",
      realWorldUrdu:
        "روزمرہ کی مثال: شادی کا سوٹ سلوانا: درزی پہلے آپ کی پسند اور کپڑا چیک کرتا ہے (تجزیہ)، پھر ناپ لے کر کٹنگ کا خاکہ بناتا ہے (ڈیزائن)، سلائی کرتا ہے (کوڈنگ)، ٹرائل کر کے فٹنگ دیکھتا ہے (ٹیسٹنگ)، اور بعد میں ڈھیلا یا تنگ ہونے پر درست کرتا ہے (مینٹیننس)۔",
      realWorldDiagramTitle: "Custom Tailoring Workflow vs. The 6 SDLC Phases",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Step-by-step alignment between garment crafting and software engineering",
        steps: [
          { stage: "1. Fabric & Budget", analogy: "Preliminary Feasibility Study", icon: "fa-money-bill-wave", tag: "Phase 1" },
          { stage: "2. Body Measurements", analogy: "Requirements Analysis (SRS)", icon: "fa-ruler-combined", tag: "Phase 2" },
          { stage: "3. Cutting Pattern", analogy: "System Architectural Design", icon: "fa-pen-ruler", tag: "Phase 3" },
          { stage: "4. Stitching Work", analogy: "Coding & Implementation", icon: "fa-scissors", tag: "Phase 4" },
          { stage: "5. Trial Fitting", analogy: "QA Verification & Testing", icon: "fa-check-double", tag: "Phase 5" },
          { stage: "6. Event & Alterations", analogy: "Deployment & Maintenance", icon: "fa-shirt", tag: "Phase 6" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "Standard 6 Phases of SDLC (Sequential Flow)",
      diagramCaption:
        "1. Preliminary Investigation / Feasibility\n2. Systems Analysis & Requirements Engineering (SRS)\n3. System Architectural Design\n4. Coding & Program Implementation\n5. Quality Assurance & System Testing\n6. Deployment, User Training & Maintenance",
      hasInteractive: true,
      interactiveTitle: "Interactive SDLC Phase Explorer",
      interactiveType: "STEPPER",
      interactiveConfig: {
        simulationType: "SDLC_PHASE_STEPPER",
        steps: [
          { phase: "1. Feasibility", duration: "10%", risk: "High", focus: "Cost/Benefit check" },
          { phase: "2. Analysis", duration: "20%", risk: "Very High", focus: "SRS Document" },
          { phase: "3. Design", duration: "15%", risk: "Medium", focus: "UML & Database schemas" },
          { phase: "4. Coding", duration: "20%", risk: "Low", focus: "Clean algorithms" },
          { phase: "5. Testing", duration: "20%", risk: "Medium", focus: "Unit & Integration test" },
          { phase: "6. Maintenance", duration: "60% lifetime", risk: "Ongoing", focus: "Patches & upgrades" },
        ],
      },
      examQuestion:
        "List the main stages of the Software Development Life Cycle (SDLC). Explain the Analysis stage in detail. (6 Marks) — BISE Rawalpindi & Lahore",
      boardReference: "BISE Punjab Boards (6 Marks Subjective)",
      markingScheme: [
        { criteria: "Correct list of all major SDLC phases in order", marks: 2 },
        { criteria: "Detailed explanation of the Systems Analysis phase", marks: 3 },
        { criteria: "Mention of the SRS (Software Requirements Specification) document", marks: 1 },
      ],
      solutionGuidance:
        "How to secure maximum marks:\n1. Draw a clean circular or waterfall diagram showing the phases linked with arrows.\n2. For the Analysis Phase, highlight: Fact-finding techniques (Interviews, Questionnaires, Observation), Data Flow Diagrams (DFDs), and the delivery of the Software Requirements Specification (SRS) document.\n3. State why skipping Analysis causes 80% of project failures.",
    },
  });

  // 4. Topic 2.2: Network Topologies (Bus, Star, Ring, Mesh)
  await prisma.topicLearnContent.upsert({
    where: { topicId: "top-11-02-02" },
    update: {
      definitionEnglish:
        "A Network Topology is the physical or logical arrangement and geometric layout of nodes (computers, printers, switches) and connecting cables in a computer network.",
      definitionUrdu:
        "نیٹ ورک ٹوپولوجی (Network Topology) کسی کمپیوٹر نیٹ ورک میں کمپیوٹرز، پرنٹرز اور کیبلز کے آپس میں جڑنے کی جیومیٹریکل اور فزیکل ساخت یا ترتیب کو کہا جاتا ہے۔",
      rubricKeywords: [
        "Star Topology & Central Hub",
        "Bus Topology & Terminator",
        "Ring Topology & Token Passing",
        "Mesh Topology & Fault Tolerance",
      ],
      easyExplanationEnglish:
        "In simple words: Network topology is simply the floor plan or map showing how computers are wired together—like students sitting around a single teacher (Star), standing in a straight queue along a single rope (Bus), or holding hands in a circle (Ring).",
      easyExplanationUrdu:
        "سادہ الفاظ میں: نیٹ ورک ٹوپولوجی کا مطلب یہ ہے کہ کمپیوٹرز کو آپس میں کیسے جوڑا گیا ہے۔ مثلاً ایک دائرے میں گول بیٹھنا (Ring)، ایک سیدھی قطار میں کیبل سے جڑنا (Bus)، یا سب کا درمیان والے سنٹرل سوئچ سے جڑنا (Star)۔",
      realWorldEnglish:
        "Think of classroom arrangements: A round-table discussion where a microphone is passed from person to person is Ring topology. A teacher standing in the center with every student raising hands directly to the teacher is Star topology. A single blackboard where everyone reads from the same wall is Bus topology.",
      realWorldUrdu:
        "روزمرہ کی مثال: کلاس روم کی ترتیب: تمام طلباء کا سرکل میں بیٹھ کر مائیک آگے بڑھانا Ring ٹوپولوجی ہے۔ تمام طلباء کا درمیان میں بیٹھے استاد سے براہ راست بات کرنا Star ٹوپولوجی ہے۔ اور ایک سیدھی لائن میں لگے بلیک بورڈ کو سب کا دیکھنا Bus ٹوپولوجی ہے۔",
      realWorldDiagramTitle: "Classroom Communication Models vs. Network Topologies",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Comparing physical human layout with network packet communication",
        steps: [
          { stage: "Star: Central Hub", analogy: "Teacher at center answering queries", icon: "fa-asterisk", tag: "Star" },
          { stage: "Bus: Backbone Cable", analogy: "Single highway with bus stops", icon: "fa-grip-lines", tag: "Bus" },
          { stage: "Ring: Token Passing", analogy: "Pass-the-parcel in a circle", icon: "fa-circle-notch", tag: "Ring" },
          { stage: "Mesh: Dedicated Links", analogy: "Private phone line to every friend", icon: "fa-network-wired", tag: "Mesh" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "Comparative Architecture of Modern Network Topologies",
      diagramCaption:
        "Star Topology is the global industry standard for Ethernet LANs: if one cable breaks, only that node fails while the rest of the network stays online. Bus uses terminators at both ends to stop signal bounce.",
      hasInteractive: false,
      examQuestion:
        "Compare Star Topology and Bus Topology with neat diagrams. State two advantages and two disadvantages of each. (6 Marks) — BISE Lahore & Gujranwala",
      boardReference: "BISE Punjab Board (6 Marks Long Question)",
      markingScheme: [
        { criteria: "Neat diagram for Star Topology and Bus Topology", marks: 2 },
        { criteria: "Working explanation of both topologies", marks: 2 },
        { criteria: "Valid advantages and disadvantages stated", marks: 2 },
      ],
      solutionGuidance:
        "Punjab Board Strategy:\n1. Draw neat labelled diagrams using pencil and ruler: Show central Switch/Hub for Star, and backbone cable with Terminators for Bus.\n2. Note that Star is easy to troubleshoot but Hub failure brings down everything. Bus is cheaper but hard to isolate cable faults.",
    },
    create: {
      id: "tlc-11-02-02",
      topicId: "top-11-02-02",
      definitionEnglish:
        "A Network Topology is the physical or logical arrangement and geometric layout of nodes (computers, printers, switches) and connecting cables in a computer network.",
      definitionUrdu:
        "نیٹ ورک ٹوپولوجی (Network Topology) کسی کمپیوٹر نیٹ ورک میں کمپیوٹرز، پرنٹرز اور کیبلز کے آپس میں جڑنے کی جیومیٹریکل اور فزیکل ساخت یا ترتیب کو کہا جاتا ہے۔",
      rubricKeywords: [
        "Star Topology & Central Hub",
        "Bus Topology & Terminator",
        "Ring Topology & Token Passing",
        "Mesh Topology & Fault Tolerance",
      ],
      easyExplanationEnglish:
        "In simple words: Network topology is simply the floor plan or map showing how computers are wired together—like students sitting around a single teacher (Star), standing in a straight queue along a single rope (Bus), or holding hands in a circle (Ring).",
      easyExplanationUrdu:
        "سادہ الفاظ میں: نیٹ ورک ٹوپولوجی کا مطلب یہ ہے کہ کمپیوٹرز کو آپس میں کیسے جوڑا گیا ہے۔ مثلاً ایک دائرے میں گول بیٹھنا (Ring)، ایک سیدھی قطار میں کیبل سے جڑنا (Bus)، یا سب کا درمیان والے سنٹرل سوئچ سے جڑنا (Star)۔",
      realWorldEnglish:
        "Think of classroom arrangements: A round-table discussion where a microphone is passed from person to person is Ring topology. A teacher standing in the center with every student raising hands directly to the teacher is Star topology. A single blackboard where everyone reads from the same wall is Bus topology.",
      realWorldUrdu:
        "روزمرہ کی مثال: کلاس روم کی ترتیب: تمام طلباء کا سرکل میں بیٹھ کر مائیک آگے بڑھانا Ring ٹوپولوجی ہے۔ تمام طلباء کا درمیان میں بیٹھے استاد سے براہ راست بات کرنا Star ٹوپولوجی ہے۔ اور ایک سیدھی لائن میں لگے بلیک بورڈ کو سب کا دیکھنا Bus ٹوپولوجی ہے۔",
      realWorldDiagramTitle: "Classroom Communication Models vs. Network Topologies",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Comparing physical human layout with network packet communication",
        steps: [
          { stage: "Star: Central Hub", analogy: "Teacher at center answering queries", icon: "fa-asterisk", tag: "Star" },
          { stage: "Bus: Backbone Cable", analogy: "Single highway with bus stops", icon: "fa-grip-lines", tag: "Bus" },
          { stage: "Ring: Token Passing", analogy: "Pass-the-parcel in a circle", icon: "fa-circle-notch", tag: "Ring" },
          { stage: "Mesh: Dedicated Links", analogy: "Private phone line to every friend", icon: "fa-network-wired", tag: "Mesh" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "Comparative Architecture of Modern Network Topologies",
      diagramCaption:
        "Star Topology is the global industry standard for Ethernet LANs: if one cable breaks, only that node fails while the rest of the network stays online. Bus uses terminators at both ends to stop signal bounce.",
      hasInteractive: false,
      examQuestion:
        "Compare Star Topology and Bus Topology with neat diagrams. State two advantages and two disadvantages of each. (6 Marks) — BISE Lahore & Gujranwala",
      boardReference: "BISE Punjab Board (6 Marks Long Question)",
      markingScheme: [
        { criteria: "Neat diagram for Star Topology and Bus Topology", marks: 2 },
        { criteria: "Working explanation of both topologies", marks: 2 },
        { criteria: "Valid advantages and disadvantages stated", marks: 2 },
      ],
      solutionGuidance:
        "Punjab Board Strategy:\n1. Draw neat labelled diagrams using pencil and ruler: Show central Switch/Hub for Star, and backbone cable with Terminators for Bus.\n2. Note that Star is easy to troubleshoot but Hub failure brings down everything. Bus is cheaper but hard to isolate cable faults.",
    },
  });

  // 5. Topic 3.1: Components of Communication System
  await prisma.topicLearnContent.upsert({
    where: { topicId: "top-11-03-01" },
    update: {
      definitionEnglish:
        "A Data Communication System is the electronic transmission of data and information between two or more communicating devices via a transmission medium governed by standardized protocols.",
      definitionUrdu:
        "ڈیٹا کمیونیکیشن سسٹم (Data Communication System) کمپیوٹرز اور الیکٹرانک آلات کے درمیان ایک مقررہ راستے اور طے شدہ پروٹوکولز کے تحت ڈیٹا کی ترسیل کا عمل ہے۔",
      rubricKeywords: [
        "Sender (Transmitter)",
        "Receiver (Sink)",
        "Transmission Medium (Channel)",
        "Message (Payload)",
        "Protocol (Standard Rules)",
      ],
      easyExplanationEnglish:
        "In simple words: Just like two people talking need a speaker, a listener, words, air for sound, and a common language (like Urdu), computers also need 5 exact components to chat.",
      easyExplanationUrdu:
        "سادہ الفاظ میں: جس طرح دو انسانوں کو بات کرنے کے لیے بولنے والا، سننے والا، بات (پیغام)، ہوا کا ذریعہ، اور ایک مشترکہ زبان درکار ہوتی ہے، کمپیوٹرز کو بھی آپس میں بات کرنے کے لیے یہ 5 بنیادی اجزاء درکار ہوتے ہیں۔",
      realWorldEnglish:
        "A telephone phone call between two doctors: Doctor Ali speaks (Sender), voice travels over 4G cell tower waves (Medium), the spoken diagnosis is the message, Doctor Bilal listens (Receiver), and medical English grammar ensures mutual understanding (Protocol).",
      realWorldUrdu:
        "روزمرہ کی مثال: دو افراد کے درمیان فون کال: پہلا شخص بولنے والا (Sender)، دوسرا سننے والا (Receiver)، آواز کی لہریں اور موبائل سگنل (Medium)، جو بات کی جا رہی ہے وہ پیغام (Message)، اور دونوں کی سمجھی جانے والی مشترکہ زبان (Protocol) ہے۔",
      realWorldDiagramTitle: "5-Component Telecommunication Pipeline",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "All digital communication relies on these five interconnected elements",
        steps: [
          { stage: "1. Sender Device", analogy: "The caller speaking on phone", icon: "fa-mobile-screen", tag: "Sender" },
          { stage: "2. The Message", analogy: "Spoken words & information", icon: "fa-envelope-open-text", tag: "Payload" },
          { stage: "3. Transmission Medium", analogy: "Fiber optic cables & radio waves", icon: "fa-wifi", tag: "Channel" },
          { stage: "4. Protocol Rules", analogy: "Shared language & syntax", icon: "fa-handshake", tag: "Rules" },
          { stage: "5. Receiver Device", analogy: "The listener answering call", icon: "fa-phone-volume", tag: "Receiver" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "Data Communication System Model Diagram",
      diagramCaption:
        "Sender converts data into electronic signals; Transmission medium carries the signals across distance; Receiver receives and decodes back to original data; Protocol controls synchronization and error checking.",
      hasInteractive: false,
      examQuestion:
        "Name and explain the five essential components of a data communication system. (5 Marks) — BISE Faisalabad & Sargodha",
      boardReference: "BISE Punjab Board (5 Marks Subjective)",
      markingScheme: [
        { criteria: "Stating all 5 components correctly", marks: 1 },
        { criteria: "Clear explanation of Sender, Receiver, Medium, Message, Protocol", marks: 3 },
        { criteria: "Neat block diagram linking sender to receiver", marks: 1 },
      ],
      solutionGuidance:
        "Draw a straight block diagram: [Sender] ---> [Transmission Medium] ---> [Receiver], with [Protocol] shown governing both ends, and [Message] traveling along the arrow.",
    },
    create: {
      id: "tlc-11-03-01",
      topicId: "top-11-03-01",
      definitionEnglish:
        "A Data Communication System is the electronic transmission of data and information between two or more communicating devices via a transmission medium governed by standardized protocols.",
      definitionUrdu:
        "ڈیٹا کمیونیکیشن سسٹم (Data Communication System) کمپیوٹرز اور الیکٹرانک آلات کے درمیان ایک مقررہ راستے اور طے شدہ پروٹوکولز کے تحت ڈیٹا کی ترسیل کا عمل ہے۔",
      rubricKeywords: [
        "Sender (Transmitter)",
        "Receiver (Sink)",
        "Transmission Medium (Channel)",
        "Message (Payload)",
        "Protocol (Standard Rules)",
      ],
      easyExplanationEnglish:
        "In simple words: Just like two people talking need a speaker, a listener, words, air for sound, and a common language (like Urdu), computers also need 5 exact components to chat.",
      easyExplanationUrdu:
        "سادہ الفاظ میں: جس طرح دو انسانوں کو بات کرنے کے لیے بولنے والا، سننے والا، بات (پیغام)، ہوا کا ذریعہ، اور ایک مشترکہ زبان درکار ہوتی ہے، کمپیوٹرز کو بھی آپس میں بات کرنے کے لیے یہ 5 بنیادی اجزاء درکار ہوتے ہیں۔",
      realWorldEnglish:
        "A telephone phone call between two doctors: Doctor Ali speaks (Sender), voice travels over 4G cell tower waves (Medium), the spoken diagnosis is the message, Doctor Bilal listens (Receiver), and medical English grammar ensures mutual understanding (Protocol).",
      realWorldUrdu:
        "روزمرہ کی مثال: دو افراد کے درمیان فون کال: پہلا شخص بولنے والا (Sender)، دوسرا سننے والا (Receiver)، آواز کی لہریں اور موبائل سگنل (Medium)، جو بات کی جا رہی ہے وہ پیغام (Message)، اور دونوں کی سمجھی جانے والی مشترکہ زبان (Protocol) ہے۔",
      realWorldDiagramTitle: "5-Component Telecommunication Pipeline",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "All digital communication relies on these five interconnected elements",
        steps: [
          { stage: "1. Sender Device", analogy: "The caller speaking on phone", icon: "fa-mobile-screen", tag: "Sender" },
          { stage: "2. The Message", analogy: "Spoken words & information", icon: "fa-envelope-open-text", tag: "Payload" },
          { stage: "3. Transmission Medium", analogy: "Fiber optic cables & radio waves", icon: "fa-wifi", tag: "Channel" },
          { stage: "4. Protocol Rules", analogy: "Shared language & syntax", icon: "fa-handshake", tag: "Rules" },
          { stage: "5. Receiver Device", analogy: "The listener answering call", icon: "fa-phone-volume", tag: "Receiver" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "Data Communication System Model Diagram",
      diagramCaption:
        "Sender converts data into electronic signals; Transmission medium carries the signals across distance; Receiver receives and decodes back to original data; Protocol controls synchronization and error checking.",
      hasInteractive: false,
      examQuestion:
        "Name and explain the five essential components of a data communication system. (5 Marks) — BISE Faisalabad & Sargodha",
      boardReference: "BISE Punjab Board (5 Marks Subjective)",
      markingScheme: [
        { criteria: "Stating all 5 components correctly", marks: 1 },
        { criteria: "Clear explanation of Sender, Receiver, Medium, Message, Protocol", marks: 3 },
        { criteria: "Neat block diagram linking sender to receiver", marks: 1 },
      ],
      solutionGuidance:
        "Draw a straight block diagram: [Sender] ---> [Transmission Medium] ---> [Receiver], with [Protocol] shown governing both ends, and [Message] traveling along the arrow.",
    },
  });

  // 6. Topic 5.1: Von Neumann Architecture & CPU Components
  await prisma.topicLearnContent.upsert({
    where: { topicId: "top-11-05-01" },
    update: {
      definitionEnglish:
        "The Von Neumann Architecture is a theoretical computer design proposed by John von Neumann in 1945 based on the stored-program computer concept, where CPU execution units, memory, and I/O devices share common buses.",
      definitionUrdu:
        "وان نیومن آرکیٹیکچر (Von Neumann Architecture) کمپیوٹر کا وہ بنیادی خاکہ ہے جسے جان وان نیومن نے 1945 میں پیش کیا۔ اس کی بنیاد 'سٹورڈ پروگرام' کے تصور پر ہے جس میں ہدایات اور ڈیٹا دونوں ایک ہی مین میموری میں محفوظ ہوتے ہیں۔",
      rubricKeywords: [
        "Arithmetic Logic Unit (ALU)",
        "Control Unit (CU)",
        "Main Memory (RAM)",
        "Stored-Program Concept",
        "System Bus (Data, Address, Control)",
      ],
      easyExplanationEnglish:
        "In simple words: The CPU is like a master chef (Control Unit) who reads a recipe book (Memory), does mathematical cooking with knives and pans (ALU), and relies on kitchen assistants (Buses) to fetch spices.",
      easyExplanationUrdu:
        "سادہ الفاظ میں: سی پی یو ایک ماسٹر شیف کی طرح ہے۔ کنٹرول یونٹ ترکیب کی کتاب پڑھتا ہے، اے ایل یو (ALU) کھانا تیار کرتا اور حساب لگاتا ہے، اور سسٹم بس وہ بیرے ہیں جو کچن سے سامان ادھر ادھر لاتے ہیں۔",
      realWorldEnglish:
        "An automated calculator factory: The supervisor (Control Unit) decodes orders, the machinery worker (ALU) does the stamping, the warehouse shelf (RAM) stores parts and blueprints, and conveyor belts (System Bus) transport parts between stations.",
      realWorldUrdu:
        "روزمرہ کی مثال: ایک جدید فیکٹری کا کام: مینیجر (Control Unit) احکامات جاری کرتا ہے، کاریگر (ALU) مشینیں چلاتا ہے، اسٹور روم (RAM) سامان اور خام مال رکھتا ہے، اور کنویئر بیلٹ (System Bus) تمام سامان کو متعلقہ جگہ تک پہنچاتی ہے۔",
      realWorldDiagramTitle: "Automated Factory Blueprint vs. Von Neumann Computer Subsystems",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "How physical factory roles directly mirror internal computer hardware",
        steps: [
          { stage: "1. Store Shelf (RAM)", analogy: "Stores program code & raw data together", icon: "fa-memory", tag: "Storage" },
          { stage: "2. Supervisor (CU)", analogy: "Fetches instructions & directs traffic", icon: "fa-brain", tag: "Control" },
          { stage: "3. Machine Worker (ALU)", analogy: "Performs math (+,-,*) & logic (<,>,=)", icon: "fa-calculator", tag: "Math" },
          { stage: "4. Conveyor Belt (Bus)", analogy: "Transports bits, memory addresses, pulses", icon: "fa-route", tag: "Bus" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "Von Neumann Architecture Block Diagram",
      diagramCaption:
        "CPU contains ALU and CU connected via internal bus to General Purpose Registers. External System Bus links CPU to RAM and Input/Output controllers.",
      hasInteractive: false,
      examQuestion:
        "Describe Von Neumann Architecture with a block diagram. Explain the functions of ALU and Control Unit. (6 Marks) — BISE Lahore",
      boardReference: "BISE Punjab Board (6 Marks Subjective)",
      markingScheme: [
        { criteria: "Neat diagram showing CPU, Memory, I/O and System Bus", marks: 2 },
        { criteria: "Function and operations of ALU (Arithmetic & Logic)", marks: 2 },
        { criteria: "Function of Control Unit (Supervisor of computer)", marks: 2 },
      ],
      solutionGuidance:
        "Punjab Board Strategy:\n1. Draw a clean central box labelled 'CPU' containing 'ALU', 'CU', and 'Registers'.\n2. Draw double-headed arrows connecting CPU to 'Main Memory (RAM)' and 'Input/Output Devices'.\n3. Clarify that Control Unit does NOT execute instructions itself—it fetches, decodes, and issues electrical timing pulses.",
    },
    create: {
      id: "tlc-11-05-01",
      topicId: "top-11-05-01",
      definitionEnglish:
        "The Von Neumann Architecture is a theoretical computer design proposed by John von Neumann in 1945 based on the stored-program computer concept, where CPU execution units, memory, and I/O devices share common buses.",
      definitionUrdu:
        "وان نیومن آرکیٹیکچر (Von Neumann Architecture) کمپیوٹر کا وہ بنیادی خاکہ ہے جسے جان وان نیومن نے 1945 میں پیش کیا۔ اس کی بنیاد 'سٹورڈ پروگرام' کے تصور پر ہے جس میں ہدایات اور ڈیٹا دونوں ایک ہی مین میموری میں محفوظ ہوتے ہیں۔",
      rubricKeywords: [
        "Arithmetic Logic Unit (ALU)",
        "Control Unit (CU)",
        "Main Memory (RAM)",
        "Stored-Program Concept",
        "System Bus (Data, Address, Control)",
      ],
      easyExplanationEnglish:
        "In simple words: The CPU is like a master chef (Control Unit) who reads a recipe book (Memory), does mathematical cooking with knives and pans (ALU), and relies on kitchen assistants (Buses) to fetch spices.",
      easyExplanationUrdu:
        "سادہ الفاظ میں: سی پی یو ایک ماسٹر شیف کی طرح ہے۔ کنٹرول یونٹ ترکیب کی کتاب پڑھتا ہے، اے ایل یو (ALU) کھانا تیار کرتا اور حساب لگاتا ہے، اور سسٹم بس وہ بیرے ہیں جو کچن سے سامان ادھر ادھر لاتے ہیں۔",
      realWorldEnglish:
        "An automated calculator factory: The supervisor (Control Unit) decodes orders, the machinery worker (ALU) does the stamping, the warehouse shelf (RAM) stores parts and blueprints, and conveyor belts (System Bus) transport parts between stations.",
      realWorldUrdu:
        "روزمرہ کی مثال: ایک جدید فیکٹری کا کام: مینیجر (Control Unit) احکامات جاری کرتا ہے، کاریگر (ALU) مشینیں چلاتا ہے، اسٹور روم (RAM) سامان اور خام مال رکھتا ہے، اور کنویئر بیلٹ (System Bus) تمام سامان کو متعلقہ جگہ تک پہنچاتی ہے۔",
      realWorldDiagramTitle: "Automated Factory Blueprint vs. Von Neumann Computer Subsystems",
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "How physical factory roles directly mirror internal computer hardware",
        steps: [
          { stage: "1. Store Shelf (RAM)", analogy: "Stores program code & raw data together", icon: "fa-memory", tag: "Storage" },
          { stage: "2. Supervisor (CU)", analogy: "Fetches instructions & directs traffic", icon: "fa-brain", tag: "Control" },
          { stage: "3. Machine Worker (ALU)", analogy: "Performs math (+,-,*) & logic (<,>,=)", icon: "fa-calculator", tag: "Math" },
          { stage: "4. Conveyor Belt (Bus)", analogy: "Transports bits, memory addresses, pulses", icon: "fa-route", tag: "Bus" },
        ],
      },
      contentType: "DIAGRAM",
      technicalTitle: "Von Neumann Architecture Block Diagram",
      diagramCaption:
        "CPU contains ALU and CU connected via internal bus to General Purpose Registers. External System Bus links CPU to RAM and Input/Output controllers.",
      hasInteractive: false,
      examQuestion:
        "Describe Von Neumann Architecture with a block diagram. Explain the functions of ALU and Control Unit. (6 Marks) — BISE Lahore",
      boardReference: "BISE Punjab Board (6 Marks Subjective)",
      markingScheme: [
        { criteria: "Neat diagram showing CPU, Memory, I/O and System Bus", marks: 2 },
        { criteria: "Function and operations of ALU (Arithmetic & Logic)", marks: 2 },
        { criteria: "Function of Control Unit (Supervisor of computer)", marks: 2 },
      ],
      solutionGuidance:
        "Punjab Board Strategy:\n1. Draw a clean central box labelled 'CPU' containing 'ALU', 'CU', and 'Registers'.\n2. Draw double-headed arrows connecting CPU to 'Main Memory (RAM)' and 'Input/Output Devices'.\n3. Clarify that Control Unit does NOT execute instructions itself—it fetches, decodes, and issues electrical timing pulses.",
    },
  });

  console.log("Seeding TopicLearnContent with Easy Explanations and Diagrams completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
