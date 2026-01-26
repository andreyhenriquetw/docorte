"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const media = [
  // VÍDEOS (CDN EXTERNO)
  {
    type: "video",
    src: "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWop3TobWbzOktLCEMiD2ya4QYmBcV03frgeT5",
  },
  {
    type: "video",
    src: "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWVIbK4NdTa08rXoOI3ve6ZLymfqzDCgd7RuBh",
  },
  {
    type: "video",
    src: "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWmMr9BGZzqhQAariX2EfweBo8UKZVdlMG3LO9",
  },

  // IMAGENS (CDN EXTERNO)
  {
    type: "image",
    src: "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCW67bRjeGvtBNOrP30QDSaVJUIqzG5X8pMxTY4",
  },
  {
    type: "image",
    src: "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWhFXBRlSPZxm8IBiTjyNr7cA9gSwodYlQaHFt",
  },
  {
    type: "image",
    src: "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWeqDHrjwTOl5LZSB2oFr4Vu91AmfXDiCEsIck",
  },
  {
    type: "image",
    src: "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWOnj3suEjmeGFRkV7A0XZnaBH9ICUJWxthwio",
  },
  {
    type: "image",
    src: "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWUQE1P6yPwLeMJdx4RmHOXDSbjCctWhiN2Ef3",
  },
  {
    type: "video",
    src: "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWTQD1a6c2Ezo6QlN5JrMahwSGPL4KfnIbyvkC",
  },
]

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 99%", "end 50%"],
  })

  return (
    <div ref={containerRef} className="grid grid-cols-3 gap-3">
      {media.map((item, index) => {
        const groupIndex = Math.floor(index / 3)
        const start = 0 + groupIndex * 0.2
        const end = 0.2 + groupIndex * 0.2

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

        return (
          <motion.div
            key={item.src}
            style={{ opacity, y: translateY }}
            className="relative h-40 w-full overflow-hidden rounded-lg p-[1.5px]"
          >
            <div
              className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite]"
              style={{
                background:
                  "conic-gradient(from 90deg at 50% 50%, transparent 0%, #ffd000 20%, transparent 40%)",
              }}
            />

            <div className="relative z-10 h-full w-full overflow-hidden rounded-[calc(0.5rem-1.5px)] bg-black">
              {item.type === "video" ? (
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
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
