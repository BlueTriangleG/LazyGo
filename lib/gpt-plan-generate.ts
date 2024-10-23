import { useState } from 'react'
import {
  getDistanceMatrix,
  getNearbyEntertainment,
  getNearbyMilkTea,
  getNearbyPlaces,
} from './google-map-api'
import { min } from 'date-fns'
import { getHistory, plusVisited } from './history-management'

const GPT_KEY = process.env.EXPO_PUBLIC_GPT_KEY
export interface Activity {
  date: string | null
  time: string | null
  duration: string | null
  destination: string | null
  destinationDescrib: string | null
  destinationDuration: string | null
  transportation: string | null
  distance: string | null
  estimatedPrice: string | null
  startLocation: string | null
  endLocation: string | null
  photo_reference: string | null
  rating: number | null
  user_ratings_total : number | null
}

export interface Plan {
  [key: number]: Activity[]
}

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

export const filterGoogleMapData = (data: GoogleMapResponse) => {
  try {
    if (!data || !data.results) {
      return []
    }
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

const json_sample: Plan = {
  1: [
    {
      date: '2024-09-29',
      time: '8:00',
      duration: '10 min',
      destination: 'X',
      destinationDescrib: 'X',
      destinationDuration: '60',
      transportation: 'Car',
      distance: '3km',
      estimatedPrice: '15 AUD',
      startLocation: '48.8566,2.3522',
      endLocation: '48.8606,2.3376',
      photo_reference: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rating: 4.5,
      user_ratings_total: 2000
    },
    {
      date: '2024-09-29',
      time: '8:00',
      duration: '10 min',
      destination: 'X',
      destinationDescrib: 'X',
      destinationDuration: '60',
      transportation: 'Car',
      distance: '3km',
      estimatedPrice: '15 AUD',
      startLocation: '48.8566,2.3522',
      endLocation: '48.8606,2.3376',
      photo_reference: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rating: 4.5,
      user_ratings_total: 2000
    },
  ],
  2: [
    {
      date: '2024-09-29',
      time: '8:00',
      duration: '10',
      destination: 'X',
      destinationDescrib: 'X',
      destinationDuration: '60',
      transportation: 'Car',
      distance: '3km',
      estimatedPrice: '15 AUD',
      startLocation: '48.8566,2.3522',
      endLocation: '48.8606,2.3376',
      photo_reference: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rating: 4.5,
      user_ratings_total: 2000
    },
  ],
}

// Function to generate meal plan for the day or the next day, including breakfast, lunch, dinner
export async function generatePlan_restaurant(
  gps_location: string,
  TimeSpend: number,
  travel_mode: string,
  minPrice?: number,
  maxPrice?: number
): Promise<Plan | void> {
  const now = new Date()
  const departureTime = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString()
  console.log(departureTime)
  let currentLocation = gps_location
  const time = departureTime.slice(11, 19)
  const hours = parseInt(time.slice(0, 2))
  const minutes = parseInt(time.slice(3, 5))
  console.log(`Current time: ${hours}:${minutes}`)
  let numMeals = 1
  let radius = 0
  switch (travel_mode) {
    case 'driving':
      radius = TimeSpend * 350
      break
    case 'walking':
      radius = TimeSpend * 84
      break
    case 'transit':
      radius = TimeSpend * 200
      break
  }
  try {
    // Get gpt generate history
    const history = await getHistory()
    // console.log(`History: ${JSON.stringify(history)}`)
    let planJson: Plan = { 1: [] }
    for (let i = 0; i < numMeals; i++) {
      const placesJson = await getNearbyPlaces(
        currentLocation,
        radius,
        'restaurant',
        undefined,
        maxPrice
      )
      let filteredPlacesJson = filterGoogleMapData(placesJson)
      // console.log(filteredPlacesJson);

      const locations: string[] = []
      filteredPlacesJson.forEach((place) => {
        const location = place.vicinity
        locations.push(location)
      })

      const distanceMatrix = await getDistanceMatrix(
        [currentLocation],
        locations,
        travel_mode
      )
      const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix)
      // console.log(JSON.stringify(filteredDistanceMatrix))
      // Let GPT to generate the next activity
      if (!GPT_KEY) {
        console.error('GPT_KEY is not defined.')
        return
      }

      const url = 'https://api.openai.com/v1/chat/completions'
      // const requestMessage = `It's ${currentTime} now. If the current time exceed 9 pm, Give me the meal plan for next day. Please fill in the "transportation" with ${travel_mode || "driving"} (Capitalize the first letter).There are ${numMeals-i} meals remaining.
      // If 3 meals remaining, give me the breakfast plan, "time" must be a reasonable breakfast time. If 2 meals remaining, give me the lunch plan, "time" must be a reasonable lunch time. If 1 meal remaining, give me dinner plan,"time" must be a reasonable dinner time.
      // All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
      // The current plan is ${JSON.stringify(planJson)}. [Important] 1.Don't let me go to the same attraction twice.2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan.`
      const requestMessage = `It's ${departureTime} now. Please fill in the "transportation" with ${travel_mode || 'driving'} (Capitalize the first letter). Let the "time" of the plan be the current time.
            All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}. You don't need to change the photo_reference from the given data, just use the photo_reference in the given data.
            The current plan is ${JSON.stringify(planJson)}. The history is ${JSON.stringify(history)}. "title" in history is the names of places."visit_count" is the times the user has visited this place.`

      const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a robot to decide which restuarant to go based on the price level, rating, distance and duration from given data.You must return in the form like: ${JSON.stringify(json_sample[1][0])} and avoid any syntax error.You should only return the string form of the json.
                        "destination" is the true name of the destination in the data given."time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "rating", "user_rating_in_total", "startLocation" and "endLocation" of the destination based on the given map data. 
                        Fill in the "duration", "distances" with the given data containing distances and durations.The "startLocation" must be "${currentLocation}". The "endLocation" must be the latitude and longtitude of the destination. You should only choose the destinations from the given Google Map API data.
                        Do not return anything beyond the given data. Do not return anything besides the JSON.The activity you planned must contain all the keys in the sample form. If a day has no plan, do not include it in the JSON. If the given data of places around is empty, you must return {} (empty json).
                        [Important] 1.Don't let me go to the same attraction twice. 2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan. 3.The generated plan should avoid the repeated places in history. 4.If all places in the dataset exist in history, the less visited a place is, the easier it is to be selected. However, distance, price, and ratings should not be ignored.`,
          },
          { role: 'user', content: requestMessage },
        ],
        max_tokens: 1000,
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GPT_KEY}`,
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      const activity = data.choices[0].message.content
      if (activity !== JSON.stringify({})) {
        const activity_json: Activity = JSON.parse(activity)
        planJson[1].push(activity_json)
        currentLocation = activity_json.endLocation
      }
    }
    for (let day in planJson) {
      planJson[day].forEach((activity, index) => {
        const destinationName = activity.destination
        plusVisited(destinationName)
      })
    }
    return planJson
  } catch (error) {
    console.error('Error generating plan:', error)
    return
  }
}

// Function to generate cafe plan
export async function generatePlan_cafe(
  gps_location: string,
  TimeSpend: number,
  travel_mode: string,
  minPrice?: number,
  maxPrice?: number
): Promise<Plan | void> {
  let currentLocation = gps_location
  let numMeals = 1

  const now = new Date()
  const departureTime = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString()
  console.log(departureTime)
  const time = departureTime.slice(11, 19)
  const hours = parseInt(time.slice(0, 2))
  const minutes = parseInt(time.slice(3, 5))
  console.log(`Current time: ${hours}:${minutes}`)
  let radius = 0
  switch (travel_mode) {
    case 'driving':
      radius = TimeSpend * 300
      break
    case 'walking':
      radius = TimeSpend * 60
      break
    case 'transit':
      radius = TimeSpend * 150
      break
  }
  try {
    const history = await getHistory()
    let planJson: Plan = { 1: [] }
    for (let i = 0; i < numMeals; i++) {
      const placesJson = await getNearbyPlaces(
        currentLocation,
        radius,
        'cafe',
        minPrice,
        maxPrice
      )
      let filteredPlacesJson = filterGoogleMapData(placesJson)
      // console.log(filteredPlacesJson);
      const locations: string[] = []
      filteredPlacesJson.forEach((place) => {
        const location = place.vicinity
        locations.push(location)
      })

      const distanceMatrix = await getDistanceMatrix(
        [currentLocation],
        locations,
        travel_mode
      )
      const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix)
      // console.log(JSON.stringify(filteredDistanceMatrix))
      // Let GPT to generate the next activity
      if (!GPT_KEY) {
        console.error('GPT_KEY is not defined.')
        return
      }

      const url = 'https://api.openai.com/v1/chat/completions'
      // const requestMessage = `It's ${currentTime} now. If the current time exceed 5 pm, Give me the plan to go to a cafe next day.  Please fill in the "transportation" with ${travel_mode || "driving"} (Capitalize the first letter).There are ${numMeals-i} cafe remaining to go.
      // If there are 2 cafe to go, give me a plan to go a cafe in the morning, "time" must be a reasonable breakfast time. If there is 1 cafe to go, give me a plan to go a cafe in the afternoon, "time" must be a reasonable afternoon tea time.
      // All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
      // The current plan is ${JSON.stringify(planJson)}. [Important] 1.Don't let me go to the same attraction twice.2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan.`
      const requestMessage = `It's ${departureTime} now. Please fill in the "transportation" with ${travel_mode || 'driving'} (Capitalize the first letter).Let the "time" of the plan be the current time.
            All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
            The current plan is ${JSON.stringify(planJson)}.The history is ${JSON.stringify(history)}. "title" in history is the names of places."visit_count" is the times the user has visited this place.`
      const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a robot to decide which cafe to go based on the price level, rating, distance and duration from given data.You must return in the form like: ${JSON.stringify(json_sample[1][0])} and avoid any syntax error.You should only return the string form of the json.
                        "destination" is the true name of the destination in the data given."time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "rating", "user_rating_in_total", "startLocation" and "endLocation" of the destination based on the given map data.
                        Fill in the "duration", "distances" with the given data containing distances and durations.The "startLocation" must be "${currentLocation}". The "endLocation" must be the latitude and longtitude of the destination. You should only choose the destinations from the given Google Map API data.
                        Do not return anything beyond the given data. Do not return anything besides the JSON.The activity you planned must contain all the keys in the sample form. If a day has no plan, do not include it in the JSON.If the given data of places around is empty, you must return {} (empty json).
                        [Important] 1.Don't let me go to the same attraction twice. 2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan. 3.The generated plan should avoid the repeated places in history. 4.If all places in the dataset exist in history, the less visited a place is, the easier it is to be selected. However, distance, price, and ratings should not be ignored.`,
          },
          { role: 'user', content: requestMessage },
        ],
        max_tokens: 1000,
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GPT_KEY}`,
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      const activity = data.choices[0].message.content
      if (activity !== JSON.stringify({})) {
        const activity_json: Activity = JSON.parse(activity)
        planJson[1].push(activity_json)
        currentLocation = activity_json.endLocation
      }
    }
    for (let day in planJson) {
      planJson[day].forEach((activity, index) => {
        const destinationName = activity.destination
        plusVisited(destinationName)
      })
    }
    return planJson
  } catch (error) {
    console.error('Error generating plan:', error)
    return
  }
}

// Function to generate the plan for entertainment
// keywords can be : party: ["bar", "karaoke", "escaperoom","boardgame","bowling"], single:["spa","arcade","cinema","museum","park"]
export async function generatePlan_entertainment(
  gps_location: string,
  TimeSpend: number,
  travel_mode: string,
  keywords: string[]
): Promise<Plan | void> {
  let currentLocation = gps_location
  let numMeals = 1
  const now = new Date()
  const departureTime = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString()
  console.log(departureTime)
  const time = departureTime.slice(11, 19)
  const hours = parseInt(time.slice(0, 2))
  const minutes = parseInt(time.slice(3, 5))
  console.log(`Current time: ${hours}:${minutes}`)

  let radius = 0
  switch (travel_mode) {
    case 'driving':
      radius = TimeSpend * 300
      break
    case 'walking':
      radius = TimeSpend * 60
      break
    case 'transit':
      radius = TimeSpend * 150
      break
  }
  try {
    const history = await getHistory()
    console.log(`History: ${JSON.stringify(history)}`)
    let planJson: Plan = { 1: [] }
    for (let i = 0; i < numMeals; i++) {
      const placesJson = await getNearbyEntertainment(
        currentLocation,
        radius,
        keywords
      )
      let filteredPlacesJson = filterGoogleMapData(placesJson)
      // console.log(filteredPlacesJson);
      const locations: string[] = []
      filteredPlacesJson.forEach((place) => {
        const location = place.vicinity
        locations.push(location)
      })

      const distanceMatrix = await getDistanceMatrix(
        [currentLocation],
        locations,
        travel_mode
      )
      const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix)
      // console.log(JSON.stringify(filteredDistanceMatrix))
      // Let GPT to generate the next activity
      if (!GPT_KEY) {
        console.error('GPT_KEY is not defined.')
        return
      }

      const url = 'https://api.openai.com/v1/chat/completions'
      // const requestMessage = `It's ${currentTime} now. If the current time exceed 5 pm, Give me the plan to go to a cafe next day.  Please fill in the "transportation" with ${travel_mode || "driving"} (Capitalize the first letter).There are ${numMeals-i} cafe remaining to go.
      // If there are 2 cafe to go, give me a plan to go a cafe in the morning, "time" must be a reasonable breakfast time. If there is 1 cafe to go, give me a plan to go a cafe in the afternoon, "time" must be a reasonable afternoon tea time.
      // All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
      // The current plan is ${JSON.stringify(planJson)}. [Important] 1.Don't let me go to the same attraction twice.2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan.`
      const requestMessage = `It's ${TimeSpend} now. Please fill in the "transportation" with ${travel_mode || 'driving'} (Capitalize the first letter).Let the "time" of the plan be the current time.
            All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
            The current plan is ${JSON.stringify(planJson)}.The history is ${JSON.stringify(history)}. "title" in history is the names of places."visit_count" is the times the user has visited this place.`
      const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a robot to decide which place to go for entertainment based on the price level, rating, distance and duration from given data.You must return in the form like: ${JSON.stringify(json_sample[1][0])} and avoid any syntax error.You should only return the string form of the json.
                        "destination" is the true name of the destination in the data given."time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "rating", "user_rating_in_total", "startLocation" and "endLocation" of the destination based on the given map data. 
                        Fill in the "duration", "distances" with the given data containing distances and durations.The "startLocation" must be "${currentLocation}". The "endLocation" must be the latitude and longtitude of the destination. You should only choose the destinations from the given Google Map API data.
                        Do not return anything beyond the given data. Do not return anything besides the JSON.The activity you planned must contain all the keys in the sample form. If a day has no plan, do not include it in the JSON.If the given data of places around is empty, you must return {} (empty json).
                        [Important] 1.Don't let me go to the same attraction twice. 2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan. 3.The generated plan should avoid the repeated places in history. 4.If all places in the dataset exist in history, the less visited a place is, the easier it is to be selected. However, distance, price, and ratings should not be ignored.`,
          },
          { role: 'user', content: requestMessage },
        ],
        max_tokens: 1000,
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GPT_KEY}`,
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      const activity = data.choices[0].message.content
      if (activity !== JSON.stringify({})) {
        const activity_json: Activity = JSON.parse(activity)
        planJson[1].push(activity_json)
        currentLocation = activity_json.endLocation
      }
    }
    for (let day in planJson) {
      planJson[day].forEach((activity, index) => {
        const destinationName = activity.destination
        plusVisited(destinationName)
      })
    }
    return planJson
  } catch (error) {
    console.error('Error generating plan:', error)
    return
  }
}

// Function to generate the plan for entertainment

export async function generatePlan_milktea(
    gps_location: string,
    TimeSpend: number,
    travel_mode: string,
  ): Promise<Plan | void> {
    let currentLocation = gps_location
    let numMeals = 1
    const now = new Date()
  const departureTime = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString()
  console.log(departureTime)
  const time = departureTime.slice(11, 19)
  const hours = parseInt(time.slice(0, 2))
  const minutes = parseInt(time.slice(3, 5))
  console.log(`Current time: ${hours}:${minutes}`)

  let radius = 0
  switch (travel_mode) {
    case 'driving':
      radius = TimeSpend * 300
      break
    case 'walking':
      radius = TimeSpend * 60
      break
    case 'transit':
      radius = TimeSpend * 150
      break
  }
    try {
      const history = await getHistory()
      console.log(`History: ${JSON.stringify(history)}`)
      let planJson: Plan = { 1: [] }
      for (let i = 0; i < numMeals; i++) {
        const placesJson = await getNearbyMilkTea(
          currentLocation,
          radius,
        )
        let filteredPlacesJson = filterGoogleMapData(placesJson)
        // console.log(filteredPlacesJson);
        const locations: string[] = []
        filteredPlacesJson.forEach((place) => {
          const location = place.vicinity
          locations.push(location)
        })
  
        const distanceMatrix = await getDistanceMatrix(
          [currentLocation],
          locations,
          travel_mode
        )
        const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix)
        // console.log(JSON.stringify(filteredDistanceMatrix))
        // Let GPT to generate the next activity
        if (!GPT_KEY) {
          console.error('GPT_KEY is not defined.')
          return
        }
  
        const url = 'https://api.openai.com/v1/chat/completions'
        // const requestMessage = `It's ${currentTime} now. If the current time exceed 5 pm, Give me the plan to go to a cafe next day.  Please fill in the "transportation" with ${travel_mode || "driving"} (Capitalize the first letter).There are ${numMeals-i} cafe remaining to go.
        // If there are 2 cafe to go, give me a plan to go a cafe in the morning, "time" must be a reasonable breakfast time. If there is 1 cafe to go, give me a plan to go a cafe in the afternoon, "time" must be a reasonable afternoon tea time.
        // All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
        // The current plan is ${JSON.stringify(planJson)}. [Important] 1.Don't let me go to the same attraction twice.2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan.`
        const requestMessage = `It's ${TimeSpend} now. Please fill in the "transportation" with ${travel_mode || 'driving'} (Capitalize the first letter).Let the "time" of the plan be the current time.
              All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
              The current plan is ${JSON.stringify(planJson)}.The history is ${JSON.stringify(history)}. "title" in history is the names of places."visit_count" is the times the user has visited this place.`
        const requestBody = {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a robot to decide which place to go to drink milk tea based on the price level, rating, distance and duration from given data.You must return in the form like: ${JSON.stringify(json_sample[1][0])} and avoid any syntax error.You should only return the string form of the json.
                          "destination" is the true name of the destination in the data given."time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "rating", "user_rating_in_total", "startLocation" and "endLocation" of the destination based on the given map data.
                          Fill in the "duration", "distances" with the given data containing distances and durations.The "startLocation" must be "${currentLocation}". The "endLocation" must be the latitude and longtitude of the destination. You should only choose the destinations from the given Google Map API data.
                          Do not return anything beyond the given data. Do not return anything besides the JSON.The activity you planned must contain all the keys in the sample form. If a day has no plan, do not include it in the JSON.If the given data of places around is empty, you must return {} (empty json).
                          [Important] 1.Don't let me go to the same attraction twice. 2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan. 3.The generated plan should avoid the repeated places in history. 4.If all places in the dataset exist in history, the less visited a place is, the easier it is to be selected. However, distance, price, and ratings should not be ignored.`,
            },
            { role: 'user', content: requestMessage },
          ],
          max_tokens: 1000,
        }
  
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GPT_KEY}`,
          },
          body: JSON.stringify(requestBody),
        })
  
        const data = await response.json()
        const activity = data.choices[0].message.content
        if (activity !== JSON.stringify({})) {
          const activity_json: Activity = JSON.parse(activity)
          planJson[1].push(activity_json)
          currentLocation = activity_json.endLocation
        }
      }
      for (let day in planJson) {
        planJson[day].forEach((activity, index) => {
          const destinationName = activity.destination
          plusVisited(destinationName)
        })
      }
      return planJson
    } catch (error) {
      console.error('Error generating plan:', error)
      return
    }
  }

export async function generatePlan_attractions(
  gps_location: string,
  TimeSpend: number,
  travel_mode: string,
  minPrice?: number,
  maxPrice?: number
): Promise<Plan | void> {
  let currentLocation = gps_location
  let numAttractions = 0
  const now = new Date()
  const departureTime = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString()
  console.log(departureTime)
  const time = departureTime.slice(11, 19)
  const hours = parseInt(time.slice(0, 2))
  const minutes = parseInt(time.slice(3, 5))
  console.log(`Current time: ${hours}:${minutes}`)

  let radius = 0
  switch (travel_mode) {
    case 'driving':
      radius = TimeSpend * 300
      break
    case 'walking':
      radius = TimeSpend * 60
      break
    case 'transit':
      radius = TimeSpend * 150
      break
  }
  try {
    const history = await getHistory()
    // console.log(`History: ${JSON.stringify(history)}`)
    let planJson: Plan = { 1: [] }
    for (let i = 0; i < numAttractions; i++) {
      const placesJson = await getNearbyPlaces(
        currentLocation,
        radius,
        'tourist_attraction',
        minPrice,
        maxPrice
      )
      let filteredPlacesJson = filterGoogleMapData(placesJson)
      // console.log(filteredPlacesJson);
      const locations: string[] = []
      filteredPlacesJson.forEach((place) => {
        const location = place.vicinity
        locations.push(location)
      })

      const distanceMatrix = await getDistanceMatrix(
        [currentLocation],
        locations,
        travel_mode
      )
      const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix)
      // console.log(JSON.stringify(filteredDistanceMatrix))
      // Let GPT to generate the next activity
      if (!GPT_KEY) {
        console.error('GPT_KEY is not defined.')
        return
      }

      const url = 'https://api.openai.com/v1/chat/completions'
      const requestMessage = `It's ${departureTime} now. If the current time exceed 22 pm, Give me the plan to go to tourist attractions next day.  Please fill in the "transportation" with ${travel_mode || 'driving'} (Capitalize the first letter).There are ${numAttractions - i} tourist attractions remaining to go.
            All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
            The current plan is ${JSON.stringify(planJson)}.The history is ${JSON.stringify(history)}. "title" in history is the names of places."visit_count" is the times the user has visited this place.`
      const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a robot to decide which tourist attraction to go based on the price level, rating, distance and duration from given data.You must return in the form like: ${JSON.stringify(json_sample[1][0])} and avoid any syntax error.You should only return the string form of the json.
                        "destination" is the true name of the destination in the data given."time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "rating", "user_rating_in_total", "startLocation" and "endLocation" of the destination based on the given map data. 
                        Fill in the "duration", "distances" with the given data containing distances and durations.The "startLocation" must be "${currentLocation}". The "endLocation" must be the latitude and longtitude of the destination. You should only choose the destinations from the given Google Map API data.
                        You must follow the rules :1. If there 5 or 4 tourist attractions remaining to go, please give me a plan to go to an attraction in the morning and "time" must be a reasonable time from 9 am to 12 am. 2.If there are 3 or 2 tourist attractions remaining to go, please give me a plan to go to an attraction in the afternoon and "time" must be a reasonable time from 1pm to 6pm.
                        3.If there is only 1 tourist attraction remaining to go, please give me a plan to go to an attraction at night and "time" must be a reasonable time from 7 pm to 22 pm. 4.You must filter the places given and decide the most appropriate tourist attraction at the "time".
                        Do not return anything beyond the given data. Do not return anything besides the JSON.The activity you planned must contain all the keys in the sample form. If a day has no plan, do not include it in the JSON.If the given data of places around is empty, you must return {} (empty json).
                        [Important] 1.Don't let me go to the same attraction twice. 2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan. 3.The generated plan should avoid the repeated places in history. 4.If all places in the dataset exist in history, the less visited a place is, the easier it is to be selected. However, distance, price, and ratings should not be ignored.`,
          },
          { role: 'user', content: requestMessage },
        ],
        max_tokens: 1000,
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GPT_KEY}`,
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      const activity = data.choices[0].message.content
      if (activity !== JSON.stringify({})) {
        const activity_json: Activity = JSON.parse(activity)
        planJson[1].push(activity_json)
        currentLocation = activity_json.endLocation
      }
    }
    for (let day in planJson) {
      planJson[day].forEach((activity, index) => {
        const destinationName = activity.destination
        plusVisited(destinationName)
      })
    }
    return planJson
  } catch (error) {
    console.error('Error generating plan:', error)
    return
  }
}

// export async function askAboutPlan(
//   question: string,
//   plan: Plan
// ): Promise<string | void> {
//   if (!GPT_KEY) {
//     console.error('GPT_KEY is not defined.')
//     return
//   }

//   const url = 'https://api.openai.com/v1/chat/completions'

//   const requestMessage = `User Question: ${question}. The current plan: ${plan}`
//   const requestBody = {
//     model: 'gpt-4o-mini',
//     messages: [
//       {
//         role: 'system',
//         content: `You are a robot to answer questions about the plan. You only need to reply in one or two sentences in text not in json.
//                 "destination" is the true name of the destination in the data given."time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. 
//                 "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.
//                 Do not return anything beyond the given plan data.`,
//       },
//       { role: 'user', content: requestMessage },
//     ],
//     max_tokens: 1000,
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
//     console.log(data.choices[0].message.content)
//     return data.choices[0].message.content
//   } catch (error) {
//     console.error('Error calling GPT API:', error)
//   }
// }
