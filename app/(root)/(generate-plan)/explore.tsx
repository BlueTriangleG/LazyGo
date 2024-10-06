import React, { useState,useEffect } from 'react'
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
import {generatePlan_restaurant} from '@/lib/gpt-plan-generate'
import LottieView from 'lottie-react-native';

// main page for travel plan
export default function TabTwoScreen() {
  // store current day
  const [selectedDay, setSelectedDay] = useState(1)
  const [modalVisible, setModalVisible] = useState(false);
  
    // Initialize TravelData as an empty array or your expected data structure
    const [travelData, setTravelData] = useState([]); 
    const [loading, setLoading] = useState(true); // Loading state
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // Animation control state

    useEffect(() => {
      const fetchRestaurantPlan = async () => {
        try {
          const result = await generatePlan_restaurant("-37.8136,144.9631","2024-09-29T23:00:00Z", "driving");
          console.log(JSON.stringify(result));
          
          // Directly store the result in travelData
          setTravelData(result); 
        } catch (error) {
          console.error('Error fetching restaurant plan:', error);
        } finally {
          setLoading(false); // Set loading to false when done
          setShowSuccessAnimation(true); // Trigger success animation after loading
        }
      };
  
      fetchRestaurantPlan();
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
        source={require('../../../assets/images/home.png')} // 确保这里是你图片的正确路径
        style={styles.backgroundImage}
        resizeMode="cover" // 设置图片的适应模式为cover
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

  // demo data
  const travelData1 = {
    "1": [
      {
        time: '08:00',
        duration: '2h',
        destination: 'Tokyo Tower',
        destinationDescrib:
          '東京鐵塔，正式名稱為日本電波塔，是位於日本東京芝公園的一座電波塔。建於1958年。高332.9公尺，是日本第二高的結構物，僅次於東京晴空塔。',
        destinationDuration: '1h',
        transportation: 'Public',
        distance: '3km',
        estimatedPrice: '15 EUR',
        startLocation: '35.6500,139.7500', // start lat, long
        endLocation: '35.6586,139.7454', // end lat long (Tokyo Tower)
      },
      {
        time: '08:00',
        duration: '2h',
        destination: 'Tokyo Tower',
        destinationDescrib:
          '東京鐵塔，正式名稱為日本電波塔，是位於日本東京芝公園的一座電波塔。建於1958年。高332.9公尺，是日本第二高的結構物，僅次於東京晴空塔。',
        destinationDuration: '1h',
        transportation: 'Public',
        distance: '3km',
        estimatedPrice: '15 EUR',
        startLocation: '35.6500,139.7500', // start lat, long
        endLocation: '35.6586,139.7454', // end lat long (Tokyo Tower)
      },
      {
        time: '08:00',
        duration: '2h',
        destination: 'Tokyo Tower',
        destinationDescrib:
          '東京鐵塔，正式名稱為日本電波塔，是位於日本東京芝公園的一座電波塔。建於1958年。高332.9公尺，是日本第二高的結構物，僅次於東京晴空塔。',
        destinationDuration: '1h',
        transportation: 'Public',
        distance: '3km',
        estimatedPrice: '15 EUR',
        startLocation: '35.6500,139.7500', // start lat, long
        endLocation: '35.6586,139.7454', // end lat long (Tokyo Tower)
      },
      {
        time: '10:30',
        duration: '1.5h',
        destination: 'Shiba Park',
        destinationDescrib: '芝公园，靠近东京铁塔的大型绿地。',
        destinationDuration: '2h',
        transportation: 'Car',
        distance: '2.5km',
        estimatedPrice: '3 EUR',
        startLocation: '35.6586,139.7454', // 起点的经纬度 (Tokyo Tower)
        endLocation: '35.6544,139.7480', // 终点的经纬度 (Shiba Park)
      },
    ],
    "2": [
      {
        time: '09:00',
        duration: '1.5h',
        destination: 'Zojoji Temple',
        destinationDescrib: '增上寺，东京著名的佛教寺庙。',
        destinationDuration: '1.5h',
        transportation: 'Bicycle',
        distance: '1.8km',
        estimatedPrice: '2 EUR',
        startLocation: '35.6544,139.7480', 
        endLocation: '35.6580,139.7488', 
      },
      {
        time: '11:00',
        duration: '2h',
        destination: 'Roppongi Hills',
        destinationDescrib: '六本木新城，时尚和文化的中心。',
        destinationDuration: '2h',
        transportation: 'Walk',
        distance: '4km',
        estimatedPrice: '20 EUR',
        startLocation: '35.6580,139.7488', 
        endLocation: '35.6604,139.7292',
      },
      {
        time: '13:00',
        duration: '1h',
        destination: 'Atago Shrine',
        destinationDescrib: '爱宕神社，历史悠久的庙宇和著名的石阶。',
        destinationDuration: '1h',
        transportation: 'Public',
        distance: '1km',
        estimatedPrice: '5 EUR',
        startLocation: '35.6604,139.7292', 
        endLocation: '35.6650,139.7495',
      },
    ],
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
              onAnimationFinish={handleAnimationFinish} // **Change 3: Hide animation when it finishes**
              style={{ width: 300, height: 300 }} // Customize size
            />
          </View>
        </Modal>
      )}

      {/* Regular ScrollView content */}
      {!showSuccessAnimation && ( // **Change 3: Only show content after animation finishes**
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
            <Map coords={latData[selectedDay]} />
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
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1, // 背景图片填充整个屏幕
    justifyContent: 'center', // 让内容居中
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // **Change 2: Set white background for modal**
  },
})