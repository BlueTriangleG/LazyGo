import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import ParallaxScrollView from '../../../components/ParallaxScrollView';
import TravelCard from '../../../components/TravelCard'

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

  return (
    <ParallaxScrollView headerImage={undefined} headerBackgroundColor={{
      dark: '',
      light: ''
    }}>
      <ScrollView style={styles.container}>
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
              // location={data.location}
              // departureTime={data.departureTime}
              // waitTime={data.waitTime}
              // transportInfo={data.transportInfo}
              detailedInfo={''}
            />
            {/* 在最后一个卡片后添加文本 */}
            {index === travelData.length - 1 && (
              <Text style={styles.homeText}>Home Sweet Home</Text>
            )}
          </React.Fragment>
        ))}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    left: -15,
    width: '110%',
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
