import { prisma } from "@/lib/prisma";

export interface TutorResponse {
  reply: string;
  sourceType: "topic_learn" | "flashcard" | "question" | "general";
  topicId?: string;
  unitNumber?: number;
}

// Common student terms mapping to syllabus keywords
const KEYWORD_MAP: Record<string, string[]> = {
  topology: ["topologies", "star", "mesh", "bus", "ring", "tree"],
  "system bus": ["data bus", "address bus", "control bus", "bus width"],
  sdlc: ["software development life cycle", "waterfall", "agile", "phases", "feasibility", "analysis"],
  duplex: ["simplex", "half duplex", "full duplex", "transmission mode"],
  osi: ["osi model", "7 layers", "tcp/ip", "transport layer", "network layer"],
  register: ["registers", "pc", "mar", "mbr", "ir", "program counter"],
  cycle: ["instruction cycle", "fetch decode execute", "fetch execute"],
  memory: ["ram", "rom", "cache", "primary memory", "secondary storage"],
  media: ["guided media", "unguided media", "twisted pair", "coaxial", "fiber optic"],
  virus: ["viruses", "worm", "malware", "antivirus", "trojan"],
  excel: ["spreadsheet", "formula", "function", "worksheet", "cell"],
  internet: ["dns", "ip address", "ipv4", "ipv6", "www", "http", "browser"],
};

