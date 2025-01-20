'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getImageUrl, getMovieDetails, getTvShowDetails } from '@/lib/tmdb'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface WatchHistoryItem {
  id: string
  media_type: string
  season?: number
  episode?: number
  timestamp: number
}

export function ContinueWatching() {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([])
  const [mediaDetails, setMediaDetails] = useState<{[key: string]: any}>({})
  const router = useRouter()

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]')
    // Filter out invalid entries
    const validHistory = history.filter((item: WatchHistoryItem) => 
      item && item.id && item.media_type && ['movie', 'tv'].includes(item.media_type)
    )
    setWatchHistory(validHistory)

    const fetchMediaDetails = async () => {
      const details: {[key: string]: any} = {}
      for (const item of validHistory) {
        if (!details[item.id]) {
          try {
            if (item.media_type === 'movie') {
              details[item.id] = await getMovieDetails(item.id)
            } else {
              details[item.id] = await getTvShowDetails(item.id)
            }
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type} ${item.id}:`, error)
          }
        }
      }
      setMediaDetails(details)
    }

    fetchMediaDetails()
  }, [])

  const handleContinueWatching = (item: WatchHistoryItem) => {
    const url = item.media_type === 'tv'
      ? `/watch?id=${item.id}&media_type=${item.media_type}&season=${item.season || 1}&episode=${item.episode || 1}`
      : `/watch?id=${item.id}&media_type=${item.media_type}`
    router.push(url)
  }

  if (watchHistory.length === 0) {
    return null
  }

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold">Continue Watching</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {watchHistory.map((item) => {
          const media = mediaDetails[item.id]
          if (!media) return null

          return (
            <div key={`${item.id}-${item.timestamp}`} className="group relative overflow-hidden rounded-lg cursor-pointer w-full" onClick={() => handleContinueWatching(item)}>
              <div className="aspect-[2/3] relative">
                <Image
                  src={getImageUrl(media.poster_path) || "/placeholder.svg"}
                  alt={media.title || media.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-lg" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-sm font-bold line-clamp-1 mb-1">{media.title || media.name}</h3>
                <div className="flex items-center gap-2 text-xs">
                  {item.media_type === 'tv' && <span>S{item.season} E{item.episode}</span>}
                  <span className="capitalize">{item.media_type}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
}

