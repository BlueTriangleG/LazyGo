import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { StyleSheet, Platform, Alert } from 'react-native'

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
  Linking,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import ShakeDetector from '@/app/(root)/(generate-plan)/shake'
import { set } from 'date-fns'
import { Activity } from '@/lib/gpt-plan-generate'

import type { CardProps } from 'tamagui'
import { Button, Card, H2, Image, Paragraph, XStack } from 'tamagui'
import { color } from '../../../node_modules/style-value-types/lib/color/index'
import Icon from 'react-native-vector-icons/FontAwesome'
import { classNames } from '../../../node_modules/@tamagui/remove-scroll/src/RemoveScroll'
import TravelCard from '@/components/TravelPlanComponent/TravelCard'
import WeatherCard from '@/components/weatherTips/weatherCard'

export default function Page(props: CardProps) {
  const { currentLocation, sensorData, weatherData, isLoading, error } =
    useMyContext()
  const { user } = useUser()
  const [tip, setTip] = useState<string>('')
  const [dailyRecommends, setDailyRecommends] = useState<Activity[] | null>(
    null
  )
  const [reload, setReload] = useState<boolean>(false)

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={20} color="gold" />)
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key={fullStars} name="star-half-full" size={20} color="gold" />
      )
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={fullStars + 1 + i} name="star-o" size={20} color="gold" />
      )
    }

    return <View style={{ flexDirection: 'row' }}>{stars}</View>
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRecommend, setSelectedRecommend] = useState<Activity | null>(
    null
  )
  const [isGpsEnabled, setIsGpsEnabled] = useState(false)

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        setIsGpsEnabled(true)
        fetchData() // 位置权限允许后调用 fetchData
      } else {
        setIsGpsEnabled(false)
        promptEnableGps()
      }
    } catch (error) {
      console.error('Error requesting location permission:', error)
    }
  }

  const promptEnableGps = () => {
    Alert.alert(
      'Enable GPS',
      'Please enable GPS and restart the app',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('App-Prefs:root=Privacy&path=LOCATION')
            } else {
              Linking.openSettings()
            }
          },
        },
      ],
      { cancelable: false }
    )
  }

  const fetchData = async () => {
    try {
      if (!isLoading && currentLocation && sensorData && weatherData) {
        console.log('Current Location:', currentLocation)
        console.log('Sensor Data:', sensorData)
        console.log('Weather Data:', weatherData)

        const combinedData = {
          sensorData,
          weatherData,
        }

        console.log('Combined Data:', combinedData)

        const recommendTipsPromise = getRecommendsTips(
          JSON.stringify(combinedData)
        )
        const dailyRecommendsPromise = generateDailyRecommends(
          `${currentLocation.latitude},${currentLocation.longitude}`
        )

        recommendTipsPromise
          .then((recommendTips) => {
            if (recommendTips) {
              console.log('Recommend Tips:', recommendTips)
              const formattedRecommend = recommendTips.replace(/\\n/g, '\n')
              setTip(formattedRecommend)
            } else {
              console.error('Failed to get recommendTips')
              alert('Failed to get recommendTips')
            }
          })
          .catch((error) => {
            console.error('Error fetching recommendTips:', error)
          })

        dailyRecommendsPromise
          .then((dailyRecommends) => {
            if (dailyRecommends) {
              console.log('Daily Recommends:', dailyRecommends)
              setDailyRecommends(dailyRecommends)
            } else {
              console.error('Failed to get dailyRecommends')
            }
          })
          .catch((error) => {
            console.error('Error fetching dailyRecommends:', error)
          })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (!isLoading) {
      requestLocationPermission()
      setReload(false)
    }
  }, [isLoading, currentLocation, sensorData, weatherData, reload])

  const mapProvider =
    Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 ">
        <SignedIn>
          <View className="flex-row justify-between items-center">
            <Text className="font-JakartaBold text-left font-light my-1 px-4 self-start text-black">
              {currentLocation == null
                ? 'Loading...'
                : `${currentLocation.address.city},${currentLocation.address.street} ${currentLocation.address.streetNumber}`}
            </Text>
            <ShakeDetector
              onShake={() => {
                setReload(true)
                console.log('Shake')
              }}
            />
          </View>

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
                  Restaurant
                </Text>
              </View>
              <View className="items-center">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/(root)/(generate-plan)/chat',
                      params: { placeType: 'milktea' },
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
                  Coffee
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

          {/* Part2: recommendation */}
          <View className="px-2 my-1">
            <Text className="font-JakartaBold text-left text-lg font-bold px-2 self-start text-black">
              Daily Recommends
            </Text>
            {dailyRecommends == null || reload == true ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="pl-2 my-1">
                {/* card1 */}
                <View className="w-[260px] mr-4 h-80 bg-white rounded-lg overflow-hidden shadow my-1 justify-center items-center">
                  <LottieView
                    source={require('../../../assets/animation/loading.json')}
                    autoPlay
                    style={{ width: 200, height: 200 }}
                  />
                  <Text className="text-xl font-bold p-2">Loading...</Text>
                </View>
                {/* card2 */}
                <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1 justify-center items-center">
                  <LottieView
                    source={require('../../../assets/animation/loading.json')}
                    autoPlay
                    style={{ width: 200, height: 200 }}
                  />
                  <Text className="text-xl font-bold p-2">Loading...</Text>
                </View>
                {/* card3 */}
                <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1 justify-center items-center">
                  <LottieView
                    source={require('../../../assets/animation/loading.json')}
                    autoPlay
                    style={{ width: 200, height: 200 }}
                  />
                  <Text className="text-xl font-bold p-2">Loading...</Text>
                </View>
              </ScrollView>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="pl-2 my-1">
                <XStack
                  $sm={{ flexDirection: 'row' }}
                  paddingHorizontal="$1"
                  space>
                  {dailyRecommends &&
                    dailyRecommends.map((recommend, index) => (
                      <Card
                        key={index}
                        onPress={() => {
                          setSelectedRecommend(recommend)
                          setIsModalVisible(true)
                        }}
                        animation="bouncy"
                        scale={0.9}
                        backgroundColor={'#fff'}
                        hoverStyle={{ scale: 0.925 }}
                        pressStyle={{ scale: 0.875 }}
                        style={{
                          width: 260,
                          borderRadius: 8,
                          overflow: 'hidden',
                          marginVertical: 8,
                        }}>
                        {/* 卡片内容 */}
                        <Image
                          source={{
                            uri: photoUrlBase + recommend.photo_reference,
                          }}
                          style={{ width: '100%', height: 260 }}
                        />
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            padding: 8,
                          }}>
                          {recommend.destination}
                        </Text>
                        <Card.Footer />
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#666',
                            paddingHorizontal: 8,
                            paddingBottom: 4,
                          }}>
                          {recommend.distance}
                        </Text>
                        <View
                          className="flex-row"
                          style={{
                            paddingHorizontal: 8,
                            paddingBottom: 4,
                          }}>
                          {recommend.rating !== null ? (
                            <RatingStars rating={recommend.rating} />
                          ) : (
                            ' '
                          )}
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#666',
                              paddingHorizontal: 8,
                              paddingBottom: 4,
                            }}>
                            {' '}
                            (
                            {recommend.user_ratings_total !== null
                              ? recommend.user_ratings_total
                              : 0}{' '}
                            ratings)
                          </Text>
                        </View>
                      </Card>
                    ))}
                </XStack>
              </ScrollView>
            )}
          </View>
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setIsModalVisible(false)
            }}>
            <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      width: '90%',
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      padding: 20,
                    }}>
                    <TouchableOpacity
                      onPress={() => setIsModalVisible(false)}
                      className="absolute top-1 right-1 z-10 w-11 h-11 rounded-full items-center justify-center">
                      <Icon name="times" size={24} color="#333" />
                    </TouchableOpacity>
                    {selectedRecommend && (
                      <TravelCard
                        time={selectedRecommend.time}
                        duration={selectedRecommend.duration}
                        destination={selectedRecommend.destination}
                        destinationDescrib={
                          selectedRecommend.destinationDescrib
                        }
                        destinationDuration={
                          selectedRecommend.destinationDuration
                        }
                        transportation={selectedRecommend.transportation}
                        distance={selectedRecommend.distance}
                        estimatedPrice={selectedRecommend.estimatedPrice}
                        startLocation={selectedRecommend.startLocation}
                        endLocation={selectedRecommend.endLocation}
                        photoReference={selectedRecommend.photo_reference}
                        rating={selectedRecommend.rating}
                        user_ratings_total={
                          selectedRecommend.user_ratings_total
                        }
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <View className="h-px bg-gray-300 my-1" />

          {/* Part3 */}
          <View className="px-2 my-1">
            {weatherData ? (
              <WeatherCard weatherData={weatherData} />
            ) : (
              <View className="w-[260px] h-80 bg-white rounded-lg overflow-hidden shadow my-1 justify-center items-center">
                <LottieView
                  source={require('../../../assets/animation/loading.json')}
                  autoPlay
                  style={{ width: 200, height: 200 }}
                />
                <Text className="text-xl font-bold p-2">Loading Weather...</Text>
              </View>
            )}

            <Text className="font-JakartaBold text-left text-lg font-bold px-2 self-start text-black">
              Tips from Lazy Go
            </Text>
            <ScrollView className="w-max h-64 m-2 p-2 bg-white rounded-lg shadow my-1">
              {tip !== '' ? (
                <View className="w-full h-full">
                  <Text className="text-gray-900 m-1 font-Jakarta text-base">
                    {tip}
                  </Text>
                </View>
              ) : (
                <View className="w-full h-64 justify-center items-center p-1">
                  <LottieView
                    source={require('../../../assets/animation/animation2.json')}
                    autoPlay
                    style={{ width: 120, height: 120 }}
                  />
                </View>
              )}
            </ScrollView>
            <View className="w-max m-2 h-36 bg-white rounded-lg shadow my-3">
              {isLoading || currentLocation == null ? (
                <View className="flex-1 justify-center items-center w-max h-max">
                  <LottieView
                    source={require('../../../assets/animation/loading.json')}
                    autoPlay
                    style={{ width: 120, height: 120 }}
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
          <View className="h-8 my-1"></View>
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
