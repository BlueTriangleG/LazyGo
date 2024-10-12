import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { Button } from 'react-native'
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { icons, images } from '@/constants'

const Profile = () => {
  const { signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail')
        if (storedEmail !== null) {
          setEmail(storedEmail)
        }
        // get user information from the database
        const response = await fetch('/(api)/user?email=' + storedEmail)
        const data = await response.json()
        setEmail(data.data.email)
        setName(data.data.name)
      } catch (error) {
        console.error('Failed to fetch the email:', error)
      }
    }

    fetchUserEmail()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/(auth)/welcome')
      console.log('Successfully signed out')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleFavorite = () => {
    router.push('/(root)/(generate-plan)/favoriteCollect') // 跳转到收藏页面（假设有个收藏页面）
    console.log('Navigating to favorite page')
  }

  const header = () => {
    return (
      <ImageBackground
        source={images.profileBackground}
        className="w-full h-96 flex items-center justify-center relative" // 添加 relative
      >
        <TouchableOpacity
          onPress={handleSignOut}
          className="absolute top-14 right-5">
          <Image source={icons.logOut} className="w-10 h-10" />
        </TouchableOpacity>
        <Image
          source={images.Avatar}
          className="w-32 h-32 rounded-full border-4 border-white"
        />
        <Text className="font-JakartaBold text-2xl m-2 uppercase">{name}</Text>
        <Text className="font-JakartaMedium text-base">{email}</Text>
      </ImageBackground>
    )
  }

  return (
    <View className="flex-1 justify-between">
      <View className="mt-0">{header()}</View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* 添加Favorite按钮 */}
        <Button title="Favorite" onPress={handleFavorite} />
      </View>
    </View>
  )
}

export default Profile
