import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import TravelCard from '@/components/TravelCard';
import Map from '@/components/Map';

// testtest
export default function TabTwoScreen() {
  // Sample travel data
  const travelData = [
    {
      time: '08:00',
      duration: '2h',
      destination: 'XXX restaurant',
      destinationDescrib: '東京鐵塔，正式名稱為日本電波塔，是位於日本東京芝公園的一座電波塔。建於1958年。高332.9公尺，是日本第二高的結構物，僅次於東京晴空塔。',
      destinationDuration: '1h',
      transportation: 'Public',
      distance: '3km',
      estimatedPrice: '15 EUR',
    },
    {
      time: '10:30',
      duration: '1.5h',
      destination: 'XXX restaurant',
      destinationDescrib: 'MuseuLouvre MuseuLouvre MuseuLouvre Museum',
      destinationDuration: '2h',
      transportation: 'Car',
      distance: '2.5km',
      estimatedPrice: '3 EUR',
    },
    {
      time: '09:00',
      duration: '1.5h',
      destination: 'XXX restaurant',
      destinationDescrib: 'Notre Dame',
      destinationDuration: '1.5h',
      transportation: 'Bicycle',
      distance: '1.8km',
      estimatedPrice: '2 EUR',
    },
    {
      time: '11:00',
      duration: '2h',
      destination: 'XXX restaurant',
      destinationDescrib: 'Montmartre',
      destinationDuration: '2h',
      transportation: 'Walk',
      distance: '4km',
      estimatedPrice: '20 EUR',
    },
    // Add more activities as needed
  ];

  const latData = [
    {
      lat: 35.6544,
      long: 139.7480,
      "title": "Shiba Park",
      "description": "芝公园，靠近东京铁塔的大型绿地。"
    },
    {
      lat:35.6586,
      long:139.7454,
      title:'tokyo tower',
      description:"东京铁塔",
    },
    {
      lat: 35.6580,
      long: 139.7488,
      "title": "Zojoji Temple",
      "description": "增上寺，东京著名的佛教寺庙。"
    },
    {
      lat: 35.6604,
      long: 139.7292,
      "title": "Roppongi Hills",
      "description": "六本木新城，时尚和文化的中心。"
    },
    {
      lat: 35.6650,
      long: 139.7495,
      "title": "Atago Shrine",
      "description": "爱宕神社，历史悠久的庙宇和著名的石阶。"
    },
  
  ];

  return (
      <ScrollView style={styles.container}>
        {/* 在顶部添加 Map */}
        <View style={styles.mapContainer}>
          <Map coords={latData}/>
        </View>

        {/* 显示 Travel Cards */}
        {travelData.map((data, index) => (
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
              detailedInfo={''}
            />
            {/* 在最后一个卡片后添加文本 */}
            {index === travelData.length - 1 && (
              <Text style={styles.homeText}>Home Sweet Home</Text>
            )}
          </React.Fragment>
        ))}
      </ScrollView>
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
    marginBottom: 20, // 调整地图与列表之间的间距
  },
  homeText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 0,
    fontWeight: 'bold',
    color: '#333', // 可以根据需要调整颜色
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
});
