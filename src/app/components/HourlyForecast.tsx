type HourlyData = {
  time: Date
  temperature: number
  windSpeed: number
}

export function HourlyForecast({ data }: { data: HourlyData[] }) {
  return (
    <div className="w-full max-w-md mt-4">
      <div className="flex gap-3 overflow-x-auto pb-6 pt-2 scrollbar-hide -mx-4 px-4">
        {data.map((hour, i) => {
          const isFirst = i === 0;
          return (
            <div 
              key={i} 
              className={`flex flex-col items-center justify-between p-4 rounded-3xl min-w-[85px] transition-all
                ${isFirst 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                  : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
            >
              <span className={`text-[11px] font-medium ${isFirst ? 'opacity-80' : 'text-zinc-400'}`}>
                {isFirst ? 'Zdaj' : `${new Date(hour.time).getHours()}:00`}
              </span>
              <span className="text-2xl font-bold my-2">
                {Math.round(hour.temperature)}°
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] opacity-70">💨</span>
                <span className="text-[10px] font-semibold">{Math.round(hour.windSpeed)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}