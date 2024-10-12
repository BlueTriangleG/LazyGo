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
import * as Location from 'expo-location'
interface Coordinates {
  latitude: number
  longitude: number
}
const MyComponent = () => {
  const [text, setText] = useState('')
  const [sensorData, setSensorData] = useState<SensorData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sensor data
        const sensorData = await getSensorData()
        setSensorData(sensorData)
        console.log('Sensor Data:', JSON.stringify(sensorData))

        // Fetch current location coordinates
        const currentLocation = await getCurrentCoordinates()
        console.log('Current Location:', currentLocation)

        // Fetch weather data based on the current location
        const weatherData = await getWeatherData(
          currentLocation[0],
          currentLocation[1]
        )
        console.log('Weather Data:', JSON.stringify(weatherData))

        // Combine sensorData and weatherData into a single JSON object
        const combinedData = {
          sensorData,
          weatherData,
        }

        // Pass the combined data as a JSON string to getRecommendsTips
        const result = await getRecommendsTips(JSON.stringify(combinedData))
        console.log('Recommendations:', JSON.stringify(result))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleButtonPress = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('Permission to access location was denied')
        return
      }

      let loc = await Location.getCurrentPositionAsync({})
      const location = `${loc.coords.latitude},${loc.coords.longitude}`
      console.log(location)
      const now = new Date()
      const currentTime = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString()

      console.log(currentTime)
      const result = await generatePlan_restaurant(
        location,
        currentTime,
        'driving'
      )
      console.log(JSON.stringify(result))
    } catch (error) {
      console.error('Error generating recommends:', error)
      setText('Failed to generate recommends.')
    }
  }

  const handleGetSensor = async () => {
    try {
      console.log('Sensor Data:', sensorData)
    } catch (error) {
      console.error('Error generating plan:', error)
      setText('Failed to generate plan.')
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title="Generate Graph"
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
