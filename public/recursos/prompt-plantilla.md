# Prompt plantilla: video de demostración de producto con Remotion

> **Cómo usarlo:** copia todo lo que está dentro del bloque de abajo y pégalo en Claude Code, abierto en la carpeta de trabajo. Antes de pegarlo, reemplaza cada `{{...}}` con los datos de tu marca y tu producto. Lo que está entre `[corchetes]` es opcional: déjalo, ajústalo o bórralo.
>
> Este prompt reúne lo que aprendimos al hacer el video de EmberLab: qué funcionó, qué hubo que corregir y en qué momentos conviene pedir aprobación antes de seguir.

---

```text
Crea un video de demostración de producto con Remotion para {{MARCA}}, al estilo de los
videos con que las empresas de software presentan algo nuevo: la interfaz animada en
primer plano, movimientos de cámara hacia cada acción, keypoints cortos en pantalla
y la marca al inicio y al cierre. Debe sentirse como {{MARCA}}: {{3 ADJETIVOS DE LA MARCA,
p. ej. "tecnológico, claro y con criterio"}}. No debe sentirse como un anuncio que grita.

Explícame en simple cada cosa que hagas.

────────────────────────────────────────
0. MATERIAL (léelo completo antes de empezar)
────────────────────────────────────────
- Paleta y sistema visual oficial (tiene prioridad sobre todo lo demás):
  {{PEGA AQUÍ LA PALETA CON SUS HEX Y PARA QUÉ SE USA CADA COLOR}}
  {{TIPOGRAFÍA OFICIAL: familia, pesos, interlineado, reglas (p. ej. "solo Poppins,
    títulos Bold 700, nunca serif, nunca cursivas")}}
  {{REGLAS DE COLOR (p. ej. "nunca combinar rojo con verde", "pocos colores por placa")}}
- Manual de marca: {{RUTA AL PDF}}. Úsalo para la voz, el símbolo y los principios
  visuales. Si contradice la paleta oficial de arriba, manda la paleta oficial.
- Producto: {{URL DEL PRODUCTO}} (y las páginas enlazadas si hace falta). De ahí salen
  qué es, para quién es, sus funciones reales, sus textos y cómo se ven sus pantallas.
- Logos: {{RUTA A LOS LOGOS EN SVG}}. Si no los tienes, sácalos del SVG de la web en la mejor
  calidad disponible.
- Fuentes: {{RUTA A LOS ARCHIVOS DE FUENTE}}, o el nombre en Google Fonts. Si la fuente no está
  en Google Fonts ni en la carpeta, pídemela antes de sustituirla.
- [Videos o capturas de casos/proyectos: {{RUTA}}. Úsalos en vez de bajarlos de la web.]
- Si no puedes entrar a la web, avísame y detente: el manual alcanza para la marca,
  pero no para el producto.

Antes de animar, mándame un resumen corto con:
- Qué es el producto y para quién es.
- Las 2 funciones reales que vas a mostrar.
- Los textos reales que vas a usar.
- La paleta y la tipografía que vas a aplicar.

────────────────────────────────────────
1. REGLAS DE CONTENIDO
────────────────────────────────────────
- Usa solo funciones, textos y datos reales de la web o del manual. No inventes
  funciones, precios, cifras, testimonios ni promesas.
- Keypoints, no párrafos: cada momento tiene como máximo un título corto (2–4 palabras).
  Si una idea necesita más texto, muéstrala con una animación en vez de escribirla.
- Una idea por placa y un elemento gráfico protagonista por placa.
- Si muestras herramientas de terceros (videollamada, correo, calendario), recrea una
  versión genérica con los colores de la marca. No imites interfaces ni logos ajenos.
- No muestres personas reales ni nombres de clientes que no estén en la web.

────────────────────────────────────────
2. PROYECTO
────────────────────────────────────────
Dentro de la carpeta de trabajo, crea una carpeta "{{nombre-del-proyecto}}" con un proyecto
de Remotion en TypeScript. Usa "assets" como carpeta pública (logos, fuentes, capturas,
audio, videos) y crea una carpeta "Renders" para los resultados.
Pon todos los tiempos en un solo archivo de guion (timeline.ts): la animación y el audio
deben leer los mismos frames para quedar sincronizados.

────────────────────────────────────────
3. GUION (horizontal 1920×1080 y vertical 1080×1920, 30 fps, {{18–25}} s)
────────────────────────────────────────
a) Entrada de marca (≈1.5 s): solo el logo, con una animación de {{CONCEPTO DE MARCA, p. ej.
   "una chispa recorre una mecha y lo enciende"}}. Suena el tag sonoro, sin música
   debajo. Termina con una salida que dé paso al producto.
b) El producto (≈3 s): la interfaz entra en un marco de navegador con perspectiva sutil,
   junto a un keypoint grande con el nombre del producto.
c) Las acciones (≈5 s): la ventana crece hasta ocupar casi toda la pantalla y la cámara
   se acerca a cada acción real: cursor, clic con un pequeño zoom, el elemento que
   cambia de estado. Pon un keypoint por acción en un panel sólido que no tape la acción.
d) El resultado de la acción (≈2.5 s): qué pasa después (p. ej. "la cita queda agendada":
   llega la invitación, se dibuja un check).
e) La experiencia (≈3 s): el momento de uso real (p. ej. la reunión), con los pasos del
   servicio como keypoints que aparecen y se quedan en pantalla para poder leerlos.
f) Prueba (≈4 s): primero un título enorme a pantalla completa y luego muchos casos a la
   vez (un muro de videos o capturas), no uno por uno.
g) Cierre de marca (≈4 s): el logo con la misma animación de la entrada, el lema
   y el llamado a la acción con la URL. Al final sale con su efecto.

Reglas visuales:
- Recrea la interfaz como componentes de React basados en las pantallas reales, para que
  se vea nítida al hacer zoom. Usa las capturas solo como referencia.
- Movimiento: spring() con buen amortiguamiento, easing suave y reveals con máscara.
  Ritmo ágil, pero dejando que cada keypoint se alcance a leer (mínimo 1 s en pantalla).
- Contraste: el logo y los textos deben leerse sin esfuerzo. Nada de halos permanentes
  ni colores de bajo contraste sobre el fondo.
- Nada de texto "fantasma" detrás de los títulos: si la interfaz tiene texto donde va un
  título, ocúltalo por completo.
- En vertical, recompone cada escena (título arriba, acción abajo); no encojas el video
  horizontal.

────────────────────────────────────────
4. AUDIO (todo sintetizado en código, sin descargar audio)
────────────────────────────────────────
Crea todos los sonidos por síntesis en código (Node o Python) y expórtalos en WAV a 48 kHz.
No uses bancos de sonidos ni samples.
- Tag sonoro de marca (lo más importante): una firma corta, única y siempre igual, de
  3 notas, una por sílaba de "{{NOMBRE DE MARCA EN SÍLABAS, p. ej. EM-BER-LAB}}", con ritmo
  corto-corto-largo y un timbre propio. Tiene dos versiones:
  · Entrada, corta (≈1.7 s).
  · Salida, larga (≈3.9 s), que termina con una chispa que rima con la entrada.
  Los dos tags suenan solos, sin música debajo, y caen exactamente con la animación del logo.
- Música ({{120}} BPM, en una tonalidad mayor o modal luminosa): electrónica tecnológica y
  moderna, con pads anchos, bajo de sintetizador, arpegio con filtro que se abre por secciones
  y percusión limpia. Construye la música a partir del motivo del tag. Debe crecer en los
  momentos clave del guion y callar antes del tag de salida.
  Evita:
  · Que suene infantil (piano eléctrico de juguete, shaker).
  · Que suene de miedo (drones graves constantes, campanas FM inarmónicas, reverb oscura).
  · Que suene muy aguda (deja el tag en un registro medio, alrededor de La♭3–Do5).
- Efectos sincronizados frame a frame: clic, apariciones afinadas a notas de la tonalidad,
  confirmación (2 notas que suben) y movimiento (un soplo de aire suave).
- Mezcla en Remotion: ≈ -14 LUFS integrados, picos por debajo de -1 dBTP, y efectos claros
  sobre la música.

Puntos de aprobación (espera mi respuesta en estos, no antes):
1. Antes de sintetizar, mándame en 4–5 líneas el plan sonoro: tonalidad, motivo y qué
   suena en cada momento.
2. Mándame el tag de entrada, el de salida y la mezcla completa en WAV. No renderices el
   video hasta que los apruebe.

────────────────────────────────────────
5. REVISIÓN
────────────────────────────────────────
Al terminar cada placa, renderiza un still de su frame más representativo
(npx remotion still) y mándamelo. Sigue trabajando sin esperar mi respuesta, salvo
que te pida cambios. Revisa tú mismo cada still buscando:
- Textos cortados o que se salen de la pantalla.
- Texto fantasma detrás de los títulos.
- Paneles que tapan la acción.
- Contraste bajo.
- Colores fuera de la paleta.

────────────────────────────────────────
6. ENTREGA
────────────────────────────────────────
- Renderiza en MP4 (H.264 + AAC):
  · Renders/{{nombre}}-horizontal.mp4 (1920×1080)
  · Renders/{{nombre}}-short.mp4 (1080×1920)
- Comprueba con ffprobe la duración, la resolución y que tenga audio. Mide los LUFS
  y los picos con ffmpeg (ebur128).
- Mándame los MP4 al chat.
```

