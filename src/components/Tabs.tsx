export type Tab = 'hoy' | 'explorar' | 'favoritos'

interface Props {
  activa: Tab
  onCambiar: (tab: Tab) => void
}

const PESTANAS: { id: Tab; icono: string; etiqueta: string }[] = [
  { id: 'hoy', icono: '☀', etiqueta: 'Hoy' },
  { id: 'explorar', icono: '☰', etiqueta: 'Explorar' },
  { id: 'favoritos', icono: '★', etiqueta: 'Guardadas' },
]

export function Tabs({ activa, onCambiar }: Props) {
  return (
    <nav className="tabs" aria-label="Secciones">
      <div className="tabs__inner">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={p.id === activa ? 'tab tab--activa' : 'tab'}
            onClick={() => onCambiar(p.id)}
            aria-current={p.id === activa ? 'page' : undefined}
          >
            <span className="tab__icono" aria-hidden="true">
              {p.icono}
            </span>
            <span className="tab__etiqueta">{p.etiqueta}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
