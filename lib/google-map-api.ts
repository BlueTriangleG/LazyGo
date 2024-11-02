export const GOOGLE_MAP_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;

export const GOOGLE_MAP_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + GOOGLE_MAP_KEY;

export const photoUrlBase: string = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=' + process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY + '&photoreference=';

// Get the nearby places based on the coordinates and radius.
export async function getNearbyPlaces(currentLocation: string, radius: number, placeType: string, minPrice?: number, maxPrice?: number) {
    let url = GOOGLE_MAP_API_BASE_URL + '&location=' + currentLocation + '&radius=' + radius + '&type=' + placeType + 
                (minPrice ? '&minprice=' + minPrice : '') + (maxPrice ? '&maxprice=' + maxPrice : '')+`&opennow=true`;
    if (placeType=='cafe'){
        url += `&keyword=coffee`
    }
    console.log("The url: " + url);
    let res = await fetch(url);
    return res.json();
}

export async function getNearbyEntertainment(currentLocation: string, radius: number, keywords: string[]){
    const keywordString = keywords.join('|');
    const url = GOOGLE_MAP_API_BASE_URL + '&location=' + currentLocation + '&radius=' + radius + `&keyword=`+keywordString + `&opennow=true`;
    let res = await fetch(url);
    return res.json();
}

export async function getNearbyMilkTea(currentLocation: string, radius: number){
    const url = GOOGLE_MAP_API_BASE_URL + '&location=' + currentLocation + '&radius=' + radius + `&keyword=milktea` + `&opennow=true`;
    let res = await fetch(url);
    return res.json();
}

// Get the distance matrix between the origins and destinations.
export async function getDistanceMatrix(origins: string[], destinations: string[], mode?: string, departureTime?: string) {
    if (!mode) {
        mode = 'driving';
    }
    if (!departureTime) {
        departureTime = 'now';
    }
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?key=' + GOOGLE_MAP_KEY + 
                '&origins=' + origins.map(origin => origin).join('|') + 
                '&destinations=' + destinations.map(destination => destination).join('|') + "&mode=" + mode;
    let res = await fetch(url);
    return res.json();
}

// Get the photo by the photo reference.
export async function getPhotoByReference(photoReference: string) {
    const url = 'https://maps.googleapis.com/maps/api/place/photo?key=' + GOOGLE_MAP_KEY + '&photoreference=' + photoReference + '&maxwidth=400';
    let res = await fetch(url);
    return res.blob();
}

/**  Use approximate distance calculation to get the distance between two coordinates. 
* [link1](https://support.garmin.com/en-US/?faq=hRMBoCTy5a7HqVkxukhHd8)
* [line2](https://www.dcceew.gov.au/themes/custom/awe/fullcam/Help-FullCAM2020/180_Latitude%20and%20Longitude.htm)
* 
* @param lat1 
* @param lon1
* @param lat2
* @param lon2
* @returns distance in km
*/ 
export function fastDistance(lat1: number, lon1: number, lat2: number, lon2: number) {

    // If the coordinates are not available, return 0.
    if ((lat1 === 0 && lon1 === 0) || (lat2 === 0 && lon2 === 0)) {
        return 0;
    }
    // 0.01 degree is approximately 1.11 km
    const delta_0_01 = 1.11;
    // Multiply the difference of the coordinates by multipliers to get distance in "km".
    const delta_lat = Math.abs(lat1 - lat2) * 100 * delta_0_01;
    const delta_lon = Math.abs(lon1 - lon2) * 100 * delta_0_01;
    if (delta_lat > 10 || delta_lon > 10) {
        // The distance is too far, return -1.
        return -1;
    }
    const d = Math.sqrt(delta_lat * delta_lat + delta_lon * delta_lon);
    return d;
}
