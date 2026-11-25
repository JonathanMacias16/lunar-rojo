"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import clsx from "clsx"

// Video en bucle y en silencio (como un GIF), con botón para activar el sonido.
export function LoopVideo({
    src,
    poster,
    label,
    className,
}: {
    src: string
    poster: string
    label: string
    className?: string
}) {
    const ref = useRef<HTMLVideoElement>(null)
    const [muted, setMuted] = useState(true)

    return (
        <div className={clsx("group relative overflow-hidden bg-black", className)}>
            <video
                ref={ref}
                src={src}
                poster={poster}
                autoPlay
                loop
                muted={muted}
                playsInline
                preload="metadata"
                aria-label={label}
                className="h-full w-full object-cover"
            />
            <button
                type="button"
                onClick={() => {
                    const v = ref.current
                    if (!v) return
                    const next = !muted
                    setMuted(next)
                    v.muted = next
                    if (!next) {
                        v.currentTime = 0
                        void v.play()
                    }
                }}
                aria-label={muted ? "Activar sonido" : "Silenciar"}
                className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/80"
            >
                {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                {muted ? "Sonido" : "Silenciar"}
            </button>
        </div>
    )
}

// Reproductor del tag sonoro: la forma de onda se ilumina a medida que suena.
export function SoundTag({ src, wave, title, detail }: { src: string; wave: string; title: string; detail: string }) {
    const ref = useRef<HTMLAudioElement>(null)
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const a = ref.current
        if (!a) return
        let raf = 0
        const tick = () => {
            setProgress(a.duration ? a.currentTime / a.duration : 0)
            raf = requestAnimationFrame(tick)
        }
        const onPlay = () => {
            setPlaying(true)
            raf = requestAnimationFrame(tick)
        }
        const onStop = () => {
            setPlaying(false)
            cancelAnimationFrame(raf)
        }
        const onEnd = () => {
            onStop()
            setProgress(0)
        }
        a.addEventListener("play", onPlay)
        a.addEventListener("pause", onStop)
        a.addEventListener("ended", onEnd)
        return () => {
            cancelAnimationFrame(raf)
            a.removeEventListener("play", onPlay)
            a.removeEventListener("pause", onStop)
            a.removeEventListener("ended", onEnd)
        }
    }, [])

    return (
        <div className="rounded-2xl border border-white/10 bg-[#301F4B]/40 p-5">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => {
                        const a = ref.current
                        if (!a) return
                        if (a.paused) void a.play()
                        else a.pause()
                    }}
                    aria-label={playing ? `Pausar ${title}` : `Reproducir ${title}`}
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#CAA4CC] text-[#301F4B] transition-transform hover:scale-105"
                >
                    {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
                </button>
                <div>
                    <p className="font-medium text-white">{title}</p>
                    <p className="text-sm text-white/55">{detail}</p>
                </div>
            </div>
            <div className="relative mt-5 h-16 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wave} alt="" className="absolute inset-0 h-full w-full object-fill opacity-30" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${progress * 100}%` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={wave} alt="" className="h-full max-w-none object-fill" style={{ width: `${progress > 0 ? 100 / progress : 100}%` }} />
                </div>
            </div>
            <audio ref={ref} src={src} preload="none" />
        </div>
    )
}