---

## Qué cambia respecto al prompt original y por qué

| Antes | Ahora | Por qué |
|---|---|---|
| 10 s exactos | 18–25 s | En 10 s no se alcanzaban a distinguir las acciones. |
| Mucho texto en pantalla | Keypoints de 2–4 palabras | Un video de demo se entiende por acciones, no leyendo. |
| Pantalla dividida (título + navegador) en todo el video | La ventana crece y la cámara se acerca a cada acción | Dividida, las acciones se veían chicas. |
| Títulos sobre un velo degradado | Títulos en un panel sólido | Sobre la interfaz no se leían. |
| Pasos explicados con texto | Pasos dentro de una escena de uso (la reunión) | Mostrarlo funciona mejor que contarlo. |
| Proyectos uno por uno | Título grande y luego un muro con todos | Se percibe más volumen de trabajo. |
| Intro/outro con frase + logo | Solo el logo, con animación de fuego | Funciona como identificador de marca. |
| Música sin indicaciones de estilo | Tag sonoro de 3 notas, solo + música construida con ese motivo | Lo genérico no se reconoce; el tag sí. |
| Sin puntos de aprobación | Aprobación del plan sonoro y del audio antes de renderizar | Ahorra renders que después hay que rehacer. |
| Paleta inferida del manual | Paleta y tipografía oficial pegadas en el prompt | Evita usar fuentes o colores que la marca no usa en video. |
| Solo horizontal | Horizontal + Short vertical recompuesto | Redes sociales necesitan 9:16. |
