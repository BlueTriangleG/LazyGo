import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteComponent = () => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavoritesFromApi = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail'); // step1
      if (!email) {
        console.log('Email not found');
        return;
      }

      // get favorite data
      const response = await fetch(`/(api)/favorite?email=${email}`, { // step2
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network wrong');
      }

      const result = await response.json();//step3

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
  };

  // 渲染卡片
  const renderFavoriteCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.transportation}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity style={styles.cardButton} onPress={() => handleAddFavorite(item)}>
        <Text style={styles.cardButtonText}>Detail</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Favorite💗</Text>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false} 
        scrollEnabled={true} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    height: 100,
    width: 300,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  cardButton: {
    marginTop: 0,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
  },
  cardButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FavoriteComponent;
