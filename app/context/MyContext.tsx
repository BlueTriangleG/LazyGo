import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { getSensorData, SensorData } from '@/lib/sensorReader'
import { getCurrentCoordinates, Coordinates } from '@/lib/get-Location'
import { getWeatherData } from '@/lib/get-Weather'
import { set } from 'date-fns'
import * as Location from 'expo-location'

export interface Address {
  street: string
  city: string
  region: string
  country: string
  postalCode: string
}

interface MyContextType {
  currentLocation: Coordinates | null
  sensorData: SensorData | null
  weatherData: string | null
  fetchData: () => Promise<void>
  isLoading: boolean
  error: string | null
}

// Use context. Store enviornment data. Including current location, sensor data, weather data. Provide a fetchData function to fetch data.

const MyContext = createContext<MyContextType | undefined>(undefined)

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null
  )
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  const [weatherData, setWeatherData] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    console.log('Fetching data Context...')
    setIsLoading(true)
    setError(null)
    try {
      const currentLocation: Coordinates | void = await getCurrentCoordinates()
      console.log('Current Location:', currentLocation)
      if (currentLocation) {
        setCurrentLocation(currentLocation)

        // Fetch weather data based on the current location
        const weatherData = await getWeatherData(
          currentLocation.latitude,
          currentLocation.longitude
        )
        setWeatherData(JSON.stringify(weatherData))
        console.log('Weather Data:', weatherData)
      } else {
        console.error('Failed to get current location')
        setError('Failed to get current location')
        alert('Failed to get current location')
      }
      // Fetch sensor data
      const fetchedSensorData = await getSensorData()
      setSensorData(fetchedSensorData)
      console.log('Sensor Data:', JSON.stringify(fetchedSensorData))
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Error fetching data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <MyContext.Provider
      value={{
        currentLocation,
        sensorData,
        weatherData,
        fetchData,
        isLoading,
        error,
      }}>
      {children}
    </MyContext.Provider>
  )
}

export const useMyContext = () => {
  const context = useContext(MyContext)
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider')
  }
  return context
}
