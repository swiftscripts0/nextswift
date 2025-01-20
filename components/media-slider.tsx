'use client'
import React, { useState } from 'react'
import Slider from 'react-slick'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MediaCard } from './media-card'
import type { MediaItem } from '@/lib/tmdb'

interface MediaSliderProps {
  items: MediaItem[]
  mediaType: 'movie' | 'tv'
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 z-10 -mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75"
      aria-label="Next"
    >
      <ChevronRight className="h-8 w-8" />
    </button>
  )
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 z-10 -mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75"
      aria-label="Previous"
    >
      <ChevronLeft className="h-8 w-8" />
    </button>
  )
}

export function MediaSlider({ items, mediaType }: MediaSliderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      }
    ],
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false),
  }

  return (
    <div className="relative px-6">
      <Slider {...settings}>
        {items.map((item) => (
          <div key={item.id} className="px-2">
            <MediaCard 
              item={item} 
              mediaType={mediaType} 
              isDragging={isDragging}
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

