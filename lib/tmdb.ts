const TMDB_API_KEY = 'c2ebe3d363b34d7cc6f174adb4d219aa'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export type MediaType = 'movie' | 'tv'

export interface MediaItem {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
  release_date?: string
  first_air_date?: string
}

export interface MediaResponse {
  results: MediaItem[]
  page: number
  total_pages: number
}

export interface VideoItem {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export interface VideoResponse {
  results: VideoItem[]
}

async function fetchTMDB(endpoint: string) {
  const response = await fetch(`${BASE_URL}${endpoint}`)
  return response.json()
}

export async function getPopularMedia(type: MediaType, page: number = 1): Promise<MediaResponse> {
  return fetchTMDB(`/${type}/popular?api_key=${TMDB_API_KEY}&page=${page}`)
}

export async function getTopRatedMedia(type: MediaType, page: number = 1): Promise<MediaResponse> {
  return fetchTMDB(`/${type}/top_rated?api_key=${TMDB_API_KEY}&page=${page}`)
}

export async function getMixedMedia(type: MediaType, page: number = 1): Promise<MediaResponse> {
  const [popular, topRated] = await Promise.all([
    getPopularMedia(type, page),
    getTopRatedMedia(type, page)
  ])

  const mixedResults = [...popular.results, ...topRated.results]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 20)  // Limit to 20 items per page

  return {
    results: mixedResults,
    page: page,
    total_pages: Math.min(popular.total_pages, topRated.total_pages)
  }
}

export async function getTrendingMedia(type: MediaType): Promise<MediaResponse> {
  return fetchTMDB(`/trending/${type}/week?api_key=${TMDB_API_KEY}`)
}

export function getImageUrl(path: string, size: 'w500' | 'original' = 'w500') {
  if (!path) return '/placeholder.svg'
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export async function getMovieDetails(id: string) {
  return fetchTMDB(`/movie/${id}?api_key=${TMDB_API_KEY}`)
}

export async function getTvShowDetails(id: string) {
  return fetchTMDB(`/tv/${id}?api_key=${TMDB_API_KEY}`)
}

export async function getMovieCredits(id: string) {
  return fetchTMDB(`/movie/${id}/credits?api_key=${TMDB_API_KEY}`)
}

export async function getTvShowCredits(id: string) {
  return fetchTMDB(`/tv/${id}/credits?api_key=${TMDB_API_KEY}`)
}

export async function searchMedia(query: string, page: number = 1): Promise<MediaResponse> {
  return fetchTMDB(`/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`)
}

export async function getVideos(type: MediaType, id: string): Promise<VideoResponse> {
  return fetchTMDB(`/${type}/${id}/videos?api_key=${TMDB_API_KEY}`)
}

