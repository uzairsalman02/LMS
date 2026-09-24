/**
 * Smart Concept & Keyword Rubric Evaluator
 * 
 * Evaluates student subjective answers (Short & Long questions) against
 * official model answers and examiner explanations using local algorithmic
 * keyword extraction, synonym expansion, concept coverage, and length weighting.
 * 
 * 100% Free / Zero External API Dependency / Runs locally in Node.js.
 */

export interface EvaluationResult {
  marksObtained: number;
  maxMarks: number;
  isCorrect: boolean;
  scorePercentage: number;
  matchedConcepts: string[];
  missingConcepts: string[];
  feedbackText: string;
}

// Common Computer Science domain abbreviations and their normalized equivalents
const DOMAIN_SYNONYMS: Record<string, string[]> = {
  alu: ["arithmetic logic unit", "arithmetic unit", "math calculations"],
  cpu: ["central processing unit", "processor", "microprocessor"],
  ram: ["random access memory", "main memory", "primary storage", "volatile memory"],
  rom: ["read only memory", "non volatile memory", "firmware"],
  os: ["operating system", "system software", "windows", "linux"],
  lan: ["local area network", "local network"],
  wan: ["wide area network", "internet"],
  man: ["metropolitan area network"],
  ieee: ["institute of electrical and electronics engineers"],
  systematic: ["methodical", "structured", "organized", "step by step"],
  disciplined: ["controlled", "standardized", "rigorous", "principled"],
  quantifiable: ["measurable", "computable", "trackable", "quantified"],
  arithmetic: ["addition", "subtraction", "multiplication", "division", "math"],
  logical: ["comparison", "and", "or", "not", "decision", "condition"],
  hardware: ["physical", "tangible", "electronic components", "machinery"],
  software: ["programs", "instructions", "code", "applications", "logic"],
  volatile: ["temporary", "loses data when power off", "power dependent"],
  nonvolatile: ["permanent", "retains data", "persistent"],
};

// Common English stopwords to ignore during matching
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
  "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
  "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
  "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
  "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
  "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
  "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
  "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
  "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
  "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
  "they've", "this", "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
  "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
  "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
  "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
  "yourself", "yourselves"
]);

