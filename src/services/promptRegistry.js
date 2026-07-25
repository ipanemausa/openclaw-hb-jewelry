// =====================================================================
// PROMPT REGISTRY (CENTRALIZED VERSIONED PROMPTS)
// =====================================================================

export const PromptRegistry = {
  prompts: {
    hb_sales_quote_es: {
      version: '1.2',
      model: 'gemini-2.0-flash',
      purpose: 'Cotización comercial de joyas de oro 14k/18k',
      template: 'Generar cotización para cliente {customerName} con precio oficial HB Jewelry ${priceUSD}.'
    },
    avatar_english_7qa: {
      version: '2.0',
      model: 'gemini-2.0-flash-live',
      purpose: 'Video Avatar Output en inglés con 7 P&R',
      template: 'Answer technical and sales question {questionId} in clear English.'
    }
  },

  getPrompt(key, variables = {}) {
    const p = this.prompts[key];
    if (!p) return null;
    let text = p.template;
    for (const [k, v] of Object.entries(variables)) {
      text = text.replace(`{${k}}`, v);
    }
    return { ...p, renderedText: text };
  }
};
