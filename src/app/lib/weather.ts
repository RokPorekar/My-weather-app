import { fetchWeatherApi } from 'openmeteo'

export function getWeatherDetails(code: number) {
  const codes: Record<number, { label: string; icon: string }> = {
    0: { label: "Jasno", icon: "☀️" },
    1: { label: "Pretežno jasno", icon: "🌤️" },
    2: { label: "Delno oblačno", icon: "⛅" },
    3: { label: "Oblačno", icon: "☁️" },
    45: { label: "Megla", icon: "🌫️" },
    48: { label: "Ivnata megla", icon: "🌫️" },
    51: { label: "Rahlo rosenje", icon: "🌧️" },
    53: { label: "Zmerno rosenje", icon: "🌧️" },
    55: { label: "Močno rosenje", icon: "🌧️" },
    56: { label: "Rahlo zmrznjeno rosenje", icon: "🌨️" },
    57: { label: "Močno zmrznjeno rosenje", icon: "🌨️" },
    61: { label: "Rahlo deževje", icon: "🌦️" },
    63: { label: "Zmeren dež", icon: "🌧️" },
    65: { label: "Močan dež", icon: "🌧️" },
    66: { label: "Rahel zmrznjen dež", icon: "🌨️" },
    67: { label: "Močan zmrznjen dež", icon: "🌨️" },
    71: { label: "Rahlo sneženje", icon: "🌨️" },
    73: { label: "Sneženje", icon: "❄️" },
    75: { label: "Močno sneženje", icon: "❄️" },
    77: { label: "Snežna zrnca", icon: "❄️" },
    80: { label: "Rahle dežne plohe", icon: "🌦️" },
    81: { label: "Dežne Plohe", icon: "🌧️" },
    82: { label: "Močne dežne plohe", icon: "🌧️" },
    85: { label: "Rahle snežne plohe", icon: "🌨️" },
    86: { label: "Močno snežene plohe", icon: "❄️" },
    95: { label: "Nevihta rahla/zmerna", icon: "⛈️" },
    96: { label: "Nevihta z rahlo točo", icon: "⛈️" },
    99: { label: "Nevihta z močno točo", icon: "⛈️" },
  };
  return codes[code] || { label: "Neznano", icon: "🌡️" };
}

export async function getWeather(lat: number, lon: number) {

  // 1. Pridobivanje imena kraja (Reverse Geocoding)
  let locationName = "Neznana lokacija";
  try {
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    const geoRes = await fetch(geoUrl, { headers: { 'User-Agent': 'WeatherApp/1.0' } });
    const geoData = await geoRes.json();
    // Poskusimo dobiti mesto, naselje ali vas
    locationName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.suburb || "Vaša lokacija";
  } catch (e) {
    console.error("Napaka pri geokodiranju", e);
  }

  const params = {
    latitude: lat,
    longitude: lon,
    hourly: ['temperature_2m', 'wind_speed_10m', 'weather_code'],
    current: ['temperature_2m', 'wind_speed_10m', 'wind_direction_10m', 'weather_code'],
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min',],
    timezone: 'auto',
  }

  const url = 'https://api.open-meteo.com/v1/forecast'
  const responses = await fetchWeatherApi(url, params)
  const response = responses[0]
  
  const current = response.current()!
  const hourly = response.hourly()!
  const daily = response.daily()!

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
    weatherCode: getWeatherDetails(hourly.variables(2)!.valuesArray()![i]),
  }));

  // Filtriramo: obdržimo samo ure, ki so STROGO VEČJE od trenutne ure
  const futureHourlyData = allHourlyData
    .filter(item => item.time > now)
    .slice(0, 24);

  // Obdelava dnevnih podatkov
  const dailyTimes = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval());
  const dailyData = dailyTimes.map((t, i) => ({
    time: new Date(t * 1000),
    weatherCode: getWeatherDetails(daily.variables(0)!.valuesArray()![i]),
    tempMax: daily.variables(1)!.valuesArray()![i],
    tempMin: daily.variables(2)!.valuesArray()![i],
  }));

  return {
    locationName,
    current: {
      temperature: current.variables(0)!.value(),
      windSpeed: current.variables(1)!.value().toPrecision(3),
      windDirection: current.variables(2)!.value().toPrecision(3),
      weatherCode: getWeatherDetails(current.variables(3)!.value()),
      time: new Date(Number(current.time()) * 1000),
    },
    hourly: futureHourlyData,
    daily: dailyData,
  }
}