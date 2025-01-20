import { Nav } from '@/components/nav'
import { MediaSlider } from '@/components/media-slider'
import { HeroBanner } from '@/components/hero-banner'
import { getTrendingMedia } from '@/lib/tmdb'

export default async function TrendingPage() {
  const [trendingMovies, trendingTv] = await Promise.all([
    getTrendingMedia('movie'),
    getTrendingMedia('tv'),
  ])

  const allTrending = [...trendingMovies.results, ...trendingTv.results]
    .sort((a, b) => b.vote_average - a.vote_average)

  return (
    <main>
      <Nav />
      <HeroBanner mediaList={allTrending.slice(0, 5)} />
      <div className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Trending Movies</h2>
          <MediaSlider items={trendingMovies.results} mediaType="movie" />
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Trending TV Shows</h2>
          <MediaSlider items={trendingTv.results} mediaType="tv" />
        </section>
      </div>
    </main>
  )
}

