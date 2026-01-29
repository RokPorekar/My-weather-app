type HourlyData = {
  time: Date
  temperature: number
  windSpeed: number
}

export function HourlyForecast({ data }: { data: HourlyData[] }) {
  return (
    <div className="w-full max-w-md mt-6 overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex gap-4">
        {data.map((hour, i) => (
          <div key={i} className="flex flex-col items-center bg-white dark:bg-zinc-900 p-3 rounded-xl min-w-[80px] shadow-sm">
            <span className="text-xs text-zinc-500">
              {new Date(hour.time).getHours()}:00
            </span>
            <span className="text-lg font-bold my-1">
              {Math.round(hour.temperature)}°
            </span>
            <span className="text-[10px] text-zinc-400">
              {Math.round(hour.windSpeed)} km/h
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}