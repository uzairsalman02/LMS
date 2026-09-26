"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export interface ChapterStatProp {
  id: string;
  chapterNumber: number;
  title: string;
  totalQuestions: number;
  attemptedQuestions: number;
  accuracy: number;
  pendingMistakes: number;
}

export interface RevisionTopic {
  id: string;
  unitNumber: number;
  unitName: string;
  badge: string;
  badgeType: "long" | "short" | "core";
  title: string;
  weightage: string;
  description: string;
  keyPoints: string[];
  boardExamTips: string;
}

export interface FlashcardItem {
  id: string;
  unitNumber: number;
  unitName: string;
  question: string;
  answer: string;
  keyTakeaway: string;
}

export interface ComparisonItem {
  id: string;
  unitNumber: number;
  title: string;
  itemA: string;
  itemB: string;
  points: { feature: string; valA: string; valB: string }[];
}

const REVISION_TOPICS: RevisionTopic[] = [
  {
    id: "rev-1",
    unitNumber: 1,
    unitName: "Unit 1: Basics of IT & Software",
    badge: "8 Marks Long Q Favorite",
    badgeType: "long",
    title: "System Bus Architecture & Bus Types",
    weightage: "Frequently repeated in Section C (8 Marks)",
    description:
      "Understand the electrical transmission paths connecting CPU, RAM, and I/O controllers, and the three distinct sub-buses.",
    keyPoints: [
      "Data Bus: Bidirectional path carrying data to and from memory/CPU. Bus width (32-bit / 64-bit) determines transfer speed.",
      "Address Bus: Unidirectional path carrying physical memory addresses from CPU to RAM. Width defines addressable memory size (2^n).",
      "Control Bus: Carries timing, read/write command signals, and bus requests to synchronize system operations.",
    ],
    boardExamTips:
      "Always draw a neat block diagram showing CPU, Memory, and System Bus with arrows indicating direction of data flow.",
  },
  {
    id: "rev-2",
    unitNumber: 1,
    unitName: "Unit 1: Basics of IT & Software",
    badge: "Guaranteed Short Q",
    badgeType: "short",
    title: "Software Development Life Cycle (SDLC) Phases",
    weightage: "Section B (3-4 Marks)",
    description:
      "A systematic process for building software through defined sequential phases from initial idea to deployment.",
    keyPoints: [
      "Preliminary Investigation: Problem identification, feasibility study (financial, technical, operational).",
      "Systems Analysis: Requirement gathering, data flow diagrams (DFD), system requirements specification.",
      "System Design: Logical and physical database & architectural design.",
      "Coding & Testing: Implementation followed by unit testing, integration testing, and system verification.",
      "Maintenance: Longest phase addressing bug fixes, upgrades, and system evolution.",
    ],
    boardExamTips: "Memorize the sequence of all 6 phases. Questions often ask to define any two specific phases.",
  },
  {
    id: "rev-3",
    unitNumber: 2,
    unitName: "Unit 2: Information Networks",
    badge: "8 Marks Long Q Favorite",
    badgeType: "long",
    title: "Network Topologies (Star, Mesh, Ring, Bus)",
    weightage: "Top-Ranked Punjab Board Long Question",
    description:
      "Physical and logical geometric arrangement of computing devices connected in a computer network.",
    keyPoints: [
      "Star Topology: Central hub/switch. Easy to install and troubleshoot. Failure of single node does not affect network; hub failure disables all.",
      "Mesh Topology: Point-to-point dedicated links between every pair of nodes. Maximum fault tolerance and security, but highest cabling cost (n*(n-1)/2 cables).",
      "Bus Topology: Single backbone coaxial cable with terminators at both ends. Inexpensive, but whole network fails if backbone breaks.",
      "Ring Topology: Unidirectional token-passing ring. Predictable performance, but break in ring disables communication.",
    ],
    boardExamTips:
      "Draw diagrams for Star and Mesh topologies. State formula for number of links in Mesh: n(n-1)/2.",
  },
  {
    id: "rev-4",
    unitNumber: 2,
    unitName: "Unit 2: Information Networks",
    badge: "Core Architecture",
    badgeType: "core",
    title: "OSI Reference Model: 7 Layers & Functions",
    weightage: "Section B & C (5-8 Marks)",
    description:
      "Standard architectural framework developed by ISO defining networking protocols across seven conceptual layers.",
    keyPoints: [
      "Application (Layer 7): User interfaces & network services (HTTP, FTP, SMTP, DNS).",
      "Presentation (Layer 6): Data representation, syntax translation, encryption, and compression.",
      "Session (Layer 5): Establishes, manages, and terminates network dialogues.",
      "Transport (Layer 4): End-to-end data delivery, segmentation, flow control, error recovery (TCP, UDP).",
      "Network (Layer 3): Logical IP addressing and packet routing across networks (Routers operate here).",
      "Data Link (Layer 2): Physical MAC addressing and framing (Switches operate here).",
      "Physical (Layer 1): Transmission of raw bitstream over physical electrical/optical medium.",
    ],
    boardExamTips:
      "Mnemonic: 'Please Do Not Throw Sausage Pizza Away'. Questions frequently ask functions of Transport vs Network layers.",
  },
  {
    id: "rev-5",
    unitNumber: 3,
    unitName: "Unit 3: Data Communications",
    badge: "Guaranteed Short Q",
    badgeType: "short",
    title: "Data Transmission Modes: Simplex, Half & Full Duplex",
    weightage: "Section B Must-Ask (3 Marks)",
    description:
      "Direction of signal flow between two communicating devices across a transmission medium.",
    keyPoints: [
      "Simplex Mode: Strictly unidirectional communication. Sender only sends, receiver only receives (e.g. Traditional Radio, Keyboard to CPU).",
      "Half-Duplex Mode: Bidirectional communication, but only one party can transmit at any given time (e.g. Walkie-Talkie).",
      "Full-Duplex Mode: Simultaneous bidirectional communication. Both parties can send and receive simultaneously (e.g. Telephone conversation, Ethernet).",
    ],
    boardExamTips: "Provide one real-world practical example for each mode to secure full 3 marks.",
  },
  {
    id: "rev-6",
    unitNumber: 3,
    unitName: "Unit 3: Data Communications",
    badge: "Important Comparison",
    badgeType: "long",
    title: "Guided vs Unguided Transmission Media",
    weightage: "Section C (8 Marks)",
    description:
      "Bounded physical cabling vs wireless electromagnetic wave channels used to transfer telecommunication signals.",
    keyPoints: [
      "Twisted Pair Cable: Pair of insulated copper wires twisted to cancel crosstalk. Inexpensive, used in LAN (UTP/STP).",
      "Coaxial Cable: Central copper core, dielectric insulator, braided shield, outer jacket. Higher bandwidth than twisted pair.",
      "Fiber Optic Cable: Glass or plastic core transmitting light pulses using Total Internal Reflection (TIR). Highest bandwidth, immune to EMI.",
      "Unguided Media: Radio waves, Microwaves (terrestrial line-of-sight & satellite), and Infrared.",
    ],
    boardExamTips: "Explain the optical principle of Total Internal Reflection (TIR) for Fiber Optic cables.",
  },
  {
    id: "rev-7",
    unitNumber: 5,
    unitName: "Unit 5: Computer Architecture",
    badge: "8 Marks Long Q Favorite",
    badgeType: "long",
    title: "CPU Special Purpose Registers (PC, MAR, MBR, IR)",
    weightage: "Top Board Favorite in Section C",
    description:
      "High-speed internal CPU storage locations dedicated to instruction sequencing and memory addressing.",
    keyPoints: [
      "Program Counter (PC): Holds memory address of the next instruction waiting to be fetched and executed.",
      "Memory Address Register (MAR): Holds memory address currently being read from or written to RAM.",
      "Memory Buffer Register (MBR/MDR): Holds actual data word read from or to be written into memory.",
      "Instruction Register (IR): Holds the current instruction fetched from memory while control unit decodes it.",
      "Accumulator (AC): Holds temporary results of arithmetic and logical operations performed by ALU.",
    ],
    boardExamTips:
      "List the exact chronological steps: 1. PC -> MAR, 2. Memory -> MBR, 3. MBR -> IR, 4. PC increments.",
  },
  {
    id: "rev-8",
    unitNumber: 5,
    unitName: "Unit 5: Computer Architecture",
    badge: "Core Architecture",
    badgeType: "core",
    title: "Fetch-Decode-Execute Cycle & CPU Components",
    weightage: "Section B & C (5-8 Marks)",
    description:
      "The fundamental operational cycle of the CPU executing machine instructions stored in main memory.",
    keyPoints: [
      "Fetch: Control unit retrieves instruction from RAM address pointed to by PC into IR; PC increments.",
      "Decode: Control unit translates instruction opcode into micro-operations and identifies operand addresses.",
      "Execute: Arithmetic Logic Unit (ALU) performs computation or memory transfer takes place.",
      "Store: Result is written back to destination register or RAM address.",
    ],
    boardExamTips: "Draw the cyclic diagram showing Fetch -> Decode -> Execute -> Store loop.",
  },
  {
    id: "rev-9",
    unitNumber: 6,
    unitName: "Unit 6: Security & Law",
    badge: "Section B Must-Ask",
    badgeType: "short",
    title: "Computer Viruses, Trojan Horses & Worms",
    weightage: "Section B (3-4 Marks)",
    description:
      "Malicious software programs designed to disrupt system performance, corrupt data, and spread across networks.",
    keyPoints: [
      "Boot Sector Virus: Infects master boot record (MBR) and executes whenever computer boots up.",
      "File Infector Virus: Attaches code to executable files (.exe, .com) and spreads upon execution.",
      "Worm: Self-replicating standalone program that propagates over network connections without needing a host file.",
      "Trojan Horse: Disguised as legitimate, useful software but carries hidden malicious payload.",
    ],
    boardExamTips: "Clearly distinguish that Worms replicate independently while Viruses need a host executable file.",
  },
  {
    id: "rev-10",
    unitNumber: 7,
    unitName: "Unit 7: Windows OS",
    badge: "Core Concept",
    badgeType: "short",
    title: "Operating System Roles: Multitasking vs Multiprogramming",
    weightage: "Section B (3 Marks)",
    description:
      "System software managing hardware resources and enabling concurrency in program execution.",
    keyPoints: [
      "Multiprogramming: Multiple jobs loaded in memory simultaneously; CPU switches jobs when active job waits for I/O.",
      "Multitasking (Time-Sharing): CPU switches between tasks so rapidly that user interacts with each program concurrently.",
      "Multiprocessing: System featuring two or more physical CPUs executing multiple processes simultaneously.",
    ],
    boardExamTips: "Highlight that Multitasking uses CPU time slicing (quantum), while Multiprogramming maximizes CPU utilization during I/O waits.",
  },
  {
    id: "rev-11",
    unitNumber: 9,
    unitName: "Unit 9: Spreadsheet (MS Excel)",
    badge: "Practical & Theory Core",
    badgeType: "core",
    title: "Relative vs Absolute vs Mixed Cell Referencing",
    weightage: "Guaranteed Board Question in Section B",
    description:
      "How cell addresses behave when copied across spreadsheet rows and columns in Microsoft Excel.",
    keyPoints: [
      "Relative Referencing (A1): Column and row change automatically when formula is copied to another cell.",
      "Absolute Referencing ($A$1): Dollar signs ($) lock both column and row so they remain fixed regardless of where formula is copied.",
      "Mixed Referencing ($A1 or A$1): Either row is locked (A$1) or column is locked ($A1).",
    ],
    boardExamTips: "Give an exact example: copying `=A1*B1` to next row becomes `=A2*B2`, while `=$A$1*B1` becomes `=$A$1*B2`.",
  },
  {
    id: "rev-12",
    unitNumber: 10,
    unitName: "Unit 10: Internet Fundamentals",
    badge: "High-Yield Objective & Short",
    badgeType: "short",
    title: "IP Addressing (IPv4 vs IPv6) & DNS Resolution",
    weightage: "Section B & MCQs (4-5 Marks)",
    description:
      "Logical addressing architecture enabling global device identification and domain name translation on the Internet.",
    keyPoints: [
      "IPv4: 32-bit address split into 4 octets separated by dots (e.g. 192.168.1.1). Total 4.3 billion addresses.",
      "IPv6: 128-bit address split into 8 hexadecimal groups separated by colons (e.g. 2001:0db8::1). Vastly larger address space.",
      "DNS (Domain Name System): Distributed database that maps human-friendly hostnames (e.g. bise.edu.pk) to machine IP addresses.",
    ],
    boardExamTips: "Memorize: IPv4 is 32 bits (4 bytes), IPv6 is 128 bits (16 bytes). Frequently asked in MCQs.",
  },
];

