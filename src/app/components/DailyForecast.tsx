export function DailyForecast({ data }: { data: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {data.map((day, i) => (
        <div key={i} className="flex flex-col items-center p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors group">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter mb-4 group-hover:text-blue-500">
            {i === 0 ? 'Danes' : new Date(day.time).toLocaleDateString('sl-SI', { weekday: 'short' })}
          </span>
          
          <span className="text-4xl mb-2">{day.weatherCode.icon}</span>
          
          <div className="flex flex-col items-center">
            <span className="text-xl font-black dark:text-white">
              {Math.round(day.tempMax)}°
            </span>
            <span className="text-xs font-medium text-zinc-400">
              {Math.round(day.tempMin)}°
            </span>
          </div>
          
          <span className="text-[10px] text-zinc-400 mt-4 text-center leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
            {day.weatherCode.label}
          </span>
        </div>
      ))}
    </div>
  )
}