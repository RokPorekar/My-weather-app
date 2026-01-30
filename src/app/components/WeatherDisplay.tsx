'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Search, MapPin, Clock, LayoutGrid, Wind } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { getWeather, searchCities } from '@/app/lib/weather'
import { CurrentWeatherCard } from './CurrentWeatherCard'
import { HourlyForecast } from './HourlyForecast'
import { DailyForecast } from './DailyForecast'

const CITIES = [
  { name: "📍 Moja lokacija", lat: null, lon: null },
  { name: "Ljubljana", lat: 46.0569, lon: 14.5058 },
  { name: "Maribor", lat: 46.5547, lon: 15.6459 },
  { name: "Koper", lat: 45.5469, lon: 13.7294 },
  { name: "Celje", lat: 46.2293889, lon: 15.2616828 },
  { name: "Zagreb", lat: 45.8130967, lon: 15.9772795 },
  { name: "Pula", lat: 44.8702281, lon: 13.8455311 },
  { name: "Zadar", lat: 44.1168594, lon: 15.2353257 },
  { name: "Dunaj", lat: 48.2082, lon: 16.3738 },
  { name: "Pariz", lat: 48.8566, lon: 2.3522 },
  { name: "Berlin", lat: 52.5200, lon: 13.4050 },
  { name: "Rim", lat: 41.9028, lon: 12.4964 },
  { name: "Madrid", lat: 40.4168, lon: -3.7038 },
  { name: "London", lat: 51.5074456, lon: -0.1277653 },
  { name: "Budimpešta", lat: 47.4813896, lon: 19.1460941 },
  { name: "Atene", lat: 37.9755648, lon: 23.7348324 },
  { name: "Dublin", lat: 53.3493795, lon: -6.2605593 },
  { name: "Tokio", lat: 35.6768601, lon: 139.7638947 },
  { name: "Šangaj", lat: 31.2312707, lon: 121.4700152 },
  { name: "Hong Kong", lat: 22.2792968, lon: 114.1628907 },
  { name: "Sidni", lat: -33.8698439, lon: 151.2082848 },
  { name: "New York", lat: 40.7127281, lon: -74.0060152 },
  { name: "Dallas", lat: 32.7762719, lon: -96.7968559 },
  { name: "Los angeles", lat: 34.0536909, lon: -118.242766 },
  { name: "San Francisco", lat: 37.7879363, lon: -122.4075201 },
];

export function WeatherDisplay() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeCity, setActiveCity] = useState(CITIES[0].name)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const fetchWeather = useCallback(async (lat: number, lon: number, name?: string) => {
    setLoading(true)
    if (name) setActiveCity(name)
    try {
      const data = await getWeather(lat, lon)
      setWeather(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setSearchQuery("")
      setSearchResults([])
    }
  }, [])

  const loadGPS = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, "📍 Moja lokacija"),
      () => fetchWeather(46.0569, 14.5058, "Ljubljana")
    )
  }, [fetchWeather])

  useEffect(() => {
    loadGPS()
  }, [loadGPS])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true)
        const results = await searchCities(searchQuery)
        setSearchResults(results)
        setIsSearching(false)
      } else {
        setSearchResults([])
      }
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Preprečevanje Hydration Error
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-80 border-r border-border bg-sidebar flex flex-col transition-colors duration-300">
        <div className="p-8 flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tighter text-blue-600 dark:text-blue-500 italic uppercase">Vremenko</h1>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-all"
          >
            {theme === 'dark' ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-600" />}
          </button>
        </div>

        <div className="px-6 mb-8 relative">
          <div className="relative group">
            <Search className="absolute left-3 top-3 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Išči lokacijo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute left-6 right-6 mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 z-50 overflow-hidden overflow-y-auto max-h-60">
              {searchResults.map((city) => (
                <button
                  key={city.id}
                  onClick={() => fetchWeather(city.latitude, city.longitude, city.name)}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-b border-zinc-50 dark:border-zinc-800 last:border-none transition-colors"
                >
                  <div className="font-bold text-sm">{city.name}</div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest">{city.country}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
          <div className="px-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">Priljubljeno</div>
          {CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => city.lat ? fetchWeather(city.lat, city.lon!, city.name) : loadGPS()}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all
                ${activeCity === city.name 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1' 
                  : 'hover:bg-white dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400'
                }`}
            >
              <div className="flex items-center gap-3">
                {city.lat === null ? <MapPin size={16} /> : <LayoutGrid size={16} />}
                {city.name}
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto bg-background p-8 lg:p-12 transition-colors duration-500">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
             <p className="text-zinc-400 font-medium animate-pulse">Pridobivam podatke...</p>
          </div>
        ) : weather && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <header className="flex justify-between items-end px-2">
              <div>
                <h2 className="text-4xl font-black tracking-tight">{weather.locationName}</h2>
                <div className="flex items-center gap-2 text-zinc-400 mt-2 font-medium">
                  <Clock size={16} />
                  <span>Zadnja osvežitev: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Glavna kartica (3/4 širine) */}
              <div className="lg:col-span-4 bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                <CurrentWeatherCard 
                  temperature={weather.current.temperature}
                  weatherCode={weather.current.weatherCode}
                  windSpeed={weather.current.windSpeed}
                  windDirection={weather.current.windDirection}
                  time={weather.current.time}
                  locationName={weather.locationName}
                />
              </div>

              {/* Urna napoved (Polna širina) */}
              <div className="lg:col-span-4 bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Urna napoved</h3>
                    <div className="h-px flex-1 bg-zinc-200 dark:border-zinc-800" />
                  </div>
                  <HourlyForecast data={weather.hourly} />
              </div>

              {/* Dnevna napoved (Polna širina) */}
              <div className="lg:col-span-4 bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Tedenski pregled</h3>
                    <div className="h-px flex-1 bg-zinc-200 dark:border-zinc-800" />
                  </div>
                  <DailyForecast data={weather.daily} />
              </div>
              
            </div>
          </div>
        )}
      </main>
    </div>
  )
}