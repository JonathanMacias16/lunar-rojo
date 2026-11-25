"use client"

import { useMemo, useState } from "react"
import { Check, Copy } from "lucide-react"
import clsx from "clsx"

// Formulario sencillo que arma, en vivo, el prompt para Claude Code.
// La persona solo describe su marca; el prompt le pide a Claude encargarse de lo técnico.

const TONOS = ["Moderno", "Tecnológico", "Elegante", "Cercano", "Divertido", "Minimalista", "Premium", "Cálido"]
const FORMATOS = [
    { id: "horizontal", label: "Horizontal", hint: "YouTube, web, presentaciones" },
    { id: "vertical", label: "Vertical", hint: "Reels, TikTok, Shorts" },
    { id: "ambos", label: "Los dos", hint: "Un video de cada uno" },
] as const
const DURACIONES = [15, 20, 30] as const

type Formato = (typeof FORMATOS)[number]["id"]

const slug = (s: string) =>
    s
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "mi-marca"

const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors focus:border-red-400/60 focus:bg-white/[0.06]"

function buildPrompt(v: {
    marca: string
    url: string
    queHace: string
    colores: string
    fuente: string
    tonos: string[]
    formato: Formato
    duracion: number
    cta: string
    materiales: string
}) {
    const marca = v.marca.trim() || "[NOMBRE DE TU MARCA]"
    const url = v.url.trim()
    const formato =
        v.formato === "horizontal"
            ? "horizontal (1920×1080), para YouTube y web"
            : v.formato === "vertical"
              ? "vertical (1080×1920), para Reels, TikTok y Shorts"
              : "dos versiones: una horizontal (1920×1080) y una vertical (1080×1920) para Reels, TikTok y Shorts"
    const tono = v.tonos.length ? v.tonos.map((t) => t.toLowerCase()).join(", ") : "moderno y claro"
    const lines = [
        `Hola Claude. Quiero crear un video corto para presentar ${marca}. No sé programar: encárgate tú de toda la parte técnica y explícame en palabras simples cada cosa que hagas.`,
        "",
        "PASO 0 · PREPARA MI COMPUTADORA",
        "- Revisa si tengo Node.js instalado. Si no, dime cómo instalar la versión LTS desde nodejs.org y espera a que te avise.",
        `- Crea una carpeta nueva llamada "${slug(marca)}-video" e instala ahí lo necesario para hacer videos con Remotion, incluidas las skills oficiales de Remotion.`,
        "",
        "PASO 1 · CONOCE MI MARCA",
        `- Mi marca: ${marca}.${v.queHace.trim() ? ` ${v.queHace.trim()}` : ""}`,
        url
            ? `- Mi página: ${url}. Entra y revisa qué ofrezco, para quién es y cómo se ve. Si no puedes entrar, avísame.`
            : "- No tengo página web: usa la descripción de arriba.",
        "- Usa solo información real: no inventes precios, cifras, testimonios ni promesas.",
        `- Mis colores: ${v.colores.trim() || (url ? "tómalos de mi página" : "propón una paleta y muéstramela antes de usarla")}.`,
        `- Mi tipografía: ${v.fuente.trim() || (url ? "usa la de mi página" : "propón una moderna y fácil de leer")}.`,
        `- Quiero que se sienta: ${tono}.`,
        ...(v.materiales.trim() ? [`- Mis archivos (logo, manual o videos): ${v.materiales.trim()}`] : []),
        "Antes de animar, cuéntame en pocas líneas qué entendiste de mi marca y qué vas a mostrar.",
        "",
        "PASO 2 · EL VIDEO",
        `- Formato: ${formato}.`,
        `- Duración: unos ${v.duracion} segundos.`,
        "- Empieza con mi logo animado, solo, como una firma de marca.",
        "- Muestra mi producto o mi página con acercamientos a lo más importante, para que se entienda qué hace.",
        "- Usa frases cortas (máximo 4 palabras) en lugar de párrafos, y que se lean bien.",
        `- Cierra con mi logo y una invitación clara${v.cta.trim() ? `: "${v.cta.trim()}"` : ""}${url ? `, con mi dirección ${url}` : ""}.`,
        "",
        "PASO 3 · EL SONIDO",
        "- Crea una firma de sonido corta y reconocible para mi marca (como un \"ta-dum\") que suene sola al inicio y al final.",
        "- Agrega música moderna de fondo que acompañe sin tapar, y sonidos sutiles cuando algo aparece o se hace clic.",
        "- Crea todo el audio tú desde cero; no descargues música de internet.",
        "- Antes de terminar el video, mándame el sonido para que lo apruebe.",
        "",
        "PASO 4 · REVISIÓN Y ENTREGA",
        "- Mientras avanzas, mándame imágenes de cada parte para ir viendo cómo queda.",
        "- Al final, mándame aquí en el chat el video terminado en MP4.",
    ]
    return lines.join("\n")
}