const FLASHCARDS: FlashcardItem[] = [
  {
    id: "fc-1",
    unitNumber: 2,
    unitName: "Unit 2: Information Networks",
    question: "What is the primary difference between Star and Mesh topologies regarding cabling and fault tolerance?",
    answer:
      "In Star topology, each node connects to a central hub/switch requiring fewer cables; failure of a node does not affect others, but hub failure disables the whole network. In Mesh topology, every node has a dedicated point-to-point link to every other node (n*(n-1)/2 cables), offering maximum fault tolerance and privacy but highest installation cost.",
    keyTakeaway: "Star uses central hub; Mesh uses n(n-1)/2 dedicated point-to-point links.",
  },
  {
    id: "fc-2",
    unitNumber: 5,
    unitName: "Unit 5: Computer Architecture",
    question: "What are the roles of Program Counter (PC) and Instruction Register (IR)?",
    answer:
      "The Program Counter (PC) holds the memory address of the next instruction to be fetched. The Instruction Register (IR) holds the binary instruction currently being decoded and executed by the Control Unit.",
    keyTakeaway: "PC = Address of next instruction. IR = Current instruction being executed.",
  },
  {
    id: "fc-3",
    unitNumber: 3,
    unitName: "Unit 3: Data Communications",
    question: "Why is Fiber Optic cable immune to Electromagnetic Interference (EMI)?",
    answer:
      "Fiber Optic cable transmits data as light pulses through glass/silica core using Total Internal Reflection rather than electrical currents over metal wires. Since light does not conduct electricity, external electromagnetic fields and lightning cannot induce noise or corrupt the signal.",
    keyTakeaway: "Transmits light pulses instead of electrical currents; impervious to EMI.",
  },
  {
    id: "fc-4",
    unitNumber: 1,
    unitName: "Unit 1: Basics of IT",
    question: "Why is the Address Bus unidirectional while the Data Bus is bidirectional?",
    answer:
      "The CPU always generates and sends memory addresses out to RAM and peripherals to specify where to read or write (unidirectional). The Data Bus must transfer data from CPU to memory during write operations and from memory to CPU during read operations (bidirectional).",
    keyTakeaway: "CPU sends addresses outward (unidirectional); data flows both ways (bidirectional).",
  },
  {
    id: "fc-5",
    unitNumber: 9,
    unitName: "Unit 9: MS Excel",
    question: "In Excel, what happens when the formula `=$A$1*B1` is copied from cell C1 to cell C2?",
    answer:
      "The result in cell C2 will be `=$A$1*B2`. The absolute reference `$A$1` remains locked and unchanged, while the relative reference `B1` automatically shifts to `B2`.",
    keyTakeaway: "$ locks row and column; relative reference increments automatically.",
  },
  {
    id: "fc-6",
    unitNumber: 10,
    unitName: "Unit 10: Internet",
    question: "How many bits are used in IPv4 versus IPv6 addresses?",
    answer:
      "IPv4 uses 32 bits (4 bytes), written in dotted-decimal format (e.g. 172.16.254.1). IPv6 uses 128 bits (16 bytes), written in hexadecimal format separated by colons.",
    keyTakeaway: "IPv4 = 32 bits (4 bytes). IPv6 = 128 bits (16 bytes).",
  },
];

