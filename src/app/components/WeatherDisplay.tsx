'use client'

import { useEffect, useState } from 'react'
import { getWeather } from '@/app/lib/weather'
import { CurrentWeatherCard } from './CurrentWeatherCard'
import { HourlyForecast } from './HourlyForecast'
import { DailyForecast } from './DailyForecast'

export function WeatherDisplay() {
  const [weather, setWeather] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Definiramo funkcijo znotraj Effecta
    const fetchLocationAndWeather = async () => {
      // 1. Preverimo podporo za geolokacijo
      if (!navigator.geolocation) {
        setError("Vaš brskalnik ne podpira GPS lokacije.")
        return
      }

      // 2. Pridobimo pozicijo
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
          // Če uporabnik zavrne GPS, uporabimo privzeto lokacijo (npr. Berlin)
          // To se zgodi asinhrono v callbacku, kar je OK
          try {
            const data = await getWeather(52.52, 13.41)
            setWeather(data)
          } catch (err) {
            setError("Ni mogoče pridobiti niti privzetih podatkov.")
          }
        }
      )
    }

    fetchLocationAndWeather()
  }, []) // Prazen array poskrbi, da se izvede samo ob mountu

  if (error) return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-3xl text-sm font-medium">
      ⚠️ {error}
    </div>
  )

  if (!weather) return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-zinc-400 animate-pulse text-sm">Pridobivam vreme...</p>
    </div>
  )

  return (
    <div className="flex flex-col items-center w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <CurrentWeatherCard 
        temperature={weather.current.temperature}
        weatherCode={weather.current.weatherCode}
        windSpeed={weather.current.windSpeed}
        windDirection={weather.current.windDirection}
        time={weather.current.time}
        locationName={weather.locationName}
      />
      
      <div className="w-full">
        <HourlyForecast data={weather.hourly} />
      </div>

      <DailyForecast data={weather.daily} />
    </div>
  )
}