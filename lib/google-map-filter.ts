import {
    fastDistance,
} from './google-map-api'

export interface GoogleMapPlace {
    name?: string
    vicinity?: string
    rating?: number
    user_ratings_total?: number
    price_level?: number
    types?: string[]
    geometry?: {
        location?: {
        lat: number
        lng: number
        }
    }
    photos?: {
        photo_reference?: string
    }[]
}

export interface GoogleMapResponse {
    results: GoogleMapPlace[]
}

export const filterGoogleMapData = (data: GoogleMapResponse, currentLocation: string) => {
    try {
        console.log("checking data")
        if (!data || !data.results) {
        return []
        }
        // console.log("data", data.results)
        const filteredResults = data.results
        .filter((place) => {
            return place.photos && place.photos.length > 0
        })
        .map((place: GoogleMapPlace) => ({
            name: place.name || 'Unknown Name',
            vicinity: place.vicinity || 'Unknown Vicinity',
            rating: place.rating !== undefined ? place.rating : 0,
            user_ratings_total:
            place.user_ratings_total !== undefined ? place.user_ratings_total : 0,
            price_level: place.price_level !== undefined ? place.price_level : 0,
            types: place.types || [],
            geometry: place.geometry?.location || { lat: 0, lng: 0 },
            photo_reference: place.photos?.[0]?.photo_reference || '',
            distance: fastDistance(parseFloat(currentLocation.split(',')[0]), parseFloat(currentLocation.split(',')[1]), place.geometry?.location?.lat || 0, place.geometry?.location?.lng || 0)
        }))

        return filteredResults
    } catch (error) {
        throw 'Error filtering Google Map data'
    }
}

export const filterDistanceMatrixData = (data: any) => {
    const filteredResults = data.rows.map((row: any, originIndex: number) => {
        return row.elements.map((element: any, destinationIndex: number) => ({
        origin: data.origin_addresses[originIndex] || 'Unknown Origin',
        destination:
            data.destination_addresses[destinationIndex] || 'Unknown Destination',
        distance: element.distance?.text || '0 km',
        duration: element.duration?.text || '0 mins',
        }))
    })

    return filteredResults
}