const COMPARISONS: ComparisonItem[] = [
  {
    id: "comp-1",
    unitNumber: 2,
    title: "Star Topology vs Mesh Topology",
    itemA: "Star Topology",
    itemB: "Mesh Topology",
    points: [
      { feature: "Cabling Structure", valA: "Single cable per device to central hub", valB: "Dedicated point-to-point link between every node pair" },
      { feature: "Cable Formula", valA: "N cables required", valB: "N*(N-1)/2 cables required" },
      { feature: "Fault Tolerance", valA: "Moderate; single node failure OK, hub failure fatal", valB: "Maximum; alternative routes always available" },
      { feature: "Cost & Setup", valA: "Economical and straightforward to install", valB: "Very expensive and complex cabling" },
    ],
  },
  {
    id: "comp-2",
    unitNumber: 3,
    title: "Simplex vs Half-Duplex vs Full-Duplex",
    itemA: "Half-Duplex",
    itemB: "Full-Duplex",
    points: [
      { feature: "Direction of Data", valA: "Bidirectional, but one direction at a time", valB: "Simultaneous bidirectional transmission" },
      { feature: "Channel Sharing", valA: "Shared single channel sequentially", valB: "Two separate channels or frequency division" },
      { feature: "Practical Example", valA: "Walkie-talkie communication", valB: "Mobile phone conversation" },
    ],
  },
  {
    id: "comp-3",
    unitNumber: 5,
    title: "RAM (Main Memory) vs ROM (Read-Only Memory)",
    itemA: "RAM",
    itemB: "ROM",
    points: [
      { feature: "Volatility", valA: "Volatile (data lost when power turns off)", valB: "Non-volatile (retains data permanently)" },
      { feature: "Read/Write", valA: "Both read and write operations permitted", valB: "Only read operations permitted under normal use" },
      { feature: "Primary Content", valA: "Active OS processes & application data", valB: "Bootstrap loader & BIOS startup firmware" },
    ],
  },
  {
    id: "comp-4",
    unitNumber: 10,
    title: "IPv4 Addressing vs IPv6 Addressing",
    itemA: "IPv4",
    itemB: "IPv6",
    points: [
      { feature: "Address Length", valA: "32 bits (4 bytes)", valB: "128 bits (16 bytes)" },
      { feature: "Notation", valA: "Dotted-decimal (e.g. 192.168.1.1)", valB: "Hexadecimal with colons (e.g. 2001:db8::1)" },
      { feature: "Total Addresses", valA: "Approx 4.29 billion (~4.3 x 10^9)", valB: "Undecillion (~3.4 x 10^38)" },
      { feature: "Configuration", valA: "Manual or DHCP", valB: "Auto-configuration (SLAAC) supported" },
    ],
  },
];

