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

  const handleAddFavorite = (item) => {
    console.log('handle detail button:', item);
    setSelectedItem(item); // Set the selected item
    setModalVisible(true); // Open modal
  };

  // fav card
  const renderFavoriteCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: photoUrlBase + item.photoreference }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.titleText}>{item.title || "N/A"}</Text>
      <Text style={styles.descriptionText}>
        {item.description || "No description available."}
      </Text>
  
      {/* Add RatingStars component */}
      <View style={styles.ratingContainer}>
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
  cardContainer: {
    backgroundColor: 'white', // White background
    borderRadius: 12, // Rounded corners
    padding: 8, // Padding (equivalent to 'p-2')
    marginBottom: 16, // Margin at the bottom (equivalent to 'mb-4')
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow radius for iOS
    elevation: 5, // Shadow for Android
    // height: 230, 
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 10, // Rounded corners for image
  },
  titleText: {
    fontSize: 18, // Text size (equivalent to 'text-[18px]')
    fontWeight: 'bold', // Bold font
    marginTop: 8, // Margin at the top (equivalent to 'mt-2')
  },
  descriptionText: {
    fontSize: 14, // Text size (equivalent to 'text-[14px]')
    color: '#555', // Text color (equivalent to style with '#555')
    marginTop: 4, // Margin at the top (equivalent to 'mt-1')
  },
  ratingContainer: {
    flexDirection: 'row', // Align stars in a row
    alignItems: 'center', // Center align items vertically
    marginTop: 4, // Margin at the top (equivalent to 'mt-1')
    marginBottom: 8, // Margin at the bottom (equivalent to 'mb-2')
  },
  detailButton: {
    backgroundColor: '#fcaac1', // Button background color
    borderRadius: 30, // Rounded corners
    paddingVertical: 8, // Vertical padding (equivalent to 'py-1')
    paddingHorizontal: 12, // Horizontal padding (equivalent to 'px-3')
    alignSelf: 'flex-end', // Align button to the right
    marginTop: -40, // Top margin (equivalent to 'mt-2')
  },
  detailButtonText: {
    fontSize: 16, // Text size (equivalent to 'text-base')
    fontWeight: 'bold', // Bold text
    color: '#fff', // White text color
  },
});


export default FavoriteComponent;
