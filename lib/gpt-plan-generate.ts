import { useState } from "react";

const GPT_KEY= process.env.EXPO_PUBLIC_GPT_KEY;

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
    day1: { activities: Activity[] };
    day2?: { activities: Activity[] };
}

interface ResponseJSON {
    plan: Plan;
    reply: string;
}

// Constant current location for testing
const [location, setLocation] = useState({ latitude: -37.8136, longitude: 144.9631 })

export async function filterDestination(requestMessage: string): Promise<string | void> {
    if (!GPT_KEY) {
        console.error("GPT_KEY is not defined.");
        return;
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    const json_sample: ResponseJSON = {
        plan: {
            day1: {
                activities: [
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
            }
        },
        reply: "XXX"
    };

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a robot to generate a plan in chronological order in the form of JSON based on the given data from Google Map API. You should return in the form like: ${JSON.stringify(json_sample)} 
                "plan" can contain multiple days. Each day can have multiple activities. "time" is the recommended start time to go to the destination."date" is the date of the activity."destination describ" is the description of the destination. "destination duration" is the recommended time staying at the destination in minutes."estimated price" is the estimated money spent in this destination (estimate according to the price level in the given data)."startLocation" and "endLocation" are location in latitude and longitude.Fill in the "startLocation" and "endLocation" of the destination based on the given map data. 
                If it is the first plan, the "startLocation" is the current location "${location.latitude},${location.longitude}.At current stage keep reply, "duration", "transportation", "distance" must be null. You should only choose the destinations from the given Google Map API data.
                Do not return anything beyond the given data. Do not return anything besides the JSON. You must return a full JSON. The activity you planned must contain all the keys in the sample form. If a day has no plan, do not include it in the JSON.`
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


// TODO: update this function to complete the plan
export async function generatePlan(requestMessage: string): Promise<string | void> {
    if (!GPT_KEY) {
        console.error("GPT_KEY is not defined.");
        return;
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    const json_sample: ResponseJSON = {
        plan: {
            day1: {
                activities: [
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
            }
        },
        reply: "XXX"
    };

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a robot to generate a plan in the form of JSON based on the given data from Google Map API. You should return in the form like: ${JSON.stringify(json_sample)} 
                "plan" can contain multiple days. Each day can have multiple activities. "time" is the start timeto do the activity. "date" is the date of the activity. "duration" is the time to get to the destination in minutes. "destination describ" is the description of the destination. "destination duration" is the time staying at the destination in minutes. 
                "transportation" is the method to go to the destination."distance" is the distance from previous location to the destination. If it is the first activity, the distance is from current location to destination. "estimated price" is the estimated price spent during transporation.
                "reply" is a brief explanation of the plan. Do not return anything beyond the given data. Do not return anything besides the JSON. You must return a full JSON. If a day has no plan, do not include it in the JSON.`
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


// TODO: update the prompt
export async function askAboutPlan(requestMessage: string): Promise<string | void> {
    if (!GPT_KEY) {
        console.error("GPT_KEY is not defined.");
        return;
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    const json_sample: ResponseJSON = {
        plan: {
            day1: {
                activities: [
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
            }
        },
        reply: "XXX"
    };

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a robot to answer questions about the plan in the form of ${JSON.stringify(json_sample)}. You only need to reply in one or two sentences in text not in json.
                "plan" can contain multiple days. Each day can have multiple activities. "time" is the start UTC time in the form of ISO 8601 to do the activity. "date" is the date of the activity.  "duration" is the time to get to the destination in minutes. "destination describ" is the description of the destination. "destination duration" is the time staying at the destination in minutes. 
                "reply" is a brief explanation of the plan. Do not return anything beyond the given data.`
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