const INITIAL_CHECKLIST = [
  { id: 1, unit: "Unit 1", text: "System Bus (Data, Address, Control) with diagram", checked: true },
  { id: 2, unit: "Unit 1", text: "SDLC 6 phases & Feasibility Study definition", checked: true },
  { id: 3, unit: "Unit 2", text: "Star vs Mesh Topologies diagram & cable formula", checked: true },
  { id: 4, unit: "Unit 2", text: "OSI 7 Layers sequence & Transport vs Network layer", checked: false },
  { id: 5, unit: "Unit 3", text: "Simplex, Half-Duplex & Full-Duplex definitions", checked: true },
  { id: 6, unit: "Unit 3", text: "Fiber Optic Total Internal Reflection (TIR) concept", checked: false },
  { id: 7, unit: "Unit 5", text: "CPU Registers (PC, MAR, MBR, IR) sequential roles", checked: false },
  { id: 8, unit: "Unit 5", text: "Fetch-Decode-Execute instruction cycle steps", checked: false },
  { id: 9, unit: "Unit 6", text: "Computer Viruses vs Worms vs Trojan Horse", checked: false },
  { id: 10, unit: "Unit 9", text: "Relative vs Absolute ($A$1) Excel cell referencing", checked: false },
  { id: 11, unit: "Unit 10", text: "IPv4 (32-bit) vs IPv6 (128-bit) comparison", checked: false },
];

