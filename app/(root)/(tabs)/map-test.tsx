import { commonStyles } from '@/styles/common-styles'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { mapStyles } from '@/styles/map-styles'
import { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import * as Location from 'expo-location';

import mockRestaurants from "@/data/restaurants.json"
import { API_BASE_URL, GOOGLE_MAP_KEY } from '@/lib/google-map-api'

const MapTest = () => {

    const [location, setLocation] = useState({ latitude: -37.8136, longitude: 144.9631 })
    const [places, setPlaces] = useState<{ placeTypes?: string[], coordinate?: { latitude: number, longitude: number }, placeId?: string, placeName?: string }[]>([])

    const [errorMsg, setErrorMsg] = useState("");

    const radius = 1 * 1000;    // Search within maximum 1 km radius.
    const placeType = 'restaurant';

    useEffect(() => {
        // Using expo-location to get the current location. See the document: https://docs.expo.dev/versions/latest/sdk/location/
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          let location = await Location.getCurrentPositionAsync({});
          setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        })();

        const url = API_BASE_URL + location.latitude + ',' + location.longitude + '&radius=' + radius + '&type=' + placeType + '&key=' + GOOGLE_MAP_KEY;
        console.log('The url: ' + url);

        // fetch(url)                       // Using mock data to avoid the billing issue. Uncomment this line to use the real data. 
        fetch("https://www.google.com")     // Comment this line to use the real data.
        .then(res => {
            // return res.json();           // Using mock data to avoid the billing issue. Uncomment this line to use the real data.
            return mockRestaurants;         // Comment this line to use the real data.
        }).then(res => {
            for (let googlePlace of res.results) {
                let place: { placeTypes?: string[], coordinate?: { latitude: number, longitude: number }, placeId?: string, placeName?: string } = {};
                var myLat = googlePlace.geometry.location.lat;
                var myLong = googlePlace.geometry.location.lng;
                var coordinate = {
                    latitude: myLat,
                    longitude: myLong,
                };
                place['placeTypes'] = googlePlace.types;
                place['coordinate'] = coordinate;
                place['placeId'] = googlePlace.place_id;
                place['placeName'] = googlePlace.name;
                places.push(place);
                setPlaces([...places]);
            }
        })
        .catch(error => { 
            console.log(error);
        });
    }, []);

    // useEffect(() => {
    //     // Show all the places nearby.
    //     console.log('The places nearby: ' + places.map(nearbyPlaces => nearbyPlaces.placeName));
    // }, [places])

    // useEffect(() => {
    //     console.log('Current Coordinates: ' + location.latitude + ', ' + location.longitude);   
    // }, [location])

    return (
        <SafeAreaView>
            <Text style={commonStyles.h1text}>This is a map testing page.</Text>
            <View style={mapStyles.mapContainer} > 
                <MapView style={ StyleSheet.absoluteFill } 
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    provider={PROVIDER_GOOGLE}
                    /> 
            </View>
            <FlatList 
                data={places}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.placeName}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.placeId ? item.placeId : ''}
            />
        </SafeAreaView>
    )
}
export default MapTest
