const GPT_KEY = process.env.EXPO_PUBLIC_GPT_KEY
import { data } from '@/constants'
import {
  getDistanceMatrix,
  getNearbyEntertainment,
  getNearbyMilkTea,
  getNearbyPlaces,
} from './google-map-api'
import {
  Activity,
} from './gpt-plan-generate'
import SensorData from './sensorReader'
import { RecordingOptionsPresets } from 'expo-av/build/Audio'
import { 
  filterDistanceMatrixData,
  filterGoogleMapData,
} from './google-map-filter'

export interface RecommendDetail {
  destination: string
  destinationDescrib: string
  vicinity: string
  distance: string
  rating: number
  user_ratings_total: number
  photo_reference: string
  startLocation: string
  endLocation: string
}
function convertToRecommendDetail(place, currentLocation: string) {
  return {
    destination: place.name || 'Unknown Name',
    destinationDescrib: null,
    vicinity: place.vicinity || 'Unknown Vicinity',
    distance: null,
    rating: place.rating,
    user_ratings_total: place.user_ratings_total,
    photo_reference: place.photo_reference || '',
    startLocation: currentLocation,
    endLocation: `${place.geometry.lat},${place.geometry.lng}`,
  }
}
function convertToActivity(recommend: RecommendDetail): Activity {
  return {
    date: null,
    time: null,
    duration: null,
    destination: recommend.destination,
    destinationDescrib: recommend.destinationDescrib || null,
    destinationDuration: null,
    transportation: null,
    distance: recommend.distance,
    estimatedPrice: null,
    startLocation: recommend.startLocation || null,
    endLocation: recommend.endLocation || null,
    photo_reference: recommend.photo_reference || null,
    rating: recommend.rating !== undefined ? recommend.rating : null,
    user_ratings_total:
      recommend.user_ratings_total !== undefined
        ? recommend.user_ratings_total
        : null,
  }
}
const Types = [
  'restaurant',
  'milktea',
  'cafe',
  'tourist_attraction',
  'entertainment',
]

export async function getRecommendsTips(
  requestMessage: string
): Promise<Activity[] | void> {
  if (!GPT_KEY) {
    console.error('GPT_KEY is not defined.')
    return
  }

  const url = 'https://api.openai.com/v1/chat/completions'
  const requestBody = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Please based on the environmental information giving to you to give your users some advice. 
        You will receive a dictionary of environmental information in the format ${SensorData}. And a dictionary about the weather. The time about the weather forcasting is next hour. Giving suggestions according to that time.
        Based on what's on these background informations, you need to 
        output some genral tips, numberd by 1,2,3... . Only show these tips. Don't show the actual data if the data is hard to understand for the user, only show the suggestions. The suggestions should
        include topics about: Weather and outdoor activities suggestions, Health suggestions related to the environment, and Pedometer data, light suggetions. If you don't receive the required
        data, dont't show the suggestions about it. These suggestions need to be very useful in everyday life.
        Eensure you return right formate. Make the suggestion smart and capable and You need to focus on caring for me in your language!`,
      },
      { role: 'user', content: requestMessage },
    ],
    max_tokens: 2000,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GPT_KEY}`,
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Error calling GPT API:', error)
  }
}
export async function generateDailyRecommends(
  currentLocation: string
): Promise<Activity[] | void> {
  try {
    let restaurants = []
    let milkteas = []
    let cafes = []
    let entertainments = []
    let attractions = []

    const promises = Types.map(async (type) => {
      const radius = 2500
      switch (type) {
        case 'entertainment':
          const placesJson_ent = await getNearbyEntertainment(
            currentLocation,
            radius,
            [
              'bar',
              'karaoke',
              'escaperoom',
              'boardgame',
              'bowling',
              'spa',
              'arcade',
              'cinema',
              'museum',
            ]
          )
          const filteredPlacesJson_ent = filterGoogleMapData(
            placesJson_ent,
            currentLocation
          )
          entertainments = filteredPlacesJson_ent
          break
        case 'milktea':
          const placesJson_mkt = await getNearbyMilkTea(currentLocation, radius)
          const filteredPlacesJson_mkt = filterGoogleMapData(
            placesJson_mkt,
            currentLocation
          )
          milkteas = filteredPlacesJson_mkt
          break
        default:
          const placesJson = await getNearbyPlaces(
            currentLocation,
            radius,
            type
          )
          const filteredPlacesJson = filterGoogleMapData(
            placesJson,
            currentLocation
          )
          if (type == 'restaurant') {
            restaurants = filteredPlacesJson
          } else if (type == 'cafe') {
            cafes = filteredPlacesJson
          } else if (type == 'tourist_attraction') {
            attractions = filteredPlacesJson
          }
          break
      }
    })
    await Promise.all(promises)

    function weightedRandomSelect(
      arr: RecommendDetail[]
    ): RecommendDetail | null {
      const totalWeight = arr.reduce((sum, item) => sum + (item.rating || 0), 0)
      const random = Math.random() * totalWeight
      let cumulativeWeight = 0

      for (const item of arr) {
        cumulativeWeight += item.rating || 0
        if (random <= cumulativeWeight) {
          return item
        }
      }
    }

    const randomRestaurant =
      restaurants.length > 0
        ? convertToRecommendDetail(
            weightedRandomSelect(restaurants),
            currentLocation
          )
        : null

    const randomMilktea =
      milkteas.length > 0
        ? convertToRecommendDetail(
            weightedRandomSelect(milkteas),
            currentLocation
          )
        : null

    const randomCafe =
      cafes.length > 0
        ? convertToRecommendDetail(weightedRandomSelect(cafes), currentLocation)
        : null

    const randomEntertainment =
      entertainments.length > 0
        ? convertToRecommendDetail(
            weightedRandomSelect(entertainments),
            currentLocation
          )
        : null

    const randomAttraction =
      attractions.length > 0
        ? convertToRecommendDetail(
            weightedRandomSelect(attractions),
            currentLocation
          )
        : null

    let recommends = []

    if (randomRestaurant) recommends.push(randomRestaurant)
    if (randomMilktea) recommends.push(randomMilktea)
    if (randomCafe) recommends.push(randomCafe)
    if (randomEntertainment) recommends.push(randomEntertainment)
    if (randomAttraction) recommends.push(randomAttraction)
    if (recommends.length === 0) {
      console.error('No valid recommend returned')
      return
    }

    let vicinities: string[] = recommends.map((recommend) => recommend.vicinity)
    const distanceMatrix = await getDistanceMatrix(
      [currentLocation],
      vicinities
    )
    const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix)
    let output: Activity[] = []
    for (let i = 0; i < recommends.length; i++) {
      // If distance is not returned by google map, do not add it into the output
      if (filteredDistanceMatrix[0][i]?.distance != null) {
        recommends[i].distance = filteredDistanceMatrix[0][i].distance;
        let activity = convertToActivity(recommends[i]);
        output.push(activity);
      }
      
    }

    return output
  } catch (error) {
    console.error('Error generating recommends:', error)
    console.error(error.stack)
    return
  }
}
