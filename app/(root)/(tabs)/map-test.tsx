import { commonStyles } from '@/styles/common-styles'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { mapStyles } from '@/styles/map-styles'
import { useState, useEffect } from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import * as Location from 'expo-location';

import mockRestaurants from "@/data/restaurants.json"
import { API_BASE_URL, GOOGLE_MAP_KEY } from '@/lib/google-map-api'

const MapTest = () => {

    const [initialLocationLoaded, setInitialLocationLoaded] = useState(false);
    const [location, setLocation] = useState({ latitude: -37.8136, longitude: 144.9631 })
    const [places, setPlaces] = useState<{ 
                                    placeTypes?: string[], 
                                    coordinate?: { 
                                        latitude: number, 
                                        longitude: number 
                                    }, 
                                    placeId?: string, 
                                    placeName?: string, 
                                    rating?: number 
                                }[]>([])

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
            const url = API_BASE_URL + location.coords.latitude + ',' + location.coords.longitude 
                        + '&radius=' + radius + '&type=' + placeType + '&key=' + GOOGLE_MAP_KEY;

            const isMocking = true;             

            fetch(isMocking ? "https://www.google.com" : url)
            .then(res => {
                places.splice(0, places.length);
                setPlaces([...places]); 
                if (isMocking) {
                    return mockRestaurants;
                } else {
                    return res.json();
                }
            }).then(res => {
                // Processing data from api response.
                for (let googlePlace of res.results) {
                    let place: { 
                        placeTypes?: string[], 
                        coordinate?: { 
                            latitude: number, 
                            longitude: number 
                        }, 
                        placeId?: string, 
                        placeName?: string, 
                        rating?: number 
                    } = {};
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
                    place['rating'] = googlePlace.rating;
                    places.push(place);
                    setPlaces([...places]);
                }
            })
            .catch(error => { 
                console.log(error);
            });

            console.log('The url: ' + url);
            setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            setInitialLocationLoaded(true);
        })();
    }, []);

    return (
        <SafeAreaView>
            <Text style={commonStyles.h1text}>This is a map testing page.</Text>
            <View style={mapStyles.mapContainer} > 
                {
                    !initialLocationLoaded ? <ActivityIndicator style={commonStyles.centerAll} size="large" /> :
                    <MapView 
                        style={ StyleSheet.absoluteFill } 
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            // These two deltas below determine the initial zoom level of the map.
                            latitudeDelta: 0.009,
                            longitudeDelta: 0.009,
                        }}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        >
                        {places.map((place, index) => (
                            <Marker
                                key={index}
                                coordinate={place.coordinate ? place.coordinate : { latitude: 0, longitude: 0 }}
                                title={place.placeName}
                                description={place.placeTypes?.join(', ')}
                            />
                        ))}
                    </MapView>
                }
            </View>
            <FlatList 
                data={places}
                renderItem={({ item }) => (
                    <View style={mapStyles.mapListItem}>
                        <Text style={mapStyles.mapListItemName}>{item.placeName}</Text>
                        <Text>Tags: { item.placeTypes?.map((t) => {
                            if (t == item.placeTypes?.slice(-1)[0]) return t;
                            return t + ', '; 
                        }) }</Text>
                        <Text>{item.coordinate?.latitude + ", " + item.coordinate?.longitude}</Text>
                        <Text style={mapStyles.mapListItemRating}>Rating: {item.rating}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.placeId ? item.placeId : ''}
            />
        </SafeAreaView>
    )
}
export default MapTest
