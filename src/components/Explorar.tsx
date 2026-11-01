import { useMemo, useState } from 'react'
import { CATEGORIAS, type Categoria, type Frase } from '../lib/types'
import { QuoteCard } from './QuoteCard'

interface Props {
  frases: Frase[]
  favoritos: string[]
  onFavorito: (id: string) => void
  onCompartir: (frase: Frase) => void
}

type Filtro = Categoria | 'todas'

const FILTROS: { id: Filtro; etiqueta: string }[] = [
  { id: 'todas', etiqueta: 'Todas' },
  { id: 'estoicismo', etiqueta: CATEGORIAS.estoicismo },
  { id: 'filosofia', etiqueta: CATEGORIAS.filosofia },
  { id: 'biblia', etiqueta: CATEGORIAS.biblia },
  { id: 'literatura', etiqueta: CATEGORIAS.literatura },
  { id: 'voces', etiqueta: CATEGORIAS.voces },
]

export function Explorar({ frases, favoritos, onFavorito, onCompartir }: Props) {
  const [filtro, setFiltro] = useState<Filtro>('todas')

  const lista = useMemo(
    () => (filtro === 'todas' ? frases : frases.filter((f) => f.categoria === filtro)),
    [frases, filtro],
  )

  return (
    <section className="vista">
      <h1 className="vista__titulo">Explorar</h1>
      <p className="vista__sub">{frases.length} frases. Una para cada día del año.</p>

      <div className="filtros" role="group" aria-label="Filtrar por categoría">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={filtro === f.id ? 'filtro filtro--activo' : 'filtro'}
            onClick={() => setFiltro(f.id)}
            aria-pressed={filtro === f.id}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      <div className="lista">
        {lista.map((frase) => (
          <QuoteCard
            key={frase.id}
            frase={frase}
            compacta
            favorito={favoritos.includes(frase.id)}
            onFavorito={onFavorito}
            onCompartir={onCompartir}
          />
        ))}
      </div>
    </section>
  )
}
