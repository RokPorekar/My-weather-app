import { WeatherDisplay } from '@/app/components/WeatherDisplay'

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 flex flex-col items-center justify-center">
      <h1 className="mb-8 text-xl font-medium">Lokalna napoved</h1>
      <WeatherDisplay />
    </main>
  )
}