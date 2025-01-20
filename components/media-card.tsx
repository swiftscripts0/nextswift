'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import type { MediaItem } from '@/lib/tmdb'
import { getImageUrl } from '@/lib/tmdb'

interface MediaCardProps {
  item: MediaItem
  mediaType: 'movie' | 'tv'
  isDragging: boolean
}

export function MediaCard({ item, mediaType, isDragging }: MediaCardProps) {
  const router = useRouter()
  const title = item.title || item.name
  const releaseDate = item.release_date || item.first_air_date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null
  const type = item.media_type || mediaType

  const handleClick = () => {
    if (!isDragging) {
      const url = type === 'tv'
        ? `/watch?id=${item.id}&media_type=${type}&season=1&episode=1`
        : `/watch?id=${item.id}&media_type=${type}`;
      router.push(url);
    }
  }

  return (
    <div 
      className="group relative overflow-hidden rounded-lg cursor-pointer w-full transition-transform duration-200 hover:scale-105 active:scale-95"
      onClick={handleClick}
      data-tmdb-id={item.id}
      data-media-type={type}
    >
      <div className="aspect-[2/3] relative">
        <Image
          src={getImageUrl(item.poster_path) || "/placeholder.svg"}
          alt={title || 'Media poster'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-sm font-bold line-clamp-1 mb-1">{title}</h3>
        <div className="flex items-center gap-2 text-xs">
          <Star className="h-3 w-3 text-yellow-400" />
          <span>{item.vote_average.toFixed(1)}</span>
          {year && <span>• {year}</span>}
          <span className="capitalize">• {type}</span>
        </div>
      </div>
    </div>
  )
}

