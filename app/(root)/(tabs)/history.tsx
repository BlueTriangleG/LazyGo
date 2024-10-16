import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, ImageBackground, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // 引入图标库
import { useNavigation } from '@react-navigation/native'; // 引入 useNavigation 钩子
import { router } from 'expo-router';

const History = () => {
  const navigation = useNavigation(); // 获取导航对象
  const [travelHistory, setTravelHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const [travels, setTravels] = useState([]);


  const images = [
    require('../../../assets/images/TravelCard/his1.jpg'),
    require('../../../assets/images/TravelCard/his2.jpg'),
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };


  // 处理跳转和参数传递
  const handleCheckDetails = (item) => {
    console.log("+++++++++++",item);
    router.push({
      pathname: '/(root)/(generate-plan)/detail', // 跳转到目标页面
      params: {
        id: item.id,
        duration: item.duration,
        destination: item.destination,
        destinationDescrib: item.destinationdescrib,
        destinationDuration: item.destinationDuration,
        transportation: item.transportation,
        distance: item.distance,
        estimatedPrice: item.estimatedprice,
        startLocation: item.startlocation,
        endLocation: item.endlocation,
        detailedInfo: item.detailedinfo || '4.2',
        email: item.email,
      },
    });
  };

  useEffect(() => {
    const fetchTravelHistoryFromApi = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) {
          console.log('Email not found');
          return;
        }

        const response = await fetch(`/(api)/TravelHistory?email=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network wrong');
        }

        const result = await response.json();
        console.log("history.tsx=========",result);
        if (!Array.isArray(result)) {
          console.error('Wrong Data:', result);
          return;
        }

        if (result.length === 0) {
          console.log('NO data found');
          return;
        }

        setTravelHistory(result);
      } catch (error) {
        console.error('Getting travel history Wrong:', error);
        setError('获取旅行历史记录时出错');
      } finally {
        setLoading(false);
      }
    };

    fetchTravelHistoryFromApi();

  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>加载中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require('../../../assets/images/yellow.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} /> 
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Travel History</Text>
        <FlatList
          data={travelHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.cardContainer}
              onPress={() => handleCheckDetails(item)} // 点击时跳转并传递数据
            >
              <Image 
                source={require('../../../assets/images/TravelCard/his1.jpg')}
                style={styles.cardImage} 
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>目的地: {item.destination}</Text>
                <Text style={styles.cardDescription}>描述: {item.destinationdescrib}</Text>
              </View>
              <Icon name="chevron-forward" size={24} color="#333" style={styles.arrowIcon} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center', // 垂直居中对齐
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: '#777',
  },
  arrowIcon: {
    marginLeft: 10, // 箭头与文本之间的间距
  },
  separator: {
    height: 10,
  },
});

export default History;