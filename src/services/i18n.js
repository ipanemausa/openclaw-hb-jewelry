/* src/services/i18n.js */

/**
 * Minimal i18n helper used by the UI.
 * It currently returns the same string (Spanish) for any key, but the
 * structure allows future expansion to multiple languages.
 */

const translations = {
  es: {
    // UI strings – keys match the text used in the components.
    chatHeaderAgent: 'Agente Activo:',
    modeLanguage: 'Modo Idioma:',
    mirror: '🪞 Espejo (Mismo Idioma)',
    translator: '🌐 Traductor (ES/EN)',
    send: 'Enviar',
    placeholder: 'Escribe tu mensaje...',
    loadingMCP: 'Pensando...',
    loadingGemini: '⏳ Gemini procesando...'
  },
  en: {
    chatHeaderAgent: 'Active Agent:',
    modeLanguage: 'Language Mode:',
    mirror: '🪞 Mirror (Same Language)',
    translator: '🌐 Translator (EN/ES)',
    send: 'Send',
    placeholder: 'Type your message...',
    loadingMCP: 'Thinking...',
    loadingGemini: '⏳ Gemini processing...'
  }
};

// Detect UI language – for now we default to Spanish.
const uiLang = 'es';

export function t(key) {
  return translations[uiLang][key] || key;
}
