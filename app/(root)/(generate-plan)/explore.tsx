import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native'
import ParallaxScrollView from '@/components/TravelPlanComponent/ParallaxScrollView'
import TravelCard from '@/components/TravelPlanComponent/TravelCard'
import Map from '@/components/TravelPlanComponent/Map'

// main page for travel plan
export default function TabTwoScreen() {
  // 状态来存储当前选择的天数
  const [selectedDay, setSelectedDay] = useState(1)
  const handleAddDestination = () => {
    Alert.alert(
      'Add more destination',
      'Functionality for adding a destination will be implemented here.'
    )
  }

  // 每天的旅行数据
  const travelData = {
    1: [
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
        startLocation: '35.6500,139.7500', // 起点的经纬度
        endLocation: '35.6586,139.7454', // 终点的经纬度 (Tokyo Tower)
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
    2: [
      {
        time: '09:00',
        duration: '1.5h',
        destination: 'Zojoji Temple',
        destinationDescrib: '增上寺，东京著名的佛教寺庙。',
        destinationDuration: '1.5h',
        transportation: 'Bicycle',
        distance: '1.8km',
        estimatedPrice: '2 EUR',
        startLocation: '35.6544,139.7480', // 起点的经纬度 (Shiba Park)
        endLocation: '35.6580,139.7488', // 终点的经纬度 (Zojoji Temple)
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
        startLocation: '35.6580,139.7488', // 起点的经纬度 (Zojoji Temple)
        endLocation: '35.6604,139.7292', // 终点的经纬度 (Roppongi Hills)
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
        startLocation: '35.6604,139.7292', // 起点的经纬度 (Roppongi Hills)
        endLocation: '35.6650,139.7495', // 终点的经纬度 (Atago Shrine)
      },
    ],
  }

  // 每天的坐标数据
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 显示选择天数的选项 */}
      <View style={styles.daySelector}>
        <TouchableOpacity
          style={[
            styles.dayButton,
            selectedDay === 1 && styles.selectedDayButton,
          ]}
          onPress={() => setSelectedDay(1)}>
          <Text style={styles.dayButtonText}>Day 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.dayButton,
            selectedDay === 2 && styles.selectedDayButton,
          ]}
          onPress={() => setSelectedDay(2)}>
          <Text style={styles.dayButtonText}>Day 2</Text>
        </TouchableOpacity>
      </View>

      {/* 在顶部添加 Map */}
      <View style={styles.mapContainer}>
        <Map coords={latData[selectedDay]} />
      </View>

      {/* 显示 Travel Cards */}
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
          {/* 在最后一个卡片后添加文本 */}
          {index === travelData[selectedDay].length - 1 && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddDestination}>
              <Text style={styles.addButtonText}>Add More Destination</Text>
            </TouchableOpacity>
          )}
        </React.Fragment>
      ))}
    </ScrollView>
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
    marginBottom: 20, // 调整地图与列表之间的间距
  },
  homeText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 0,
    fontWeight: 'bold',
    color: '#333', // 可以根据需要调整颜色
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
})
