'use client'

import { useState, useEffect } from 'react'
import { Nav } from '@/components/nav'
import { MediaGrid } from '@/components/media-grid'
import { getMixedMedia } from '@/lib/tmdb'
import type { MediaResponse } from '@/lib/tmdb'

export default function MoviesPage() {
  const [mixedMovies, setMixedMovies] = useState<MediaResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchMixedMovies = async (page: number) => {
    const data = await getMixedMedia('movie', page)
    setMixedMovies(data)
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchMixedMovies(1)
  }, [])

  if (!mixedMovies) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen pb-8">
      <Nav />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="mb-6 text-2xl sm:text-3xl font-bold">Movies</h1>
        <MediaGrid
          items={mixedMovies.results}
          mediaType="movie"
          currentPage={currentPage}
          totalPages={mixedMovies.total_pages}
          onPageChange={fetchMixedMovies}
        />
      </div>
    </main>
  )
}

