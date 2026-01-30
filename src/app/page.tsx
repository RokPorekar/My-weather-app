import { WeatherDisplay } from '@/app/components/WeatherDisplay'

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 flex flex-col items-center justify-center">
      <WeatherDisplay />
    </main>
  )
}