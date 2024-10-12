import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { StyleSheet, Platform } from 'react-native'

import React, { useState, useEffect } from 'react'
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps'
import {
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '@/constants'
import {
  generateDailyRecommends,
  getRecommendsTips,
} from '@/lib/gpt-daily-recommend'
import ShakeDetector from '@/lib/shake'
import { getSensorData, SensorData } from '@/lib/sensorReader'
import { getWeatherData } from '@/lib/get-Weather'
import { getCurrentCoordinates } from '@/lib/get-Location'
import * as Location from 'expo-location'
import { set } from 'date-fns'
interface Coordinates {
  latitude: number
  longitude: number
}
export default function Page() {
  const { user } = useUser()
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  const [recommend, setRecommned] = useState<string>('')
  const [location, setLocation] = useState<Coordinates | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sensor data
        const sensorData = await getSensorData()
        setSensorData(sensorData)
        console.log('Sensor Data:', JSON.stringify(sensorData))

        // Fetch current location coordinates
        const currentLocation: Coordinates | void =
          await getCurrentCoordinates()
        console.log('Current Location:', currentLocation)

        if (currentLocation) {
          // Fetch weather data based on the current location
          const weatherData = await getWeatherData(
            currentLocation.latitude,
            currentLocation.longitude
          )
          setLocation(currentLocation)
          console.log('Weather Data:', JSON.stringify(weatherData))

          // Combine sensorData and weatherData into a single JSON object
          const combinedData = {
            sensorData,
            weatherData,
          }

          // Pass the combined data as a JSON string to getRecommendsTips
          const result = await getRecommendsTips(JSON.stringify(combinedData))
          console.log('Recommendations:', JSON.stringify(result))

          // 如果 recommend 字符串中包含 '\\n'，将其替换为 '\n'
          const formattedRecommend = result.replace(/\\n/g, '\n')
          setRecommned(formattedRecommend)
        } else {
          console.error('Failed to get current location')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])
  const mapProvider =
    Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1">
        <SignedIn>
          <Text className="font-JakartaBold text-left font-light my-1 px-4 self-start text-black">
            612/613 Swanston street
          </Text>
          <View className="h-px bg-gray-300 my-1" />

          {/* 第一部分：图标部分 */}
          <View className="flex-1 justify-center items-center my-1">
            <View className="flex-row justify-around w-full px-5 ">
              {/* 图标容器 */}
              <View className="items-center">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/(root)/(generate-plan)/chat',
                      params: { placeType: 'restaurant' },
                    })
                  }>
                  <Image source={icons.restaurant} className="w-11 h-11" />
                </TouchableOpacity>
                <Text className="font-Jakarta font-light text-center mt-1 text-xs">
                  Cafe
                </Text>
              </View>
              <View className="items-center">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/(root)/(generate-plan)/chat',
                      params: { placeType: 'restaurant' },
                    })
                  }>
                  <Image source={icons.milkTea} className="w-11 h-11" />
                </TouchableOpacity>
                <Text className="font-Jakarta font-light text-center mt-1 text-xs">
                  Milk tea
                </Text>
              </View>

              <View className="items-center">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/(root)/(generate-plan)/chat',
                      params: { placeType: 'cafe' },
                    })
                  }>
                  <Image source={icons.coffee} className="w-11 h-11" />
                </TouchableOpacity>
                <Text className="font-Jakarta font-light text-center mt-1 text-xs">
                  Cafe
                </Text>
              </View>

              <View className="items-center">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/(root)/(generate-plan)/chat',
                      params: { placeType: 'entertainment' },
                    })
                  }>
                  <Image source={icons.entertainment} className="w-11 h-11" />
                </TouchableOpacity>
                <Text className="font-Jakarta font-light text-center mt-1 text-xs">
                  Fun
                </Text>
              </View>

              <View className="items-center">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/(root)/(generate-plan)/chat',
                      params: { placeType: 'attraction' },
                    })
                  }>
                  <Image source={icons.tour} className="w-11 h-11" />
                </TouchableOpacity>
                <Text className="font-Jakarta font-light text-center mt-1 text-xs">
                  Tour
                </Text>
              </View>
            </View>
          </View>

          <View className="h-px bg-gray-300 my-1" />

          {/* 第二部分：推荐部分 */}
          <View className="px-2 my-1">
            <Text className="font-JakartaBold text-left text-lg font-bold px-2 self-start text-black">
              Daily Recommends
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="pl-2 my-1">
              {/* 第一张卡片 */}
              <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1">
                <Image
                  source={require('../../../assets/images/home.png')}
                  className="w-full h-[260px]"
                  resizeMode="cover"
                />
                <Text className="text-xl font-bold p-2">ABC Restaurant</Text>
                <Text className="text-base text-gray-600 px-2 pb-2">
                  517m - A great restaurant near you
                </Text>
              </View>
              {/* 第二张卡片 */}
              <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1">
                <Image
                  source={require('../../../assets/images/yellow.png')}
                  className="w-full h-[260px]"
                  resizeMode="cover"
                />
                <Text className="text-xl font-bold p-2">NFC Museum</Text>
                <Text className="text-base text-gray-600 px-2 pb-2">
                  5km - Famous museum in the area
                </Text>
              </View>
              {/* 第三张卡片 */}
              <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1">
                <Image
                  source={require('../../../assets/images/background.png')}
                  className="w-full h-[260px]"
                  resizeMode="cover"
                />
                <Text className="text-xl font-bold p-2">XYZ Cafe</Text>
                <Text className="text-base text-gray-600 px-2 pb-2">
                  1.2km - Cozy place for coffee
                </Text>
              </View>
              {/* 第四张卡片 */}
              <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1">
                <Image
                  source={require('../../../assets/images/background.png')}
                  className="w-full h-[260px]"
                  resizeMode="cover"
                />
                <Text className="text-xl font-bold p-2">City Theatre</Text>
                <Text className="text-base text-gray-600 px-2 pb-2">
                  2km - Popular movie spot
                </Text>
              </View>
            </ScrollView>
          </View>

          <View className="h-px bg-gray-300 my-1" />

          {/* 第三部分：Tips部分，需要下滑才能看到 */}
          <View className="flex-1 px-4 my-1 ">
            <Text className="font-JakartaBold text-left text-lg font-bold px-2 self-start text-black">
              Tips from Lazy Go
            </Text>
            <ScrollView className="w-max h-64 bg-white rounded-lg shadow my-1">
              <View className="w-full h-full p-2">
                <Text className="text-gray-900 m-1 font-Jakarta text-sm">
                  {recommend !== '' ? recommend : 'Fetching recommendations...'}
                </Text>
              </View>
            </ScrollView>
            <View className="w-max mt-2 h-36 bg-white rounded-lg shadow my-3">
              {!location ? (
                <View className="w-max mt-2 h-36 bg-white rounded-lg shadow my-3"></View>
              ) : (
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.006, // 控制缩放级别
                    longitudeDelta: 0.006,
                  }}
                  provider={mapProvider} // 根据平台设置地图提供商
                  showsUserLocation={true} // 显示用户当前位置
                  showsMyLocationButton={true} // 显示定位按钮
                  showsCompass={true} // 显示指南针
                >
                  {/* 你可以在这里添加 Markers 或其他组件 */}
                  <Marker
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    title="Your Location"
                    description="This is your current location"
                  />
                </MapView>
              )}
            </View>
          </View>

          <CustomButton
            className="mt-6 bg-red-300"
            title="Generate Plan"
            onPress={async () => {
              router.push('/(root)/(generate-plan)/gpt_test')
            }}
          />
          <CustomButton
            className="mt-6 bg-red-300"
            title="Travel Plan Test"
            onPress={async () => {
              router.push('/(root)/(generate-plan)/explore')
            }}
          />
        </SignedIn>
        <SignedOut>
          <Text>
            <Link href="/(auth)/sign-in">Sign In</Link>
          </Text>
          <Text>
            {/* 确保 Link 被包裹在 Text 中 */}
            <Link href="/(auth)/sign-up">Sign Up</Link>
          </Text>
        </SignedOut>
      </ScrollView>
    </SafeAreaView>
  )
}
