export const GOOGLE_MAP_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;

export const GOOGLE_MAP_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + GOOGLE_MAP_KEY;


// Get the nearby places based on the coordinates and radius.
export async function getNearbyPlaces(currentLocation: string, radius: number, placeType: string, minPrice?: number, maxPrice?: number) {
    const url = GOOGLE_MAP_API_BASE_URL + '&location=' + currentLocation + '&radius=' + radius + '&type=' + placeType + 
                (minPrice ? '&minprice=' + minPrice : '') + (maxPrice ? '&maxprice=' + maxPrice : '')+`&opennow=true`;
    let res = await fetch(url);
    return res.json();
}

export async function getNearbyEntertainment(currentLocation: string, radius: number, keywords: string[]){
    const keywordString = keywords.join('|');
    const url = GOOGLE_MAP_API_BASE_URL + '&location=' + currentLocation + '&radius=' + radius + `&keyword=`+keywordString + `&opennow=true`;
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