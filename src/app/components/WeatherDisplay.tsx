'use client'

import { useEffect, useState } from 'react'
import { getWeather } from '@/app/lib/weather'
import { CurrentWeatherCard } from './CurrentWeatherCard'
import { HourlyForecast } from './HourlyForecast'

export function WeatherDisplay() {
  const [weather, setWeather] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Vaš brskalnik ne podpira GPS lokacije.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getWeather(
            position.coords.latitude,
            position.coords.longitude
          )
          setWeather(data)
        } catch (err) {
          setError("Napaka pri pridobivanju podatkov.")
        }
      },
      async () => {
        const data = await getWeather(
            52,
            13
          )
          setWeather(data)
      }
    )
  }, [])

  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!weather) return <div className="p-4 animate-pulse">Pridobivam GPS lokacijo...</div>

  return (
    <div className="flex flex-col items-center w-full max-w-md space-y-8">
      <CurrentWeatherCard 
        temperature={weather.current.temperature}
        windSpeed={weather.current.windSpeed}
        windDirection={weather.current.windDirection}
        time={weather.current.time}
        locationName="Ljubljana, Slovenija"
        weatherCode={weather.current.weatherCode}
      />
      
      <div className="w-full px-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            Urna napoved
          </h3>
          <span className="text-[10px] font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
            24 ur
          </span>
        </div>
        <HourlyForecast data={weather.hourly} />
      </div>
    </div>
  )
}