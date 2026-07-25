/* src/services/openaiService.js */

/**
 * Helper utilities to call OpenAI API for language detection and translation.
 * They are optional – if REACT_APP_OPENAI_API_KEY is not set, the functions will
 * reject so callers can fallback to the simple keyword detector.
 */

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

/** Detect language of a short text (es|en). Returns a promise that resolves to the language code */
export async function detectLanguageOpenAI(text) {
  if (!OPENAI_API_KEY) throw new Error("OpenAI API key not configured");
  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        { role: "system", content: "You are a language detector. Respond only with the ISO 639‑1 code of the language (es or en) for the given user message." },
        { role: "user", content: text },
      ],
    }),
  });
  if (!response.ok) throw new Error("OpenAI detection request failed");
  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content?.trim().toLowerCase();
  return answer === "es" ? "es" : "en";
}

/** Translate a text to the opposite language (es ↔ en). */
export async function translateOpenAI(text, targetLang) {
  if (!OPENAI_API_KEY) throw new Error("OpenAI API key not configured");
  const prompt = `Translate the following text to ${targetLang === "es" ? "Spanish" : "English"} preserving any technical terms, keep it concise, and respond only with the translated text.\n\n"${text}"`;
  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) throw new Error("OpenAI translation request failed");
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}
