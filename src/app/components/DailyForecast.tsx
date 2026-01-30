export function DailyForecast({ data }: { data: any[] }) {
  return (
    <div className="w-full max-w-md mt-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6 px-2">
        Napoved za 7 dni
      </h3>
      <div className="space-y-6">
        {data.map((day, i) => (
          <div key={i} className="flex items-center justify-between px-2">
            {/* Dan v tednu */}
            <span className="w-12 text-sm font-medium text-zinc-600 dark:text-zinc-300 capitalize">
              {i === 0 ? 'Danes' : new Date(day.time).toLocaleDateString('sl-SI', { weekday: 'short' })}
            </span>
            
            {/* Ikona in labela */}
            <div className="flex items-center gap-3 flex-1 justify-center">
              <span className="text-2xl">{day.weatherCode.icon}</span>
              <span className="text-xs text-zinc-400 hidden sm:inline-block w-24 text-left">
                {day.weatherCode.label}
              </span>
            </div>

            {/* Temperature min/max */}
            <div className="flex gap-3 w-20 justify-end">
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                {Math.round(day.tempMax)}°
              </span>
              <span className="text-sm font-medium text-zinc-400">
                {Math.round(day.tempMin)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}