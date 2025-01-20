'use client'

import { useState, useEffect } from 'react'
import { Nav } from '@/components/nav'
import { MediaGrid } from '@/components/media-grid'
import { getMixedMedia } from '@/lib/tmdb'
import type { MediaResponse } from '@/lib/tmdb'

export default function TvShowsPage() {
  const [mixedTvShows, setMixedTvShows] = useState<MediaResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchMixedTvShows = async (page: number) => {
    const data = await getMixedMedia('tv', page)
    setMixedTvShows(data)
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchMixedTvShows(1)
  }, [])

  if (!mixedTvShows) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen pb-8">
      <Nav />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="mb-6 text-2xl sm:text-3xl font-bold">TV Shows</h1>
        <MediaGrid
          items={mixedTvShows.results}
          mediaType="tv"
          currentPage={currentPage}
          totalPages={mixedTvShows.total_pages}
          onPageChange={fetchMixedTvShows}
        />
      </div>
    </main>
  )
}

