import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FLASHCARDS_SEED = [
  {
    id: "fc-11-01-01",
    topicId: "top-11-01-02", // Topic 1.2: SDLC
    front: "What are the 6 sequential phases of the Software Development Life Cycle (SDLC)?",
    back: "1. Preliminary Investigation (Feasibility Study)\n2. Systems Analysis (Requirements Gathering & SRS)\n3. System Design (Architectural & Database Schemas)\n4. Coding / Implementation (Writing clean modular code)\n5. Testing & Quality Assurance (Unit, Integration & System testing)\n6. Maintenance (Bug fixes, upgrades, longest phase).",
    hint: "Memorize: Investigation -> Analysis -> Design -> Coding -> Testing -> Maintenance.",
  },
  {
    id: "fc-11-01-02",
    topicId: "top-11-01-03", // Topic 1.3: Waterfall vs Agile
    front: "What is the key difference between Waterfall and Agile software development models?",
    back: "Waterfall Model: Strictly sequential and linear. Each phase must finish before the next begins. Difficult to accommodate requirement changes mid-way.\n\nAgile Model: Iterative and incremental with 2-4 week sprints. Embraces frequent changes, continuous feedback, and active customer collaboration.",
    hint: "Waterfall = Rigid & Phased; Agile = Flexible & Iterative Sprints.",
  },
  {
    id: "fc-11-02-01",
    topicId: "top-11-02-02", // Topic 2.2: Network Topologies
    front: "Why is Star topology generally preferred over Bus topology in modern LANs?",
    back: "1. Fault Isolation: In Star, if one cable or node breaks, only that node goes down; the rest of the network operates normally. In Bus, a backbone cable cut takes the entire network down.\n2. Easy Troubleshooting: Central switch/hub makes identifying faulty nodes straightforward.\n3. Scalability: Adding or removing nodes is done without interrupting active network traffic.",
    hint: "Star has central fault isolation; Bus has single point of backbone failure.",
  },
  {
    id: "fc-11-02-02",
    topicId: "top-11-02-03", // Topic 2.3: OSI Model
    front: "What is the primary function of the Transport Layer (Layer 4) in the OSI Reference Model?",
    back: "The Transport Layer provides end-to-end communication services for applications.\nKey Functions:\n1. Segmentation & Reassembly of data packets.\n2. Flow Control to prevent fast senders from overwhelming slow receivers.\n3. Error Detection & Recovery (Retransmission via TCP).\n4. Port-based Connection Management (TCP connection-oriented, UDP connectionless).",
    hint: "Transport Layer = End-to-end delivery, segmentation, flow control, port addressing (TCP/UDP).",
  },
  {
    id: "fc-11-03-01",
    topicId: "top-11-03-03", // Topic 3.3: Transmission Modes
    front: "Differentiate between Half-Duplex and Full-Duplex transmission with one real-world example of each.",
    back: "Half-Duplex: Bidirectional transmission, but only one party can transmit at any given time. Alternating flow.\nExample: Walkie-Talkie (Push-to-talk).\n\nFull-Duplex: Simultaneous bidirectional transmission. Both parties can send and receive signals at the exact same moment.\nExample: Telephone conversation, Modern Ethernet.",
    hint: "Half-Duplex = Both ways, but alternating. Full-Duplex = Both ways simultaneously.",
  },
  {
    id: "fc-11-02-03",
    topicId: "top-11-02-04", // Topic 2.4: Guided vs Unguided Media
    front: "Why is Fiber Optic cable completely immune to Electromagnetic Interference (EMI)?",
    back: "Fiber Optic cables transmit digital data in the form of light pulses through ultra-pure glass/plastic cores using total internal reflection, rather than electrical signals through copper.\nBecause no electrical currents or radio signals are used, external electromagnetic fields (high-voltage lines, lightning, motors) cannot induce noise or distort the data stream.",
    hint: "Light pulses via total internal reflection produce zero electrical induction.",
  },
  {
    id: "fc-11-05-01",
    topicId: "top-11-05-02", // Topic 5.2: Registers and Cache Memory
    front: "What is the function of the Program Counter (PC) and Memory Address Register (MAR)?",
    back: "Program Counter (PC): Holds the memory address of the next instruction to be fetched and executed. Automatically incremented after fetch.\n\nMemory Address Register (MAR): Holds the physical memory address currently being read from or written to over the address bus.",
    hint: "PC points to next instruction; MAR holds address of current memory transfer.",
  },
  {
    id: "fc-11-05-02",
    topicId: "top-11-05-04", // Topic 5.4: Instruction Cycle
    front: "What steps occur during the 'Fetch' stage of the CPU Instruction Cycle?",
    back: "1. The CPU copies the address in the Program Counter (PC) into the Memory Address Register (MAR).\n2. CPU issues a Read signal on the Control Bus.\n3. The instruction at that address is transferred across the Data Bus into the Memory Buffer Register (MBR/MDR).\n4. The instruction is copied into the Instruction Register (IR).\n5. The PC is incremented to point to the next instruction.",
    hint: "PC -> MAR -> Memory -> MBR -> IR, then PC++.",
  },
  {
    id: "fc-11-07-01",
    topicId: "top-11-07-01", // Topic 7.1: OS Functions
    front: "What are the core resource management functions performed by an Operating System?",
    back: "1. Processor Management (CPU Scheduling, multitasking).\n2. Memory Management (RAM allocation, virtual memory, paging).\n3. File System Management (Directories, file access permissions, storage).\n4. Device / I/O Management (Device drivers, buffering, spooling).\n5. Security & Protection (User authentication, access control).",
    hint: "CPU scheduling, RAM allocation, File storage, Device drivers, Security.",
  },
  {
    id: "fc-11-09-01",
    topicId: "top-11-09-02", // Topic 9.2: Formulas and Functions
    front: "What is the difference between a Formula and a Built-in Function in MS Excel?",
    back: "Formula: A user-defined mathematical expression starting with '=' that uses basic arithmetic operators (+, -, *, /) directly.\nExample: '=A1 + B1 * C1'\n\nFunction: A built-in, pre-programmed formula provided by Excel with predefined logic and syntax.\nExample: '=SUM(A1:A10)', '=AVERAGE(B1:B20)', '=IF(C1>50, \"Pass\", \"Fail\")'",
    hint: "Formula = Custom math expression; Function = Built-in pre-programmed named tool.",
  },
  {
    id: "fc-11-10-01",
    topicId: "top-11-10-01", // Topic 10.1: Internet Architecture
    front: "What is the role of DNS (Domain Name System) on the Internet?",
    back: "DNS serves as the 'Phonebook of the Internet'. It translates human-friendly alphanumeric domain names (e.g., www.biselahore.com) into numerical machine-readable IP addresses (e.g., 192.0.78.24) that routers use to locate and deliver web packets.",
    hint: "Translates human-readable domain names into machine-readable IP addresses.",
  },
  {
    id: "fc-11-06-01",
    topicId: "top-11-06-01", // Topic 6.1: Security Threats
    front: "Differentiate between a Computer Virus and a Computer Worm.",
    back: "Computer Virus: A malicious program that requires human action to propagate (e.g., executing an infected file, opening an attachment) and attaches itself to a host program or executable file.\n\nComputer Worm: A standalone self-replicating malicious program that spreads automatically across computer networks by exploiting security vulnerabilities, without requiring human execution or a host file.",
    hint: "Virus needs a host file and human trigger; Worm is standalone and self-propagating.",
  },
];

async function main() {
  console.log("Seeding authentic Class 11 CS flashcards into Flashcard table...");

  for (const fc of FLASHCARDS_SEED) {
    await prisma.flashcard.upsert({
      where: { id: fc.id },
      update: {
        front: fc.front,
        back: fc.back,
        hint: fc.hint,
        topicId: fc.topicId,
        published: true,
        verificationStatus: "VERIFIED",
        updatedAt: new Date(),
      },
      create: {
        id: fc.id,
        front: fc.front,
        back: fc.back,
        hint: fc.hint,
        topicId: fc.topicId,
        published: true,
        verificationStatus: "VERIFIED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(`✓ Seeded flashcard ${fc.id} for topic ${fc.topicId}`);
  }

  const count = await prisma.flashcard.count();
  console.log(`Successfully seeded! Total flashcards in database: ${count}`);
}

main()
  .catch((e) => {
    console.error("Error seeding flashcards:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
