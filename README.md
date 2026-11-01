# LightArrow

Una frase al día para pensar mejor y actuar distinto.

PWA instalable en Android. Funciona sin conexión, sin cuentas y sin servidor.

**App:** https://mikev23k.github.io/lightarrow/

---

## Qué hace

- **Frase del día.** Una sola, elegida de forma determinista por la fecha. Cambia a
  medianoche y no se repite hasta agotar el ciclo del año.
- **Reflexión.** Cada frase trae una pregunta y un cuadro para escribir. Se guarda
  sola, en el propio teléfono.
- **Guardadas.** Las frases que te golpean, a un toque.
- **Explorar.** Las 90 frases, filtradas por categoría.
- **Racha.** Días seguidos abriendo la app.
- **Offline.** Después de la primera visita funciona en modo avión.

## Instalar en Android

1. Abre la URL en Chrome.
2. Menú (⋮) → **Instalar aplicación** o **Añadir a pantalla de inicio**.
3. Se abre a pantalla completa, sin barra del navegador.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173/lightarrow/
npm run build    # compila a dist/
npm run preview  # sirve dist/ en el puerto 4173
```

Los iconos se generan con `scripts/generar-iconos.ps1` (Windows, System.Drawing).

## Estructura

```
src/
  data/frases.ts        # las 90 frases: texto, autor, fuente, categoría, reflexión
  lib/daily.ts          # fecha local + barajado determinista por año
  lib/storage.ts        # localStorage tipado: favoritos, notas, racha
  lib/share.ts          # Web Share API con copia al portapapeles como respaldo
  components/           # tarjeta, reflexión, pestañas, explorar, guardadas
```

### Cómo se elige la frase del día

No hay servidor. Se baraja la lista con una semilla derivada del año (Fisher-Yates
con PRNG mulberry32) y se indexa por el día del año. Eso garantiza que **cada frase
salga una vez antes de repetirse** y que el orden cambie cada 1 de enero.

La fecha se construye en hora local a propósito: usar UTC haría que la frase
cambiara a la 01:00 o 02:00 en España, no a medianoche.

## Contenido y derechos

- Biblia en **Reina-Valera 1909** (dominio público). La RVR1960 está protegida.
- Filósofos y literatura clásica: originales en dominio público, traducción propia.
- Las frases marcadas como «atribuida» no tienen fuente primaria verificada y se
  señalan como tales en lugar de inventarles una.
- Citas modernas (siglo XX): fragmentos cortos con atribución.

## Notas

- Repo público porque GitHub Pages gratuito lo exige en cuentas gratuitas.
- Sin notificaciones push: sin servidor no hay forma fiable de programarlas.
  La frase se ve al abrir la app.
