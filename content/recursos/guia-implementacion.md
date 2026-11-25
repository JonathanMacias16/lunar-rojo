# Guía de implementación: videos de demostración con Remotion

Esta guía explica cómo está armado el proyecto `emberlab-launch`, cómo producir un video nuevo a partir de él y cómo verificar que el resultado esté listo para publicar. Va de la mano con el [prompt plantilla](#prompt).

---

## 1. Requisitos

| Herramienta | Versión | Para qué | Cómo comprobarlo |
|---|---|---|---|
| Node.js | 20.19+ o 22.13+ (LTS) | Corre Remotion y los sintetizadores de audio | `node -v` |
| ffmpeg / ffprobe | cualquiera reciente | Verifica duración, audio y volumen; analiza videos | `ffprobe -version` |
| Claude Code | — | Ejecuta el prompt y edita el proyecto | — |
| Skills de Remotion | oficiales | Dan a Claude las buenas prácticas de Remotion | `npx skills add remotion-dev/skills -a claude-code -y` |

Las skills se instalan en `.claude/skills` de la carpeta de trabajo. Se cargan cuando arranca una sesión nueva de Claude Code.

---

## 2. Estructura del proyecto

```
emberlab-launch/
├── assets/                  ← carpeta pública (remotion.config.ts → setPublicDir)
│   ├── audio/brasa/         ← WAV sintetizados: musica, entrada, salida y efectos
│   ├── capturas/            ← capturas de referencia de la web
│   ├── fonts/               ← fuentes locales (si la marca no usa Google Fonts)
│   ├── logos/               ← logos en SVG
│   └── proyectos/           ← videos de casos (muro de resultados)
├── docs/                    ← esta guía y el prompt plantilla
├── Renders/                 ← MP4 y stills de salida
├── scripts/
│   ├── synth-brasa.mjs      ← sintetizador: música, tags y efectos
│   └── export-logos.mjs     ← exporta los SVG del logo
└── src/
    ├── Root.tsx             ← registra las composiciones
    ├── ui/AgendaPage.tsx    ← la interfaz del producto recreada en React
    ├── components/Logo.tsx  ← trazos SVG del logo (estrella, EMBER, LAB)
    └── brasa/               ← el video actual
        ├── timeline.ts      ← guion de tiempos: ÚNICA fuente de verdad
        ├── type.ts          ← tipografía, paleta, temas y formato vertical
        ├── parts.tsx        ← piezas reutilizables (MaskLine, EditorialTitle)
        ├── SoundTrack.tsx   ← mezcla: dónde suena cada WAV y a qué volumen
        ├── BrasaVideo.tsx   ← arma las escenas en orden
        ├── logofx/LogoFx.tsx← animaciones del logo (mecha, chispas, brasa)
        └── scenes/          ← una escena por placa
```

> La carpeta `src/scenes`, `src/Launch.tsx` y la composición `EmberlabLaunch` son la primera versión del video (25 s, con otro estilo). Se conservan como referencia, pero no se usan en la versión actual.

### Las piezas clave

**`timeline.ts`: el guion.** Aquí está el frame de cada evento: cuándo entra cada escena, cuándo hace clic el cursor, cuándo aparece cada keypoint, dónde suena cada efecto y en qué segundos crece la música. Si mueves un número aquí, se mueven la animación y el sonido juntos. **Nunca escribas un frame "suelto" dentro de una escena**: agrégalo al guion.

**`type.ts`: el sistema visual.**
- `K` es la paleta en hex. Cada color tiene un comentario que dice para qué se usa.
- `THEMES` define dos temas (`morado` y `ostion`): qué color va en fondos, títulos, acentos y logo.
- `SERIF` y `SANS` son las familias tipográficas. Hoy ambas son Poppins.
- `useVertical()` devuelve `true` en el formato 9:16. Cada escena lo usa para recomponerse.

**`ui/AgendaPage.tsx`: la interfaz recreada.** Reconstruye la página real con las medidas de una captura de 800 px de ancho y la amplía con `zoom: 2.4`, así se ve nítida al hacer zoom. Recibe sus tiempos por la prop `timing`, lo que permite reutilizarla en varios videos.

**`logofx/LogoFx.tsx`: el logo animado.** `LogoAnim` dibuja el logo centrado con una de las variantes (`mecha`, `chispas`, `brasa`), con estos parámetros:
- `ignite`: frame en que se enciende.
- `exit`: frame en que sale.
- `keepSpark`: deja la chispa encendida al final.
- Colores del tema.

**`scripts/synth-brasa.mjs`: el audio.** Todo el sonido se genera con matemática (osciladores, ruido, filtros), sin samples. Al ejecutarlo, escribe los WAV en `assets/audio/brasa/`.

---

## 3. Comandos

Todos se ejecutan dentro de `emberlab-launch/`.

```bash
npm install
```

```bash
npx remotion studio
```

Abre el editor visual en el navegador. Ahí ves cada composición, mueves la línea de tiempo y revisas frame por frame.

```bash
node scripts/synth-brasa.mjs
```

Regenera música, tags y efectos. Es necesario después de cambiar el sintetizador o los momentos musicales.

```bash
npx remotion still EmberlabBrasaMorado Renders/still.png --frame=212 --props='{"theme":"morado","logoFx":"mecha"}'
```

Renderiza un solo frame, para revisar una placa sin hacer el video completo.

```bash
npx remotion render EmberlabBrasaMorado Renders/final.mp4 --codec=h264 --audio-codec=aac --audio-bitrate=256k --props='{"theme":"morado","logoFx":"mecha"}'
```

Video horizontal final.

```bash
npx remotion render EmberlabBrasaMoradoShort Renders/short.mp4 --codec=h264 --audio-codec=aac --audio-bitrate=256k --props='{"theme":"morado","logoFx":"mecha"}'
```

Short vertical final.

```bash
npx remotion render EmberlabBrasaMorado Renders/mezcla.wav --codec=wav
```

Exporta solo el audio de la mezcla. Es rápido y sirve para aprobar el sonido antes de renderizar el video.

### Composiciones y opciones

| Composición | Formato | Uso |
|---|---|---|
| `EmberlabBrasaMorado` | 1920×1080 | Video horizontal |
| `EmberlabBrasaMoradoShort` | 1080×1920 | Shorts, Reels y TikTok |
| `EmberlabBrasaOstion` | 1920×1080 | Variante con fondo blanco ostión |
| `LogoPruebaMecha` / `LogoPruebaChispas` / `LogoPruebaBrasa` | 1920×1080, 4.5 s | Pruebas sueltas de la animación del logo |

Las opciones van por `--props`:
- `theme`: `"morado"` u `"ostion"`.
- `logoFx`: `"mecha"` o `"chispas"`.

---

## 4. Flujo de trabajo recomendado

```
1. Material      → manual, paleta oficial, URL del producto, logos, fuentes y videos
2. Resumen       → qué es el producto y las 2 funciones que se van a mostrar  ✅ aprobación
3. Plan sonoro   → tonalidad, motivo del tag y qué suena en cada momento     ✅ aprobación
4. Placas        → construir una por una y mandar un still de cada una
5. Audio         → sintetizar y mandar el tag de entrada, el de salida y la mezcla en WAV  ✅ aprobación
6. Render final  → horizontal + Short; verificar y entregar
```

Los puntos ✅ existen porque cada render completo tarda y cada cambio de audio obliga a volver a renderizar. Aprobar antes ahorra rondas.

---

## 5. Cómo adaptar el proyecto a otro producto o marca

1. **Paleta y tipografía**: edita `K`, `THEMES` y la carga de fuentes en `src/brasa/type.ts`.
   - **Fuente de Google Fonts:** usa `@remotion/google-fonts/<Familia>`.
   - **Fuente local:** usa `@remotion/fonts` con los archivos en `assets/fonts`.
2. **Logo**: reemplaza los trazos en `src/brand.ts`. `STAR_RAYS` y `STAR_SPARKLES` son las partes del símbolo; `EMBER_PATHS` y `LAB_PATHS`, las de la palabra. Las animaciones de `LogoFx` animan cada parte por separado: si tu símbolo tiene otra forma, ajusta `Star` en `components/Logo.tsx`.
3. **Interfaz del producto**: crea un componente nuevo como `ui/AgendaPage.tsx` a partir de capturas de la web real. Para obtener colores, fuentes y medidas exactas, inspecciona la página con DevTools o con un script en el navegador. Define los puntos a los que apunta el cursor en un objeto `TARGETS`.
4. **Guion**: ajusta las escenas y frames en `src/brasa/timeline.ts`, y en `BrasaVideo.tsx` agrega o quita escenas.
5. **Textos**: cada escena tiene sus keypoints escritos directamente. Usa solo textos reales del producto.
6. **Casos**: pon los videos en `assets/proyectos/` y edita la lista `P` y `WALL` en `scenes/Resultados.tsx`.
7. **Audio**:
   - Cambia `TAG_NOTES` (las 3 notas del tag) y los acordes en `scripts/synth-brasa.mjs`.
   - Alinea los momentos musicales (`START`, `GROOVE`, `PUSH1`…`OUT`) con `MUSIC` en `timeline.ts`.
   - Regenera con `node scripts/synth-brasa.mjs`.
8. **Mezcla**: ajusta los volúmenes en `src/brasa/SoundTrack.tsx`. `MASTER` sube o baja todo junto.

---

## 6. Control de calidad antes de entregar

### Imagen (revisar stills de cada placa)
- [ ] Ningún texto se corta ni se sale de la pantalla (en horizontal y en vertical).
- [ ] No hay texto "fantasma" de la interfaz detrás de los títulos.
- [ ] Los paneles de keypoints no tapan el botón o el elemento de la acción.
- [ ] El logo se lee con buen contraste y sin halos permanentes.
- [ ] Solo aparecen colores de la paleta oficial y se respetan sus reglas (p. ej. nunca rojo con verde).
- [ ] Cada keypoint queda al menos 1 segundo en pantalla.

### Sonido
- [ ] Los tags de entrada y salida suenan solos, sin música debajo.
- [ ] Cada efecto cae en su acción: clic, aparición, confirmación.
- [ ] Volumen integrado ≈ −14 LUFS y picos por debajo de −1 dBTP.

```bash
ffmpeg -hide_banner -nostats -i Renders/final.mp4 -vn -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:"
```

### Archivo
- [ ] Duración, resolución y pista de audio correctas.

```bash
ffprobe -v error -show_entries format=duration:stream=codec_type,codec_name,width,height,nb_frames -of default=nw=1 Renders/final.mp4
```

---

## 7. Lecciones aprendidas

| Problema que apareció | Causa | Solución aplicada |
|---|---|---|
| "Todo va muy rápido, no se distinguen los pasos" | 10 s para demasiadas ideas | 18–25 s y una sola idea por placa |
| Textos ilegibles sobre la interfaz | Velo degradado con poco contraste | Panel sólido morado detrás del keypoint |
| Texto fantasma detrás de los títulos | La columna de la página quedaba al 4 % de opacidad | Ocultarla por completo (opacidad 0) al hacer zoom |
| "Siempre está dividido, no se perciben las acciones" | Ventana fija a un lado | La ventana crece a pantalla completa y la cámara se acerca a cada acción |
| Música "de miedo" | Dron grave constante, campanas FM inarmónicas | Pad cálido en registro medio y timbres armónicos |
| Música "infantil" | Piano eléctrico y shaker | Pads anchos con sidechain, bajo de sintetizador, arpegio con filtro |
| Música "genérica" | Sin identidad propia | Tag sonoro de 3 notas y música construida con ese motivo |
| Tag "muy agudo" | Notas en La♭4–Do6 | Bajarlo una octava (La♭3–Do5) y oscurecer el brillo |
| Logo poco visible | Estrella #6D59A1 sobre #301F4B y halo permanente | Estrella lila sólida; el brillo solo al encenderse |
| Picos de audio en 0 dB | Bombo + golpe + riser sumados | Bajar efectos en ese punto, limitador suave en la música y volumen general (`MASTER`) |

### Detalles técnicos que conviene saber
- **Animar solo con `useCurrentFrame()` e `interpolate()`/`spring()`.** Las transiciones y animaciones de CSS no se renderizan bien en Remotion.
- **Videos de casos con `muted`.** Los MP4 de proyectos traen audio propio que ensuciaría la mezcla.
- **WAV a mano.** El encabezado necesita la etiqueta `data` en el byte 36. Si falta, ffmpeg no abre el archivo.
- **Bucles en la terminal de macOS (zsh):** `for f in $lista` no separa por espacios como en bash. Para scripts con listas de frames, usa `bash -c '...'`.
- **Objetos de estilo en TypeScript:** no repitas una propiedad (por ejemplo dos `letterSpacing`). TypeScript lo marca como error.
- **Contraste en temas claros:** los colores de acento pensados para fondo oscuro (lila) pierden contraste sobre blanco ostión. En ese tema usa el morado medio para los acentos.
