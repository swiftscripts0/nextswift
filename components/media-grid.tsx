import { MediaCard } from './media-card'
import type { MediaItem } from '@/lib/tmdb'

interface MediaGridProps {
  items: MediaItem[]
  mediaType: 'movie' | 'tv' | 'mixed'
}

export function MediaGrid({ items, mediaType }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <MediaCard 
          key={item.id} 
          item={item} 
          mediaType={item.media_type || mediaType} 
          isDragging={false} 
        />
      ))}
    </div>
  )
}

