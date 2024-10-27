import React, { useCallback, useState } from 'react';
import { Text, View, FlatList, StyleSheet, ImageBackground, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { photoUrlBase } from '@/lib/google-map-api';

const History = () => {
  const navigation = useNavigation();
  const [travelHistory, setTravelHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wrappedData, setWrappedData] = useState<{ [key: string]: any } | null>(null);

  function wrapData(inputData: any) {
    return {
      "1": [inputData]
    };
  }

  const images = [
    require('../../../assets/images/TravelCard/his1.jpg'),
    require('../../../assets/images/TravelCard/his2.jpg'),
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const handleCheckDetails = (item) => {
    const { 
      endlocation, 
      destinationdescrib, 
      destinationduration, 
      estimatedprice, 
      startlocation, 
      detailedinfo, 
      photoreference, 
      ...rest 
    } = item;

    const updatedItem = {
      ...rest,
      endLocation: endlocation,
      destinationDescrib: destinationdescrib,
      destinationDuration: destinationduration,
      estimatedPrice: estimatedprice,
      startLocation: startlocation,
      detailedInfo: detailedinfo || '4.7',
      photo_reference: photoreference,
    };

    const wrapped = wrapData(updatedItem);
    setWrappedData(wrapped);

    router.push({
      pathname: '/(root)/(generate-plan)/explore',
      params: { date: 1, plan: JSON.stringify(wrapped), fromHistory: true },
    });
  };

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
      console.error('Getting travel history wrong:', error);
      setError('Error when getting travelHistory');
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect will trigger fetchTravelHistoryFromApi every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Show loading while fetching data
      fetchTravelHistoryFromApi();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
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
              onPress={() => handleCheckDetails(item)}
            >
              <ImageBackground
                source={{ uri: photoUrlBase + item.photoreference }}
                style={styles.cardImageBackground}
                imageStyle={styles.cardImage}
              >
                {/* Wrap destination and location in styled containers */}
                <View style={styles.overlayTextContainer}>
                  <View style={styles.textWrapper}>
                    <Text style={styles.destinationLabel}>{item.destination}</Text>
                  </View>
                  <View style={styles.locationWrapper}>
                    <Icon name="location-outline" size={14} color="white" />
                    <Text style={styles.locationLabel}>Melb</Text>
                  </View>
                </View>
              </ImageBackground>
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
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  cardContainer: {
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardImageBackground: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  cardImage: {
    borderRadius: 15,
  },
  overlayTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  destinationLabel: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationLabel: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5,
  },
  separator: {
    height: 10,
  },
  textWrapper: {
    backgroundColor: 'rgba(2, 48, 71, 0.45)',
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 48, 71, 0.45)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
});

export default History;
