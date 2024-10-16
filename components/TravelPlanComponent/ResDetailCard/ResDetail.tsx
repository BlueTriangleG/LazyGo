import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ResDetailProps = {
  onClose: () => void;
  onFavorite: () => void;
  title: string;
  description: string;
  coords: string;
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
  tips,
}) => {
  const [email, setEmail] = useState<string | null>(null);
  const [tempLat, tempLong] = coords.split(',').map(Number);
  console.log(tempLat);
  console.log(tempLong);

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
      console.error('用户未登录或未获取到 email');
      return;
    }

    const visitedData = {
      email,
      title,
      visit_count: 1, // 永远设置为 1
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
      {/* 透明背景 */}
      <TouchableOpacity
        onPress={onClose} // 点击背景关闭卡片
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        className="absolute inset-0"
      />

      {/* 卡片容器 */}
      <View
        style={{ maxHeight: screenHeight * 0.45 }} // 设置最大高度为屏幕高度的45%
        className="bg-white w-11/12 rounded-2xl overflow-hidden shadow-lg"
      >
        {/* ScrollView 以启用滚动 */}
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* 图片 */}
          <Image
            source={{ uri: 'https://i.pinimg.com/564x/a7/76/fa/a776faacad7abdd153d59d1361ff2680.jpg' }} // 替换为你的图片 URL
            className="w-full h-40"
            resizeMode="cover"
          />

          {/* 标题 */}
          <View className="mt-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
            <Text className="text-sm text-gray-500">道路</Text>

            {/* 收藏和替换按钮 */}
            <View className="flex-row space-x-4 mb-4">
              <TouchableOpacity
                onPress={handleFavorite} // 点击收藏时调用 handleFavorite
                className="flex-1 bg-yellow-500 rounded-full py-2"
              >
                <Text className="text-white text-center text-sm font-semibold">Favorite</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleVisited} // 点击“Mark as Visited”时调用 handleVisited
                className="flex-1 bg-blue-100 rounded-full py-2"
              >
                <Text className="text-blue-500 text-center text-sm font-semibold">Mark as Visited</Text>
              </TouchableOpacity>
            </View>

            {/* 评分部分 */}
            <View className="flex-row items-center mt-2 mb-4">
              <Text className="text-sm text-green-600 font-bold mr-2">4.0</Text>
              <Text className="text-xs text-gray-500">3847则评论</Text>
            </View>

            {/* 地点信息 */}
            <Text className="text-xs text-gray-600 mb-4">
              Kanagawa Pref. Yokohamashi Naka...
            </Text>

            {/* 交通信息 */}
            <Text className="text-sm font-bold text-gray-700 mb-2">交通方式</Text>
            <Text className="text-sm text-gray-600 mb-4">{title}</Text>

            <Text className="text-sm font-bold text-gray-700 mb-2">距离</Text>
            <Text className="text-sm text-gray-600 mb-4">{description}</Text>

            <Text className="text-sm font-bold text-gray-700 mb-2">预估价格</Text>
            <Text className="text-sm text-gray-600 mb-4">{description}</Text>

            {/* 简介 */}
            <Text className="text-sm font-bold text-gray-700 mb-2">简介</Text>
            <Text className="text-sm text-gray-600 mb-4">{description}</Text>

            {/* 小贴士部分 */}
            <Text className="text-sm font-bold text-gray-700 mb-2">小贴士</Text>
            <Text className="text-sm text-gray-600 mb-4">{tips}</Text>

            {/* 关闭按钮 */}
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-500 rounded-full py-2 mb-4"
            >
              <Text className="text-white text-center text-sm font-semibold">关闭</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ResDetail;
