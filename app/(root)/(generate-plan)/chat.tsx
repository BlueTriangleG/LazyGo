import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View, ScrollView, Alert, Image } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useCallback, useContext, useEffect, useState } from 'react'

import presetChats_res from './data/preset-chats-restaurant.json'
import presetOptions_res from './data/preset-options-restuarant.json'
import presetChats_caf from './data/preset-chats-cafe.json'
import presetOptions_caf from './data/preset-options-cafe.json'
import presetChats_ent from './data/preset-chats-entertainment.json'
import presetOptions_ent from './data/preset-options-entertainment.json'
import presetChats_att from './data/preset-chats-attractions.json'
import presetOptions_att from './data/preset-options-attractions.json'

import CustomButton from '@/components/CustomButton'
import { Icon, ProgressBar } from 'react-native-paper'
import { useLocalSearchParams } from 'expo-router'
import { getCurrentLocation } from '@/lib/location'
import {
  Activity,
  generatePlan_attractions,
  generatePlan_cafe,
  generatePlan_entertainment,
  generatePlan_restaurant,
  Plan,
} from '@/lib/gpt-plan-generate'
import ShakeDetector from '@/app/(root)/(generate-plan)/shake'
import { router } from 'expo-router'

import TravelCard from '@/components/TravelPlanComponent/TravelCard'
import * as Location from 'expo-location'
import Header from './header'
import { icons, images } from '@/constants'
import LottieView from 'lottie-react-native'

import { useMyContext } from '@/app/context/MyContext'

type Message = {
  content: string | React.JSX.Element
  sender: string
}

export type UserConfig = {
  minPrice?: number
  maxPrice?: number
  departureTime: string
  transportation: string
  placeType?: string
  people?: string
}

export type ChatProps = {
  placeType: string
}

