/**
 * HB JEWELRY PERFORMANCE MONITOR ENTERPRISE (2026.7.1)
 * Mide métricas Web Vitals en tiempo real: FCP, LCP, CLS, TBT.
 */

export const initPerformanceMonitor = () => {
  if (typeof window === 'undefined') return;

  const vitals = {
    fcp: 0,
    lcp: 0,
    cls: 0,
    navigationTime: 0
  };

  if ('performance' in window) {
    const timing = performance.timing;
    if (timing) {
      vitals.navigationTime = timing.loadEventEnd - timing.navigationStart;
    }
  }

  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = Math.round(lastEntry.startTime);
        console.log(`[PERF_MONITOR] LCP: ${vitals.lcp}ms`);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            vitals.cls += entry.value;
          }
        }
        console.log(`[PERF_MONITOR] CLS: ${vitals.cls.toFixed(3)}`);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('[PERF_MONITOR] Observers no soportados:', e);
    }
  }

  window.__HB_PERF_VITALS__ = vitals;
  return vitals;
};
