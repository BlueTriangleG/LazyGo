export const GOOGLE_MAP_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;

export const GOOGLE_MAP_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + GOOGLE_MAP_KEY;


// Get the nearby places based on the coordinates and radius.
export async function getNearbyPlaces(currentLocation: string, radius: number, placeType: string, minPrice?: number, maxPrice?: number) {
    const url = GOOGLE_MAP_API_BASE_URL + '&location=' + currentLocation + '&radius=' + radius + '&type=' + placeType + 
                (minPrice ? '&minprice=' + minPrice : '') + (maxPrice ? '&maxprice=' + maxPrice : '');
    fetch(url)
    .then(res => {
        return res.json();
    })
    .catch(error => { 
        console.log(error);
    });
}

// Get the distance matrix between the origins and destinations.
export async function getDistanceMatrix(origins: string[], destinations: string[], mode?: string) {
    if (!mode) {
        mode = 'driving';
    }
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?key=' + GOOGLE_MAP_KEY + 
                '&origins=' + origins.map(origin => origin).join('|') + 
                '&destinations=' + destinations.map(destination => destination).join('|') + "&mode=" + mode;
    return fetch(url)
    .then(res => {
        return res.json();
    })
    .catch(error => { 
        console.log(error);
    });
}

// Get the photo by the photo reference.
export async function getPhotoByReference(photoReference: string) {
    const url = 'https://maps.googleapis.com/maps/api/place/photo?key=' + GOOGLE_MAP_KEY + '&photoreference=' + photoReference + '&maxwidth=400';
    return fetch(url)
    .then(res => {
        return res.blob();
    })
    .catch(error => { 
        console.log(error);
    });
}