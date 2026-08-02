/**
 * HB JEWELRY GLOBAL ERROR TRACKER ENTERPRISE (2026.7.1)
 * Captura errores JS globales, promesas no manejadas y excepciones en tiempo de ejecución.
 */

export const initErrorTracker = () => {
  if (typeof window === 'undefined') return;

  const errorLogs = [];

  window.onerror = (message, source, lineno, colno, error) => {
    const payload = {
      type: 'UNCAUGHT_EXCEPTION',
      message: String(message),
      source,
      lineno,
      colno,
      stack: error ? error.stack : null,
      timestamp: new Date().toISOString()
    };
    errorLogs.push(payload);
    console.error('[ERROR_TRACKER]', payload);
    window.__HB_ERROR_LOGS__ = errorLogs;
    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    const payload = {
      type: 'UNHANDLED_PROMISE_REJECTION',
      reason: String(event.reason),
      timestamp: new Date().toISOString()
    };
    errorLogs.push(payload);
    console.error('[ERROR_TRACKER_PROMISE]', payload);
    window.__HB_ERROR_LOGS__ = errorLogs;
  });

  console.log('[ERROR_TRACKER] Sistema de telemetría de errores activo.');
};
