import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { photoUrlBase } from '@/lib/google-map-api';

type ResDetailProps = {
  onClose: () => void;
  onFavorite: () => void;
  title: string;
  description: string;
  coords: string;
  duration: string;
  destinationDuration: string;
  transportation: string;
  distance: string;
  estimatedPrice: string;
  photoReference: string;
  tips: string;
};

// collect screen height
const screenHeight = Dimensions.get('window').height;

const ResDetail: React.FC<ResDetailProps> = ({
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
  tips,
}) => {
  const [email, setEmail] = useState<string | null>(null);
  const [tempLat, tempLong] = coords.split(',').map(Number);
  
  // get local email
  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    fetchEmail();
  }, []);

  const handleFavorite = async () => {
    if (!email) {
      console.error('Did not found email');
      return;
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
    };

    // call favorite api database
    try {
      const response = await fetch('/(api)/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(favoriteData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('favorite added:', result);
      } else {
        console.error('favorite failed:', result);
      }
    } catch (error) {
      console.error('Wrong request:', error);
    }
  };

  const handleVisited = async () => {
    if (!email) {
      console.error('Email not Found');
      return;
    }

    const visitedData = {
      email,
      title,
      visit_count: 1, // first visit
    };

    // VisitedPlaces Database
    try {
      const response = await fetch('/(api)/VisitedPlaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitedData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Visited added:', result);
      } else {
        console.error('Visited failed:', result);
      }
    } catch (error) {
      console.error('Wrong request:', error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity
        onPress={onClose} // close card
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        className="absolute inset-0"
      />

      {/* card container */}
      <View
        style={{ maxHeight: screenHeight * 0.75 }} // set max height based on screen 
        className="bg-white w-11/12 rounded-2xl overflow-hidden shadow-lg"
      >
        <ScrollView 
          contentContainerStyle={{ padding: 16 }} 
          showsHorizontalScrollIndicator={false} // 隐藏水平滚动条
          showsVerticalScrollIndicator={false} // 隐藏垂直滚动条
        >
          {/* image */}
          <Image
            source={{ uri: photoUrlBase + photoReference }} // show pic
            style={{ width: 300, height: 300, borderRadius: 10, marginRight: 10 }} 
            resizeMode="cover"
          />

          {/* title */}
          <View className="mt-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>

            {/* favorite and visited */}
            <View className="flex-row space-x-4 mb-4">
              <TouchableOpacity
                onPress={handleFavorite} 
                className="flex-1 bg-yellow-500 rounded-full py-2"
              >
                <Text className="text-white text-center text-sm font-semibold">Favorite</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleVisited}
                className="flex-1 bg-blue-100 rounded-full py-2"
              >
                <Text className="text-blue-500 text-center text-sm font-semibold">Mark as Visited</Text>
              </TouchableOpacity>
            </View>

            {/* rating tbc*/}
            <View className="flex-row items-center mt-2 mb-4">
              <Text className="text-sm text-green-600 font-bold mr-2">4.0</Text>
              <Text className="text-xs text-gray-500">3847则评论</Text>
            </View>

            {/* 地点信息 */}
            <Text className="text-xs text-gray-600 mb-4">
              {description}
            </Text>

            {/* 交通信息 */}
            <Text className="text-sm font-bold text-gray-700 mb-2">Transportation</Text>
            <Text className="text-sm text-gray-600 mb-4">{transportation}</Text>

            <Text className="text-sm font-bold text-gray-700 mb-2">distance</Text>
            <Text className="text-sm text-gray-600 mb-4">{distance}</Text>

            <Text className="text-sm font-bold text-gray-700 mb-2">Price</Text>
            <Text className="text-sm text-gray-600 mb-4">{estimatedPrice}</Text>

            {/* 简介 */}
            <Text className="text-sm font-bold text-gray-700 mb-2">Description</Text>
            <Text className="text-sm text-gray-600 mb-4">{description}</Text>

            {/* 小贴士部分 */}
            <Text className="text-sm font-bold text-gray-700 mb-2">Tips</Text>
            <Text className="text-sm text-gray-600 mb-4">{tips}</Text>

            {/* close button */}
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-500 rounded-full py-2 mb-4"
            >
              <Text className="text-white text-center text-sm font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ResDetail;
