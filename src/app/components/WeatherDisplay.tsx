'use client'

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
  { name: "Celje", lat: 46.2293889, lan: 15.2616828},
  { name: "Zagreb", lat: 45.8130967, lan: 15.9772795},
  { name: "Pula", lat: 44.8702281, lan: 13.8455311},
  { name: "Zadar", lat: 44.1168594, lan: 15.2353257},
  { name: "Dunaj", lat: 48.2082, lon: 16.3738 },
  { name: "Pariz", lat: 48.8566, lon: 2.3522 },
  { name: "Berlin", lat: 52.5200, lon: 13.4050 },
  { name: "Rim", lat: 41.9028, lon: 12.4964 },
  { name: "Madrid", lat: 40.4168, lon: -3.7038 },
  { name: "London", lat: 51.5074456, lan: -0.1277653},
  { name: "Budimpešta", lat: 47.4813896, lan: 19.1460941},
  { name: "Atene", lat: 37.9755648, lan: 23.7348324},
  { name: "Dublin", lat: 53.3493795, lan: -6.2605593},
  { name: "Tokio", lat: 35.6768601, lan: 139.7638947},
  { name: "Šangaj", lat: 31.2312707, lan: 121.4700152},
  { name: "Hong Kong", lat: 22.2792968, lan: 114.1628907},
  { name: "Sidni", lat: -33.8698439, lan: 151.2082848},
  { name: "New York", lat: 40.7127281, lan: -74.0060152},
  { name: "Dallas", lat: 32.7762719, lan: -96.7968559},
  { name: "Los angeles", lat: 34.0536909, lan: -118.242766},
  { name: "San Francisco", lat: 37.7879363, lan: -122.4075201},
];

export function WeatherDisplay() {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeCity, setActiveCity] = useState(CITIES[0].name)

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true)
    try {
      const data = await getWeather(lat, lon)
      setWeather(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadGPS = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(46.0569, 14.5058)
    )
  }, [fetchWeather])

  useEffect(() => {
    loadGPS()
  }, [loadGPS])

  // Iskalna stanja
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Funkcija za iskanje mest
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
    }, 400) // Počakamo 400ms po zadnjem tipkanju (debouncing)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-950">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight">Vremenko</h1>
          <p className="text-xs text-zinc-500 mt-1">Izberi lokacijo</p>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="px-4 py-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Išči mesto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            {isSearching && (
              <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Rezultati iskanja (Floating menu) */}
          {searchResults.length > 0 && (
            <div className="absolute left-4 right-4 mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {searchResults.map((city) => (
                <button
                  key={city.id}
                  onClick={() => fetchWeather(city.latitude, city.longitude)}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-b border-zinc-50 dark:border-zinc-800 last:border-none transition-colors"
                >
                  <div className="font-bold text-sm">{city.name}</div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                    {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
          {CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => {
                setActiveCity(city.name);
                city.lat ? fetchWeather(city.lat, city.lon!) : loadGPS();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all
                ${activeCity === city.name 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                }`}
            >
              {city.name}
              {activeCity === city.name && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-900">
           <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Open-Meteo API</div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-50 dark:bg-zinc-950/50">
        {loading ? (
          <div className="h-full flex items-center justify-center">
             <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-zinc-400 font-medium">Osvežujem podatke...</span>
             </div>
          </div>
        ) : weather && (
          <div className="max-w-5xl mx-auto p-8 lg:p-12 animate-in fade-in duration-700">
            
            {/* Zgornji del: Trenutno vreme in Tedenska napoved bok ob boku */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              <div className="lg:col-span-2 space-y-8">
                <CurrentWeatherCard 
                  temperature={weather.current.temperature}
                  weatherCode={weather.current.weatherCode}
                  windSpeed={weather.current.windSpeed}
                  windDirection={weather.current.windDirection}
                  time={weather.current.time}
                  locationName={weather.locationName}
                />
                
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-4 text-center sm:text-left">
                    Urna napoved (24h)
                  </h3>
                  <HourlyForecast data={weather.hourly} />
                </div>
              </div>

              <div className="lg:col-span-1">
                <DailyForecast data={weather.daily} />
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  )
}