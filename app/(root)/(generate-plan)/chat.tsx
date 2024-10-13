import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View, ScrollView, Alert } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useEffect, useState } from 'react'

import presetChats_res from './data/preset-chats-restaurant.json'
import presetOptions_res from './data/preset-options-restuarant.json'
import presetChats_caf from './data/preset-chats-cafe.json'
import presetOptions_caf from './data/preset-options-cafe.json'
import presetChats_ent from './data/preset-chats-entertainment.json'
import presetOptions_ent from './data/preset-options-entertainment.json'
import presetChats_att from './data/preset-chats-attractions.json'
import presetOptions_att from './data/preset-options-attractions.json'

import CustomButton from '@/components/CustomButton'
import { ProgressBar } from 'react-native-paper'
import { useLocalSearchParams } from 'expo-router'
import { getCurrentLocation } from '@/lib/location'
import {
  Activity,
  generatePlan_restaurant,
  Plan,
} from '@/lib/gpt-plan-generate'
import { router } from 'expo-router'

import TravelCard from '@/components/TravelPlanComponent/TravelCard'

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
}

export type ChatProps = {
  placeType: string
}

const Chat = (props: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const chatParams: ChatProps = useLocalSearchParams()
  const [currentLocation, setCurrentLocation] = useState<string>('')
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

  const initializeLocation = async () => {
    const curLocation = await getCurrentLocation()
    if (!curLocation) {
      Alert.alert('Please enable location service')
      return
    }
    setCurrentLocation(curLocation)
  }

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
    initializeLocation()
  }, [])

  // Handle reset button
  const handleReset = () => {
    console.log('userConfig', userConfig)
    let initMsgContent = chatsArray.find((chat) => chat.keyword === 'init')
    setUserConfig({
      departureTime: '',
      transportation: '',
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
      return (
        <Text
          key={index}
          className={`${
            item.sender === 'bot'
              ? 'bg-blue-100 self-start'
              : 'bg-green-100 self-end'
          } p-2 m-2 rounded-lg max-w-[90%] font-Jakarta font-light text-xs`}>
          {item.content}
        </Text>
      )
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

  // Handle generate plan button
  const handleGeneratePlan = async () => {
    setGenerating(true)
    console.log('userConfig', userConfig)
    if (!currentLocation) {
      Alert.alert('Please enable location service')
      return
    }
    const now = new Date()
    const futureTime = new Date(
      now.getTime() + Number(userConfig.departureTime) * 60 * 1000
    ) // 加上20分钟
    const departureTime = new Date(
      futureTime.getTime() - futureTime.getTimezoneOffset() * 60000
    ).toISOString()

    // Call API to generate plan
    const result: Plan | void = await generatePlan_restaurant(
      currentLocation,
      departureTime,
      userConfig.transportation,
      userConfig.minPrice,
      userConfig.maxPrice
    )
    if (!result) {
      Alert.alert('Failed to generate plan')
      return
    }
    const newMessages: Message[] = []
    Object.keys(result).forEach((key) => {
      let activities: Activity[] = result[Number(key)]
      const newMessage: Message = {
        content: (
          <View>
            <View className="h-px bg-gray-300 my-6" />
            <Text className="font-bold text-lg mb-4">Day {key}</Text>
            {activities.map((data, index) => {
              return (
                <View className="w-[90%] ml-8" key={index}>
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
              )
            })}
            <CustomButton
              title={'Check Details'}
              className="mt-6 bg-orange-300"
              onPress={() => {
                handleCheckDetails(key, result)
              }}
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
  }

  return (
    <SafeAreaView className="flex-1 h-full">
      <ScrollView className="flex-1 h-full">
        <ProgressBar
          style={{ height: 10, width: '100%' }}
          progress={progress / totalSteps}
        />

        <View className="flex-1 w-full h-[90%] p-5">
          <FlashList
            estimatedItemSize={35}
            data={messages}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>

      <View className="mb-12">
        <View className="mx-5 mb-10">
          {/* Render options based on current chat */}
          {optionsArray
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
        <CustomButton
          title={generating ? 'Generating...' : 'Generate Plan'}
          disabled={generating}
          style={{ display: progress !== totalSteps ? 'none' : 'flex' }}
          className="mt-6 bg-orange-300"
          onPress={handleGeneratePlan}
        />
        <CustomButton
          title="Reset"
          className="mt-6 bg-orange-300"
          onPress={handleReset}
        />
      </View>
    </SafeAreaView>
  )
}

export default Chat