export async function generateLocalTutorResponse(
  query: string,
  subjectId: string = "subj-cs-11"
): Promise<TutorResponse> {
  const cleanQuery = query.trim().toLowerCase();

  // 1. Handling Greetings & General Chit-Chat
  if (/^(hi|hello|hey|salam|assalam|aoa|help|who are you)\b/i.test(cleanQuery)) {
    return {
      reply:
        "Assalam-o-Alaikum! I am your AI Computer Science Tutor, powered by your official Punjab Board syllabus.\n\nI can explain concepts, clarify definitions, share real-world analogies, and provide board exam presentation tips for Units 1 to 10.\n\nTry asking me about:\n• Network Topologies (Star, Mesh, Ring, Bus)\n• System Bus Architecture (Data, Address, Control)\n• Transmission Modes (Simplex, Half, Full Duplex)\n• SDLC Phases & Methodologies\n• CPU Registers & Instruction Cycle\n• RAM vs ROM or Compiler vs Interpreter",
      sourceType: "general",
    };
  }

  // 2. Tokenize and clean query
  const normalizedQuery = cleanQuery.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const STOP_WORDS = new Set(["what", "is", "the", "explain", "define", "tell", "about", "describe", "difference", "between", "how", "does", "work", "and"]);
  
  const rawWords = normalizedQuery
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const strippedPhrase = normalizedQuery
    .split(/\s+/)
    .filter((w) => !STOP_WORDS.has(w))
    .join(" ")
    .trim();

  const searchTerms = new Set<string>(rawWords);

  // Check synonym mappings
  for (const [key, synonyms] of Object.entries(KEYWORD_MAP)) {
    if (normalizedQuery.includes(key) || synonyms.some((s) => normalizedQuery.includes(s))) {
      searchTerms.add(key);
      synonyms.forEach((s) => searchTerms.add(s));
    }
  }

  const termsList = Array.from(searchTerms);
  if (termsList.length === 0) {
    termsList.push(...normalizedQuery.split(/\s+/).filter((w) => w.length > 2));
  }

  // 3. Search Topics & TopicLearnContent in the Database with Scored Relevance
  const candidateTopics = await prisma.topic.findMany({
    where: {
      Chapter: { subjectId },
      OR: termsList.map((t) => ({
        OR: [
          { title: { contains: t } },
          { Chapter: { title: { contains: t } } },
        ],
      })),
    },
    include: {
      Chapter: true,
      TopicLearnContent: true,
      Flashcard: {
        where: { published: true },
        take: 1,
      },
    },
  });

  if (candidateTopics.length > 0) {
    // Score each candidate to find the most relevant topic
    const scored = candidateTopics.map((topic) => {
      let score = 0;
      const titleLower = topic.title.toLowerCase();
      const chapterLower = topic.Chapter.title.toLowerCase();
      const defLower = (topic.TopicLearnContent?.definitionEnglish || "").toLowerCase();
      const easyLower = (topic.TopicLearnContent?.easyExplanationEnglish || "").toLowerCase();

      // Bonus if stripped core phrase matches topic title
      if (strippedPhrase.length > 3 && titleLower.includes(strippedPhrase)) {
        score += 35;
      }

      for (const term of termsList) {
        const tLower = term.toLowerCase();
        if (titleLower.includes(tLower)) score += 8;
        if (defLower.includes(tLower) || easyLower.includes(tLower)) score += 3;
        if (chapterLower.includes(tLower)) score += 1;
      }

      return { topic, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topTopic = scored[0].topic;
    const learn = topTopic.TopicLearnContent;
    const unitNum = topTopic.Chapter.chapterNumber;
    const topicTitle = topTopic.title.replace(/^Topic\s*[\d\.]+:\s*/i, "");

    let responseText = `**${topicTitle}** (Unit ${unitNum}: ${topTopic.Chapter.title.replace(/^Unit\s*\d+:\s*/i, "")})\n\n`;

    if (learn?.easyExplanationEnglish || learn?.definitionEnglish) {
      responseText += `**Core Definition:**\n${learn.definitionEnglish || learn.easyExplanationEnglish}\n\n`;
    }

    if (Array.isArray(learn?.rubricKeywords) && learn.rubricKeywords.length > 0) {
      responseText += `**Key Board Exam Points:**\n`;
      learn.rubricKeywords.slice(0, 4).forEach((kw) => {
        responseText += `• ${kw}\n`;
      });
      responseText += "\n";
    }

    if (learn?.realWorldEnglish) {
      responseText += `**Real-World Example:**\n${learn.realWorldEnglish}\n\n`;
    }

    if (learn?.solutionGuidance) {
      responseText += `**Examiner Presentation Tip:**\n${learn.solutionGuidance}\n\n`;
    } else {
      responseText += `**Board Exam Tip:**\nAlways draw a neat block diagram, highlight keywords with headings, and clearly state practical examples to secure maximum marks.\n\n`;
    }

    if (topTopic.Flashcard.length > 0) {
      responseText += `**Quick Review Takeaway:**\n${topTopic.Flashcard[0].hint || topTopic.Flashcard[0].back.slice(0, 150)}...`;
    }

    return {
      reply: responseText.trim(),
      sourceType: "topic_learn",
      topicId: topTopic.id,
      unitNumber: unitNum,
    };
  }

  // 4. Search Flashcards in Database
  const matchedFlashcards = await prisma.flashcard.findMany({
    where: {
      published: true,
      Topic: { Chapter: { subjectId } },
      OR: termsList.map((t) => ({
        OR: [
          { front: { contains: t } },
          { back: { contains: t } },
        ],
      })),
    },
    include: {
      Topic: {
        include: { Chapter: true },
      },
    },
    take: 1,
  });

  if (matchedFlashcards.length > 0) {
    const fc = matchedFlashcards[0];
    const unitNum = fc.Topic.Chapter.chapterNumber;

    return {
      reply: `**${fc.front}** (Unit ${unitNum})\n\n**Model Answer:**\n${fc.back}\n\n${
        fc.hint ? `**Key Takeaway / Tip:**\n${fc.hint}` : ""
      }`.trim(),
      sourceType: "flashcard",
      topicId: fc.topicId,
      unitNumber: unitNum,
    };
  }

  // 5. Search Questions in Database
  const matchedQuestions = await prisma.question.findMany({
    where: {
      Chapter: { subjectId },
      OR: termsList.map((t) => ({
        OR: [
          { text: { contains: t } },
          { explanation: { contains: t } },
        ],
      })),
    },
    include: {
      Chapter: true,
      QuestionOption: true,
    },
    take: 1,
  });

  if (matchedQuestions.length > 0) {
    const q = matchedQuestions[0];
    const correctOpt = q.QuestionOption.find((o) => o.isCorrect);

    let qText = `**Punjab Board Question (Unit ${q.Chapter.chapterNumber}):**\n${q.text}\n\n`;
    if (correctOpt) {
      qText += `**Correct Concept:** ${correctOpt.text}\n\n`;
    }
    if (q.explanation) {
      qText += `**Official Explanation:**\n${q.explanation}`;
    }

    return {
      reply: qText.trim(),
      sourceType: "question",
      unitNumber: q.Chapter.chapterNumber,
    };
  }

  // 6. Helpful Fallback with Syllabus Guidance
  return {
    reply: `I could not find an exact match for "${query}" in the Class 11 Punjab Board syllabus database.\n\nPlease check your spelling or try asking about specific textbook topics like:\n• **Unit 1**: SDLC Phases, Software Types\n• **Unit 2**: Star vs Mesh Topology, OSI Model Layers\n• **Unit 3**: Simplex vs Duplex, Guided vs Unguided Media\n• **Unit 5**: System Bus, Instruction Cycle, CPU Registers\n• **Unit 6 & 7**: Computer Viruses, Windows OS Functions\n• **Unit 8, 9 & 10**: Word, Excel Formulas, DNS & Internet Protocols`,
    sourceType: "general",
  };
}
