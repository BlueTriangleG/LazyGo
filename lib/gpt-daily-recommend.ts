const GPT_KEY = process.env.EXPO_PUBLIC_GPT_KEY
import { data } from '@/constants'
import { getDistanceMatrix, getNearbyPlaces } from './google-map-api'
import {
  filterDistanceMatrixData,
  filterGoogleMapData,
} from './gpt-plan-generate'
import SensorData from './sensorReader'
export interface RecommendDetail {
  destination: string
  destinationDescrib: string
  vicinity: string
  distance: string
  estimatedPrice: string
}

const recommend_example = [
  {
    destination: 'ABC restaurant',
    destinationDescrib: 'A delicious restaurant',
    vicinity: '734 Swanston Rd, Carlton',
    distance: '1 km',
    estimatedPrice: '20 AUD',
  },
  {
    destination: 'ABC restaurant',
    destinationDescrib: 'A delicious restaurant',
    vicinity: '734 Swanston Rd, Carlton',
    distance: '1 km',
    estimatedPrice: '20 AUD',
  },
]

const Types = ['restaurant', 'cafe', 'tourist_attraction']

async function getRecommends(
  requestMessage: string
): Promise<RecommendDetail[] | void> {
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
        content: `You are a robot to provide daily recommendation of places of types ${Types} in the form of JSON based on the given data from Google Map API. 3 dataset will be given, you must randomly 
        select only one place from each dataset to generate recommendation for each type of places. You must return in the form like: ${JSON.stringify(recommend_example)} and avoid any syntax error. If 
        there are n datasets, the list must only contain n recommendations.
                The previous recommends will also be provided. Your recommendation must not contain the destinations in the previous recommends.
                "destination describ" is the description of the destination."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data).
                Fill in the "vicinity" with "vicinity" of the data given and keep "distance" be null. You should only choose the destinations from the given Google Map API data. YOu must return the json 
                in the form of string without \`\`\`.Do not return anything beyond the given data. Do not return anything besides the JSON.The activity you planned must contain all the keys in the sample form. 
                If a day has no plan, do not include it in the JSON.`,
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
    return JSON.parse(data.choices[0].message.content)
  } catch (error) {
    console.error('Error calling GPT API:', error)
  }
}
export async function getRecommendsTips(
  requestMessage: string
): Promise<RecommendDetail[] | void> {
  if (!GPT_KEY) {
    console.error('GPT_KEY is not defined.')
    return
  }

  const url = 'https://api.openai.com/v1/chat/completions'
  console.log('requestMessage:', requestMessage)
  const requestBody = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are playing a cosplay game with me, you are a my cute girlfriend that needs more of this environmental information to give your users some advice. 
        You will receive a dictionary of environmental information in the format ${SensorData}. And a dictionary about the weather. Based on what's on these dictionaries, you need to 
        output some natural language suggestions to the user. Don't show the actual data if the data is hard to understand for the user, only show the suggestions. The suggestions should
        include topics about: Weather and outdoor activities suggestions, Health suggestions related to the environment, and Pedometer data, light suggetions. If you don't receive the required
        data, dont't show the suggestions about it. These suggestions need to be very useful in everyday life. Remember you are playing as a people, don't show you are a robot.
         Only use natural language, no text formate and emojis. You need to focus on caring for me in your language! Try to try to reflect your cuteness in words`,
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

// TODO: Need to update the previous recommends
export async function generateDailyRecommends(
  currentLocation: string,
  previous_recommends: RecommendDetail[] = []
): Promise<RecommendDetail[] | void> {
  try {
    let data_string = ''
    const promises = Types.map(async (type) => {
      const placesJson = await getNearbyPlaces(currentLocation, 2500, type)
      const filteredPlacesJson = filterGoogleMapData(placesJson)
      data_string += `${type}: ${JSON.stringify(filteredPlacesJson)};`
    })

    await Promise.all(promises)

    let requestString = `${data_string}; Previous recommends: ${JSON.stringify(previous_recommends)}`
    let recommends = await getRecommends(requestString)
    if (!recommends) {
      console.error('No valid recommend returned')
      return
    }

    let vicinities: string[] = []
    recommends.forEach((recommend) => {
      vicinities.push(recommend.vicinity)
    })
    const distanceMatrix = await getDistanceMatrix(
      [currentLocation],
      vicinities
    )
    const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix)
    for (let i = 0; i < recommends.length; i++) {
      recommends[i].distance = filteredDistanceMatrix[0][i].distance
    }
    return recommends
  } catch (error) {
    console.error('Error generating plan:', error)
    return
  }
}
