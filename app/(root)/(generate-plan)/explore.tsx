import React, { useState, useEffect } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Modal,
} from 'react-native'
import ParallaxScrollView from '@/components/TravelPlanComponent/ParallaxScrollView'
import TravelCard from '@/components/TravelPlanComponent/TravelCard'
import Map from '@/components/TravelPlanComponent/Map'
import AddMoreRes from '@/components/TravelPlanComponent/AddMoreRes';
import { generatePlan_restaurant } from '@/lib/gpt-plan-generate'

import LottieView from 'lottie-react-native';

import { getCurrentLocation } from '@/lib/location'
import { useLocalSearchParams } from 'expo-router'

export type ExploreProps = {
  date: string
  plan: string
}

// main page for travel plan
export default function TabTwoScreen(props: ExploreProps) {
  const exploreParams: ExploreProps = useLocalSearchParams();

  // store current day
  const [selectedDay, setSelectedDay] = useState(1)
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");

  // Initialize TravelData as an empty array or your expected data structure
  const [travelData, setTravelData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // Animation control state
  const [latData1, setLatData1] = useState({}); // Initialize as an object

  useEffect(() => {
    console.log("Explore page params: date: [", exploreParams.date, "], plan: [", exploreParams.plan, "]");
    
    // Parse travel plan
    const parsedPlan = JSON.parse(exploreParams.plan);
    setTravelData(parsedPlan);
    
    const newLatData1 = {};
    // Extract required information
    for (const [key, travels] of Object.entries(parsedPlan)) {
      newLatData1[key] = travels.map(travel => {
        const [lat, long] = travel.endLocation.split(',').map(Number);
        return {
          lat,
          long,
          title: travel.destination,
          description: travel.destinationDescrib,
        };
      });
    }

    // Update the state with the new lat data
    setLatData1(newLatData1); // Update state with latData1
    if (Object.keys(newLatData1).length > 0) {
      console.log("=====================++++++++++=====================", newLatData1);
      setLoading(false);
    }

    const fetchRestaurantPlan = async () => {
      try {
        let curLocation = await getCurrentLocation();
        if (!curLocation) {
          Alert.alert('Please enable location service');
          return;
        }
        setCurrentLocation(curLocation);
        const result = await generatePlan_restaurant(curLocation, "2024-09-29T23:00:00Z", "driving");
        // Directly store the result in travelData
        setTravelData(result);
      } catch (error) {
        console.error('Error fetching restaurant plan:', error);
      } finally {
        setLoading(false); // Set loading to false when done
        setShowSuccessAnimation(true); // Trigger success animation after loading
      }
    };

    // fetchRestaurantPlan();
  }, []); // Empty dependency array to run once on mount

  const handleAddDestination = () => {
    setModalVisible(true); // show dialog
  };

  const handleAnimationFinish = () => {
    setShowSuccessAnimation(false); // Hide animation after it finishes
  };

  // Render loading indicator if still fetching data
  if (loading) {
    return (
      <ImageBackground
        source={require('../../../assets/images/home.png')} // Ensure this path is correct
        style={styles.backgroundImage}
        resizeMode="cover" // Set the image's resize mode to cover
      >
        <View style={styles.loadingContainer}>
          {/* Replace ActivityIndicator with LottieView */}
          <LottieView
            source={require('../../../assets/animation/animation2.json')} // Ensure this path is correct
            autoPlay
            loop
            style={{ width: 150, height: 150 }} // You can adjust size
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  // landmark lat&long
  const latData = {
    1: [
      {
        lat: 35.6544,
        long: 139.748,
        title: 'Shiba Park',
        description: '芝公园，靠近东京铁塔的大型绿地。',
      },
      {
        lat: 35.6586,
        long: 139.7454,
        title: 'Tokyo Tower',
        description: '东京铁塔',
      },
    ],
    2: [
      {
        lat: 35.658,
        long: 139.7488,
        title: 'Zojoji Temple',
        description: '增上寺，东京著名的佛教寺庙。',
      },
      {
        lat: 35.6604,
        long: 139.7292,
        title: 'Roppongi Hills',
        description: '六本木新城，时尚和文化的中心。',
      },
      {
        lat: 35.665,
        long: 139.7495,
        title: 'Atago Shrine',
        description: '爱宕神社，历史悠久的庙宇和著名的石阶。',
      },
    ],
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Full-Screen Lottie Animation Modal */}
      {showSuccessAnimation && (
        <Modal transparent={false} animationType="fade" visible={showSuccessAnimation}>
          <View style={styles.modalBackground}>
            <LottieView
              source={require('../../../assets/animation/success.json')} // Full-screen success animation path
              autoPlay
              loop={false} // Play the animation once
              onAnimationFinish={handleAnimationFinish} // Hide animation when it finishes
              style={{ width: 300, height: 300 }} // Customize size
            />
          </View>
        </Modal>
      )}

      {/* Regular ScrollView content */}
      {!showSuccessAnimation && ( // Only show content after animation finishes
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.daySelector}>
            <TouchableOpacity
              style={[
                styles.dayButton,
                selectedDay === 1 && styles.selectedDayButton,
              ]}
              onPress={() => setSelectedDay(1)}
            >
              <Text style={styles.dayButtonText}>Day 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dayButton,
                selectedDay === 2 && styles.selectedDayButton,
              ]}
              onPress={() => setSelectedDay(2)}
            >
              <Text style={styles.dayButtonText}>Day 2</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            {console.log("latData1 before passing to Map:", latData1[selectedDay])}
            <Map coords={latData1[selectedDay]} />
          </View>

          {travelData[selectedDay].map((data, index) => (
            <React.Fragment key={index}>
              <TravelCard
                time={data.time}
                duration={data.duration}
                destination={data.destination}
                destinationDescrib={data.destinationDescrib}
                destinationDuration={data.destinationDuration}
                transportation={data.transportation}
                distance={data.distance}
                estimatedPrice={data.estimatedPrice}
                startLocation={data.startLocation}
                endLocation={data.endLocation}
                detailedInfo={''}
              />
              {index === travelData[selectedDay].length - 1 && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddDestination}
                >
                  <Text style={styles.addButtonText}>Add More Destination</Text>
                </TouchableOpacity>
              )}
            </React.Fragment>
          ))}

          <AddMoreRes
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    right: -15,
    width: '92%',
  },
  mapContainer: {
    marginBottom: 20,
  },
  homeText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 0,
    fontWeight: 'bold',
    color: '#333',
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  selectedDayButton: {
    backgroundColor: '#3f51b5',
  },
  dayButtonText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#3f51b5',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
  },
  backgroundImage: {
    flex: 1,
  },
});