/**
 * Normalizes text: lowercase, strip markdown headers and formatting, remove punctuation.
 */
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[#*`_~[\]()|:;\-\\"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract tokens, filtering out stop words and short numbers.
 */
function tokenize(text: string): string[] {
  return cleanText(text)
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Extracts key phrases / concepts from the model answer and explanation.
 */
function extractModelConcepts(modelAnswer: string, explanation?: string | null): string[] {
  const combined = `${modelAnswer}\n${explanation || ""}`;
  const lines = combined.split(/\n+/);
  const concepts: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Bullet points or headers like "1. Manufacturing vs. Engineering" or "### ALU"
    const cleaned = line
      .replace(/^(\d+\.|\*|-|#+)\s*/, "")
      .replace(/:\s*$/, "")
      .trim();

    if (cleaned.length > 5 && cleaned.length < 120) {
      // Look for bold terms in markdown e.g. **Manufacturing** or key sentences
      const boldMatches = line.match(/\*\*(.*?)\*\*/g);
      if (boldMatches) {
        boldMatches.forEach((m) => {
          const term = m.replace(/\*\*/g, "").trim();
          if (term.length > 3 && !concepts.includes(term)) {
            concepts.push(term);
          }
        });
      }

      // If line is short and punchy, add whole concept
      if (cleaned.split(/\s+/).length <= 7 && !concepts.includes(cleaned)) {
        concepts.push(cleaned);
      }
    }
  }

  // If few concepts found from structure, extract high-value token clusters
  if (concepts.length < 3) {
    const tokens = tokenize(modelAnswer);
    // Take unique significant tokens
    const uniqueTokens = Array.from(new Set(tokens)).slice(0, 6);
    uniqueTokens.forEach((t) => {
      const cap = t.charAt(0).toUpperCase() + t.slice(1);
      if (!concepts.includes(cap)) concepts.push(cap);
    });
  }

  return concepts.slice(0, 6);
}

/**
 * Evaluates whether a specific concept or its synonyms are present in the student's text.
 */
function isConceptCovered(concept: string, studentTokens: Set<string>, studentRaw: string): boolean {
  const conceptClean = cleanText(concept);
  
  // Direct substring check
  if (studentRaw.includes(conceptClean)) {
    return true;
  }

  // Token overlap check
  const conceptWords = tokenize(concept);
  if (conceptWords.length === 0) return false;

  let matches = 0;
  for (const cw of conceptWords) {
    if (studentTokens.has(cw)) {
      matches++;
      continue;
    }

    // Check domain synonyms
    const syns = DOMAIN_SYNONYMS[cw] || [];
    const hasSyn = syns.some((syn) => studentRaw.includes(syn));
    if (hasSyn) {
      matches++;
      continue;
    }

    // Stemming prefix match (e.g. "program" matches "programming", "programmed")
    if (cw.length >= 5) {
      const prefix = cw.slice(0, 4);
      for (const st of studentTokens) {
        if (st.startsWith(prefix)) {
          matches++;
          break;
        }
      }
    }
  }

  // If more than 60% of words in the concept phrase matched
  return matches / conceptWords.length >= 0.6;
}

/**
 * Main Subjective Question Evaluator
 * 
 * @param studentAnswer - The text typed by the student
 * @param modelAnswer - The official model answer from Question.answer
 * @param explanation - The examiner's explanation/rubric from Question.explanation
 * @param maxMarks - Marks allocated for this question (e.g. 2 for SHORT, 5 for LONG)
 * @param questionType - "SHORT" | "LONG"
 */
export function evaluateSubjectiveAnswer(
  studentAnswer: string | null | undefined,
  modelAnswer: string | null | undefined,
  explanation: string | null | undefined,
  maxMarks: number = 2,
  questionType: "SHORT" | "LONG" = "SHORT"
): EvaluationResult {
  const cleanStudent = cleanText(studentAnswer || "");
  const studentWords = cleanStudent ? cleanStudent.split(/\s+/) : [];
  const wordCount = studentWords.length;

  // Unattempted / Blank check
  if (!cleanStudent || wordCount < 3) {
    return {
      marksObtained: 0,
      maxMarks,
      isCorrect: false,
      scorePercentage: 0,
      matchedConcepts: [],
      missingConcepts: modelAnswer ? extractModelConcepts(modelAnswer, explanation) : ["Complete Answer Required"],
      feedbackText: "Question was left blank or answered with insufficient content. Zero marks awarded.",
    };
  }

  const model = modelAnswer || explanation || "";
  const modelTokens = tokenize(model);
  const studentTokens = new Set(tokenize(cleanStudent));
  const studentRaw = cleanStudent;

  // 1. Concept Coverage Evaluation
  const targetConcepts = extractModelConcepts(model, explanation);
  const matchedConcepts: string[] = [];
  const missingConcepts: string[] = [];

  for (const concept of targetConcepts) {
    if (isConceptCovered(concept, studentTokens, studentRaw)) {
      matchedConcepts.push(concept);
    } else {
      missingConcepts.push(concept);
    }
  }

  const conceptCoverageRatio = targetConcepts.length > 0 
    ? matchedConcepts.length / targetConcepts.length 
    : 0.5;

  // 2. Vocabulary & Keyword Overlap
  let vocabOverlap = 0;
  for (const mt of modelTokens) {
    if (studentTokens.has(mt)) {
      vocabOverlap++;
    }
  }
  const vocabRatio = modelTokens.length > 0 ? Math.min(1, vocabOverlap / (modelTokens.length * 0.4)) : 0.5;

  // 3. Length & Completeness Sanity Check
  // Short questions expect ~15 to 40 words. Long questions expect ~50 to 120 words.
  const minExpectedWords = questionType === "LONG" ? 45 : 12;
  const idealWords = questionType === "LONG" ? 80 : 25;
  const lengthRatio = Math.min(1, wordCount / idealWords);

  // 4. Combined Weighting Formula
  // Concept Coverage: 60%, Vocabulary Overlap: 25%, Length/Completeness: 15%
  let rawScoreFactor = (conceptCoverageRatio * 0.60) + (vocabRatio * 0.25) + (lengthRatio * 0.15);

  // Severe penalty if word count is ridiculously low
  if (wordCount < minExpectedWords) {
    rawScoreFactor *= Math.max(0.3, wordCount / minExpectedWords);
  }

  // Calculate Marks Obtained
  // Round to nearest 0.5 for realistic board marking (e.g. 1.5/2, 4/5)
  let calculatedMarks = Math.round(rawScoreFactor * maxMarks * 2) / 2;
  calculatedMarks = Math.max(0, Math.min(maxMarks, calculatedMarks));

  // Determine feedback message
  let feedbackText = "";
  if (calculatedMarks >= maxMarks * 0.85) {
    feedbackText = "Excellent answer! Demonstrates clear conceptual understanding with relevant examiner terminology.";
  } else if (calculatedMarks >= maxMarks * 0.6) {
    feedbackText = `Good attempt. You correctly identified key points (${matchedConcepts.join(", ")}), but missed some depth in ${missingConcepts.slice(0, 2).join(", ")}.`;
  } else if (calculatedMarks >= maxMarks * 0.35) {
    feedbackText = `Partially correct. Include more specific standard definitions and details on: ${missingConcepts.slice(0, 3).join(", ")}.`;
  } else {
    feedbackText = `Needs improvement. The response lacks essential board concepts: ${missingConcepts.slice(0, 3).join(", ")}. Consult model answer.`;
  }

  const scorePercentage = Math.round((calculatedMarks / maxMarks) * 100);
  const isCorrect = calculatedMarks >= maxMarks * 0.5;

  return {
    marksObtained: calculatedMarks,
    maxMarks,
    isCorrect,
    scorePercentage,
    matchedConcepts,
    missingConcepts,
    feedbackText,
  };
}
