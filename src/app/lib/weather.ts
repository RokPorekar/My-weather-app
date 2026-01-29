import { fetchWeatherApi } from 'openmeteo'

export async function getWeather(lat: number, lon: number) {
  const params = {
    latitude: lat,
    longitude: lon,
    current: ['temperature_2m', 'wind_speed_10m', 'wind_direction_10m'],
    timezone: 'auto',
  }

  const url = 'https://api.open-meteo.com/v1/forecast'
  const responses = await fetchWeatherApi(url, params)
  const response = responses[0]
  const current = response.current()!

  return {
    location: {
      latitude: response.latitude(),
      longitude: response.longitude(),
    },
    current: {
      // The order here matches the order in the 'current' array in params
      temperature: current.variables(0)!.value(),
      windSpeed: current.variables(1)!.value(),
      windDirection: current.variables(2)!.value(),
      time: new Date(Number(current.time()) * 1000), // Convert Unix to JS Date
    }
  }
}