import { useState } from "react";
import {getDistanceMatrix, getNearbyPlaces} from "./google-map-api"
import { min } from "date-fns";
const GPT_KEY= process.env.EXPO_PUBLIC_GPT_KEY;
const restuarant_prompt= `You should reasonably manage only every day's the breakfast, lunch, dinner and one small meal eating in cafe. If the current time exceed the meal time (breakfast:5 am - 10 am, lunch: before 11 am - 2 pm, afternoon tea: 2 pm - 4 pm, dinner: 5 pm - 11 pm), please ignore that meal.In one day, it should not have more than 4 meals.Give me a reasonable plan for a human being according to the rating and price level.`
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
                'duration': "10 min",
                'destination': "X",
                'destinationDescrib': "X",
                'destinationDuration': "60",
                "transportation": "Car",
                "distance": "3km",
                "estimatePrice": "15 AUD",
                "startLocation": "48.8566,2.3522",
                "endLocation": "48.8606,2.3376"
            },
            {
                "date": "2024-09-29",
                'time': "8:00",
                'duration': "10 min",
                'destination': "X",
                'destinationDescrib': "X",
                'destinationDuration': "60",
                "transportation": "Car",
                "distance": "3km",
                "estimatedPrice": "15 AUD",
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
                'destinationDescrib': "X",
                'destinationDuration': "60",
                "transportation": "Car",
                "distance": "3km",
                "estimatedPrice": "15 AUD",
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
                content: `You are a robot to generate a plan in chronological order in the form of JSON based on the given data from Google Map API. You must return in the form like: ${JSON.stringify(json_sample)} and avoid any syntax error.The key of each day must be number not a string(day1 is 1, day2 is 2,e.g.). You should only return the string form of the json.
                The plan can contain multiple days. Each day can have multiple activities.The key of the day is a number. "time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "startLocation" and "endLocation" of the destination based on the given map data. 
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
            console.log(distanceMatrix.destintion_addresses)
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


export async function generatePlan_restaurant(currentTime: string, travel_mode?: string, minPrice?: number, maxPrice?: number): Promise<Plan | void>{
    let currentLocation = `${location.latitude},${location.longitude}`;
    const time = currentTime.slice(11, 19); 
    const hours = parseInt(time.slice(0, 2));
    const minutes = parseInt(time.slice(3, 5)); 
    let numMeals= 0;
    if (hours >= 5 && hours < 9) {
        numMeals = 3; // 5 am - 9 am
    } else if (hours >= 9 && hours < 14) {
        numMeals = 2; // 9 am - 2 pm
    } else if (hours >= 14 && hours < 21) {
        numMeals = 1; // 2 pm - 9 pm
    } else {
        numMeals =3; // 9 pm - 5 am
    }
    console.log(`numMeals: ${numMeals}`);
    try{
        let planJson:Plan = {1:[]};
        for (let i =0; i< numMeals;i++){
            const placesJson = await getNearbyPlaces(currentLocation, 1000, "restaurant", minPrice, maxPrice);
            let filteredPlacesJson = filterGoogleMapData(placesJson);
            // console.log(filteredPlacesJson);
            const locations: string[] = []
            filteredPlacesJson.forEach(place => {
                const location = place.vicinity;
                locations.push(location);
            });

            const distanceMatrix = await getDistanceMatrix([currentLocation], locations, travel_mode);
            const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix);
            // console.log(JSON.stringify(filteredDistanceMatrix))
            // Let GPT to generate the next activity
            if (!GPT_KEY) {
                console.error("GPT_KEY is not defined.");
                return;
            }
            
            const url = 'https://api.openai.com/v1/chat/completions';
            const requestMessage = `It's ${currentTime} now. If the current time exceed 9 pm. Give me the meal plan for next day. Please fill in the "transportation" with ${travel_mode || "driving"} (Capitalize the first letter).There are ${numMeals-i} meals remaining.
            If 3 meals remaining, give me the breakfast plan, "time" must be a reasonable breakfast time. If 2 meals remaining, give me the lunch plan, "time" must be a reasonable lunch time. If 1 meal remaining, give me dinner plan,"time" must be a reasonable dinner time.
            All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
            The current plan is ${JSON.stringify(planJson)}. Don't let me eat in the same retaurant twice.`
            const requestBody = {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a robot to decide which restuarant to go based on the price level, rating, distance and duration from given data.You must return in the form like: ${JSON.stringify(json_sample[1][0])} and avoid any syntax error.You should only return the string form of the json.
                        "time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "startLocation" and "endLocation" of the destination based on the given map data. 
                        Fill in the "duration", "distances" with the given data containing distances and durations.If it is the first plan, the "startLocation" is the current location "${location.latitude},${location.longitude}; otherwise, the "startLocation" is the location of the previous activity's "endLocation". You should only choose the destinations from the given Google Map API data.
                        Do not return anything beyond the given data. Do not return anything besides the JSON.The activity you planned must contain all the keys in the sample form. If a day has no plan, do not include it in the JSON.`
                    },
                    { role: "user", content: requestMessage }
                ],
                max_tokens: 1000
            };
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GPT_KEY}`
                },
                body: JSON.stringify(requestBody)
            });
    
            const data = await response.json();
            const activity= data.choices[0].message.content;
            // console.log(activity);
            const activity_json : Activity= JSON.parse(activity);
            planJson[1].push(activity_json);
            currentLocation = activity_json.endLocation;
        }
        return planJson;
    }catch(error){
        console.error("Error generating plan:", error);
        return;
    }
}










