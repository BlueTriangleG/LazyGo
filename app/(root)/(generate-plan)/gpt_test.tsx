import React, { useState, useEffect } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import {
  generatePlan_restaurant,
  generatePlan_cafe,
  generatePlan_attractions,
} from '@/lib/gpt-plan-generate'
import { router } from 'expo-router'
import {
  generateDailyRecommends,
  getRecommendsTips,
} from '@/lib/gpt-daily-recommend'
import ShakeDetector from '@/lib/shake'
import { getSensorData, SensorData } from '@/lib/sensorReader'
import { getWeatherData } from '@/lib/get-Weather'
import { getCurrentCoordinates } from '@/lib/get-Location'
const MyComponent = () => {
  const [text, setText] = useState('')
  const [sensorData, setSensorData] = useState<SensorData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSensorData()
      setSensorData(data)
      console.log('Sensor Data:', JSON.stringify(data))
      const result = await getRecommendsTips(JSON.stringify(data))
      console.log(JSON.stringify(result))
      const currentLocation = await getCurrentCoordinates()
      console.log('Current Location:', currentLocation)
      getWeatherData(currentLocation[0], currentLocation[1])
    }

    fetchData()
  }, [])
  // useShakeDetector();
  const handleButtonPress = async () => {
    try {
      // TODO: write function for each use case to generate the request String
      // const result = await generatePlan("restaurant", "2024-9-29T10:00:00Z",1)
      // const resultString = JSON.stringify(result)
      // console.log(resultString)
      // const result = await generatePlan_attractions("-37.8136,144.9631","2024-09-29T23:00:00Z", "driving");
      const previous = [
        {
          destination: 'La Camera, Italian Restaurant',
          destinationDescrib:
            'A popular Italian restaurant offering authentic cuisine in a cozy setting.',
          vicinity: 'MR2/3 Southgate Avenue, Southbank',
          distance: '2.0 km',
          estimatedPrice: '20 AUD',
        },
        {
          destination: 'Brother Baba Budan',
          destinationDescrib:
            'A highly-rated café known for its excellent coffee and relaxed atmosphere.',
          vicinity: '359 Little Bourke Street, Melbourne',
          distance: '1.0 km',
          estimatedPrice: '10 AUD',
        },
        {
          destination: 'Queen Victoria Market',
          destinationDescrib:
            'A historic market featuring a variety of stalls selling fresh produce, food, and local goods.',
          vicinity: 'Queen Street, Melbourne',
          distance: '1.2 km',
          estimatedPrice: '15 AUD',
        },
      ]

      const result = await generateDailyRecommends(
        '-37.8136,144.9631',
        previous
      )
      console.log(JSON.stringify(result))
    } catch (error) {
      console.error('Error generating plan:', error)
      setText('Failed to generate plan.')
    }
  }
  const handleGetSensor = async () => {
    try {
      // TODO: write function for each use case to generate the request String
      // const result = await generatePlan("restaurant", "2024-9-29T10:00:00Z",1)
      // const resultString = JSON.stringify(result)
      // console.log(resultString)
      // const result = await generatePlan_attractions("-37.8136,144.9631","2024-09-29T23:00:00Z", "driving");
      console.log('Sensor Data:', sensorData)
    } catch (error) {
      console.error('Error generating plan:', error)
      setText('Failed to generate plan.')
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title="generate graph"
        onPress={() => router.push('/(root)/(generate-plan)/explore')}
      />
      <Text style={styles.text}>{text}</Text>
      <Button title="Generate Plan" onPress={handleButtonPress} />
      <Button title="get sensor" onPress={handleGetSensor} />

      <ShakeDetector />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
})

export default MyComponent
