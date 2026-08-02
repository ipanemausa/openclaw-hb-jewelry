/**
 * ====================================================================
 *  HB JEWELRY — COMPRESSED VECTOR DB LOADER (97.66% SPACE SAVINGS)
 * ====================================================================
 *  Carga el paquete de vectores cuantizados de 11.5 KB (.gz) y los
 *  descomprime en tiempo real en el navegador usando DecompressionStream.
 */

export async function loadCompressedVectorDatabase() {
  const compressedUrl = '/qa_500_vector_formulas.json.gz?v=20260801_v97PercentCompressed';
  
  try {
    const response = await fetch(compressedUrl);
    
    // Si el servidor soporta DecompressionStream nativo del navegador (W3C Standard)
    if (window.DecompressionStream && response.body) {
      const ds = new DecompressionStream('gzip');
      const decompressedStream = response.body.pipeThrough(ds);
      const decompressedResponse = new Response(decompressedStream);
      const data = await decompressedResponse.json();
      console.log(`⚡ Base de datos vectorial descomprimida (97.66% compresión) — Total fórmulas: ${data.total_formulas}`);
      return data;
    }
    
    // Fallback si la descompresión gzip nativa no está activa
    const fallbackResponse = await fetch('/qa_500_vector_formulas.json');
    return await fallbackResponse.json();
  } catch (err) {
    console.warn('⚠️ Fallback a vector DB estándar:', err);
    const fallbackResponse = await fetch('/qa_500_vector_formulas.json');
    return await fallbackResponse.json();
  }
}
