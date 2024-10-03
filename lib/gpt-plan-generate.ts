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
    'destinationDescrib': string;
    'destinationDuration': string;
    "transportation": string;
    "distance": string;
    "estimatedPrice": string;
    "startLocation": string;
    "endLocation": string;
}

interface Plan {
    [key: number]: Activity[];  
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
                "estimatedPrice": "15 AUD",
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
// const [location, setLocation] = useState({ latitude: -37.8136, longitude: 144.9631 })

// export async function filterDestination(requestMessage: string): Promise<string | void> {
//     if (!GPT_KEY) {
//         console.error("GPT_KEY is not defined.");
//         return;
//     }

//     const url = 'https://api.openai.com/v1/chat/completions';

//     const requestBody = {
//         model: "gpt-4o-mini",
//         messages: [
//             {
//                 role: "system",
//                 content: `You are a robot to generate a plan in chronological order in the form of JSON based on the given data from Google Map API. You must return in the form like: ${JSON.stringify(json_sample)} and avoid any syntax error.The key of each day must be number not a string(day1 is 1, day2 is 2,e.g.). You should only return the string form of the json.
//                 The plan can contain multiple days. Each day can have multiple activities.The key of the day is a number. "time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "startLocation" and "endLocation" of the destination based on the given map data. 
//                 If it is the first plan, the "startLocation" is the current location "${location.latitude},${location.longitude}; otherwise, the "startLocation" is the location of the previous activity's "endLocation".At current stage keep "duration", "transportation", "distance" must be null. You should only choose the destinations from the given Google Map API data.
//                 Do not return anything beyond the given data. Do not return anything besides the JSON.The activity you planned must contain all the keys in the sample form. If a day has no plan, do not include it in the JSON.`
//             },
//             { role: "user", content: requestMessage }
//         ],
//         max_tokens: 2000
//     };

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${GPT_KEY}`
//             },
//             body: JSON.stringify(requestBody)
//         });

//         const data = await response.json();
//         return data.choices[0].message.content;
//     } catch (error) {
//         console.error("Error calling GPT API:", error);
//     }
// }


// // TODO: update this function to complete the plan
// export async function generatePlan(mode:string, currentTime: string, days: number, travel_mode?: string, minPrice?: number, maxPrice?: number): Promise<string | void> {
//   try{
//     const placesJson = await getNearbyPlaces(`${location.latitude},${location.longitude}`, 1000, "restaurant", minPrice, maxPrice);
//     // console.log(placesJson);
//     //TODO: handle error of the getNearbyPlaces
//     let filteredPlacesJson = filterGoogleMapData(placesJson);
//     let requestString = `${JSON.stringify(filteredPlacesJson)}, it's ${currentTime}.Give me a ${days}-day plan.` 
//     switch (mode){
//       case "restaurant":
//         requestString += restuarant_prompt;
//         break;
//     }
//     let filteredDestinations = await filterDestination(requestString);
//     if (!filteredDestinations) {
//         console.error("No valid destinations found");
//         return;
//     }
//     console.log(filteredDestinations)
//     let planJson = JSON.parse(filteredDestinations);
//     for (const day in planJson) {
//         const activities = planJson[day];
    
//         // Loop through each activity for the day
//         for (const activity of activities) {

//             const distanceMatrix = await getDistanceMatrix([activity.startLocation], [activity.endLocation], travel_mode, activity.time);
//             const filteredDistanceMatrix = filterDistanceMatrixData(distanceMatrix);
//             const duration = filteredDistanceMatrix[0][0].duration;
//             const distance = filteredDistanceMatrix[0][0].distance;
//             activity.duration = duration;
//             activity.distance = distance;
//             activity.transportation = travel_mode || 'driving';
//         }
//     }
//     return planJson;
//   } catch (error){
//     console.error("Error generating plan:", error);
//     return;
//   }
// }

// Function to generate meal plan for the day or the next day, including breakfast, lunch, dinner
export async function generatePlan_restaurant(gps_location: string, currentTime: string, travel_mode: string,  minPrice?: number, maxPrice?: number): Promise<Plan | void>{
    let currentLocation = gps_location;
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
    let radius = 0;
    switch (travel_mode){
        case "driving":
            radius = 5000;
            break;
        case "walking":
            radius = 1000;
            break;
        case "transit":
            radius = 2500;
            break;
    }
    try{
        let planJson:Plan = {1:[]};
        for (let i =0; i< numMeals;i++){
            const placesJson = await getNearbyPlaces(currentLocation, radius, "restaurant", minPrice, maxPrice);
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
            const requestMessage = `It's ${currentTime} now. If the current time exceed 9 pm, Give me the meal plan for next day. Please fill in the "transportation" with ${travel_mode || "driving"} (Capitalize the first letter).There are ${numMeals-i} meals remaining.
            If 3 meals remaining, give me the breakfast plan, "time" must be a reasonable breakfast time. If 2 meals remaining, give me the lunch plan, "time" must be a reasonable lunch time. If 1 meal remaining, give me dinner plan,"time" must be a reasonable dinner time.
            All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
            The current plan is ${JSON.stringify(planJson)}. [Important] 1.Don't let me go to the same attraction twice.2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan.`
            const requestBody = {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a robot to decide which restuarant to go based on the price level, rating, distance and duration from given data.You must return in the form like: ${JSON.stringify(json_sample[1][0])} and avoid any syntax error.You should only return the string form of the json.
                        "time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "startLocation" and "endLocation" of the destination based on the given map data. 
                        Fill in the "duration", "distances" with the given data containing distances and durations.The "startLocation" must be "${currentLocation}". The "endLocation" must be the latitude and longtitude of the destination. You should only choose the destinations from the given Google Map API data.
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

// Function to generate cafe plan
// Function to generate meal plan for the day or the next day, including breakfast, lunch, dinner
export async function generatePlan_cafe(gps_location: string, currentTime: string, travel_mode: string,  minPrice?: number, maxPrice?: number): Promise<Plan | void>{
    let currentLocation = gps_location;
    let numMeals= 0;
    const time = currentTime.slice(11, 19); 
    const hours = parseInt(time.slice(0, 2));
    if (hours >= 5 && hours < 10) {
        numMeals = 2; 
    } else if (hours >= 9 && hours < 17) {
        numMeals = 1; 
    } else {
        numMeals =2; 
    }
    let radius = 0;
    switch (travel_mode){
        case "driving":
            radius = 5000;
            break;
        case "walking":
            radius = 1000;
            break;
        case "transit":
            radius = 2500;
            break;
    }
    try{
        let planJson:Plan = {1:[]};
        for (let i =0; i< numMeals;i++){
            const placesJson = await getNearbyPlaces(currentLocation, radius, "cafe", minPrice, maxPrice);
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
            const requestMessage = `It's ${currentTime} now. If the current time exceed 5 pm, Give me the plan to go to a cafe next day.  Please fill in the "transportation" with ${travel_mode || "driving"} (Capitalize the first letter).There are ${numMeals-i} cafe remaining to go.
            If there are 2 cafe to go, give me a plan to go a cafe in the morning, "time" must be a reasonable breakfast time. If there is 1 cafe to go, give me a plan to go a cafe in the afternoon, "time" must be a reasonable afternoon tea time.
            All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
            The current plan is ${JSON.stringify(planJson)}. [Important] 1.Don't let me go to the same attraction twice.2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan.`
            const requestBody = {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a robot to decide which cafe to go based on the price level, rating, distance and duration from given data.You must return in the form like: ${JSON.stringify(json_sample[1][0])} and avoid any syntax error.You should only return the string form of the json.
                        "time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "startLocation" and "endLocation" of the destination based on the given map data. 
                        Fill in the "duration", "distances" with the given data containing distances and durations.The "startLocation" must be "${currentLocation}". The "endLocation" must be the latitude and longtitude of the destination. You should only choose the destinations from the given Google Map API data.
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

export async function generatePlan_attractions(gps_location: string, currentTime: string, travel_mode: string,  minPrice?: number, maxPrice?: number): Promise<Plan | void>{
    let currentLocation = gps_location;
    let numAttractions= 0;
    const time = currentTime.slice(11, 19); 
    const hours = parseInt(time.slice(0, 2));
    if (hours >= 12 && hours < 18) {
        numAttractions = 3; 
    } else if (hours >= 18 && hours < 22) {
        numAttractions = 1; 
    } else {
        numAttractions =5; 
    }
    let radius = 0;
    switch (travel_mode){
        case "driving":
            radius = 5000;
            break;
        case "walking":
            radius = 1000;
            break;
        case "transit":
            radius = 2500;
            break;
    }
    try{
        let planJson:Plan = {1:[]};
        for (let i =0; i< numAttractions;i++){
            const placesJson = await getNearbyPlaces(currentLocation, radius, "tourist_attraction", minPrice, maxPrice);
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
            const requestMessage = `It's ${currentTime} now. If the current time exceed 22 pm, Give me the plan to go to tourist attractions next day.  Please fill in the "transportation" with ${travel_mode || "driving"} (Capitalize the first letter).There are ${numAttractions-i} tourist attractions remaining to go.
            All the places around: ${JSON.stringify(filteredPlacesJson)}. All distances and durations from current location to the places one by one in previous data: ${JSON.stringify(filteredDistanceMatrix[0])}.
            The current plan is ${JSON.stringify(planJson)}. [Important] 1.Don't let me go to the same attraction twice.2.The "time" of returned activity should be later than the "time"+"destinationDuration"+"duration" of last activity in the current plan.`
            const requestBody = {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a robot to decide which tourist attraction to go based on the price level, rating, distance and duration from given data.You must return in the form like: ${JSON.stringify(json_sample[1][0])} and avoid any syntax error.You should only return the string form of the json.
                        "time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "startLocation" and "endLocation" of the destination based on the given map data. 
                        Fill in the "duration", "distances" with the given data containing distances and durations.The "startLocation" must be "${currentLocation}". The "endLocation" must be the latitude and longtitude of the destination. You should only choose the destinations from the given Google Map API data.
                        You must follow the rules :1. If there 5 or 4 tourist attractions remaining to go, please give me a plan to go to an attraction in the morning and "time" must be a reasonable time from 9 am to 12 am. 2.If there are 3 or 2 tourist attractions remaining to go, please give me a plan to go to an attraction in the afternoon and "time" must be a reasonable time from 1pm to 6pm.
                        3.If there is only 1 tourist attraction remaining to go, please give me a plan to go to an attraction at night and "time" must be a reasonable time from 7 pm to 22 pm. 4.You must filter the places given and decide the most appropriate tourist attraction at the "time".
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





// // TODO: update the prompt
// export async function askAboutPlan(requestMessage: string): Promise<string | void> {
//     if (!GPT_KEY) {
//         console.error("GPT_KEY is not defined.");
//         return;
//     }

//     const url = 'https://api.openai.com/v1/chat/completions';

//     const requestBody = {
//         model: "gpt-4o-mini",
//         messages: [
//             {
//                 role: "system",
//                 content: `You are a robot to answer questions about the plan in the form of ${JSON.stringify(json_sample)}. You only need to reply in one or two sentences in text not in json.
//                 "plan" can contain multiple days. Each day can have multiple activities. "time" is the start UTC time in the form of ISO 8601 to do the activity. "date" is the date of the activity.  "duration" is the time to get to the destination in minutes. "destination describ" is the description of the destination. "destination duration" is the time staying at the destination in minutes. 
//                 Do not return anything beyond the given data.`
//             },
//             { role: "user", content: requestMessage }
//         ],
//         max_tokens: 1000
//     };

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${GPT_KEY}`
//             },
//             body: JSON.stringify(requestBody)
//         });

//         const data = await response.json();
//         console.log(data.choices[0].message.content);
//         return data.choices[0].message.content;
//     } catch (error) {
//         console.error("Error calling GPT API:", error);
//     }
// }
