import { puter } from '@heyputer/puter.js';

const DEFAULT_MODEL = 'gpt-5.4-nano';

function normalizeAIResponse(response) {
  if (!response) return '';

  if (typeof response === 'string') {
    return response.trim();
  }

  if (typeof response?.text === 'string') {
    return response.text.trim();
  }

  const content = response?.message?.content;
  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (typeof part?.text === 'string') return part.text;
        return '';
      })
      .join('\n')
      .trim();
  }

  try {
    return JSON.stringify(response, null, 2);
  } catch {
    return String(response);
  }
}

export async function askObjectQuestion(prompt, options = { limitWords: 50 }) {
  const limitWords = typeof options.limitWords === 'number' ? options.limitWords : 50;
  const message = typeof prompt === 'string' ? prompt.trim() : '';
  const wordLimitInstruction = `\n\n(Answer in ${limitWords} words or less.)`;
  const finalMessage = `${message}${wordLimitInstruction}`;
  if (!message) {
    throw new Error('Prompt is required.');
  }

  const model = options.model || DEFAULT_MODEL;
  const response = await puter.ai.chat(finalMessage, { model });
  const text = normalizeAIResponse(response);
  return text || 'No response returned.';
}