import * as Location from 'expo-location'
export interface Address {
  streetNumber: string
  street: string
  city: string
  region: string
  country: string
  postalCode: string
}

// 定义接口
export interface Coordinates {
  latitude: number
  longitude: number
  address: Address
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
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })
    let geocode = await Location.reverseGeocodeAsync(location.coords)
    if (geocode.length > 0) {
      const firstResult = geocode[0]
      const formattedAddress: Address = {
        streetNumber: firstResult.streetNumber || '',
        street: firstResult.street || '',
        city: firstResult.city || '',
        region: firstResult.region || '',
        country: firstResult.country || '',
        postalCode: firstResult.postalCode || '',
      }
      const currentCoordinates: Coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: formattedAddress,
      }
      console.log('Current Coordinates:', currentCoordinates)
      return currentCoordinates
    } else {
      console.error('Failed to reverse geocode location')
      return
    }
  } catch (error) {
    console.error('Error fetching location:', error)
  }
}
