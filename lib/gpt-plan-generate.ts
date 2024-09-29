const GPT_KEY = process.env.EXPO_PUBLIC_GPT_KEY

interface Activity {
  time: string
  duration: string
  destination: string
  'destination describ': string
  'destination duration': string
}

interface Plan {
  day1: { activities: Activity[] }
  day2?: { activities: Activity[] }
}

interface ResponseJSON {
  plan: Plan
  reply: string
}

export async function generatePlan(
  requestMessage: string
): Promise<string | void> {
  if (!GPT_KEY) {
    console.error('GPT_KEY is not defined.')
    return
  }

  const url = 'https://api.openai.com/v1/chat/completions'

  const json_sample: ResponseJSON = {
    plan: {
      day1: {
        activities: [
          {
            time: '08:00',
            duration: '120',
            destination: 'X',
            'destination describ': 'X',
            'destination duration': '60',
          },
        ],
      },
    },
    reply: 'XXX',
  }

  const requestBody = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a robot to generate a plan in the form of JSON based on the given data from Google Map API. You should return in the form like: ${JSON.stringify(json_sample)} 
                "plan" can contain multiple days. Each day can have multiple activities. "time" is the start time to do the activity. "duration" is the time to get to the destination in minutes. "destination describ" is the description of the destination. "destination duration" is the time staying at the destination in minutes. 
                "reply" is a brief explanation of the plan. Do not return anything beyond the given data. Do not return anything besides the JSON. You must return a full JSON. If a day has no plan, do not include it in the JSON.`,
      },
      { role: 'user', content: requestMessage },
    ],
    max_tokens: 1000,
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
    console.log(data.choices[0].message.content)
    return data.choices[0].message.content
  } catch (error) {
    console.error('Error calling GPT API:', error)
  }
}
