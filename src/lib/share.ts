import type { Frase } from './types'

export type ResultadoCompartir = 'compartido' | 'copiado' | 'cancelado'

export function textoCompartido(frase: Frase): string {
  return `«${frase.texto}»\n— ${frase.autor} (${frase.fuente})\n\n${frase.reflexion}\n\nLightArrow`
}

export async function compartir(frase: Frase): Promise<ResultadoCompartir> {
  const texto = textoCompartido(frase)

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ text: texto, title: 'LightArrow' })
      return 'compartido'
    } catch {
      return 'cancelado'
    }
  }

  try {
    await navigator.clipboard.writeText(texto)
    return 'copiado'
  } catch {
    return 'cancelado'
  }
}
