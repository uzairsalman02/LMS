"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export interface SerializedLessonBlock {
  id: string;
  order: number;
  type: string;
  content: string;
}

export interface SerializedLesson {
  id: string;
  title: string;
  blocks: SerializedLessonBlock[];
}

export interface SerializedTopicLearnContent {
  id: string;
  definitionEnglish: string;
  definitionUrdu: string;
  rubricKeywords: string[];
  easyExplanationEnglish?: string | null;
  easyExplanationUrdu?: string | null;
  realWorldEnglish: string;
  realWorldUrdu: string;
  realWorldDiagramUrl?: string | null;
  realWorldDiagramTitle?: string | null;
  realWorldDiagramData?: any;
  contentType: string;
  technicalTitle?: string | null;
  diagramUrl?: string | null;
  diagramCaption?: string | null;
  codeSnippet?: string | null;
  codeLanguage?: string | null;
  codeExplanation?: string | null;
  hasInteractive: boolean;
  interactiveTitle?: string | null;
  interactiveType?: string | null;
  interactiveConfig?: any;
  examQuestion: string;
  boardReference?: string | null;
  markingScheme: { criteria: string; marks: number | string }[];
  solutionGuidance: string;
}

export interface SerializedTopic {
  id: string;
  title: string;
  topicNumber: number;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  lessons: SerializedLesson[];
  isCompleted: boolean;
  learnContent?: SerializedTopicLearnContent | null;
}

export interface SerializedChapter {
  id: string;
  chapterNumber: number;
  title: string;
  topics: SerializedTopic[];
}

function getFallbackTopicLearnData(topic: SerializedTopic) {
  const ch = topic.chapterNumber || 1;
  const title = topic.title;

  if (ch === 1) {
    return {
      easyExplanationEnglish: `In simple words: Instead of blindly writing code, Software Engineering teaches you how to plan, build, and test applications step-by-step so they never crash when real people use them.`,
      easyExplanationUrdu: `سادہ الفاظ میں: بغیر سوچے سمجھے کوڈنگ کرنے کے بجائے، سافٹ ویئر انجینئرنگ ہمیں سکھاتی ہے کہ سافٹ ویئر کو ایک مکمل منصوبے، ڈیزائن اور ٹیسٹنگ کے ساتھ کیسے بنایا جائے تاکہ وہ بغیر کسی خرابی کے چلے۔`,
      realWorldDiagramTitle: `Real-World Process Flow: ${title}`,
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Engineering rigor ensures structural stability and zero system crashes",
        steps: [
          { stage: "1. Client Need", analogy: "Gathering client requirements & user stories", icon: "fa-comments", tag: "Analysis" },
          { stage: "2. Blueprint", analogy: "Designing system layout & database schema", icon: "fa-pen-ruler", tag: "Design" },
          { stage: "3. Construction", analogy: "Writing clean, modular source code", icon: "fa-code", tag: "Coding" },
          { stage: "4. Inspection", analogy: "Testing for bugs & usability flaws", icon: "fa-vial-circle-check", tag: "Testing" },
          { stage: "5. Long-term Care", analogy: "Deploying updates & maintenance patches", icon: "fa-wrench", tag: "Support" },
        ],
      },
    };
  }

  if (ch === 2) {
    return {
      easyExplanationEnglish: `In simple words: A computer network is simply two or more computers connected together via cables or Wi-Fi so they can exchange files, share printers, and browse the web seamlessly.`,
      easyExplanationUrdu: `سادہ الفاظ میں: کمپیوٹر نیٹ ورک دو یا دو سے زائد کمپیوٹرز کو کیبلز یا وائی فائی کے ذریعے جوڑتا ہے تاکہ وہ فائلیں، انٹرنیٹ اور پرنٹر باآسانی ایک دوسرے کے ساتھ شیئر کر سکیں۔`,
      realWorldDiagramTitle: `Network Transmission Flow: ${title}`,
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "How digital packets travel across network components",
        steps: [
          { stage: "1. Sender Node", analogy: "Computer generating the data request", icon: "fa-desktop", tag: "Source" },
          { stage: "2. Network Card", analogy: "Converting data to digital pulses (NIC)", icon: "fa-microchip", tag: "Hardware" },
          { stage: "3. Transmission Line", analogy: "Carrying packets over fiber or radio waves", icon: "fa-network-wired", tag: "Medium" },
          { stage: "4. Network Switch", analogy: "Intelligently steering packets to destination", icon: "fa-arrows-split-up-and-left", tag: "Routing" },
          { stage: "5. Receiver Node", analogy: "Displaying requested data to end user", icon: "fa-laptop", tag: "Destination" },
        ],
      },
    };
  }

  if (ch === 3) {
    return {
      easyExplanationEnglish: `In simple words: Data communication is the electronic journey of messages—turning text, voice, or video into electrical signals that travel over physical cables or radio waves to another device.`,
      easyExplanationUrdu: `سادہ الفاظ میں: ڈیٹا کمیونیکیشن پیغامات (ٹیکسٹ، تصویر یا آواز) کو الیکٹرانک سگنلز میں بدل کر ایک جگہ سے دوسری جگہ کیبل یا وائرلیس کے ذریعے منتقل کرنے کا نام ہے۔`,
      realWorldDiagramTitle: `Telecommunication Pipeline: ${title}`,
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "End-to-end signal modulation, transmission, and reception",
        steps: [
          { stage: "1. Message Creator", analogy: "User typing an email or message", icon: "fa-file-lines", tag: "Sender" },
          { stage: "2. Signal Encoder", analogy: "Modem modulating bits into signals", icon: "fa-wave-square", tag: "Encoder" },
          { stage: "3. Communication Channel", analogy: "Fiber optic line or satellite airwaves", icon: "fa-tower-broadcast", tag: "Medium" },
          { stage: "4. Receiver Decoder", analogy: "Demodulating signals back to bits", icon: "fa-inbox", tag: "Decoder" },
          { stage: "5. Message Consumer", analogy: "User reading the delivered text", icon: "fa-check-circle", tag: "Receiver" },
        ],
      },
    };
  }

  if (ch === 5) {
    return {
      easyExplanationEnglish: `In simple words: The CPU is the computer's central brain. It continuously fetches instructions from RAM, figures out what they mean, executes the calculations, and writes back the answer.`,
      easyExplanationUrdu: `سادہ الفاظ میں: سی پی یو (CPU) کمپیوٹر کا دماغ ہے۔ یہ میموری سے ہدایات لے کر سمجھتا ہے، فوری حساب کتاب کرتا ہے، اور نتیجہ واپس محفوظ کرتا ہے۔`,
      realWorldDiagramTitle: `Processor Machine Cycle: ${title}`,
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Coordinating internal registers, control unit, and execution ALU",
        steps: [
          { stage: "1. Fetch Step", analogy: "Grabbing instruction from RAM into register", icon: "fa-arrow-down-up-across-line", tag: "Fetch" },
          { stage: "2. Decode Step", analogy: "Control Unit translates opcode", icon: "fa-brain", tag: "Decode" },
          { stage: "3. Execute Step", analogy: "ALU calculates arithmetic or logic comparison", icon: "fa-calculator", tag: "ALU" },
          { stage: "4. Writeback Step", analogy: "Storing computed result in memory/register", icon: "fa-memory", tag: "Store" },
        ],
      },
    };
  }

  if (ch === 6) {
    return {
      easyExplanationEnglish: `In simple words: Computer security acts like locks, surveillance cameras, and security guards on your digital files so unauthorized people or computer viruses cannot steal or harm your data.`,
      easyExplanationUrdu: `سادہ الفاظ میں: کمپیوٹر سیکیورٹی آپ کے ڈیجیٹل ڈیٹا پر سیکیورٹی گارڈ اور تالے لگانے کی طرح ہے تاکہ ہیکرز اور وائرس اسے نقصان نہ پہنچا سکیں۔`,
      realWorldDiagramTitle: `Multi-Layer Defensive Pipeline: ${title}`,
      realWorldDiagramData: {
        diagramType: "PROCESS_FLOW",
        caption: "Protective layers preventing unauthorized intrusion or virus contagion",
        steps: [
          { stage: "1. Threat Scan", analogy: "Antivirus scanning incoming packets & files", icon: "fa-magnifying-glass", tag: "Scan" },
          { stage: "2. Firewall Guard", analogy: "Blocking unauthorized ports and IP traffic", icon: "fa-shield-halved", tag: "Firewall" },
          { stage: "3. Access Auth", analogy: "Verifying biometrics and strong passwords", icon: "fa-key", tag: "Auth" },
          { stage: "4. Cryptographic Seal", analogy: "Encrypting stored data against theft", icon: "fa-lock", tag: "Encryption" },
        ],
      },
    };
  }

  // Default syllabus fallback
  return {
    easyExplanationEnglish: `In simple words: ${title} gives you the foundational knowledge and practical principles needed to master this curriculum topic for Punjab Board exams and real-world technology.`,
    easyExplanationUrdu: `سادہ الفاظ میں: ${title} بورڈ امتحانات میں اچھے نمبر حاصل کرنے اور کمپیوٹر کے عملی اصول سمجھنے کے لیے ایک کلیدی تدریسی موضوع ہے۔`,
    realWorldDiagramTitle: `Process Flow & Architecture: ${title}`,
    realWorldDiagramData: {
      diagramType: "PROCESS_FLOW",
      caption: "Sequential stages connecting inputs, internal processing, and final outputs",
      steps: [
        { stage: "1. Conceptual Setup", analogy: "Foundational prerequisites and setup parameters", icon: "fa-cube", tag: "Input" },
        { stage: "2. System Execution", analogy: "Internal processing logic and rules applied", icon: "fa-gears", tag: "Process" },
        { stage: "3. Verification", analogy: "Validating against standards and protocols", icon: "fa-check", tag: "Verification" },
        { stage: "4. Practical Result", analogy: "Delivering reliable end outcome in real computing", icon: "fa-circle-check", tag: "Output" },
      ],
    },
  };
}

