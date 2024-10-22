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
  filterDistanceMatrixData,
  filterGoogleMapData,
  GoogleMapPlace,
  GoogleMapResponse,
} from './gpt-plan-generate'
import SensorData from './sensorReader'
import { RecordingOptionsPresets } from 'expo-av/build/Audio'
// export interface RecommendDetail {
//   destination: string
//   destinationDescrib: string
//   vicinity: string
//   distance: string
//   estimatedPrice: string
//   photo_reference: string
//   startLocation: string
//   endLocation:string
// }

// const recommend_example = [
//   {
//     destination: 'ABC restaurant',
//     destinationDescrib: 'A delicious restaurant',
//     vicinity: '734 Swanston Rd, Carlton',
//     distance: '1 km',
//     estimatedPrice: '20 AUD',
//     photo_reference: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     startLocation: '48.8566,2.3522',
//     endLocation: '48.8606,2.3376'
//   },
//   {
//     destination: 'ABC restaurant',
//     destinationDescrib: 'A delicious restaurant',
//     vicinity: '734 Swanston Rd, Carlton',
//     distance: '1 km',
//     estimatedPrice: '20 AUD',
//     photo_reference: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     startLocation: '48.8566,2.3522',
//     endLocation: '48.8606,2.3376'
//   },
// ]
export interface RecommendDetail {
  destination: string
  destinationDescrib: string
  vicinity: string
  distance:string
  rating: number
  user_ratings_total: number
  photo_reference: string
  startLocation: string
  endLocation:string
}
function convertToRecommendDetail(place, currentLocation:string) {
  return {
    destination: place.name || 'Unknown Name',
    destinationDescrib: null, 
    vicinity: place.vicinity || 'Unknown Vicinity',
    distance: '',
    rating: place.rating,
    user_ratings_total : place.user_ratings_total,
    photo_reference: place.photo_reference || '',
    startLocation: currentLocation, 
    endLocation: `${place.geometry.lat},${place.geometry.lng}`,   
  };
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
    distance: recommend.distance || null,
    estimatedPrice: null,
    startLocation: recommend.startLocation || null,
    endLocation: recommend.endLocation || null,
    photo_reference: recommend.photo_reference || null,
    rating: recommend.rating !== undefined ? recommend.rating : null,
    user_ratings_total: recommend.user_ratings_total !== undefined ? recommend.user_ratings_total : null,
  };
}
const Types = ['restaurant', 'milktea','cafe', 'tourist_attraction', 'entertainment']

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
        content: `You are playing a cosplay game with me, you are a my cute girlfriend that needs more of this environmental information to give your users some advice. 
        You will receive a dictionary of environmental information in the format ${SensorData}. And a dictionary about the weather. The time about the weather forcasting is next hour. Giving suggestions according to that time.
        Based on what's on these background informations, you need to 
        output some natural language suggestions to the user. Don't show the actual data if the data is hard to understand for the user, only show the suggestions. The suggestions should
        include topics about: Weather and outdoor activities suggestions, Health suggestions related to the environment, and Pedometer data, light suggetions. If you don't receive the required
        data, dont't show the suggestions about it. These suggestions need to be very useful in everyday life. The Remember you are playing as a people, don't show you are a robot.
        Only use natural language without formate like bold. ensure you return right formate. You need to focus on caring for me in your language!`,
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
    let restaurants
    let milkteas
    let cafes
    let entertainments
    let attractions

    const promises = Types.map(async (type) => {
      switch (type) {
        case 'entertainment':
          const placesJson_ent = await getNearbyEntertainment(
            currentLocation,
            2500,
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
          const filteredPlacesJson_ent = filterGoogleMapData(placesJson_ent)
          entertainments = filteredPlacesJson_ent  
          break
        case 'milktea':
          const placesJson_mkt = await getNearbyMilkTea(currentLocation, 2500)
          const filteredPlacesJson_mkt = filterGoogleMapData(placesJson_mkt)
          milkteas = filteredPlacesJson_mkt
          break
        default:
          const placesJson = await getNearbyPlaces(currentLocation, 2500, type)
          const filteredPlacesJson = filterGoogleMapData(placesJson)
          if (type == 'restaurant') {
            restaurants =filteredPlacesJson
          } else if (type == 'cafe') {
            cafes = filteredPlacesJson
          } else if (type == 'tourist_attraction') {
            attractions = filteredPlacesJson
          }
          break
      }
    })
    await Promise.all(promises)

    function weightedRandomSelect(arr: RecommendDetail[]): RecommendDetail | null {
      const totalWeight = arr.reduce((sum, item) => sum + (item.rating || 0), 0);
      const random = Math.random() * totalWeight;
      let cumulativeWeight = 0;

      for (const item of arr) {
        cumulativeWeight += item.rating || 0;
        if (random <= cumulativeWeight) {
          return item;
        }
      }
    }

    const randomRestaurant = convertToRecommendDetail(weightedRandomSelect(restaurants), currentLocation)
    const randomMilktea = convertToRecommendDetail(weightedRandomSelect(milkteas), currentLocation)
    const randomCafe = convertToRecommendDetail(weightedRandomSelect(cafes),currentLocation)
    const randomEntertainment = convertToRecommendDetail(weightedRandomSelect(entertainments),currentLocation)
    const randomAttraction = convertToRecommendDetail(weightedRandomSelect(attractions),currentLocation)

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

    let vicinities: string[] = recommends.map(recommend => recommend.vicinity)
    const distanceMatrix = await getDistanceMatrix([currentLocation], vicinities)
    const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix)

    let output: Activity[] = []
    for (let i = 0; i < recommends.length; i++) {
      recommends[i].distance = filteredDistanceMatrix[0][i].distance
      let activity = convertToActivity(recommends[i])
      output.push(activity)
    }

    return output
  } catch (error) {
    console.error('Error generating plan:', error)
    return
  }
}


