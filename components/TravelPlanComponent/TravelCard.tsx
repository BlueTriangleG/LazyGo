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
      case 'Public':
        return '🚶‍♂️ → 🚆 → 🚶‍♂️'
      case 'Car':
        return '🚗 → 🚦 → 🏁'
      case 'Bicycle':
        return '🚲 → 🌳 → 🏖️'
      case 'Walk':
        return '🚶‍♀️ → 🌳 → 🏞️'
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
            <Text style={styles.location}>{destination}{'\n'}<Text style={styles.departureTime}>{time} 出發</Text></Text>

          </View>

          <Text style={styles.waitTime}>
            步行時長 ({duration}){'\n'}
          </Text>
          <Text style={styles.destinationDescription}>
            {destinationDescrib}
          </Text>
          
          <Text style={styles.destinationDuration}>
            目的地停留時長: {destinationDuration} min
          </Text>

          {/* click show more */}
          <View style={styles.transportInfoContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.transportInfo}>More Detail...</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 其他信息 */}
        <View style={styles.additionalInfoContainer}>
          <Text style={styles.sectionTitle}>公共交通</Text>
          <TouchableOpacity onPress={openGoogleMaps}>
            <Text style={styles.detailedInfo}>点击跳转google map</Text>
          </TouchableOpacity>

          <View style={styles.transportIcons}>
            <Text>
              交通方式: {transportation} / 距離: {distance} / 預估價格:{' '}
              {estimatedPrice}
              {'\n'}
              {renderTransportationIcons()}
            </Text>
          </View>
        </View>
      </View>

      {/* 显示更多信息的模态框 */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
      <ResDetail
        onClose={() => setModalVisible(false)}
        transportation="地铁"
        distance="500米"
        estimatedPrice="¥30"
        description="这是一个很棒的地方。"
        tips="尝试这里的街头小吃！"
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
})

export default TravelCard