const Chat = (props: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const chatParams: ChatProps = useLocalSearchParams()
  const {
    currentLocation,
    sensorData,
    weatherData,
    isLoading,
    error,
    fetchData,
  } = useMyContext()
  const [generating, setGenerating] = useState<boolean>(false)

  let presetChats = undefined
  let presetOptions = undefined
  if (chatParams.placeType === 'restaurant') {
    presetChats = presetChats_res
    presetOptions = presetOptions_res
  } else if (chatParams.placeType === 'entertainment') {
    presetChats = presetChats_ent
    presetOptions = presetOptions_ent
  } else if (chatParams.placeType === 'attraction') {
    presetChats = presetChats_att
    presetOptions = presetOptions_att
  } else if (chatParams.placeType === 'cafe') {
    presetChats = presetChats_caf
    presetOptions = presetOptions_caf
  }

  // Initialize chats and options, use JSON.parse(JSON.stringify()) to deep copy the object
  const [chatsArray, setChatsArray] = useState<
    { content: string; keyword: string }[]
  >(JSON.parse(JSON.stringify(Object.values(presetChats))))
  const [optionsArray, setOptionsArray] = useState<
    { options: { content: string; key: string }[]; keyword: string }[]
  >(JSON.parse(JSON.stringify(Object.values(presetOptions))))
  const [currentChat, setCurrentChat] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)
  const [userConfig, setUserConfig] = useState<UserConfig>({
    departureTime: '',
    transportation: '',
    placeType: chatParams.placeType,
  })
  const totalSteps =
    Object.values(presetOptions).find((options) => options.keyword === 'init')
      ?.options.length || 0

  // Initialize chat with the first message from preset chats
  useEffect(() => {
    let initMsgContent = chatsArray.find((chat) => chat.keyword === 'init')
    if (initMsgContent) {
      setCurrentChat(initMsgContent.keyword)
      let initMsg: Message = {
        content: initMsgContent.content,
        sender: 'bot',
      }
      setMessages([initMsg])
    }
  }, [])

  useEffect(() => {
    if (progress === totalSteps) {
      handleGeneratePlan()
    }
  }, [progress])

  // Handle reset button
  const handleReset = () => {
    console.log('userConfig', userConfig)
    let initMsgContent = chatsArray.find((chat) => chat.keyword === 'init')
    setUserConfig({
      departureTime: '',
      transportation: '',
      placeType: chatParams.placeType,
    })
    setProgress(0)
    setChatsArray(JSON.parse(JSON.stringify(Object.values(presetChats))))
    setOptionsArray(JSON.parse(JSON.stringify(Object.values(presetOptions))))
    if (initMsgContent) {
      setCurrentChat(initMsgContent.keyword)
      let initMsg: Message = {
        content: initMsgContent.content,
        sender: 'bot',
      }
      setMessages([initMsg])
    }
  }

  // Auto choose chat if current chat is 'init'
  useEffect(() => {
    if (currentChat === 'init') {
      autoChooseChat()
    }
  }, [currentChat])

  const autoChooseChat = () => {
    const options = optionsArray.find(
      (options) => options.keyword === 'init'
    )?.options
    if (!options || options.length === 0) {
      setCurrentChat('')
      return
    }
    const nextChat = options[0].key
    const nextContent = chatsArray.find(
      (chat) => chat.keyword === nextChat
    )?.content
    setCurrentChat(nextChat)
    let nextMsg: Message = {
      content: nextContent || '',
      sender: 'bot',
    }
    setMessages([...messages, nextMsg])
  }

  // Handle user's choice
  const handleButtonPress = (
    currentChat: string,
    key: string,
    content: string
  ) => {
    // If current chat is init, find next chat based on user's choice
    if (currentChat === 'init') {
      let nextChat = chatsArray.find((chat) => chat.keyword === key)
      if (nextChat) {
        setCurrentChat(nextChat.keyword)
        let nextMsg: Message = {
          content: nextChat.content,
          sender: 'bot',
        }
        setMessages([...messages, nextMsg])
      }
    } else {
      updateUserConfig(currentChat, key)

      // Find next chat based on user's choice
      let nextChat = chatsArray.find((chat) => chat.keyword === 'init')
      if (nextChat) {
        // Update options based on user's choice
        optionsArray.forEach((chat) => {
          if (chat.keyword === 'init') {
            chat.options.splice(
              chat.options.findIndex((option) => option.key === currentChat),
              1
            )
          }
        })
        setCurrentChat(nextChat.keyword)
        let nextMsg: Message = {
          content: content,
          sender: 'user',
        }
        setMessages([...messages, nextMsg])
        setProgress(progress + 1)
      }
    }
  }

  // Update user config based on user's choice
  function updateUserConfig(currentChat: string, key: string) {
    switch (currentChat) {
      case 'price_level':
        let minPrice = parseInt(key.split(',')[0])
        let maxPrice = parseInt(key.split(',')[1])
        userConfig.minPrice = minPrice === -1 ? undefined : minPrice
        userConfig.maxPrice = maxPrice === -1 ? undefined : maxPrice
        setUserConfig({ ...userConfig })
        break
      case 'departure_time':
        userConfig.departureTime = key
        setUserConfig({ ...userConfig })
        break
      case 'travel_mode':
        userConfig.transportation = key
        setUserConfig({ ...userConfig })
        break
      default:
        break
    }
  }

  // Render each message
  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    if (typeof item.content === 'string') {
      if (item.sender === 'bot') {
        return (
          <View className="flex-row items-start mb-2">
            <Image
              source={images.Avatar}
              className="w-8 h-8 rounded-full border-2 border-pink-50 mr-2"
            />

            <View className="bg-white shadow-sm rounded-lg p-3 max-w-[80%] font-Jakarta font-light text-xs">
              <Text className="font-Jakarta">{item.content}</Text>
            </View>
          </View>
        )
      } else {
        return (
          <View className="bg-gray-100 shadow-sm rounded-lg self-end p-3 mb-2 max-w-[80%] font-Jakarta font-light text-xs">
            <Text className="font-Jakarta">{item.content}</Text>
          </View>
        )
      }
    } else {
      return item.content
    }
  }
  // Handle check details button
  const handleCheckDetails = (key: string, plan: Plan) => {
    router.push({
      pathname: '/(root)/(generate-plan)/explore',
      params: { date: key, plan: JSON.stringify(plan) },
    })
  }
  const handleGeneratePlan = async () => {
    try {
      setGenerating(true)
      while (!currentLocation) {
        // Get the newest use context location
        console.log('location empty, initialize')
        // Wait for 1 second to get current location
        await fetchData()
      }

      console.log('userConfig', userConfig)

      const locationString = `${currentLocation.latitude},${currentLocation.longitude}`
      const now = new Date()
      const futureTime = new Date(
        now.getTime() + Number(userConfig.departureTime) * 60 * 1000
      )
      const departureTime = new Date(
        futureTime.getTime() - futureTime.getTimezoneOffset() * 60000
      ).toISOString()

      // Call API to generate plan
      let result: Plan | void
      switch (chatParams.placeType) {
        case 'restaurant':
          result = await generatePlan_restaurant(
            locationString,
            Number(userConfig.departureTime),
            userConfig.transportation,
            userConfig.minPrice,
            userConfig.maxPrice
          )
          break
        case 'cafe':
          result = await generatePlan_cafe(
            locationString,
            departureTime,
            userConfig.transportation,
            userConfig.minPrice,
            userConfig.maxPrice
          )
          break
        case 'attraction':
          result = await generatePlan_attractions(
            locationString,
            departureTime,
            userConfig.transportation,
            userConfig.minPrice,
            userConfig.maxPrice
          )
          break
        case 'entertainment':
          let keywords: string[]
          if (userConfig.people === 'alone') {
            keywords = ['spa', 'arcade', 'cinema', 'museum', 'park', 'bar']
          } else {
            keywords = ['bar', 'karaoke', 'escaperoom', 'boardgame', 'bowling']
          }
          result = await generatePlan_entertainment(
            locationString,
            departureTime,
            userConfig.transportation,
            keywords
          )
          break
        default:
          Alert.alert('Invalid place type')
          setGenerating(false)
          return
      }

      if (!result) {
        Alert.alert('Failed to generate plan')
        setGenerating(false)
        return
      }

      const newMessages: Message[] = []
      Object.keys(result).forEach((key) => {
        let activities: Activity[] = result[Number(key)]
        const newMessage: Message = {
          content: (
            <View>
              <View className="h-px bg-gray-300 my-6" />
              <Text>Day {key}</Text>
              {activities.map((data, index) => (
                <View style={{ width: '90%', marginLeft: 30 }} key={index}>
                  <TravelCard
                    time={data.time}
                    duration={data.duration}
                    destination={data.destination}
                    destinationDescrib={data.destinationDescrib}
                    destinationDuration={data.destinationDuration}
                    transportation={data.transportation}
                    distance={data.distance}
                    estimatedPrice={data.estimatedPrice}
                    startLocation={data.startLocation}
                    endLocation={data.endLocation}
                  />
                </View>
              ))}
              <CustomButton
                title={'Check Details'}
                className="mt-6 bg-red-300"
                onPress={() => handleCheckDetails(key, result)}
              />
              <View className="h-px bg-gray-300 my-6" />
            </View>
          ),
          sender: 'bot',
        }
        newMessages.push(newMessage)
      })

      setMessages([...messages, ...newMessages])
      setGenerating(false)
    } catch (error) {
      Alert.alert('Error', 'Failed to generate plan')
      console.error('Error calling generatePlan:', error)
      setGenerating(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 h-full bg-white">
      <Header onReset={handleReset} />
      <ScrollView className="flex-1 h-full">
        <ProgressBar
          className="w-full h-2 bg-pink-50"
          progress={progress / totalSteps}
          color="#fa9a9a"
        />

        <View className="flex-1 w-full h-[90%] p-3">
          <FlashList
            estimatedItemSize={35}
            data={messages}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>

      <View className="mb-3">
        <View className="mx-5 mb-5">
          {/* Render options based on current chat */}
          {currentChat !== 'init' &&
            optionsArray
              .find((options) => options.keyword === currentChat)
              ?.options.map((option) => {
                return (
                  <CustomButton
                    key={option.key} // 确保每个 button 有唯一的 key
                    title={option.content}
                    className="mt-6 bg-red-300"
                    onPress={() =>
                      handleButtonPress(currentChat, option.key, option.content)
                    }
                  />
                )
              })}
        </View>
        {progress === totalSteps &&
          (generating ? (
            <View className="flex justify-center items-center w-full h-20">
              <LottieView
                source={require('../../../assets/animation/success.json')} // Path to your animation
                autoPlay
                style={{ width: 120, height: 120 }} // Customize size as needed
              />
            </View>
          ) : (
            <View className="flex justify-center items-center w-full h-10">
              <ShakeDetector
                onShake={handleGeneratePlan}
                disabled={generating}
              />
            </View>
          ))}
      </View>
    </SafeAreaView>
  )
}

export default Chat
