import type { Frase } from './types'

/** Fecha local en formato YYYY-MM-DD. Nunca UTC: en España el día cambiaría a la 01:00. */
export function fechaLocal(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dia}`
}

/** Día del año, 0-based, calculado con UTC para que el cambio de hora no lo desplace. */
export function diaDelAnio(d: Date = new Date()): number {
  const hoy = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
  const inicio = Date.UTC(d.getFullYear(), 0, 1)
  return Math.round((hoy - inicio) / 86_400_000)
}

/** PRNG determinista (mulberry32). Misma semilla, misma secuencia. */
function mulberry32(semilla: number): () => number {
  let a = semilla
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

/** Barajado Fisher-Yates con semilla. Garantiza una permutación, no colisiones. */
function barajar<T>(items: T[], semilla: number): T[] {
  const salida = [...items]
  const azar = mulberry32(semilla)
  for (let i = salida.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1))
    const temporal = salida[i]
    salida[i] = salida[j]
    salida[j] = temporal
  }
  return salida
}

const cache = new Map<number, Frase[]>()

/** Orden del año: cada frase aparece una vez antes de repetir, y cambia cada 1 de enero. */
export function ordenDelAnio(frases: Frase[], anio: number): Frase[] {
  const guardado = cache.get(anio)
  if (guardado && guardado.length === frases.length) return guardado
  const orden = barajar(frases, anio * 2654435761)
  cache.set(anio, orden)
  return orden
}

export function fraseDelDia(frases: Frase[], d: Date = new Date()): Frase {
  const orden = ordenDelAnio(frases, d.getFullYear())
  return orden[diaDelAnio(d) % orden.length]
}

/** Siguiente/anterior dentro del orden del año, para explorar sin salir del ciclo. */
export function fraseDesplazada(
  frases: Frase[],
  d: Date,
  desplazamiento: number,
): Frase {
  const orden = ordenDelAnio(frases, d.getFullYear())
  const base = diaDelAnio(d) + desplazamiento
  const i = ((base % orden.length) + orden.length) % orden.length
  return orden[i]
}

/** Día anterior a una fecha YYYY-MM-DD. */
export function fechaAnterior(fecha: string): string {
  const [y, m, d] = fecha.split('-').map(Number)
  const anterior = new Date(y, m - 1, d - 1)
  return fechaLocal(anterior)
}
