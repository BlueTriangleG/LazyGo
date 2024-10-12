import * as Location from 'expo-location'

// 定义接口
interface Coordinates {
  latitude: number
  longitude: number
}

export const getCurrentCoordinates = async (): Promise<Coordinates | void> => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') {
      console.error('Permission to access location was denied')
      return
    }

    // Await the current position result
    const location = await Location.getCurrentPositionAsync({})
    const currentCoordinates: Coordinates = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
    return currentCoordinates
  } catch (error) {
    console.error('Error fetching location:', error)
  }
}
