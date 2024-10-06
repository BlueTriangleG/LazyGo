import { Accelerometer, LightSensor, Barometer, Pedometer } from 'expo-sensors'
import { PermissionsAndroid, Platform } from 'react-native'
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import { Buffer } from 'buffer'
import * as Battery from 'expo-battery' // 导入 Battery 模块
export interface SensorData {
  light: number | null // Light data (unit: lux)
  pressure: number | null // Atmospheric pressure data (unit: hPa)
  acceleration: number | null // Acceleration data (unit: m/s²)
  steps: number | null // Step count
  batteryLevel: number | null // Battery level (percentage, decimal between 0 and 1)
}
// Polyfill Buffer
global.Buffer = Buffer

// Check if the user is on Android or iOS
const isAndroid = Platform.OS === 'android'
const isIOS = Platform.OS === 'ios'

// Timeout helper function
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    ),
  ])
}

// Function to get light sensor data (only for Android)
const getLightSensorData = async () => {
  if (isIOS) {
    console.log('Light sensor is not available on iOS')
    return null
  }
  return withTimeout(
    new Promise<number>((resolve) => {
      const subscription = LightSensor.addListener((data) => {
        console.log('Light level:', data.illuminance)
        subscription.remove()
        resolve(data.illuminance)
      })
    }),
    3000 // Timeout set to 3 seconds
  )
}

// Function to get barometer (air pressure) data
const getBarometerData = async () => {
  return withTimeout(
    new Promise<number>((resolve) => {
      const subscription = Barometer.addListener(({ pressure }) => {
        console.log('Pressure:', pressure)
        subscription.remove()
        resolve(pressure)
      })
    }),
    3000 // Timeout set to 3 seconds
  )
}

// Function to get accelerometer data (for activity detection)
const getAccelerometerData = async () => {
  return withTimeout(
    new Promise<number>((resolve) => {
      console.log('Listening for accelerometer data...')
      const subscription = Accelerometer.addListener(({ x, y, z }) => {
        const acceleration = Math.sqrt(x * x + y * y + z * z)
        console.log('Acceleration:', acceleration)
        subscription.remove()
        resolve(acceleration)
      })
    }),
    3000 // Timeout set to 3 seconds
  )
}

// Function to get Pedometer data
const getPedometerData = async () => {
  return withTimeout(
    new Promise<number | null>(async (resolve, reject) => {
      const isPedometerAvailable = await Pedometer.isAvailableAsync()
      if (!isPedometerAvailable) {
        console.log('Pedometer is not available on this device.')
        return resolve(null)
      }

      const end = new Date()
      const start = new Date()
      start.setHours(0, 0, 0, 0) // Start of today

      try {
        const result = await Pedometer.getStepCountAsync(start, end)
        console.log('Pedometer steps >>> ', result.steps)
        resolve(result.steps)
      } catch (error) {
        console.warn('Error fetching Pedometer data:', error)
        reject(error)
      }
    }),
    3000 // Timeout set to 3 seconds
  )
}

// Function to get battery level data
const getBatteryLevel = async () => {
  return withTimeout(
    new Promise<number | null>(async (resolve, reject) => {
      try {
        const batteryLevel = await Battery.getBatteryLevelAsync()
        console.log('Battery level >>> ', batteryLevel)
        resolve(batteryLevel)
      } catch (error) {
        console.warn('Error fetching battery level:', error)
        reject(error)
      }
    }),
    3000 // Timeout set to 3 seconds
  )
}

// Main function to get all the required sensor data
export const getSensorData = async (): Promise<SensorData> => {
  const sensorData: SensorData = {
    light: null,
    pressure: null,
    acceleration: null,
    steps: null,
    batteryLevel: null,
  }
  if (isAndroid) {
    console.log('Android device detected')
    // Implement noise level detection if permission granted
  } else if (isIOS) {
    console.log('iOS device detected')
  }

  // 获取传感器数据
  try {
    const [light, pressure, acceleration, steps, batteryLevel] =
      await Promise.all([
        getLightSensorData(),
        getBarometerData(),
        getAccelerometerData(),
        getPedometerData(),
        getBatteryLevel(), // 获取电池电量信息
      ])

    sensorData.light = light
    sensorData.pressure = pressure
    sensorData.acceleration = acceleration
    sensorData.steps = steps
    sensorData.batteryLevel = batteryLevel // 添加电池电量信息
    console.log('Sensor data:', sensorData)
  } catch (error) {
    console.warn('Error fetching sensor data:', error)
  }
  return sensorData
}

// Default export of the getSensorData function
export default getSensorData
