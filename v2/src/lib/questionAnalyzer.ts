/* -----------------------------------------------------------
 * Lightweight deterministic question classifier.
 * SIMPLE  → use non-AI Wikipedia retrieval (fast & free).
 * COMPLEX → fall back to existing AI flow.
 * --------------------------------------------------------- */

export type QuestionKind = 'SIMPLE' | 'COMPLEX';

const COMPLEX_PATTERNS: RegExp[] = [
  /\b(explain .* deeply|in detail|step[- ]by[- ]step)\b/i,
  /\b(compare|vs\.?|versus|difference between)\b/i,
  /\b(debug|fix this code|why (does|is) my)\b/i,
  /\b(analy[sz]e|analysis of)\b/i,
  /\b(strategy|business plan|marketing plan)\b/i,
  /\b(create|build|generate|write) (a|an|me) /i,
  /\b(how does .* (work|function) (internally|under the hood))\b/i,
  /\b(advanced|complex)\b/i,
  /\b(optimi[sz]e|refactor)\b/i,
  /\bquantum|recursion using|using .* example/i,
];

const SIMPLE_STARTERS = /^(what (is|are|was|were)|who (is|was|are|were|discovered|invented)|when (was|did)|where (is|was)|define|meaning of|definition of)\b/i;

/** Try to extract the topic of a simple question (drops the leading "what is the…"). */
export function extractTopic(question: string): string {
  let t = question.trim().replace(/[?.!]+$/g, '');
  t = t.replace(SIMPLE_STARTERS, '').replace(/^\s*(the|a|an)\s+/i, '').trim();
  // strip trailing fluff like " in simple terms"
  t = t.replace(/\s+(in simple terms|please|briefly|shortly)\s*$/i, '').trim();
  return t || question.trim();
}

/** Classify a user message. */
export function classifyQuestion(raw: string): QuestionKind {
  const q = (raw || '').trim();
  if (!q) return 'COMPLEX';

  // Complex wins if any complex pattern matches.
  for (const p of COMPLEX_PATTERNS) if (p.test(q)) return 'COMPLEX';

  const wordCount = q.split(/\s+/).length;

  // Short, definition-style → simple
  if (SIMPLE_STARTERS.test(q) && wordCount <= 12) return 'SIMPLE';

  // Single noun lookups like "photosynthesis" → simple
  if (wordCount <= 4 && /^[a-zA-Z][\w\s-]*$/.test(q)) return 'SIMPLE';

  return 'COMPLEX';
}
