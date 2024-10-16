import React, { useState, useRef } from 'react'
import ResDetail from '@/components/TravelPlanComponent/ResDetailCard/ResDetail' // 导入 ResDetail 模态框
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Modal,
} from 'react-native'
import { photoUrlBase } from '@/lib/google-map-api'


type TravelCardProps = {
  time: string
  duration: string
  destination: string
  destinationDescrib: string
  destinationDuration: string
  transportation: string
  distance: string
  estimatedPrice: string
  startLocation: string // 起点经纬度
  endLocation: string // 终点经纬度
  photoReference: string
}

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
  photoReference,
}) => {
  const [lineHeight, setLineHeight] = useState(0)
  const [modalVisible, setModalVisible] = useState(false) // 控制模态框的可见性
  const cardRef = useRef<View>(null)

  const handleCardLayout = () => {
    if (cardRef.current) {
      cardRef.current.measure((x, y, width, height) => {
        const calculatedHeight = height * 0.8
        setLineHeight(calculatedHeight)
      })
    }
  }

  const renderTransportationIcons = () => {
    switch (transportation) {
      case 'Transit':
        return '🚶‍♂️'
      case 'Driving':
        return '🚗 '
      case 'Walking':
        return '🚶‍♀️'
      default:
        return ''
    }
  }

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation}&destination=${endLocation}&travelmode=driving`
    Linking.openURL(url).catch((err) => console.error('An error occurred', err))
  }

  return (
    <View style={styles.container}>
      {/* 左边时间线，带有标记和线 */}
      <View style={styles.timelineContainer}>
        <Image
          source={require('@/assets/images/start.png')}
          style={styles.marker}
        />
        <View style={[styles.line, { height: lineHeight }]}>
          <View style={styles.dashedLine} />
        </View>
      </View>

      {/* 外部卡片 */}
      <View style={styles.outerCard} ref={cardRef} onLayout={handleCardLayout}>
        {/* 内部卡片 */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.location}>{destination}{'\n'}<Text style={styles.departureTime}>Depart at: {time}</Text></Text>
          </View>

          <Text style={styles.waitTime}>
          {/* {renderTransportationIcons()} */}
          Estimated Cost:{' '}{estimatedPrice}

          </Text>
          <Text style={styles.destinationDescription}>
            {destinationDescrib}
          </Text>
          <View style={styles.durationContainer}>
            <Image
              source={require('@/assets/images/TravelCard/time.png')} // 根据你的路径调整
              style={styles.icon}
            />
            <Text style={styles.destinationDuration}>
              Stay Duration: {destinationDuration} min
            </Text>
          </View>

          {/* click show more */}
          <View style={styles.transportInfoContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.transportInfo}>More Detail...</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Info */}
        <View style={styles.additionalInfoContainer}>
          <Text style={styles.sectionTitle}>Navigation Info</Text>
          <TouchableOpacity onPress={openGoogleMaps}>
            <Text style={styles.detailedInfo}>Click to google map</Text>
          </TouchableOpacity>

          <View style={styles.transportIcons}>
            <Text>
              Distance: {distance} / {transportation} ({duration})
            </Text>
          </View>
          <Image
            source={{ uri: photoUrlBase + photoReference }}
            style={{ width: 350, height: 300, borderRadius: 10, marginRight: 10 }}
          />
        </View>
      </View>

      {/* click for more detail */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ResDetail
          onClose={() => setModalVisible(false)}
          title={destination}
          description={destinationDescrib}
          coords={endLocation}
          duration={duration}
          destinationDuration={destinationDuration}
          transportation={transportation}
          distance={distance}
          estimatedPrice={estimatedPrice}
          tips=" "
        />
      </Modal>

    </View>
  )
}

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
    marginBottom: 5,
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
    marginBottom: 0,
  },
  destinationDescription: {
    fontSize: 14,
    color: '#666666',
  },
  transportationInfo: {
    fontSize: 14,
    color: '#555555',
  },
  durationContainer: {
    flexDirection: 'row', // 水平排列图标和文本
    alignItems: 'center', // 垂直居中
  },
  icon: {
    width: 16, // 根据图标大小调整
    height: 16, // 根据图标大小调整
    marginRight: 5, // 图标和文本之间的间距
  },
  destinationDuration: {
    marginTop: 2,
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
})

export default TravelCard
