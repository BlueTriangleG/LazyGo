import React, { useState, useEffect } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from 'react-native'
import TravelCard from '@/components/TravelPlanComponent/TravelCard'
import Map from '@/components/TravelPlanComponent/Map'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LottieView from 'lottie-react-native'

import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import SuccessPopup from '@/components/favourite/successPopup'
export type ExploreProps = {
  date: string
  plan: string
}

// main page for travel plan
export default function TabTwoScreen(props: ExploreProps) {
  const exploreParams: ExploreProps = useLocalSearchParams()
  // store current day
  const [selectedDay, setSelectedDay] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<string>('')

  // Initialize TravelData as an empty array or your expected data structure
  const [travelData, setTravelData] = useState([])
  const [loading, setLoading] = useState(true) // Loading state
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false) // Animation control state
  const [latData1, setLatData1] = useState({}) // Initialize as an object
  const [email, setEmail] = useState<string | null>(null)

  const [isFromHistory, setIsFromHistory] = useState<boolean>(false)

  useEffect(() => {
    // console.log("Explore page params: date: [", exploreParams.date, "], plan: [", exploreParams.plan, "]");
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail')
      if (storedEmail) {
        setEmail(storedEmail)
      }
      fetchEmail()
    }

    fetchEmail()
    // Parse travel plan
    const parsedPlan = JSON.parse(exploreParams.plan)
    setTravelData(parsedPlan)
    console.log('explore.tsx++++++=======++++++++', parsedPlan)
    setIsFromHistory(!!exploreParams.fromHistory)
    const newLatData1 = {}
    // Extract required information
    for (const [key, travels] of Object.entries(parsedPlan)) {
      newLatData1[key] = travels.map((travel) => {
        const [lat, long] = travel.endLocation.split(',').map(Number)
        return {
          lat,
          long,
          title: travel.destination,
          description: travel.destinationDescrib,
        }
      })
    }

    // Update the state with the new lat data
    setLatData1(newLatData1) // Update state with latData1
    if (Object.keys(newLatData1).length > 0) {
      setLoading(false)
    }
  }, []) // Empty dependency array to run once on mount

  const handleAddDestination = () => {
    setModalVisible(true) // show dialog
  }

  const handleAnimationFinish = () => {
    setShowSuccessAnimation(false) // Hide animation after it finishes
  }

  const addToHistory = async (data) => {
    const success = await handleTravelHistory(data)
    if (success) {
      setShowSuccessAnimation(true)
    } else {
      console.error('Failed to save plan')
      // 你可以在这里添加一个错误提示给用户
    }
  }

  const handleTravelHistory = async (data) => {
    if (!email) {
      console.error('No Email Found')
      return false
    }

    const travelData = {
      duration: data.duration,
      destination: data.destination,
      destinationDescrib: data.destinationDescrib,
      destinationDuration: data.destinationDuration,
      transportation: data.transportation,
      distance: data.distance,
      estimatedPrice: data.estimatedPrice,
      startLocation: data.startLocation,
      endLocation: data.endLocation,
      detailedInfo: data.detailedInfo || '4.7',
      user_ratings_total: data.user_ratings_total,
      photoReference: data.photo_reference,
      // rating: data.rating || '4.7',
      email,
    }

    // TravelHistory Database
    try {
      const response = await fetch('/(api)/TravelHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(travelData),
      })

      const result = await response.json()
      if (response.ok) {
        console.log('Travel history added:', result)
        return true
      } else {
        console.error('Travel history failed:', result)
        return false
      }
    } catch (error) {
      console.error('Wrong request:', error)
      return false
    }
  }

  // Render loading indicator if still fetching data
  if (loading) {
    return (
      <ImageBackground
        source={require('../../../assets/images/background.png')} // Ensure this path is correct
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
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Full-Screen Lottie Animation Modal */}
      {showSuccessAnimation && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showSuccessAnimation}>
          <View style={styles.modalBackground}>
            <LottieView
              source={require('../../../assets/animation/success2.json')}
              autoPlay
              loop={false}
              onAnimationFinish={handleAnimationFinish}
              style={{ width: 100, height: 100 }}
            />
          </View>
        </Modal>
      )}

      {/* Regular ScrollView content */}
      {!showSuccessAnimation && ( // Only show content after animation finishes
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          {/* <View style={styles.daySelector}>
            <TouchableOpacity
              style={[
                styles.dayButton,
                selectedDay === 1 && styles.selectedDayButton,
              ]}
              onPress={() => setSelectedDay(1)}>
              <Text style={styles.dayButtonText}>Day 1</Text>
            </TouchableOpacity>
          </View> */}

          <View style={styles.mapContainer}>
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
                photoReference={data.photo_reference}
                detailedInfo={data.detailedinfo}
                rating={data.rating}
                user_ratings_total={data.user_ratings_total}
              />

              {index === travelData[selectedDay].length - 1 &&
                !isFromHistory && (
                  <>
                    <TouchableOpacity
                      style={styles.addButton}
                      className="mx-3"
                      onPress={() => addToHistory(data)} // call addToHistory
                    >
                      <Text style={styles.addButtonText}>Save Plan</Text>
                    </TouchableOpacity>
                  </>
                )}
              {showSuccessAnimation && (
                <SuccessPopup onHide={() => setShowSuccess(false)} />
              )}
            </React.Fragment>
          ))}
          {/* {isFromHistory && <NFCControl />} */}
        </ScrollView>
      )}
    </SafeAreaView>
  )
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
})
