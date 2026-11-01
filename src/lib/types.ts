export type Categoria = 'estoicismo' | 'filosofia' | 'biblia' | 'literatura' | 'voces'

export interface Frase {
  id: string
  texto: string
  autor: string
  fuente: string
  categoria: Categoria
  reflexion: string
}

export interface Nota {
  fecha: string
  fraseId: string
  texto: string
  actualizada: string
}

export interface Racha {
  ultima: string
  dias: number
}

export const CATEGORIAS: Record<Categoria, string> = {
  estoicismo: 'Estoicismo',
  filosofia: 'Filosofía',
  biblia: 'Biblia',
  literatura: 'Literatura',
  voces: 'Voces',
}
