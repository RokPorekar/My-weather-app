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
}: Props) {
  return (
    <section className="w-full relative">
      {/* Abstraktno ozadje (vidno samo v dark mode za globino) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
      
      <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <div>
            <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              Trenutno stanje
            </span>
            <h3 className="text-zinc-400 font-medium mt-4">
              {new Date(time).toLocaleDateString('sl-SI', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-8xl md:text-9xl font-black tracking-tighter dark:text-white">
              {Math.round(temperature)}°
            </span>
            <div className="flex flex-col">
              <span className="text-4xl">{weatherCode.icon}</span>
              <span className="text-xl font-bold dark:text-zinc-200">{weatherCode.label}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm">💨</div>
                <div>
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Veter</p>
                   <p className="text-xl font-black dark:text-white">{windSpeed} <span className="text-xs font-normal opacity-50">km/h</span></p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}