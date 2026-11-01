import { useMemo } from 'react'
import type { Frase } from '../lib/types'
import { QuoteCard } from './QuoteCard'

interface Props {
  frases: Frase[]
  favoritos: string[]
  onFavorito: (id: string) => void
  onCompartir: (frase: Frase) => void
}

export function Favoritos({ frases, favoritos, onFavorito, onCompartir }: Props) {
  const lista = useMemo(() => {
    const porId = new Map(frases.map((f) => [f.id, f]))
    return favoritos
      .map((id) => porId.get(id))
      .filter((f): f is Frase => f !== undefined)
  }, [frases, favoritos])

  return (
    <section className="vista">
      <h1 className="vista__titulo">Guardadas</h1>

      {lista.length === 0 ? (
        <div className="vacio">
          <p className="vacio__titulo">Todavía no has guardado nada.</p>
          <p className="vacio__texto">
            Cuando una frase te golpee, dale a la estrella. Vuelve aquí cuando necesites recordarla.
          </p>
        </div>
      ) : (
        <>
          <p className="vista__sub">
            {lista.length} {lista.length === 1 ? 'frase guardada' : 'frases guardadas'}
          </p>
          <div className="lista">
            {lista.map((frase) => (
              <QuoteCard
                key={frase.id}
                frase={frase}
                compacta
                favorito
                onFavorito={onFavorito}
                onCompartir={onCompartir}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
