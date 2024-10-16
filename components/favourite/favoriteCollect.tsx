import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResDetail from '@/components/TravelPlanComponent/ResDetailCard/ResDetail'; // Ensure to import your ResDetail component
import { photoUrlBase } from '@/lib/google-map-api';

export const FavoriteComponent = () => {
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected item's data

  const fetchFavoritesFromApi = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail'); // Step 1
      if (!email) {
        console.log('Email not found');
        return;
      }

      // Get favorite data
      const response = await fetch(`/(api)/favorite?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network wrong');
      }

      const result = await response.json(); // Step 3

      if (!Array.isArray(result)) {
        console.error('Wrong Data:', result);
        return;
      }

      if (result.length === 0) {
        console.log('NO data found');
        return;
      }

      // 更新 state 中的 favorites
      setFavorites(result);
    } catch (error) {
      console.error('Getting favorite Wrong:', error);
    }
  };

  useEffect(() => {
    fetchFavoritesFromApi();
  }, []);

  // 点击按钮的处理函数
  const handleAddFavorite = (item) => {
    console.log('handle detail button:', item);
    setSelectedItem(item); // Set the selected item
    setModalVisible(true); // Open modal
  };

  // 渲染卡片
// 渲染卡片
const renderFavoriteCard = ({ item }) => (
  <View className="bg-white rounded-[12px] p-2 mb-4 shadow-md" style={{ height: 230 }}>
    <Image
      source={{ uri: photoUrlBase + item.photoreference }}
      style={{ width: '100%', height: '60%', borderRadius: 10 }} 
      resizeMode="cover"
    />
    <Text className="text-[18px] font-bold mt-2">{item.transportation}</Text>
    <Text className="text-[14px] mt-1" style={{ color: '#555' }}>
      {item.description}
    </Text>
    <TouchableOpacity
      className="bg-[#fcaac1] rounded-[30px] py-1 px-3 self-end"
      onPress={() => handleAddFavorite(item)}>
      <Text className="text-base font-bold text-white">Detail</Text>
    </TouchableOpacity>
  </View>
);

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

      {/* Modal for ResDetail */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedItem && (
          <ResDetail
            onClose={() => setModalVisible(false)}
            title={selectedItem.title}
            description={selectedItem.description}
            coords={`${selectedItem.templat},${selectedItem.templong}`}
            duration={selectedItem.duration}
            destinationDuration={selectedItem.destinationduration}
            transportation={selectedItem.transportation}
            distance={selectedItem.distance}
            estimatedPrice={selectedItem.estimatedprice}
            photoReference={selectedItem.photoreference}
            tips={'4.7'}
          />
        )}
      </Modal>
    </View>
  );
};

export default FavoriteComponent;
