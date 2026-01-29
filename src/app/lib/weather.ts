import { fetchWeatherApi } from 'openmeteo'

export async function getWeather(lat: number, lon: number) {
  const params = {
    latitude: lat,
    longitude: lon,
    hourly: ['temperature_2m', 'wind_speed_10m'],
    current: ['temperature_2m', 'wind_speed_10m', 'wind_direction_10m'],
    timezone: 'auto',
  }

  const url = 'https://api.open-meteo.com/v1/forecast'
  const responses = await fetchWeatherApi(url, params)
  const response = responses[0]
  
  const current = response.current()!
  const hourly = response.hourly()!

  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  const hourlyTimes = range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval());

  // Dobimo trenutni čas (začetek trenutne ure)
  const now = new Date();
  now.setMinutes(0, 0, 0); 

  const allHourlyData = hourlyTimes.map((t, i) => ({
    time: new Date(t * 1000),
    temperature: hourly.variables(0)!.valuesArray()![i],
    windSpeed: hourly.variables(1)!.valuesArray()![i],
  }));

  // Filtriramo: obdržimo samo ure, ki so STROGO VEČJE od trenutne ure
  const futureHourlyData = allHourlyData
    .filter(item => item.time > now)
    .slice(0, 24);

  return {
    current: {
      temperature: current.variables(0)!.value(),
      windSpeed: current.variables(1)!.value().toPrecision(3),
      windDirection: current.variables(2)!.value().toPrecision(3),
      time: new Date(Number(current.time()) * 1000),
    },
    hourly: futureHourlyData
  }
}