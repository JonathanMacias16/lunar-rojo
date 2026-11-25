import { LoopVideo, SoundTag } from "./Media"

const BASE = "/recursos/videos-con-remotion"

const PLACAS = [
    { file: "01-logo.jpg", n: "01", title: "Entrada de marca", text: "Solo el logo, encendido con el tag sonoro." },
    { file: "02-producto.jpg", n: "02", title: "El producto", text: "La interfaz real, recreada en React." },
    { file: "03-accion.jpg", n: "03", title: "La acción", text: "Zoom a cada clic y un keypoint en un panel." },
    { file: "04-agendada.jpg", n: "04", title: "El resultado", text: "Llega la invitación y se dibuja el check." },
    { file: "05-reunion.jpg", n: "05", title: "La experiencia", text: "La reunión y sus tres momentos." },
    { file: "06-resultados.jpg", n: "06", title: "La prueba", text: "Todos los casos a la vez, no uno por uno." },
    { file: "07-cierre.jpg", n: "07", title: "Cierre", text: "Logo, lema y llamado a la acción." },
]

const EVOLUCION = [
    { file: "1-lanzamiento-10s.jpg", v: "v1", title: "Lanzamiento · 10 s", text: "Todo cabía en 10 segundos, pero no se alcanzaban a ver las acciones." },
    { file: "2-lanzamiento-25s.jpg", v: "v2", title: "Lanzamiento · 25 s", text: "Más tiempo por paso, música con drop y un primer tag sonoro." },
    { file: "3-manual-de-marca.jpg", v: "v3", title: "Manual de marca · 20 s", text: "Tipografía editorial y ritmo calmado, pero la pantalla siempre dividida." },
    { file: "4-final.jpg", v: "v4", title: "Final · 24 s", text: "Paleta oficial, Poppins, zoom a cada acción y solo keypoints." },
]

const PASOS = [
    { title: "Material", text: "Manual, paleta, URL del producto, logos y videos.", gate: false },
    { title: "Resumen", text: "Qué es el producto y las 2 funciones a mostrar.", gate: true },
    { title: "Plan sonoro", text: "Tonalidad, motivo del tag y qué suena en cada momento.", gate: true },
    { title: "Placas", text: "Una por una, con un still de cada una para revisar.", gate: false },
    { title: "Audio", text: "Tag de entrada, tag de salida y mezcla en WAV.", gate: true },
    { title: "Render", text: "Horizontal y Short, verificados con ffprobe.", gate: false },
]

const SectionTitle = ({ kicker, title, text }: { kicker: string; title: string; text: string }) => (
    <div className="mb-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-red-400">{kicker}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-white/65">{text}</p>
    </div>
)

