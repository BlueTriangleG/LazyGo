const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_WETHER_API_KEY

// Define types for the API response to make the code more type-safe.
interface WeatherResponse {
  current: {
    temp: number
    weather: [{ description: string }]
  }
  hourly: Array<{
    dt: number
    temp: number
    weather: [{ description: string }]
  }>
  daily: Array<{
    dt: number
    temp: { day: number }
    weather: [{ description: string }]
  }>
}

// Define the type of the returned structured data
interface WeatherData {
  currentTemperature: number
  currentCondition: string
  HourForecast: Array<{
    time: string
    temp: number
    condition: string
  }>
  todayForecast: {
    date: string
    temp: number
    condition: string
  }
}

// Function to get weather data and return structured data
export const getWeatherData = async (
  lat: number,
  lon: number
): Promise<WeatherData | void> => {
  const exclude = 'minutely' // Exclude minutely data
  const apiKey = OPENWEATHER_API_KEY

  if (!apiKey) {
    console.error('API key is missing in .env file')
    return
  }

  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=metric&appid=${apiKey}`
  console.log('url:', url)

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data: WeatherResponse = await response.json()

    // Format the data into the structured WeatherData object
    const result: WeatherData = {
      currentTemperature: data.current.temp,
      currentCondition: data.current.weather[0].description,
      HourForecast: data.hourly.slice(0, 3).map((hour) => ({
        time: new Date(hour.dt * 1000).toLocaleTimeString(),
        temp: hour.temp,
        condition: hour.weather[0].description,
      })),
      todayForecast: {
        date: new Date(data.daily[0].dt * 1000).toLocaleDateString(),
        temp: data.daily[0].temp.day,
        condition: data.daily[0].weather[0].description,
      },
    }
    console.log(result)

    // Return the formatted data
    return result
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }
}

// Example usage (San Francisco coordinates):
getWeatherData(37.7749, -122.4194).then((data) => {
  if (data) {
    console.log(data)
  }
})
