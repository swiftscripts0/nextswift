'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Nav } from '@/components/nav'
import { getImageUrl, getMovieDetails, getTvShowDetails, getMovieCredits, getTvShowCredits, getVideos } from '@/lib/tmdb'
import { Star, Clock, Calendar } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StreamingOptions } from '@/components/streaming-options'
import type { MediaType } from '@/lib/tmdb'

export default function WatchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const media_type = searchParams.get('media_type')
  const season = parseInt(searchParams.get('season') || '1')
  const episode = parseInt(searchParams.get('episode') || '1')
  const [pageData, setPageData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !media_type) {
      setError('Invalid URL parameters')
      return
    }

    window.scrollTo(0, 0)

    const fetchData = async () => {
      try {
        let details, credits, videos

        if (media_type === 'movie') {
          [details, credits, videos] = await Promise.all([
            getMovieDetails(id),
            getMovieCredits(id),
            getVideos('movie' as MediaType, id)
          ])
        } else if (media_type === 'tv') {
          [details, credits, videos] = await Promise.all([
            getTvShowDetails(id),
            getTvShowCredits(id),
            getVideos('tv' as MediaType, id)
          ])
        } else {
          throw new Error('Invalid media type')
        }

        setPageData({ details, credits, videos })
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load content')
      }
    }

    fetchData()
  }, [id, media_type])

  useEffect(() => {
    if (id && media_type) {
      // Save to watch history
      const watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]')
      const newEntry = { id, media_type, season, episode, timestamp: Date.now() }
      const updatedHistory = [newEntry, ...watchHistory.filter((item: any) => item.id !== id)].slice(0, 10)
      localStorage.setItem('watchHistory', JSON.stringify(updatedHistory))
    }
  }, [id, media_type, season, episode])

  if (error) {
    return <div className="container mx-auto px-4 py-8">{error}</div>
  }

  if (!pageData) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  const { details, credits, videos } = pageData
  const title = details.title || details.name
  const overview = details.overview
  const backdropPath = details.backdrop_path
  const posterPath = details.poster_path
  const releaseDate = details.release_date || details.first_air_date
  const runtime = details.runtime || (details.episode_run_time && details.episode_run_time[0])
  const voteAverage = details.vote_average
  const cast = credits.cast.slice(0, 5)
  const trailers = videos.results.filter((video: any) => video.type === 'Trailer' && video.site === 'YouTube')

  const handleSeasonEpisodeChange = (newSeason: number, newEpisode: number) => {
    router.push(`/watch?id=${id}&media_type=${media_type}&season=${newSeason}&episode=${newEpisode}`)
  }

  return (
    <main className="min-h-screen wireframe-bg text-white">
      <Nav className="bg-black/50 backdrop-blur-sm" />
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src={getImageUrl(backdropPath, 'original') || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover object-center opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
              <Image
                src={getImageUrl(posterPath) || "/placeholder.svg"}
                alt={title}
                width={300}
                height={450}
                className="rounded-lg shadow-lg w-full"
                priority
              />
            </div>

            <div className="flex-grow">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                {releaseDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(releaseDate).getFullYear()}</span>
                  </div>
                )}
                {runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{runtime} min</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{voteAverage.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-lg mb-8">{overview}</p>
              
              <div className="mb-8">
                <StreamingOptions 
                  title={title}
                  mediaType={media_type as 'movie' | 'tv'}
                  mediaId={id}
                  totalSeasons={details.number_of_seasons || 1}
                  initialSeason={season}
                  initialEpisode={episode}
                  onSeasonEpisodeChange={handleSeasonEpisodeChange}
                />
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="flex flex-wrap gap-4">
                  {cast.map((actor: any) => (
                    <div key={actor.id} className="flex items-center gap-2 bg-gray-800 rounded-full pl-1 pr-4 py-1">
                      <Image
                        src={getImageUrl(actor.profile_path) || "/placeholder.svg"}
                        alt={actor.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="text-sm">{actor.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {trailers.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Trailers</h2>
                  <Tabs defaultValue={trailers[0].key} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-gray-800">
                      {trailers.map((trailer: any, index: number) => (
                        <TabsTrigger key={trailer.key} value={trailer.key} className="data-[state=active]:bg-gray-700">
                          Trailer {index + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {trailers.map((trailer: any) => (
                      <TabsContent key={trailer.key} value={trailer.key}>
                        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                          <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title={trailer.name}
                            className="w-full h-full"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}
              {trailers.length === 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Trailers</h2>
                  <p>No trailers available for this title.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

