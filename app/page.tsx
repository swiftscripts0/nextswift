'use client' 
import { Nav } from '@/components/nav'
import { MediaSlider } from '@/components/media-slider'
import { HeroBanner } from '@/components/hero-banner'
import { ContinueWatching } from '@/components/continue-watching'
import { getPopularMedia, getTrendingMedia, getTopRatedMedia } from '@/lib/tmdb'

export default async function Home() {
  const [popularMovies, popularTv, trendingMedia] = await Promise.all([
    getPopularMedia('movie'),
    getPopularMedia('tv'),
    getTrendingMedia('movie'),
  ])

  return (
    <main className="min-h-screen pb-8">
      <Nav />
      <HeroBanner mediaList={trendingMedia.results.slice(0, 5)} />
      <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
          <ContinueWatching />
        </div>
        <section className="mb-12">
          <h2 className="mb-6 text-xl sm:text-2xl font-bold">Popular Movies</h2>
          <MediaSlider items={popularMovies.results} mediaType="movie" />
        </section>
        <section className="mb-12">
          <h2 className="mb-6 text-xl sm:text-2xl font-bold">Popular TV Shows</h2>
          <MediaSlider items={popularTv.results} mediaType="tv" />
        </section>
        <section className="mb-12">
          <h2 className="mb-6 text-xl sm:text-2xl font-bold">Trending This Week</h2>
          <MediaSlider items={trendingMedia.results} mediaType="movie" />
        </section>
      </div>
    </main>
  )
}

