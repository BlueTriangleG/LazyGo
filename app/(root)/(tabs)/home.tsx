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
  Modal,
} from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '@/constants'
import {
  generateDailyRecommends,
  getRecommendsTips,
  RecommendDetail,
} from '@/lib/gpt-daily-recommend'
import * as Location from 'expo-location'
import LottieView from 'lottie-react-native'
import { photoUrlBase } from '@/lib/google-map-api'
import { useMyContext } from '@/app/context/MyContext'

interface Coordinates {
  latitude: number
  longitude: number
}
export default function Page() {
  const { currentLocation, sensorData, weatherData, isLoading, error } =
    useMyContext()
  const { user } = useUser()
  const [recommend, setRecommned] = useState<string>('')
  const [dailyRecommends, setDailyRecommends] = useState<
    RecommendDetail[] | null
  >(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isLoading && currentLocation && sensorData && weatherData) {
          console.log('Data from useContext loaded!!!!!!!:', {
            currentLocation,
            sensorData,
            weatherData,
          })
          // Combine sensorData and weatherData into a single JSON object
          const combinedData = {
            sensorData,
            weatherData,
          }

          // Initiate both asynchronous operations without awaiting
          const recommendTipsPromise = getRecommendsTips(
            JSON.stringify(combinedData)
          )
          const dailyRecommendsPromise = generateDailyRecommends(
            `${currentLocation.latitude},${currentLocation.longitude}`
          )

          // Await both promises in parallel
          const [recommnedTips, dailyRecommends] = await Promise.all([
            recommendTipsPromise,
            dailyRecommendsPromise,
          ])
          console.log('recommnedTips:', recommnedTips)
          console.log('dailyRecommends:', dailyRecommends)

          if (!dailyRecommends || !recommnedTips) {
            console.error('Failed to get recommendations')
            alert('Failed to get daily recommendations')
            return
          } else {
            // If recommendTips is a string that contains '\\n', replace it with '\n'
            const formattedRecommend = recommnedTips.replace(/\\n/g, '\n')
            console.log('dailyRecommends:', dailyRecommends)
            setRecommned(formattedRecommend)
            setDailyRecommends(dailyRecommends)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    if (!isLoading) {
      fetchData()
    }
  }, [isLoading, currentLocation, sensorData, weatherData])
  const mapProvider =
    Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1">
        <SignedIn>
          <Text className="font-JakartaBold text-left font-light my-1 px-4 self-start text-black">
            {currentLocation == null
              ? 'Loading...'
              : `${currentLocation.address.city},${currentLocation.address.street} ${currentLocation.address.streetNumber}`}
          </Text>
          <View className="h-px bg-gray-300 my-1" />

          <View className="flex-1 justify-center items-center my-1">
            <View className="flex-row justify-around w-full px-5 ">
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
            {dailyRecommends == null ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="pl-2 my-1">
                {/* card1 */}

                <View className="w-[260px] mr-4 h-80 bg-white rounded-lg overflow-hidden shadow my-1 justify-center items-center">
                  <LottieView
                    source={require('../../../assets/animation/loading.json')} // Full-screen success animation path
                    autoPlay
                    style={{ width: 200, height: 200 }} // Customize size
                  />
                  <Text className="text-xl font-bold p-2">Loading...</Text>
                </View>
                {/* card2 */}
                <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1 justify-center items-center">
                  <LottieView
                    source={require('../../../assets/animation/loading.json')} // Full-screen success animation path
                    autoPlay
                    style={{ width: 200, height: 200 }} // Customize size
                  />
                  <Text className="text-xl font-bold p-2">Loading...</Text>
                </View>
                {/* card3 */}
                <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1 justify-center items-center">
                  <LottieView
                    source={require('../../../assets/animation/loading.json')} // Full-screen success animation path
                    autoPlay
                    style={{ width: 200, height: 200 }} // Customize size
                  />
                  <Text className="text-xl font-bold p-2">Loading...</Text>
                </View>
              </ScrollView>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="pl-2 my-1">
                {dailyRecommends &&
                  dailyRecommends.map((recommend, index) => (
                    <View
                      key={index}
                      style={{
                        width: 260,
                        marginRight: 16,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        overflow: 'hidden',
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        marginVertical: 8,
                      }}>
                      <Image
                        source={{uri: photoUrlBase + recommend.photo_reference}}
                        style={{ width: '100%', height: 260 }}
                        resizeMode="cover"
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          padding: 8,
                        }}>
                        {recommend.destination}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#666',
                          paddingHorizontal: 8,
                          paddingBottom: 8,
                        }}>
                        {recommend.distance} - {recommend.destinationDescrib}
                      </Text>
                    </View>
                  ))}
              </ScrollView>
            )}
          </View>

          <View className="h-px bg-gray-300 my-1" />

          {/* 第三部分：Tips部分，需要下滑才能看到 */}
          <View className="px-2 my-1">
            <Text className="font-JakartaBold text-left text-lg font-bold px-2 self-start text-black">
              Tips from Lazy Go
            </Text>
            <ScrollView className="w-max h-64 m-2 p-2 bg-white rounded-lg shadow my-1">
              {recommend !== '' ? (
                <View className="w-full h-full">
                  <Text className="text-gray-900 m-1 font-Jakarta text-sm">
                    {recommend}
                  </Text>
                </View>
              ) : (
                <View className="w-full h-64 justify-center items-center">
                  <LottieView
                    source={require('../../../assets/animation/animation2.json')} // Full-screen success animation path
                    autoPlay
                    style={{ width: 120, height: 120 }} // Customize size
                  />
                </View>
              )}
            </ScrollView>
            <View className="w-max m-2 h-36 bg-white rounded-lg shadow my-3">
              {isLoading || currentLocation == null ? (
                <View className="flex-1 justify-center items-center w-max h-max">
                  <LottieView
                    source={require('../../../assets/animation/loading.json')} // Full-screen success animation path
                    autoPlay
                    style={{ width: 120, height: 120 }} // Customize size
                  />
                </View>
              ) : (
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.006,
                    longitudeDelta: 0.006,
                  }}
                  provider={mapProvider}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  showsCompass={true}>
                  <Marker
                    coordinate={{
                      latitude: currentLocation.latitude,
                      longitude: currentLocation.longitude,
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
        </SignedIn>
        <SignedOut>
          <Text>
            <Link href="/(auth)/sign-in">Sign In</Link>
          </Text>
          <Text>
            <Link href="/(auth)/sign-up">Sign Up</Link>
          </Text>
        </SignedOut>
      </ScrollView>
    </SafeAreaView>
  )
}
