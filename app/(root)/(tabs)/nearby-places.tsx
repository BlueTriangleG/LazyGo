import { commonStyles } from '@/styles/common-styles'
import { StyleSheet, Text, View, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps'
import { mapStyles } from '@/styles/map-styles'
import { useState, useEffect } from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import * as Location from 'expo-location'

import mockRestaurants from '@/data/restaurants.json'
import { GOOGLE_MAP_API_BASE_URL } from '@/lib/google-map-api'

type GooglePlace = {
  placeTypes?: string[]
  coordinate?: {
    latitude: number
    longitude: number
  }
  placeId?: string
  placeName?: string
  rating?: number
}

/**
 * Resources:
 * - [expo-location](https://docs.expo.dev/versions/latest/sdk/location/)
 * - [React Native Maps with Marker & Callout](https://www.youtube.com/watch?v=_IyWSsFXLcA)
 * - [Integrate Custom Zoom In And Zoom Out Feature in React Native Maps](https://medium.com/@akakankur81/integrate-custom-zoom-in-and-zoom-out-feature-in-react-native-maps-31867e0a546d)
 * - [MapView documentation](https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md)
 */
const MapTest = () => {
  const [initialLocationLoaded, setInitialLocationLoaded] = useState(false)
  const [location, setLocation] = useState({
    latitude: -37.8136,
    longitude: 144.9631,
  })
  const [places, setPlaces] = useState<GooglePlace[]>([])

  const [errorMsg, setErrorMsg] = useState('')

  const radius = 1 * 1000 // Search within maximum 1 km radius.
  const placeType = 'restaurant'

  /*  This useEffect hook is used to:
   *    - Get the current location of the user by using expo-location.
   *    - Then fetch the nearby places using Google Places API.
   *    - The places are then displayed on the map and in a list below the map.
   */
  useEffect(() => {
    // Using expo-location to get the current location. See the document: https://docs.expo.dev/versions/latest/sdk/location/
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }
      let location = await Location.getCurrentPositionAsync({})
      const url = `${GOOGLE_MAP_API_BASE_URL}&location=${location.coords.latitude},${location.coords.longitude}&radius=${radius}&type=${placeType}`

      // Mocking the api call for testing. !!! Set isMocking to false to use the real api.!!!
      const isMocking = false

      fetch(isMocking ? 'https://www.google.com' : url)
        .then((res) => {
          setPlaces([]) // 清空现有的places
          if (isMocking) {
            return mockRestaurants
          } else {
            return res.json()
          }
        })
        .then((res) => {
          // Processing data from api response.
          const newPlaces: GooglePlace[] = []
          for (let googlePlace of res.results) {
            let place: GooglePlace = {}
            const myLat = googlePlace.geometry.location.lat
            const myLong = googlePlace.geometry.location.lng
            const coordinate = {
              latitude: myLat,
              longitude: myLong,
            }
            place.placeTypes = googlePlace.types
            place.coordinate = coordinate
            place.placeId = googlePlace.place_id
            place.placeName = googlePlace.name
            place.rating = googlePlace.rating
            newPlaces.push(place)
          }
          setPlaces(newPlaces)
        })
        .catch((error) => {
          console.log(error)
        })

      console.log('The url: ' + url)
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
      setInitialLocationLoaded(true)
    })()
  }, [])

  // 根据平台选择地图提供商
  const mapProvider =
    Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={commonStyles.h1text}>Nearby places</Text>
      <View style={mapStyles.mapContainer}>
        {!initialLocationLoaded ? (
          <ActivityIndicator style={commonStyles.centerAll} size="large" />
        ) : (
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              // These two deltas below determine the initial zoom level of the map.
              latitudeDelta: 0.006,
              longitudeDelta: 0.006,
            }}
            provider={mapProvider}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}>
            {places.map((place, index) => (
              <Marker
                key={index}
                coordinate={
                  place.coordinate
                    ? place.coordinate
                    : { latitude: 0, longitude: 0 }
                }
                title={place.placeName}
                description={place.placeTypes?.join(', ')}
              />
            ))}
          </MapView>
        )}
      </View>
      <FlatList
        data={places}
        renderItem={({ item }) => (
          <View style={mapStyles.mapListItem}>
            <Text style={mapStyles.mapListItemName}>{item.placeName}</Text>
            <Text>
              Tags:{' '}
              {item.placeTypes?.map((t, idx) => (
                <Text key={idx}>
                  {t}
                  {idx < item.placeTypes.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </Text>
            <Text>
              {item.coordinate?.latitude + ', ' + item.coordinate?.longitude}
            </Text>
            <Text style={mapStyles.mapListItemRating}>
              Rating: {item.rating}
            </Text>
          </View>
        )}
        keyExtractor={(item) =>
          item.placeId ? item.placeId : Math.random().toString()
        }
      />
    </SafeAreaView>
  )
}
export default MapTest