// DO NOT USE THIS 
export async function generatePlan_distance(mode:string, currentTime: string, days: number, travel_mode?: string, minPrice?: number, maxPrice?: number): Promise<string | void>{
    try{
        const placesJson = await getNearbyPlaces(`${location.latitude},${location.longitude}`, 1000, "restaurant", minPrice, maxPrice);
        // console.log(placesJson);
        //TODO: handle error of the getNearbyPlaces
        let filteredPlacesJson = filterGoogleMapData(placesJson);
        // console.log(filteredPlacesJson);
        
        const locations: LatLngTuple[] = [];
        // Add current location into the list
        locations.push([location.latitude, location.longitude]);

        filteredPlacesJson.forEach(place => {
            const location: LatLngTuple= [place.geometry.lat,place.geometry.lng];
            locations.push(location);
        });
        
        const distances: DistanceEntry[] = [];

        for (let i = 0; i < locations.length; i++) {
            for (let j = i + 1; j < locations.length; j++) {
                const [lat1, lon1] = locations[i];
                const [lat2, lon2] = locations[j];

                const distance = haversine(lat1, lon1, lat2, lon2);
                distances.push({
                from: locations[i],
                to: locations[j],
                distance: distance
                });
            }
        }
        
        if (!GPT_KEY) {
            console.error("GPT_KEY is not defined.");
            return;
        }
        let requestString = `You must consider the rating, price level of the places. The route of the plan must consider the distances between previous location and next location.All the places data: ${JSON.stringify(filteredPlacesJson)}. All the distances (km) between locations of places : ${JSON.stringify(distances)}. it's ${currentTime}.Give me a ${days}-day plan.` 
        switch (mode){
        case "restaurant":
            requestString += restuarant_prompt;
            break;
        }
        const url = 'https://api.openai.com/v1/chat/completions';
        console.log(requestString);
        const requestBody = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a robot to generate a plan in chronological order in the form of JSON based on the given data from Google Map API. You must return in the form like: ${JSON.stringify(json_sample)} and avoid any syntax error.At current stage must keep "duration", "transportation", "distance" must be null.The key of each day must be number not a string(day1 is 1, day2 is 2,e.g.). You should only return the string form of the json.
                    The plan can contain multiple days. Each day can have multiple activities.The key of the day is a number. "time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "startLocation" and "endLocation" of the destination based on the given map data. 
                    If it is the first plan, the "startLocation" is the current location "${location.latitude},${location.longitude}; otherwise, the "startLocation" is the location of the previous activity's "endLocation".You should only choose the destinations from the given Google Map API data.
                    Do not return anything beyond the given data. Do not return anything besides the JSON.The activity you planned must contain all the keys in the sample form. If a day has no plan, do not include it in the JSON.`
                },
                { role: "user", content: requestString }
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
            let planJson = JSON.parse(data.choices[0].message.content);
            for (const day in planJson) {
                const activities = planJson[day];
                // Loop through each activity for the day
                for (const activity of activities) {
                    const distanceMatrix = await getDistanceMatrix([activity.startLocation], [activity.endLocation], travel_mode, activity.time);
                    const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix);
                    console.log(distanceMatrix);
                    console.log(distanceMatrix.destination_addresses)
                    console.log(distanceMatrix.origin_addresses)
                    
                    const duration = filteredDistanceMatrix[0][0].duration;
                    const distance = filteredDistanceMatrix[0][0].distance;
                    console.log(`Duration:${duration}, Distance:${distance}`);
                    activity.duration = duration;
                    activity.distance = distance;
                    activity.transportation = travel_mode || 'driving';
                    console.log("-----------------------------")
                }
            }
            return planJson;
        } catch (error) {
            console.error("Error calling GPT API:", error);
            return;
        }
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


interface GoogleMapPlace {
    name: string;
    vicinity: string;
    rating: number;
    user_ratings_total: number;
    price_level: number; 
    types: string[];
    geometry: {
        location: {
        lat: number;
        lng: number;
        };
    };
}

interface GoogleMapResponse {
    results: GoogleMapPlace[];
}



export const filterGoogleMapData = (data: GoogleMapResponse) => {
    const filteredResults = data.results.map((place: GoogleMapPlace) => ({
        name: place.name,
        vicinity: place.vicinity,
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


// 地球的平均半径（以公里为单位）
const EARTH_RADIUS = 6371;
type LatLngTuple = [number, number];

// 定义存储距离的结构
interface DistanceEntry {
    from: LatLngTuple;   // 出发点经纬度
    to: LatLngTuple;     // 目标点经纬度
    distance: number;    // 距离（公里）
  }

// Haversine 公式，将角度转换为弧度
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// 计算两个经纬度之间的距离
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return EARTH_RADIUS * c; // 距离以公里为单位
}