// async function getRecommends(
//   requestMessage: string
// ): Promise<RecommendDetail[] | void> {
//   if (!GPT_KEY) {
//     console.error('GPT_KEY is not defined.')
//     return
//   }

//   const url = 'https://api.openai.com/v1/chat/completions'

//   const requestBody = {
//     model: 'gpt-4o-mini',
//     messages: [
//       {
//         role: 'system',
//         content: `You are a robot to provide daily recommendation of places of types ${Types} in the form of JSON based on the given data from Google Map API. 4 dataset will be given, you must completely randomly select only one place from each dataset to generate recommendation for each type of places. You must return in the form like: ${JSON.stringify(recommend_example)} and avoid any syntax error. 
//                 If there are n datasets, the list contain n recommendations. The list can contain <n recommendations. If the dataset is empty, skip that type and do recommendation for the next type.
//                 "destination" is the true name of the destination in the data given."destination describ" is the description of the destination."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data).
//                 Fill in the "vicinity" with "vicinity" of the data given and keep "distance" be null. And the photo_reference is exactly the photo_reference from the given Google Map API data, no need to change it. You should only choose the destinations from the given Google Map API data. YOu must return the json 
//                 in the form of string without \`\`\`.Do not return anything beyond the given data. Do not return anything besides the JSON.The recommend mustcontain all the keys in the sample form. 
//                 `,
//       },
//       { role: 'user', content: requestMessage },
//     ],
//     max_tokens: 2000,
//   }

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${GPT_KEY}`,
//       },
//       body: JSON.stringify(requestBody),
//     })

//     const data = await response.json()
//     // console.log('data:', data.choices[0].message.content)
//     return JSON.parse(data.choices[0].message.content)
//   } catch (error) {
//     console.error('Error calling GPT API:', error)
//   }
// }
// export async function generateDailyRecommends(
//   currentLocation: string
// ): Promise<RecommendDetail[] | void> {
//   try {
//     let data_string = ''
//     const promises = Types.map(async (type) => {
//       switch (type) {
//         case 'entertainment':
//           const placesJson_ent = await getNearbyEntertainment(
//             currentLocation,
//             2500,
//             [
//               'bar',
//               'karaoke',
//               'escaperoom',
//               'boardgame',
//               'bowling',
//               'spa',
//               'arcade',
//               'cinema',
//               'museum',
//             ]
//           )
//           const filteredPlacesJson_ent = filterGoogleMapData(placesJson_ent)
//           data_string += `${type}: ${JSON.stringify(filteredPlacesJson_ent)};`
//           break
//         case 'milktea':
//           const placesJson_mkt = await getNearbyMilkTea(currentLocation, 2500)
//           const filteredPlacesJson_mkt = filterGoogleMapData(placesJson_mkt)
//           data_string += `${type}: ${JSON.stringify(filteredPlacesJson_mkt)};`
//         default:
//           const placesJson = await getNearbyPlaces(currentLocation, 2500, type)
//           const filteredPlacesJson = filterGoogleMapData(placesJson)
//           data_string += `${type}: ${JSON.stringify(filteredPlacesJson)};`
//           break
//       }
//     })
//     console.log("----------------------places data get all--------------")
//     await Promise.all(promises)

//     let requestString = `${data_string}`
//     let recommends = await getRecommends(requestString)
//     console.log("----------------------recommends get from gpt--------------")
//     if (!recommends) {
//       console.error('No valid recommend returned')
//       return
//     }

//     let vicinities: string[] = []
//     recommends.forEach((recommend) => {
//       vicinities.push(recommend.vicinity)
//     })
//     const distanceMatrix = await getDistanceMatrix(
//       [currentLocation],
//       vicinities
//     )
//     const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix)
//     let output: Activity[] = [];
//     for (let i = 0; i < recommends.length; i++) {
//       recommends[i].distance = filteredDistanceMatrix[0][i].distance
//       let activity = convertToActivity(recommends[i]);
//       output.push(activity);
//     }

//     return output
//   } catch (error) {
//     console.error('Error generating plan:', error)
//     return
//   }
// }