export function Showcase() {
    return (
        <div className="space-y-24">
            {/* El resultado: horizontal + Short */}
            <section>
                <SectionTitle
                    kicker="El resultado"
                    title="Un video, dos formatos"
                    text="El mismo proyecto genera el video horizontal y el Short vertical. Cada escena se recompone para 9:16 en vez de encogerse."
                />
                <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
                    <LoopVideo
                        src={`${BASE}/demo-horizontal.mp4`}
                        poster={`${BASE}/demo-horizontal-poster.jpg`}
                        label="Video de demostración horizontal de EmberLab"
                        className="aspect-video w-full rounded-2xl border border-white/10 shadow-2xl shadow-black/60"
                    />
                    <div className="mx-auto w-[220px] rounded-[2.2rem] border border-white/15 bg-black p-2 shadow-2xl shadow-black/60">
                        <LoopVideo
                            src={`${BASE}/demo-short.mp4`}
                            poster={`${BASE}/demo-short-poster.jpg`}
                            label="Short vertical de EmberLab"
                            className="aspect-[9/16] w-full rounded-[1.7rem]"
                        />
                    </div>
                </div>
            </section>

            {/* Proceso */}
            <section>
                <SectionTitle
                    kicker="El proceso"
                    title="Seis pasos, tres aprobaciones"
                    text="Las aprobaciones van antes de lo que cuesta repetir: el render completo y el audio."
                />
                <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {PASOS.map((p, i) => (
                        <li key={p.title} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-sm text-white/40">0{i + 1}</span>
                                {p.gate ? (
                                    <span className="rounded-full bg-[#C7DDA3]/15 px-2.5 py-1 text-xs font-medium text-[#C7DDA3]">Aprobación</span>
                                ) : null}
                            </div>
                            <p className="mt-3 font-medium text-white">{p.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-white/60">{p.text}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Placas */}
            <section>
                <SectionTitle
                    kicker="Las placas"
                    title="Una idea por momento"
                    text="Siete placas, cada una con un solo keypoint. La acción se muestra; no se explica con texto."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    {PLACAS.map((p, i) => (
                        <figure key={p.file} className={i === 0 ? "sm:col-span-2" : undefined}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`${BASE}/placas/${p.file}`}
                                alt={`${p.title}: ${p.text}`}
                                loading="lazy"
                                className="aspect-video w-full rounded-xl border border-white/10 object-cover"
                            />
                            <figcaption className="mt-3 flex gap-3 text-sm">
                                <span className="font-mono text-white/40">{p.n}</span>
                                <span>
                                    <span className="font-medium text-white">{p.title}.</span>{" "}
                                    <span className="text-white/60">{p.text}</span>
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            {/* Tag sonoro */}
            <section>
                <SectionTitle
                    kicker="El tag sonoro"
                    title="EM · BER · LAB"
                    text="Tres notas que suben, una por sílaba: corto, corto, largo. Siempre suenan solas, sin música debajo. Todo el audio está sintetizado en código, sin samples."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    <SoundTag src={`${BASE}/tag-entrada.m4a`} wave={`${BASE}/tag-entrada-onda.png`} title="Tag de entrada" detail="1,7 s · abre el video" />
                    <SoundTag src={`${BASE}/tag-salida.m4a`} wave={`${BASE}/tag-salida-onda.png`} title="Tag de salida" detail="3,9 s · cierra con una chispa" />
                </div>
            </section>

            {/* Animaciones de logo */}
            <section>
                <SectionTitle
                    kicker="Identificador de marca"
                    title="El logo, encendido con fuego"
                    text="La entrada y la salida son solo el logo. Dos variantes del mismo concepto: la chispa que enciende."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    <figure>
                        <LoopVideo
                            src={`${BASE}/logo-mecha.mp4`}
                            poster={`${BASE}/logo-mecha-poster.jpg`}
                            label="Animación de logo: mecha"
                            className="aspect-video w-full rounded-xl border border-white/10"
                        />
                        <figcaption className="mt-3 text-sm">
                            <span className="font-medium text-white">Mecha.</span>{" "}
                            <span className="text-white/60">Una chispa recorre una mecha y un borde incandescente revela las letras.</span>
                        </figcaption>
                    </figure>
                    <figure>
                        <LoopVideo
                            src={`${BASE}/logo-chispas.mp4`}
                            poster={`${BASE}/logo-chispas-poster.jpg`}
                            label="Animación de logo: chispas"
                            className="aspect-video w-full rounded-xl border border-white/10"
                        />
                        <figcaption className="mt-3 text-sm">
                            <span className="font-medium text-white">Chispas.</span>{" "}
                            <span className="text-white/60">Muchas chispas convergen, encienden la estrella y al final estallan.</span>
                        </figcaption>
                    </figure>
                </div>
            </section>

            {/* Evolución */}
            <section>
                <SectionTitle
                    kicker="La evolución"
                    title="El mismo momento, cuatro versiones"
                    text="Así cambió el paso de elegir un horario con cada ronda de correcciones. Lo aprendido está en el prompt."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    {EVOLUCION.map((e) => (
                        <figure key={e.file}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`${BASE}/evolucion/${e.file}`}
                                alt={`${e.title}: ${e.text}`}
                                loading="lazy"
                                className="aspect-video w-full rounded-xl border border-white/10 object-cover"
                            />
                            <figcaption className="mt-3 flex gap-3 text-sm">
                                <span className="font-mono text-red-400">{e.v}</span>
                                <span>
                                    <span className="font-medium text-white">{e.title}.</span>{" "}
                                    <span className="text-white/60">{e.text}</span>
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>
        </div>
    )
}
