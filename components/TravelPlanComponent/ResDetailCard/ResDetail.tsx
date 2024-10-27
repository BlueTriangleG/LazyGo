import React, { useEffect, useState } from 'react'

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { photoUrlBase } from '@/lib/google-map-api'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Button } from 'tamagui'
import SuccessPopup from '@/components/favourite/successPopup'
type ResDetailProps = {
  onClose: () => void
  onFavorite: () => void
  title: string | null
  description: string | null
  coords: string | null
  duration: string | null
  destinationDuration: string | null
  transportation: string | null
  distance: string | null
  estimatedPrice: string | null
  photoReference: string | null
  tips: string | null
  user_ratings_total: number | null
  rate: number | null
}

// collect screen height
const screenHeight = Dimensions.get('window').height

const ResDetail: React.FC<ResDetailProps> = ({
  user_ratings_total,
  onClose,
  onFavorite,
  title,
  description,
  coords,
  duration,
  destinationDuration,
  transportation,
  distance,
  estimatedPrice,
  photoReference,
  rate,
  tips,
}) => {
  const [email, setEmail] = useState<string | null>(null)
  const [tempLat, tempLong] = coords.split(',').map(Number)
  const [showSuccess, setShowSuccess] = useState(false);
  // get local email
  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail')
      if (storedEmail) {
        setEmail(storedEmail)
      }
    }

    fetchEmail()
  }, [])

  const handleFavorite = async () => {
    if (!email) {
      console.error('Did not found email')
      return
    }

    const favoriteData = {
      title,
      description,
      tempLat,
      tempLong,
      email,
      duration,
      destinationDuration,
      transportation,
      distance,
      estimatedPrice,
      photoReference,
      tips,
      user_ratings_total,
    }

    // call favorite api database
    try {
      const response = await fetch('/(api)/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(favoriteData),
      })

      const result = await response.json()
      if (response.ok) {
        setShowSuccess(true);
        console.log('favorite added:', result)
      } else {
        console.error('favorite failed:', result)
      }
    } catch (error) {
      console.error('Wrong request:', error)
    }
  }
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating) // 获取完整星星的数量
    const hasHalfStar = rating % 1 !== 0 // 判断是否有半颗星
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={20} color="gold" />)
    }

    // 添加半颗星
    if (hasHalfStar) {
      stars.push(
        <Icon key={fullStars} name="star-half-full" size={20} color="gold" />
      )
    }

    // 添加空星星
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={fullStars + 1 + i} name="star-o" size={20} color="gold" />
      )
    }

    return <View style={{ flexDirection: 'row' }}>{stars}</View>
  }

  const handleVisited = async () => {
    if (!email) {
      console.error('Email not Found')
      return
    }

    const visitedData = {
      email,
      title,
      visit_count: 1, // first visit
    }

    // VisitedPlaces Database
    try {
      const response = await fetch('/(api)/VisitedPlaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitedData),
      })

      const result = await response.json()
      if (response.ok) {
        console.log('Visited added:', result)
      } else {
        console.error('Visited failed:', result)
      }
    } catch (error) {
      console.error('Wrong request:', error)
    }
  }

  return (
    <View className="flex-1 justify-center items-center">
      {/* Wrap modal content with TouchableWithoutFeedback */}
      <View
        style={{ maxHeight: screenHeight * 0.75 }} // set max height based on screen
        className="bg-white w-11/12 rounded-2xl overflow-hidden shadow-lg">
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-1 right-1 z-10 w-11 h-11 rounded-full items-center justify-center">
          <Icon name="times" size={24} color="#333" />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {/* image */}
          {photoReference && (
            <View className="items-center">
              <Image
                source={{ uri: photoUrlBase + photoReference }} // show pic
                style={{
                  width: '102%',
                  height: 280,
                  borderRadius: 10,
                  margin: -5,
                }}
                resizeMode="cover"
              />
            </View>
          )}

          {/* title */}
          {title && (
            <View className="mt-4">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                {title}
              </Text>
            </View>
          )}

          {/* favorite and visited */}
          {title && (
            <View className="flex-row space-x-4 mb-4">
              <TouchableOpacity
                onPress={handleFavorite}
                className="flex-1 bg-yellow-500 rounded-full py-2">
                <Text className="text-white text-center text-sm font-semibold">
                  Favorite
                </Text>
              </TouchableOpacity>
              {showSuccess && <SuccessPopup onHide={() => setShowSuccess(false)} />}
              <TouchableOpacity
                onPress={handleVisited}
                className="flex-1 bg-blue-100 rounded-full py-2">
                <Text className="text-blue-500 text-center text-sm font-semibold">
                  Mark as Visited
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* rating */}
          {rate && (
            <View className="flex-row items-center mt-2 mb-4">
              <RatingStars rating={rate} />
              {/* 如果评论数是动态的，可以在此添加条件渲染 */}
              <Text className="text-xs text-gray-500 ml-2">
                {user_ratings_total} comments
              </Text>
            </View>
          )}

          {/* 地点信息 */}
          {description && (
            <Text className="text-xs text-gray-600 mb-4">{description}</Text>
          )}

          {/* 交通信息 */}
          {transportation && (
            <>
              <Text className="text-sm font-bold text-gray-700 mb-2">
                Transportation
              </Text>
              <Text className="text-sm text-gray-600 mb-4">
                {transportation}
              </Text>
            </>
          )}

          {/* 距离信息 */}
          {distance && (
            <>
              <Text className="text-sm font-bold text-gray-700 mb-2">
                Distance
              </Text>
              <Text className="text-sm text-gray-600 mb-4">{distance}</Text>
            </>
          )}

          {/* 价格信息 */}
          {estimatedPrice && (
            <>
              <Text className="text-sm font-bold text-gray-700 mb-2">
                Price
              </Text>
              <Text className="text-sm text-gray-600 mb-4">
                {estimatedPrice}
              </Text>
            </>
          )}

          {/* 详细描述 */}
          {description && (
            <>
              <Text className="text-sm font-bold text-gray-700 mb-2">
                Description
              </Text>
              <Text className="text-sm text-gray-600 mb-4">{description}</Text>
            </>
          )}

          {/* 提示信息 */}
          {tips && (
            <>
              <Text className="text-sm font-bold text-gray-700 mb-2">Tips</Text>
              <Text className="text-sm text-gray-600 mb-4">{tips}</Text>
            </>
          )}
          {/* close button */}
        </ScrollView>
      </View>
    </View>
  )
}

export default ResDetail
