import { fechaAnterior } from './daily'
import type { Nota, Racha } from './types'

const PREFIJO = 'lightarrow:'

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = localStorage.getItem(PREFIJO + clave)
    if (!crudo) return porDefecto
    return JSON.parse(crudo) as T
  } catch {
    return porDefecto
  }
}

function escribir(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(valor))
  } catch {
    // Sin espacio o modo privado: la app sigue funcionando, solo no persiste.
  }
}

export function getFavoritos(): string[] {
  return leer<string[]>('favoritos', [])
}

export function esFavorito(id: string): boolean {
  return getFavoritos().includes(id)
}

export function alternarFavorito(id: string): string[] {
  const actuales = getFavoritos()
  const siguientes = actuales.includes(id)
    ? actuales.filter((f) => f !== id)
    : [id, ...actuales]
  escribir('favoritos', siguientes)
  return siguientes
}

export function getNotas(): Record<string, Nota> {
  return leer<Record<string, Nota>>('notas', {})
}

export function getNota(fecha: string): Nota | undefined {
  return getNotas()[fecha]
}

export function guardarNota(fecha: string, fraseId: string, texto: string): void {
  const notas = getNotas()
  const limpio = texto.trim()
  if (!limpio) {
    delete notas[fecha]
  } else {
    notas[fecha] = { fecha, fraseId, texto: limpio, actualizada: new Date().toISOString() }
  }
  escribir('notas', notas)
}

/** Suma un día si la última visita fue ayer; reinicia si hubo un hueco. */
export function registrarVisita(hoy: string): Racha {
  const racha = leer<Racha>('racha', { ultima: '', dias: 0 })
  if (racha.ultima === hoy) return racha

  const dias = racha.ultima === fechaAnterior(hoy) ? racha.dias + 1 : 1
  const nueva: Racha = { ultima: hoy, dias }
  escribir('racha', nueva)
  return nueva
}

export function getRacha(): Racha {
  return leer<Racha>('racha', { ultima: '', dias: 0 })
}
