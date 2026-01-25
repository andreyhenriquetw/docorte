"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const media = [
  "/333.mp4",
  "/111.mp4",
  "/hg.mp4",
  "/image4.jpeg",
  "/image3.jpeg",
  "/image2.jpeg",
  "/image1.jpeg",
  "/asdsad.png",
  "/gfjh.mp4",
]

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 99%", "end 50%"],
  })

  return (
    <div ref={containerRef} className="grid grid-cols-3 gap-3">
      {media.map((src, index) => {
        const groupIndex = Math.floor(index / 3)
        const start = groupIndex * 0.2
        const end = start + 0.2

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0, 1], {
          clamp: true,
        })

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const translateY = useTransform(
          scrollYProgress,
          [start, end],
          [30, 0],
          { clamp: true },
        )

        const isVideo = src.endsWith(".mp4")

        return (
          <motion.div
            key={src}
            style={{ opacity, y: translateY }}
            className="relative h-40 w-full overflow-hidden rounded-lg p-[1.5px]"
          >
            {/* LINHA AMARELA PURA GIRATÓRIA */}
            <div
              className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite]"
              style={{
                background:
                  "conic-gradient(from 90deg at 50% 50%, transparent 0%, #EAB308 20%, transparent 40%)",
              }}
            />

            {/* CONTEÚDO (MÁSCARA) */}
            <div className="relative z-10 h-full w-full overflow-hidden rounded-[calc(0.5rem-1.5px)] bg-black">
              {isVideo ? (
                <video
                  src={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image src={src} alt="gallery" fill className="object-cover" />
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
