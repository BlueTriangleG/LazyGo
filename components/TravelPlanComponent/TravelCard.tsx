import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';

type TravelCardProps = {
  time: string;
  duration: string;
  destination: string;
  destinationDescrib: string;
  destinationDuration: string;
  transportation: string;
  distance: string;
  estimatedPrice: string;
  startLocation: string; // 起点经纬度
  endLocation: string;   // 终点经纬度
};

const TravelCard: React.FC<TravelCardProps> = ({
  time,
  duration,
  destination,
  destinationDescrib,
  destinationDuration,
  transportation,
  distance,
  estimatedPrice,
  startLocation,
  endLocation,
}) => {
  const [lineHeight, setLineHeight] = useState(0);
  const cardRef = useRef<View>(null);

  const handleCardLayout = () => {
    if (cardRef.current) {
      cardRef.current.measure((x, y, width, height) => {
        const calculatedHeight = height * 0.8; 
        setLineHeight(calculatedHeight);
      });
    }
  };

  const renderTransportationIcons = () => {
    switch (transportation) {
      case 'Public':
        return '🚶‍♂️ → 🚆 → 🚶‍♂️';
      case 'Car':
        return '🚗 → 🚦 → 🏁';
      case 'Bicycle':
        return '🚲 → 🌳 → 🏖️';
      case 'Walk':
        return '🚶‍♀️ → 🌳 → 🏞️';
      default:
        return '';
    }
  };

  // 打开 Google Maps 的函数，包含起点和终点
  const openGoogleMaps = () => {
    // // 设置起点和终点
    console.log("Start Point:", startLocation);
    console.log("End Point:", endLocation);
    // const startPoint = "35.6544,139.7480"; // 您的起点坐标
    // const endPoint = "35.6586,139.7454";   // 您的终点坐标
    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation}&destination=${endLocation}&travelmode=driving`; // 可以根据需要更改travelmode
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      {/* Left timeline with a marker and line */}
      <View style={styles.timelineContainer}>
        <Image
          source={require('@/assets/images/start.png')}
          style={styles.marker}
        />
        <View style={[styles.line, { height: lineHeight }]}>
          <View style={styles.dashedLine} />
        </View>
      </View>

      {/* Outer card */}
      <View style={styles.outerCard} ref={cardRef} onLayout={handleCardLayout}>
        {/* Inner card */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.location}>{destination}</Text>
            <Text style={styles.departureTime}>{time} 出發</Text>
          </View>

          <Text style={styles.waitTime}>步行時長 ({duration}){"\n"}</Text>
          <Text style={styles.destinationDescription}>{destinationDescrib}</Text>
          <Text style={styles.transportationInfo}>
            交通方式: {transportation} / 距離: {distance} / 預估價格: {estimatedPrice}
          </Text>
          <Text style={styles.destinationDuration}>
            目的地停留時長: {destinationDuration}
          </Text>

          <View style={styles.transportInfoContainer}>
            <Text style={styles.transportInfo}>更多交通信息...</Text>
          </View>
        </View>

        {/* Additional info section */}
        <View style={styles.additionalInfoContainer}>

            <Text style={styles.sectionTitle}>公共交通</Text>
          <TouchableOpacity onPress={openGoogleMaps}>
          <Text style={styles.detailedInfo}>点击跳转google map</Text>
          </TouchableOpacity>          

          <View style={styles.transportIcons}>
            <Text>
              交通方式: {transportation} / 距離: {distance} / 預估價格: {estimatedPrice}
              {"\n"}{renderTransportationIcons()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '91%',
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: -15,
    position: 'relative',
  },
  marker: {
    top: 50,
    width: 20,
    height: 20,
    zIndex: 1,
    marginBottom: 6,
  },
  line: {
    position: 'absolute',
    top: 100,
    width: 2,
  },
  dashedLine: {
    borderLeftWidth: 2,
    borderLeftColor: '#222222',
    height: '95%',
    borderStyle: 'dashed',
  },
  outerCard: {
    padding: 0,
    margin: 15,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  departureTime: {
    fontSize: 16,
    color: '#666666',
  },
  waitTime: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 10,
  },
  destinationDescription: {
    fontSize: 14,
    color: '#666666',
  },
  transportationInfo: {
    fontSize: 14,
    color: '#555555',
  },
  destinationDuration: {
    fontSize: 14,
    color: '#555555',
  },
  transportInfoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  transportInfo: {
    fontSize: 14,
    color: '#000000',
  },
  additionalInfoContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailedInfo: {
    fontSize: 14,
    color: '#023e8a',
    marginBottom: 5,
  },
  transportIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
});

export default TravelCard;
