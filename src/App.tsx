import { useEffect, useMemo, useState } from 'react'
import { Explorar } from './components/Explorar'
import { Favoritos } from './components/Favoritos'
import { QuoteCard } from './components/QuoteCard'
import { Reflexion } from './components/Reflexion'
import { Tabs, type Tab } from './components/Tabs'
import { FRASES } from './data/frases'
import { fechaLocal, fraseDelDia } from './lib/daily'
import { compartir } from './lib/share'
import { alternarFavorito, getFavoritos, registrarVisita } from './lib/storage'
import type { Frase, Racha } from './lib/types'

export default function App() {
  const hoy = useMemo(() => new Date(), [])
  const fecha = fechaLocal(hoy)
  const frase = useMemo(() => fraseDelDia(FRASES, hoy), [hoy])

  const [tab, setTab] = useState<Tab>('hoy')
  const [favoritos, setFavoritos] = useState<string[]>(getFavoritos)
  const [racha] = useState<Racha>(() => registrarVisita(fecha))
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [tab])

  function avisar(mensaje: string) {
    setAviso(mensaje)
    window.setTimeout(() => setAviso(''), 2200)
  }

  function manejarFavorito(id: string) {
    const siguientes = alternarFavorito(id)
    setFavoritos(siguientes)
    avisar(siguientes.includes(id) ? 'Guardada' : 'Quitada de guardadas')
  }

  async function manejarCompartir(f: Frase) {
    const resultado = await compartir(f)
    if (resultado === 'copiado') avisar('Copiada al portapapeles')
  }

  const fechaLarga = useMemo(() => {
    const texto = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(hoy)
    return texto.charAt(0).toUpperCase() + texto.slice(1)
  }, [hoy])

  return (
    <div className="app">
      <header className="cabecera">
        <span className="marca">
          <span className="marca__flecha" aria-hidden="true">
            ↗
          </span>
          LightArrow
        </span>
        {racha.dias > 0 && (
          <span className="racha" title="Días seguidos abriendo la app">
            {racha.dias} {racha.dias === 1 ? 'día' : 'días'}
          </span>
        )}
      </header>

      {tab === 'hoy' && (
        <main className="vista">
          <p className="fecha">{fechaLarga}</p>

          <div key={frase.id} className="entrada">
            <QuoteCard
              frase={frase}
              favorito={favoritos.includes(frase.id)}
              onFavorito={manejarFavorito}
              onCompartir={manejarCompartir}
            />
          </div>

          <Reflexion fecha={fecha} fraseId={frase.id} pregunta={frase.reflexion} />

          <p className="nota-legal">
            Frases de dominio público, con traducción propia. Las marcadas como «atribuida» no
            tienen fuente primaria verificada.
          </p>
        </main>
      )}

      {tab === 'explorar' && (
        <main>
          <Explorar
            frases={FRASES}
            favoritos={favoritos}
            onFavorito={manejarFavorito}
            onCompartir={manejarCompartir}
          />
        </main>
      )}

      {tab === 'favoritos' && (
        <main>
          <Favoritos
            frases={FRASES}
            favoritos={favoritos}
            onFavorito={manejarFavorito}
            onCompartir={manejarCompartir}
          />
        </main>
      )}

      {aviso && (
        <div className="aviso" role="status">
          {aviso}
        </div>
      )}

      <Tabs activa={tab} onCambiar={setTab} />
    </div>
  )
}
