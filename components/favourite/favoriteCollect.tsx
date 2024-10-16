import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
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

// Inline RatingStars component with full and half-star images
const RatingStars = ({ rating, comments }) => {
  const fullStars = Math.floor(rating); // Number of full stars
  const hasHalfStar = rating % 1 !== 0; // Check if there's a half star
  const stars = [];

  // Add full stars using star.png
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Image
        key={i}
        source={require('@/assets/images/TravelCard/star.png')}
        style={{ width: 15, height: 15 }}
      />
    );
  }

  // Add half star using half_star.png if applicable
  if (hasHalfStar) {
    stars.push(
      <Image
        key={fullStars}
        source={require('@/assets/images/TravelCard/half_star.png')}
        style={{ width: 15, height: 15 }}
      />
    );
  }

  // Add empty stars using Text component to fill up to 5 stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Text key={fullStars + 1 + i} style={{ color: '#FFD700', fontSize: 20 }}>
        ☆
      </Text>
    );
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {stars}
      <Text style={{ marginLeft: 5 }}>{comments} comments</Text>
    </View>
  );
};

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
  const renderFavoriteCard = ({ item }) => (
    <View className="bg-white rounded-[12px] p-2 mb-4 shadow-md" style={{ height: 230 }}>
      <Image
        source={{ uri: photoUrlBase + item.photoreference }}
        style={{ width: '100%', height: '60%', borderRadius: 10 }}
        resizeMode="cover"
      />
      <Text className="text-[18px] font-bold mt-2">{item.transportation || "N/A"}</Text>
      <Text className="text-[14px] mt-1" style={{ color: '#555' }}>
        {item.description || "No description available."}
      </Text>

      {/* Add RatingStars component */}
      <View className="flex-row items-center mt-1 mb-2">
        <RatingStars rating={parseFloat(item.tips) || 0} comments={3000} />
      </View>

      <TouchableOpacity
        style={styles.detailButton} // Applying the external styles
        onPress={() => handleAddFavorite(item)}>
        <Text style={styles.detailButtonText}>Detail</Text>
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
            tips={selectedItem.tips || '4.7'} // Ensure tips are provided
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  detailButton: {
    backgroundColor: '#fcaac1', // Button background color
    borderRadius: 30, // Rounded corners
    paddingVertical: 8, // Equivalent to 'py-1'
    paddingHorizontal: 12, // Equivalent to 'px-3'
    alignSelf: 'flex-end', // Aligns the button to the right
    marginTop: -40, // Adds margin at the top (equivalent to 'mt-2')
  },
  detailButtonText: {
    fontSize: 16, // Text size (equivalent to 'text-base')
    fontWeight: 'bold', // Bold text
    color: '#fff', // White text color
  },
});

export default FavoriteComponent;
