"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef } from "react"

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

  useEffect(() => {
    const videos = document.querySelectorAll<HTMLVideoElement>("video")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement

          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.3 },
    )

    videos.forEach((video) => observer.observe(video))

    return () => observer.disconnect()
  }, [])

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
            {/* BORDA AMARELA GIRATÓRIA */}
            <div
              className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite]"
              style={{
                background:
                  "conic-gradient(from_90deg_at_50%_50%,transparent_0%,#EAB308_20%,transparent_40%)",
              }}
            />

            {/* CONTEÚDO */}
            <div className="relative z-10 h-full w-full overflow-hidden rounded-[calc(0.5rem-1.5px)] bg-black">
              {isVideo ? (
                <video
                  src={src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="object-cover"
                />
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
