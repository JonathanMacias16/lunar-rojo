import type { Metadata } from "next"
import { ArrowRight, Check, Clapperboard, ClipboardPaste, MessageCircle, PenLine } from "lucide-react"
import { LoopVideo } from "../videos-con-remotion/Media"
import { PromptBuilder } from "./PromptBuilder"

const TITLE = "Crea el video de tu marca con IA, sin saber programar"
const DESCRIPTION =
    "Llena un formulario, copia tu prompt y pégalo en Claude. Te arma un video animado de tu marca, con música y en formato vertical para redes."

export const metadata: Metadata = {
    title: `${TITLE} · Lunar Rojo`,
    description: DESCRIPTION,
    alternates: { canonical: "/recursos/crea-tu-video" },
    openGraph: { title: TITLE, description: DESCRIPTION, url: "/recursos/crea-tu-video", type: "article", locale: "es_MX" },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

const BASE = "/recursos/videos-con-remotion"

const PASOS = [
    { icon: PenLine, title: "Cuéntanos de tu marca", text: "Llena el formulario de abajo: nombre, página web y cómo quieres que se sienta." },
    { icon: ClipboardPaste, title: "Copia y pega", text: "Copia el prompt que se arma solo y pégalo en Claude Code." },
    { icon: MessageCircle, title: "Platica con Claude", text: "Te explica cada paso, te muestra avances y te pide aprobar el sonido." },
    { icon: Clapperboard, title: "Descarga tu video", text: "Cuando te guste, te lo manda en MP4 listo para publicar." },
]

const NECESITAS = [
    "Una computadora (Mac o Windows).",
    "La app de Claude con acceso a Claude Code.",
    "Tu página web o una frase de qué ofreces.",
    "Tu logo y tus colores, si los tienes a la mano (si no, Claude los toma de tu página).",
]

const CAMBIOS = [
    "Se siente muy rápido, dale más tiempo a cada parte.",
    "No se lee bien el texto, ponlo más grande o sobre un fondo.",
    "La música suena de miedo, hazla más alegre y moderna.",
    "Suena muy infantil, quiero algo más tecnológico.",
    "Menos texto y más movimiento.",
    "Quiero que el logo se vea más grande al final.",
    "Haz también una versión vertical para Reels.",
    "Usa solo mis colores: morado y lila.",
]

const FAQ = [
    {
        q: "¿Necesito saber programar?",
        a: "No. Claude escribe y ejecuta todo el código por ti. Tú solo describes lo que quieres y apruebas lo que te muestra.",
    },
    {
        q: "¿Qué pasa si algo falla al instalar?",
        a: "Claude te dice qué pasó y qué hacer. Si te pide instalar algo (como Node.js), sigue sus pasos y avísale cuando termines. Si ves un mensaje de error, cópialo y pégaselo.",
    },
    {
        q: "¿Y si no tengo página web?",
        a: "Deja ese campo vacío y escribe en una frase qué ofreces. Claude propone colores y tipografía y te los muestra antes de usarlos.",
    },
    {
        q: "¿De dónde sale la música?",
        a: "Claude la crea desde cero con código, junto con la firma de sonido de tu marca. No descarga música de internet, así que no hay problemas de derechos con canciones de terceros.",
    },
    {
        q: "¿Cuántos cambios puedo pedir?",
        a: "Los que quieras. Cada ronda tarda lo que toma volver a generar el video. Funciona mejor pedir una o dos cosas a la vez.",
    },
    {
        q: "¿Puedo hacerlo para Reels o TikTok?",
        a: "Sí. En el formulario elige \"Vertical\" o \"Los dos\" y Claude acomoda cada escena para pantalla de celular.",
    },
]

export default function CreaTuVideo() {
    return (
        <main className="min-h-screen bg-background px-5 py-16 sm:px-8 sm:py-24">
            <article className="mx-auto max-w-5xl">
                {/* Portada */}
                <header className="grid items-center gap-10 lg:grid-cols-[1.1fr_auto]">
                    <div>
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-red-400">Recurso · Para creadores</p>
                        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
                            Crea el video de tu marca con IA.
                            <span className="block text-white/45">Sin saber programar.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                            Llena un formulario, copia tu prompt y pégalo en Claude. Te arma un video animado de tu marca, con su propio
                            sonido y en formato para redes.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#formulario"
                                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-medium text-white transition-colors hover:bg-red-400"
                            >
                                Armar mi prompt <ArrowRight className="h-4 w-4" />
                            </a>
                            <a
                                href="#como-funciona"
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-medium text-white/85 transition-colors hover:border-white/30 hover:text-white"
                            >
                                ¿Cómo funciona?
                            </a>
                        </div>
                    </div>
                    <div className="mx-auto w-[230px] rounded-[2.2rem] border border-white/15 bg-black p-2 shadow-2xl shadow-black/60">
                        <LoopVideo
                            src={`${BASE}/demo-short.mp4`}
                            poster={`${BASE}/demo-short-poster.jpg`}
                            label="Ejemplo de video vertical creado con este método"
                            className="aspect-[9/16] w-full rounded-[1.7rem]"
                        />
                    </div>
                </header>

                {/* Cómo funciona */}
                <section id="como-funciona" className="mt-28 scroll-mt-8">
                    <h2 className="text-3xl font-semibold tracking-tight text-white">Así de fácil, en 4 pasos</h2>
                    <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {PASOS.map((p, i) => (
                            <li key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                <div className="flex items-center justify-between">
                                    <p.icon className="h-6 w-6 text-red-400" aria-hidden />
                                    <span className="font-mono text-sm text-white/35">{i + 1}</span>
                                </div>
                                <p className="mt-5 font-medium text-white">{p.title}</p>
                                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.text}</p>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-10 rounded-2xl border border-white/10 p-6 sm:p-8">
                        <p className="font-medium text-white">Lo que vas a necesitar</p>
                        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                            {NECESITAS.map((n) => (
                                <li key={n} className="flex gap-3 text-white/70">
                                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C7DDA3]" aria-hidden />
                                    {n}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Ejemplo */}
                <section className="mt-28">
                    <h2 className="text-3xl font-semibold tracking-tight text-white">Así puede quedar</h2>
                    <p className="mt-3 max-w-2xl text-white/65">
                        Un ejemplo real hecho con este método: logo animado, la página en acción, frases cortas, música propia y cierre con
                        la invitación a agendar. Activa el sonido para escuchar la firma de la marca.
                    </p>
                    <LoopVideo
                        src={`${BASE}/demo-horizontal.mp4`}
                        poster={`${BASE}/demo-horizontal-poster.jpg`}
                        label="Ejemplo de video horizontal creado con este método"
                        className="mt-8 aspect-video w-full rounded-2xl border border-white/10 shadow-2xl shadow-black/60"
                    />
                </section>

                {/* Formulario */}
                <section id="formulario" className="mt-28 scroll-mt-8">
                    <h2 className="text-3xl font-semibold tracking-tight text-white">Arma tu prompt</h2>
                    <p className="mt-3 max-w-2xl text-white/65">
                        Llena lo que sepas. El prompt se escribe solo a la derecha; cuando esté listo, cópialo y pégalo en Claude Code.
                    </p>
                    <div className="mt-10">
                        <PromptBuilder />
                    </div>
                </section>

                {/* Pedir cambios */}
                <section className="mt-28">
                    <h2 className="text-3xl font-semibold tracking-tight text-white">Pide cambios con tus palabras</h2>
                    <p className="mt-3 max-w-2xl text-white/65">
                        No necesitas términos técnicos: di cómo se siente y qué quieres. Estos son cambios reales que se pidieron al hacer
                        el video de ejemplo.
                    </p>
                    <ul className="mt-8 flex flex-wrap gap-3">
                        {CAMBIOS.map((c) => (
                            <li key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/80">
                                “{c}”
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {[
                            ["Una cosa a la vez", "Uno o dos cambios por mensaje dan mejores resultados."],
                            ["Aprueba el sonido primero", "Cuando Claude te mande la música, escúchala antes de pedir el video final."],
                            ["Pide versiones para comparar", "Por ejemplo: “hazlo con fondo morado y con fondo blanco”."],
                        ].map(([t, d]) => (
                            <div key={t} className="rounded-2xl border border-white/10 p-5">
                                <p className="font-medium text-white">{t}</p>
                                <p className="mt-2 text-sm leading-relaxed text-white/60">{d}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Preguntas */}
                <section className="mt-28">
                    <h2 className="text-3xl font-semibold tracking-tight text-white">Preguntas frecuentes</h2>
                    <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10">
                        {FAQ.map((f) => (
                            <details key={f.q} className="group px-6 py-5">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white">
                                    {f.q}
                                    <span className="text-xl text-white/40 transition-transform group-open:rotate-45" aria-hidden>
                                        +
                                    </span>
                                </summary>
                                <p className="mt-3 leading-relaxed text-white/65">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* Versión técnica */}
                <aside className="mt-20 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
                    <div>
                        <p className="font-medium text-white">¿Tienes perfil técnico o quieres más control?</p>
                        <p className="mt-1 text-sm text-white/60">La versión completa incluye el prompt detallado y la guía de implementación.</p>
                    </div>
                    <a
                        href="/recursos/videos-con-remotion"
                        className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors hover:border-white/30 hover:text-white sm:mt-0"
                    >
                        Ver versión técnica <ArrowRight className="h-4 w-4" />
                    </a>
                </aside>

                <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-white/40">Lunar Rojo · El punto que no todos ven.</footer>
            </article>
        </main>
    )
}
