import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const FavoriteComponent = () => {
  const [favorites, setFavorites] = useState([])

  const fetchFavoritesFromApi = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail') // step1
      if (!email) {
        console.log('Email not found')
        return
      }

      // get favorite data
      const response = await fetch(`/(api)/favorite?email=${email}`, {
        // step2
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network wrong')
      }

      const result = await response.json() //step3

      if (!Array.isArray(result)) {
        console.error('Wrong Data:', result)
        return
      }

      if (result.length === 0) {
        console.log('NO data found')
        return
      }

      // 更新 state 中的 favorites
      setFavorites(result)
    } catch (error) {
      console.error('Getting favorite Wrong:', error)
    }
  }

  useEffect(() => {
    fetchFavoritesFromApi()
  }, [])

  // 点击按钮的处理函数
  const handleAddFavorite = (item) => {
    console.log('handle detail button:', item)
  }

  // 渲染卡片
  const renderFavoriteCard = ({ item }) => (
    <View className="flex-1 bg-white rounded-[12px] p-2 mb-4 shadow-md h-32 ">
      <Text className="text-[18px] font-bold">{item.transportation}</Text>
      <Text className="text-[14px] mt-1" style={{ color: '#555' }}>
        {item.description}
      </Text>
      <TouchableOpacity
        className="bg-[#fcaac1] rounded-[30px] py-1 px-3 self-end"
        onPress={() => handleAddFavorite(item)}>
        <Text className="text-base font-bold text-white">Detail</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View className="flex-1 ">
      <Text className="text-2xl font-bold mt-2 ml-4">My Favorite💗</Text>
      <FlatList
        className="flex-1"
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
      />
    </View>
  )
}
export default FavoriteComponent
