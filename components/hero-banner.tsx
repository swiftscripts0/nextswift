import Image from 'next/image'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { MediaItem } from '@/lib/tmdb'
import { getImageUrl } from '@/lib/tmdb'

interface HeroBannerProps {
  mediaList: MediaItem[]
}

export function HeroBanner({ mediaList }: HeroBannerProps) {
  const media = mediaList[Math.floor(Math.random() * mediaList.length)]
  const title = media.title || media.name
  const releaseDate = media.release_date || media.first_air_date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null

  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={getImageUrl(media.backdrop_path, 'original')}
        alt={title || 'Featured media'}
        fill
        priority
        className="object-cover object-center"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
      
      {/* Content */}
      <div className="container relative mx-auto px-4">
        <div className="flex min-h-[70vh] max-w-2xl flex-col justify-center gap-4">
          <h1 className="text-4xl font-bold md:text-6xl">{title}</h1>
          <p className="text-lg text-gray-200">{media.overview}</p>
          <div className="flex items-center gap-4">
            <Button size="lg" className="gap-2">
              <Play className="h-5 w-5" />
              Watch Trailer
            </Button>
            <div className="flex items-center gap-2 text-lg">
              <span className="rounded-md bg-yellow-400 px-2 py-1 font-bold text-black">
                IMDb
              </span>
              <span>{media.vote_average.toFixed(1)}</span>
              {year && <span>• {year}</span>}
            </div>
          </div>
        </div>
      </div>
      
      {/* Blending bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}

