import { useEffect, useState } from 'react'
import { getNota, guardarNota } from '../lib/storage'

interface Props {
  fecha: string
  fraseId: string
  pregunta: string
}

export function Reflexion({ fecha, fraseId, pregunta }: Props) {
  const [texto, setTexto] = useState(() => getNota(fecha)?.texto ?? '')
  const [estado, setEstado] = useState<'inicial' | 'guardando' | 'guardado'>('inicial')

  useEffect(() => {
    const guardado = getNota(fecha)?.texto ?? ''
    if (texto.trim() === guardado) {
      setEstado('inicial')
      return
    }

    setEstado('guardando')
    const temporizador = window.setTimeout(() => {
      guardarNota(fecha, fraseId, texto)
      setEstado('guardado')
    }, 700)

    return () => window.clearTimeout(temporizador)
  }, [texto, fecha, fraseId])

  return (
    <section className="reflexion">
      <h2 className="reflexion__titulo">Para hoy</h2>
      <p className="reflexion__pregunta">{pregunta}</p>

      <textarea
        className="reflexion__campo"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe sin filtro. Solo lo verás tú."
        rows={4}
        aria-label="Tu reflexión de hoy"
      />

      <div className="reflexion__pie">
        <span className="reflexion__estado" aria-live="polite">
          {estado === 'guardando' ? 'Guardando…' : estado === 'guardado' ? 'Guardado' : ''}
        </span>
        <span className="reflexion__privacidad">Se queda en este dispositivo</span>
      </div>
    </section>
  )
}
