type HourlyData = {
  time: Date
  temperature: number
  windSpeed: number
  weatherCode?: { label: string; icon: string }
}

export function HourlyForecast({ data }: { data: HourlyData[] }) {
  return (
    <div className="w-full mt-4 overflow-hidden">
      <div className="flex gap-3 overflow-x-auto pb-6 pt-2 scrollbar-hide -mx-4 px-4">
        {data.map((hour, i) => {
          const isFirst = i === 0;
          return (
            <div 
              key={i} 
              className={`flex flex-col items-center justify-between p-4 rounded-[2.5rem] min-w-[95px] transition-all border
                ${isFirst 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 border-transparent' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 shadow-sm'
                }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isFirst ? 'opacity-70' : 'text-zinc-400'}`}>
                {isFirst ? 'Zdaj' : `${new Date(hour.time).getHours()}:00`}
              </span>
              
              <div className="flex flex-col items-center my-3">
                <span className="text-3xl mb-1">{hour.weatherCode?.icon}</span>
                <span className="text-[11px] font-bold">{hour.weatherCode?.label}</span>
                <span className="text-2xl font-black">
                  {Math.round(hour.temperature)}°
                </span>
              </div>

              <div className={`flex flex-col items-center gap-1 ${isFirst ? 'opacity-90' : 'opacity-60'}`}>
                <div className="flex items-center gap-1">
                  <span className="text-[10px]">💨</span>
                  <span className="text-[11px] font-bold">{Math.round(hour.windSpeed)} <span className="text-[8px] font-normal">km/h</span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}