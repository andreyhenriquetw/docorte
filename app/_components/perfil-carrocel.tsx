/* eslint-disable @next/next/no-img-element */
"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"

interface BarbershopCarouselProps {
  images: string[]
  name: string
}

export function BarbershopCarousel({ images, name }: BarbershopCarouselProps) {
  return (
    <div className="relative h-[260px] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop
        className="barbershop-swiper h-full w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[260px] w-full">
              <img
                src={image}
                alt={`${name}-${index}`}
                className="h-full w-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
