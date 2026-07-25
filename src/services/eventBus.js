// =====================================================================
// EVENT BUS (EVENT-DRIVEN ARCHITECTURE FOR HB JEWELRY KOS)
// =====================================================================

class EventBusService {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    console.log(`[EventBus] Event Dispatched: "${event}"`, data);
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export const eventBus = new EventBusService();
