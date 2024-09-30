import { useState } from "react";
import {getDistanceMatrix, getNearbyPlaces} from "./google-map-api"
import { min } from "date-fns";
const GPT_KEY= process.env.EXPO_PUBLIC_GPT_KEY;
const restuarant_prompt= `You should reasonably manage only the breakfast, lunch, dinner and one small meal eating in cafe. If the current time exceed the meal time (breakfast:5 am - 10 am, lunch: before 11 am - 2 pm, afternoon tea: 2 pm - 4 pm, dinner: 5 pm - 11 pm), please ignore that meal.The plan should not have more than 4 meals a day.Give me a reasonable plan for a human being according to the rating and price level.`
interface Activity {
    "date": string;
    'time': string;
    'duration': string;
    'destination': string;
    'destination describ': string;
    'destination duration': string;
    "transportation": string;
    "distance": string;
    "estimated price": string;
    "startLocation": string;
    "endLocation": string;
}

interface Plan {
    [key: number]: Activity[];  
}




const json_sample: Plan = {
    1: 
        [
            {
                "date": "2024-09-29",
                'time': "8:00",
                'duration': "10",
                'destination': "X",
                'destination describ': "X",
                'destination duration': "60",
                "transportation": "Car",
                "distance": "3km",
                "estimated price": "15 AUD",
                "startLocation": "48.8566,2.3522",
                "endLocation": "48.8606,2.3376"
            },
            {
                "date": "2024-09-29",
                'time': "8:00",
                'duration': "10",
                'destination': "X",
                'destination describ': "X",
                'destination duration': "60",
                "transportation": "Car",
                "distance": "3km",
                "estimated price": "15 AUD",
                "startLocation": "48.8566,2.3522",
                "endLocation": "48.8606,2.3376"
            }
        ],
    2: 
        [
            {
                "date": "2024-09-29",
                'time': "8:00",
                'duration': "10",
                'destination': "X",
                'destination describ': "X",
                'destination duration': "60",
                "transportation": "Car",
                "distance": "3km",
                "estimated price": "15 AUD",
                "startLocation": "48.8566,2.3522",
                "endLocation": "48.8606,2.3376"
            }
        ]
};

// Constant current location for testing
const [location, setLocation] = useState({ latitude: -37.8136, longitude: 144.9631 })

export async function filterDestination(requestMessage: string): Promise<string | void> {
    if (!GPT_KEY) {
        console.error("GPT_KEY is not defined.");
        return;
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a robot to generate a plan in chronological order in the form of JSON based on the given data from Google Map API. You must return in the form like: ${JSON.stringify(json_sample)} and avoid any syntax error.
                the plan can contain multiple days. Each day can have multiple activities.The key of the day is a number. "time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "startLocation" and "endLocation" of the destination based on the given map data. 
                If it is the first plan, the "startLocation" is the current location "${location.latitude},${location.longitude}; otherwise, the "startLocation" is the location of the previous activity's "endLocation".At current stage keep "duration", "transportation", "distance" must be null. You should only choose the destinations from the given Google Map API data.
                Do not return anything beyond the given data. Do not return anything besides the JSON.The activity you planned must contain all the keys in the sample form. If a day has no plan, do not include it in the JSON.`
            },
            { role: "user", content: requestMessage }
        ],
        max_tokens: 2000
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling GPT API:", error);
    }
}


// TODO: update this function to complete the plan
export async function generatePlan(mode:string, currentTime: string, days: number, travel_mode?: string, minPrice?: number, maxPrice?: number): Promise<string | void> {
  try{
    const placesJson = await getNearbyPlaces(`${location.latitude},${location.longitude}`, 1000, "restaurant", minPrice, maxPrice);
    // console.log(placesJson);
    //TODO: handle error of the getNearbyPlaces
    let filteredPlacesJson = filterGoogleMapData(placesJson);
    let requestString = `${JSON.stringify(filteredPlacesJson)}, it's ${currentTime}.Give me a ${days}-day plan.` 
    switch (mode){
      case "restaurant":
        requestString += restuarant_prompt;
        break;
    }
    let filteredDestinations = await filterDestination(requestString);
    if (!filteredDestinations) {
        console.error("No valid destinations found");
        return;
    }
    console.log(filteredDestinations)
    let planJson = JSON.parse(filteredDestinations);
    for (const day in planJson) {
        const activities = planJson[day];
    
        // Loop through each activity for the day
        for (const activity of activities) {

            const distanceMatrix = await getDistanceMatrix([activity.startLocation], [activity.endLocation], travel_mode, activity.time);
            const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix);
            console.log(distanceMatrix.destination_addresses)
            console.log(distanceMatrix.origin_addresses)
            console.log("-----------------------------")
            const duration = filteredDistanceMatrix[0][0].duration;
            const distance = filteredDistanceMatrix[0][0].distance;
            activity.duration = duration;
            activity.distance = distance;
            activity.transportation = travel_mode || 'driving';
        }
    }
    return planJson;
  } catch (error){
    console.error("Error generating plan:", error);
    return;
  }
}


export async function generatePlan_distance(mode:string, currentTime: string, days: number, travel_mode?: string, minPrice?: number, maxPrice?: number): Promise<string | void>{
    try{
        const placesJson = await getNearbyPlaces(`${location.latitude},${location.longitude}`, 1000, "restaurant", minPrice, maxPrice);
        // console.log(placesJson);
        //TODO: handle error of the getNearbyPlaces
        let filteredPlacesJson = filterGoogleMapData(placesJson);
        
      } catch (error){
        console.error("Error generating plan:", error);
        return;
      }
}


// TODO: update the prompt
export async function askAboutPlan(requestMessage: string): Promise<string | void> {
    if (!GPT_KEY) {
        console.error("GPT_KEY is not defined.");
        return;
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a robot to answer questions about the plan in the form of ${JSON.stringify(json_sample)}. You only need to reply in one or two sentences in text not in json.
                "plan" can contain multiple days. Each day can have multiple activities. "time" is the start UTC time in the form of ISO 8601 to do the activity. "date" is the date of the activity.  "duration" is the time to get to the destination in minutes. "destination describ" is the description of the destination. "destination duration" is the time staying at the destination in minutes. 
                Do not return anything beyond the given data.`
            },
            { role: "user", content: requestMessage }
        ],
        max_tokens: 1000
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log(data.choices[0].message.content);
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling GPT API:", error);
    }
}

export const filterGoogleMapData = (data: any) => {
    const filteredResults = data.results.map((place: any) => ({
      name: place.name,
      visinity: place.vicinity,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      price_level: place.price_level,
      types: place.types,
      geometry: place.geometry.location
    }));
  
    return filteredResults;
  };


export const filterDistanceMatrixData = (data: any) => {
    const filteredResults = data.rows.map((row: any, originIndex: number) => {
        return row.elements.map((element: any, destinationIndex: number) => ({
            origin: data.origin_addresses[originIndex],
            destination: data.destination_addresses[destinationIndex],
            distance: element.distance.text,
            duration: element.duration.text,
        }));
    });

    return filteredResults;
};