export interface RevisionClientProps {
  chapterStats?: ChapterStatProp[];
  dbRevisionTopics?: RevisionTopic[];
  dbFlashcards?: FlashcardItem[];
  dbComparisons?: ComparisonItem[];
}

export function RevisionClient({
  chapterStats = [],
  dbRevisionTopics,
  dbFlashcards,
  dbComparisons,
}: RevisionClientProps) {
  const topicsData = dbRevisionTopics && dbRevisionTopics.length > 0 ? dbRevisionTopics : REVISION_TOPICS;
  const flashcardsData = dbFlashcards && dbFlashcards.length > 0 ? dbFlashcards : FLASHCARDS;
  const comparisonsData = dbComparisons && dbComparisons.length > 0 ? dbComparisons : COMPARISONS;

  const [activeTab, setActiveTab] = useState<"topics" | "flashcards" | "comparisons">("topics");
  const [selectedUnit, setSelectedUnit] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNotesTopic, setActiveNotesTopic] = useState<RevisionTopic | null>(null);

  // Flashcards active recall interactive state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);

  // Persistent Board Exam Checklist in localStorage
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("punjab_board_revision_checklist");
      if (saved) {
        setChecklist(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleChecklist = (id: number) => {
    setChecklist((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      try {
        localStorage.setItem("punjab_board_revision_checklist", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const checkedCount = checklist.filter((c) => c.checked).length;
  const checklistPct = Math.round((checkedCount / checklist.length) * 100);

  // Filtered topics (dynamically from database)
  const filteredTopics = useMemo(() => {
    return topicsData.filter((t) => {
      const matchUnit = selectedUnit === "all" || t.unitNumber === selectedUnit;
      const matchSearch =
        searchQuery.trim() === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.unitName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchUnit && matchSearch;
    });
  }, [topicsData, selectedUnit, searchQuery]);

  // Filtered flashcards (dynamically from database)
  const filteredFlashcards = useMemo(() => {
    return flashcardsData.filter((f) => selectedUnit === "all" || f.unitNumber === selectedUnit);
  }, [flashcardsData, selectedUnit]);

  // Filtered comparisons
  const filteredComparisons = useMemo(() => {
    return comparisonsData.filter((c) => selectedUnit === "all" || c.unitNumber === selectedUnit);
  }, [comparisonsData, selectedUnit]);

  const currentFlashcard = filteredFlashcards[activeCardIndex] || filteredFlashcards[0];

  const handleCardMastery = (cardId: string) => {
    if (!masteredCards.includes(cardId)) {
      setMasteredCards((prev) => [...prev, cardId]);
    }
    // Next card
    if (activeCardIndex < filteredFlashcards.length - 1) {
      setActiveCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const rightRail = (
    <div className="space-y-4">
      {/* 1. Essential Board Exam Checklist Box */}
      <div className="bg-gradient-to-br from-sky-50/80 via-slate-50 to-white p-4 rounded-3xl border border-sky-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-[10px]">
              <i className="fa-solid fa-list-check"></i>
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Exam Checklist
            </h4>
          </div>
          <span className="text-[10px] font-black text-sky-700 bg-sky-100/90 px-2 py-0.5 rounded-full border border-sky-200">
            {checkedCount} / {checklist.length} Done ({checklistPct}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
          <div
            className="bg-sky-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${checklistPct}%` }}
          ></div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-1.5 text-xs text-slate-600 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
          {checklist.map((item) => (
            <label
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-white/80 transition cursor-pointer border border-transparent hover:border-sky-100"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {}}
                className="mt-0.5 rounded text-sky-600 focus:ring-0 cursor-pointer shrink-0"
              />
              <div className="flex-1">
                <span className={`block leading-snug ${item.checked ? "line-through text-slate-400" : "text-slate-800 font-semibold"}`}>
                  {item.text}
                </span>
                <span className="text-[10px] font-bold text-sky-600">{item.unit}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Board Examiner High-Yield Watchlist Card */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-3xl shadow-2xs space-y-2.5 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
            <i className="fa-solid fa-lightbulb"></i>
          </div>
          <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
            Punjab Board Tips
          </h4>
        </div>
        <ul className="space-y-2 text-[11px] text-slate-600">
          <li className="flex items-start space-x-1.5">
            <i className="fa-solid fa-check text-emerald-600 text-[10px] mt-0.5 shrink-0"></i>
            <span>Always sketch diagrams for <strong>Star and Mesh Topologies</strong> to guarantee full 8 marks.</span>
          </li>
          <li className="flex items-start space-x-1.5">
            <i className="fa-solid fa-check text-emerald-600 text-[10px] mt-0.5 shrink-0"></i>
            <span>Memorize difference between <strong>IPv4 (32-bit)</strong> and <strong>IPv6 (128-bit)</strong> for Section A MCQs.</span>
          </li>
          <li className="flex items-start space-x-1.5">
            <i className="fa-solid fa-check text-emerald-600 text-[10px] mt-0.5 shrink-0"></i>
            <span>List all <strong>4 CPU Registers (PC, MAR, MBR, IR)</strong> in chronological order.</span>
          </li>
        </ul>
      </div>

      {/* 3. Quick Action Jump */}
      <div className="bg-gradient-to-br from-sky-50 to-cyan-50/40 border border-sky-200/80 p-4 rounded-3xl shadow-2xs space-y-2">
        <h4 className="font-black text-slate-900 text-xs">Test Active Recall</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Ready to verify your memory? Solve authentic Punjab Board chapter tests.
        </p>
        <Link
          href="/mock-test"
          className="w-full mt-2 inline-flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer"
        >
          <i className="fa-solid fa-play text-[10px]"></i>
          <span>Practice Board Tests</span>
        </Link>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-list-check"
      rightPanelLabel="Checklist"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-sky-50/70 via-slate-50 to-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Tools &amp; Tracking</span>
                <span>/</span>
                <span className="text-sky-600 font-bold">Board Exams Revision</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Essential Revision Hub &amp; Quick Review
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Class 11 Punjab Board high-yield repeated topics, model answers, and active recall flashcards.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-sky-100 text-sky-800 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-2xs">
                <i className="fa-solid fa-certificate text-sky-600 text-[11px]"></i>
                <span>BISE Past Papers Focus</span>
              </span>
            </div>
          </div>

          {/* 4 Summary Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Total High-Yield Topics */}
            <div className="bg-gradient-to-br from-sky-50/90 via-slate-50/40 to-blue-50/60 p-4 rounded-2xl border border-sky-200/90 shadow-2xs hover:shadow-xs transition flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-900 uppercase tracking-wider block mb-0.5">
                  High-Yield Topics
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{topicsData.length}</h3>
                <span className="text-[10px] text-sky-700 font-bold">10 Units Covered</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-sky-500/10 text-sky-700 flex items-center justify-center text-lg border border-sky-200/60 shadow-inner">
                <i className="fa-solid fa-book-bookmark"></i>
              </div>
            </div>

            {/* Card 2: Flashcards Available */}
            <div className="bg-gradient-to-br from-emerald-50/90 via-slate-50/40 to-teal-50/60 p-4 rounded-2xl border border-emerald-200/90 shadow-2xs hover:shadow-xs transition flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block mb-0.5">
                  Active Recall Cards
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{flashcardsData.length}</h3>
                <span className="text-[10px] text-emerald-700 font-bold">{masteredCards.length} Mastered</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-lg border border-emerald-200/60 shadow-inner">
                <i className="fa-solid fa-layer-group"></i>
              </div>
            </div>

            {/* Card 3: Board Comparisons */}
            <div className="bg-gradient-to-br from-teal-50/90 via-slate-50/40 to-cyan-50/60 p-4 rounded-2xl border border-teal-200/90 shadow-2xs hover:shadow-xs transition flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider block mb-0.5">
                  Key Differences
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{comparisonsData.length}</h3>
                <span className="text-[10px] text-teal-700 font-bold">Section B Guarantees</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center text-lg border border-teal-200/60 shadow-inner">
                <i className="fa-solid fa-table-columns"></i>
              </div>
            </div>

            {/* Card 4: Exam Checklist Standing */}
            <div className="bg-gradient-to-br from-amber-50/90 via-slate-50/40 to-yellow-50/60 p-4 rounded-2xl border border-amber-200/90 shadow-2xs hover:shadow-xs transition flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-0.5">
                  Checklist Ready
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{checkedCount} / {checklist.length}</h3>
                <span className="text-[10px] text-amber-700 font-bold">{checklistPct}% Board Ready</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-lg border border-amber-200/60 shadow-inner">
                <i className="fa-solid fa-circle-check"></i>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl self-start">
              <button
                type="button"
                onClick={() => setActiveTab("topics")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === "topics"
                    ? "bg-white text-sky-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <i className="fa-solid fa-book-open text-[11px]"></i>
                <span>High-Yield Revision Notes</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("flashcards");
                  setIsFlipped(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === "flashcards"
                    ? "bg-white text-sky-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <i className="fa-solid fa-layer-group text-[11px]"></i>
                <span>Active Recall Flashcards</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("comparisons")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === "comparisons"
                    ? "bg-white text-sky-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <i className="fa-solid fa-table-columns text-[11px]"></i>
                <span>Board Differences</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, keywords..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Unit Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setSelectedUnit("all")}
              className={`px-3 py-1 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                selectedUnit === "all"
                  ? "bg-sky-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Units (1-10)
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setSelectedUnit(u)}
                className={`px-3 py-1 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  selectedUnit === u
                    ? "bg-sky-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Unit {u}
              </button>
            ))}
          </div>

          {/* Tab 1: High-Yield Revision Notes */}
          {activeTab === "topics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between hover:border-sky-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 font-bold text-[11px] rounded-lg border border-sky-200/70">
                          {topic.unitName}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            topic.badgeType === "long"
                              ? "bg-sky-100 text-sky-800"
                              : topic.badgeType === "short"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-teal-100 text-teal-800"
                          }`}
                        >
                          {topic.badge}
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base leading-snug">{topic.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">{topic.description}</p>

                      <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                        <i className="fa-solid fa-award text-sky-500 text-[10px]"></i>
                        <span>{topic.weightage}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setActiveNotesTopic(topic)}
                        className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <i className="fa-solid fa-book-open text-[10px]"></i>
                        <span>Study Notes</span>
                      </button>
                      <Link
                        href={`/practice?unit=${topic.unitNumber}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <i className="fa-solid fa-play text-[10px] text-sky-600"></i>
                        <span>Practice</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Active Recall Flashcards */}
          {activeTab === "flashcards" && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {filteredFlashcards.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                  No flashcards found for selected unit. Please select &quot;All Units&quot;.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span className="font-bold text-slate-800">
                      Card {activeCardIndex + 1} of {filteredFlashcards.length}
                    </span>
                    <span className="font-semibold text-sky-600">
                      {masteredCards.length} Mastered
                    </span>
                  </div>

                  {/* Flashcard Box */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="min-h-[260px] bg-gradient-to-br from-sky-50/60 via-white to-slate-50 p-6 sm:p-8 rounded-3xl border border-sky-200/90 shadow-sm cursor-pointer flex flex-col justify-between hover:shadow-md transition select-none"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-sky-100/80 mb-4">
                        <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-100/90 px-2 py-0.5 rounded-md">
                          {currentFlashcard.unitName}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
                          <i className="fa-solid fa-rotate text-[10px]"></i>
                          <span>{isFlipped ? "Answer View" : "Question View (Click to Flip)"}</span>
                        </span>
                      </div>

                      {!isFlipped ? (
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Board Question
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                            {currentFlashcard.question}
                          </h3>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                            Model Answer &amp; Key Points
                          </span>
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                            {currentFlashcard.answer}
                          </p>
                          <div className="pt-2">
                            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 inline-block">
                              Key Takeaway: {currentFlashcard.keyTakeaway}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Click card anywhere to flip</span>
                      <i className="fa-solid fa-arrow-right-arrow-left text-[11px] text-sky-500"></i>
                    </div>
                  </div>

                  {/* Card Navigation Controls */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      disabled={activeCardIndex === 0}
                      onClick={() => {
                        setActiveCardIndex((prev) => Math.max(0, prev - 1));
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1.5"
                    >
                      <i className="fa-solid fa-chevron-left text-[10px]"></i>
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCardMastery(currentFlashcard.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center space-x-1.5 shadow-2xs"
                    >
                      <i className="fa-solid fa-check text-[10px]"></i>
                      <span>Mark Mastered</span>
                    </button>

                    <button
                      type="button"
                      disabled={activeCardIndex === filteredFlashcards.length - 1}
                      onClick={() => {
                        setActiveCardIndex((prev) => Math.min(filteredFlashcards.length - 1, prev + 1));
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1.5 shadow-2xs"
                    >
                      <span>Next</span>
                      <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Board Comparisons / Differences */}
          {activeTab === "comparisons" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredComparisons.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                          Unit {comp.unitNumber}
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Section B Must-Know
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base leading-snug">{comp.title}</h4>

                      {/* Comparison Table */}
                      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/80 text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100/80 text-slate-700 font-black text-[11px]">
                            <tr>
                              <th className="p-2.5">Feature</th>
                              <th className="p-2.5 text-sky-700">{comp.itemA}</th>
                              <th className="p-2.5 text-emerald-700">{comp.itemB}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[11px]">
                            {comp.points.map((pt, i) => (
                              <tr key={i} className="hover:bg-slate-50/50">
                                <td className="p-2.5 font-bold text-slate-600 bg-slate-50/30">{pt.feature}</td>
                                <td className="p-2.5 text-slate-800">{pt.valA}</td>
                                <td className="p-2.5 text-slate-800">{pt.valB}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="pt-2 text-right">
                      <Link
                        href={`/practice?unit=${comp.unitNumber}`}
                        className="text-[11px] font-bold text-sky-600 hover:text-sky-800 inline-flex items-center space-x-1"
                      >
                        <span>Practice Unit {comp.unitNumber} Questions</span>
                        <i className="fa-solid fa-arrow-right text-[9px]"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center Copyright Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
          <p>&copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science.</p>
        </footer>
      </main>

      {/* Quick Revision Notes Study Modal */}
      {activeNotesTopic && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold border border-sky-200">
                  <i className="fa-solid fa-book-bookmark"></i>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm leading-tight">{activeNotesTopic.title}</h3>
                  <span className="text-[10px] font-semibold text-sky-600">{activeNotesTopic.unitName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveNotesTopic(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer p-1"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 text-sky-900">
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-0.5">
                  Examination Weightage
                </span>
                <p className="font-bold">{activeNotesTopic.weightage}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Core Points to Write in Exam
                </span>
                <ul className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {activeNotesTopic.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-700 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium text-slate-800">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 text-amber-900">
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block mb-0.5 flex items-center space-x-1">
                  <i className="fa-solid fa-award text-amber-600"></i>
                  <span>Examiner Tip &amp; Presentation</span>
                </span>
                <p className="text-[11px] leading-relaxed font-medium">{activeNotesTopic.boardExamTips}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Link
                href={`/practice?unit=${activeNotesTopic.unitNumber}`}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs"
              >
                Practice Unit {activeNotesTopic.unitNumber} MCQs
              </Link>
              <button
                type="button"
                onClick={() => setActiveNotesTopic(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Close Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentShell>
  );
}
