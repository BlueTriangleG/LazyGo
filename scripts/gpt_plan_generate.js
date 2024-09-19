import { GPT_KEY } from '@env';

async function generatePlan(requestMessage) {
    const apiKey = GPT_KEY
    const url = 'https://api.openai.com/v1/chat/completions';

    const json_sample = {
                            "plan": {
                                "day1": {
                                    "activities": [
                                    {
                                        "time": "08:00",
                                        "duration": "120",
                                        "destination": "X",
                                        "destination describ": "X",
                                        "destination duration": "60"
                                    },
                                    ]
                                },
                                "day2": {
                                    "activities": [
                                    ]
                                }
                            },
                            "reply": "XXX"
                        }
    // 准备请求体
    const requestBody = {
        model: "gpt-4o-mini",  // 或者 "gpt-4"
        messages: [
            { role: "system", content: "You are a robot to generate a plan in the form of json based on the given data from Google map API. You should return in the form like: "+ JSON.stringify(json_sample) +
                "\"plan\" can contain multiple days.Each day can has multiple activities.\"time\" is the start time to do the activity.\"duration\" is the time to get to the destination in minutes. \"destination describ\" is the description of destination.\"destination duration\" is the time staying at the destination in minutes"+
                "\"reply\" is a brief explaination of the plan"+"Do not return anything beyond the given data. Do not return anything besides the json. You must return a full json. If a day has no plan, do not include it in json."
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
                'Authorization': `Bearer ${apiKey}` 
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

