// =====================================================================
// AGENT RUNTIME & CONVERSATIONAL CONTEXT MEMORY
// =====================================================================

export const AgentRuntime = {
  activeAgents: {
    guillermo_ai: { name: 'Guillermo AI Avatar', role: 'Sales & Presentation', status: 'ACTIVE' },
    whatsapp_sales_agent: { name: 'WhatsApp Sales Bot $0', role: 'Customer Service & Quotes', status: 'ACTIVE' }
  },
  
  conversationMemory: {},

  saveCustomerContext(customerId, contextData) {
    if (!this.conversationMemory[customerId]) {
      this.conversationMemory[customerId] = [];
    }
    this.conversationMemory[customerId].push({ ...contextData, timestamp: Date.now() });
    console.log(`[AgentRuntime] Contexto conversacional guardado para cliente ${customerId}`);
  },

  getCustomerContext(customerId) {
    return this.conversationMemory[customerId] || [];
  }
};