interface LearnClientProps {
  chapters: SerializedChapter[];
  initialTopicId?: string;
  studentName: string;
}

export function LearnClient({ chapters, initialTopicId, studentName }: LearnClientProps) {
  // Find all topics flattened
  const allTopics: SerializedTopic[] = chapters.flatMap((c) => c.topics);

  // Selected topic
  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    if (initialTopicId && allTopics.some((t) => t.id === initialTopicId)) {
      return initialTopicId;
    }
    return allTopics[0]?.id || "";
  });

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    allTopics.forEach((t) => {
      if (t.isCompleted) set.add(t.id);
    });
    return set;
  });

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Multi-step Interactive Simulation State for Card 4
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimPlaying, setIsSimPlaying] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1500); // 1500ms normal, 800ms fast, 2500ms slow
  const [selectedArchLayer, setSelectedArchLayer] = useState<number>(7); // Card 3 interactive layer details
  const [sdlcStep, setSdlcStep] = useState<number>(0); // For SDLC interactive stepper

  useEffect(() => {
    let timer: any;
    if (isSimPlaying) {
      timer = setInterval(() => {
        setSimStep((prev) => (prev < 11 ? prev + 1 : 0));
      }, simSpeed);
    }
    return () => clearInterval(timer);
  }, [isSimPlaying, simSpeed]);

  // Open units accordion state
  const [openChapters, setOpenChapters] = useState<{ [key: string]: boolean }>(() => {
    const initial: { [key: string]: boolean } = {};
    chapters.forEach((c) => {
      // open the chapter containing the selected topic by default
      const hasSelected = c.topics.some((t) => t.id === selectedTopicId);
      initial[c.id] = hasSelected || c.chapterNumber === 1;
    });
    return initial;
  });

  const currentTopic = allTopics.find((t) => t.id === selectedTopicId) || allTopics[0];
  const isCurrentCompleted = completedTopicIds.has(currentTopic?.id || "");

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCurrentCardIndex(0);
    setIsBookmarked(false);
    setSimStep(0);
    setSdlcStep(0);
    setIsSimPlaying(false);
    // Smooth scroll to top of lesson content
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Build card data for current topic
  const lesson = currentTopic?.lessons?.[0];
  const blocks = lesson?.blocks || [];

  interface CardItem {
    badge: string;
    category: string;
    title: string;
    cardType: "DEFINITION" | "ANALOGY" | "TECHNICAL" | "INTERACTIVE" | "EXAM_QUESTION" | "GENERIC";
    englishText?: string;
    urduText?: string;
    rubricKeywords?: string[];
    easyExplanationEnglish?: string | null;
    easyExplanationUrdu?: string | null;
    calloutText?: string;
    bodyContent?: string;
    realWorldDiagramTitle?: string | null;
    realWorldDiagramUrl?: string | null;
    realWorldDiagramData?: any;
    contentType?: string;
    codeSnippet?: string | null;
    codeLanguage?: string | null;
    codeExplanation?: string | null;
    diagramUrl?: string | null;
    diagramCaption?: string | null;
    interactiveTitle?: string | null;
    interactiveType?: string | null;
    interactiveConfig?: any;
    boardReference?: string | null;
    examQuestion?: string;
    markingScheme?: { criteria: string; marks: number | string }[];
    solutionGuidance?: string;
  }

  const generatedCards: CardItem[] = [];

  // Check if topic has modern 5-card structured content in MySQL
  if (currentTopic?.learnContent) {
    const c = currentTopic.learnContent;
    const total = c.hasInteractive ? 5 : 4;

    // Card 1: Formal Definition & Board Rubrics + Easy Explanation
    generatedCards.push({
      badge: `Card 1 of ${total}`,
      category: "Definition & Board Exam Rubric",
      title: `1. Definition & Core Rubric Keywords`,
      cardType: "DEFINITION",
      englishText: c.definitionEnglish,
      urduText: c.definitionUrdu,
      rubricKeywords: c.rubricKeywords || [],
      easyExplanationEnglish: c.easyExplanationEnglish || "In simple terms: Understand the core objective and what problems this concept solves.",
      easyExplanationUrdu: c.easyExplanationUrdu || "سادہ الفاظ میں: یہ سمجھیں کہ اس تصور کا بنیادی مقصد کیا ہے اور یہ کمپیوٹر سائنس کا کون سا مسئلہ حل کرتا ہے۔",
    });

    // Card 2: Real-World Analogy & Example with Graphical Diagram
    generatedCards.push({
      badge: `Card 2 of ${total}`,
      category: "Real-World Explanation & Analogy",
      title: `2. Real-World Analogy & Practical Example`,
      cardType: "ANALOGY",
      englishText: c.realWorldEnglish,
      urduText: c.realWorldUrdu,
      realWorldDiagramTitle: c.realWorldDiagramTitle || "Real-World Concept Visualization",
      realWorldDiagramUrl: c.realWorldDiagramUrl,
      realWorldDiagramData: c.realWorldDiagramData,
    });

    // Card 3: Technical Diagram OR Code Example
    generatedCards.push({
      badge: `Card 3 of ${total}`,
      category: c.contentType === "CODE" ? "Code Syntax & Syntax Rules" : "Topic Architecture & Diagram",
      title: c.technicalTitle || (c.contentType === "CODE" ? "3. Code Implementation Example" : "3. Technical Architecture & Structure"),
      cardType: "TECHNICAL",
      contentType: c.contentType,
      diagramCaption: c.diagramCaption,
      diagramUrl: c.diagramUrl,
      codeSnippet: c.codeSnippet,
      codeLanguage: c.codeLanguage,
      codeExplanation: c.codeExplanation,
    });

    // Card 4: Animated / Interactive Sandbox (Optional - only if hasInteractive is true)
    if (c.hasInteractive) {
      generatedCards.push({
        badge: `Card 4 of ${total}`,
        category: "Interactive Visualization & Simulation",
        title: c.interactiveTitle || "4. Interactive Simulation Sandbox",
        cardType: "INTERACTIVE",
        interactiveTitle: c.interactiveTitle,
        interactiveType: c.interactiveType,
        interactiveConfig: c.interactiveConfig,
      });
    }

    // Card 5 (or Card 4 if optional interactive is skipped): Board Exam Style Question & How to Solve
    generatedCards.push({
      badge: `Card ${total} of ${total}`,
      category: "Board Exam Style Question & Pattern",
      title: `${total}. Board Exam Style Question & Attempt Strategy`,
      cardType: "EXAM_QUESTION",
      boardReference: c.boardReference || "Punjab Board (BISE) Exam Question",
      examQuestion: c.examQuestion,
      markingScheme: c.markingScheme || [],
      solutionGuidance: c.solutionGuidance,
    });
  } else if (blocks.length > 0) {
    // Topic has legacy LessonBlocks from MySQL: map them gracefully into the 5-card pedagogical format
    const fallbackData = getFallbackTopicLearnData(currentTopic);
    const callout = blocks.find((b) => b.type === "CALLOUT")?.content;
    const codeBlock = blocks.find((b) => b.type === "CODE");
    const textBlocks = blocks.filter((b) => b.type === "TEXT");

    // Card 1: Definition & Rubric + Easy Explanation
    generatedCards.push({
      badge: "Card 1 of 4",
      category: "Definition & Board Exam Rubric",
      title: `1. ${currentTopic.title} — Definition`,
      cardType: "DEFINITION",
      englishText: `${currentTopic.title} is a core theoretical and applied curriculum module in Punjab Board Class 11 Computer Science (Unit ${currentTopic.chapterNumber}).`,
      urduText: `${currentTopic.title} پنجاب بورڈ کمپیوٹر سائنس کلاس 11 کا ایک بنیادی تدریسی باب ہے جس کی مکمل تعریف اور اصول امتحانات کے لیے لازمی ہیں۔`,
      rubricKeywords: ["Technical Definition", "Punjab Board PCTB", "Key Concept", "Core Protocol"],
      easyExplanationEnglish: fallbackData.easyExplanationEnglish,
      easyExplanationUrdu: fallbackData.easyExplanationUrdu,
      calloutText: callout || undefined,
    });

    // Card 2: Real-World Analogy + Graphical Diagram
    generatedCards.push({
      badge: "Card 2 of 4",
      category: "Real-World Explanation & Analogy",
      title: `2. Real-World Practical Example & Context`,
      cardType: "ANALOGY",
      englishText: `In real-world computer systems, ${currentTopic.title} manages structural workflows and ensures data reliability across software environments.`,
      urduText: `عملی کمپیوٹر سسٹمز میں ${currentTopic.title} کا کردار انتہائی اہم ہے تاکہ سسٹم بغیر کسی رکاوٹ کے ڈیٹا پروسیس کر سکے۔`,
      realWorldDiagramTitle: fallbackData.realWorldDiagramTitle,
      realWorldDiagramData: fallbackData.realWorldDiagramData,
    });

    // Card 3: Technical Diagram or Code
    generatedCards.push({
      badge: "Card 3 of 4",
      category: codeBlock ? "Code Example & Syntax" : "Technical Breakdown",
      title: `3. Technical Structure & Principles`,
      cardType: "TECHNICAL",
      contentType: codeBlock ? "CODE" : "DIAGRAM",
      codeSnippet: codeBlock?.content,
      codeLanguage: "cpp",
      diagramCaption: textBlocks[0]?.content || "Detailed structural breakdown for Class 11 examination preparation.",
    });

    // Card 4: Board Exam Question
    generatedCards.push({
      badge: "Card 4 of 4",
      category: "Board Exam Style Question & Pattern",
      title: `4. Board Exam Style Question`,
      cardType: "EXAM_QUESTION",
      boardReference: `BISE Punjab Board (Unit ${currentTopic.chapterNumber})`,
      examQuestion: `Explain the working principle and primary objectives of ${currentTopic.title}. (4 Marks)`,
      markingScheme: [
        { criteria: "Accurate technical definition", marks: 1 },
        { criteria: "Working mechanism and features", marks: 2 },
        { criteria: "Practical real-world application", marks: 1 },
      ],
      solutionGuidance: `Write the answer using clear bullet points with heading 'Definition', followed by 'Key Objectives', and conclude with a neat block diagram.`,
    });
  } else {
    // Topic without explicit blocks yet: provide complete 4-card fallback
    const fallbackData = getFallbackTopicLearnData(currentTopic);
    generatedCards.push(
      {
        badge: "Card 1 of 4",
        category: "Definition & Board Exam Rubric",
        title: `1. ${currentTopic.title} — Definition`,
        cardType: "DEFINITION",
        englishText: `${currentTopic.title} is a fundamental module in ${currentTopic.chapterTitle}. It provides foundational principles required for Board examinations.`,
        urduText: `${currentTopic.title} کا تعارف: یہ کمپیوٹر سائنس کلاس 11 کا ایک بنیادی ٹاپک ہے جو طلبا کو اہم نظریاتی معلومات فراہم کرتا ہے۔`,
        rubricKeywords: ["Definition", "Standard Protocol", "Board Exam Focus", "Key Concept"],
        easyExplanationEnglish: fallbackData.easyExplanationEnglish,
        easyExplanationUrdu: fallbackData.easyExplanationUrdu,
      },
      {
        badge: "Card 2 of 4",
        category: "Real-World Explanation & Analogy",
        title: `2. Real-World Practical Example`,
        cardType: "ANALOGY",
        englishText: `Understand how ${currentTopic.title} is deployed in industry and modern consumer devices.`,
        urduText: `روزمرہ کی مثال: جانے کہ ${currentTopic.title} کس طرح جدید انفارمیشن ٹیکنالوجی انڈسٹری میں کام کرتا ہے۔`,
        realWorldDiagramTitle: fallbackData.realWorldDiagramTitle,
        realWorldDiagramData: fallbackData.realWorldDiagramData,
      },
      {
        badge: "Card 3 of 4",
        category: "Technical Architecture & Diagram",
        title: `3. Technical Principles & Working Details`,
        cardType: "TECHNICAL",
        contentType: "DIAGRAM",
        diagramCaption: `Detailed technical architecture and component interactions of ${currentTopic.title}. Make sure to memorize definitions and structural diagrams for the annual board paper.`,
      },
      {
        badge: "Card 4 of 4",
        category: "Board Exam Style Question & Pattern",
        title: `4. Board Exam Style Question`,
        cardType: "EXAM_QUESTION",
        boardReference: `BISE Annual Examination (4 Marks)`,
        examQuestion: `Write a short note on ${currentTopic.title}. State any two advantages. (4 Marks)`,
        markingScheme: [
          { criteria: "Definition with rubric keywords", marks: 2 },
          { criteria: "Two valid advantages stated clearly", marks: 2 },
        ],
        solutionGuidance: `Structure your answer with: 1. Heading 'Definition' (2-3 lines). 2. Subheading 'Key Advantages' with two concise points.`,
      }
    );
  }

  const currentCard = generatedCards[currentCardIndex] || generatedCards[0];

  const handleMarkComplete = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: currentTopic.id, completed: true, score: 100 }),
      });
      if (res.ok) {
        setCompletedTopicIds((prev) => new Set(prev).add(currentTopic.id));
        setShowCompletionModal(true);
      }
    } catch (err) {
      console.error("Failed to mark topic as complete:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < generatedCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      handleMarkComplete();
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const currentIndex = allTopics.findIndex((t) => t.id === currentTopic.id);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  const handlePrevTopic = () => {
    if (prevTopic) {
      handleSelectTopic(prevTopic.id);
      setOpenChapters((prev) => ({ ...prev, [prevTopic.chapterId]: true }));
    }
  };

  const handleNextTopicNav = () => {
    if (nextTopic) {
      handleSelectTopic(nextTopic.id);
      setOpenChapters((prev) => ({ ...prev, [nextTopic.chapterId]: true }));
    }
  };

  const handleNextTopic = () => {
    setShowCompletionModal(false);
    if (nextTopic) {
      handleSelectTopic(nextTopic.id);
      // Also open next chapter accordion if needed
      setOpenChapters((prev) => ({ ...prev, [nextTopic.chapterId]: true }));
    }
  };

  // Right panel: Real Course Syllabus from MySQL DB
  const rightPanel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h3 className="font-bold text-slate-900 text-sm">Course Syllabus</h3>
        <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
          {chapters.length} Units Available
        </span>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter) => {
          const isOpen = !!openChapters[chapter.id];
          const completedInChapter = chapter.topics.filter((t) => completedTopicIds.has(t.id)).length;
          const isAllCompleted = completedInChapter === chapter.topics.length && chapter.topics.length > 0;
          const hasActiveTopic = chapter.topics.some((t) => t.id === currentTopic.id);

          return (
            <div
              key={chapter.id}
              className={`border rounded-2xl p-3 transition-all ${
                hasActiveTopic
                  ? "border-sky-300 bg-sky-50/30 shadow-2xs"
                  : isAllCompleted
                  ? "border-emerald-200 bg-emerald-50/20"
                  : "border-slate-200/80 bg-slate-50/50"
              }`}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleChapter(chapter.id)}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isAllCompleted
                        ? "bg-emerald-100 text-emerald-600"
                        : hasActiveTopic
                        ? "bg-sky-600 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isAllCompleted ? "✓" : chapter.chapterNumber}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{chapter.title}</h4>
                    <p
                      className={`text-[10px] font-medium ${
                        isAllCompleted ? "text-emerald-600" : hasActiveTopic ? "text-sky-600 font-bold" : "text-slate-500"
                      }`}
                    >
                      {isAllCompleted ? "Completed" : "In Progress"} ({completedInChapter}/{chapter.topics.length} Topics)
                    </p>
                  </div>
                </div>
                <i
                  className={`fa-solid ${
                    isOpen ? "fa-chevron-up text-slate-600" : "fa-chevron-down text-slate-400"
                  } text-xs transition-transform`}
                ></i>
              </div>

              {isOpen && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 space-y-1.5">
                  {chapter.topics.map((t) => {
                    const isCompleted = completedTopicIds.has(t.id);
                    const isSelected = t.id === currentTopic.id;

                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSelectTopic(t.id)}
                        className={`w-full text-left p-2 rounded-xl text-[11px] font-medium transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-sky-600 text-white font-bold shadow-xs"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70"
                            : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/70"
                        }`}
                      >
                        <span className="truncate pr-2">{t.title}</span>
                        {isCompleted && (
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${
                              isSelected ? "bg-white text-sky-600" : "bg-emerald-600 text-white"
                            }`}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Tutor Assistance Card */}
      <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-purple-500/10 border border-purple-100 p-4 rounded-3xl mt-2 shadow-2xs">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs shadow-md">
            <i className="fa-solid fa-robot"></i>
          </div>
          <h4 className="font-bold text-slate-900 text-xs">AI Tutor Assistance</h4>
        </div>
        <p className="text-[11px] text-slate-600 mb-3">
          Struggling with {currentTopic.title}? Ask AI for an intuitive analogy.
        </p>
        <button
          onClick={() => {
            const aiBtn = document.getElementById("ai-tutor-btn");
            if (aiBtn) aiBtn.click();
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
        >
          Ask AI about this topic
        </button>
      </div>
    </div>
  );

  return (
    <StudentShell rightPanel={rightPanel} rightPanelIcon="fa-list-check" rightPanelLabel="Course Syllabus">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6 max-w-4xl mx-auto w-full">
          {/* Breadcrumb & Unit Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-4 sm:p-5 rounded-3xl border border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Class 11</span>
                <span>/</span>
                <span className="text-slate-700">Unit {currentTopic.chapterNumber}</span>
                <span>/</span>
                <span className="text-sky-600 font-bold">Topic {currentTopic.topicNumber}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{currentTopic.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                title="Bookmark this lesson"
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <i className={`fa-${isBookmarked ? "solid" : "regular"} fa-bookmark text-amber-500`}></i>
                <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
              </button>
              <button
                onClick={handleMarkComplete}
                disabled={isSaving}
                title={isCurrentCompleted ? "Topic Completed" : "Mark as Completed"}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : isCurrentCompleted ? (
                  <>
                    <i className="fa-solid fa-check text-[11px]"></i>
                    <span>Completed</span>
                  </>
                ) : (
                  <span>Mark Complete</span>
                )}
              </button>
            </div>
          </div>

          {/* Central Interactive Lesson Card from learn.html */}
          <div className="relative bg-gradient-to-br from-slate-50 via-sky-50/40 to-emerald-50/30 rounded-3xl p-6 sm:p-10 text-slate-800 shadow-xl border border-slate-200/80 min-h-[440px] flex flex-col justify-between">
            {/* Card Header Top */}
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-sky-100 text-sky-700 font-bold text-xs rounded-lg uppercase tracking-wider border border-sky-200">
                  {currentCard.badge}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {currentCard.category}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {generatedCards.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentCardIndex(i)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                      i === currentCardIndex ? "bg-sky-600 scale-125" : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  ></span>
                ))}
              </div>
            </div>

            {/* Card Main Dynamic Content - Rendered by Pedagogical Card Type */}
            <div className="py-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{currentCard.title}</h2>
                {currentCard.cardType === "TECHNICAL" && currentCard.codeSnippet && (
                  <button
                    onClick={() => {
                      if (typeof navigator !== "undefined" && currentCard.codeSnippet) {
                        navigator.clipboard.writeText(currentCard.codeSnippet);
                        alert("Code copied to clipboard!");
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <i className="fa-regular fa-copy text-[11px]"></i>
                    <span>Copy Code</span>
                  </button>
                )}
              </div>

              {currentCard.calloutText && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 leading-relaxed font-medium">
                  {currentCard.calloutText}
                </div>
              )}

              {/* CARD TYPE 1: DEFINITION & EXAM RUBRICS & EASY EXPLANATION */}
              {currentCard.cardType === "DEFINITION" && (
                <div className="space-y-5">
                  {/* Section 1: Academic Definition */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      <span>Formal Academic Definitions (امتحانی و نصابی تعریف)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-[10px] uppercase tracking-wider text-sky-700 font-bold flex items-center space-x-1.5">
                            <i className="fa-solid fa-book text-sky-500"></i>
                            <span>English Definition</span>
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                            Curriculum Standard
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                          {currentCard.englishText}
                        </p>
                      </div>

                      {currentCard.urduText && (
                        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2" dir="rtl">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                            <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold flex items-center space-x-1.5">
                              <i className="fa-solid fa-feather-pointed text-emerald-500"></i>
                              <span>اردو تعریف</span>
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-sans">
                              نصابی معیار
                            </span>
                          </div>
                          <p className="font-nastaleeq text-base sm:text-lg text-slate-900 leading-loose">
                            {currentCard.urduText}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2: Prominent Easy Explanation / In Simple Words Box */}
                  <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50/95 via-sky-50/90 to-emerald-50/80 border-2 border-sky-300 shadow-md space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sky-200/80 gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs">
                          <i className="fa-solid fa-lightbulb"></i>
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-wide uppercase">
                            Concept in Simple Words (سادہ اور آسان فہم وضاحت)
                          </h4>
                          <span className="text-[10px] text-slate-600 font-medium">
                            روزمرہ زبان میں سمجھیے — Core idea explained without difficult jargon
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto flex items-center space-x-1">
                        <i className="fa-solid fa-check text-[9px]"></i>
                        <span>Easy to Understand</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* English Easy Explanation */}
                      <div className="bg-white/95 p-4 rounded-2xl border border-sky-100 shadow-xs space-y-2">
                        <span className="text-[10px] uppercase tracking-wider text-sky-800 font-bold block flex items-center space-x-1.5 pb-1 border-b border-slate-100">
                          <i className="fa-solid fa-language text-sky-600"></i>
                          <span>Plain English Explanation</span>
                        </span>
                        <p className="text-xs sm:text-[13px] leading-relaxed text-slate-800 font-medium">
                          {currentCard.easyExplanationEnglish ||
                            `In simple terms: ${currentTopic.title} provides the foundational rules and concepts required to build reliable systems and score high marks in board exams.`}
                        </p>
                      </div>

                      {/* Urdu Easy Explanation */}
                      <div className="bg-white/95 p-4 rounded-2xl border border-sky-100 shadow-xs space-y-2" dir="rtl">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold block flex items-center space-x-1.5 pb-1 border-b border-slate-100 font-sans">
                          <i className="fa-solid fa-book-open text-emerald-600"></i>
                          <span>سادہ اردو وضاحت (عام فہم)</span>
                        </span>
                        <p className="font-nastaleeq text-base sm:text-lg leading-loose text-slate-900">
                          {currentCard.easyExplanationUrdu ||
                            `سادہ الفاظ میں: ${currentTopic.title} کا بنیادی مقصد یہ ہے کہ آپ کو کمپیوٹر کے بنیادی اصول آسانی سے سمجھ آ جائیں تاکہ بورڈ امتحان میں آپ بہترین جواب لکھ سکیں۔`}
                        </p>
                      </div>
                    </div>

                    {/* Key Takeaway Banner */}
                    <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80 flex items-center space-x-2.5 text-xs text-slate-800">
                      <span className="w-5 h-5 rounded-md bg-amber-400 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        📌
                      </span>
                      <span className="font-medium text-[11px] sm:text-xs">
                        <strong>Quick Takeaway:</strong> Memorize the definition keywords first, then visualize how the components work together in real-world computer systems.
                      </span>
                    </div>
                  </div>

                  {/* Section 3: Board Exam Rubric Keywords */}
                  {currentCard.rubricKeywords && currentCard.rubricKeywords.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/70 space-y-2">
                      <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                        <i className="fa-solid fa-key text-amber-500"></i>
                        <span>Board Exam Rubric Keywords (پاسٹ پیپر کی ورڈز)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentCard.rubricKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-sky-200 text-sky-800 rounded-full text-xs font-semibold shadow-2xs hover:bg-sky-50 transition"
                          >
                            <i className="fa-solid fa-check text-[9px] text-sky-500"></i>
                            <span>{kw}</span>
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 italic">
                        Punjab Board examiners look for exact technical keywords during paper checking. Make sure these terms appear in your answer.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* CARD TYPE 2: REAL-WORLD ANALOGY & GRAPHICAL DIAGRAM */}
              {currentCard.cardType === "ANALOGY" && (
                <div className="space-y-5">
                  {/* Analogy Text Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-sky-700 font-bold block flex items-center space-x-1.5 pb-1 border-b border-slate-100">
                        <i className="fa-solid fa-earth-americas text-sky-500"></i>
                        <span>Real-World Analogy & Context</span>
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                        {currentCard.englishText}
                      </p>
                    </div>

                    {currentCard.urduText && (
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2" dir="rtl">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold block flex items-center space-x-1.5 pb-1 border-b border-slate-100 font-sans">
                          <i className="fa-solid fa-landmark text-emerald-500"></i>
                          <span>روزمرہ کی مثال (اردو تشریح)</span>
                        </span>
                        <p className="font-nastaleeq text-base sm:text-lg text-slate-900 leading-loose">
                          {currentCard.urduText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AUTHENTIC GRAPHICAL CONCEPT DIAGRAM BANNER */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                          <i className="fa-solid fa-diagram-project"></i>
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold tracking-wide text-slate-900 uppercase">
                            {currentCard.realWorldDiagramTitle || "Real-World Visual Concept Diagram"}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            تصویری خاکہ — Graphical visual mapping to computer science concepts
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 self-start sm:self-auto">
                        Visual Analogy Map
                      </span>
                    </div>

                    {/* DYNAMIC VISUAL GRAPHICAL DIAGRAM BASED ON TOPIC */}
                    {currentTopic.id === "top-11-02-03" || currentTopic.chapterNumber === 2 || currentTopic.chapterNumber === 3 || currentCard.title.includes("OSI") || currentCard.title.includes("Network") ? (
                      /* Postal Courier vs Network Packet Journey Diagram */
                      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                        <div className="text-[11px] text-slate-600 font-medium flex items-center justify-between border-b border-slate-200/80 pb-2">
                          <span className="flex items-center space-x-1.5">
                            <i className="fa-solid fa-route text-sky-600"></i>
                            <span className="font-semibold text-slate-800">End-to-End Pipeline: Sender Post Office ➔ Highway ➔ Receiver Mailbox</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono font-bold">● Wire Active</span>
                        </div>

                        {/* Interactive Flow Nodes */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-center">
                          <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-2xs hover:border-purple-400 hover:shadow-xs transition flex flex-col items-center justify-between space-y-1.5">
                            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-base">
                              ✍️
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 block">1. Write Letter</span>
                            <span className="text-[9px] text-purple-700 font-mono font-semibold">App Layer (Data)</span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-teal-200 shadow-2xs hover:border-teal-400 hover:shadow-xs transition flex flex-col items-center justify-between space-y-1.5">
                            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-base">
                              ✉️
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 block">2. Seal Envelope</span>
                            <span className="text-[9px] text-teal-700 font-mono font-semibold">Transport (Port)</span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs hover:border-amber-400 hover:shadow-xs transition flex flex-col items-center justify-between space-y-1.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base">
                              🏷️
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 block">3. Address Stamp</span>
                            <span className="text-[9px] text-amber-700 font-mono font-semibold">Network (IP)</span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-orange-200 shadow-2xs hover:border-orange-400 hover:shadow-xs transition flex flex-col items-center justify-between space-y-1.5">
                            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-base">
                              🚚
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 block">4. Delivery Van</span>
                            <span className="text-[9px] text-orange-700 font-mono font-semibold">Data Link (MAC)</span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-2xs hover:border-rose-400 hover:shadow-xs transition flex flex-col items-center justify-between space-y-1.5">
                            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-base">
                              🛣️
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 block">5. Highway Cables</span>
                            <span className="text-[9px] text-rose-700 font-mono font-semibold">Physical (Voltages)</span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition flex flex-col items-center justify-between space-y-1.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base">
                              📬
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 block">6. Recipient Reads</span>
                            <span className="text-[9px] text-emerald-700 font-mono font-semibold">Decapsulation</span>
                          </div>
                        </div>

                        {/* Connection Indicator */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                          <span className="flex items-center space-x-2 text-slate-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            <span><strong>Encapsulation Concept:</strong> Sender packages data in envelopes ➔ Carrier delivers ➔ Receiver unwraps step-by-step</span>
                          </span>
                          <span className="text-sky-700 font-mono text-[10px] font-bold bg-sky-50 px-2 py-0.5 rounded">
                            Host A ──[Transmission Medium]──➔ Host B
                          </span>
                        </div>
                      </div>
                    ) : currentTopic.chapterNumber === 1 || currentTopic.id === "top-11-01-01" ? (
                      /* Software Engineering Skyscraper vs Mud Shack Graphic */
                      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Casual Scripting */}
                          <div className="bg-rose-50/80 p-4 rounded-xl border border-rose-200 space-y-2 shadow-2xs">
                            <div className="flex items-center justify-between pb-1 border-b border-rose-100">
                              <span className="text-xs font-bold text-rose-900 flex items-center space-x-1.5">
                                <span>🛖</span>
                                <span>Hobby Script (Unplanned Mud Shack)</span>
                              </span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">High Crash Risk</span>
                            </div>
                            <p className="text-[11px] text-slate-700 leading-relaxed">
                              Anyone can write quick code with no plan. But when 10,000 users visit, cracks appear, data corrupts, and the whole system crashes.
                            </p>
                          </div>

                          {/* Software Engineering */}
                          <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 space-y-2 shadow-2xs">
                            <div className="flex items-center justify-between pb-1 border-b border-emerald-100">
                              <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                                <span>🏢</span>
                                <span>Software Engineering (50-Story Skyscraper)</span>
                              </span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Enterprise Grade</span>
                            </div>
                            <p className="text-[11px] text-slate-700 leading-relaxed">
                              Soil testing (Feasibility), structural blueprints (SRS & Architecture), steel frames (Clean Code & Database), and safety tests ensure 99.99% uptime.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Generic Factory Graphic */
                      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 text-center">
                        <div className="text-2xl">🏭 ➔ 📦 ➔ 🚚 ➔ 🏢</div>
                        <p className="text-xs text-slate-600 font-medium">
                          Automated industrial production cycle directly mirroring computer processing workflows.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Flow Steps with Connecting Arrows */}
                  {currentCard.realWorldDiagramData?.steps && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">
                          Step-by-Step Analogy to Computer Science Mapping
                        </span>
                        {currentCard.realWorldDiagramData.caption && (
                          <span className="text-[11px] text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full font-medium">
                            {currentCard.realWorldDiagramData.caption}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 pt-1 overflow-x-auto pb-1">
                        {currentCard.realWorldDiagramData.steps.map((st: any, idx: number, arr: any[]) => (
                          <React.Fragment key={idx}>
                            <div className="flex-1 min-w-[130px] bg-slate-50/90 hover:bg-sky-50/60 p-3.5 rounded-2xl border border-slate-200/80 transition-all flex flex-col justify-between space-y-2.5 group shadow-2xs">
                              <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-xl bg-white text-sky-600 border border-slate-200/90 flex items-center justify-center text-xs shadow-xs group-hover:bg-sky-600 group-hover:text-white transition">
                                  <i className={`fa-solid ${st.icon || "fa-check"}`}></i>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-[10px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                                  {st.tag && (
                                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-700">
                                      {st.tag}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-900 block leading-tight">{st.stage}</span>
                                <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 text-[11px] text-slate-600 leading-snug font-medium flex items-start space-x-1.5">
                                  <i className="fa-solid fa-arrows-split-up-and-left text-[9px] text-amber-500 mt-0.5 shrink-0"></i>
                                  <span>{st.analogy}</span>
                                </div>
                              </div>
                            </div>

                            {idx < arr.length - 1 && (
                              <div className="hidden md:flex items-center justify-center text-slate-300 px-0.5 shrink-0">
                                <i className="fa-solid fa-arrow-right text-xs"></i>
                              </div>
                            )}
                            {idx < arr.length - 1 && (
                              <div className="flex md:hidden items-center justify-center text-slate-300 py-0.5 shrink-0">
                                <i className="fa-solid fa-arrow-down text-xs"></i>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 gap-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                          <span><strong>Everyday Analogy:</strong> Intuitive real-life concept</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-sky-500"></span>
                          <span><strong>Technical Architecture:</strong> Computer Science mapping</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentCard.realWorldDiagramUrl && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                      <img
                        src={currentCard.realWorldDiagramUrl}
                        alt={currentCard.realWorldDiagramTitle || "Real-World Diagram"}
                        className="max-h-60 mx-auto rounded-xl object-contain"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* CARD TYPE 3: TECHNICAL ARCHITECTURE & VISUAL DIAGRAM */}
              {currentCard.cardType === "TECHNICAL" && (
                <div className="space-y-5">
                  {currentCard.contentType === "CODE" && currentCard.codeSnippet ? (
                    <div className="space-y-3">
                      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner leading-relaxed">
                        <pre>{currentCard.codeSnippet}</pre>
                      </div>
                      {currentCard.codeExplanation && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed shadow-sm">
                          <strong className="text-slate-900 block mb-1">Code Explanation & Syntax Notes:</strong>
                          <p>{currentCard.codeExplanation}</p>
                        </div>
                      )}
                    </div>
                  ) : currentTopic.id === "top-11-02-03" || currentCard.title.includes("OSI") ? (
                    /* DEDICATED TWO-HOST PEER-TO-PEER 7-LAYER OSI ARCHITECTURE DIAGRAM */
                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs shadow-xs">
                            <i className="fa-solid fa-layer-group"></i>
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              ISO/IEC 7498-1 Two-Host Peer-to-Peer Architecture
                            </h4>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              Click any layer to view technical specifications and board exam points
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">Layers 7-5: Software</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">Layer 4: Heart of OSI</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">Layers 3-1: Hardware</span>
                        </div>
                      </div>

                      {/* Memory Mnemonic Aid */}
                      <div className="p-3 bg-gradient-to-r from-amber-50 to-sky-50 rounded-xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <span className="font-bold text-amber-900 flex items-center space-x-1.5">
                          <i className="fa-solid fa-brain text-amber-600"></i>
                          <span>Exam Mnemonic (Top ➔ Bottom):</span>
                        </span>
                        <span className="font-mono text-slate-800 text-[11px] sm:text-xs">
                          <strong>A</strong>ll <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>rocessing
                        </span>
                      </div>

                      {/* Visual Two-Host Architecture Arena */}
                      <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-stretch pt-2">
                        {/* Host A (Sender Node) */}
                        <div className="md:col-span-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                            <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                              <i className="fa-solid fa-desktop text-sky-600"></i>
                              <span>Host A (Sender PC)</span>
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                              ⬇ Encapsulation
                            </span>
                          </div>

                          <div className="space-y-1">
                            {[
                              { num: 7, name: "Application", pdu: "Data", bg: "bg-purple-100/80 border-purple-300 text-purple-900" },
                              { num: 6, name: "Presentation", pdu: "Data", bg: "bg-indigo-100/80 border-indigo-300 text-indigo-900" },
                              { num: 5, name: "Session", pdu: "Data", bg: "bg-sky-100/80 border-sky-300 text-sky-900" },
                              { num: 4, name: "Transport", pdu: "Segment", bg: "bg-teal-100/80 border-teal-300 text-teal-900" },
                              { num: 3, name: "Network", pdu: "Packet", bg: "bg-amber-100/80 border-amber-300 text-amber-900" },
                              { num: 2, name: "Data Link", pdu: "Frame", bg: "bg-orange-100/80 border-orange-300 text-orange-900" },
                              { num: 1, name: "Physical", pdu: "Bits", bg: "bg-rose-100/80 border-rose-300 text-rose-900" },
                            ].map((l) => (
                              <div
                                key={l.num}
                                onClick={() => setSelectedArchLayer(l.num)}
                                className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                                  selectedArchLayer === l.num
                                    ? "ring-2 ring-sky-500 shadow-xs font-bold"
                                    : "hover:bg-white"
                                } ${l.bg}`}
                              >
                                <span className="font-bold">L{l.num}: {l.name}</span>
                                <span className="text-[10px] font-mono opacity-80">{l.pdu}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Middle Virtual Protocol Channels & Physical Line */}
                        <div className="md:col-span-3 flex flex-col justify-between py-2 text-center text-[10px] font-mono text-slate-500 space-y-1">
                          <div className="border-t border-dashed border-purple-300 py-1.5 text-purple-700">⟷ HTTP / DNS ⟷</div>
                          <div className="border-t border-dashed border-indigo-300 py-1.5 text-indigo-700">⟷ SSL / TLS ⟷</div>
                          <div className="border-t border-dashed border-sky-300 py-1.5 text-sky-700">⟷ Sockets ⟷</div>
                          <div className="border-t border-dashed border-teal-300 py-1.5 text-teal-700">⟷ TCP / UDP ⟷</div>
                          <div className="border-t border-dashed border-amber-300 py-1.5 text-amber-700">⟷ IPv4 / IPv6 ⟷</div>
                          <div className="border-t border-dashed border-orange-300 py-1.5 text-orange-700">⟷ Ethernet ⟷</div>
                          <div className="bg-slate-900 text-emerald-400 py-2 rounded-xl font-bold border border-emerald-500/50 animate-pulse">
                            ════ Cables (0101) ════
                          </div>
                        </div>

                        {/* Host B (Receiver Node) */}
                        <div className="md:col-span-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                            <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                              <i className="fa-solid fa-server text-emerald-600"></i>
                              <span>Host B (Web Server)</span>
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              ⬆ Decapsulation
                            </span>
                          </div>

                          <div className="space-y-1">
                            {[
                              { num: 7, name: "Application", pdu: "Data", bg: "bg-purple-100/80 border-purple-300 text-purple-900" },
                              { num: 6, name: "Presentation", pdu: "Data", bg: "bg-indigo-100/80 border-indigo-300 text-indigo-900" },
                              { num: 5, name: "Session", pdu: "Data", bg: "bg-sky-100/80 border-sky-300 text-sky-900" },
                              { num: 4, name: "Transport", pdu: "Segment", bg: "bg-teal-100/80 border-teal-300 text-teal-900" },
                              { num: 3, name: "Network", pdu: "Packet", bg: "bg-amber-100/80 border-amber-300 text-amber-900" },
                              { num: 2, name: "Data Link", pdu: "Frame", bg: "bg-orange-100/80 border-orange-300 text-orange-900" },
                              { num: 1, name: "Physical", pdu: "Bits", bg: "bg-rose-100/80 border-rose-300 text-rose-900" },
                            ].map((l) => (
                              <div
                                key={l.num}
                                onClick={() => setSelectedArchLayer(l.num)}
                                className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                                  selectedArchLayer === l.num
                                    ? "ring-2 ring-emerald-500 shadow-xs font-bold"
                                    : "hover:bg-white"
                                } ${l.bg}`}
                              >
                                <span className="font-bold">L{l.num}: {l.name}</span>
                                <span className="text-[10px] font-mono opacity-80">{l.pdu}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Layer Detail Inspector Box */}
                      <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-amber-400 flex items-center space-x-2">
                            <i className="fa-solid fa-circle-info"></i>
                            <span>
                              Layer {selectedArchLayer} Details & Specifications
                            </span>
                          </span>
                          <span className="text-[10px] font-mono bg-slate-800 px-2.5 py-0.5 rounded text-slate-300">
                            {selectedArchLayer >= 5 ? "Software Layer (Operating System/App)" : selectedArchLayer === 4 ? "Heart of OSI (End-to-End)" : "Hardware Layer (Physical / Cable)"}
                          </span>
                        </div>

                        {selectedArchLayer === 7 && (
                          <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                            <strong className="text-white block">Layer 7: Application Layer (PDU: Data)</strong>
                            <p>Direct interface for end-user network applications. Manages web browsing, email transmission, file transfers, and domain name lookups.</p>
                            <span className="text-purple-300 font-mono text-[11px] block">Key Protocols: HTTP, HTTPS, FTP, SMTP, DNS, Telnet</span>
                          </div>
                        )}
                        {selectedArchLayer === 6 && (
                          <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                            <strong className="text-white block">Layer 6: Presentation Layer (PDU: Data)</strong>
                            <p>Translates data formats (ASCII, Unicode), manages file compression (ZIP, JPEG), and encrypts/decrypts network traffic with SSL/TLS.</p>
                            <span className="text-indigo-300 font-mono text-[11px] block">Key Standards: SSL/TLS, ASCII, EBCDIC, JPEG, MPEG</span>
                          </div>
                        )}
                        {selectedArchLayer === 5 && (
                          <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                            <strong className="text-white block">Layer 5: Session Layer (PDU: Data)</strong>
                            <p>Establishes, maintains, coordinates, and terminates communication sessions between software processes. Handles dialog control and token management.</p>
                            <span className="text-sky-300 font-mono text-[11px] block">Key Protocols: NetBIOS, RPC, Sockets, PPTP</span>
                          </div>
                        )}
                        {selectedArchLayer === 4 && (
                          <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                            <strong className="text-white block">Layer 4: Transport Layer (PDU: Segment) — Heart of OSI</strong>
                            <p>Provides reliable end-to-end data delivery, segmentation of raw streams, error detection, flow control, and port addressing (TCP 80, 443).</p>
                            <span className="text-teal-300 font-mono text-[11px] block">Key Protocols: TCP (Transmission Control Protocol), UDP (User Datagram Protocol)</span>
                          </div>
                        )}
                        {selectedArchLayer === 3 && (
                          <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                            <strong className="text-white block">Layer 3: Network Layer (PDU: Packet)</strong>
                            <p>Handles logical addressing (IP addresses) and routes packets across multiple interconnected networks via routers.</p>
                            <span className="text-amber-300 font-mono text-[11px] block">Key Protocols & Devices: IPv4, IPv6, ICMP, ARP, Routers</span>
                          </div>
                        )}
                        {selectedArchLayer === 2 && (
                          <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                            <strong className="text-white block">Layer 2: Data Link Layer (PDU: Frame)</strong>
                            <p>Provides node-to-node data transfer across local network segments. Handles MAC physical addressing, frame creation, and error checking with CRC.</p>
                            <span className="text-orange-300 font-mono text-[11px] block">Key Standards & Devices: Ethernet (802.3), Wi-Fi (802.11), MAC Address, Switches, Bridges</span>
                          </div>
                        )}
                        {selectedArchLayer === 1 && (
                          <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                            <strong className="text-white block">Layer 1: Physical Layer (PDU: Raw Bits - 0/1)</strong>
                            <p>Transmits unstructured raw digital bit streams over physical transmission media (cables, radio waves, light pulses) with specific voltage standards.</p>
                            <span className="text-rose-300 font-mono text-[11px] block">Key Media: Twisted Pair (UTP), Fiber Optics, Coaxial, Hubs, Repeaters</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : currentTopic.chapterNumber === 1 || currentTopic.id === "top-11-01-01" ? (
                    /* DEDICATED COMPUTER SOFTWARE ARCHITECTURE HIERARCHY TREE */
                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs shadow-xs">
                          <i className="fa-solid fa-sitemap"></i>
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            Computer Software Classification & Architecture Hierarchy
                          </h4>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            PCTB Punjab Board Core Exam Topic: System vs Application Software
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        {/* Root Node */}
                        <div className="w-full max-w-sm mx-auto bg-slate-900 text-white p-3 rounded-xl text-center shadow-md">
                          <span className="text-xs font-bold block">💻 Computer Software (ہدایات کا مجموعہ)</span>
                          <span className="text-[10px] text-slate-300">Set of programs that instruct hardware what to do</span>
                        </div>

                        {/* Branching Lines */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          {/* System Software Branch */}
                          <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-300 space-y-2">
                            <div className="flex items-center justify-between pb-1 border-b border-sky-200">
                              <span className="text-xs font-bold text-sky-900">1. System Software</span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-sky-200 text-sky-800">Hardware Level</span>
                            </div>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              Directly manages and controls computer hardware and provides platform for application software.
                            </p>
                            <div className="space-y-1 pt-1 text-[10px]">
                              <div className="bg-white p-1.5 rounded-lg border border-sky-200 text-sky-900 font-semibold">
                                • Operating Systems (Windows, Linux, macOS)
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-sky-200 text-sky-900 font-semibold">
                                • Device Drivers (Printer, Graphics, Sound)
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-sky-200 text-sky-900 font-semibold">
                                • Utility Programs (Antivirus, Disk Defrag)
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-sky-200 text-sky-900 font-semibold">
                                • Language Translators (Compiler, Interpreter)
                              </div>
                            </div>
                          </div>

                          {/* Application Software Branch */}
                          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-300 space-y-2">
                            <div className="flex items-center justify-between pb-1 border-b border-emerald-200">
                              <span className="text-xs font-bold text-emerald-900">2. Application Software</span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">User Level</span>
                            </div>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              Designed to solve specific end-user problems and help users perform productive tasks.
                            </p>
                            <div className="space-y-1 pt-1 text-[10px]">
                              <div className="bg-white p-1.5 rounded-lg border border-emerald-200 text-emerald-900 font-semibold">
                                • Customized Software (Banking, Hospital ERPs)
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-emerald-200 text-emerald-900 font-semibold">
                                • Word Processors (MS Word, InPage Urdu)
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-emerald-200 text-emerald-900 font-semibold">
                                • Spreadsheets & Databases (MS Excel, Access)
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-emerald-200 text-emerald-900 font-semibold">
                                • Web Browsers (Chrome, Edge, Firefox)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : currentTopic.chapterNumber === 5 || currentTopic.id === "top-11-05-01" ? (
                    /* DEDICATED VON NEUMANN COMPUTER ARCHITECTURE BLOCK DIAGRAM */
                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs">
                          <i className="fa-solid fa-microchip"></i>
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            Von Neumann Computer Architecture Block Diagram
                          </h4>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            Central Processing Unit, System Bus, Memory and I/O Interconnections
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
                        {/* CPU Box */}
                        <div className="p-4 rounded-xl bg-slate-800/90 border-2 border-amber-400 space-y-3">
                          <span className="text-xs font-bold text-amber-400 block text-center uppercase tracking-wider">
                            Central Processing Unit (CPU)
                          </span>
                          <div className="grid grid-cols-2 gap-3 text-center text-xs">
                            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                              <span className="font-bold text-sky-400 block">Control Unit (CU)</span>
                              <span className="text-[10px] text-slate-300">Supervisor: Fetches & decodes opcodes</span>
                            </div>
                            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                              <span className="font-bold text-emerald-400 block">ALU (Arithmetic & Logic)</span>
                              <span className="text-[10px] text-slate-300">Performs math (+,-,*) & logic comparisons</span>
                            </div>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-center text-[10px] text-amber-200 font-mono">
                            Registers: PC (Program Counter) • MAR • MDR • IR • Accumulator (AC)
                          </div>
                        </div>

                        {/* System Bus Channels */}
                        <div className="space-y-1.5 text-center text-[11px] font-mono">
                          <div className="bg-amber-950/70 text-amber-300 p-1.5 rounded-lg border border-amber-700/60">
                            Unidirectional ➔ Address Bus (Memory Addresses)
                          </div>
                          <div className="bg-sky-950/70 text-sky-300 p-1.5 rounded-lg border border-sky-700/60">
                            Bidirectional ⇄ Data Bus (Carries data and program instructions)
                          </div>
                          <div className="bg-teal-950/70 text-teal-300 p-1.5 rounded-lg border border-teal-700/60">
                            Bidirectional ⇄ Control Bus (Timing signals, read/write pulses)
                          </div>
                        </div>

                        {/* Memory & I/O Box */}
                        <div className="grid grid-cols-2 gap-3 text-center text-xs">
                          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                            <span className="font-bold text-purple-300 block">Main Memory (RAM/ROM)</span>
                            <span className="text-[10px] text-slate-400">Holds instructions & active data together</span>
                          </div>
                          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                            <span className="font-bold text-rose-300 block">Input / Output Subsystems</span>
                            <span className="text-[10px] text-slate-400">Keyboard, Monitor, Storage, Sensors</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Default Visual Architecture Diagram */
                    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                      <div className="flex items-center space-x-2 text-sky-700 text-xs font-bold">
                        <i className="fa-solid fa-diagram-project"></i>
                        <span>Technical Architecture & Structural Overview</span>
                      </div>
                      {currentCard.diagramCaption && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                          {currentCard.diagramCaption}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CARD TYPE 4: ANIMATED / INTERACTIVE SANDBOX */}
              {currentCard.cardType === "INTERACTIVE" && (
                <div className="space-y-5">
                  {/* REAL LIVE TWO-HOST PACKET TRANSMISSION SIMULATOR */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                    {/* Header with Live Status & Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                            Live Interactive Encapsulation & Transmission Sandbox
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Follow data as it wraps headers down Host A, travels across the physical cable, and unwraps at Host B.
                        </p>
                      </div>

                      {/* Interactive Controls Bar */}
                      <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
                        {/* Auto Play / Pause */}
                        <button
                          onClick={() => setIsSimPlaying(!isSimPlaying)}
                          className={`px-3 py-1.5 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer ${
                            isSimPlaying ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
                          }`}
                        >
                          <i className={`fa-solid ${isSimPlaying ? "fa-pause" : "fa-play"} text-[10px]`}></i>
                          <span>{isSimPlaying ? "Pause" : "Auto Play"}</span>
                        </button>

                        {/* Step Back */}
                        <button
                          onClick={() => {
                            setIsSimPlaying(false);
                            setSimStep((prev) => (prev > 0 ? prev - 1 : 11));
                          }}
                          title="Previous Step"
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          <i className="fa-solid fa-backward-step"></i>
                        </button>

                        {/* Step Next */}
                        <button
                          onClick={() => {
                            setIsSimPlaying(false);
                            setSimStep((prev) => (prev < 11 ? prev + 1 : 0));
                          }}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                        >
                          <i className="fa-solid fa-forward-step text-[10px]"></i>
                          <span>Step Forward</span>
                        </button>

                        {/* Reset */}
                        <button
                          onClick={() => {
                            setSimStep(0);
                            setIsSimPlaying(false);
                          }}
                          title="Reset Simulator"
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          <i className="fa-solid fa-rotate-right"></i>
                        </button>

                        {/* Speed Toggle */}
                        <button
                          onClick={() => {
                            setSimSpeed((prev) => (prev === 1500 ? 800 : prev === 800 ? 2500 : 1500));
                          }}
                          title="Toggle Simulation Speed"
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold rounded-xl transition cursor-pointer"
                        >
                          {simSpeed === 1500 ? "1x" : simSpeed === 800 ? "2x Fast" : "0.5x"}
                        </button>
                      </div>
                    </div>

                    {/* TWO-HOST ARENA: Host A (Sender) ➔ Cable ➔ Host B (Receiver) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-slate-50/90 p-4 rounded-2xl border border-slate-200">
                      {/* Left: Host A Sender Stack */}
                      <div className="md:col-span-4 bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-[11px] font-bold text-slate-800">
                          <span className="flex items-center space-x-1">
                            <i className="fa-solid fa-desktop text-sky-600"></i>
                            <span>Sender Node (Host A)</span>
                          </span>
                          <span className="text-[9px] font-bold text-sky-700">⬇ Encapsulating</span>
                        </div>

                        {[
                          { stepMatch: 0, num: 7, name: "Application Layer", tag: "HTTP", bg: "bg-purple-50 text-purple-900 border-purple-200" },
                          { stepMatch: 1, num: 6, name: "Presentation Layer", tag: "SSL", bg: "bg-indigo-50 text-indigo-900 border-indigo-200" },
                          { stepMatch: 2, num: 5, name: "Session Layer", tag: "Ports", bg: "bg-sky-50 text-sky-900 border-sky-200" },
                          { stepMatch: 3, num: 4, name: "Transport Layer", tag: "TCP", bg: "bg-teal-50 text-teal-900 border-teal-200" },
                          { stepMatch: 4, num: 3, name: "Network Layer", tag: "IP", bg: "bg-amber-50 text-amber-900 border-amber-200" },
                          { stepMatch: 5, num: 2, name: "Data Link Layer", tag: "MAC", bg: "bg-orange-50 text-orange-900 border-orange-200" },
                          { stepMatch: 6, num: 1, name: "Physical Layer", tag: "0101", bg: "bg-rose-50 text-rose-900 border-rose-200" },
                        ].map((l) => {
                          const isCurrent = simStep === l.stepMatch;
                          const isPast = simStep > l.stepMatch;
                          return (
                            <div
                              key={l.num}
                              onClick={() => {
                                setIsSimPlaying(false);
                                setSimStep(l.stepMatch);
                              }}
                              className={`p-1.5 px-2 rounded-lg border text-[10px] flex items-center justify-between transition cursor-pointer ${
                                isCurrent
                                  ? "ring-2 ring-amber-500 bg-amber-100 font-bold scale-[1.02] shadow-xs"
                                  : isPast
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 opacity-90"
                                  : l.bg
                              }`}
                            >
                              <span className="flex items-center space-x-1.5">
                                <span className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                                  isCurrent ? "bg-amber-500 text-white" : isPast ? "bg-emerald-600 text-white" : "bg-white text-slate-600"
                                }`}>
                                  {isPast ? "✓" : l.num}
                                </span>
                                <span>{l.name}</span>
                              </span>
                              <span className="font-mono text-[9px] font-bold">{l.tag}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Center: Network Cable & Live Transit Animation */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-3 text-center space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Physical Transmission Medium
                        </span>

                        {/* Moving Packet Graphic */}
                        <div className="w-full bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Host A</span>
                            <span className="text-amber-400 font-bold">Router Hub</span>
                            <span>Host B</span>
                          </div>

                          {/* Progress Line */}
                          <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-500 via-amber-400 to-emerald-500 transition-all duration-300"
                              style={{ width: `${Math.min(100, Math.round(((simStep + 1) / 12) * 100))}%` }}
                            ></div>
                          </div>

                          {/* Live Transit Bitstream */}
                          <div className={`p-2 rounded-lg text-[10px] font-mono transition ${
                            simStep === 6 || simStep === 7
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500 animate-pulse font-bold"
                              : "bg-slate-950 text-slate-500"
                          }`}>
                            {simStep === 7 ? (
                              <span>⚡ Transit: [01001000 01100101 01101100] ➔ Wire Active</span>
                            ) : simStep < 6 ? (
                              <span>[Packaging headers at Host A...]</span>
                            ) : (
                              <span>[Bits arrived at Host B - Unpacking]</span>
                            )}
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                          Stage {simStep + 1} of 12
                        </span>
                      </div>

                      {/* Right: Host B Receiver Stack */}
                      <div className="md:col-span-4 bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-[11px] font-bold text-slate-800">
                          <span className="flex items-center space-x-1">
                            <i className="fa-solid fa-server text-emerald-600"></i>
                            <span>Receiver Node (Host B)</span>
                          </span>
                          <span className="text-[9px] font-bold text-emerald-700">⬆ Decapsulating</span>
                        </div>

                        {[
                          { stepMatch: 11, num: 7, name: "Application Layer", tag: "200 OK", bg: "bg-purple-50 text-purple-900 border-purple-200" },
                          { stepMatch: 10, num: 6, name: "Presentation Layer", tag: "Decrypted", bg: "bg-indigo-50 text-indigo-900 border-indigo-200" },
                          { stepMatch: 10, num: 5, name: "Session Layer", tag: "Sync", bg: "bg-sky-50 text-sky-900 border-sky-200" },
                          { stepMatch: 10, num: 4, name: "Transport Layer", tag: "Port 443", bg: "bg-teal-50 text-teal-900 border-teal-200" },
                          { stepMatch: 9, num: 3, name: "Network Layer", tag: "IP Checked", bg: "bg-amber-50 text-amber-900 border-amber-200" },
                          { stepMatch: 8, num: 2, name: "Data Link Layer", tag: "CRC OK", bg: "bg-orange-50 text-orange-900 border-orange-200" },
                          { stepMatch: 7, num: 1, name: "Physical Layer", tag: "Bits Read", bg: "bg-rose-50 text-rose-900 border-rose-200" },
                        ].map((l) => {
                          const isCurrent = simStep === l.stepMatch;
                          const isPast = simStep > l.stepMatch;
                          return (
                            <div
                              key={l.num}
                              onClick={() => {
                                setIsSimPlaying(false);
                                setSimStep(l.stepMatch);
                              }}
                              className={`p-1.5 px-2 rounded-lg border text-[10px] flex items-center justify-between transition cursor-pointer ${
                                isCurrent
                                  ? "ring-2 ring-emerald-500 bg-emerald-100 font-bold scale-[1.02] shadow-xs"
                                  : isPast
                                  ? "bg-slate-100 text-slate-700 border-slate-200"
                                  : l.bg
                              }`}
                            >
                              <span className="flex items-center space-x-1.5">
                                <span className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                                  isCurrent ? "bg-emerald-600 text-white" : isPast ? "bg-slate-300 text-slate-700" : "bg-white text-slate-600"
                                }`}>
                                  {isPast ? "✓" : l.num}
                                </span>
                                <span>{l.name}</span>
                              </span>
                              <span className="font-mono text-[9px] font-bold">{l.tag}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* LIVE IN-MEMORY PACKET BUFFER INSPECTOR */}
                    <div className="p-4 bg-slate-950 text-white rounded-2xl font-mono text-xs shadow-inner space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                        <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                          <i className="fa-solid fa-microchip"></i>
                          <span>LIVE PACKET IN MEMORY BUFFER (ENCAPSULATION PROGRESS)</span>
                        </span>
                        <span className="font-bold text-amber-400">
                          {simStep <= 6 ? `Host A Encapsulation (Step ${simStep + 1})` : simStep === 7 ? "On Network Cable" : `Host B Decapsulation (Step ${simStep + 1})`}
                        </span>
                      </div>

                      {/* Header Stack Container */}
                      <div className="flex flex-wrap items-center gap-1.5 py-1">
                        {simStep >= 5 && simStep <= 8 && (
                          <span className="bg-orange-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold border border-orange-400/50 shadow-xs">
                            [L2: MAC Frame Header (3C:52:82)]
                          </span>
                        )}
                        {simStep >= 4 && simStep <= 9 && (
                          <span className="bg-amber-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-400/50 shadow-xs">
                            [L3: IP Header (192.168.1.5 ➔ 10.0.0.1)]
                          </span>
                        )}
                        {simStep >= 3 && simStep <= 10 && (
                          <span className="bg-teal-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold border border-teal-400/50 shadow-xs">
                            [L4: TCP Port 443 | Seq 101]
                          </span>
                        )}
                        {simStep >= 2 && simStep <= 10 && (
                          <span className="bg-sky-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold border border-sky-400/50">
                            [L5: Session #941]
                          </span>
                        )}
                        {simStep >= 1 && simStep <= 10 && (
                          <span className="bg-indigo-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold border border-indigo-400/50">
                            [L6: SSL Cipher]
                          </span>
                        )}
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold border border-purple-400/50 shadow-xs">
                          {simStep === 11 ? "🎉 [L7 HTTP/1.1 200 OK: Data Delivered Successfully!]" : "[L7: HTTP Payload \"GET /index.html\"]"}
                        </span>
                        {simStep >= 5 && simStep <= 8 && (
                          <span className="bg-orange-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold border border-orange-500/50 shadow-xs">
                            [L2: CRC-32 Trailer]
                          </span>
                        )}
                      </div>

                      {/* Real-Time Bilingual Commentary Box */}
                      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="text-slate-300">
                          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-0.5">
                            English Commentary
                          </span>
                          <p className="text-[11px] leading-relaxed">
                            {simStep === 0 && "User creates an HTTP web request. Application layer produces raw data payload."}
                            {simStep === 1 && "Presentation layer compresses data and encrypts it using SSL/TLS encryption."}
                            {simStep === 2 && "Session layer establishes dialog coordination and manages session port tokens."}
                            {simStep === 3 && "Transport layer slices stream into Segments and attaches TCP source/destination ports."}
                            {simStep === 4 && "Network layer packages segment into Packet and attaches source and destination IP addresses."}
                            {simStep === 5 && "Data Link layer wraps packet into Frame, adding hardware MAC address and CRC error trailer."}
                            {simStep === 6 && "Physical layer modulates frame into raw bitstream (voltages / light pulses) for cable."}
                            {simStep === 7 && "Bits travel through optical fiber cable and network switches across the internet."}
                            {simStep === 8 && "Receiver Data Link checks CRC error checksum. Match confirmed! Frame header stripped."}
                            {simStep === 9 && "Receiver Network layer checks destination IP matches this server. IP header stripped."}
                            {simStep === 10 && "Receiver Transport layer checks TCP port 443, reassembles stream, and forwards to web server."}
                            {simStep === 11 && "Web server application successfully receives and renders the message! Transmission complete."}
                          </p>
                        </div>

                        <div className="text-slate-300" dir="rtl">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5 font-sans">
                            اردو تشریح
                          </span>
                          <p className="font-nastaleeq text-sm sm:text-base leading-loose text-slate-200">
                            {simStep === 0 && "صارف براؤزر میں ریکویسٹ بھیجتا ہے۔ ایپلیکیشن لیئر اصل ڈیٹا (HTTP Payload) تیار کرتی ہے۔"}
                            {simStep === 1 && "پریزنٹیشن لیئر ڈیٹا کو فارمیٹ اور SSL/TLS انکرپشن کے ذریعے محفوظ بناتی ہے۔"}
                            {simStep === 2 && "سیشن لیئر سرور کے ساتھ سیشن قائم کر کے پورٹ ٹوکنز کا انتظام کرتی ہے۔"}
                            {simStep === 3 && "ٹرانسپورٹ لیئر ڈیٹا کے ٹکڑے (Segments) کر کے پورٹ نمبر (TCP 443) لگاتی ہے۔"}
                            {simStep === 4 && "نیٹ ورک لیئر سیگمنٹ کو پیکٹ میں بند کر کے بھیجنے والے اور وصول کنندہ کا IP ایڈریس لگاتی ہے۔"}
                            {simStep === 5 && "ڈیٹا لنک لیئر فریم بناتی ہے اور ہارڈویئر MAC ایڈریس و غلطی چیک کرنے والا CRC کوڈ لگاتی ہے۔"}
                            {simStep === 6 && "فزیکل لیئر فریم کو الیکٹریکل سگنلز اور بٹس (0101) میں بدل کر کیبل پر بھیجتی ہے۔"}
                            {simStep === 7 && "پیکٹ فائبر آپٹک کیبلز اور نیٹ ورک راؤٹرز کے ذریعے بحفاظت سرور کی طرف سفر کرتا ہے۔"}
                            {simStep === 8 && "سرور کی ڈیٹا لنک لیئر غلطی چیک کرتی ہے، درست پائے جانے پر MAC ہیڈر اتار دیتی ہے۔"}
                            {simStep === 9 && "نیٹ ورک لیئر تصدیق کرتی ہے کہ IP ایڈریس درست ہے، پھر IP ہیڈر اتار دیتی ہے۔"}
                            {simStep === 10 && "ٹرانسپورٹ لیئر پورٹ 443 پر ڈیٹا جوڑ کر اصل ویب سرور سافٹ ویئر کو پہنچا دیتی ہے۔"}
                            {simStep === 11 && "ویب سرور نے کامیابی کے ساتھ پورا پیغام وصول کر لیا! ڈیٹا ٹرانسمیشن کامیابی سے مکمل ہوئی۔"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD TYPE 5: BOARD EXAM STYLE QUESTION & HOW TO SOLVE */}
              {currentCard.cardType === "EXAM_QUESTION" && (
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5 text-left">
                  {/* Card Header with Exam Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        <i className="fa-solid fa-graduation-cap"></i>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-rose-700 font-bold block">
                          {currentCard.boardReference || "Punjab Board (BISE) Examination"}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          Target Board Examination Question
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center space-x-1.5 self-start sm:self-auto">
                      <i className="fa-solid fa-star text-amber-500 text-[10px]"></i>
                      <span>High Board Exam Priority</span>
                    </span>
                  </div>

                  {/* Exam Question Box */}
                  <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                        <i className="fa-regular fa-circle-question text-rose-500"></i>
                        <span>Question Paper Prompt</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Section B / Descriptive
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                      {currentCard.examQuestion}
                    </p>
                  </div>

                  {/* Marking Scheme Breakdown */}
                  {currentCard.markingScheme && currentCard.markingScheme.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-clipboard-check text-emerald-600 text-xs"></i>
                        <span className="text-[11px] uppercase tracking-wider text-slate-800 font-bold">
                          Official Board Marking Scheme Breakdown:
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentCard.markingScheme.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-emerald-50/50 p-3 rounded-xl text-xs border border-emerald-200/80 text-slate-800 transition hover:bg-emerald-50"
                          >
                            <span className="font-medium text-slate-800">• {item.criteria}</span>
                            <span className="font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-md border border-emerald-200 shrink-0 ml-2 shadow-2xs font-mono text-[11px]">
                              {item.marks} {typeof item.marks === "number" ? (item.marks === 1 ? "Mark" : "Marks") : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Solution Strategy Guidance */}
                  {currentCard.solutionGuidance && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-pen-nib text-sky-600 text-xs"></i>
                        <span className="text-[11px] uppercase tracking-wider text-slate-800 font-bold">
                          How to Attempt & Perfect Answer Blueprint:
                        </span>
                      </div>
                      <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-sky-50/50 p-4 sm:p-5 rounded-2xl border border-sky-200/80 font-normal">
                        {currentCard.solutionGuidance}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Legacy Body Text fallback */}
              {currentCard.bodyContent && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-xs text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                  {currentCard.bodyContent}
                </div>
              )}
            </div>

            {/* Bottom Card Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 mt-6">
              <button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-2 shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-arrow-left text-[10px]"></i>
                <span>Previous Card</span>
              </button>

              <span className="text-xs text-slate-500 font-mono font-bold">
                {currentCardIndex + 1} / {generatedCards.length}
              </span>

              <button
                onClick={nextCard}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center space-x-2 shadow-md shadow-sky-600/20 cursor-pointer"
              >
                <span>{currentCardIndex === generatedCards.length - 1 ? "Complete Topic" : "Next Card"}</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* Previous / Next Topic Navigation below Main Card */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevTopic}
              disabled={!prevTopic}
              title={prevTopic ? `Previous: Topic ${prevTopic.chapterNumber}.${prevTopic.topicNumber}` : "No previous topic"}
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
              <span>{prevTopic ? `Previous: Topic ${prevTopic.chapterNumber}.${prevTopic.topicNumber}` : "Previous Topic"}</span>
            </button>
            <button
              onClick={handleNextTopicNav}
              disabled={!nextTopic}
              title={nextTopic ? `Next: Topic ${nextTopic.chapterNumber}.${nextTopic.topicNumber}` : "No next topic"}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center space-x-2 shadow-md shadow-sky-600/20 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>{nextTopic ? `Next: Topic ${nextTopic.chapterNumber}.${nextTopic.topicNumber}` : "Next Topic"}</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>

        {/* Completion Modal */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center text-3xl mx-auto mb-3 shadow-md shadow-amber-500/20">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Topic Completed Successfully!</h3>
              <p className="text-xs text-slate-500 mb-6">
                Great job, {studentName}! You have successfully marked <strong>{currentTopic.title}</strong> as complete.
                Your progress has been updated in the database.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <Link
                  href="/dashboard"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-[11px] transition shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5"
                >
                  <i className="fa-solid fa-house"></i>
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleNextTopic}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-3 rounded-xl text-[11px] transition shadow-md shadow-sky-600/20 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-arrow-right"></i>
                  <span>Next Topic</span>
                </button>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-[11px] transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
          <p>&copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science.</p>
        </footer>
      </main>
    </StudentShell>
  );
}
