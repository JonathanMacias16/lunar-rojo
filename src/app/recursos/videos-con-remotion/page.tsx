import { readFile } from "node:fs/promises"
import path from "node:path"
import type { Metadata } from "next"
import { Download } from "lucide-react"
import { CopyButton } from "./CopyButton"
import { Markdown } from "./Markdown"
import { Showcase } from "./Showcase"

const TITLE = "Videos de demo con Remotion: prompt plantilla y guía"
const DESCRIPTION =
    "Un prompt listo para Claude Code y una guía de implementación para producir videos de demostración de producto con Remotion: interfaz animada, keypoints, tag sonoro de marca y versión vertical."

export const metadata: Metadata = {
    title: `${TITLE} · Lunar Rojo`,
    description: DESCRIPTION,
    alternates: { canonical: "/recursos/videos-con-remotion" },
    openGraph: { title: TITLE, description: DESCRIPTION, url: "/recursos/videos-con-remotion", type: "article", locale: "es_MX" },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

// Los textos viven en /content/recursos/*.md: si se actualizan, la página se actualiza sola.
const read = (file: string) => readFile(path.join(process.cwd(), "content", "recursos", file), "utf8")

// El prompt para copiar = el primer bloque ```text del archivo
const extractPrompt = (md: string) => md.match(/```text\n([\s\S]*?)\n```/)?.[1] ?? ""

export default async function RecursoVideosRemotion() {
    const [prompt, guia] = await Promise.all([read("prompt-plantilla.md"), read("guia-implementacion.md")])
    const promptText = extractPrompt(prompt)

    return (
        <main className="min-h-screen bg-background px-5 py-16 sm:px-8 sm:py-24">
            <article className="mx-auto max-w-5xl">
                <header className="mx-auto mb-16 max-w-3xl">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-red-400">Recurso</p>
                    <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                        Videos de demo con Remotion
                    </h1>
                    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
                        Un prompt plantilla para Claude Code y una guía de implementación para producir videos de demostración de
                        producto con Remotion: la interfaz animada en primer plano, la cámara sobre cada acción, keypoints cortos,
                        un tag sonoro de marca y una versión vertical para redes.
                    </p>
                    <p className="mt-4 text-sm text-white/55">
                        ¿No eres técnico?{" "}
                        <a href="/recursos/crea-tu-video" className="text-red-400 underline decoration-red-400/40 underline-offset-4 hover:decoration-red-400">
                            Usa la versión fácil, con un formulario que arma el prompt por ti
                        </a>
                        .
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <CopyButton text={promptText} label="Copiar prompt" />
                        <a
                            href="/recursos/prompt-plantilla.md"
                            download
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors hover:border-white/30 hover:text-white"
                        >
                            <Download className="h-4 w-4" />
                            Prompt (.md)
                        </a>
                        <a
                            href="/recursos/guia-implementacion.md"
                            download
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors hover:border-white/30 hover:text-white"
                        >
                            <Download className="h-4 w-4" />
                            Guía (.md)
                        </a>
                    </div>
                    <nav className="mt-10 flex gap-6 border-b border-white/10 text-sm">
                        <a href="#ejemplos" className="-mb-px border-b border-transparent pb-3 text-white/60 hover:border-white/40 hover:text-white">
                            Ejemplos
                        </a>
                        <a href="#prompt" className="-mb-px border-b border-transparent pb-3 text-white/60 hover:border-white/40 hover:text-white">
                            Prompt plantilla
                        </a>
                        <a href="#guia" className="-mb-px border-b border-transparent pb-3 text-white/60 hover:border-white/40 hover:text-white">
                            Guía de implementación
                        </a>
                    </nav>
                </header>

                <div id="ejemplos" className="scroll-mt-8">
                    <Showcase />
                </div>

                <hr className="my-24 border-white/10" />

                <section id="prompt" className="mx-auto max-w-3xl scroll-mt-8">
                    <Markdown source={prompt} />
                </section>

                <hr className="mx-auto my-16 max-w-3xl border-white/10" />

                <section id="guia" className="mx-auto max-w-3xl scroll-mt-8">
                    <Markdown source={guia} />
                </section>

                <footer className="mx-auto mt-20 max-w-3xl border-t border-white/10 pt-8 text-sm text-white/40">
                    Lunar Rojo · El punto que no todos ven.
                </footer>
            </article>
        </main>
    )
}
