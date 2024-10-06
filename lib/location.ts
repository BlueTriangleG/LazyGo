import * as Location from 'expo-location';


export async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        return;
    }
    let location = await Location.getCurrentPositionAsync({});
    return location.coords.latitude + ',' + location.coords.longitude;
}