export function PromptBuilder() {
    const [marca, setMarca] = useState("")
    const [url, setUrl] = useState("")
    const [queHace, setQueHace] = useState("")
    const [colores, setColores] = useState("")
    const [fuente, setFuente] = useState("")
    const [tonos, setTonos] = useState<string[]>(["Moderno"])
    const [formato, setFormato] = useState<Formato>("ambos")
    const [duracion, setDuracion] = useState<number>(20)
    const [cta, setCta] = useState("")
    const [materiales, setMateriales] = useState("")
    const [copied, setCopied] = useState(false)

    const prompt = useMemo(
        () => buildPrompt({ marca, url, queHace, colores, fuente, tonos, formato, duracion, cta, materiales }),
        [marca, url, queHace, colores, fuente, tonos, formato, duracion, cta, materiales],
    )
    const listo = marca.trim().length > 0

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <Field htmlFor="f-marca" label="¿Cómo se llama tu marca?" required>
                    <input id="f-marca" className={field} value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ej. Café Aurora" />
                </Field>
                <Field htmlFor="f-url" label="Tu página web" hint="Claude la revisa para entender qué ofreces. Si no tienes, déjalo vacío.">
                    <input id="f-url" className={field} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Ej. cafeaurora.mx" inputMode="url" />
                </Field>
                <Field htmlFor="f-quehace" label="¿Qué ofreces, en una frase?" hint="Opcional si tienes página web.">
                    <input
                        id="f-quehace"
                        className={field}
                        value={queHace}
                        onChange={(e) => setQueHace(e.target.value)}
                        placeholder="Ej. Café de especialidad con envío a domicilio."
                    />
                </Field>
                <Field label="¿Cómo quieres que se sienta?" hint="Elige las que quieras.">
                    <div className="flex flex-wrap gap-2">
                        {TONOS.map((t) => {
                            const on = tonos.includes(t)
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => setTonos(on ? tonos.filter((x) => x !== t) : [...tonos, t])}
                                    className={clsx(
                                        "rounded-full border px-4 py-2 text-sm transition-colors",
                                        on ? "border-red-400 bg-red-500/15 text-white" : "border-white/15 text-white/65 hover:border-white/30 hover:text-white",
                                    )}
                                >
                                    {t}
                                </button>
                            )
                        })}
                    </div>
                </Field>
                <Field label="¿Dónde lo vas a publicar?">
                    <div className="grid gap-2 sm:grid-cols-3">
                        {FORMATOS.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                aria-pressed={formato === f.id}
                                onClick={() => setFormato(f.id)}
                                className={clsx(
                                    "rounded-xl border px-4 py-3 text-left transition-colors",
                                    formato === f.id ? "border-red-400 bg-red-500/10" : "border-white/10 hover:border-white/25",
                                )}
                            >
                                <span className="block text-sm font-medium text-white">{f.label}</span>
                                <span className="block text-xs text-white/50">{f.hint}</span>
                            </button>
                        ))}
                    </div>
                </Field>
                <Field label="¿Cuánto debe durar?">
                    <div className="flex gap-2">
                        {DURACIONES.map((d) => (
                            <button
                                key={d}
                                type="button"
                                aria-pressed={duracion === d}
                                onClick={() => setDuracion(d)}
                                className={clsx(
                                    "rounded-full border px-5 py-2 text-sm transition-colors",
                                    duracion === d ? "border-red-400 bg-red-500/15 text-white" : "border-white/15 text-white/65 hover:border-white/30",
                                )}
                            >
                                {d} s
                            </button>
                        ))}
                    </div>
                </Field>
                <Field htmlFor="f-cta" label="¿Qué quieres que haga la gente al final?" hint="Opcional.">
                    <input id="f-cta" className={field} value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Ej. Pide tu primer café con 10% de descuento" />
                </Field>
                <details className="group rounded-xl border border-white/10 px-4 py-3">
                    <summary className="cursor-pointer list-none text-sm font-medium text-white/80 group-open:mb-4">
                        Más opciones (colores, tipografía, archivos) <span className="text-white/40">— opcional</span>
                    </summary>
                    <div className="space-y-5">
                        <Field htmlFor="f-colores" label="Tus colores" hint="Con nombre o código. Si los dejas vacíos, Claude los toma de tu página.">
                            <input id="f-colores" className={field} value={colores} onChange={(e) => setColores(e.target.value)} placeholder="Ej. café oscuro #3B2416, crema #F4E9DC" />
                        </Field>
                        <Field htmlFor="f-fuente" label="Tu tipografía" hint="El nombre de la letra que usas, si lo sabes.">
                            <input id="f-fuente" className={field} value={fuente} onChange={(e) => setFuente(e.target.value)} placeholder="Ej. Poppins" />
                        </Field>
                        <Field htmlFor="f-materiales" label="¿Tienes logo, manual o videos en tu compu?" hint="Escribe en qué carpeta están.">
                            <input
                                id="f-materiales"
                                className={field}
                                value={materiales}
                                onChange={(e) => setMateriales(e.target.value)}
                                placeholder="Ej. el logo está en Descargas/logo.png"
                            />
                        </Field>
                    </div>
                </details>
            </form>

            <div className="lg:sticky lg:top-8 lg:self-start">
                <div className="rounded-2xl border border-white/10 bg-black/50">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                        <p className="text-sm font-medium text-white">Tu prompt</p>
                        <button
                            type="button"
                            disabled={!listo}
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(prompt)
                                    setCopied(true)
                                    setTimeout(() => setCopied(false), 2200)
                                } catch {
                                    setCopied(false)
                                }
                            }}
                            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? "¡Copiado!" : "Copiar prompt"}
                        </button>
                    </div>
                    <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap p-5 font-mono text-[12.5px] leading-relaxed text-white/80">{prompt}</pre>
                </div>
                {!listo ? <p className="mt-3 text-sm text-white/50">Escribe el nombre de tu marca para poder copiarlo.</p> : null}
            </div>
        </div>
    )
}

function Field({
    label,
    hint,
    required,
    htmlFor,
    children,
}: {
    label: string
    hint?: string
    required?: boolean
    htmlFor?: string
    children: React.ReactNode
}) {
    const Title = htmlFor ? "label" : "p"
    return (
        <div>
            <Title htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-white">
                {label} {required ? <span className="text-red-400">*</span> : null}
            </Title>
            {children}
            {hint ? <p className="mt-2 text-xs text-white/45">{hint}</p> : null}
        </div>
    )
}
