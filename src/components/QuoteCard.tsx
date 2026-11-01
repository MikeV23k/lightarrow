import { CATEGORIAS, type Frase } from '../lib/types'

interface Props {
  frase: Frase
  favorito: boolean
  compacta?: boolean
  onFavorito: (id: string) => void
  onCompartir: (frase: Frase) => void
}

export function QuoteCard({ frase, favorito, compacta = false, onFavorito, onCompartir }: Props) {
  return (
    <article className={compacta ? 'quote quote--compacta' : 'quote'}>
      <span className="chip">{CATEGORIAS[frase.categoria]}</span>

      <blockquote className="quote__texto">«{frase.texto}»</blockquote>

      <div className="quote__autor">
        <strong>{frase.autor}</strong>
        <span>{frase.fuente}</span>
      </div>

      <div className="quote__acciones">
        <button
          type="button"
          className={favorito ? 'boton boton--activo' : 'boton'}
          onClick={() => onFavorito(frase.id)}
          aria-pressed={favorito}
        >
          <span aria-hidden="true">{favorito ? '★' : '☆'}</span>
          {favorito ? 'Guardada' : 'Guardar'}
        </button>

        <button type="button" className="boton" onClick={() => onCompartir(frase)}>
          <span aria-hidden="true">↗</span>
          Compartir
        </button>
      </div>
    </article>
  )
}
