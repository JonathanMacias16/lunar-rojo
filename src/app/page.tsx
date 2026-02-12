"use client"

import { motion } from "motion/react"
import { ArrowRight, Box, CreditCard, ShieldCheck, Zap } from "lucide-react"
import clsx from "clsx"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Decorative background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300"
        >
          LunarRojo
        </motion.div>
        
        <div className="flex items-center gap-6">
          <motion.a 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Features
          </motion.a>
          <motion.a 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Pricing
          </motion.a>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      <main className="relative z-10 px-6 pt-20 pb-32 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-4"
          >
            <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
            v2.0 is now live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 pb-2"
          >
            Build faster with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">modern tools</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed"
          >
            Create stunning web applications with the latest tech stack. 
            Powered by Next.js, React, Tailwind CSS, and Motion for fluid animations.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 text-base font-semibold bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
            >
              Start Building <ArrowRight className="w-5 h-5 ml-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-base font-semibold bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
            >
              View Documentation
            </motion.button>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </main>
    </div>
  )
}

const features = [
  {
    title: "Lightning Fast",
    description: "Built on Next.js 15 for optimal performance and SEO out of the box.",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    title: "Secure by Design",
    description: "Enterprise-grade security standards with built-in protection.",
    icon: ShieldCheck,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    title: "Seamless Payments",
    description: "Integrate stripe or other payment gateways in minutes.",
    icon: CreditCard,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
]

function FeatureCard({ feature, index }: { feature: any, index: number }) {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
      className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors overflow-hidden"
    >
      <div className={clsx("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent pointer-events-none")} />
      
      <div className={clsx("inline-flex p-3 rounded-2xl mb-5", feature.bg, feature.color)}>
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
        {feature.title}
      </h3>
      
      <p className="text-gray-400 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  )
}
