type Props = {
  temperature: number
  windSpeed: number
  windDirection: number
  time: Date
  locationName?: string
}

export function CurrentWeatherCard({
  temperature,
  windSpeed,
  windDirection,
  time,
  locationName = 'Current weather',
}: Props) {
  return (
    <section className="
      w-full max-w-md
      rounded-2xl
      bg-white dark:bg-zinc-900
      shadow-md
      p-4
      transition-colors
    ">
      <header className="mb-4">
        <h2 className="text-sm text-zinc-500 dark:text-zinc-400">
          {locationName}
        </h2>
        <time className="text-xs text-zinc-400">
          {new Date(time).toLocaleString()}
        </time>
      </header>

      <div className="flex items-center justify-between">
        <div className="text-5xl font-semibold">
          {Math.round(temperature)}°
        </div>

        <div className="text-sm text-right text-zinc-500 dark:text-zinc-400">
          <div>Wind</div>
          <div className="font-medium text-zinc-700 dark:text-zinc-200">
            {windSpeed} km/h
          </div>
          <div className="text-xs">
            {windDirection}°
          </div>
        </div>
      </div>
    </section>
  )
}
