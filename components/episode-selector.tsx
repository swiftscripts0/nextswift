'use client'
import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EpisodeSelectorProps {
  totalSeasons: number
  onSelect: (season: number, episode: number) => void
  currentSeason?: number
  currentEpisode?: number
}

export function EpisodeSelector({ totalSeasons, onSelect, currentSeason = 1, currentEpisode = 1 }: EpisodeSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason)
  const [selectedEpisode, setSelectedEpisode] = useState(currentEpisode)
  const [episodesInSeason, setEpisodesInSeason] = useState(20) // Default value, should be fetched from API

  useEffect(() => {
    onSelect(selectedSeason, selectedEpisode)
  }, [selectedSeason, selectedEpisode, onSelect])

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Select
          value={selectedSeason.toString()}
          onValueChange={(value) => {
            setSelectedSeason(parseInt(value))
            setSelectedEpisode(1) // Reset episode when season changes
          }}
        >
          <SelectTrigger className="bg-background text-foreground">
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((season) => (
              <SelectItem key={season} value={season.toString()}>
                Season {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Select
          value={selectedEpisode.toString()}
          onValueChange={(value) => setSelectedEpisode(parseInt(value))}
        >
          <SelectTrigger className="bg-background text-foreground">
            <SelectValue placeholder="Episode" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: episodesInSeason }, (_, i) => i + 1).map((episode) => (
              <SelectItem key={episode} value={episode.toString()}>
                Episode {episode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

