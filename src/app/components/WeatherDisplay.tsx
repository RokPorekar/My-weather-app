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
      () => {
        setError("Dostop do lokacije je bil zavrnjen.")
      }
    )
  }, [])

  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!weather) return <div className="p-4 animate-pulse">Pridobivam GPS lokacijo...</div>

  return (
    <div>
    <CurrentWeatherCard 
      temperature={weather.current.temperature}
      windSpeed={weather.current.windSpeed}
      windDirection={weather.current.windDirection}
      time={weather.current.time}
      locationName="Vaša lokacija (GPS)"
    />
    <h3 className="mt-8 self-start max-w-md mx-auto w-full text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Naslednjih 24 ur
      </h3>
      
      <HourlyForecast data={weather.hourly} />
    </div>
  )
}