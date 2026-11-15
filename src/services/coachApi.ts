import { HistoryEntry } from '../types/coach';

export const SYSTEM_PROMPT =
  'You are First-Step Coach. Your only job is to provide exactly ONE tiny next action (under 30 minutes) to help the user start learning their goal. Never give a roadmap. Be extremely concise. If the user says "Stuck", shrink the current step into an even smaller micro-step. Always respond with just the action, no explanations, no markdown, no quotes.';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function buildCoachMessages(
  goal: string,
  history: HistoryEntry[],
  userMessage: string,
): ChatMessage[] {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `My learning goal is: "${goal}". Please give me the very first tiny action to start.`,
    },
  ];

  for (const entry of history) {
    messages.push({
      role: 'user',
      content: entry.action === 'didIt' ? 'Did it' : 'Stuck',
    });
  }

  messages.push({ role: 'user', content: userMessage });
  return messages;
}

export async function requestCoachStep(messages: ChatMessage[]): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.3,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  console.log("Groq Response:", JSON.stringify(data, null, 2)); 
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    console.error("Missing content. Full data:", data); 
    throw new Error('Unexpected empty response from coaching service.');
  }

  return content.trim();
}
