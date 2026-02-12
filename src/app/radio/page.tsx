"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Orbitron } from 'next/font/google'
import clsx from "clsx"
import { RefreshCcw, SkipForward } from "lucide-react"

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'] })

type RadioVariant = 'blue' | 'orange'

const variants = {
    blue: {
        id: 'blue',
        image: '/stereo.png',
        overlayBg: 'bg-[#0a1e3f]',
        shadow: 'shadow-[inset_0_0_20px_rgba(0,100,255,0.3)]',
        textColor: 'text-[#e0f2fe]',
        textGlow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.9)]',
        screenGlow: 'from-transparent to-blue-500/5',
    },
    orange: {
        id: 'orange',
        image: '/radio-orange.png',
        overlayBg: 'bg-[#3f1a0a]',
        shadow: 'shadow-[inset_0_0_20px_rgba(255,100,0,0.3)]',
        textColor: 'text-[#ffedd5]',
        textGlow: 'drop-shadow-[0_0_8px_rgba(249,115,22,0.9)]',
        screenGlow: 'from-transparent to-orange-500/5',
    }
}

export default function RadioPage() {
    const [currentVariant, setCurrentVariant] = useState<RadioVariant>('orange')
    const [isPoweredOn, setIsPoweredOn] = useState(false)
    const [isTuning, setIsTuning] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null)

    const tracks = [
        {
            title: "Radio ATP (skit)",
            artist: "nsqk",
            src: "/nsqk - Radio ATP (skit).mp3"
        },
        {
            title: "Aún Te Pienso",
            artist: "nsqk",
            src: "/Nsqk - Aún Te Pienso.mp3"
        },
        {
            title: "Cienciaficción",
            artist: "nsqk",
            src: "/nsqk - Cienciaficción (Visualizer).mp3"
        },
        {
            title: "Tarde o temprano",
            artist: "nsqk",
            src: "/nsqk - Tarde o temprano (Visualizer).mp3"
        },
        {
            title: "DJ Sísifo y sus favortias de la semana (skit)",
            artist: "nsqk",
            src: "/nsqk - DJ Sísifo y sus favortias de la semana (skit) (Visualizer).mp3"
        },
        {
            title: "MIATA ᕙ(⇀‸↼‶)ᕗ",
            artist: "nsqk, El Malilla",
            src: "/nsqk, El Malilla - MIATA ᕙ(⇀‸↼‶)ᕗ (Visualizer).mp3"
        },
        {
            title: "BOBOMENSOTONTO",
            artist: "nsqk, Easykid",
            src: "/nsqk, Easykid - BOBOMENSOTONTO (Visualizer).mp3"
        },
        {
            title: "rompecabezas (interludio)",
            artist: "nsqk",
            src: "/nsqk - rompecabezas (interludio) (Visualizer).mp3"
        },
        {
            title: "misa",
            artist: "nsqk",
            src: "/nsqk - misa (Visualizer).mp3"
        },
        {
            title: "Escuchar a nsqk cambió mi vida (skit)",
            artist: "nsqk",
            src: "/nsqk - Escuchar a nsqk cambió mi vida (skit) (Visualizer).mp3"
        },
        {
            title: "MUBI",
            artist: "nsqk, Alvaro Diaz",
            src: "/nsqk, Alvaro Diaz - MUBI (Visualizer).mp3"
        },
        {
            title: "Blamegame",
            artist: "nsqk, paopao",
            src: "/nsqk, paopao -  Blamegame (Visualizer).mp3"
        },
        {
            title: "Mi top 3 del nuevo disco de nsqk (skit)",
            artist: "nsqk",
            src: "/nsqk - Mi top 3 del nuevo disco de nsqk (skit).mp3"
        },
        {
            title: "si te portas bien",
            artist: "nsqk",
            src: "/nsqk - si te portas bien (Visualizer).mp3"
        },
        {
            title: "los alpes",
            artist: "nsqk, Nina",
            src: "/nsqk, Nina -  los alpes (Visualizer).mp3"
        },
        {
            title: "Nos vemos a la próxima (skit)",
            artist: "nsqk",
            src: "/nsqk - Nos vemos a la próxima (skit) (Visualizer).mp3"
        },
        {
            title: "RIP PETE",
            artist: "nsqk",
            src: "/nsqk - RIP PETE (Visualizer).mp3"
        }
    ]

    const currentTrack = tracks[currentTrackIndex]

    const toggleVariant = () => {
        setCurrentVariant(prev => prev === 'blue' ? 'orange' : 'blue')
    }

    const togglePlay = () => {
        if (!audioRef.current) return

        if (!isPoweredOn) {
            setIsPoweredOn(true)
            setIsTuning(true)

            setTimeout(() => {
                setIsTuning(false)
                setIsPlaying(true)
                audioRef.current?.play()
            }, 4000)
            return
        }

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const playNextTrack = () => {
        if (!isPoweredOn) {
            setIsPoweredOn(true)
            setIsTuning(true)

            setTimeout(() => {
                setIsTuning(false)
                setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
                setIsPlaying(true)
            }, 4000)
        } else {
            setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
            setIsPlaying(true)
        }
    }

    useEffect(() => {
        if (isPlaying && audioRef.current) {

            audioRef.current.play().catch(e => console.error("Play failed:", e))
        }
    }, [currentTrackIndex, isPlaying])

    const theme = variants[currentVariant]

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 transition-colors duration-700">

            <audio
                ref={audioRef}
                src={currentTrack.src}
                onEnded={playNextTrack}
            />

            <div className="relative w-full max-w-[800px] mx-auto group">

                {/* Controls */}
                <div className="absolute -top-16 right-0 flex items-center gap-3 z-50">
                    <button
                        onClick={playNextTrack}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-all backdrop-blur-sm cursor-pointer group/btn"
                    >
                        <SkipForward className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        Next
                    </button>

                    <button
                        onClick={toggleVariant}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-all backdrop-blur-sm cursor-pointer"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Switch Style
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentVariant}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4 }}
                        className="relative cursor-pointer active:scale-[0.99] transition-transform"
                        onClick={togglePlay}
                    >
                        <img
                            src={theme.image}
                            alt="Car Radio Interface"
                            className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg pointer-events-none select-none"
                        />

                        <div className={clsx(
                            "absolute top-[31%] left-[25%] w-[50.5%] h-[30%] overflow-hidden flex items-center justify-center mix-blend-screen rounded-sm transition-all duration-500",
                            isPoweredOn ? [theme.overlayBg, theme.shadow, "opacity-90"] : "bg-black opacity-95"
                        )}>

                            {isPoweredOn && (
                                <>
                                    <div className={clsx("absolute inset-0 bg-gradient-to-b ptr-events-none transition-colors duration-500", theme.screenGlow)} />

                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.02),rgba(255,255,255,0.02),rgba(255,255,255,0.02))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-50" />

                                    <div className="w-full overflow-hidden flex flex-col items-center justify-center mask-gradient relative z-0 h-full">

                                        {!isTuning && (
                                            <div className={clsx(
                                                "absolute top-2 right-4 text-[10px] md:text-xs font-bold tracking-widest uppercase transition-opacity duration-300",
                                                theme.textColor,
                                                isPlaying ? "opacity-100 animate-pulse" : "opacity-50"
                                            )}>
                                                {isPlaying ? "▶ PLAY" : "II PAUSE"}
                                            </div>
                                        )}

                                        {isTuning ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={clsx(
                                                    `${orbitron.className} text-5xl sm:text-6xl md:text-7xl lg:text-4xl font-bold tracking-wider`,
                                                    theme.textColor,
                                                    theme.textGlow,
                                                    "animate-pulse"
                                                )}
                                            >
                                                FM 30.9
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key={currentTrackIndex}
                                                className={clsx(
                                                    `${orbitron.className} flex whitespace-nowrap text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.1em] font-bold uppercase transition-colors duration-300`,
                                                    theme.textColor,
                                                    theme.textGlow
                                                )}
                                                animate={isPlaying ? { x: ["60%", "-60%"] } : { x: 0 }}
                                                transition={{
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                    duration: 15,
                                                    repeatDelay: 1,
                                                }}
                                            >
                                                {currentTrack.title} - {currentTrack.artist} ✦ {currentTrack.title} - {currentTrack.artist} ✦ {currentTrack.title} - {currentTrack.artist} ✦ {currentTrack.title} - {currentTrack.artist}
                                            </motion.div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <p className="mt-12 text-neutral-500 text-sm font-mono flex flex-col items-center gap-2">
                <span>Current Theme: <span className="uppercase text-white font-bold">{currentVariant}</span></span>
                {!isPoweredOn ? (
                    <span className="opacity-50 text-xs">Tap radio to turn it on 🎵</span>
                ) : isTuning ? (
                    <span className="opacity-50 text-xs animate-pulse">Tuning... 📻</span>
                ) : (
                    <span className="opacity-50 text-xs">Tap radio to Play/Pause. Track {currentTrackIndex + 1}/{tracks.length}</span>
                )}
            </p>
        </div>
    )
}
