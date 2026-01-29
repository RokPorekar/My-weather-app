type Props = {
  temperature: number
  windSpeed: number
  windDirection: number
  time: Date
  locationName?: string
  weatherCode: { label: string; icon: string }
}

export function CurrentWeatherCard({
  temperature,
  windSpeed,
  weatherCode,
  time,
  locationName = 'Trenutno vreme',
}: Props) {
  return (
    <section className="w-full max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white shadow-2xl shadow-blue-200 dark:shadow-none relative">
      {/* Dekorativni krog v ozadju */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      
      <header className="relative z-10 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-medium tracking-tight">{locationName}</h2>
          <time className="text-xs opacity-80 font-light">
            {new Date(time).toLocaleDateString('sl-SI', { weekday: 'long', day: 'numeric', month: 'long' })}
          </time>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest backdrop-blur-md">
          V živo
        </div>
      </header>

      <div className="relative z-10 mt-10 flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-8xl font-bold tracking-tighter">
            {Math.round(temperature)}°
          </span>
          <span className="text-lg font-medium ml-1 opacity-90">{weatherCode.label} {weatherCode.icon}</span>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xl">💨</div>
            <div>
              <div className="text-[10px] uppercase opacity-60 leading-none">Veter</div>
              <div className="text-sm font-bold">{windSpeed} <span className="text-[10px] font-normal">km/h</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}