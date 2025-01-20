'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Nav } from '@/components/nav'
import { MediaGrid } from '@/components/media-grid'
import { searchMedia } from '@/lib/tmdb'
import type { MediaResponse } from '@/lib/tmdb'
import { Button } from '@/components/ui/button'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchResults, setSearchResults] = useState<MediaResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const fetchSearchResults = async (page: number) => {
    setIsLoading(true)
    try {
      const data = await searchMedia(query, page)
      setSearchResults(data)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching search results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      fetchSearchResults(1)
    }
  }, [query])

  if (!searchResults) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen pb-8">
      <Nav />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="mb-6 text-2xl sm:text-3xl font-bold">Search Results for "{query}"</h1>
        {searchResults.results.length > 0 ? (
          <>
            <MediaGrid
              items={searchResults.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv')}
              mediaType="mixed"
            />
            <div className="mt-8 flex justify-center items-center space-x-4">
              <Button
                onClick={() => fetchSearchResults(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {searchResults.total_pages}
              </span>
              <Button
                onClick={() => fetchSearchResults(currentPage + 1)}
                disabled={currentPage === searchResults.total_pages || isLoading}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <p className="text-lg">No results found for "{query}"</p>
        )}
      </div>
    </main>
  )
}

