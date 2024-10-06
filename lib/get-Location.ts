import * as Location from 'expo-location'

export const getCurrentCoordinates = async (): Promise<
  [number, number] | void
> => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') {
      console.error('Permission to access location was denied')
      return
    }

    // Await the current position result
    const location = await Location.getCurrentPositionAsync({})
    const currentCoordinates: [number, number] = [
      location.coords.latitude,
      location.coords.longitude,
    ]
    return currentCoordinates
  } catch (error) {
    console.error('Error fetching location:', error)
  }
}
