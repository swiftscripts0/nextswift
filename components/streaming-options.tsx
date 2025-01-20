'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EpisodeSelector } from './episode-selector'

interface StreamingOptionsProps {
  title: string
  mediaType: 'movie' | 'tv'
  mediaId: string
  totalSeasons?: number
  initialSeason?: number
  initialEpisode?: number
  onSeasonEpisodeChange?: (season: number, episode: number) => void
}

interface Server {
  name: string
  getUrl: (params: { mediaType: string; mediaId: string; season?: number; episode?: number }) => string
}

export function StreamingOptions({ 
  title, 
  mediaType, 
  mediaId, 
  totalSeasons = 1, 
  initialSeason = 1, 
  initialEpisode = 1,
  onSeasonEpisodeChange 
}: StreamingOptionsProps) {
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [currentSeason, setCurrentSeason] = useState(initialSeason)
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode)

  useEffect(() => {
    setCurrentSeason(initialSeason)
    setCurrentEpisode(initialEpisode)
  }, [initialSeason, initialEpisode])

  const servers: Server[] = [
    {
      name: 'Server 1',
      getUrl: ({ mediaType, mediaId, season, episode }) => 
        mediaType === 'movie' 
          ? `https://vidsrc.xyz/embed/movie/${mediaId}`
          : `https://vidsrc.xyz/embed/tv/${mediaId}/${season}/${episode}`
    },
    {
      name: 'Server 2',
      getUrl: ({ mediaType, mediaId, season, episode }) =>
        mediaType === 'movie'
          ? `https://vidlink.pro/movie/${mediaId}`
          : `https://vidlink.pro/tv/${mediaId}/${season}/${episode}`
    },
    {
      name: 'Server 3',
      getUrl: ({ mediaType, mediaId, season, episode }) =>
        mediaType === 'movie'
          ? `https://embed.su/embed/movie/${mediaId}`
          : `https://embed.su/embed/tv/${mediaId}/${season}/${episode}`
    }
  ]

  const handleServerSelect = (server: Server) => {
    const url = server.getUrl({
      mediaType,
      mediaId,
      season: currentSeason,
      episode: currentEpisode
    })
    setSelectedServer(url)
  }

  const handleEpisodeSelect = (season: number, episode: number) => {
    setCurrentSeason(season)
    setCurrentEpisode(episode)
    
    if (onSeasonEpisodeChange) {
      onSeasonEpisodeChange(season, episode)
    }

    if (selectedServer) {
      const currentServer = servers.find(server => 
        selectedServer.includes(server.getUrl({ mediaType, mediaId, season: 1, episode: 1 }).split('/')[2])
      )
      if (currentServer) {
        const newUrl = currentServer.getUrl({
          mediaType,
          mediaId,
          season,
          episode
        })
        setSelectedServer(newUrl)
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Watch Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-hidden bg-background border-border">
        <DialogHeader>
          <DialogTitle>Choose a Server to Watch {title}</DialogTitle>
          <DialogDescription>
            Select a server from the options below to start streaming.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {servers.map((server) => (
              <Button
                key={server.name}
                onClick={() => handleServerSelect(server)}
                variant={selectedServer?.includes(server.getUrl({ mediaType, mediaId, season: 1, episode: 1 }).split('/')[2]) 
                  ? "default" 
                  : "outline"
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {server.name}
              </Button>
            ))}
          </div>
          
          {mediaType === 'tv' && (
            <div className="py-4">
              <EpisodeSelector
                totalSeasons={totalSeasons}
                onSelect={handleEpisodeSelect}
                currentSeason={currentSeason}
                currentEpisode={currentEpisode}
              />
            </div>
          )}

          {selectedServer && (
            <div className="w-full h-[calc(90vh-240px)]">
              <iframe
                src={selectedServer}
                className="w-full h-full rounded-md"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

